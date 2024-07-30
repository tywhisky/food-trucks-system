import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getTrucks(params): Promise<any> {
    const take = Number(params.take)
    const skip = Number(params.skip)

    const [count, list] = await prisma.$transaction([
      prisma.foodTrucks.count(),
      prisma.foodTrucks.findMany({
      take: take,
      skip: skip,
      orderBy: {
        id: 'asc'
      }
    })
  ])
  return {totalPage: Math.floor(count / take), list: list}
}
}
