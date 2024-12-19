import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from './common/interfaces/api-response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): ApiResponse<string> {
    return {
      status: 'success',
      data: this.appService.getHello()
    };
  }
}
