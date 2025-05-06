
import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useWebSocket, { WebSocketMessageType, WebSocketMessage } from '@/hooks/useWebSocket';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const NOTIFICATION_SOUNDS = {
  booking: new Audio('/sounds/booking.mp3'),
  message: new Audio('/sounds/message.mp3'),
  error: new Audio('/sounds/error.mp3')
};

interface NotificationItem extends WebSocketMessage {
  read: boolean;
  id: string;
}

interface NotificationsCenterProps {
  enableSound?: boolean;
  className?: string;
}

const NotificationsCenter = ({ enableSound = true, className }: NotificationsCenterProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const [desktopEnabled, setDesktopEnabled] = useState(false);
  const hasRequestedPermission = useRef(false);

  // WebSocket подключение
  const { isConnected, messages } = useWebSocket({
    url: 'wss://api.auto.ru/notifications', // В реальном приложении должен быть рабочий URL
    showToasts: false, // Отключаем тосты по умолчанию, так как сами управляем уведомлениями
    onMessage: (message) => {
      handleNewNotification(message);
    }
  });

  // Запрос разрешения на десктопные уведомления
  useEffect(() => {
    if (desktopEnabled && !hasRequestedPermission.current && "Notification" in window) {
      hasRequestedPermission.current = true;
      Notification.requestPermission();
    }
  }, [desktopEnabled]);

  // Обработка входящих уведомлений
  const handleNewNotification = (message: WebSocketMessage) => {
    // Создаем уникальный ID для уведомления
    const newNotification: NotificationItem = {
      ...message,
      read: false,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    // Добавляем уведомление в список
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Проигрываем звук уведомления, если включено
    if (soundEnabled) {
      switch (message.type) {
        case WebSocketMessageType.BOOKING_CREATED:
        case WebSocketMessageType.BOOKING_UPDATED:
          NOTIFICATION_SOUNDS.booking.play();
          break;
        case WebSocketMessageType.SYSTEM_NOTIFICATION:
          NOTIFICATION_SOUNDS.message.play();
          break;
        case WebSocketMessageType.BOOKING_CANCELLED:
          NOTIFICATION_SOUNDS.error.play();
          break;
        default:
          NOTIFICATION_SOUNDS.message.play();
      }
    }

    // Отправляем десктопное уведомление, если разрешено
    if (desktopEnabled && Notification.permission === 'granted') {
      let title = 'Новое уведомление';
      let body = '';
      
      switch (message.type) {
        case WebSocketMessageType.BOOKING_CREATED:
          title = 'Новое бронирование';
          body = `Клиент ${message.data.customerName} забронировал ${message.data.carName}`;
          break;
        case WebSocketMessageType.BOOKING_UPDATED:
          title = 'Бронирование обновлено';
          body = `Бронирование #${message.data.id} было изменено`;
          break;
        case WebSocketMessageType.BOOKING_CANCELLED:
          title = 'Бронирование отменено';
          body = `Бронирование #${message.data.id} было отменено`;
          break;
        case WebSocketMessageType.PAYMENT_RECEIVED:
          title = 'Получен платеж';
          body = `Платеж на сумму ${message.data.amount} ₽ за бронирование #${message.data.bookingId}`;
          break;
        case WebSocketMessageType.SYSTEM_NOTIFICATION:
          title = message.data.title || 'Системное уведомление';
          body = message.data.message;
          break;
      }
      
      new Notification(title, { 
        body, 
        icon: '/logo.svg' 
      });
    }
  };

  // Помечаем уведомление как прочитанное
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    updateUnreadCount();
  };

  // Удаляем уведомление
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    updateUnreadCount();
  };

  // Обновляем счетчик непрочитанных уведомлений
  const updateUnreadCount = () => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  };

  // Помечаем все уведомления как прочитанные
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Очищаем все уведомления
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Получение иконки в зависимости от типа уведомления
  const getNotificationIcon = (type: WebSocketMessageType) => {
    switch (type) {
      case WebSocketMessageType.BOOKING_CREATED:
        return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <Check className="h-4 w-4 text-green-600" />
        </div>;
      case WebSocketMessageType.BOOKING_UPDATED:
        return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </div>;
      case WebSocketMessageType.BOOKING_CANCELLED:
        return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
          <X className="h-4 w-4 text-red-600" />
        </div>;
      case WebSocketMessageType.PAYMENT_RECEIVED:
        return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6" />
            <path d="M12 18v2" />
            <path d="M12 4v2" />
          </svg>
        </div>;
      default:
        return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          <Bell className="h-4 w-4 text-gray-600" />
        </div>;
    }
  };

  // Получение заголовка уведомления
  const getNotificationTitle = (notification: NotificationItem) => {
    switch (notification.type) {
      case WebSocketMessageType.BOOKING_CREATED:
        return 'Новое бронирование';
      case WebSocketMessageType.BOOKING_UPDATED:
        return 'Бронирование обновлено';
      case WebSocketMessageType.BOOKING_CANCELLED:
        return 'Бронирование отменено';
      case WebSocketMessageType.CAR_STATUS_CHANGED:
        return 'Статус автомобиля изменен';
      case WebSocketMessageType.PAYMENT_RECEIVED:
        return 'Получен платеж';
      case WebSocketMessageType.SYSTEM_NOTIFICATION:
        return notification.data.title || 'Системное уведомление';
      default:
        return 'Уведомление';
    }
  };

  // Получение текста уведомления
  const getNotificationContent = (notification: NotificationItem) => {
    switch (notification.type) {
      case WebSocketMessageType.BOOKING_CREATED:
        return `Клиент ${notification.data.customerName} забронировал ${notification.data.carName} с ${format(new Date(notification.data.startDate), 'd MMMM', { locale: ru })} по ${format(new Date(notification.data.endDate), 'd MMMM', { locale: ru })}`;
      case WebSocketMessageType.BOOKING_UPDATED:
        return `Бронирование #${notification.data.id} было изменено`;
      case WebSocketMessageType.BOOKING_CANCELLED:
        return `Бронирование #${notification.data.id} было отменено`;
      case WebSocketMessageType.CAR_STATUS_CHANGED:
        return `Статус автомобиля ${notification.data.carName} изменен на "${notification.data.newStatus}"`;
      case WebSocketMessageType.PAYMENT_RECEIVED:
        return `Платеж на сумму ${notification.data.amount} ₽ за бронирование #${notification.data.bookingId}`;
      case WebSocketMessageType.SYSTEM_NOTIFICATION:
        return notification.data.message;
      default:
        return '';
    }
  };

  // Добавление тестового уведомления (для демонстрации)
  const addTestNotification = () => {
    const types = Object.values(WebSocketMessageType);
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    let data;
    switch (randomType) {
      case WebSocketMessageType.BOOKING_CREATED:
        data = {
          id: `B${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: 'Иван Петров',
          carName: 'BMW X5',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      case WebSocketMessageType.BOOKING_UPDATED:
      case WebSocketMessageType.BOOKING_CANCELLED:
        data = {
          id: `B${Math.floor(1000 + Math.random() * 9000)}`,
        };
        break;
      case WebSocketMessageType.CAR_STATUS_CHANGED:
        data = {
          carName: 'Toyota Camry',
          newStatus: 'Арендован',
        };
        break;
      case WebSocketMessageType.PAYMENT_RECEIVED:
        data = {
          bookingId: `B${Math.floor(1000 + Math.random() * 9000)}`,
          amount: Math.floor(5000 + Math.random() * 15000),
        };
        break;
      case WebSocketMessageType.SYSTEM_NOTIFICATION:
        data = {
          title: 'Системное уведомление',
          message: 'Обновление системы будет произведено в 00:00',
          variant: 'default',
        };
        break;
      default:
        data = {};
    }
    
    handleNewNotification({
      type: randomType,
      data,
      timestamp: new Date().toISOString()
    });
  };

  // Фильтрация уведомлений по вкладкам
  const bookingNotifications = notifications.filter(n => 
    n.type === WebSocketMessageType.BOOKING_CREATED || 
    n.type === WebSocketMessageType.BOOKING_UPDATED || 
    n.type === WebSocketMessageType.BOOKING_CANCELLED
  );
  
  const paymentNotifications = notifications.filter(n => 
    n.type === WebSocketMessageType.PAYMENT_RECEIVED
  );
  
  const systemNotifications = notifications.filter(n => 
    n.type === WebSocketMessageType.SYSTEM_NOTIFICATION ||
    n.type === WebSocketMessageType.CAR_STATUS_CHANGED
  );

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
            aria-label="Уведомления"
          >
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs" 
                variant="destructive"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[380px] p-0" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Уведомления</CardTitle>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Прочитать все
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={clearAllNotifications}
                    disabled={notifications.length === 0}
                  >
                    Очистить
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">
                    Все
                    {notifications.length > 0 && (
                      <Badge className="ml-1" variant="secondary">{notifications.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="bookings">
                    Брони
                    {bookingNotifications.length > 0 && (
                      <Badge className="ml-1" variant="secondary">{bookingNotifications.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="payments">
                    Оплаты
                    {paymentNotifications.length > 0 && (
                      <Badge className="ml-1" variant="secondary">{paymentNotifications.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="system">
                    Система
                    {systemNotifications.length > 0 && (
                      <Badge className="ml-1" variant="secondary">{systemNotifications.length}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <div className="mt-2 max-h-[300px] overflow-y-auto px-2">
                  <TabsContent value="all" className="m-0">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex gap-3 rounded-md p-2 transition-colors ${notification.read ? 'bg-transparent' : 'bg-muted/50'}`}
                        >
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{getNotificationTitle(notification)}</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(notification.timestamp), 'HH:mm')}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-5 w-5"
                                  onClick={() => removeNotification(notification.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{getNotificationContent(notification)}</p>
                            {!notification.read && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="h-auto p-0 text-xs"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Отметить как прочитанное
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">Нет уведомлений</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="bookings" className="m-0">
                    {bookingNotifications.length > 0 ? (
                      bookingNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex gap-3 rounded-md p-2 transition-colors ${notification.read ? 'bg-transparent' : 'bg-muted/50'}`}
                        >
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{getNotificationTitle(notification)}</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(notification.timestamp), 'HH:mm')}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-5 w-5"
                                  onClick={() => removeNotification(notification.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{getNotificationContent(notification)}</p>
                            {!notification.read && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="h-auto p-0 text-xs"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Отметить как прочитанное
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">Нет уведомлений о бронированиях</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="payments" className="m-0">
                    {paymentNotifications.length > 0 ? (
                      paymentNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex gap-3 rounded-md p-2 transition-colors ${notification.read ? 'bg-transparent' : 'bg-muted/50'}`}
                        >
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{getNotificationTitle(notification)}</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(notification.timestamp), 'HH:mm')}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-5 w-5"
                                  onClick={() => removeNotification(notification.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{getNotificationContent(notification)}</p>
                            {!notification.read && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="h-auto p-0 text-xs"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Отметить как прочитанное
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">Нет уведомлений об оплатах</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="system" className="m-0">
                    {systemNotifications.length > 0 ? (
                      systemNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex gap-3 rounded-md p-2 transition-colors ${notification.read ? 'bg-transparent' : 'bg-muted/50'}`}
                        >
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{getNotificationTitle(notification)}</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(notification.timestamp), 'HH:mm')}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-5 w-5"
                                  onClick={() => removeNotification(notification.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{getNotificationContent(notification)}</p>
                            {!notification.read && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="h-auto p-0 text-xs"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Отметить как прочитанное
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">Нет системных уведомлений</p>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-2 text-xs text-muted-foreground">
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 text-xs font-normal text-muted-foreground"
                onClick={() => addTestNotification()}
              >
                Тестовое уведомление
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span>Звук</span>
                  <Switch 
                    checked={soundEnabled} 
                    onCheckedChange={setSoundEnabled} 
                    size="sm" 
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span>Десктоп</span>
                  <Switch 
                    checked={desktopEnabled} 
                    onCheckedChange={setDesktopEnabled} 
                    size="sm" 
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationsCenter;
