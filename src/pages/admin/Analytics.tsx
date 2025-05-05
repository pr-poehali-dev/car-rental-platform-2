
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, subDays, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Download,
  Filter,
  CircleDollarSign,
  CarIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { authApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Типы данных
interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

interface CarUtilizationData {
  name: string;
  value: number;
  color: string;
}

interface CarCategoryData {
  name: string;
  value: number;
}

interface CustomerStatData {
  name: string; // Месяц
  new: number; // Новые клиенты
  returning: number; // Возвращающиеся клиенты
}

// Цвета для графиков
const CHART_COLORS = {
  primary: "#8B5CF6", // Основной фиолетовый
  secondary: "#F97316", // Оранжевый
  tertiary: "#0EA5E9", // Синий
  success: "#22C55E", // Зеленый
  danger: "#EF4444", // Красный
  warning: "#F59E0B", // Желтый
  info: "#3B82F6", // Голубой
  categoryColors: ["#8B5CF6", "#F97316", "#0EA5E9", "#22C55E", "#3B82F6"]
};

// Мок-данные для примера
const generateMockRevenueData = (days: number): RevenueData[] => {
  const result: RevenueData[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    // Генерация случайных данных в пределах нормальных значений
    const revenue = Math.floor(Math.random() * 30000) + 5000;
    const bookings = Math.floor(Math.random() * 5) + 1;
    
    result.push({
      date: format(date, "yyyy-MM-dd"),
      revenue,
      bookings,
    });
  }
  
  return result;
};

const generateMockMonthlyData = (months: number): RevenueData[] => {
  const result: RevenueData[] = [];
  const today = new Date();
  
  for (let i = months; i >= 0; i--) {
    const date = subMonths(today, i);
    // Генерация случайных данных в пределах нормальных значений для месяца
    const revenue = Math.floor(Math.random() * 300000) + 200000;
    const bookings = Math.floor(Math.random() * 40) + 20;
    
    result.push({
      date: format(date, "yyyy-MM"),
      revenue,
      bookings,
    });
  }
  
  return result;
};

const carUtilizationData: CarUtilizationData[] = [
  { name: "В аренде", value: 12, color: CHART_COLORS.success },
  { name: "Доступно", value: 8, color: CHART_COLORS.primary },
  { name: "Обслуживание", value: 4, color: CHART_COLORS.warning },
];

const carCategoryData: CarCategoryData[] = [
  { name: "Эконом", value: 8 },
  { name: "Комфорт", value: 6 },
  { name: "Бизнес", value: 5 },
  { name: "Премиум", value: 3 },
  { name: "Внедорожники", value: 2 },
];

const customerData: CustomerStatData[] = [
  { name: "Янв", new: 30, returning: 10 },
  { name: "Фев", new: 25, returning: 15 },
  { name: "Мар", new: 20, returning: 20 },
  { name: "Апр", new: 27, returning: 25 },
  { name: "Май", new: 35, returning: 30 },
];

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"7days" | "30days" | "6months" | "12months">("30days");
  const [dailyRevenueData, setDailyRevenueData] = useState<RevenueData[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<RevenueData[]>([]);

  useEffect(() => {
    // Проверка авторизации
    if (!authApi.isAuthenticated() || !authApi.isAdmin()) {
      navigate("/login", { replace: true });
      return;
    }

    // Загрузка данных
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // В реальном приложении здесь будут запросы к API
        // Для демонстрации используем моковые данные
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Генерация данных для дневной статистики
        setDailyRevenueData(generateMockRevenueData(30));
        
        // Генерация данных для месячной статистики
        setMonthlyRevenueData(generateMockMonthlyData(12));
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Фильтрация данных в зависимости от выбранного периода
  const filteredDailyData = () => {
    switch (period) {
      case "7days":
        return dailyRevenueData.slice(-7);
      case "30days":
        return dailyRevenueData.slice(-30);
      default:
        return dailyRevenueData;
    }
  };

  const filteredMonthlyData = () => {
    switch (period) {
      case "6months":
        return monthlyRevenueData.slice(-6);
      case "12months":
        return monthlyRevenueData.slice(-12);
      default:
        return monthlyRevenueData;
    }
  };

  // Функция для форматирования данных для отображения в тултипе
  const formatTooltipValue = (value: number) => {
    return `${value.toLocaleString("ru-RU")} ₽`;
  };

  // Статистические показатели (обычно приходят с сервера)
  const stats = {
    totalRevenue: 1850000,
    revenueChange: 8.5,
    avgBookingPrice: 12500,
    bookingsCount: 148,
    bookingsChange: 12.3,
    popularCar: "Toyota Camry",
    occupancyRate: 78.5,
  };

  // Функция для экспорта данных в CSV
  const exportToCSV = () => {
    const csvData = [
      ["Дата", "Выручка", "Кол-во бронирований"],
      ...dailyRevenueData.map(item => [
        item.date,
        item.revenue,
        item.bookings
      ])
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvData.map(row => row.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenue_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold md:text-3xl">Аналитика и отчеты</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="gap-2"
          >
            <Download className="h-4 w-4" /> Экспорт в CSV
          </Button>
          <Button
            onClick={() => navigate("/admin/dashboard")}
          >
            Панель управления
          </Button>
        </div>
      </div>

      {/* Основные показатели */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Общая выручка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CircleDollarSign className="mr-2 h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString("ru-RU")} ₽</div>
            </div>
            <div className="mt-1 flex items-center">
              {stats.revenueChange > 0 ? (
                <div className="flex items-center text-green-600">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span className="text-xs">+{stats.revenueChange}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  <span className="text-xs">{stats.revenueChange}%</span>
                </div>
              )}
              <span className="ml-1 text-xs text-gray-500">по сравнению с прошлым периодом</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Количество бронирований</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-orange-500" />
              <div className="text-2xl font-bold">{stats.bookingsCount}</div>
            </div>
            <div className="mt-1 flex items-center">
              {stats.bookingsChange > 0 ? (
                <div className="flex items-center text-green-600">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span className="text-xs">+{stats.bookingsChange}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  <span className="text-xs">{stats.bookingsChange}%</span>
                </div>
              )}
              <span className="ml-1 text-xs text-gray-500">по сравнению с прошлым периодом</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Средняя стоимость</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
              <div className="text-2xl font-bold">{stats.avgBookingPrice.toLocaleString("ru-RU")} ₽</div>
            </div>
            <div className="mt-1">
              <span className="text-xs text-gray-500">за одно бронирование</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Загруженность автопарка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CarIcon className="mr-2 h-5 w-5 text-green-500" />
              <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            </div>
            <div className="mt-1">
              <span className="text-xs text-gray-500">автомобилей в аренде</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтр периода */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Финансовая статистика</h2>
        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4 text-gray-500" />
          <Select
            value={period}
            onValueChange={(value: "7days" | "30days" | "6months" | "12months") => setPeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Последние 7 дней</SelectItem>
              <SelectItem value="30days">Последние 30 дней</SelectItem>
              <SelectItem value="6months">Последние 6 месяцев</SelectItem>
              <SelectItem value="12months">Последние 12 месяцев</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Графики */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Доходы</TabsTrigger>
          <TabsTrigger value="cars">Автопарк</TabsTrigger>
          <TabsTrigger value="customers">Клиенты</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          {/* График доходов */}
          <Card>
            <CardHeader>
              <CardTitle>Динамика выручки</CardTitle>
              <CardDescription>
                {period === "7days" || period === "30days"
                  ? "Выручка по дням"
                  : "Выручка по месяцам"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-80 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={period === "7days" || period === "30days" ? filteredDailyData() : filteredMonthlyData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = parseISO(value);
                        return period === "7days" || period === "30days"
                          ? format(date, "d MMM", { locale: ru })
                          : format(date, "MMM yyyy", { locale: ru });
                      }}
                    />
                    <YAxis
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toLocaleString("ru-RU")} ₽`, "Выручка"]}
                      labelFormatter={(value) => {
                        const date = parseISO(value);
                        return format(date, "d MMMM yyyy", { locale: ru });
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={CHART_COLORS.primary}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* График соотношения доходов/бронирований */}
          <Card>
            <CardHeader>
              <CardTitle>Соотношение выручки и бронирований</CardTitle>
              <CardDescription>
                Сравнение выручки и количества бронирований
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-80 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={period === "7days" || period === "30days" ? filteredDailyData() : filteredMonthlyData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      scale="point"
                      padding={{ left: 10, right: 10 }}
                      tickFormatter={(value) => {
                        const date = parseISO(value);
                        return period === "7days" || period === "30days"
                          ? format(date, "d MMM", { locale: ru })
                          : format(date, "MMM yyyy", { locale: ru });
                      }}
                    />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === "revenue") {
                          return [`${value.toLocaleString("ru-RU")} ₽`, "Выручка"];
                        }
                        return [value, "Бронирований"];
                      }}
                      labelFormatter={(value) => {
                        const date = parseISO(value);
                        return format(date, "d MMMM yyyy", { locale: ru });
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      name="Выручка"
                      fill={CHART_COLORS.primary}
                    />
                    <Line
                      yAxisId="right"
                      dataKey="bookings"
                      name="Бронирования"
                      stroke={CHART_COLORS.secondary}
                      type="monotone"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cars" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Занятость автопарка */}
            <Card>
              <CardHeader>
                <CardTitle>Занятость автопарка</CardTitle>
                <CardDescription>
                  Распределение автомобилей по статусам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[300px] items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={carUtilizationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {carUtilizationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => {
                          return [`${value} автомобилей`, name];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Популярность категорий */}
            <Card>
              <CardHeader>
                <CardTitle>Автомобили по категориям</CardTitle>
                <CardDescription>
                  Распределение автомобилей по классам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[300px] items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={carCategoryData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="name"
                        type="category"
                        scale="band"
                        tick={{ fontSize: 14 }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value} автомобилей`, "Количество"]}
                      />
                      <Bar
                        dataKey="value"
                        name="Количество"
                        radius={[0, 6, 6, 0]}
                      >
                        {carCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS.categoryColors[index % CHART_COLORS.categoryColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Динамика клиентов</CardTitle>
              <CardDescription>
                Новые и возвращающиеся клиенты по месяцам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={customerData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="new"
                      name="Новые клиенты"
                      stackId="a"
                      fill={CHART_COLORS.primary}
                    />
                    <Bar
                      dataKey="returning"
                      name="Возвращающиеся клиенты"
                      stackId="a"
                      fill={CHART_COLORS.tertiary}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
