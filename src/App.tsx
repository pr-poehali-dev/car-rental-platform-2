import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import RequireAuth from "@/components/RequireAuth";
import Index from "./pages/Index";
import CarDetail from "./pages/CarDetail";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/admin/Dashboard";
import CarsPage from "./pages/admin/Cars";
import BookingsPage from "./pages/admin/Bookings";
import BookingsCalendarPage from "./pages/admin/BookingsCalendar";
import AnalyticsPage from "./pages/admin/Analytics";
import UsersPage from "./pages/admin/Users";
import SettingsPage from "./pages/admin/Settings";
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
            
            {/* Административные маршруты - защищены RequireAuth */}
            <Route 
              path="/admin" 
              element={
                <RequireAuth requiredRole="admin">
                  <AdminDashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <RequireAuth requiredRole="admin">
                  <AdminDashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/cars" 
              element={
                <RequireAuth requiredRole="admin">
                  <CarsPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/bookings" 
              element={
                <RequireAuth requiredRole="admin">
                  <BookingsPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/bookings/calendar" 
              element={
                <RequireAuth requiredRole="admin">
                  <BookingsCalendarPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <RequireAuth requiredRole="admin">
                  <AnalyticsPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <RequireAuth requiredRole="admin">
                  <UsersPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <RequireAuth requiredRole="admin">
                  <SettingsPage />
                </RequireAuth>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;