import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesScriptService } from '../services/sales-script.service';
import { CreateSalesScriptDto, UpdateSalesScriptDto } from '../dto/sales-script.dto';

@Controller('hotel/sales-scripts')
export class SalesScriptController {
  constructor(private readonly salesScriptService: SalesScriptService) {}

  @Get()
  findAll() {
    return this.salesScriptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesScriptService.findOne(+id);
  }

  @Post()
  create(@Body() createSalesScriptDto: CreateSalesScriptDto) {
    return this.salesScriptService.create(createSalesScriptDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesScriptDto: UpdateSalesScriptDto) {
    return this.salesScriptService.update(+id, updateSalesScriptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesScriptService.remove(+id);
  }
}
