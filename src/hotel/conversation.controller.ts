import { Controller, Get, Post, Put, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto, UpdateConversationDto, CreateMessageDto } from './dto/conversation.dto';

@Controller('hotel/conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  async findAll() {
    try {
      const conversations = await this.conversationService.findAll();
      return {
        success: true,
        data: conversations || [],
        message: conversations.length === 0 ? 'No hay conversaciones disponibles' : 'Conversaciones obtenidas exitosamente'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al obtener las conversaciones',
          data: []
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const conversation = await this.conversationService.findOne(Number(id));
      if (!conversation) {
        throw new HttpException('Conversación no encontrada', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: conversation,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al obtener la conversación',
          data: []
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createConversationDto: CreateConversationDto) {
    try {
      const conversation = await this.conversationService.create(createConversationDto);
      return {
        success: true,
        data: conversation,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al crear la conversación',
          data: []
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
    try {
      const conversation = await this.conversationService.update(Number(id), updateConversationDto);
      return {
        success: true,
        data: conversation,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al actualizar la conversación',
          data: []
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/messages')
  async addMessage(
    @Param('id') id: string,
    @Body() createMessageDto: CreateMessageDto
  ) {
    try {
      const message = await this.conversationService.addMessage(
        Number(id),
        createMessageDto
      );
      return {
        success: true,
        data: message,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al agregar el mensaje',
          data: []
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/send-message')
  async sendMessage(
    @Param('id') id: string,
    @Body() createMessageDto: CreateMessageDto
  ) {
    try {
      const message = await this.conversationService.sendMessage(
        Number(id),
        createMessageDto
      );
      return {
        success: true,
        data: message,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al enviar el mensaje',
          data: []
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
