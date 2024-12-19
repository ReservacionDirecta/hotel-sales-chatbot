import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('hotel/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('status')
  async getStatus() {
    try {
      const status = await this.whatsappService.getConnectionStatus();
      return {
        success: true,
        data: status
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al obtener el estado de WhatsApp: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('message')
  async sendMessage(@Body() messageDto: SendMessageDto) {
    try {
      const result = await this.whatsappService.sendMessage(
        messageDto.to,
        messageDto.message
      );
      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al enviar mensaje: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reset')
  async resetConnection() {
    try {
      await this.whatsappService.resetConnection();
      return {
        success: true,
        message: 'Conexión reiniciada exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al reiniciar la conexión: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('qr')
  async generateQR() {
    try {
      const qrData = await this.whatsappService.generateQR();
      return {
        success: true,
        data: qrData
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al generar código QR: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('disconnect')
  async disconnect() {
    try {
      await this.whatsappService.disconnect();
      return {
        success: true,
        message: 'Desconectado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al desconectar: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
