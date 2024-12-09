// backend/src/scripts/scripts.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScriptsService {
  constructor(private prisma: PrismaService) {}

  async getSalesScripts() {
    try {
      const scripts = await this.prisma.salesScript.findMany({
        where: { active: true }
      });
      return {
        success: true,
        data: scripts
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createSalesScript(data: any) {
    try {
      const script = await this.prisma.salesScript.create({ data });
      return {
        success: true,
        data: script
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateSalesScript(id: number, data: any) {
    try {
      const script = await this.prisma.salesScript.update({
        where: { id },
        data
      });
      return {
        success: true,
        data: script
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}