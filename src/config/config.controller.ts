import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { AIConfigService } from './ai.service';

@Controller('api/config')
export class ConfigController {
  constructor(private readonly aiConfigService: AIConfigService) {}

  @Get('ai/providers')
  getAIProviders() {
    try {
      const defaultProvider = this.aiConfigService.defaultProvider;
      const geminiConfig = this.aiConfigService.getProviderConfig('gemini');
      
      return {
        defaultProvider,
        providers: {
          gemini: {
            name: 'Google Gemini',
            isConfigured: !!geminiConfig.apiKey,
            model: geminiConfig.model,
          },
          // Espacio para futuros proveedores
        },
      };
    } catch (error) {
      console.error('Error getting AI providers:', error);
      throw new BadRequestException('Error al obtener proveedores de IA');
    }
  }

  @Post('ai/apikey')
  updateAIApiKey(@Body() body: { provider: string; apiKey: string }) {
    try {
      if (!body.provider || !body.apiKey) {
        throw new BadRequestException('Proveedor y API key son requeridos');
      }

      this.aiConfigService.updateApiKey(body.provider, body.apiKey);
      return { success: true, message: 'API key actualizada exitosamente' };
    } catch (error) {
      console.error('Error updating API key:', error);
      throw new BadRequestException('Error al actualizar API key');
    }
  }
}
