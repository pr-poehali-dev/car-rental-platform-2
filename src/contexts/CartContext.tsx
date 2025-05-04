
import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  priceUnit: string;
  category: string;
  features: string[];
  rentalDays: number;
  startDate?: string;
  endDate?: string;
  options?: {
    fullInsurance: boolean;
    childSeat: boolean;
    gps: boolean;
    additionalDriver: boolean;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<CartItem>) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedItems = localStorage.getItem("cartItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Проверяем, есть ли уже этот автомобиль в корзине
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Если да, обновляем его
        return prevItems.map((i) => (i.id === item.id ? { ...i, ...item } : i));
      }
      // Если нет, добавляем новый
      return [...prevItems, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updatedItem: Partial<CartItem>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.length;

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.rentalDays + getOptionsPrice(item),
    0
  );

  const getOptionsPrice = (item: CartItem) => {
    let optionsPrice = 0;
    if (item.options) {
      if (item.options.fullInsurance) optionsPrice += 500 * item.rentalDays;
      if (item.options.childSeat) optionsPrice += 300 * item.rentalDays;
      if (item.options.gps) optionsPrice += 200 * item.rentalDays;
      if (item.options.additionalDriver) optionsPrice += 400 * item.rentalDays;
    }
    return optionsPrice;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        itemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
