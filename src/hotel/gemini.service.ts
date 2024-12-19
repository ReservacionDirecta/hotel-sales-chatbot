import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIConfigService } from '../config/ai.service';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private aiConfigService: AIConfigService) {
    this.initializeGemini();
  }

  private initializeGemini() {
    const config = this.aiConfigService.getProviderConfig('gemini');
    if (!config || !config.apiKey) {
      console.warn('Gemini API key not configured');
      return;
    }

    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: config.model || 'gemini-pro' });
  }

  async generateResponse(prompt: string, context: string = ''): Promise<string> {
    try {
      if (!this.model) {
        this.initializeGemini();
        if (!this.model) {
          throw new Error('Gemini API no está configurada. Por favor, configura la API key en la página de configuración.');
        }
      }

      const fullPrompt = context ? `${context}\n\nUser: ${prompt}` : prompt;
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      throw new Error('Error al generar respuesta: ' + error.message);
    }
  }

  async generateHotelResponse(
    prompt: string, 
    hotelInfo: any, 
    conversationHistory: string[] = []
  ): Promise<string> {
    try {
      console.log('Generating hotel response for prompt:', prompt);
      
      const systemContext = `
      You are a helpful hotel sales assistant. Use the following hotel information to answer questions:
      ${JSON.stringify(hotelInfo, null, 2)}
      
      Previous conversation:
      ${conversationHistory.join('\n')}
      
      Remember to:
      1. Be polite and professional
      2. Provide accurate information about the hotel
      3. If you don't know something, say so
      4. Encourage bookings but don't be pushy
      5. Keep responses concise but informative
      
      Current user message: ${prompt}
      Assistant:`;

      console.log('System context prepared, calling Gemini API...');
      const response = await this.generateResponse(prompt, systemContext);
      console.log('Gemini response received:', response ? 'success' : 'failed');
      
      return response;
    } catch (error) {
      console.error('Error generating hotel response:', error);
      throw new Error(`Failed to generate hotel response: ${error.message}`);
    }
  }
}
