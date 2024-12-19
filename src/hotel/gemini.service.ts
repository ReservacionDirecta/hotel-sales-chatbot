import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIConfigService } from '../config/ai.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { SalesScript } from '../entities/sales-script.entity';
import { HotelInfo } from '../entities/hotel-info.entity';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private aiConfigService: AIConfigService,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(SalesScript)
    private readonly salesScriptRepository: Repository<SalesScript>,
    @InjectRepository(HotelInfo)
    private readonly hotelInfoRepository: Repository<HotelInfo>
  ) {
    this.initializeGemini();
  }

  private initializeGemini() {
    try {
      const config = this.aiConfigService.getProviderConfig('gemini');
      if (!config || !config.apiKey) {
        console.error('Gemini API key not configured. Please check your .env file.');
        return;
      }

      this.genAI = new GoogleGenerativeAI(config.apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: config.model || 'gemini-pro',
        generationConfig: {
          temperature: config.temperature || 0.7,
          maxOutputTokens: config.maxTokens || 1000,
        }
      });
      console.log('Gemini API initialized successfully');
    } catch (error) {
      console.error('Error initializing Gemini API:', error);
      throw new Error('Failed to initialize Gemini API. Please check your configuration.');
    }
  }

  private async getAvailableRooms(): Promise<Room[]> {
    return this.roomRepository.find({
      where: { available: true },
      order: { price: 'ASC' }
    });
  }

  private async getRelevantScripts(messageType: string): Promise<SalesScript[]> {
    return this.salesScriptRepository.find({
      where: { type: messageType, isActive: true }
    });
  }

  private async getHotelInfo(): Promise<HotelInfo> {
    const hotelInfo = await this.hotelInfoRepository.findOne({
      where: { id: 1 } // Assuming we only have one hotel info record
    });
    if (!hotelInfo) {
      throw new Error('Hotel information not configured');
    }
    return hotelInfo;
  }

  async generateResponse(prompt: string, context: string = ''): Promise<string> {
    try {
      if (!this.model) {
        this.initializeGemini();
        if (!this.model) {
          throw new Error('No se pudo inicializar la API de Gemini. Por favor, verifica tu configuración.');
        }
      }

      const fullPrompt = context ? `${context}\n\nUser: ${prompt}` : prompt;
      console.log('Sending prompt to Gemini:', fullPrompt);
      
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
    conversationHistory: string[] = []
  ): Promise<string> {
    try {
      console.log('Generating hotel response for prompt:', prompt);
      
      // Get all necessary information
      const [hotelInfo, availableRooms, relevantScripts] = await Promise.all([
        this.getHotelInfo(),
        this.getAvailableRooms(),
        this.getRelevantScripts(this.determineMessageType(prompt))
      ]);

      // Format room information for better readability
      const formattedRooms = availableRooms.map(room => ({
        tipo: room.type,
        precio: `$${room.price}`,
        descripcion: room.description
      }));

      const systemContext = `
      Eres un asistente de ventas de hotel profesional y amable. Usa esta información para responder:

      INFORMACIÓN DEL HOTEL:
      Nombre: ${hotelInfo.name}
      Descripción: ${hotelInfo.description}
      Ubicación: ${hotelInfo.address}, ${hotelInfo.city}, ${hotelInfo.country}
      Contacto: ${hotelInfo.phone} | ${hotelInfo.email}
      Amenidades: ${hotelInfo.amenities.join(', ')}

      HABITACIONES DISPONIBLES:
      ${JSON.stringify(formattedRooms, null, 2)}

      GUÍAS DE RESPUESTA:
      ${relevantScripts.map(script => script.content).join('\n')}
      
      Historial de conversación:
      ${conversationHistory.join('\n')}
      
      Instrucciones:
      1. Responde siempre en español
      2. Sé amable y profesional
      3. Proporciona información precisa sobre el hotel y las habitaciones
      4. Si no sabes algo, dilo honestamente
      5. Menciona las habitaciones disponibles y precios cuando sea relevante
      6. Usa un tono conversacional pero profesional
      7. Si el cliente muestra interés, ofrece ayuda para hacer la reserva
      8. Mantén las respuestas concisas pero informativas

      Mensaje del cliente: ${prompt}
      Asistente:`;

      console.log('System context prepared, calling Gemini API...');
      const response = await this.generateResponse(prompt, systemContext);
      console.log('Gemini response received:', response ? 'success' : 'failed');
      
      return response;
    } catch (error) {
      console.error('Error generating hotel response:', error);
      return 'Lo siento, estoy teniendo problemas técnicos. ¿Podrías intentar reformular tu pregunta?';
    }
  }

  private determineMessageType(prompt: string): string {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('hola') || promptLower.includes('buenos') || promptLower.includes('saludos')) {
      return 'greeting';
    }
    if (promptLower.includes('precio') || promptLower.includes('costo') || promptLower.includes('tarifa')) {
      return 'pricing';
    }
    if (promptLower.includes('reserv') || promptLower.includes('book')) {
      return 'booking';
    }
    if (promptLower.includes('habitacion') || promptLower.includes('cuarto') || promptLower.includes('room')) {
      return 'room_info';
    }
    if (promptLower.includes('ubicacion') || promptLower.includes('direccion') || promptLower.includes('donde')) {
      return 'location';
    }
    if (promptLower.includes('gracias') || promptLower.includes('adios') || promptLower.includes('hasta luego')) {
      return 'closing';
    }
    
    return 'general';
  }
}
