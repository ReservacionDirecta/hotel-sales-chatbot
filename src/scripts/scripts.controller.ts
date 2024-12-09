// backend/src/scripts/scripts.controller.ts
import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ScriptsService } from './scripts.service';

@Controller('hotel/sales-scripts')
export class ScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @Get()
  async getSalesScripts() {
    return this.scriptsService.getSalesScripts();
  }

  @Post()
  async createSalesScript(@Body() data: any) {
    return this.scriptsService.createSalesScript(data);
  }

  @Put(':id')
  async updateSalesScript(
    @Param('id', ParseIntPipe) id: number, 
    @Body() data: any
  ) {
    return this.scriptsService.updateSalesScript(id, data);
  }
}   