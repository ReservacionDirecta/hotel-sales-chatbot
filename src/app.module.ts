import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ScriptsModule } from './scripts/scripts.module';
import { SettingsModule } from './settings/settings.module';
import { HotelModule } from './hotel/hotel.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigModule as CustomConfigModule } from './config/config.module';
import * as path from 'path';

const configuration = () => ({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyAFSUAHeI5pUX8AspIFFqlGZtUa5jTD0i4',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db'
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      load: [configuration],
    }),
    CustomConfigModule,
    PrismaModule,
    HotelModule,
    WhatsappModule,
    ChatbotModule,
    ScriptsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
