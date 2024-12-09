import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto, UpdateConversationDto, CreateMessageDto } from './dto/conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const conversations = await this.prisma.conversation.findMany({
        include: {
          messages: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      return conversations || [];
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error('Error al obtener las conversaciones de la base de datos');
    }
  }

  async findOne(id: number) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: true,
      },
    });
  }

  async create(createConversationDto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        userId: createConversationDto.userId,
        status: 'active',
      },
    });
  }

  async update(id: number, updateConversationDto: UpdateConversationDto) {
    return this.prisma.conversation.update({
      where: { id },
      data: updateConversationDto,
    });
  }

  async addMessage(conversationId: number, createMessageDto: CreateMessageDto) {
    try {
      // Verificar que la conversación existe
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        throw new Error('Conversación no encontrada');
      }

      // Crear el mensaje
      const message = await this.prisma.message.create({
        data: {
          conversation: {
            connect: { id: conversationId }
          },
          content: createMessageDto.content,
          sender: createMessageDto.sender || 'user',
          messageId: createMessageDto.messageId,
        },
        include: {
          conversation: true,
        },
      });

      // Actualizar la fecha de actualización de la conversación
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return message;
    } catch (error) {
      console.error('Error en addMessage:', error);
      throw new Error('Error al agregar el mensaje a la conversación');
    }
  }

  async sendMessage(conversationId: number, createMessageDto: CreateMessageDto) {
    try {
      // Primero guardamos el mensaje del usuario
      const userMessage = await this.addMessage(conversationId, {
        ...createMessageDto,
        sender: 'user'
      });

      // Aquí podrías agregar la lógica para procesar el mensaje y generar una respuesta
      // Por ahora, solo devolvemos el mensaje del usuario
      return userMessage;
    } catch (error) {
      console.error('Error en sendMessage:', error);
      throw new Error('Error al procesar el mensaje');
    }
  }
}
