
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart, CartItem } from "@/contexts/CartContext";
import { Trash2, ShoppingCart, X } from "lucide-react";
import { Link } from "react-router-dom";

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, item: Partial<CartItem>) => void;
}

const CartItemCard = ({ item, onRemove, onUpdate }: CartItemCardProps) => {
  const handleDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const days = parseInt(e.target.value);
    onUpdate(item.id, { rentalDays: days });
  };

  return (
    <div className="flex gap-4 py-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium">{item.title}</h3>
          <button
            type="button"
            className="-mr-1 text-gray-400 hover:text-red-500"
            onClick={() => onRemove(item.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500">{item.category}</p>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm">Дней:</span>
            <select
              value={item.rentalDays}
              onChange={handleDaysChange}
              className="ml-2 rounded-md border border-gray-200 p-1 text-xs"
            >
              {[1, 2, 3, 4, 5, 6, 7, 14, 30].map((days) => (
                <option key={days} value={days}>
                  {days}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm font-medium">
            {(item.price * item.rentalDays).toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </div>
    </div>
  );
};

interface CartDrawerProps {
  children?: React.ReactNode;
}

const CartDrawer = ({ children }: CartDrawerProps) => {
  const { items, removeItem, updateItem, clearCart, itemCount, totalPrice } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
          <SheetDescription>
            {itemCount > 0
              ? `В вашей корзине ${itemCount} ${
                  itemCount === 1 ? "автомобиль" : itemCount < 5 ? "автомобиля" : "автомобилей"
                }`
              : "Ваша корзина пуста"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
              <p className="text-center text-gray-500">
                В вашей корзине пока нет автомобилей.
                <br />
                Добавьте автомобили из каталога.
              </p>
              <SheetClose asChild>
                <Button className="mt-6" variant="outline" asChild>
                  <Link to="/">Перейти в каталог</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdate={updateItem}
                  />
                ))}
              </div>
              {items.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-red-500 hover:text-red-600"
                    onClick={clearCart}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Очистить корзину
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Общая стоимость:</span>
                <span className="font-medium">
                  {totalPrice.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>

            <SheetFooter className="mt-6">
              <SheetClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Продолжить покупки
                </Button>
              </SheetClose>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/checkout">Оформить заказ</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
