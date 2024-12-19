export interface SalesScript {
  id: number;
  type: string;
  content: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Room {
  id: number;
  type: string;
  price: number;
  description?: string;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  messageType: string;
  timestamp: Date;
  messageId: string;
  conversationId: number;
}

export interface Conversation {
  id: number;
  userId: string;
  whatsappId: string;
  status: 'active' | 'closed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}
