
import axios from "axios";

// Базовая настройка axios
const API_URL = "https://api.autopro.ru/v1"; // Замените на ваш реальный API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок ответа
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибки авторизации
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API для автомобилей
export const carsApi = {
  getAll: async (params?: any) => {
    const response = await api.get("/cars", { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },
  
  create: async (carData: any) => {
    const response = await api.post("/cars", carData);
    return response.data;
  },
  
  update: async (id: string, carData: any) => {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  }
};

// API для бронирований
export const bookingsApi = {
  getAll: async (params?: any) => {
    const response = await api.get("/bookings", { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  create: async (bookingData: any) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },
  
  update: async (id: string, bookingData: any) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
  
  confirmBooking: async (id: string) => {
    const response = await api.post(`/bookings/${id}/confirm`);
    return response.data;
  },
  
  cancelBooking: async (id: string, reason?: string) => {
    const response = await api.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  }
};

// API для аутентификации
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
  
  isAdmin: () => {
    const user = authApi.getCurrentUser();
    return user && user.role === "admin";
  }
};

export default api;
