import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelService {
  constructor(private readonly prisma: PrismaService) {}

  async getHotel() {
    const hotel = await this.prisma.hotel.findFirst({
      include: { rooms: true }
    });
    return {
      success: true,
      data: hotel || {}
    };
  }

  async getRooms() {
    const rooms = await this.prisma.room.findMany();
    return {
      success: true,
      data: rooms || []
    };
  }

  async getAvailableRooms(date: string) {
    const rooms = await this.prisma.room.findMany({
      where: { available: true }
    });
    return {
      success: true,
      data: rooms || []
    };
  }

  async createRoom(roomData: any) {
    const room = await this.prisma.room.create({
      data: roomData
    });
    return {
      success: true,
      data: room
    };
  }

  async updateRoom(id: number, roomData: any) {
    const room = await this.prisma.room.update({
      where: { id },
      data: roomData
    });
    return {
      success: true,
      data: room
    };
  }

  async getConversations(status?: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: status ? { status } : undefined,
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return {
      success: true,
      data: conversations || []
    };
  }

  async getConversation(id: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });
    return {
      success: true,
      data: conversation || {}
    };
  }

  async getSalesScripts() {
    const scripts = await this.prisma.salesScript.findMany({
      where: { active: true }
    });
    return {
      success: true,
      data: scripts || []
    };
  }

  async createSalesScript(scriptData: any) {
    const script = await this.prisma.salesScript.create({
      data: scriptData
    });
    return {
      success: true,
      data: script
    };
  }

  async updateSalesScript(id: number, scriptData: any) {
    const script = await this.prisma.salesScript.update({
      where: { id },
      data: scriptData
    });
    return {
      success: true,
      data: script
    };
  }
}
