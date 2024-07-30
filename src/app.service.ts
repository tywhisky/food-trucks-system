import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getTrucks(params): Promise<any> {
    const result = prisma.foodTrucks.findMany({
      take: Number(params.take),
      skip: Number(params.skip),
      orderBy: {
        id: 'asc'
      }
    })

    return result
  }
}
