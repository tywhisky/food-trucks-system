import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/trucks")
  getTrucks(@Query() query): any {
    console.log(query)
      return this.appService.getTrucks(query);
  }
}
