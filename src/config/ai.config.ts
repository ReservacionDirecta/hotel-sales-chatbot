import { registerAs } from '@nestjs/config';

export interface AIConfig {
  provider: string;
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProviderConfig {
  gemini: AIConfig;
  // Espacio para futuras implementaciones
  // openai?: AIConfig;
  // anthropic?: AIConfig;
  // mistral?: AIConfig;
}

export default registerAs('ai', () => ({
  defaultProvider: process.env.AI_PROVIDER || 'gemini',
  providers: {
    gemini: {
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-pro',
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7,
      maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 2048,
    },
    // Configuración para futuros proveedores
    // openai: {
    //   provider: 'openai',
    //   apiKey: process.env.OPENAI_API_KEY,
    //   model: process.env.OPENAI_MODEL || 'gpt-4',
    //   temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    //   maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2048,
    // },
    // anthropic: {
    //   provider: 'anthropic',
    //   apiKey: process.env.ANTHROPIC_API_KEY,
    //   model: process.env.ANTHROPIC_MODEL || 'claude-2',
    //   temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE) || 0.7,
    //   maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS) || 2048,
    // },
  } as AIProviderConfig,
}));
