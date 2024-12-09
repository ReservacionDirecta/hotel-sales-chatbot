import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ChatbotService, PrismaService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
