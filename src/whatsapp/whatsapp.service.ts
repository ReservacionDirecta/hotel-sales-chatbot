import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, LocalAuth, ClientOptions } from 'whatsapp-web.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatbotService } from '../chatbot/chatbot.service';
import * as path from 'path';
import * as fs from 'fs';
import { rimraf } from 'rimraf';
import * as os from 'os';
import { initializeSessionsDirectory } from './utils/init-sessions';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);
  private isInitializing = false;
  private _isConnected = false;
  private qrCode: string = null;
  private qrAttempts = 0;
  private maxQrAttempts = 5;
  private readonly sessionBasePath: string;
  private readonly sessionDir: string;

  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.sessionBasePath = path.join(process.cwd(), 'whatsapp-sessions');
    this.sessionDir = path.join(this.sessionBasePath, 'session-hotel-sales-bot');
    this.ensureSessionDirectory();
  }

  private ensureSessionDirectory() {
    if (!fs.existsSync(this.sessionBasePath)) {
      fs.mkdirSync(this.sessionBasePath, { recursive: true });
    }
  }

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize() {
    if (this.isInitializing) {
      this.logger.warn('WhatsApp client is already initializing');
      return;
    }

    this.isInitializing = true;

    try {
      // Limpiar cliente existente si existe
      if (this.client) {
        try {
          await this.client.destroy();
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          this.logger.warn('Error destroying previous client:', error);
        }
        this.client = null;
      }

      // Reiniciar contadores y estados
      this.qrAttempts = 0;
      this.qrCode = null;
      this._isConnected = false;

      const clientOptions: ClientOptions = {
        authStrategy: new LocalAuth({
          clientId: 'hotel-sales-bot',
          dataPath: this.sessionBasePath
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-background-networking',
            '--disable-default-apps',
            '--disable-sync'
          ],
          handleSIGINT: false,
          handleSIGTERM: false,
          handleSIGHUP: false,
          defaultViewport: null,
          ignoreHTTPSErrors: true
        }
      };

      this.client = new Client(clientOptions);
      this.setupClientListeners();
      
      try {
        await this.client.initialize();
        this.logger.log('WhatsApp client initialized successfully');
      } catch (initError) {
        this.logger.error('Detailed initialization error:', initError);
        
        // Additional retry logic
        if (this.qrAttempts < this.maxQrAttempts) {
          this.qrAttempts++;
          this.logger.warn(`Retrying initialization (Attempt ${this.qrAttempts})`);
          await this.initialize();
        } else {
          this.logger.error('Max initialization attempts reached');
          throw initError;
        }
      }
    } catch (error) {
      this.logger.error('Comprehensive WhatsApp client initialization error:', error);
      // Optionally, you can implement a retry mechanism or reset browser context here
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  private setupClientListeners() {
    this.client.on('qr', (qr) => {
      this.logger.log('QR Code received');
      this.qrCode = qr;
      this.qrAttempts++;
      
      if (this.qrAttempts >= this.maxQrAttempts) {
        this.logger.warn('Max QR attempts reached, reinitializing client...');
        this.initialize();
      }
    });

    this.client.on('ready', () => {
      this.logger.log('WhatsApp client is ready!');
      this._isConnected = true;
      this.qrCode = null;
      this.qrAttempts = 0;
      this.eventEmitter.emit('whatsapp.connected');
    });

    this.client.on('authenticated', () => {
      this.logger.log('WhatsApp client authenticated');
    });

    this.client.on('auth_failure', (error) => {
      this.logger.error('WhatsApp authentication failed:', error);
      this._isConnected = false;
      this.initialize();
    });

    this.client.on('disconnected', (reason) => {
      this.logger.warn('WhatsApp client disconnected:', reason);
      this._isConnected = false;
      this.eventEmitter.emit('whatsapp.disconnected');
      this.initialize();
    });

    this.client.on('message', async (message) => {
      this.logger.log(`New message from ${message.from}: ${message.body}`);
      
      try {
        // Buscar o crear la conversación primero
        let conversation = await this.chatbotService.findOrCreateConversation(message.from);
        
        // Emitir evento para que el sistema de conversaciones lo maneje
        this.eventEmitter.emit('whatsapp.message.received', {
          from: message.from,
          content: message.body,
          timestamp: message.timestamp,
          type: message.type,
          conversationId: conversation.id // Añadir el ID de la conversación
        });

        // Procesar el mensaje con el chatbot
        const response = await this.chatbotService.processMessage(
          message.body, 
          conversation.id.toString()
        );
        
        if (response) {
          await message.reply(response);
          this.logger.log(`Sent response to ${message.from}`);
        }
      } catch (error) {
        this.logger.error('Error processing message:', error);
      }
    });
  }

  async disconnect() {
    this.logger.log('Attempting to disconnect WhatsApp client...');
    
    if (this.client) {
      try {
        await this.client.destroy();
        this._isConnected = false;
        this.logger.log('WhatsApp client disconnected successfully');
      } catch (error) {
        this.logger.error('Error disconnecting WhatsApp client:', error);
        throw error;
      }
    }
  }

  async getConnectionStatus() {
    return {
      isConnected: this._isConnected,
      qrCode: this.qrCode,
      qrAttempts: this.qrAttempts,
      maxAttempts: this.maxQrAttempts
    };
  }

  async generateQR() {
    if (this._isConnected) {
      throw new Error('WhatsApp ya está conectado');
    }

    // Si el cliente no está inicializado o está desconectado, reiniciamos la conexión
    if (!this.client || !this._isConnected) {
      await this.resetConnection();
    }

    // Esperamos hasta que se genere un código QR o se conecte
    let attempts = 0;
    const maxWaitAttempts = 30; // 30 segundos máximo de espera
    
    while (!this.qrCode && !this._isConnected && attempts < maxWaitAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (this._isConnected) {
      return {
        status: 'connected',
        qr: null,
        attempts: this.qrAttempts
      };
    }

    if (!this.qrCode) {
      throw new Error('No se pudo generar el código QR');
    }

    return {
      status: this._isConnected ? 'connected' : 'disconnected',
      qr: this.qrCode,
      attempts: this.qrAttempts
    };
  }

  async sendMessage(to: string, message: string) {
    if (!this._isConnected) {
      throw new Error('WhatsApp client is not connected');
    }

    try {
      const formattedNumber = this.formatPhoneNumber(to);
      await this.client.sendMessage(`${formattedNumber}@c.us`, message);
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      this.logger.error('Error sending WhatsApp message:', error);
      return { success: false, error: error.message };
    }
  }

  private formatPhoneNumber(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  async resetConnection() {
    try {
      await this.disconnect();
      await this.initialize();
    } catch (error) {
      this.logger.error('Error resetting connection:', error);
      throw error;
    }
  }
}
