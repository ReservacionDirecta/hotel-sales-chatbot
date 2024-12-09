import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelService {
  constructor(private readonly prisma: PrismaService) {}

  async getHotel() {
    return this.prisma.hotel.findFirst({
      include: { rooms: true }
    });
  }

  async getRooms() {
    return this.prisma.room.findMany();
  }

  async getAvailableRooms(date: string) {
    return this.prisma.room.findMany({
      where: { available: true }
    });
  }

  async createRoom(roomData: any) {
    return this.prisma.room.create({
      data: roomData
    });
  }

  async updateRoom(id: number, roomData: any) {
    return this.prisma.room.update({
      where: { id },
      data: roomData
    });
  }

  async getConversations(status?: string) {
    return this.prisma.conversation.findMany({
      where: status ? { status } : undefined,
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getConversation(id: number) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });
  }

  async getSalesScripts() {
    return this.prisma.salesScript.findMany({
      orderBy: { type: 'asc' }
    });
  }

  async createSalesScript(scriptData: any) {
    return this.prisma.salesScript.create({
      data: scriptData
    });
  }

  async updateSalesScript(id: number, scriptData: any) {
    return this.prisma.salesScript.update({
      where: { id },
      data: scriptData
    });
  }
}
