import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { PhoneIcon, EnvelopeIcon, ArrowLeftIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/ui/button';
import ChatWindow from '../../../components/ChatWindow';
import { hotelApi } from '../../../lib/api';
import { toast } from '../../../components/ui/use-toast';

type SalesStage = 'initial' | 'interested' | 'quotation' | 'negotiation' | 'booked' | 'cancelled';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  createdAt?: string;
  messageType?: string;
}

interface Conversation {
  id: string;
  status: 'active' | 'closed';
  createdAt?: string;
  updatedAt?: string;
  phoneNumber?: string;
  customerName?: string;
  email?: string;
  salesStage?: SalesStage;
  messages: Message[];
  whatsappId?: string;
}

const getSalesStageColor = (stage: SalesStage | undefined) => {
  const colors: Record<SalesStage, string> = {
    initial: 'bg-gray-200',
    interested: 'bg-blue-200',
    quotation: 'bg-yellow-200',
    negotiation: 'bg-purple-200',
    booked: 'bg-green-200',
    cancelled: 'bg-red-200'
  };
  return stage ? colors[stage] || colors.initial : colors.initial;
};

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  
  const isMobile = true;
  const queryClient = useQueryClient();

  // Fetch conversations with React Query
  const { data: conversations = [], isLoading, error } = useQuery(
    'conversations',
    () => hotelApi.getConversations(),
    {
      refetchInterval: 15000,
      select: (data) => data.data || []
    }
  );

  // Handle conversation selection
  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // Handle back to list
  const handleBackToList = () => {
    if (isMobile) {
      setShowSidebar(true);
      setSelectedConversation(null);
    }
  };

  // Filter conversations
  const filteredConversations = (conversations as Conversation[]).filter((conv: Conversation) => 
    conv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages.some((msg: Message) => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-4">
        Error
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100">
      <div className="flex h-full relative">
        {/* Conversations List */}
        <div 
          className="w-full md:w-1/3 bg-white shadow-lg absolute md:relative z-10 transition-transform duration-300 ease-in-out"
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Conversaciones</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-8rem)]">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No se encontraron conversaciones
              </div>
            ) : (
              filteredConversations.map((conversation: Conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className="w-full p-4 text-left border-b hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.customerName || 'Sin nombre'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.updatedAt 
                            ? formatDistanceToNow(new Date(conversation.updatedAt), {
                                addSuffix: true,
                                locale: es,
                              }) 
                            : 'N/A'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.messages[conversation.messages.length - 1]?.content || 'Sin mensajes'}
                      </p>
                      <div className="mt-1">
                        <span
                          className={
                            conversation.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {conversation.status === 'active' ? 'Activa' : 'Cerrada'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <div>Conversation Detail Component</div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Selecciona una conversación
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
