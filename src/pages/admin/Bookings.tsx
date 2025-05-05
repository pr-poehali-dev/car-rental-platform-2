
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authApi, bookingsApi, carsApi } from "@/lib/api";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  CalendarRange, Search, Filter, ArrowLeft,
  CalendarIcon, Check, X, FileText, Printer
} from "lucide-react";
import PrintForms from "@/components/PrintForms";

interface BookingData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId: string;
  carName: string;
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  createdAt: string;
}

const BookingsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isPrintFormsOpen, setIsPrintFormsOpen] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);

  // Статусы бронирований
  const bookingStatuses = [
    { value: "pending", label: "Ожидает подтверждения", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Подтверждено", color: "bg-blue-100 text-blue-800" },
    { value: "active", label: "Активно", color: "bg-green-100 text-green-800" },
    { value: "completed", label: "Завершено", color: "bg-purple-100 text-purple-800" },
    { value: "cancelled", label: "Отменено", color: "bg-red-100 text-red-800" },
  ];

  // Статусы оплаты
  const paymentStatuses = [
    { value: "pending", label: "Ожидает оплаты", color: "bg-yellow-100 text-yellow-800" },
    { value: "paid", label: "Оплачено", color: "bg-green-100 text-green-800" },
    { value: "refunded", label: "Возвращено", color: "bg-blue-100 text-blue-800" },
  ];

  useEffect(() => {
    // Проверка авторизации
    if (!authApi.isAuthenticated() || !authApi.isAdmin()) {
      navigate("/login", { replace: true });
      return;
    }

    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь будет запрос к API
      // Для демонстрации используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockBookings: BookingData[] = [
        {
          id: "B1001",
          customerName: "Иван Петров",
          customerEmail: "ivan@example.com",
          customerPhone: "+7 (999) 123-45-67",
          carId: "CAR001",
          carName: "Toyota Camry",
          startDate: "2025-05-01",
          endDate: "2025-05-04",
          status: "active",
          totalPrice: 10500,
          paymentStatus: "paid",
          notes: "Клиент запросил детское кресло",
          createdAt: "2025-04-25T10:30:00"
        },
        {
          id: "B1002",
          customerName: "Анна Смирнова",
          customerEmail: "anna@example.com",
          customerPhone: "+7 (999) 987-65-43",
          carId: "CAR002",
          carName: "BMW X5",
          startDate: "2025-05-03",
          endDate: "2025-05-10",
          status: "pending",
          totalPrice: 52500,
          paymentStatus: "pending",
          createdAt: "2025-04-28T14:15:00"
        },
        {
          id: "B1003",
          customerName: "Дмитрий Козлов",
          customerEmail: "dmitry@example.com",
          customerPhone: "+7 (999) 456-78-90",
          carId: "CAR003",
          carName: "Kia Rio",
          startDate: "2025-05-02",
          endDate: "2025-05-05",
          status: "completed",
          totalPrice: 6000,
          paymentStatus: "paid",
          createdAt: "2025-04-20T09:45:00"
        },
        {
          id: "B1004",
          customerName: "Елена Соколова",
          customerEmail: "elena@example.com",
          customerPhone: "+7 (999) 234-56-78",
          carId: "CAR001",
          carName: "Toyota Camry",
          startDate: "2025-05-06",
          endDate: "2025-05-08",
          status: "confirmed",
          totalPrice: 7000,
          paymentStatus: "paid",
          createdAt: "2025-05-01T11:20:00"
        },
        {
          id: "B1005",
          customerName: "Александр Иванов",
          customerEmail: "alex@example.com",
          customerPhone: "+7 (999) 345-67-89",
          carId: "CAR004",
          carName: "Hyundai Solaris",
          startDate: "2025-04-25",
          endDate: "2025-04-30",
          status: "cancelled",
          totalPrice: 10000,
          paymentStatus: "refunded",
          notes: "Клиент отменил по личным обстоятельствам",
          createdAt: "2025-04-15T16:30:00"
        }
      ];
      
      setBookings(mockBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingData["status"]) => {
    try {
      // В реальном приложении здесь будет запрос к API
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus } 
          : booking
      );
      
      setBookings(updatedBookings);
      
      if (currentBooking && currentBooking.id === bookingId) {
        setCurrentBooking({ ...currentBooking, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleCancelBooking = async () => {
    if (!currentBooking) return;
    
    try {
      // В реальном приложении здесь будет запрос к API
      const updatedBookings = bookings.map(booking => 
        booking.id === currentBooking.id 
          ? { 
              ...booking, 
              status: "cancelled", 
              notes: booking.notes 
                ? `${booking.notes}\nОтменено: ${cancelReason}` 
                : `Отменено: ${cancelReason}` 
            } 
          : booking
      );
      
      setBookings(updatedBookings);
      setCurrentBooking({
        ...currentBooking,
        status: "cancelled",
        notes: currentBooking.notes 
          ? `${currentBooking.notes}\nОтменено: ${cancelReason}` 
          : `Отменено: ${cancelReason}`
      });
      
      setIsCancelDialogOpen(false);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleBulkStatusChange = async (newStatus: BookingData["status"]) => {
    try {
      // В реальном приложении здесь будет запрос к API
      const updatedBookings = bookings.map(booking => 
        selectedBookings.includes(booking.id)
          ? { ...booking, status: newStatus }
          : booking
      );
      
      setBookings(updatedBookings);
      setSelectedBookings([]);
      setIsBulkActionOpen(false);
    } catch (error) {
      console.error("Error updating booking statuses:", error);
    }
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const selectAllBookings = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(booking => booking.id));
    }
  };

  const getStatusInfo = (status: string) => {
    const statusObj = bookingStatuses.find(s => s.value === status);
    return {
      label: statusObj?.label || "Неизвестно",
      color: statusObj?.color || "bg-gray-100 text-gray-800"
    };
  };

  const getPaymentStatusInfo = (status: string) => {
    const statusObj = paymentStatuses.find(s => s.value === status);
    return {
      label: statusObj?.label || "Неизвестно",
      color: statusObj?.color || "bg-gray-100 text-gray-800"
    };
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: ru });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy HH:mm", { locale: ru });
  };

  const filteredBookings = bookings
    .filter(booking => 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(booking => 
      selectedStatus ? booking.status === selectedStatus : true
    )
    .filter(booking => {
      if (!selectedDate) return true;
      
      const bookingStartDate = new Date(booking.startDate);
      const bookingEndDate = new Date(booking.endDate);
      const filterDate = new Date(selectedDate);
      
      // Фильтрация, если выбранная дата входит в интервал бронирования
      return (
        filterDate >= new Date(bookingStartDate.setHours(0, 0, 0, 0)) && 
        filterDate <= new Date(bookingEndDate.setHours(23, 59, 59, 999))
      );
    });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold md:text-3xl">Управление бронированиями</h1>
        </div>
        <div className="flex gap-2">
          {selectedBookings.length > 0 && (
            <Button
              variant="default"
              onClick={() => setIsBulkActionOpen(true)}
            >
              Действия ({selectedBookings.length})
            </Button>
          )}
          <Button
            onClick={() => navigate("/admin/bookings/calendar")}
            className="gap-2"
          >
            <CalendarRange className="h-4 w-4" /> Календарь бронирований
          </Button>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск по ID, имени клиента или автомобилю..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Все статусы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все статусы</SelectItem>
                    {bookingStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "d MMMM yyyy", { locale: ru })
                      ) : (
                        "Выберите дату"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                    {selectedDate && (
                      <div className="border-t p-3">
                        <Button
                          variant="ghost"
                          className="w-full justify-center"
                          onClick={() => setSelectedDate(undefined)}
                        >
                          Сбросить
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Таблица бронирований */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 w-10">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                        onChange={selectAllBookings}
                      />
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">ID</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Клиент</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Автомобиль</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Период</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Статус</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Сумма</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-4 text-center">
                        <div className="flex flex-col items-center justify-center py-10">
                          <CalendarRange className="mb-2 h-8 w-8 text-gray-300" />
                          <p className="text-gray-500">Бронирования не найдены</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => {
                      const statusInfo = getStatusInfo(booking.status);
                      return (
                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-gray-300"
                              checked={selectedBookings.includes(booking.id)}
                              onChange={() => toggleBookingSelection(booking.id)}
                            />
                          </td>
                          <td className="p-4 font-medium">{booking.id}</td>
                          <td className="p-4">{booking.customerName}</td>
                          <td className="p-4">{booking.carName}</td>
                          <td className="p-4 whitespace-nowrap">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="p-4 font-medium">
                            {booking.totalPrice.toLocaleString("ru-RU")} ₽
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setCurrentBooking(booking);
                                  setIsDetailsDialogOpen(true);
                                }}
                              >
                                Подробнее
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="px-2"
                                onClick={() => {
                                  setCurrentBooking(booking);
                                  setIsPrintFormsOpen(true);
                                }}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог с деталями бронирования */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {currentBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Детали бронирования #{currentBooking.id}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-medium">Информация о клиенте</h3>
                  <Card>
                    <CardContent className="p-4">
                      <dl className="grid gap-2">
                        <div className="grid grid-cols-2">
                          <dt className="text-sm font-medium text-gray-500">Имя:</dt>
                          <dd>{currentBooking.customerName}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-sm font-medium text-gray-500">Email:</dt>
                          <dd>{currentBooking.customerEmail}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-sm font-medium text-gray-500">Телефон:</dt>
                          <dd>{currentBooking.customerPhone}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <h3 className="mb-3 mt-6 text-lg font-medium">Детали аренды</h3>
                  <Card>
                    <CardContent className="p-4">
                      <dl className="grid gap-2">
                        <div className="grid grid-cols-2">
                          <dt className="text-sm font-medium text-gray-500">Автомобиль:</dt>
                          <dd>{currentBooking.carName}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-sm font-medium text-gray-500">ID автомобиля:</dt>
                          <dd>{currentBooking.carId}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-sm font-medium text-gray-500">Начало аренды:</dt>
                          <dd>{formatDate(currentBooking.startDate)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-sm font-medium text-gray-500">Окончание аренды:</dt>
                          <dd>{formatDate(currentBooking.endDate)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-sm font-medium text-gray-500">Стоимость:</dt>
                          <dd className="font-medium">{currentBooking.totalPrice.toLocaleString("ru-RU")} ₽</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="mb-3 text-lg font-medium">Статус бронирования</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-500">Статус бронирования</h4>
                          <Select
                            value={currentBooking.status}
                            onValueChange={(value: BookingData["status"]) => 
                              handleStatusChange(currentBooking.id, value)
                            }
                            disabled={currentBooking.status === "cancelled"}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {bookingStatuses.map((status) => (
                                <SelectItem 
                                  key={status.value} 
                                  value={status.value}
                                  disabled={status.value === "cancelled"}
                                >
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-500">Статус оплаты</h4>
                          <div className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusInfo(currentBooking.paymentStatus).color}`}>
                            {getPaymentStatusInfo(currentBooking.paymentStatus).label}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="mb-2 text-sm font-medium text-gray-500">Дата создания:</h4>
                        <p>{formatDateTime(currentBooking.createdAt)}</p>
                      </div>
                      
                      {currentBooking.notes && (
                        <div className="mt-4">
                          <h4 className="mb-2 text-sm font-medium text-gray-500">Примечания:</h4>
                          <p className="whitespace-pre-line rounded bg-gray-50 p-3 text-sm">{currentBooking.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6 flex gap-3">
                    <Button 
                      className="flex-1 gap-2" 
                      onClick={() => {
                        setIsPrintFormsOpen(true);
                        setIsDetailsDialogOpen(false);
                      }}
                    >
                      <FileText className="h-4 w-4" /> Печать документов
                    </Button>
                    
                    {currentBooking.status !== "cancelled" && (
                      <Button 
                        variant="destructive" 
                        className="flex-1 gap-2"
                        onClick={() => setIsCancelDialogOpen(true)}
                      >
                        <X className="h-4 w-4" /> Отменить
                      </Button>
                    )}
                    
                    {currentBooking.status === "pending" && (
                      <Button 
                        variant="default" 
                        className="flex-1 gap-2"
                        onClick={() => handleStatusChange(currentBooking.id, "confirmed")}
                      >
                        <Check className="h-4 w-4" /> Подтвердить
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Диалог отмены бронирования */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отмена бронирования</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Вы уверены, что хотите отменить бронирование?</p>
            <div className="space-y-2">
              <label htmlFor="cancel-reason" className="text-sm font-medium">
                Укажите причину отмены:
              </label>
              <Textarea
                id="cancel-reason"
                placeholder="Причина отмены..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Закрыть
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelBooking}
              disabled={!cancelReason.trim()}
            >
              Отменить бронирование
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог массовых действий */}
      <Dialog open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Массовые действия</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Выбрано бронирований: {selectedBookings.length}</p>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Изменить статус на:</h4>
                <div className="flex flex-wrap gap-2">
                  {bookingStatuses.map((status) => (
                    status.value !== "cancelled" && (
                      <Button
                        key={status.value}
                        variant="outline"
                        className={`gap-2 ${status.color}`}
                        onClick={() => handleBulkStatusChange(status.value as BookingData["status"])}
                      >
                        {status.label}
                      </Button>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionOpen(false)}>
              Отмена
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Компонент печатных форм */}
      {currentBooking && (
        <PrintForms
          booking={currentBooking}
          isOpen={isPrintFormsOpen}
          onClose={() => setIsPrintFormsOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingsPage;
