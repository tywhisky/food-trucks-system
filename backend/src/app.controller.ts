import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

export interface TrucksQueryType {
  take: string;
  skip: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/trucks")
  getTrucks(@Query() query: TrucksQueryType): any {
    return this.appService.getTrucks(query);
  }
}
