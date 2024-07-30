-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'REQUESTED', 'EXPIRED', 'SUSPEND', 'ONLINE', 'ISSUED');

-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('TRUCK', 'PUSH_CART');

-- CreateTable
CREATE TABLE "FoodTrucks" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER,
    "applicant" TEXT,
    "facilityType" "FacilityType",
    "cnn" INTEGER,
    "locationDescription" TEXT,
    "address" TEXT,
    "blocklot" INTEGER,
    "block" INTEGER,
    "lot" INTEGER,
    "permit" TEXT,
    "status" "Status",
    "foodItems" TEXT,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "openDaysTime" JSONB,
    "approved_at" TIMESTAMP(3),
    "received" TIMESTAMP(3),
    "priorPermit" INTEGER,
    "expirationAt" TIMESTAMP(3),
    "firePreventionDistricts" INTEGER,
    "policeDistricts" INTEGER,
    "supervisorDistricts" INTEGER,
    "zipCodes" INTEGER,
    "oldNeighborhoods" INTEGER,

    CONSTRAINT "FoodTrucks_pkey" PRIMARY KEY ("id")
);
