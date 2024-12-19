import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { Room } from '../entities/room.entity';

@Controller('hotel/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Room> {
    return this.roomService.findOne(+id);
  }

  @Post()
  create(@Body() createRoomDto: Partial<Room>): Promise<Room> {
    return this.roomService.create(createRoomDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: Partial<Room>): Promise<Room> {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.roomService.remove(+id);
  }
}
