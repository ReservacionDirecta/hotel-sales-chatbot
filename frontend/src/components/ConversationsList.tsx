'use client';

import { useEffect, useState } from 'react';
import hotelApi from '../lib/api';
import { Button } from './ui/button';
import { PhoneIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  createdAt: string;
}

interface Conversation {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
  customerName?: string;
  email?: string;
  salesStage: 'initial' | 'interested' | 'quotation' | 'negotiation' | 'booked' | 'cancelled';
  messages: Message[];
}

interface ApiResponse {
  success: boolean;
  data: any;
}

const getSalesStageColor = (stage: Conversation['salesStage']) => {
  const colors = {
    initial: 'bg-gray-200',
    interested: 'bg-blue-200',
    quotation: 'bg-yellow-200',
    negotiation: 'bg-orange-200',
    booked: 'bg-green-200',
    cancelled: 'bg-red-200'
  };
  return colors[stage] || colors.initial;
};

const getSalesStageLabel = (stage: Conversation['salesStage']) => {
  const labels = {
    initial: 'Contacto Inicial',
    interested: 'Interesado',
    quotation: 'Cotización',
    negotiation: 'Negociación',
    booked: 'Reservado',
    cancelled: 'Cancelado'
  };
  return labels[stage] || labels.initial;
};

const formatPhoneNumber = (phoneNumber: string | undefined) => {
  if (!phoneNumber) return '';
  
  // Eliminar todo excepto números
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Formato: +XX XXX XXX XXXX
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  
  return phoneNumber;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => console.log('Número copiado al portapapeles'),
    (err) => console.error('Error al copiar:', err)
  );
};

export default function ConversationsList() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<boolean>(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await hotelApi.getWhatsAppStatus();
        if (response.success) {
          setWhatsappStatus(response.data.isConnected);
        }
      } catch (error) {
        console.error('Error checking WhatsApp status:', error);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await hotelApi.getConversations();
        if (response.success && response.data) {
          setConversations(response.data);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError('Error al cargar las conversaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Cargando conversaciones...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (conversations.length === 0) {
    return <div className="p-6 text-center">No hay conversaciones activas</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className={`p-2 rounded-lg ${whatsappStatus ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className="text-sm">
          WhatsApp está {whatsappStatus ? 'conectado' : 'desconectado'}
        </p>
      </div>
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        
        return (
          <div key={conversation.id} className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">
                  {conversation.customerName || 'Cliente sin nombre'}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <PhoneIcon className="h-4 w-4 text-gray-500" />
                  <a 
                    href={`tel:${conversation.phoneNumber}`}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {formatPhoneNumber(conversation.phoneNumber)}
                  </a>
                  <button
                    onClick={() => copyToClipboard(conversation.phoneNumber)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Copiar número"
                  >
                    <ClipboardIcon className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                {conversation.email && (
                  <p className="text-sm text-gray-600">{conversation.email}</p>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${getSalesStageColor(conversation.salesStage)}`}>
                {getSalesStageLabel(conversation.salesStage)}
              </div>
            </div>
            
            {lastMessage && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{lastMessage.sender === 'user' ? 'Cliente' : 'Asistente'}: </span>
                  {lastMessage.content.length > 100 
                    ? `${lastMessage.content.substring(0, 100)}...` 
                    : lastMessage.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(lastMessage.createdAt).toLocaleString()}
                </p>
              </div>
            )}
            
            <div className="mt-3 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Creado: {new Date(conversation.createdAt).toLocaleDateString()}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/conversations/${conversation.id}`)}
              >
                Ver detalles
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
