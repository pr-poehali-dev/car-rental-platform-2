
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import RequireAuth from "@/components/RequireAuth";
import { authApi } from "@/lib/api";
import { 
  Search, ArrowLeft, UserPlus, Edit, Trash2,
  UserCog, Lock, Mail, Phone, Check, X
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "manager" | "user";
  status: "active" | "inactive" | "blocked";
  createdAt: string;
  lastLogin?: string;
}

const UsersPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  
  const [newUserData, setNewUserData] = useState<Partial<UserData> & { password?: string }>({
    name: "",
    email: "",
    phone: "",
    role: "user",
    status: "active",
    password: ""
  });

  // Возможные роли пользователей
  const userRoles = [
    { value: "admin", label: "Администратор" },
    { value: "manager", label: "Менеджер" },
    { value: "user", label: "Пользователь" }
  ];

  // Возможные статусы пользователей
  const userStatuses = [
    { value: "active", label: "Активен", color: "bg-green-100 text-green-800" },
    { value: "inactive", label: "Неактивен", color: "bg-gray-100 text-gray-800" },
    { value: "blocked", label: "Заблокирован", color: "bg-red-100 text-red-800" }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь будет запрос к API
      // Для демонстрации используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUsers: UserData[] = [
        {
          id: "U1001",
          name: "Андрей Иванов",
          email: "admin@example.com",
          phone: "+7 (999) 123-45-67",
          role: "admin",
          status: "active",
          createdAt: "2024-12-15T10:30:00",
          lastLogin: "2025-05-05T09:15:00"
        },
        {
          id: "U1002",
          name: "Мария Петрова",
          email: "maria@example.com",
          phone: "+7 (999) 234-56-78",
          role: "manager",
          status: "active",
          createdAt: "2025-01-10T14:20:00",
          lastLogin: "2025-05-04T15:30:00"
        },
        {
          id: "U1003",
          name: "Дмитрий Сидоров",
          email: "dmitry@example.com",
          phone: "+7 (999) 345-67-89",
          role: "user",
          status: "active",
          createdAt: "2025-02-05T11:45:00",
          lastLogin: "2025-05-01T12:10:00"
        },
        {
          id: "U1004",
          name: "Ольга Козлова",
          email: "olga@example.com",
          phone: "+7 (999) 456-78-90",
          role: "user",
          status: "inactive",
          createdAt: "2025-03-15T09:30:00"
        },
        {
          id: "U1005",
          name: "Иван Смирнов",
          email: "ivan@example.com",
          phone: "+7 (999) 567-89-01",
          role: "user",
          status: "blocked",
          createdAt: "2025-01-25T16:40:00",
          lastLogin: "2025-02-15T10:20:00"
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      // В реальном приложении здесь будет запрос к API
      // Для демонстрации добавляем пользователя локально
      const newUser: UserData = {
        id: `U${Math.floor(1000 + Math.random() * 9000)}`,
        name: newUserData.name || "",
        email: newUserData.email || "",
        phone: newUserData.phone,
        role: newUserData.role as "admin" | "manager" | "user" || "user",
        status: newUserData.status as "active" | "inactive" | "blocked" || "active",
        createdAt: new Date().toISOString()
      };
      
      setUsers([...users, newUser]);
      setIsAddUserDialogOpen(false);
      setNewUserData({
        name: "",
        email: "",
        phone: "",
        role: "user",
        status: "active",
        password: ""
      });
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
    }
  };

  const handleEditUser = async () => {
    if (!currentUser) return;
    
    try {
      // В реальном приложении здесь будет запрос к API
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? currentUser : user
      );
      
      setUsers(updatedUsers);
      setIsEditUserDialogOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    try {
      // В реальном приложении здесь будет запрос к API
      const filteredUsers = users.filter(user => user.id !== currentUser.id);
      
      setUsers(filteredUsers);
      setIsDeleteDialogOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusObj = userStatuses.find(s => s.value === status);
    return {
      label: statusObj?.label || "Неизвестно",
      color: statusObj?.color || "bg-gray-100 text-gray-800"
    };
  };

  const getRoleLabel = (role: string) => {
    const roleObj = userRoles.find(r => r.value === role);
    return roleObj?.label || role;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "d MMMM yyyy HH:mm", { locale: ru });
  };

  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => 
      selectedRole ? user.role === selectedRole : true
    )
    .filter(user => 
      selectedStatus ? user.status === selectedStatus : true
    );

  return (
    <RequireAuth requiredRole="admin">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">Управление пользователями</h1>
          </div>
          <Button
            onClick={() => setIsAddUserDialogOpen(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" /> Добавить пользователя
          </Button>
        </div>

        {/* Фильтры и поиск */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск по имени, email или ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center space-x-2">
                  <UserCog className="h-4 w-4 text-gray-400" />
                  <Select
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Все роли" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все роли</SelectItem>
                      {userRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Все статусы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все статусы</SelectItem>
                      {userStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Таблица пользователей */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Создан</TableHead>
                      <TableHead>Последний вход</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <UserCog className="mb-2 h-8 w-8 text-gray-300" />
                            <p className="text-gray-500">Пользователи не найдены</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => {
                        const statusInfo = getStatusInfo(user.status);
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getRoleLabel(user.role)}</TableCell>
                            <TableCell>
                              <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            <TableCell>{formatDate(user.lastLogin)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setCurrentUser(user);
                                    setIsEditUserDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => {
                                    setCurrentUser(user);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Диалог добавления пользователя */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Добавить нового пользователя</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Имя пользователя *
                </label>
                <Input
                  id="name"
                  placeholder="Введите полное имя"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Телефон
                </label>
                <Input
                  id="phone"
                  placeholder="+7 (XXX) XXX-XX-XX"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Пароль *
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Роль *
                  </label>
                  <Select
                    value={newUserData.role}
                    onValueChange={(value: "admin" | "manager" | "user") => 
                      setNewUserData({ ...newUserData, role: value })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Статус *
                  </label>
                  <Select
                    value={newUserData.status}
                    onValueChange={(value: "active" | "inactive" | "blocked") => 
                      setNewUserData({ ...newUserData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      {userStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={handleAddUser}
                disabled={!newUserData.name || !newUserData.email || !newUserData.password}
              >
                Добавить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Диалог редактирования пользователя */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            {currentUser && (
              <>
                <DialogHeader>
                  <DialogTitle>Редактировать пользователя</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-name" className="text-sm font-medium">
                      Имя пользователя *
                    </label>
                    <Input
                      id="edit-name"
                      value={currentUser.name}
                      onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="edit-email" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={currentUser.email}
                      onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="edit-phone" className="text-sm font-medium">
                      Телефон
                    </label>
                    <Input
                      id="edit-phone"
                      value={currentUser.phone || ""}
                      onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="edit-role" className="text-sm font-medium">
                        Роль *
                      </label>
                      <Select
                        value={currentUser.role}
                        onValueChange={(value: "admin" | "manager" | "user") => 
                          setCurrentUser({ ...currentUser, role: value })
                        }
                      >
                        <SelectTrigger id="edit-role">
                          <SelectValue placeholder="Выберите роль" />
                        </SelectTrigger>
                        <SelectContent>
                          {userRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="edit-status" className="text-sm font-medium">
                        Статус *
                      </label>
                      <Select
                        value={currentUser.status}
                        onValueChange={(value: "active" | "inactive" | "blocked") => 
                          setCurrentUser({ ...currentUser, status: value })
                        }
                      >
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                        <SelectContent>
                          {userStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="edit-password" className="text-sm font-medium">
                      Новый пароль (оставьте пустым, чтобы не менять)
                    </label>
                    <Input
                      id="edit-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button
                    onClick={handleEditUser}
                    disabled={!currentUser.name || !currentUser.email}
                  >
                    Сохранить
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Диалог подтверждения удаления */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Подтверждение удаления</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Вы уверены, что хотите удалить пользователя{" "}
                <span className="font-semibold">{currentUser?.name}</span>?
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Это действие невозможно отменить. Все данные пользователя будут удалены из системы.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RequireAuth>
  );
};

export default UsersPage;
