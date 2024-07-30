import { FacilityType, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';

const prisma = new PrismaClient();

const csvData = [];

function expandDayRange(dayString) {
  const dayRanges = dayString.split('/');
  const expandedDays = [];
  for (const dayRange of dayRanges) {
    const [startDay, endDay] = dayRange.split('-');
    if (startDay && endDay) {
      const startDayNum = dayToNumber(startDay);
      const endDayNum = dayToNumber(endDay);
      for (let i = startDayNum; i <= endDayNum; i++) {
        expandedDays.push(numberToDay(i));
      }
    } else {
      expandedDays.push(dayRange);
    }
  }
  return expandedDays.join('/');
}

function expandTimeRange(timeRangeString) {
  const timeRanges = timeRangeString.split('/');
  const expandedTimes = [];
  for (const timeRange of timeRanges) {
    const [startTimeStr, endTimeStr] = timeRange.split('-');
    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);
    for (let i = startTime; i <= endTime; i++) {
      expandedTimes.push(i);
    }
  }

  return [...new Set(expandedTimes)];
}

function parseTime(timeString) {
  const [timeStr, amPm] = timeString.match(/(\d+)(\w\w)/).slice(1, 3);
  const hour = parseInt(timeStr);
  const isPM = amPm === 'PM' && hour !== 12;
  return (hour % 12) + (isPM ? 12 : 0);
}

function dayToNumber(day) {
  const daysMap = { Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6, Su: 7 };
  return daysMap[day];
}

function numberToDay(dayNumber) {
  const daysMap = ['', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  return daysMap[dayNumber];
}

function parseOpeningHours(timeString) {
  const openDayTime = {};
  let phrase = timeString.split(';');
  // ['Mo-Fr:7AM-8AM/10AM-11AM/12PM-1PM']
  phrase.forEach((p) => {
    let [weekdays, times] = p.split(':');
    weekdays = expandDayRange(weekdays)
      .split('/')
      .map((p) => {
        return dayToNumber(p);
      });
    // weekdays: [1, 2, 3, 4]
    times = expandTimeRange(times);
    weekdays.forEach((w) => {
      if (openDayTime[w]) {
        openDayTime[w].concat(times);
      } else {
        openDayTime[w] = times;
      }
    });
  });

  return openDayTime;
}

function convertToDateTime(dateTimeString) {
  if (dateTimeString.trim() === '') {
    return null;
  }

  const dateOnlyFormat = /^\d{8}$/;
  if (dateOnlyFormat.test(dateTimeString)) {
    const year = parseInt(dateTimeString.slice(0, 4));
    const month = parseInt(dateTimeString.slice(4, 6)) - 1; // Months are 0-indexed
    const day = parseInt(dateTimeString.slice(6, 8));
    return new Date(year, month, day);
  }

  const dateTimeFormat =
    /^(\d{2})\/(\d{2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) ([AP]M)$/;
  const match = dateTimeString.match(dateTimeFormat);
  if (match) {
    const [, month, day, year, hour, minute, second, ampm] = match.map(Number);
    const isPM = ampm === 'PM' && hour !== 12;
    return new Date(
      year,
      month - 1,
      day,
      (hour % 12) + (isPM ? 12 : 0),
      minute,
      second,
    );
  }
  return null;
}

const getCSVData = () => {
  fs.createReadStream(
    path.resolve(__dirname, '../assets', 'Mobile_Food_Facility_Permit.csv'),
  )
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', async (row) => {
      const [latString, lonString] = row.Location.slice(1, -1).split(', ');
      const latitude = parseFloat(latString);
      const longitude = parseFloat(lonString);
      let openDaysTime = null;
      if (row.dayshours != '') {
        openDaysTime = parseOpeningHours(row.dayshours);
      }

      const facilityType = row.FacilityType == 'Truck' ? 'TRUCK' : 'PUSH_CART';

      await prisma.foodTrucks.create({
        data: {
          locationId: Number(row.locationid),
          applicant: row.Applicant,
          facilityType: facilityType,
          cnn: Number(row.cnn),
          locationDescription: row.LocationDescription,
          address: row.Address,
          blocklot: Number(row.blocklot),
          block: Number(row.block),
          lot: Number(row.lot),
          permit: row.permit,
          status: row.Status,
          foodItems: row.FoodItems,
          x: parseFloat(row.X),
          y: parseFloat(row.Y),
          latitude: latitude,
          longitude: longitude,
          openDaysTime: openDaysTime,
          approved_at: convertToDateTime(row.Approved),
          received: convertToDateTime(row.Received),
          priorPermit: Number(row.PriorPermit),
          expirationAt: convertToDateTime(row.ExpirationDate),
          firePreventionDistricts: Number(row['Fire Prevention Districts']),
          policeDistricts: Number(row['Police Districts']),
          supervisorDistricts: Number(row['Supervisor Districts']),
          zipCodes: Number(row['Zip Codes']),
          oldNeighborhoods: Number(row['Neighborhoods (old)']),
        },
      });
    })
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
};

async function main() {
  await getCSVData();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
