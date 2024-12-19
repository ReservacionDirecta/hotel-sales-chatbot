import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.settings.findFirst();
    return settings;
  }

  async updateSettings(updateSettingsDto: any) {
    const settings = await this.prisma.settings.findFirst();
    if (settings) {
      return this.prisma.settings.update({
        where: { id: settings.id },
        data: updateSettingsDto,
      });
    }
    return this.prisma.settings.create({
      data: updateSettingsDto,
    });
  }
}
