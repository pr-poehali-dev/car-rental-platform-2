
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Car, CheckCircle, Clock, Shield, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import CarGallery from "@/components/CarGallery";

// Временные данные для демонстрации
const carsData = {
  "1": {
    id: "1",
    title: "Toyota Camry",
    description: "Toyota Camry — комфортный седан бизнес-класса с просторным салоном, отличной шумоизоляцией и высоким уровнем безопасности. Автомобиль оснащен автоматической коробкой передач, современной мультимедийной системой и климат-контролем.",
    images: [
      "https://images.unsplash.com/photo-1621007971846-d2f9aaf4afca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    price: 3500,
    priceUnit: "день",
    priceWeek: 21000,
    priceMonth: 70000,
    deposit: 10000,
    category: "Бизнес",
    year: 2023,
    transmission: "Автомат",
    fuel: "Бензин",
    engine: "2.5 л",
    power: "181 л.с.",
    doors: 4,
    seats: 5,
    consumption: "7.2 л/100 км",
    ac: true,
    cruiseControl: true,
    bluetooth: true,
    usb: true,
    navigation: true,
    parkingSensors: true,
    leatherSeats: true,
    available: true,
    features: ["Автомат", "5 мест", "Кондиционер", "Круиз-контроль"]
  },
  "2": {
    id: "2",
    title: "Kia Rio",
    description: "Kia Rio — компактный и экономичный автомобиль, идеальный для городских поездок. Отличается низким расходом топлива, маневренностью и доступной стоимостью аренды.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    price: 2000,
    priceUnit: "день",
    priceWeek: 12000,
    priceMonth: 40000,
    deposit: 5000,
    category: "Эконом",
    year: 2022,
    transmission: "Автомат",
    fuel: "Бензин",
    engine: "1.6 л",
    power: "123 л.с.",
    doors: 4,
    seats: 5,
    consumption: "6.3 л/100 км",
    ac: true,
    cruiseControl: false,
    bluetooth: true,
    usb: true,
    navigation: false,
    parkingSensors: false,
    leatherSeats: false,
    available: true,
    features: ["Автомат", "5 мест", "Кондиционер"]
  }
};

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [rentalType, setRentalType] = useState("daily");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [additionalOptions, setAdditionalOptions] = useState({
    fullInsurance: false,
    childSeat: false,
    gps: false,
    additionalDriver: false
  });

  // Проверка существования автомобиля
  const car = id && carsData[id] ? carsData[id] : null;

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto mt-10 text-center">
          <h1 className="text-2xl font-bold">Автомобиль не найден</h1>
          <p className="mt-4">Извините, запрашиваемый автомобиль не существует или был удален.</p>
          <Button className="mt-6" asChild>
            <Link to="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Расчет стоимости аренды в зависимости от типа
  const getPriceByType = () => {
    switch (rentalType) {
      case "daily":
        return car.price;
      case "weekly":
        return car.priceWeek / 7;
      case "monthly":
        return car.priceMonth / 30;
      default:
        return car.price;
    }
  };

  const handleOptionChange = (option: keyof typeof additionalOptions) => {
    setAdditionalOptions({
      ...additionalOptions,
      [option]: !additionalOptions[option]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-8">
        {/* Хлебные крошки */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary">Главная</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-primary">Каталог</Link>
          <span>/</span>
          <span className="font-medium text-gray-700">{car.title}</span>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Основная информация */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{car.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{car.category}</Badge>
                <Badge variant="outline">{car.year} год</Badge>
                <Badge variant="outline">{car.transmission}</Badge>
                <Badge variant="outline">{car.fuel}</Badge>
              </div>
            </div>
            
            {/* Галерея */}
            <CarGallery images={car.images} title={car.title} />
            
            {/* Описание */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Описание</h2>
              <p className="text-gray-700">{car.description}</p>
            </div>
            
            {/* Характеристики */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Характеристики</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span>Двигатель: {car.engine}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span>Мощность: {car.power}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span>Расход: {car.consumption}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span>Дверей: {car.doors}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span>Мест: {car.seats}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span>КПП: {car.transmission}</span>
                </div>
              </div>
            </div>
            
            {/* Опции и комплектация */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Комплектация</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {car.ac && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Кондиционер</span>
                  </div>
                )}
                {car.cruiseControl && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Круиз-контроль</span>
                  </div>
                )}
                {car.bluetooth && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Bluetooth</span>
                  </div>
                )}
                {car.usb && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>USB</span>
                  </div>
                )}
                {car.navigation && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Навигация</span>
                  </div>
                )}
                {car.parkingSensors && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Парктроник</span>
                  </div>
                )}
                {car.leatherSeats && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Кожаный салон</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Форма бронирования */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-xl font-semibold">Забронировать</h2>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Стоимость</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{getPriceByType().toLocaleString('ru-RU')}</span>
                    <span className="ml-1 text-sm text-gray-500">₽/{car.priceUnit}</span>
                  </div>
                </div>
                
                <Tabs defaultValue="daily" className="mb-4" onValueChange={value => setRentalType(value)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="daily">День</TabsTrigger>
                    <TabsTrigger value="weekly">Неделя</TabsTrigger>
                    <TabsTrigger value="monthly">Месяц</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="mb-4 space-y-3">
                  <p className="font-medium">Дата и время получения</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Выберите дату</span>
                    </Button>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4 space-y-3">
                  <p className="font-medium">Дата и время возврата</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Выберите дату</span>
                    </Button>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                    </select>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Дополнительные опции</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                        checked={additionalOptions.fullInsurance}
                        onChange={() => handleOptionChange('fullInsurance')}
                      />
                      <span>Полная страховка (+500 ₽/день)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                        checked={additionalOptions.childSeat}
                        onChange={() => handleOptionChange('childSeat')}
                      />
                      <span>Детское кресло (+300 ₽/день)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                        checked={additionalOptions.gps}
                        onChange={() => handleOptionChange('gps')}
                      />
                      <span>GPS-навигатор (+200 ₽/день)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                        checked={additionalOptions.additionalDriver}
                        onChange={() => handleOptionChange('additionalDriver')}
                      />
                      <span>Дополнительный водитель (+400 ₽/день)</span>
                    </label>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Залог:</span>
                    <span className="font-medium">{car.deposit.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Итого:</span>
                    <span>{car.price.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <Button className="w-full" size="lg">
                    Забронировать
                  </Button>
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    <ShoppingCart className="h-4 w-4" />
                    В корзину
                  </Button>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Бесплатная отмена за 24 часа до начала аренды</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Круглосуточная поддержка клиентов</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
