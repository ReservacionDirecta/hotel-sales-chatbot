import { Injectable } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Injectable()
export class ConversationsGateway {
  constructor(private conversationsService: ConversationsService) {}

  afterInit() {
    // Implement afterInit logic
  }

  handleConnection() {
    // Implement handleConnection logic
  }

  handleDisconnect() {
    // Implement handleDisconnect logic
  }

  async addMessage(message: any): Promise<any> {
    return this.conversationsService.addMessage(message);
  }

  async updateStatus(status: any): Promise<any> {
    return this.conversationsService.updateStatus(status);
  }
}
