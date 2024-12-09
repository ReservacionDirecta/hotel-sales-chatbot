import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatbotModule } from '../chatbot/chatbot.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    PrismaModule,
    ChatbotModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService]
})
export class WhatsappModule {}
