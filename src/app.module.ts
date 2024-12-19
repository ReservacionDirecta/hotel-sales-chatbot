import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigModule as CustomConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsModule } from './conversations/conversations.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { ScriptsModule } from './scripts/scripts.module';
import { SettingsModule } from './settings/settings.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { HotelModule } from './hotel/hotel.module';
import { Conversation } from './hotel/entities/conversation.entity';
import { Message } from './hotel/entities/message.entity';
import { Hotel } from './hotel/entities/hotel.entity';
import { Room } from './hotel/entities/room.entity';
import { ValidationMiddleware } from './common/middleware/validation.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'sqlite',
        database: 'hotel.db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // Only for development
        logging: true,
      }),
    }),
    CustomConfigModule,
    PrismaModule,
    WhatsappModule,
    ChatbotModule,
    ScriptsModule,
    SettingsModule,
    ConversationsModule,
    HotelModule,
  ],
  controllers: [AppController],
  providers: [AppService, ValidationMiddleware],
})
export class AppModule { }
