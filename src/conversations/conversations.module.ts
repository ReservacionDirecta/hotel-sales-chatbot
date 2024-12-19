import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ConversationsGateway } from './conversations.gateway';
import { ChatbotModule } from '../chatbot/chatbot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    WhatsappModule,
    ChatbotModule
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsGateway],
  exports: [ConversationsService],
})
export class ConversationsModule {}
