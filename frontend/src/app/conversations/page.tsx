import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo 
} from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient 
} from 'react-query';
import { 
  formatDistanceToNow, 
  parseISO, 
  format 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Search, 
  MessageSquare, 
  Phone, 
  User, 
  Clock, 
  Send, 
  Menu, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import ErrorMessage from '../../components/ErrorMessage';
import { hotelApi, Conversation, Message } from '../../lib/api';
import { toast } from '../../components/ui/use-toast';
import useMediaQuery from '../../hooks/use-media-query';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && selectedConversation) {
      setShowSidebar(false);
    }
  }, [selectedConversation, isMobile]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await hotelApi.getConversations();
        
        if (isSubscribed) {
          if (response.success) {
            // Actualizar las conversaciones manteniendo la seleccionada
            setConversations(prevConversations => {
              const updatedConversations = response.data;
              
              // Si hay una conversación seleccionada, actualizar sus mensajes
              if (selectedConversation) {
                const updatedSelectedConv = updatedConversations.find(
                  conv => conv.id === selectedConversation.id
                );
                
                if (updatedSelectedConv && 
                    updatedSelectedConv.messages.length !== selectedConversation.messages.length) {
                  setSelectedConversation(updatedSelectedConv);
                }
              }
              
              return updatedConversations;
            });
          } else {
            setError(response.error || 'No se pudieron cargar las conversaciones');
          }
        }
      } catch (err) {
        if (isSubscribed) {
          console.error('Error fetching conversations:', err);
          setError('Error al cargar las conversaciones');
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    // Primera carga
    fetchConversations();

    // Configurar intervalo de actualización más largo (15 segundos)
    const interval = setInterval(fetchConversations, 15000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [selectedConversation?.id]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;
    
    try {
      const messageCopy = newMessage; // Guardar copia del mensaje
      setNewMessage(''); // Limpiar input inmediatamente para mejor UX
      
      const response = await hotelApi.sendMessage(selectedConversation.id, messageCopy);
      if (response?.data) {
        const message = response.data;
        
        setSelectedConversation(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, message]
          };
        });
        
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { 
                  ...conv, 
                  messages: [...conv.messages, message],
                  updatedAt: new Date().toISOString()
                }
              : conv
          )
        );
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje');
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowSidebar(true);
      setSelectedConversation(null);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100">
      <div className="flex h-full relative">
        {/* Conversations List */}
        <div 
          className={cn(
            "w-full md:w-1/3 bg-white shadow-lg absolute md:relative z-10 transition-transform duration-300 ease-in-out",
            !showSidebar && "transform -translate-x-full md:translate-x-0"
          )}
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Conversaciones</h2>
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No hay conversaciones
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={cn(
                    "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedConversation?.id === conversation.id && "bg-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="text-primary" />
                      <div>
                        <p className="font-semibold">{conversation.userId}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">
                          {conversation.messages.length > 0 
                            ? conversation.messages[conversation.messages.length - 1].content 
                            : 'Sin mensajes'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {conversation.updatedAt 
                        ? formatDistanceToNow(parseISO(conversation.updatedAt), { locale: es }) 
                        : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation Details */}
        {selectedConversation ? (
          <div className="w-full md:w-2/3 bg-gray-50 flex flex-col relative">
            {/* Mobile back button */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackToList} 
                className="absolute top-2 left-2 z-10"
              >
                <ArrowLeft />
              </Button>
            )}

            {/* Conversation Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="text-primary" size={24} />
                <div>
                  <p className="font-semibold">{selectedConversation.userId}</p>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.messages
