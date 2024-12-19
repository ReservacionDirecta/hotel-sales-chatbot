import { Controller, Get, Post, Put, Patch, Body, Param, HttpException, HttpStatus, Query, ParseIntPipe, ValidationPipe, NotFoundException } from '@nestjs/common';
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const conversation = await this.conversationService.findOne(id);
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

  @Get('search')
  async searchConversations(@Query('q') searchQuery: string) {
    if (!searchQuery) {
      return await this.conversationService.findAll();
    }
    return await this.conversationService.searchConversations(searchQuery);
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateConversationDto: UpdateConversationDto) {
    try {
      const conversation = await this.conversationService.update(id, updateConversationDto);
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

  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true })) updateConversationDto: UpdateConversationDto
  ) {
    try {
      console.log(`Updating conversation ${id} status to:`, updateConversationDto);
      const conversation = await this.conversationService.update(id, updateConversationDto);
      return {
        success: true,
        data: conversation,
        message: 'Estado de conversación actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error updating conversation status:', error);
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al actualizar el estado de la conversación',
          data: null
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/messages')
  async addMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true
    })) createMessageDto: CreateMessageDto
  ) {
    try {
      console.log('Received message DTO:', JSON.stringify(createMessageDto));
      const message = await this.conversationService.createMessage(
        id,
        createMessageDto
      );
      return {
        success: true,
        data: message,
      };
    } catch (error) {
      console.error('Error in addMessage:', error);
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al agregar el mensaje',
          data: [],
          validationErrors: error.response?.message
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/send-message')
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() createMessageDto: CreateMessageDto
  ) {
    try {
      const message = await this.conversationService.sendMessage(
        id,
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
