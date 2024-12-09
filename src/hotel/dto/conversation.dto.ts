export class CreateConversationDto {
  userId: string;
  whatsappId?: string;
}

export class UpdateConversationDto {
  status?: 'active' | 'closed';
}

export class CreateMessageDto {
  content: string;
  sender?: 'user' | 'assistant';
  messageId?: string;
}
