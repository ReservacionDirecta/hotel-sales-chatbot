import { Controller, Get, Post, Delete, Body, HttpException, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

class LinkPhoneNumberDto {
  phoneNumber: string;
}

@Controller('hotel/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('status')
  async getStatus() {
    try {
      const status = await this.whatsappService.getConnectionStatus();
      const isConnected = await this.whatsappService.isConnected();
      return {
        success: true,
        data: { ...status, isConnected }
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener el estado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('qr')
  async getQR() {
    try {
      const qrData = await this.whatsappService.generateQR();
      return {
        success: true,
        data: qrData
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('qr')
  async generateQR() {
    try {
      const result = await this.whatsappService.generateQR();
      if (!result.qr && result.status === 'connected') {
        return {
          message: 'WhatsApp ya está conectado',
          status: result.status,
          isConnected: true
        };
      }
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al generar el código QR',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('link-phone')
  async linkPhoneNumber(@Body() body: LinkPhoneNumberDto) {
    try {
      const success = await this.whatsappService.linkPhoneNumber(body.phoneNumber);
      return { 
        success,
        message: success ? 'Número vinculado exitosamente' : 'Error al vincular el número'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al vincular el número de teléfono',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('reload')
  async reloadChats() {
    try {
      const result = await this.whatsappService.reloadChats();
      return {
        success: true,
        data: result,
        message: 'Conversaciones recargadas exitosamente'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al recargar las conversaciones',
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('disconnect')
  async disconnect() {
    try {
      await this.whatsappService.disconnect();
      return { success: true, message: 'Desconectado exitosamente' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al desconectar',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
