import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIConfig, AIProviderConfig } from './ai.config';

@Injectable()
export class AIConfigService {
  constructor(private configService: ConfigService) {}

  get defaultProvider(): string {
    return this.configService.get<string>('ai.defaultProvider');
  }

  getProviderConfig(provider: string = this.defaultProvider): AIConfig | null {
    switch (provider.toLowerCase()) {
      case 'gemini':
        return {
          provider: 'gemini',
          apiKey: this.configService.get<string>('GEMINI_API_KEY'),
          model: 'gemini-pro',
          temperature: 0.7,
          maxTokens: 1000,
        };
      default:
        const providers = this.configService.get<AIProviderConfig>('ai.providers');
        return providers[provider] ?? null;
    }
  }

  updateProviderConfig(provider: string, config: Partial<AIConfig>): void {
    const currentConfig = this.getProviderConfig(provider);
    const providers = this.configService.get<AIProviderConfig>('ai.providers');
    
    providers[provider] = {
      ...currentConfig,
      ...config,
    };
  }

  // Método específico para actualizar la API key
  updateApiKey(provider: string, apiKey: string): void {
    this.updateProviderConfig(provider, { apiKey });
  }

  // Método para validar la configuración de un proveedor
  validateProviderConfig(provider: string): boolean {
    const config = this.getProviderConfig(provider);
    return !!(config && config.apiKey);
  }
}