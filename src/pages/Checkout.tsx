
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { ArrowLeft, CreditCard, Truck, Check } from "lucide-react";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "card"
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет отправка данных на сервер
    setFormSubmitted(true);
    
    // Имитация задержки обработки заказа
    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 2000);
  };

  if (items.length === 0 && !formSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto mt-10 max-w-md text-center">
          <h1 className="text-2xl font-bold">Ваша корзина пуста</h1>
          <p className="mt-4">Выберите автомобили из каталога, чтобы оформить заказ</p>
          <Button className="mt-6" asChild>
            <Link to="/">Перейти к выбору автомобилей</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto mt-10 max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Заказ успешно оформлен!</h1>
          <p className="mt-4">
            Ваш заказ принят в обработку. Скоро с вами свяжется наш менеджер для подтверждения.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="ghost" className="gap-2" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Вернуться в каталог
            </Link>
          </Button>
        </div>
        
        <h1 className="mb-8 text-2xl font-bold md:text-3xl">Оформление заказа</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Личные данные</h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      Имя *
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Введите имя"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Фамилия *
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Введите фамилию"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Телефон *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Адрес получения</h2>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Адрес *
                  </label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Улица, дом, квартира"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      Город *
                    </label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Введите город"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="zip" className="text-sm font-medium">
                      Индекс
                    </label>
                    <Input
                      id="zip"
                      name="zip"
                      placeholder="123456"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Способ оплаты</h2>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={() => setFormData({...formData, paymentMethod: "card"})}
                      className="h-4 w-4 text-primary"
                    />
                    <span>Банковской картой</span>
                    <CreditCard className="ml-2 h-4 w-4 text-gray-500" />
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === "cash"}
                      onChange={() => setFormData({...formData, paymentMethod: "cash"})}
                      className="h-4 w-4 text-primary"
                    />
                    <span>Наличными при получении</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-8">
                <Button type="submit" className="w-full py-6 text-lg md:w-auto">
                  Оформить заказ
                </Button>
              </div>
            </form>
          </div>
          
          <div>
            <div className="sticky top-20 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Ваш заказ</h2>
              
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex py-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.rentalDays} дн.</p>
                      <div className="mt-auto flex justify-between">
                        <p className="text-xs text-gray-500">{item.category}</p>
                        <p className="text-sm font-medium">
                          {(item.price * item.rentalDays).toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Стоимость аренды:</span>
                  <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Доставка:</span>
                  <span>Бесплатно</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Итого:</span>
                  <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Truck className="h-4 w-4" />
                <span>Бесплатная доставка в пределах города</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
