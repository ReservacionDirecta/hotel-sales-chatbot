import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.settings.findFirst();
    return settings;
  }

  async updateSettings(updateSettingsDto: UpdateSettingsDto) {
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
