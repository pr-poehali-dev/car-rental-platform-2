
import {налитики и отчетов для эффективного управления бизнесом на основе данных о доходах и заг Toaster } from "@/components/ui/руженности автопарка.toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import CarDetail from "./pages/CarDetail";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/admin/Dashboard";
import CarsPage from "./pages/admin/Cars";
import BookingsPage from "./pages/admin/Bookings";
import BookingsCalendarPage from "./pages/admin/BookingsCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/car/:id" element={<CarDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Административные маршруты */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/cars" element={<CarsPage />} />
            <Route path="/admin/bookings" element={<BookingsPage />} />
            <Route path="/admin/bookings/calendar" element={<BookingsCalendarPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
