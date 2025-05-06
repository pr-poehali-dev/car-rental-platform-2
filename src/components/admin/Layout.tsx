import { useState } from "react");
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authApi } from "@/lib/api";
import { 
  LogOut, 
  LayoutDashboard, 
  Car, 
  CalendarRange, 
  Users, 
  BarChart2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  UserCog
} from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Дашборд",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
      active: location.pathname === "/admin" || location.pathname === "/admin/dashboard",
    },
    {
      label: "Автомобили",
      icon: <Car className="h-5 w-5" />,
      href: "/admin/cars",
      active: location.pathname.startsWith("/admin/cars"),
    },
    {
      label: "Бронирования",
      icon: <CalendarRange className="h-5 w-5" />,
      href: "/admin/bookings",
      active: location.pathname.startsWith("/admin/bookings"),
    },
    {
      label: "Пользователи",
      icon: <UserCog className="h-5 w-5" />,
      href: "/admin/users",
      active: location.pathname.startsWith("/admin/users"),
    },
    {
      label: "Аналитика",
      icon: <BarChart2 className="h-5 w-5" />,
      href: "/admin/analytics",
      active: location.pathname.startsWith("/admin/analytics"),
    },
    {
      label: "Настройки",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      active: location.pathname.startsWith("/admin/settings"),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Мобильное меню */}
      <div className="fixed top-0 z-50 flex w-full items-center border-b bg-white p-4 lg:hidden">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <span className="ml-4 font-bold">Админ-панель</span>
      </div>
      
      {/* Боковое меню - мобильное */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mt-16 p-4">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <Separator className="my-4" />
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Выйти</span>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Боковое меню - десктоп */}
      <div 
        className={`hidden border-r bg-white ${
          isCollapsed ? "w-[70px]" : "w-64"
        } transition-all duration-300 lg:block`}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-between">
          <div>
            <div className={`flex h-16 items-center ${isCollapsed ? "justify-center" : "px-4"}`}>{
              !isCollapsed && <span className="text-xl font-bold">АвтоПрокат</span>}
              {isCollapsed && <Car className="h-6 w-6 text-primary" />}
            </div>
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className={isCollapsed ? "mx-auto" : "mr-3"}>{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4">
            <Button
              variant="ghost"
              size="icon"
              className="mb-4 ml-auto block"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              className={`text-red-500 ${isCollapsed ? "w-10 px-0" : "w-full"}`}
              onClick={handleLogout}
            >
              <LogOut className={isCollapsed ? "mx-auto h-5 w-5" : "mr-3 h-5 w-5"} />
              {!isCollapsed && <span>Выйти</span>}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Основное содержимое */}
      <div className="flex-1 pb-10 pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;