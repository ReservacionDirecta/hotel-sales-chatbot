import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto, UpdateConversationDto, CreateMessageDto } from './dto/conversation.dto';
import { Prisma } from '@prisma/client';
import { GeminiService } from './gemini.service';

@Injectable()
export class ConversationService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService
  ) {}

  async findAll() {
    try {
      const conversations = await this.prisma.conversation.findMany({
        include: {
          messages: {
            orderBy: {
              timestamp: 'asc'
            },
            select: {
              id: true,
              content: true,
              sender: true,
              messageType: true,
              timestamp: true,
              messageId: true
            }
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      return conversations;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error('Error al obtener las conversaciones de la base de datos');
    }
  }

  async findOne(id: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: {
              timestamp: 'asc'
            },
            select: {
              id: true,
              content: true,
              sender: true,
              messageType: true,
              timestamp: true,
              messageId: true
            }
          },
        },
      });

      if (!conversation) {
        throw new NotFoundException(`Conversación con ID ${id} no encontrada`);
      }

      return conversation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener la conversación: ${error.message}`);
    }
  }

  async create(createConversationDto: CreateConversationDto) {
    try {
      return await this.prisma.conversation.create({
        data: {
          userId: createConversationDto.userId,
          whatsappId: createConversationDto.whatsappId || createConversationDto.userId,
          status: 'active',
        },
        include: {
          messages: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Ya existe una conversación con este ID de WhatsApp');
        }
      }
      throw new Error(`Error al crear la conversación: ${error.message}`);
    }
  }

  async update(id: number, updateConversationDto: UpdateConversationDto) {
    try {
      console.log('Updating conversation:', { id, data: updateConversationDto });
      
      // Validate status
      const validStatuses = ['active', 'closed', 'archived'];
      if (updateConversationDto.status && !validStatuses.includes(updateConversationDto.status)) {
        throw new Error(`Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`);
      }

      const conversation = await this.prisma.conversation.update({
        where: { id },
        data: {
          ...updateConversationDto,
          updatedAt: new Date(),
        },
        include: {
          messages: {
            orderBy: {
              timestamp: 'asc'
            }
          },
        },
      });

      if (!conversation) {
        throw new NotFoundException(`Conversación con ID ${id} no encontrada`);
      }

      return conversation;
    } catch (error) {
      console.error('Error updating conversation:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Conversación con ID ${id} no encontrada`);
        }
      }
      throw error;
    }
  }

  async getMessageHistory(conversationId: number, limit?: number) {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          conversationId: conversationId
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: limit || undefined,
        select: {
          id: true,
          content: true,
          sender: true,
          messageType: true,
          timestamp: true,
          messageId: true
        }
      });

      return messages.reverse(); // Devolvemos en orden cronológico
    } catch (error) {
      console.error('Error al obtener historial de mensajes:', error);
      throw new Error(`Error al obtener el historial de mensajes: ${error.message}`);
    }
  }

  async createMessage(conversationId: number, createMessageDto: CreateMessageDto) {
    try {
      console.log('Creating message for conversation:', conversationId, 'Message:', createMessageDto);
      
      // Verify conversation exists
      const conversation = await this.findOne(conversationId);
      if (!conversation) {
        throw new Error(`Conversation ${conversationId} not found`);
      }
      
      // Create user message first
      const message = await this.prisma.message.create({
        data: {
          content: createMessageDto.content,
          sender: createMessageDto.sender,
          messageType: createMessageDto.messageType || 'text',
          messageId: `msg_${Date.now()}`,
          conversation: {
            connect: {
              id: conversationId
            }
          },
          timestamp: new Date()
        },
      });
      
      console.log('User message created:', message);

      // If the message is from the user, generate AI response
      if (createMessageDto.sender === 'user') {
        console.log('Generating AI response for user message');
        
        const conversationHistory = conversation.messages.map(
          msg => `${msg.sender}: ${msg.content}`
        );
        
        // Get hotel information from the database
        const hotelInfo = await this.prisma.hotelInfo.findFirst();
        if (!hotelInfo) {
          console.error('No hotel information found in database');
          throw new Error('Hotel information not configured');
        }
        
        console.log('Requesting AI response with hotel info:', hotelInfo.name);
        
        const aiResponse = await this.geminiService.generateHotelResponse(
          createMessageDto.content,
          hotelInfo,
          conversationHistory
        );

        console.log('AI response received:', aiResponse ? 'success' : 'failed');

        // Create AI response message
        if (aiResponse) {
          const botMessage = await this.prisma.message.create({
            data: {
              content: aiResponse,
              sender: 'assistant',
              messageType: 'text',
              messageId: `bot_${Date.now()}`,
              conversation: {
                connect: {
                  id: conversationId
                }
              },
              timestamp: new Date()
            },
          });
          console.log('Bot message created:', botMessage.id);
        }
      }

      // Update conversation timestamp
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return message;
    } catch (error) {
      console.error('Error in createMessage:', error);
      throw new Error(`Error al crear el mensaje: ${error.message}`);
    }
  }

  async sendMessage(conversationId: number, createMessageDto: CreateMessageDto) {
    try {
      // Obtener el historial reciente para contexto
      const recentMessages = await this.getMessageHistory(conversationId, 5);
      
      // Guardamos el mensaje del usuario
      const userMessage = await this.createMessage(conversationId, {
        ...createMessageDto,
        sender: 'user',
        timestamp: new Date()
      });

      // No necesitamos generar una respuesta automática ya que se genera en createMessage

      return {
        userMessage,
        context: recentMessages
      };
    } catch (error) {
      console.error('Error en sendMessage:', error);
      throw new Error(`Error al procesar el mensaje: ${error.message}`);
    }
  }

  async searchConversations(searchQuery: string) {
    try {
      const conversations = await this.prisma.conversation.findMany({
        where: {
          OR: [
            {
              userId: {
                contains: searchQuery
              }
            },
            {
              messages: {
                some: {
                  content: {
                    contains: searchQuery
                  }
                }
              }
            },
            {
              whatsappId: {
                contains: searchQuery
              }
            }
          ]
        },
        include: {
          messages: {
            orderBy: {
              timestamp: 'asc'
            },
            select: {
              id: true,
              content: true,
              sender: true,
              messageType: true,
              timestamp: true,
              messageId: true
            }
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      return conversations;
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw new Error(`Error al buscar conversaciones: ${error.message}`);
    }
  }
}
