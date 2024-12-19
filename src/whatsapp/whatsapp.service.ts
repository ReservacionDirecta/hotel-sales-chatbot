import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, Message, LocalAuth, ClientOptions } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { ChatbotService } from '../chatbot/chatbot.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as path from 'path';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);
  private qrCode: string | null = null;
  private _isConnected = false;
  private isInitializing = false;
  private qrAttempts = 0;
  private maxQrAttempts = 3;

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatbotService: ChatbotService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.initializeClient();
  }

  private async initializeClient() {
    if (this.isInitializing) {
      this.logger.warn('Client initialization already in progress');
      return {
        status: 'initializing',
        qrAttempts: this.qrAttempts,
        maxAttempts: this.maxQrAttempts,
        isConnected: this._isConnected
      };
    }

    try {
      if (this.client) {
        try {
          await this.client.destroy();
          // Esperar un momento después de destruir el cliente
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          this.logger.warn('Error destroying previous client:', error);
        }
      }

      this.qrAttempts = 0;
      this.maxQrAttempts = 5;
      this.isInitializing = true;
      this.qrCode = null;

      const puppeteerOptions: any = {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
        headless: true,
        timeout: 60000,
        protocolTimeout: 60000,
        browserWSEndpoint: null,
        userDataDir: path.join(process.cwd(), 'whatsapp-sessions'),
      };

      if (process.platform === 'win32') {
        puppeteerOptions.executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
      }

      const clientOptions: ClientOptions = {
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      };

      this.client = new Client({
        ...clientOptions,
        authStrategy: new LocalAuth({
          clientId: 'hotel-sales-bot',
          dataPath: './whatsapp-sessions'
        })
      });

      this.client.on('qr', async (qr) => {
        this.logger.log(`QR Code received from WhatsApp (attempt ${this.qrAttempts + 1}/${this.maxQrAttempts})`);
        try {
          this.qrCode = await qrcode.toDataURL(qr);
          this.logger.log('QR Code successfully converted to data URL');
          this.qrAttempts++;
          
          if (this.qrAttempts >= this.maxQrAttempts) {
            this.logger.error('Max QR attempts reached');
            this.qrCode = null;
            this.isInitializing = false;
            await this.resetConnection();
          }
        } catch (error) {
          this.logger.error('Error generating QR code:', error);
          this.qrCode = null;
          this.isInitializing = false;
          throw new Error(`No se pudo generar el código QR: ${error.message}`);
        }
      });

      this.client.on('loading_screen', (percent, message) => {
        this.logger.log(`WhatsApp loading: ${percent}% - ${message}`);
      });

      this.client.on('ready', () => {
        this.logger.log('WhatsApp client is ready!');
        this._isConnected = true;
        this.isInitializing = false;
        this.qrCode = null;
        this.qrAttempts = 0;
      });

      this.client.on('auth_failure', msg => {
        this.logger.error('WhatsApp authentication failed:', msg);
        this._isConnected = false;
        this.isInitializing = false;
      });

      this.client.on('disconnected', async (reason) => {
        this.logger.warn('WhatsApp client disconnected:', reason);
        this._isConnected = false;
        this.isInitializing = false;
        this.qrCode = null;
        
        // Intentar reconectar después de un breve retraso
        await new Promise(resolve => setTimeout(resolve, 5000));
        await this.resetConnection();
      });

      // Inicializar el cliente con un timeout más largo
      await Promise.race([
        this.client.initialize(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout al inicializar WhatsApp')), 60000)
        )
      ]).catch((error) => {
        this.logger.error('Error initializing WhatsApp client:', error);
        this.isInitializing = false;
        throw new Error('Error al inicializar WhatsApp: ' + error.message);
      });

      return {
        status: 'initializing',
        qrAttempts: this.qrAttempts,
        maxAttempts: this.maxQrAttempts,
        isConnected: this._isConnected
      };
    } catch (error) {
      this.logger.error('Error in initializeClient:', error);
      this.isInitializing = false;
      throw error;
    }
  }

  async onModuleInit() {
    // El cliente ya se inicializa en el constructor
  }

  async generateQR() {
    this.logger.log('Attempting to generate QR code...');
    
    if (this._isConnected) {
      this.logger.log('Client is already connected');
      return {
        qr: null,
        status: 'connected',
        attempts: this.qrAttempts
      };
    }

    if (!this.isInitializing) {
      this.logger.log('Client not initialized, starting initialization...');
      await this.initializeClient();
    }

    // Wait for QR code with timeout
    let attempts = 0;
    const maxWaitAttempts = 30;
    const waitInterval = 1000; // 1 second

    while (!this.qrCode && attempts < maxWaitAttempts) {
      this.logger.debug(`Waiting for QR code... Attempt ${attempts + 1}/${maxWaitAttempts}`);
      await new Promise(resolve => setTimeout(resolve, waitInterval));
      attempts++;
    }

    if (!this.qrCode) {
      this.logger.error('Failed to generate QR code after timeout');
      throw new Error('No se pudo generar el código QR después de varios intentos');
    }

    return {
      qr: this.qrCode,
      status: this._isConnected ? 'connected' : 'pending',
      attempts: this.qrAttempts
    };
  }

  private async resetConnection() {
    try {
      await this.disconnect();
      await this.initializeClient();
    } catch (error) {
      this.logger.error('Error resetting connection:', error);
      throw error;
    }
  }

  async disconnect() {
    this.logger.log('Attempting to disconnect WhatsApp client...');
    
    try {
      if (this.client) {
        await this.client.destroy();
        this.logger.log('WhatsApp client destroyed successfully');
      }
      
      this._isConnected = false;
      this.isInitializing = false;
      this.qrCode = null;
      this.qrAttempts = 0;
      
      return true;
    } catch (error) {
      this.logger.error('Error disconnecting WhatsApp client:', error);
      throw new Error('Error al desconectar WhatsApp: ' + error.message);
    }
  }

  async getConnectionStatus() {
    return {
      status: this._isConnected ? 'connected' : 'disconnected',
      qrAttempts: this.qrAttempts,
      maxAttempts: this.maxQrAttempts
    };
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    // Eliminar todos los caracteres no numéricos
    const cleaned = phoneNumber.replace(/\D/g, '');
    // Verificar que tenga entre 10 y 13 dígitos
    return cleaned.length >= 10 && cleaned.length <= 13;
  }

  async linkPhoneNumber(phoneNumber: string): Promise<boolean> {
    try {
      // Limpiar número de teléfono
      const cleaned = phoneNumber.replace(/\D/g, '');

      // Validar formato
      if (!this.validatePhoneNumber(cleaned)) {
        throw new Error('Formato de número de teléfono inválido');
      }

      // Formatear con prefijo +
      const formattedNumber = '+' + cleaned;

      // Si hay un cliente existente, destruirlo
      if (this.client) {
        await this.client.destroy();
      }

      // Inicializar nuevo cliente con el número
      this.client = new Client({
        authStrategy: new LocalAuth({ clientId: cleaned }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      });

      // Configurar eventos y inicializar
      await this.initializeClient();

      return true;
    } catch (error) {
      this.logger.error('Error linking phone number:', error);
      throw error;
    }
  }

  async handleMessage(message: Message) {
    try {
      const chat = await message.getChat();
      const contact = await message.getContact();
      
      // Guardar mensaje en la base de datos
      const savedMessage = await this.prisma.message.create({
        data: {
          messageId: message.id.id,
          content: message.body,
          sender: 'user',
          messageType: message.type || 'text',
          conversation: {
            connectOrCreate: {
              where: {
                whatsappId: chat.id.user
              },
              create: {
                userId: chat.id.user,
                whatsappId: chat.id.user,
                status: 'active'
              }
            }
          }
        },
        include: {
          conversation: true
        }
      });

      // Procesar mensaje con el chatbot usando el ID de la conversación
      const response = await this.chatbotService.processMessage(message.body, savedMessage.conversation.id.toString());
      
      // Enviar respuesta
      await chat.sendMessage(response);

      // Guardar respuesta en la base de datos
      await this.prisma.message.create({
        data: {
          messageId: `bot_${Date.now()}`,
          content: response,
          sender: 'assistant',
          messageType: 'text',
          conversation: {
            connect: {
              id: savedMessage.conversation.id
            }
          }
        }
      });
    } catch (error) {
      this.logger.error('Error handling message:', error);
      throw error;
    }
  }

  async reloadChats() {
    try {
      if (!this.client) {
        throw new Error('Cliente de WhatsApp no inicializado');
      }

      const isConnected = await this.isConnected;
      if (!isConnected) {
        throw new Error('WhatsApp no está conectado');
      }

      const chats = await this.client.getChats();
      let processedCount = 0;

      for (const chat of chats) {
        try {
          await this.prisma.conversation.upsert({
            where: {
              whatsappId: chat.id.user
            },
            update: {
              updatedAt: new Date()
            },
            create: {
              userId: chat.id.user,
              whatsappId: chat.id.user,
              status: 'active'
            }
          });
          processedCount++;
        } catch (error) {
          this.logger.error(`Error processing chat ${chat.id.user}:`, error);
        }
      }

      return { chatsProcessed: processedCount };
    } catch (error) {
      this.logger.error('Error reloading chats:', error);
      throw error;
    }
  }
}
