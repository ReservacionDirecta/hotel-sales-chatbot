import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface SalesStage {
  stage: 'greeting' | 'qualification' | 'presentation' | 'objection' | 'closing' | 'followup';
  step: number;
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private conversationStages = new Map<string, SalesStage>();

  constructor(private readonly prisma: PrismaService) {}

  private async getActiveScript(type: SalesStage['stage']): Promise<string | null> {
    try {
      const script = await this.prisma.salesScript.findFirst({
        where: {
          type,
          active: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return script?.content || null;
    } catch (error) {
      this.logger.error(`Error getting ${type} script:`, error);
      return null;
    }
  }

  private async determineStage(message: string, currentStage?: SalesStage): Promise<SalesStage> {
    if (!currentStage) {
      return { stage: 'greeting', step: 1 };
    }

    // Palabras clave para detectar etapas
    const keywords = {
      greeting: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'],
      qualification: ['precio', 'costo', 'tarifa', 'habitación', 'disponibilidad'],
      presentation: ['detalles', 'servicios', 'instalaciones', 'fotos', 'imágenes'],
      objection: ['caro', 'lejos', 'mejor', 'competencia', 'descuento'],
      closing: ['reservar', 'confirmar', 'pagar', 'depósito', 'agendar'],
      followup: ['gracias', 'confirmar', 'recibo', 'confirmación'],
    };

    const messageLower = message.toLowerCase();
    
    // Detectar etapa basada en palabras clave
    for (const [stage, words] of Object.entries(keywords)) {
      if (words.some(word => messageLower.includes(word))) {
        return {
          stage: stage as SalesStage['stage'],
          step: 1,
        };
      }
    }

    // Si no se detecta una nueva etapa, avanzar en la etapa actual
    return {
      stage: currentStage.stage,
      step: currentStage.step + 1,
    };
  }

  async processMessage(message: string, conversationId?: string): Promise<string> {
    try {
      let currentStage = conversationId ? this.conversationStages.get(conversationId) : undefined;
      const newStage = await this.determineStage(message, currentStage);
      
      if (conversationId) {
        this.conversationStages.set(conversationId, newStage);
      }

      // Obtener el script correspondiente a la etapa
      const script = await this.getActiveScript(newStage.stage);
      if (script) {
        return script;
      }

      // Respuestas por defecto si no hay script
      const defaultResponses = {
        greeting: '¡Bienvenido! ¿En qué puedo ayudarte con tu reserva de hotel?',
        qualification: 'Tenemos diferentes tipos de habitaciones disponibles. ¿Qué tipo de habitación estás buscando?',
        presentation: 'Nuestro hotel cuenta con excelentes instalaciones y servicios de primera clase.',
        objection: 'Entiendo tu preocupación. ¿Podría contarte más sobre el valor que ofrecemos?',
        closing: '¿Te gustaría proceder con la reserva?',
        followup: 'Gracias por tu interés. ¿Hay algo más en lo que pueda ayudarte?',
      };

      return defaultResponses[newStage.stage] || '¿En qué más puedo ayudarte?';
    } catch (error) {
      this.logger.error('Error processing message:', error);
      return 'Lo siento, hubo un error. Por favor, intenta nuevamente.';
    }
  }

  async findOrCreateConversation(whatsappId: string) {
    try {
      let conversation = await this.prisma.conversation.findFirst({
        where: { whatsappId }
      });

      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: {
            whatsappId,
            userId: whatsappId,
            status: 'active'
          }
        });
      }

      return conversation;
    } catch (error) {
      this.logger.error('Error finding or creating conversation:', error);
      throw error;
    }
  }
}
