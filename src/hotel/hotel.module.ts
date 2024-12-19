import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { GeminiService } from './gemini.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AIConfigService } from '../config/ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Hotel } from './entities/hotel.entity';
import { HotelInfo } from './entities/hotel-info.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { SalesScript } from './entities/sales-script.entity';
import { RoomService } from './services/room.service';
import { SalesScriptService } from './services/sales-script.service';
import { RoomController } from './controllers/room.controller';
import { SalesScriptController } from './controllers/sales-script.controller';
import { SeedService } from './services/seed.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    TypeOrmModule.forFeature([Hotel, HotelInfo, Room, Conversation, Message, SalesScript]),
  ],
  controllers: [
    HotelController,
    ConversationController,
    RoomController,
    SalesScriptController,
  ],
  providers: [
    HotelService,
    ConversationService,
    GeminiService,
    AIConfigService,
    RoomService,
    SalesScriptService,
    SeedService,
  ],
  exports: [HotelService, ConversationService, GeminiService],
})
export class HotelModule {}
