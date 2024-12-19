'use client';

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { hotelApi } from '@/lib/api'; // Import hotelApi service

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  messageType?: 'text' | 'image' | 'file';
  requireValidation?: boolean;
  isValidated?: boolean;
  validatedBy?: string;
  validatedAt?: Date;
  metadata?: {
    roomInfo?: {
      type: string;
      price: number;
      available: boolean;
    };
    reservationInfo?: {
      checkIn?: string;
      checkOut?: string;
      guests?: number;
    };
  };
}

interface ChatProps {
  conversationId?: number;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
}

export default function Chat({ conversationId, initialMessages = [] }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [requireValidation, setRequireValidation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const inputRef = useRef<string>('');
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout: NodeJS.Timeout;

  // Keep input value in ref to prevent loss during re-renders
  useEffect(() => {
    inputRef.current = inputMessage;
  }, [inputMessage]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Load initial messages only once
  useEffect(() => {
    if (conversationId) {
      loadInitialMessages();
    }
  }, [conversationId]); // Only depend on conversationId

  // Auto-scroll for new messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]); // Only depend on messages.length

  // Manejar scroll infinito
  useEffect(() => {
    const handleScroll = async () => {
      if (!chatContainerRef.current || isLoadingMore || !hasMoreMessages) return;

      const { scrollTop } = chatContainerRef.current;
      if (scrollTop === 0) {
        await loadMoreMessages();
      }
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isLoadingMore, hasMoreMessages]);

  const loadInitialMessages = async () => {
    if (!conversationId || isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await hotelApi.getConversation(conversationId);
      if (response.success && response.data) {
        const newMessages = response.data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages(prev => {
          const prevIds = new Set(prev.map(msg => msg.id));
          const hasNewMessages = newMessages.some(msg => !prevIds.has(msg.id));
          return hasNewMessages ? newMessages : prev;
        });
      }
    } catch (error) {
      setError('Error al cargar el historial de mensajes');
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!conversationId || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const oldestMessageId = messages[0]?.id;
      const response = await fetch(
        `/api/conversations/${conversationId}/messages?before=${oldestMessageId}`
      );
      
      if (!response.ok) throw new Error('Error al cargar más mensajes');
      
      const data = await response.json();
      if (data.success) {
        const newMessages = data.data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        if (newMessages.length === 0) {
          setHasMoreMessages(false);
        } else {
          setMessages(prev => [...newMessages, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Mostrar indicador de escritura
    if (!isTyping) {
      setIsTyping(true);
      // Emitir evento de "escribiendo" al backend
      if (conversationId) {
        hotelApi.sendTypingStatus(conversationId, true);
      }
    }
    
    // Limpiar el timeout anterior
    clearTimeout(typingTimeout);
    
    // Establecer nuevo timeout
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      // Emitir evento de "dejó de escribir" al backend
      if (conversationId) {
        hotelApi.sendTypingStatus(conversationId, false);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isPaused || isLoading) return;

    const tempMessage = inputMessage;
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content: tempMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add optimistic update
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input only after we've stored the message
    setInputMessage('');
    setError(null);
  
    try {
      const response = await hotelApi.sendMessage(conversationId || 1, tempMessage);
      
      if (response.success) {
        // Update the temporary message with the real one
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...response.data, timestamp: new Date(response.data.timestamp) }
              : msg
          )
        );
      } else {
        throw new Error(response.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setError('Error al enviar el mensaje. Por favor, intenta nuevamente.');
      
      // Remove the failed message
      setMessages(prev =>
        prev.filter(msg => msg.id !== userMessage.id)
      );
      
      // Restore the input message
      setInputMessage(tempMessage);
    }
  };

  const handleValidateMessage = async (messageId: string, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved }),
      });

      if (!response.ok) throw new Error('Error al validar el mensaje');

      const data = await response.json();
      if (data.success) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? {
                  ...msg,
                  isValidated: true,
                  requireValidation: false,
                  validatedAt: new Date(),
                  validatedBy: 'current-user', // Idealmente, obtener el usuario actual
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error validating message:', error);
      setError('Error al validar el mensaje');
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    return format(timestamp, 'dd MMM, HH:mm', { locale: es });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Chat de Ventas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1 rounded text-sm ${
              isPaused ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {isPaused ? 'Reanudar' : 'Pausar'}
          </button>
          <button
            onClick={() => setRequireValidation(!requireValidation)}
            className={`px-3 py-1 rounded text-sm ${
              requireValidation ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
            }`}
          >
            Validación: {requireValidation ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {isLoadingMore && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.sender === 'system'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {message.metadata?.roomInfo && (
                <div className="mt-2 p-2 bg-white bg-opacity-10 rounded">
                  <p className="font-semibold">Información de la habitación:</p>
                  <p>Tipo: {message.metadata.roomInfo.type}</p>
                  <p>Precio: ${message.metadata.roomInfo.price}</p>
                  <p>Estado: {message.metadata.roomInfo.available ? 'Disponible' : 'No disponible'}</p>
                </div>
              )}

              {message.requireValidation && !message.isValidated && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleValidateMessage(message.id, true)}
                    className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleValidateMessage(message.id, false)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Rechazar
                  </button>
                </div>
              )}

              {message.isValidated && (
                <div className="mt-1 text-xs opacity-75">
                  ✓ Validado por {message.validatedBy} el{' '}
                  {message.validatedAt && formatMessageTime(message.validatedAt)}
                </div>
              )}

              <div className="mt-1 text-xs opacity-75 flex justify-between items-center">
                <span>{formatMessageTime(message.timestamp)}</span>
                {message.messageType === 'error' && (
                  <span className="text-red-300">Error al enviar</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <textarea
            value={inputRef.current}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={isPaused ? "Chat en pausa" : "Escribe tu mensaje aquí..."}
            className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            disabled={isPaused || isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isPaused || isLoading || !inputMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
        {isTyping && (
          <div className="text-sm text-gray-500 mt-2">
            Escribiendo...
          </div>
        )}
      </div>
    </div>
  );
}
