
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authApi, bookingsApi, carsApi } from "@/lib/api";
import { Car, BookOpen, Users, BarChart2, DollarSign } from "lucide-react";

interface DashboardStat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalCars: number;
    activeBookings: number;
    totalCustomers: number;
    monthlyRevenue: number;
  }>({
    totalCars: 0,
    activeBookings: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
  });
  
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    // Проверка авторизации
    if (!authApi.isAuthenticated() || !authApi.isAdmin()) {
      navigate("/login", { replace: true });
      return;
    }

    // Загрузка данных дашборда
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // В реальном приложении здесь будут запросы к API
        // Для демонстрации используем моковые данные
        
        // Имитация загрузки данных
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Моковые данные статистики
        setStats({
          totalCars: 24,
          activeBookings: 8,
          totalCustomers: 156,
          monthlyRevenue: 378500,
        });
        
        // Моковые данные последних бронирований
        setRecentBookings([
          {
            id: "B1001",
            customerName: "Иван Петров",
            carName: "Toyota Camry",
            startDate: "2025-05-01",
            endDate: "2025-05-04",
            status: "active",
            totalPrice: 10500
          },
          {
            id: "B1002",
            customerName: "Анна Смирнова",
            carName: "BMW X5",
            startDate: "2025-05-03",
            endDate: "2025-05-10",
            status: "pending",
            totalPrice: 52500
          },
          {
            id: "B1003",
            customerName: "Дмитрий Козлов",
            carName: "Kia Rio",
            startDate: "2025-05-02",
            endDate: "2025-05-05",
            status: "completed",
            totalPrice: 6000
          }
        ]);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const dashboardStats: DashboardStat[] = [
    {
      title: "Автомобилей в автопарке",
      value: stats.totalCars,
      icon: <Car className="h-5 w-5 text-primary" />,
      description: "Общее количество автомобилей"
    },
    {
      title: "Активных бронирований",
      value: stats.activeBookings,
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
      description: "Текущие аренды"
    },
    {
      title: "Клиентов",
      value: stats.totalCustomers,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      description: "Всего зарегистрированных"
    },
    {
      title: "Выручка за месяц",
      value: `${stats.monthlyRevenue.toLocaleString("ru-RU")} ₽`,
      icon: <DollarSign className="h-5 w-5 text-yellow-500" />,
      description: "Май 2025"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Активно";
      case "pending":
        return "Ожидает";
      case "completed":
        return "Завершено";
      case "cancelled":
        return "Отменено";
      default:
        return "Неизвестно";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-xl font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/admin/cars/new")}>
            Добавить автомобиль
          </Button>
        </div>
      </div>
      
      {/* Статистика */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Основной контент */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Бронирования</TabsTrigger>
          <TabsTrigger value="revenue">Выручка</TabsTrigger>
          <TabsTrigger value="cars">Автомобили</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Последние бронирования</CardTitle>
              <CardDescription>
                Просмотр и управление последними бронированиями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 pr-4 text-sm font-medium text-gray-500">ID</th>
                      <th className="pb-3 pr-4 text-sm font-medium text-gray-500">Клиент</th>
                      <th className="pb-3 pr-4 text-sm font-medium text-gray-500">Автомобиль</th>
                      <th className="pb-3 pr-4 text-sm font-medium text-gray-500">Период</th>
                      <th className="pb-3 pr-4 text-sm font-medium text-gray-500">Статус</th>
                      <th className="pb-3 pr-4 text-sm font-medium text-gray-500">Сумма</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b">
                        <td className="py-3 pr-4 font-medium">{booking.id}</td>
                        <td className="py-3 pr-4">{booking.customerName}</td>
                        <td className="py-3 pr-4">{booking.carName}</td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {new Date(booking.startDate).toLocaleDateString("ru-RU")} -{" "}
                          {new Date(booking.endDate).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="py-3 pr-4">
                          <span 
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}
                          >
                            {getStatusText(booking.status)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-medium">
                          {booking.totalPrice.toLocaleString("ru-RU")} ₽
                        </td>
                        <td className="py-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                          >
                            Подробнее
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/admin/bookings")}
                >
                  Все бронирования
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Финансовая аналитика</CardTitle>
              <CardDescription>
                Отчет о выручке по дням, неделям и месяцам
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-80 items-center justify-center">
              <div className="text-center">
                <BarChart2 className="mx-auto h-16 w-16 text-gray-300" />
                <p className="mt-2 text-gray-500">
                  Графики выручки будут отображаться здесь
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cars">
          <Card>
            <CardHeader>
              <CardTitle>Управление автопарком</CardTitle>
              <CardDescription>
                Просмотр и редактирование доступных автомобилей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Car className="mx-auto h-16 w-16 text-gray-300" />
                <p className="mt-2 text-gray-500">
                  Список автомобилей будет отображаться здесь
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/admin/cars")}
                >
                  Управление автомобилями
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
