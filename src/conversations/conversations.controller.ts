import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('api/hotel/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async getConversations(@Query() query: any): Promise<any> {
    const conversations = await this.conversationsService.getConversations();
    return {
      success: true,
      data: conversations,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  @Get('whatsapp/status')
  async getWhatsAppStatus(): Promise<any> {
    const status = await this.conversationsService.getWhatsAppStatus();
    return {
      success: true,
      data: status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
}
