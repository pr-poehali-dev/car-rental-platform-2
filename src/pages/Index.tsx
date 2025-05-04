
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import CarCard from "@/components/CarCard";
import { CalendarIcon, ChevronRight, SearchIcon } from "lucide-react";

// Временные данные для демонстрации
const carsData = [
  {
    id: "1",
    title: "Toyota Camry",
    image: "https://images.unsplash.com/photo-1621007971846-d2f9aaf4afca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    price: 3500,
    priceUnit: "день",
    category: "Бизнес",
    features: ["Автомат", "5 мест", "Кондиционер", "Круиз-контроль"]
  },
  {
    id: "2",
    title: "Kia Rio",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    price: 2000,
    priceUnit: "день",
    category: "Эконом",
    features: ["Автомат", "5 мест", "Кондиционер"]
  },
  {
    id: "3",
    title: "BMW X5",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    price: 7500,
    priceUnit: "день",
    category: "Премиум",
    features: ["Автомат", "5 мест", "Кондиционер", "Кожаный салон", "Панорамная крыша"]
  },
  {
    id: "4",
    title: "Volkswagen Tiguan",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0b1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    price: 4000,
    priceUnit: "день",
    category: "Внедорожник",
    features: ["Автомат", "5 мест", "Кондиционер", "Полный привод"]
  }
];

const Index = () => {
  const [priceRange, setPriceRange] = useState([2000, 8000]);
  const [cars, setCars] = useState(carsData);

  // Имитация фильтрации по цене
  useEffect(() => {
    const filtered = carsData.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1]
    );
    setCars(filtered);
  }, [priceRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero секция */}
      <section className="relative bg-primary py-16 text-white">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Аренда автомобилей в вашем городе
              </h1>
              <p className="text-lg md:text-xl">
                Широкий выбор автомобилей разных классов для любых задач.
                Быстрое оформление и доступные цены.
              </p>
              <div>
                <Button className="gap-2 bg-white text-primary hover:bg-gray-100">
                  Выбрать автомобиль <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="hidden md:flex md:items-center">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Аренда автомобилей" 
                className="rounded-lg object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Форма поиска */}
      <section className="container mx-auto -mt-8 px-4">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="daily">Аренда на сутки</TabsTrigger>
              <TabsTrigger value="monthly">Долгосрочная аренда</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Дата получения</label>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Выберите дату</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Дата возврата</label>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Выберите дату</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Класс автомобиля</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="">Все классы</option>
                    <option value="economy">Эконом</option>
                    <option value="business">Бизнес</option>
                    <option value="premium">Премиум</option>
                    <option value="suv">Внедорожники</option>
                  </select>
                </div>
                <Button className="mt-auto flex items-center gap-2">
                  <SearchIcon className="h-4 w-4" />
                  Найти автомобиль
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="monthly" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Дата начала</label>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Выберите дату</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Срок аренды</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="1">1 месяц</option>
                    <option value="3">3 месяца</option>
                    <option value="6">6 месяцев</option>
                    <option value="12">1 год</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Класс автомобиля</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="">Все классы</option>
                    <option value="economy">Эконом</option>
                    <option value="business">Бизнес</option>
                    <option value="premium">Премиум</option>
                    <option value="suv">Внедорожники</option>
                  </select>
                </div>
                <Button className="mt-auto flex items-center gap-2">
                  <SearchIcon className="h-4 w-4" />
                  Найти автомобиль
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Каталог автомобилей */}
      <section className="container mx-auto py-12">
        <h2 className="mb-8 text-3xl font-bold">Популярные автомобили</h2>
        
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Фильтр по цене</h3>
          <div className="px-4">
            <Slider
              defaultValue={[2000, 8000]}
              max={10000}
              min={500}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="mt-2 flex justify-between text-sm">
              <span>{priceRange[0].toLocaleString('ru-RU')} ₽</span>
              <span>{priceRange[1].toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cars.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="gap-2">
            Показать все автомобили
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Преимущества */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-3xl font-bold">Почему выбирают нас</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 14-6 6h9v-3"></path>
                  <path d="M18.37 3.63 8 14l3 3L21.37 6.63a2.12 2.12 0 1 0-3-3Z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Быстрое оформление</h3>
              <p className="text-gray-600">Минимум документов и быстрое оформление договора аренды</p>
            </div>
            
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-4"></path>
                  <path d="M21 15h-7"></path>
                  <path d="m18 12-3 3 3 3"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Большой автопарк</h3>
              <p className="text-gray-600">Автомобили всех классов и категорий на любой вкус</p>
            </div>
            
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Страховка включена</h3>
              <p className="text-gray-600">Все автомобили застрахованы по ОСАГО и КАСКО</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Подвал */}
      <footer className="bg-gray-800 py-8 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">АвтоПрокат</h3>
              <p className="text-sm">Аренда автомобилей для любых задач. Работаем с 2010 года.</p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Контакты</h3>
              <address className="not-italic">
                <p className="mb-2 text-sm">ул. Автомобильная, 123</p>
                <p className="mb-2 text-sm">+7 (999) 123-45-67</p>
                <p className="text-sm">info@autopro.ru</p>
              </address>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Информация</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white">О компании</a></li>
                <li><a href="/terms" className="hover:text-white">Условия аренды</a></li>
                <li><a href="/faq" className="hover:text-white">Частые вопросы</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Подписка</h3>
              <p className="mb-4 text-sm">Подпишитесь на наши новости и акции</p>
              <div className="flex">
                <input type="email" placeholder="Ваш e-mail" className="w-full rounded-l-md px-3 py-2 text-gray-800" />
                <Button className="rounded-l-none">OK</Button>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-700" />
          <p className="text-center text-sm">© 2025 АвтоПрокат. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
