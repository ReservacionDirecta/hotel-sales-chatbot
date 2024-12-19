import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error);
    return Promise.reject(error);
  }
);

// Types
export interface Conversation {
  id: number;
  userId: string;
  whatsappId: string;
  status: 'active' | 'closed' | 'archived';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  content: string;
  sender: string;
  messageType: string;
  timestamp: string;
  messageId: string;
}

// API functions
export const getConversations = async (): Promise<{ data: Conversation[] }> => {
  try {
    const response = await api.get<{ data: Conversation[] }>('/hotel/conversations');
    return {
      data: Array.isArray(response.data) ? response.data : 
            Array.isArray(response.data.data) ? response.data.data : []
    };
  } catch (error) {
    throw error;
  }
};

export const getConversation = async (id: number) => {
  try {
    const response = await api.get(`/hotel/conversations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createConversation = async (data: { userId: string; whatsappId?: string }) => {
  try {
    const response = await api.post('/hotel/conversations', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateConversationStatus = async (id: number, status: 'active' | 'closed' | 'archived') => {
  try {
    console.log('Updating conversation status:', { id, status });
    const response = await api.patch(`/hotel/conversations/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating conversation status:', (error as any).response?.data || error);
    throw error;
  }
};

export const addMessage = async (conversationId: number, message: {
  content: string;
  sender?: 'user' | 'assistant';
  messageType?: string;
}) => {
  try {
    const response = await api.post(`/hotel/conversations/${conversationId}/messages`, message);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchConversations = async (query: string) => {
  try {
    const response = await api.get(`/hotel/conversations/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
