import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, Message, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { ChatbotService } from '../chatbot/chatbot.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);
  private qrCode: string | null = null;
  private isClientReady = false;
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private qrAttempts = 0;
  private readonly MAX_QR_ATTEMPTS = 3;

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatbotService: ChatbotService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ],
          executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        }
      });

      this.setupEventListeners();
    } catch (error) {
      this.logger.error('Failed to initialize WhatsApp client', error);
      throw error;
    }
  }

  private setupEventListeners() {
    if (!this.client) {
      this.logger.error('Client not initialized');
      return;
    }

    this.client.on('qr', (qr) => {
      this.qrCode = qr;
      this.qrAttempts++;
      this.connectionStatus = 'connecting';
      this.logger.log(`QR Code received (Attempt ${this.qrAttempts}/${this.MAX_QR_ATTEMPTS})`);
      this.eventEmitter.emit('whatsapp.qr', { qr, attempt: this.qrAttempts });

      if (this.qrAttempts >= this.MAX_QR_ATTEMPTS) {
        this.logger.warn('Max QR attempts reached. Please try again later.');
        this.resetConnection();
      }
    });

    this.client.on('ready', () => {
      this.isClientReady = true;
      this.connectionStatus = 'connected';
      this.qrAttempts = 0;
      this.qrCode = null;
      this.logger.log('WhatsApp client is ready!');
      this.eventEmitter.emit('whatsapp.ready');
    });

    this.client.on('disconnected', async (reason) => {
      this.isClientReady = false;
      this.connectionStatus = 'disconnected';
      this.qrCode = null;
      this.logger.warn(`WhatsApp client disconnected: ${reason}`);
      this.eventEmitter.emit('whatsapp.disconnected', { reason });
      await this.resetConnection();
    });

    this.client.on('authenticated', () => {
      this.logger.log('WhatsApp client authenticated');
      this.eventEmitter.emit('whatsapp.authenticated');
    });

    this.client.on('auth_failure', async (error) => {
      this.logger.error('WhatsApp authentication failed:', error);
      this.eventEmitter.emit('whatsapp.auth_failure', { error });
      await this.resetConnection();
    });

    this.client.on('message', async (msg: Message) => {
      try {
        await this.handleMessage(msg);
      } catch (error) {
        this.logger.error('Error handling message:', error);
      }
    });
  }

  private async resetConnection() {
    this.qrAttempts = 0;
    this.qrCode = null;
    this.isClientReady = false;
    this.connectionStatus = 'disconnected';
    
    try {
      if (this.client) {
        try {
          await this.client.destroy();
        } catch (error) {
          this.logger.error('Error destroying client:', error);
        }
      }

      // Add a longer delay before reinitializing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await this.initializeClient();
      await this.startClient();
    } catch (error) {
      this.logger.error('Error resetting connection:', error);
      throw error;
    }
  }

  private async startClient() {
    if (this.connectionStatus === 'connecting') {
      throw new Error('Client is already trying to connect');
    }

    try {
      this.connectionStatus = 'connecting';
      await this.client.initialize();
    } catch (error) {
      this.logger.error('Failed to initialize WhatsApp client', error);
      this.connectionStatus = 'disconnected';
      
      // If the error is related to Chrome/Puppeteer, try to reset
      if (error.message.includes('Protocol error') || error.message.includes('Session closed')) {
        this.logger.log('Attempting to reset connection due to Chrome/Puppeteer error');
        await this.resetConnection();
      } else {
        throw error;
      }
    }
  }

  async onModuleInit() {
    try {
      await this.startClient();
    } catch (error) {
      this.logger.error('Error during module initialization:', error);
      // Don't throw the error here to prevent NestJS from crashing
      // The WhatsApp service will still be available, just not connected initially
    }
  }

  async getConnectionStatus() {
    return {
      status: this.connectionStatus,
      qrAttempts: this.qrAttempts,
      maxAttempts: this.MAX_QR_ATTEMPTS,
    };
  }

  async isConnected(): Promise<boolean> {
    return this.isClientReady;
  }

  private async generateQRBase64(qr: string): Promise<string> {
    try {
      return await qrcode.toDataURL(qr);
    } catch (error) {
      this.logger.error('Error generating QR code base64:', error);
      throw error;
    }
  }

  async generateQR(): Promise<{ qr: string | null; status: string; attempts: number }> {
    if (this.isClientReady) {
      return {
        qr: null,
        status: 'connected',
        attempts: 0
      };
    }

    if (this.qrAttempts >= this.MAX_QR_ATTEMPTS) {
      throw new Error('Max QR attempts reached. Please try again later.');
    }

    if (!this.client || this.connectionStatus === 'disconnected') {
      await this.resetConnection();
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('QR code generation timed out'));
      }, 30000);

      const qrListener = async (qr: string) => {
        try {
          clearTimeout(timeout);
          this.client.removeListener('qr', qrListener);
          const qrBase64 = await this.generateQRBase64(qr);
          resolve({
            qr: qrBase64,
            status: this.connectionStatus,
            attempts: this.qrAttempts
          });
        } catch (error) {
          reject(error);
        }
      };

      this.client.on('qr', qrListener);
    });
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.destroy();
      this.connectionStatus = 'disconnected';
      this.isClientReady = false;
      this.qrCode = null;
      this.qrAttempts = 0;
    } catch (error) {
      this.logger.error('Error disconnecting WhatsApp client:', error);
      throw error;
    }
  }

  async handleMessage(message: Message) {
    if (!message.body || message.fromMe) return;

    try {
      const response = await this.chatbotService.processMessage(message.body);
      await message.reply(response);
    } catch (error) {
      this.logger.error('Error processing message:', error);
      await message.reply('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.');
    }
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Define country codes and their expected lengths
    const countryFormats = {
      '51': 9,  // Peru
      '52': 10, // Mexico
      '57': 10, // Colombia
      '56': 9,  // Chile
      '54': 10, // Argentina
    };

    // Extract country code (first 2 digits)
    const countryCode = cleaned.slice(0, 2);
    const numberWithoutCode = cleaned.slice(2);

    // Check if country code is valid and number length matches expected format
    return countryCode in countryFormats && 
           numberWithoutCode.length === countryFormats[countryCode];
  }

  async linkPhoneNumber(phoneNumber: string): Promise<boolean> {
    try {
      // Remove any non-digit characters for validation
      const cleaned = phoneNumber.replace(/\D/g, '');

      if (this.isClientReady) {
        throw new Error('WhatsApp ya está conectado');
      }

      // Validate phone number format
      if (!this.validatePhoneNumber(cleaned)) {
        throw new Error('Formato de número de teléfono inválido');
      }

      // Format number with + prefix
      const formattedNumber = '+' + cleaned;

      // If there's an existing client, destroy it
      if (this.client) {
        await this.client.destroy();
      }

      // Initialize new client with the phone number
      this.client = new Client({
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ],
          executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        },
        authStrategy: new LocalAuth({ clientId: cleaned })
      });

      this.setupEventListeners();
      await this.startClient();

      return true;
    } catch (error) {
      this.logger.error('Error linking phone number:', error);
      throw error;
    }
  }

  async reloadChats() {
    try {
      if (!this.client) {
        throw new Error('Cliente de WhatsApp no inicializado');
      }

      const isConnected = await this.isConnected();
      if (!isConnected) {
        throw new Error('WhatsApp no está conectado');
      }

      // Obtener todos los chats
      const chats = await this.client.getChats();
      let processedChats = 0;
      
      // Para cada chat, obtener y guardar los mensajes
      for (const chat of chats) {
        if (chat.isGroup) continue; // Ignorar grupos si solo queremos chats individuales
        
        try {
          // Buscar o crear la conversación en la base de datos
          const conversation = await this.prisma.conversation.upsert({
            where: {
              id: await this.prisma.conversation
                .findFirst({
                  where: { whatsappId: chat.id.user }
                })
                .then(conv => conv?.id ?? -1)
            },
            create: {
              userId: chat.id.user,
              whatsappId: chat.id.user,
              status: 'active'
            },
            update: {
              updatedAt: new Date()
            }
          });

          // Obtener mensajes del chat
          const messages = await chat.fetchMessages({ limit: 50 });
          let processedMessages = 0;
          
          // Guardar cada mensaje
          for (const msg of messages) {
            if (!msg.body) continue; // Ignorar mensajes sin contenido

            try {
              const existingMessage = await this.prisma.message.findFirst({
                where: { messageId: msg.id.id }
              });

              if (!existingMessage) {
                await this.prisma.message.create({
                  data: {
                    conversationId: conversation.id,
                    content: msg.body,
                    sender: msg.fromMe ? 'assistant' : 'user',
                    timestamp: new Date(msg.timestamp * 1000), // Convertir timestamp a fecha
                    messageId: msg.id.id
                  }
                });
                processedMessages++;
              }
            } catch (error) {
              console.error(`Error guardando mensaje ${msg.id.id}:`, error);
            }
          }

          console.log(`Procesados ${processedMessages} mensajes para el chat ${chat.id.user}`);
          processedChats++;
        } catch (error) {
          console.error(`Error procesando chat ${chat.id.user}:`, error);
          // Continuar con el siguiente chat incluso si hay error
          continue;
        }
      }

      return { 
        chatsProcessed: processedChats,
        message: `Se procesaron ${processedChats} conversaciones exitosamente`
      };
    } catch (error) {
      console.error('Error recargando chats:', error);
      throw new Error(error.message || 'Error al recargar las conversaciones de WhatsApp');
    }
  }
}
