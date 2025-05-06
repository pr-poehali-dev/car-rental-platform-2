
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "manager" | "user";
}

/**
 * Компонент для защиты маршрутов, требующих авторизации
 * Проверяет наличие авторизации и, опционально, роль пользователя
 */
const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  requiredRole 
}) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем авторизацию пользователя
        const isAuth = authApi.isAuthenticated();
        
        // Если требуется определенная роль, проверяем её
        let hasRole = true;
        if (requiredRole && isAuth) {
          const user = authApi.getCurrentUser();
          hasRole = user?.role === requiredRole;
        }
        
        setIsAuthorized(isAuth && hasRole);
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
        setIsAuthorized(false);
      } finally {
        // Убираем индикатор загрузки в любом случае
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  // Показываем индикатор загрузки во время проверки
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
        <span className="ml-2 text-lg font-medium">Проверка авторизации...</span>
      </div>
    );
  }

  // Если не авторизован, перенаправляем на страницу входа
  // сохраняя исходный путь для возврата после авторизации
  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если авторизован, отображаем защищенный контент
  return <>{children}</>;
};

export default RequireAuth;
