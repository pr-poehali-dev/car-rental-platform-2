
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, subDays, subMonths, addMonths } from "date-fns";
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
  Scatter,
  ScatterChart,
  ZAxis,
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
  FileDown,
  RefreshCw,
  ArrowLeft,
  BarChart2,
  ChevronsRight,
  Sliders
} from "lucide-react";
import { authApi } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Цвета для графиков
const CHART_COLORS = {
  primary: "#8B5CF6", // Основной фиолетовый
  secondary: "#F97316", // Оранжевый
  tertiary: "#0EA5E9", // Синий
  success: "#22C55E", // Зеленый
  danger: "#EF4444", // Красный
  warning: "#F59E0B", // Желтый
  info: "#3B82F6", // Голубой
  categoryColors: ["#8B5CF6", "#F97316", "#0EA5E9", "#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#7C3AED"]
};

// Типы данных для аналитики
interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
  category?: string;
}

interface CarCategoryData {
  name: string;
  value: number;
  revenue?: number;
  utilization?: number;
  bookings?: number;
}

interface PredictionData {
  month: string;
  actual?: number;
  predicted: number;
  trend?: number;
}

interface CarUtilizationTrend {
  month: string;
  economy: number;
  comfort: number;
  business: number;
  premium: number;
  suv: number;
}

interface BookingTrend {
  month: string;
  newCustomers: number;
  repeating: number;
}

interface OccupancyData {
  date: string;
  occupancy: number;
  available: number;
}

const AdvancedAnalyticsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"7days" | "30days" | "90days" | "6months" | "12months" | "custom">("30days");
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedCarCategories, setSelectedCarCategories] = useState<string[]>(["all"]);
  const [showRealData, setShowRealData] = useState(true);
  const [showPredictions, setShowPredictions] = useState(true);
  const [revenueRange, setRevenueRange] = useState([0, 100000]);
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState<"previous" | "year_ago">("previous");
  const [selectedDataFormat, setSelectedDataFormat] = useState<"daily" | "weekly" | "monthly">("daily");
  
  // Данные аналитики
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoryData, setCategoryData] = useState<CarCategoryData[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [utilizationTrends, setUtilizationTrends] = useState<CarUtilizationTrend[]>([]);
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [period, startDate, endDate, selectedCarCategories, selectedDataFormat]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь был бы запрос к API
      // Генерируем моковые данные вместо этого
      
      // Имитация загрузки данных с сервера
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Генерация данных на основе выбранного периода
      generateMockData();
      
    } catch (error) {
      console.error("Ошибка при загрузке данных аналитики:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные аналитики",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = () => {
    // Определение дат на основе выбранного периода
    let start: Date;
    let end = new Date();
    
    if (period === "custom" && startDate && endDate) {
      start = startDate;
      end = endDate;
    } else {
      switch (period) {
        case "7days":
          start = subDays(new Date(), 7);
          break;
        case "30days":
          start = subDays(new Date(), 30);
          break;
        case "90days":
          start = subDays(new Date(), 90);
          break;
        case "6months":
          start = subMonths(new Date(), 6);
          break;
        case "12months":
          start = subMonths(new Date(), 12);
          break;
        default:
          start = subDays(new Date(), 30);
      }
    }
    
    // Генерация данных о доходах
    const revenue: RevenueData[] = [];
    const categories = ["economy", "comfort", "business", "premium", "suv"];
    const categoryColors = ["#8B5CF6", "#F97316", "#0EA5E9", "#22C55E", "#3B82F6"];
    
    // Получаем диапазон дат
    const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Определяем шаг для группировки данных (день, неделя, месяц)
    let step = 1; // Дни по умолчанию
    let format = "yyyy-MM-dd";
    let formatDisplay = "d MMM";
    
    if (selectedDataFormat === "weekly") {
      step = 7;
      formatDisplay = "'Нед' w, MMM";
    } else if (selectedDataFormat === "monthly") {
      step = 30;
      format = "yyyy-MM";
      formatDisplay = "MMM yyyy";
    }
    
    // Генерация данных с нужным шагом
    for (let i = 0; i <= dayDiff; i += step) {
      const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      
      // Сезонность: больше бронирований летом и в выходные
      const month = currentDate.getMonth();
      const dayOfWeek = currentDate.getDay();
      const seasonalFactor = month >= 5 && month <= 8 ? 1.5 : 1.0; // Лето
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1.0; // Выходные
      
      // Создаем запись для каждой категории, если выбрано "все категории" или конкретная категория
      if (selectedCarCategories.includes("all")) {
        // Суммарные данные по всем категориям
        const totalBookings = Math.floor(Math.random() * 5 * seasonalFactor * weekendFactor) + 3;
        const totalRevenue = Math.floor((Math.random() * 25000 + 15000) * seasonalFactor * weekendFactor);
        
        revenue.push({
          date: format === "yyyy-MM-dd" 
            ? format(currentDate, format) 
            : format(currentDate, 'yyyy-MM'),
          revenue: totalRevenue,
          bookings: totalBookings
        });
      } else {
        // Данные по выбранным категориям
        selectedCarCategories.forEach(category => {
          if (category !== "all" && categories.includes(category)) {
            const categoryIndex = categories.indexOf(category);
            
            // Разные категории имеют разную популярность и стоимость
            let categoryFactor = 1.0;
            if (category === "economy") categoryFactor = 0.7;
            if (category === "comfort") categoryFactor = 1.0;
            if (category === "business") categoryFactor = 1.3;
            if (category === "premium") categoryFactor = 1.6;
            if (category === "suv") categoryFactor = 1.4;
            
            const bookings = Math.floor(Math.random() * 3 * seasonalFactor * weekendFactor * categoryFactor) + 1;
            const categoryRevenue = Math.floor((Math.random() * 15000 + 5000) * seasonalFactor * weekendFactor * categoryFactor);
            
            revenue.push({
              date: format === "yyyy-MM-dd" 
                ? format(currentDate, format) 
                : format(currentDate, 'yyyy-MM'),
              revenue: categoryRevenue,
              bookings: bookings,
              category: category
            });
          }
        });
      }
    }
    
    // Агрегируем данные по датам, если они совпадают (для месячного и недельного представления)
    const aggregatedRevenue = revenue.reduce((acc, current) => {
      const existingIndex = acc.findIndex(item => item.date === current.date && item.category === current.category);
      
      if (existingIndex !== -1) {
        acc[existingIndex].revenue += current.revenue;
        acc[existingIndex].bookings += current.bookings;
      } else {
        acc.push(current);
      }
      
      return acc;
    }, [] as RevenueData[]);
    
    setRevenueData(aggregatedRevenue);
    
    // Генерация данных по категориям автомобилей
    const categoriesData: CarCategoryData[] = [
      { name: "Эконом", value: 8, revenue: 320000, utilization: 75, bookings: 48 },
      { name: "Комфорт", value: 12, revenue: 540000, utilization: 82, bookings: 65 },
      { name: "Бизнес", value: 6, revenue: 450000, utilization: 70, bookings: 32 },
      { name: "Премиум", value: 4, revenue: 560000, utilization: 65, bookings: 22 },
      { name: "Внедорожники", value: 5, revenue: 480000, utilization: 85, bookings: 38 }
    ];
    
    setCategoryData(categoriesData);
    
    // Генерация прогноза доходов
    const prediction: PredictionData[] = [];
    const currentMonth = new Date().getMonth();
    
    for (let i = 0; i < 12; i++) {
      const monthDate = addMonths(new Date(new Date().getFullYear(), currentMonth - 5, 1), i);
      const isPast = monthDate < new Date();
      
      // Сезонность: лето, праздники, тренд роста
      const month = monthDate.getMonth();
      const seasonalFactor = month >= 5 && month <= 7 ? 1.4 : 
                            month === 11 || month === 0 ? 1.3 : 1.0;
      const trendFactor = 1 + (i * 0.02); // 2% рост каждый месяц
      
      const actualValue = isPast ? Math.floor((300000 + Math.random() * 100000) * seasonalFactor) : undefined;
      const predictedValue = Math.floor((320000 + Math.random() * 80000) * seasonalFactor * trendFactor);
      
      prediction.push({
        month: format(monthDate, 'MMM yyyy', { locale: ru }),
        actual: actualValue,
        predicted: predictedValue,
        trend: 300000 * trendFactor * seasonalFactor
      });
    }
    
    setPredictionData(prediction);
    
    // Генерация трендов использования автомобилей по категориям
    const utilization: CarUtilizationTrend[] = [];
    
    for (let i = 0; i < 12; i++) {
      const monthDate = addMonths(new Date(new Date().getFullYear(), currentMonth - 11, 1), i);
      const month = format(monthDate, 'MMM yyyy', { locale: ru });
      
      // Сезонные тренды для разных категорий
      const seasonalMonth = monthDate.getMonth();
      const economyFactor = seasonalMonth >= 4 && seasonalMonth <= 8 ? 0.85 : 0.7;
      const comfortFactor = 0.75 + Math.sin(i / 3) * 0.15;
      const businessFactor = 0.7 + Math.cos(i / 4) * 0.2;
      const premiumFactor = 0.65 + (seasonalMonth === 11 || seasonalMonth <= 1 ? 0.2 : 0);
      const suvFactor = seasonalMonth >= 10 || seasonalMonth <= 2 ? 0.85 : 0.7;
      
      utilization.push({
        month,
        economy: Math.floor(economyFactor * 100),
        comfort: Math.floor(comfortFactor * 100),
        business: Math.floor(businessFactor * 100),
        premium: Math.floor(premiumFactor * 100),
        suv: Math.floor(suvFactor * 100)
      });
    }
    
    setUtilizationTrends(utilization);
    
    // Генерация данных о новых и повторных клиентах
    const booking: BookingTrend[] = [];
    
    for (let i = 0; i < 12; i++) {
      const monthDate = addMonths(new Date(new Date().getFullYear(), currentMonth - 11, 1), i);
      const month = format(monthDate, 'MMM', { locale: ru });
      
      // Тренд: рост новых клиентов летом, рост постоянных - равномерно
      const seasonalMonth = monthDate.getMonth();
      const newCustomersFactor = seasonalMonth >= 4 && seasonalMonth <= 8 ? 1.4 : 1.0;
      
      const newCustomers = Math.floor((15 + Math.random() * 10) * newCustomersFactor);
      const repeating = Math.floor(10 + i * 0.8 + Math.random() * 8); // Рост постоянных клиентов
      
      booking.push({
        month,
        newCustomers,
        repeating
      });
    }
    
    setBookingTrends(booking);
    
    // Генерация данных о занятости автопарка
    const occupancy: OccupancyData[] = [];
    const totalCars = 35; // Общее количество автомобилей
    
    for (let i = 0; i < 30; i++) {
      const date = format(addMonths(new Date(), -1).getTime() + i * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
      
      // Сезонность и выходные дни
      const currentDate = new Date(date);
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const month = currentDate.getMonth();
      const seasonalFactor = month >= 5 && month <= 8 ? 0.8 : 0.6; // Лето
      const weekendFactor = isWeekend ? 0.9 : 0.7; // Выходные
      
      const occupancyRate = Math.min(0.95, seasonalFactor * weekendFactor + Math.random() * 0.2);
      const occupiedCars = Math.floor(totalCars * occupancyRate);
      
      occupancy.push({
        date,
        occupancy: occupiedCars,
        available: totalCars - occupiedCars
      });
    }
    
    setOccupancyData(occupancy);
  };

  const handleExportData = (format: 'csv' | 'excel' | 'pdf') => {
    toast({
      title: "Экспорт данных",
      description: `Данные успешно экспортированы в формате ${format.toUpperCase()}`,
    });
  };

  const formatDate = (dateString: string, format: string = 'd MMM') => {
    try {
      if (dateString.includes('-')) {
        return format(parseISO(dateString), format, { locale: ru });
      } else {
        return dateString; // Если уже отформатировано
      }
    } catch (e) {
      return dateString;
    }
  };

  // Фильтрация данных по категориям
  const filteredRevenueData = useMemo(() => {
    if (selectedCarCategories.includes("all")) {
      return revenueData.filter(item => !item.category);
    } else {
      return revenueData.filter(item => item.category && selectedCarCategories.includes(item.category));
    }
  }, [revenueData, selectedCarCategories]);
  
  // Суммарные статистики
  const totalRevenue = useMemo(() => {
    return filteredRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  }, [filteredRevenueData]);
  
  const totalBookings = useMemo(() => {
    return filteredRevenueData.reduce((sum, item) => sum + item.bookings, 0);
  }, [filteredRevenueData]);
  
  const averageBookingPrice = useMemo(() => {
    return totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
  }, [totalRevenue, totalBookings]);
  
  const categoryRevenue = useMemo(() => {
    if (selectedCarCategories.includes("all")) {
      return categoryData.map(category => ({
        name: category.name,
        value: category.revenue || 0
      }));
    } else {
      return categoryData
        .filter(category => {
          const categoryName = category.name.toLowerCase();
          return selectedCarCategories.some(selected => 
            categoryName.includes(selected) || 
            selected.includes(categoryName.substring(0, 5))
          );
        })
        .map(category => ({
          name: category.name,
          value: category.revenue || 0
        }));
    }
  }, [categoryData, selectedCarCategories]);

  return (
    <RequireAuth requiredRole="admin">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/admin/analytics")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Расширенная аналитика</h1>
              <p className="text-sm text-muted-foreground">Подробный анализ доходов и прогнозирование</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Экспорт
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExportData('csv')}>
                  Экспорт в CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportData('excel')}>
                  Экспорт в Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportData('pdf')}>
                  Экспорт в PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => fetchAnalyticsData()}
            >
              <RefreshCw className="h-4 w-4" />
              Обновить
            </Button>
            
            <Button onClick={() => navigate("/admin/dashboard")}>
              Дашборд
            </Button>
          </div>
        </div>

        {/* Фильтры и параметры */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Временной период</h3>
                <div className="flex gap-2">
                  <Select 
                    value={period} 
                    onValueChange={(value: any) => setPeriod(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите период" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Последние 7 дней</SelectItem>
                      <SelectItem value="30days">Последние 30 дней</SelectItem>
                      <SelectItem value="90days">Последние 90 дней</SelectItem>
                      <SelectItem value="6months">Последние 6 месяцев</SelectItem>
                      <SelectItem value="12months">Последние 12 месяцев</SelectItem>
                      <SelectItem value="custom">Произвольный период</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {period === "custom" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Calendar className="h-4 w-4" />
                          {startDate && endDate ? (
                            <span>
                              {format(startDate, "dd.MM.yyyy")} - {format(endDate, "dd.MM.yyyy")}
                            </span>
                          ) : (
                            "Выберите даты"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="flex gap-2 p-3">
                          <div>
                            <div className="mb-2 text-xs font-medium">Начало</div>
                            <CalendarComponent
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </div>
                          <div>
                            <div className="mb-2 text-xs font-medium">Конец</div>
                            <CalendarComponent
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium">Формат данных</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedDataFormat === "daily" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedDataFormat("daily")}
                    >
                      По дням
                    </Button>
                    <Button 
                      variant={selectedDataFormat === "weekly" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedDataFormat("weekly")}
                    >
                      По неделям
                    </Button>
                    <Button 
                      variant={selectedDataFormat === "monthly" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedDataFormat("monthly")}
                    >
                      По месяцам
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Категории автомобилей</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedCarCategories.includes("all") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCarCategories(["all"])}
                  >
                    Все категории
                  </Badge>
                  <Badge 
                    variant={selectedCarCategories.includes("economy") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedCarCategories.includes("all")) {
                        setSelectedCarCategories(["economy"]);
                      } else {
                        const newSelection = selectedCarCategories.includes("economy")
                          ? selectedCarCategories.filter(c => c !== "economy")
                          : [...selectedCarCategories, "economy"];
                        
                        setSelectedCarCategories(newSelection.length ? newSelection : ["all"]);
                      }
                    }}
                  >
                    Эконом
                  </Badge>
                  <Badge 
                    variant={selectedCarCategories.includes("comfort") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedCarCategories.includes("all")) {
                        setSelectedCarCategories(["comfort"]);
                      } else {
                        const newSelection = selectedCarCategories.includes("comfort")
                          ? selectedCarCategories.filter(c => c !== "comfort")
                          : [...selectedCarCategories, "comfort"];
                        
                        setSelectedCarCategories(newSelection.length ? newSelection : ["all"]);
                      }
                    }}
                  >
                    Комфорт
                  </Badge>
                  <Badge 
                    variant={selectedCarCategories.includes("business") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedCarCategories.includes("all")) {
                        setSelectedCarCategories(["business"]);
                      } else {
                        const newSelection = selectedCarCategories.includes("business")
                          ? selectedCarCategories.filter(c => c !== "business")
                          : [...selectedCarCategories, "business"];
                        
                        setSelectedCarCategories(newSelection.length ? newSelection : ["all"]);
                      }
                    }}
                  >
                    Бизнес
                  </Badge>
                  <Badge 
                    variant={selectedCarCategories.includes("premium") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedCarCategories.includes("all")) {
                        setSelectedCarCategories(["premium"]);
                      } else {
                        const newSelection = selectedCarCategories.includes("premium")
                          ? selectedCarCategories.filter(c => c !== "premium")
                          : [...selectedCarCategories, "premium"];
                        
                        setSelectedCarCategories(newSelection.length ? newSelection : ["all"]);
                      }
                    }}
                  >
                    Премиум
                  </Badge>
                  <Badge 
                    variant={selectedCarCategories.includes("suv") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedCarCategories.includes("all")) {
                        setSelectedCarCategories(["suv"]);
                      } else {
                        const newSelection = selectedCarCategories.includes("suv")
                          ? selectedCarCategories.filter(c => c !== "suv")
                          : [...selectedCarCategories, "suv"];
                        
                        setSelectedCarCategories(newSelection.length ? newSelection : ["all"]);
                      }
                    }}
                  >
                    Внедорожники
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Сравнение периодов</h3>
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={comparisonEnabled} 
                      onCheckedChange={setComparisonEnabled} 
                    />
                    {comparisonEnabled && (
                      <Select 
                        value={comparisonPeriod} 
                        onValueChange={(value: "previous" | "year_ago") => setComparisonPeriod(value)}
                      >
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Выберите период сравнения" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="previous">Предыдущий период</SelectItem>
                          <SelectItem value="year_ago">Аналогичный период год назад</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Дополнительные параметры</h3>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Показывать фактические данные</span>
                    <Switch 
                      checked={showRealData} 
                      onCheckedChange={setShowRealData} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Показывать прогнозы</span>
                    <Switch 
                      checked={showPredictions} 
                      onCheckedChange={setShowPredictions} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Диапазон доходов</h3>
                  <div className="px-2">
                    <Slider
                      value={revenueRange}
                      min={0}
                      max={100000}
                      step={5000}
                      onValueChange={setRevenueRange}
                    />
                    <div className="mt-1 flex justify-between text-xs">
                      <span>{revenueRange[0].toLocaleString("ru-RU")} ₽</span>
                      <span>{revenueRange[1].toLocaleString("ru-RU")} ₽</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Ценовая категория</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      min={1000}
                      max={10000}
                      step={500}
                      onValueChange={setPriceRange}
                    />
                    <div className="mt-1 flex justify-between text-xs">
                      <span>{priceRange[0].toLocaleString("ru-RU")} ₽</span>
                      <span>{priceRange[1].toLocaleString("ru-RU")} ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика и графики */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Общая выручка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CircleDollarSign className="mr-2 h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString("ru-RU")} ₽</div>
              </div>
              <div className="mt-1 flex items-center">
                <div className="flex items-center text-green-600">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span className="text-xs">+8.5%</span>
                </div>
                <span className="ml-1 text-xs text-gray-500">по сравнению с предыдущим периодом</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Количество бронирований</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CarIcon className="mr-2 h-5 w-5 text-orange-500" />
                <div className="text-2xl font-bold">{totalBookings}</div>
              </div>
              <div className="mt-1 flex items-center">
                <div className="flex items-center text-green-600">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span className="text-xs">+12.3%</span>
                </div>
                <span className="ml-1 text-xs text-gray-500">по сравнению с предыдущим периодом</span>
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
                <div className="text-2xl font-bold">{averageBookingPrice.toLocaleString("ru-RU")} ₽</div>
              </div>
              <div className="mt-1">
                <span className="text-xs text-gray-500">за одно бронирование</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Конверсия бронирований</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold">18.5%</div>
              </div>
              <div className="mt-1 flex items-center">
                <div className="flex items-center text-red-600">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  <span className="text-xs">-2.1%</span>
                </div>
                <span className="ml-1 text-xs text-gray-500">по сравнению с предыдущим периодом</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Основные графики */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Динамика доходов</CardTitle>
              <CardDescription>
                {selectedCarCategories.includes("all") 
                  ? "Общая выручка по всем категориям автомобилей" 
                  : "Выручка по выбранным категориям автомобилей"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {isLoading ? (
                <div className="flex h-80 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={filteredRevenueData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
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
                        tickFormatter={(value) => formatDate(value, selectedDataFormat === "monthly" ? "MMM yyyy" : "d MMM")}
                      />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(value) => `${value} шт.`}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          if (name === "revenue") return [`${value.toLocaleString("ru-RU")} ₽`, "Выручка"];
                          return [value, "Бронирований"];
                        }}
                        labelFormatter={(value) => formatDate(value, "d MMMM yyyy")}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        yAxisId="left"
                        name="Выручка"
                        stroke={CHART_COLORS.primary}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        yAxisId="right"
                        name="Бронирования"
                        stroke={CHART_COLORS.secondary}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Распределение доходов по категориям</CardTitle>
              <CardDescription>
                Доля различных категорий автомобилей в общем объеме выручки
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-80 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryRevenue}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryRevenue.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS.categoryColors[index % CHART_COLORS.categoryColors.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value.toLocaleString("ru-RU")} ₽`, "Выручка"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Прогноз доходов</CardTitle>
              <CardDescription>
                Прогнозирование доходов на ближайшие месяцы
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-80 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={predictionData}
                      margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          const label = name === "actual" 
                            ? "Фактический доход" 
                            : name === "predicted" 
                              ? "Прогнозируемый доход" 
                              : "Тренд";
                          return [`${value.toLocaleString("ru-RU")} ₽`, label];
                        }}
                      />
                      <Legend />
                      {showRealData && (
                        <Line
                          type="monotone"
                          dataKey="actual"
                          name="Фактический доход"
                          stroke={CHART_COLORS.secondary}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      )}
                      {showPredictions && (
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          name="Прогнозируемый доход"
                          stroke={CHART_COLORS.primary}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 4 }}
                        />
                      )}
                      <Line
                        type="monotone"
                        dataKey="trend"
                        name="Тренд"
                        stroke={CHART_COLORS.tertiary}
                        strokeWidth={1}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Подробная аналитика */}
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold">Подробная аналитика</h2>
          
          <Tabs defaultValue="utilization" className="space-y-6">
            <TabsList>
              <TabsTrigger value="utilization">Загруженность автопарка</TabsTrigger>
              <TabsTrigger value="category">Категории автомобилей</TabsTrigger>
              <TabsTrigger value="customers">Клиенты</TabsTrigger>
              <TabsTrigger value="occupancy">Занятость автомобилей</TabsTrigger>
            </TabsList>
            
            <TabsContent value="utilization">
              <Card>
                <CardHeader>
                  <CardTitle>Тренды загруженности автопарка по категориям</CardTitle>
                  <CardDescription>
                    Изменения в загруженности различных категорий автомобилей по месяцам
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex h-80 items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={utilizationTrends}
                          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `${value}%`} />
                          <Tooltip
                            formatter={(value: number) => [`${value}%`, ""]}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="economy"
                            name="Эконом"
                            stroke={CHART_COLORS.categoryColors[0]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="comfort"
                            name="Комфорт"
                            stroke={CHART_COLORS.categoryColors[1]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="business"
                            name="Бизнес"
                            stroke={CHART_COLORS.categoryColors[2]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="premium"
                            name="Премиум"
                            stroke={CHART_COLORS.categoryColors[3]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="suv"
                            name="Внедорожники"
                            stroke={CHART_COLORS.categoryColors[4]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="category">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Распределение автомобилей по категориям</CardTitle>
                    <CardDescription>
                      Количество автомобилей в каждой категории
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex h-80 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={categoryData}
                            layout="vertical"
                            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip formatter={(value: number) => [`${value} автомобилей`, "Количество"]} />
                            <Legend />
                            <Bar
                              dataKey="value"
                              name="Количество"
                              fill={CHART_COLORS.primary}
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Сравнение загруженности и доходности</CardTitle>
                    <CardDescription>
                      Корреляция между загруженностью и доходностью категорий
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex h-80 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart
                            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              type="number" 
                              dataKey="utilization" 
                              name="Загруженность" 
                              unit="%" 
                              domain={[60, 90]}
                            />
                            <YAxis 
                              type="number" 
                              dataKey="revenue" 
                              name="Доход" 
                              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            />
                            <ZAxis 
                              type="number" 
                              dataKey="bookings" 
                              range={[50, 200]} 
                              name="Бронирования" 
                            />
                            <Tooltip 
                              cursor={{ strokeDasharray: '3 3' }}
                              formatter={(value: any, name: string) => {
                                if (name === 'Загруженность') return [`${value}%`, name];
                                if (name === 'Доход') return [`${Number(value).toLocaleString("ru-RU")} ₽`, name];
                                return [value, name];
                              }}
                            />
                            <Legend />
                            <Scatter 
                              name="Категории автомобилей" 
                              data={categoryData} 
                              fill={CHART_COLORS.primary}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS.categoryColors[index % CHART_COLORS.categoryColors.length]} />
                              ))}
                            </Scatter>
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Динамика новых и повторных клиентов</CardTitle>
                  <CardDescription>
                    Соотношение новых и повторных клиентов по месяцам
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex h-80 items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={bookingTrends}
                          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar 
                            dataKey="newCustomers" 
                            name="Новые клиенты" 
                            stackId="a" 
                            fill={CHART_COLORS.tertiary} 
                          />
                          <Bar 
                            dataKey="repeating" 
                            name="Постоянные клиенты" 
                            stackId="a" 
                            fill={CHART_COLORS.primary} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="occupancy">
              <Card>
                <CardHeader>
                  <CardTitle>Текущая занятость автомобилей</CardTitle>
                  <CardDescription>
                    Количество занятых и свободных автомобилей по дням
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex h-80 items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={occupancyData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                          stackOffset="expand"
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => formatDate(value)}
                          />
                          <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              return [value, name === "occupancy" ? "Занято" : "Свободно"];
                            }}
                            labelFormatter={(value) => formatDate(value, "d MMMM yyyy")}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="occupancy"
                            name="Занято"
                            stackId="1"
                            stroke={CHART_COLORS.primary}
                            fill={CHART_COLORS.primary}
                          />
                          <Area
                            type="monotone"
                            dataKey="available"
                            name="Свободно"
                            stackId="1"
                            stroke={CHART_COLORS.success}
                            fill={CHART_COLORS.success}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Ссылка на обычную аналитику */}
        <div className="mt-10">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/admin/analytics")}
          >
            <BarChart2 className="h-4 w-4" />
            Вернуться к базовой аналитике
          </Button>
        </div>
      </div>
    </RequireAuth>
  );
};

export default AdvancedAnalyticsPage;
