export class CreateConversationDto {
  userId: string;
  whatsappId?: string;
}

export class UpdateConversationDto {
  status: 'active' | 'closed' | 'archived';
}

export class CreateMessageDto {
  content: string;
  sender?: 'user' | 'assistant';
  messageId?: string;
  messageType?: 'text' | 'image' | 'location' | 'video' | 'audio';
  requireValidation?: boolean;
  timestamp?: Date;
}
