
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authApi, carsApi } from "@/lib/api";
import { 
  Car, Plus, Pencil, Trash2, 
  Search, Filter, ArrowLeft 
} from "lucide-react";
import AdminLayout from "@/components/admin/Layout";

interface CarData {
  id: string;
  title: string;
  category: string;
  price: number;
  priceUnit: string;
  features: string[];
  image: string;
  status: "available" | "maintenance" | "rented";
  description?: string;
  year?: number;
  mileage?: number;
}

const CarsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState<CarData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [isEditCarDialogOpen, setIsEditCarDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<CarData | null>(null);
  const [newCarData, setNewCarData] = useState<Partial<CarData>>({
    title: "",
    category: "economy",
    price: 0,
    priceUnit: "день",
    features: [],
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2148&auto=format&fit=crop",
    status: "available",
  });

  // Категории автомобилей
  const categories = [
    { value: "economy", label: "Эконом" },
    { value: "comfort", label: "Комфорт" },
    { value: "business", label: "Бизнес" },
    { value: "premium", label: "Премиум" },
    { value: "suv", label: "Внедорожник" },
  ];

  // Статусы автомобилей
  const statuses = [
    { value: "available", label: "Доступен", color: "bg-green-100 text-green-800" },
    { value: "maintenance", label: "На ТО", color: "bg-yellow-100 text-yellow-800" },
    { value: "rented", label: "Арендован", color: "bg-blue-100 text-blue-800" },
  ];

  useEffect(() => {
    // Проверка авторизации
    if (!authApi.isAuthenticated() || !authApi.isAdmin()) {
      navigate("/login", { replace: true });
      return;
    }

    fetchCars();
  }, [navigate]);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь будет запрос к API
      // Для демонстрации используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockCars: CarData[] = [
        {
          id: "CAR001",
          title: "Toyota Camry",
          category: "comfort",
          price: 3500,
          priceUnit: "день",
          features: ["Автомат", "Кондиционер", "Bluetooth"],
          image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          status: "available",
          year: 2023,
          mileage: 15000
        },
        {
          id: "CAR002",
          title: "BMW X5",
          category: "premium",
          price: 7500,
          priceUnit: "день",
          features: ["Автомат", "Кожаный салон", "Панорамная крыша", "Навигация"],
          image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          status: "rented",
          year: 2022,
          mileage: 25000
        },
        {
          id: "CAR003",
          title: "Kia Rio",
          category: "economy",
          price: 2000,
          priceUnit: "день",
          features: ["Механика", "Кондиционер", "USB"],
          image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          status: "maintenance",
          year: 2021,
          mileage: 45000
        }
      ];
      
      setCars(mockCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCar = async () => {
    try {
      // В реальном приложении здесь будет запрос к API
      const newCar: CarData = {
        id: `CAR${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...newCarData as CarData
      };
      
      setCars([...cars, newCar]);
      setIsAddCarDialogOpen(false);
      setNewCarData({
        title: "",
        category: "economy",
        price: 0,
        priceUnit: "день",
        features: [],
        image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2148&auto=format&fit=crop",
        status: "available",
      });
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const handleEditCar = async () => {
    if (!currentCar) return;
    
    try {
      // В реальном приложении здесь будет запрос к API
      const updatedCars = cars.map(car => 
        car.id === currentCar.id ? currentCar : car
      );
      
      setCars(updatedCars);
      setIsEditCarDialogOpen(false);
      setCurrentCar(null);
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  const handleDeleteCar = async () => {
    if (!currentCar) return;
    
    try {
      // В реальном приложении здесь будет запрос к API
      const filteredCars = cars.filter(car => car.id !== currentCar.id);
      
      setCars(filteredCars);
      setIsDeleteDialogOpen(false);
      setCurrentCar(null);
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return {
      label: statusObj?.label || "Неизвестно",
      color: statusObj?.color || "bg-gray-100 text-gray-800"
    };
  };

  const getCategoryLabel = (value: string) => {
    const category = categories.find(c => c.value === value);
    return category?.label || value;
  };

  const filteredCars = cars
    .filter(car => 
      car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(car => 
      selectedCategory ? car.category === selectedCategory : true
    );

  return (
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
          <h1 className="text-2xl font-bold md:text-3xl">Управление автомобилями</h1>
        </div>
        <Button
          onClick={() => setIsAddCarDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Добавить автомобиль
        </Button>
      </div>

      {/* Фильтры и поиск */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск по названию или ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все категории</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Таблица автомобилей */}
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
                    <TableHead>Фото</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Car className="mb-2 h-8 w-8 text-gray-300" />
                          <p className="text-gray-500">Автомобили не найдены</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCars.map((car) => {
                      const statusInfo = getStatusInfo(car.status);
                      return (
                        <TableRow key={car.id}>
                          <TableCell className="font-medium">{car.id}</TableCell>
                          <TableCell>
                            <div className="h-12 w-16 overflow-hidden rounded-md">
                              <img
                                src={car.image}
                                alt={car.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{car.title}</TableCell>
                          <TableCell>{getCategoryLabel(car.category)}</TableCell>
                          <TableCell>
                            {car.price.toLocaleString("ru-RU")} ₽/{car.priceUnit}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentCar(car);
                                  setIsEditCarDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => {
                                  setCurrentCar(car);
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

      {/* Диалог добавления автомобиля */}
      <Dialog open={isAddCarDialogOpen} onOpenChange={setIsAddCarDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Добавить новый автомобиль</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Название *
                </label>
                <Input
                  id="title"
                  placeholder="Например, Toyota Camry"
                  value={newCarData.title}
                  onChange={(e) => setNewCarData({ ...newCarData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Категория *
                </label>
                <Select
                  value={newCarData.category}
                  onValueChange={(value) => setNewCarData({ ...newCarData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Цена (₽) *
                </label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={newCarData.price || ""}
                  onChange={(e) => setNewCarData({ ...newCarData, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="priceUnit" className="text-sm font-medium">
                  Единица *
                </label>
                <Select
                  value={newCarData.priceUnit}
                  onValueChange={(value) => setNewCarData({ ...newCarData, priceUnit: value })}
                >
                  <SelectTrigger id="priceUnit">
                    <SelectValue placeholder="Выберите единицу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="день">день</SelectItem>
                    <SelectItem value="неделя">неделя</SelectItem>
                    <SelectItem value="месяц">месяц</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium">
                  Год выпуска
                </label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2023"
                  value={newCarData.year || ""}
                  onChange={(e) => setNewCarData({ ...newCarData, year: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mileage" className="text-sm font-medium">
                  Пробег (км)
                </label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="0"
                  value={newCarData.mileage || ""}
                  onChange={(e) => setNewCarData({ ...newCarData, mileage: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                URL изображения *
              </label>
              <Input
                id="image"
                placeholder="https://example.com/car.jpg"
                value={newCarData.image}
                onChange={(e) => setNewCarData({ ...newCarData, image: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="features" className="text-sm font-medium">
                Особенности (через запятую)
              </label>
              <Input
                id="features"
                placeholder="Автомат, Кондиционер, Bluetooth"
                value={newCarData.features?.join(", ") || ""}
                onChange={(e) => 
                  setNewCarData({
                    ...newCarData,
                    features: e.target.value.split(",").map(item => item.trim()).filter(Boolean)
                  })
                }
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Статус *
              </label>
              <Select
                value={newCarData.status}
                onValueChange={(value: "available" | "maintenance" | "rented") => 
                  setNewCarData({ ...newCarData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Описание
              </label>
              <Textarea
                id="description"
                placeholder="Детальное описание автомобиля..."
                value={newCarData.description || ""}
                onChange={(e) => setNewCarData({ ...newCarData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCarDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddCar}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования автомобиля */}
      <Dialog open={isEditCarDialogOpen} onOpenChange={setIsEditCarDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          {currentCar && (
            <>
              <DialogHeader>
                <DialogTitle>Редактировать автомобиль</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-title" className="text-sm font-medium">
                      Название *
                    </label>
                    <Input
                      id="edit-title"
                      value={currentCar.title}
                      onChange={(e) => setCurrentCar({ ...currentCar, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-category" className="text-sm font-medium">
                      Категория *
                    </label>
                    <Select
                      value={currentCar.category}
                      onValueChange={(value) => setCurrentCar({ ...currentCar, category: value })}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-price" className="text-sm font-medium">
                      Цена (₽) *
                    </label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={currentCar.price}
                      onChange={(e) => setCurrentCar({ ...currentCar, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-priceUnit" className="text-sm font-medium">
                      Единица *
                    </label>
                    <Select
                      value={currentCar.priceUnit}
                      onValueChange={(value) => setCurrentCar({ ...currentCar, priceUnit: value })}
                    >
                      <SelectTrigger id="edit-priceUnit">
                        <SelectValue placeholder="Выберите единицу" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="день">день</SelectItem>
                        <SelectItem value="неделя">неделя</SelectItem>
                        <SelectItem value="месяц">месяц</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-year" className="text-sm font-medium">
                      Год выпуска
                    </label>
                    <Input
                      id="edit-year"
                      type="number"
                      value={currentCar.year || ""}
                      onChange={(e) => setCurrentCar({ ...currentCar, year: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-mileage" className="text-sm font-medium">
                      Пробег (км)
                    </label>
                    <Input
                      id="edit-mileage"
                      type="number"
                      value={currentCar.mileage || ""}
                      onChange={(e) => setCurrentCar({ ...currentCar, mileage: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-image" className="text-sm font-medium">
                    URL изображения *
                  </label>
                  <Input
                    id="edit-image"
                    value={currentCar.image}
                    onChange={(e) => setCurrentCar({ ...currentCar, image: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-features" className="text-sm font-medium">
                    Особенности (через запятую)
                  </label>
                  <Input
                    id="edit-features"
                    value={currentCar.features.join(", ")}
                    onChange={(e) => 
                      setCurrentCar({
                        ...currentCar,
                        features: e.target.value.split(",").map(item => item.trim()).filter(Boolean)
                      })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-status" className="text-sm font-medium">
                    Статус *
                  </label>
                  <Select
                    value={currentCar.status}
                    onValueChange={(value: "available" | "maintenance" | "rented") => 
                      setCurrentCar({ ...currentCar, status: value })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">
                    Описание
                  </label>
                  <Textarea
                    id="edit-description"
                    value={currentCar.description || ""}
                    onChange={(e) => setCurrentCar({ ...currentCar, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditCarDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleEditCar}>Сохранить</Button>
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
              Вы уверены, что хотите удалить автомобиль{" "}
              <span className="font-semibold">{currentCar?.title}</span>?
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Это действие невозможно отменить.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteCar}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarsPage;
