import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  async getHotel() {
    return this.hotelService.getHotel();
  }

  @Get('rooms')
  async getRooms() {
    return this.hotelService.getRooms();
  }

  @Get('rooms/available')
  async getAvailableRooms(@Query('date') date: string) {
    return this.hotelService.getAvailableRooms(date);
  }

  @Get('conversations')
  async getConversations() {
    return this.hotelService.getConversations();
  }

  @Post('rooms')
  async createRoom(@Body() roomData: CreateRoomDto) {
    return this.hotelService.createRoom(roomData);
  }

  @Patch('rooms/:id')
  async updateRoom(@Param('id') id: string, @Body() roomData: UpdateRoomDto) {
    return this.hotelService.updateRoom(parseInt(id), roomData);
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string) {
    return this.hotelService.getConversation(parseInt(id));
  }

  @Get('scripts')
  async getSalesScripts() {
    return this.hotelService.getSalesScripts();
  }

  @Post('scripts')
  async createSalesScript(@Body() scriptData: any) {
    return this.hotelService.createSalesScript(scriptData);
  }

  @Patch('scripts/:id')
  async updateSalesScript(@Param('id') id: string, @Body() scriptData: any) {
    return this.hotelService.updateSalesScript(parseInt(id), scriptData);
  }
}
