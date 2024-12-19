import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { GeminiService } from './gemini.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AIConfigService } from './ai-config.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule
  ],
  controllers: [
    HotelController,
    ConversationController
  ],
  providers: [
    HotelService,
    ConversationService,
    GeminiService,
    AIConfigService
  ],
  exports: [
    HotelService,
    ConversationService
  ]
})
export class HotelModule {}
