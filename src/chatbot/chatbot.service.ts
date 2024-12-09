import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface SalesStage {
  stage: 'greeting' | 'qualification' | 'presentation' | 'objection' | 'closing' | 'followup';
  step: number;
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processMessage(message: string): Promise<string> {
    try {
      // Por ahora, solo devolvemos un mensaje de prueba
      return `Recibí tu mensaje: "${message}". Este es un mensaje de prueba.`;
    } catch (error) {
      this.logger.error('Error processing message:', error);
      return 'Lo siento, hubo un error. Por favor, intenta nuevamente.';
    }
  }
}
