import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores y transformar respuestas
api.interceptors.response.use(
  response => {
    // Si la respuesta ya tiene la estructura correcta, la devolvemos
    if (response.data?.success !== undefined) {
      return response.data;
    }
    
    // Si la respuesta está anidada en data.data, la normalizamos
    if (response.data?.data?.success !== undefined) {
      return response.data.data;
    }

    // Si no tiene la estructura esperada, la envolvemos en un ApiResponse
    return {
      success: true,
      data: response.data
    };
  },
  error => {
    console.error('API Error:', error);
    
    // Si hay una respuesta del servidor
    if (error.response) {
      const errorResponse = error.response.data;
      
      // Si ya tiene el formato ApiResponse, lo devolvemos
      if (errorResponse?.success === false) {
        return Promise.reject(errorResponse);
      }
      
      // Si no, creamos un ApiResponse con el error
      const message = errorResponse?.message || 'Error en la respuesta del servidor';
      const details = errorResponse?.details;
      
      return Promise.reject({
        success: false,
        message: details ? `${message}: ${JSON.stringify(details)}` : message,
        error: errorResponse
      });
    }
    
    // Si no hay respuesta del servidor
    return Promise.reject({
      success: false,
      message: 'Error de conexión con el servidor',
      error: error
    });
  }
);

export interface Room {
  id: number;
  type: string;
  price: number;
  available: boolean;
  description?: string;
}

export interface Message {
  id: number;
  conversationId: number;
  sender: 'user' | 'assistant';
  content: string;
  messageType: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  userId: string;
  whatsappId: string;
  status: 'active' | 'closed';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SalesScript {
  id: number;
  name: string;
  content: string;
  type: string;
  active: boolean;
}

export interface WhatsAppStatus {
  isConnected: boolean;
  qrCode: string | null;
  qrAttempts: number;
  maxAttempts: number;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
}

export interface WhatsAppQR {
  qr: string | null;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  attempts: number;
}

export interface Settings {
  currency: string;
  language: string;
  timeZone: string;
  welcomeMessage: string;
  businessName: string;
  businessHours: string;
  notificationEmail?: string;
}

export interface CreateMessageDto {
  content: string;
  sender?: 'user' | 'assistant';
  messageType?: 'text' | 'image' | 'location' | 'video' | 'audio';
  requireValidation?: boolean;
  messageId?: string;
}

const hotelApi = {
  // HTTP Methods
  get: <T>(url: string) => api.get<T>(url),
  post: <T>(url: string, data?: any) => api.post<T>(url, data),
  put: <T>(url: string, data: any) => api.put<T>(url, data),
  patch: <T>(url: string, data: any) => api.patch<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),

  // Rooms
  getRooms: () => api.get<ApiResponse<Room[]>>('/hotel/rooms'),
  getAvailableRooms: (date?: string) => api.get<ApiResponse<Room[]>>(`/hotel/rooms/available${date ? `?date=${date}` : ''}`),
  updateRoom: (id: number, data: Partial<Room>) => api.put<ApiResponse<Room>>(`/hotel/rooms/${id}`, data),

  // Conversations
  getConversations: () => api.get<ApiResponse<Conversation[]>>('/hotel/conversations'),
  getConversation: (id: number) => api.get<ApiResponse<Conversation>>(`/hotel/conversations/${id}`),
  updateConversationStatus: (id: number, status: 'active' | 'closed') => 
    api.patch<ApiResponse<Conversation>>(`/hotel/conversations/${id}`, { status }),

  // Send a message in a conversation
  sendMessage: (conversationId: number, content: string) => 
    api.post<ApiResponse<Message>>(`/hotel/conversations/${conversationId}/messages`, {
      content,
      sender: 'user',
      messageType: 'text',
      timestamp: new Date().toISOString()
    }),

  // WhatsApp
  getWhatsAppStatus: () => api.get<ApiResponse<WhatsAppStatus>>('/hotel/whatsapp/status'),
  generateWhatsAppQR: () => api.post<ApiResponse<WhatsAppQR>>('/hotel/whatsapp/qr'),
  sendWhatsAppMessage: (to: string, message: string) => 
    api.post<ApiResponse<SendMessageResponse>>('/hotel/whatsapp/message', { to, message }),
  resetWhatsAppConnection: () => api.post<ApiResponse<{ success: boolean; message: string }>>('/hotel/whatsapp/reset'),
  disconnectWhatsApp: () => api.post<ApiResponse<{ success: boolean; message: string }>>('/hotel/whatsapp/disconnect'),

  // Settings
  getSettings: () => api.get<ApiResponse<Settings>>('/hotel/settings'),
  updateSettings: (settings: Partial<Settings>) => api.put<ApiResponse<Settings>>('/hotel/settings', settings),

  // Sales Scripts
  getSalesScripts: () => api.get<ApiResponse<SalesScript[]>>('/hotel/sales-scripts'),
  updateSalesScript: (id: number, data: Partial<SalesScript>) => 
    api.put<ApiResponse<SalesScript>>(`/hotel/sales-scripts/${id}`, data),
  createSalesScript: (data: Omit<SalesScript, 'id'>) => 
    api.post<ApiResponse<SalesScript>>('/hotel/sales-scripts', data),
};

export type {
  Room,
  Message,
  Conversation,
  ApiResponse,
  SalesScript,
  WhatsAppStatus,
  SendMessageResponse,
  WhatsAppQR,
  Settings,
  CreateMessageDto
};

export { api, hotelApi };
export default hotelApi;
