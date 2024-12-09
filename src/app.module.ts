import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ScriptsModule } from './scripts/scripts.module';
import { SettingsModule } from './settings/settings.module';
import { HotelModule } from './hotel/hotel.module';

@Module({
  imports: [
    PrismaModule,
    WhatsappModule,
    ChatbotModule,
    ScriptsModule,
    SettingsModule,
    HotelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
