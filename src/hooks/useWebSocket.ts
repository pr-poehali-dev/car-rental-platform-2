
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

// Типы сообщений
export enum WebSocketMessageType {
  BOOKING_CREATED = 'booking_created',
  BOOKING_UPDATED = 'booking_updated',
  BOOKING_CANCELLED = 'booking_cancelled',
  CAR_STATUS_CHANGED = 'car_status_changed',
  PAYMENT_RECEIVED = 'payment_received',
  SYSTEM_NOTIFICATION = 'system_notification'
}

// Интерфейс для сообщений WebSocket
export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  showToasts?: boolean;
}

const useWebSocket = ({
  url,
  autoReconnect = true,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
  onOpen,
  onClose,
  onError,
  onMessage,
  showToasts = true
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const reconnectAttemptsRef = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);

  // Функция для установки соединения
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(url);
    
    socket.addEventListener('open', (event) => {
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      if (onOpen) onOpen(event);
      if (showToasts) {
        toast({
          title: 'Подключено к серверу',
          description: 'Теперь вы будете получать уведомления в реальном времени',
        });
      }
    });

    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        setMessages((prev) => [...prev, message]);
        
        if (onMessage) onMessage(message);
        
        // Показываем уведомления на основе типа сообщения, если включено
        if (showToasts) {
          switch (message.type) {
            case WebSocketMessageType.BOOKING_CREATED:
              toast({
                title: 'Новое бронирование',
                description: `Клиент ${message.data.customerName} забронировал ${message.data.carName}`,
              });
              break;
            case WebSocketMessageType.BOOKING_UPDATED:
              toast({
                title: 'Бронирование обновлено',
                description: `Бронирование #${message.data.id} было изменено`,
              });
              break;
            case WebSocketMessageType.BOOKING_CANCELLED:
              toast({
                title: 'Бронирование отменено',
                description: `Бронирование #${message.data.id} было отменено`,
                variant: 'destructive'
              });
              break;
            case WebSocketMessageType.PAYMENT_RECEIVED:
              toast({
                title: 'Получен платеж',
                description: `Платеж на сумму ${message.data.amount} ₽ за бронирование #${message.data.bookingId}`,
                variant: 'default'
              });
              break;
            case WebSocketMessageType.SYSTEM_NOTIFICATION:
              toast({
                title: message.data.title || 'Системное уведомление',
                description: message.data.message,
                variant: message.data.variant || 'default'
              });
              break;
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    socket.addEventListener('close', (event) => {
      setIsConnected(false);
      if (onClose) onClose(event);
      
      // Логика переподключения
      if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        if (showToasts) {
          toast({
            title: 'Соединение потеряно',
            description: `Попытка переподключения через ${reconnectInterval / 1000} секунд...`,
            variant: 'destructive'
          });
        }
        
        reconnectAttemptsRef.current += 1;
        setTimeout(() => connect(), reconnectInterval);
      } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        if (showToasts) {
          toast({
            title: 'Ошибка соединения',
            description: 'Не удалось подключиться к серверу уведомлений. Попробуйте позже.',
            variant: 'destructive'
          });
        }
      }
    });

    socket.addEventListener('error', (event) => {
      if (onError) onError(event);
      console.error('WebSocket error:', event);
    });

    wsRef.current = socket;
  }, [url, autoReconnect, reconnectInterval, maxReconnectAttempts, onOpen, onClose, onError, onMessage, showToasts]);

  // Функция для отправки сообщения
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected.');
    }
  }, []);

  // Функция для закрытия соединения
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Установка соединения при монтировании компонента
  useEffect(() => {
    connect();

    // Очистка при размонтировании
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    messages,
    sendMessage,
    connect,
    disconnect
  };
};

export default useWebSocket;
