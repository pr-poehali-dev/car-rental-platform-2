
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequireAuth from "@/components/RequireAuth";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Settings,
  Building,
  CreditCard,
  Mail,
  Bell,
  ShieldCheck,
  Globe,
  Upload,
  Trash2,
  RefreshCw,
  LogOut
} from "lucide-react";

interface SystemSettings {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    inn: string;
    kpp: string;
    ogrn: string;
    logo?: string;
  };
  payment: {
    bankName: string;
    bik: string;
    account: string;
    correspondentAccount: string;
    vat: number;
    currency: string;
    allowOnlinePayments: boolean;
    paymentMethods: string[];
  };
  email: {
    smtpServer: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    senderName: string;
    senderEmail: string;
    emailSignature: string;
    sendBookingConfirmations: boolean;
    sendPaymentReceipts: boolean;
  };
  notifications: {
    adminEmailsForNewBookings: string[];
    sendBookingReminders: boolean;
    reminderHours: number;
    newBookingSound: boolean;
    desktopNotifications: boolean;
    telegramBotEnabled: boolean;
    telegramChatId: string;
  };
  security: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    sessionTimeout: number;
    failedLoginAttempts: number;
    twoFactorAuthEnabled: boolean;
    allowedIpAddresses: string[];
  };
  general: {
    language: string;
    dateFormat: string;
    timeFormat: string;
    timezone: string;
    maintenanceMode: boolean;
    debugMode: boolean;
    analyticsId: string;
    defaultPageSize: number;
  };
}

// Начальные настройки для демонстрации
const defaultSettings: SystemSettings = {
  company: {
    name: "ООО «АвтоПрокат»",
    address: "г. Москва, ул. Автомобильная, д. 10",
    phone: "+7 (495) 123-45-67",
    email: "info@autorent.ru",
    website: "https://autorent.ru",
    inn: "7712345678",
    kpp: "771201001",
    ogrn: "1157746123456",
    logo: "/logo.svg"
  },
  payment: {
    bankName: "ПАО Сбербанк",
    bik: "044525225",
    account: "40702810123450000123",
    correspondentAccount: "30101810400000000225",
    vat: 20,
    currency: "RUB",
    allowOnlinePayments: true,
    paymentMethods: ["card", "cash", "bank_transfer"]
  },
  email: {
    smtpServer: "smtp.yandex.ru",
    smtpPort: 465,
    smtpUser: "no-reply@autorent.ru",
    smtpPassword: "password",
    senderName: "АвтоПрокат",
    senderEmail: "no-reply@autorent.ru",
    emailSignature: "С уважением,\nКоманда АвтоПрокат\n+7 (495) 123-45-67",
    sendBookingConfirmations: true,
    sendPaymentReceipts: true
  },
  notifications: {
    adminEmailsForNewBookings: ["admin@autorent.ru", "manager@autorent.ru"],
    sendBookingReminders: true,
    reminderHours: 24,
    newBookingSound: true,
    desktopNotifications: true,
    telegramBotEnabled: false,
    telegramChatId: ""
  },
  security: {
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 60,
    failedLoginAttempts: 5,
    twoFactorAuthEnabled: false,
    allowedIpAddresses: []
  },
  general: {
    language: "ru",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "24h",
    timezone: "Europe/Moscow",
    maintenanceMode: false,
    debugMode: false,
    analyticsId: "",
    defaultPageSize: 20
  }
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedTab, setSelectedTab] = useState("company");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь будет запрос к API
      // Для демонстрации используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettings(defaultSettings);
      setHasChanges(false);
    } catch (error) {
      console.error("Ошибка при загрузке настроек:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки системы",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (
    category: keyof SystemSettings,
    field: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleArrayChange = (
    category: keyof SystemSettings,
    field: string,
    value: string
  ) => {
    // Для полей, которые хранят массивы (например, emails через запятую)
    const array = value.split(",").map(item => item.trim()).filter(Boolean);
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: array
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    try {
      // В реальном приложении здесь будет запрос к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Настройки сохранены",
        description: "Изменения успешно применены",
      });
      
      setHasChanges(false);
    } catch (error) {
      console.error("Ошибка при сохранении настроек:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive"
      });
    }
  };

  const resetSettings = async () => {
    try {
      await fetchSettings();
      toast({
        title: "Настройки сброшены",
        description: "Все изменения отменены",
      });
    } catch (error) {
      console.error("Ошибка при сбросе настроек:", error);
    }
  };

  const handleClearCache = async () => {
    try {
      // В реальном приложении здесь будет запрос к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Кэш очищен",
        description: "Системный кэш успешно очищен",
      });
    } catch (error) {
      console.error("Ошибка при очистке кэша:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold md:text-3xl">Настройки системы</h1>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Button 
                variant="outline" 
                onClick={resetSettings}
              >
                Отменить
              </Button>
            )}
            <Button
              onClick={saveSettings}
              disabled={!hasChanges}
              className="gap-2"
            >
              <Save className="h-4 w-4" /> Сохранить
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <Card>
            <CardContent className="py-4">
              <TabsList className="grid grid-cols-3 md:grid-cols-6">
                <TabsTrigger value="company" className="gap-2">
                  <Building className="h-4 w-4" /> Компания
                </TabsTrigger>
                <TabsTrigger value="payment" className="gap-2">
                  <CreditCard className="h-4 w-4" /> Платежи
                </TabsTrigger>
                <TabsTrigger value="email" className="gap-2">
                  <Mail className="h-4 w-4" /> Email
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" /> Уведомления
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <ShieldCheck className="h-4 w-4" /> Безопасность
                </TabsTrigger>
                <TabsTrigger value="general" className="gap-2">
                  <Settings className="h-4 w-4" /> Общие
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* Компания */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Информация о компании</CardTitle>
                <CardDescription>
                  Данные о компании используются в печатных формах и уведомлениях
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Название компании</label>
                    <Input 
                      value={settings.company.name}
                      onChange={(e) => handleSettingsChange("company", "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ИНН</label>
                    <Input 
                      value={settings.company.inn}
                      onChange={(e) => handleSettingsChange("company", "inn", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">КПП</label>
                    <Input 
                      value={settings.company.kpp}
                      onChange={(e) => handleSettingsChange("company", "kpp", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ОГРН</label>
                    <Input 
                      value={settings.company.ogrn}
                      onChange={(e) => handleSettingsChange("company", "ogrn", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Юридический адрес</label>
                  <Input 
                    value={settings.company.address}
                    onChange={(e) => handleSettingsChange("company", "address", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Телефон</label>
                    <Input 
                      value={settings.company.phone}
                      onChange={(e) => handleSettingsChange("company", "phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      value={settings.company.email}
                      onChange={(e) => handleSettingsChange("company", "email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Веб-сайт</label>
                  <Input 
                    value={settings.company.website}
                    onChange={(e) => handleSettingsChange("company", "website", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Логотип компании</label>
                  <div className="flex items-center gap-4">
                    {settings.company.logo && (
                      <div className="h-16 w-16 overflow-hidden rounded">
                        <img 
                          src={settings.company.logo} 
                          alt="Логотип" 
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Upload className="h-4 w-4" /> Загрузить
                      </Button>
                      {settings.company.logo && (
                        <Button variant="outline" size="sm" className="gap-2 text-red-500">
                          <Trash2 className="h-4 w-4" /> Удалить
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Платежи */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Банковские реквизиты</CardTitle>
                <CardDescription>
                  Информация для платежей и печатных форм
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Название банка</label>
                  <Input 
                    value={settings.payment.bankName}
                    onChange={(e) => handleSettingsChange("payment", "bankName", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">БИК</label>
                    <Input 
                      value={settings.payment.bik}
                      onChange={(e) => handleSettingsChange("payment", "bik", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Корр. счет</label>
                    <Input 
                      value={settings.payment.correspondentAccount}
                      onChange={(e) => handleSettingsChange("payment", "correspondentAccount", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Расчетный счет</label>
                  <Input 
                    value={settings.payment.account}
                    onChange={(e) => handleSettingsChange("payment", "account", e.target.value)}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ставка НДС (%)</label>
                    <Input 
                      type="number" 
                      value={settings.payment.vat}
                      onChange={(e) => handleSettingsChange("payment", "vat", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Валюта</label>
                    <Select
                      value={settings.payment.currency}
                      onValueChange={(value) => handleSettingsChange("payment", "currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите валюту" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RUB">Российский рубль (₽)</SelectItem>
                        <SelectItem value="USD">Доллар США ($)</SelectItem>
                        <SelectItem value="EUR">Евро (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Способы оплаты</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={settings.payment.paymentMethods.includes("card") ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const methods = settings.payment.paymentMethods.includes("card")
                          ? settings.payment.paymentMethods.filter(m => m !== "card")
                          : [...settings.payment.paymentMethods, "card"];
                        handleSettingsChange("payment", "paymentMethods", methods);
                      }}
                    >
                      Банковская карта
                    </Badge>
                    <Badge 
                      variant={settings.payment.paymentMethods.includes("cash") ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const methods = settings.payment.paymentMethods.includes("cash")
                          ? settings.payment.paymentMethods.filter(m => m !== "cash")
                          : [...settings.payment.paymentMethods, "cash"];
                        handleSettingsChange("payment", "paymentMethods", methods);
                      }}
                    >
                      Наличные
                    </Badge>
                    <Badge 
                      variant={settings.payment.paymentMethods.includes("bank_transfer") ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const methods = settings.payment.paymentMethods.includes("bank_transfer")
                          ? settings.payment.paymentMethods.filter(m => m !== "bank_transfer")
                          : [...settings.payment.paymentMethods, "bank_transfer"];
                        handleSettingsChange("payment", "paymentMethods", methods);
                      }}
                    >
                      Банковский перевод
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="online-payments" 
                    checked={settings.payment.allowOnlinePayments}
                    onCheckedChange={(checked) => handleSettingsChange("payment", "allowOnlinePayments", checked)}
                  />
                  <label htmlFor="online-payments" className="cursor-pointer">
                    Разрешить онлайн-платежи на сайте
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки Email</CardTitle>
                <CardDescription>
                  Настройка отправки электронных писем
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SMTP сервер</label>
                    <Input 
                      value={settings.email.smtpServer}
                      onChange={(e) => handleSettingsChange("email", "smtpServer", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SMTP порт</label>
                    <Input 
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleSettingsChange("email", "smtpPort", Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SMTP пользователь</label>
                    <Input 
                      value={settings.email.smtpUser}
                      onChange={(e) => handleSettingsChange("email", "smtpUser", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SMTP пароль</label>
                    <Input 
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleSettingsChange("email", "smtpPassword", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имя отправителя</label>
                    <Input 
                      value={settings.email.senderName}
                      onChange={(e) => handleSettingsChange("email", "senderName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email отправителя</label>
                    <Input 
                      value={settings.email.senderEmail}
                      onChange={(e) => handleSettingsChange("email", "senderEmail", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Подпись в письмах</label>
                  <Textarea 
                    value={settings.email.emailSignature}
                    onChange={(e) => handleSettingsChange("email", "emailSignature", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="booking-confirmations" 
                      checked={settings.email.sendBookingConfirmations}
                      onCheckedChange={(checked) => handleSettingsChange("email", "sendBookingConfirmations", checked)}
                    />
                    <label htmlFor="booking-confirmations" className="cursor-pointer">
                      Отправлять подтверждения бронирований
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="payment-receipts" 
                      checked={settings.email.sendPaymentReceipts}
                      onCheckedChange={(checked) => handleSettingsChange("email", "sendPaymentReceipts", checked)}
                    />
                    <label htmlFor="payment-receipts" className="cursor-pointer">
                      Отправлять квитанции об оплате
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" /> Отправить тестовое письмо
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Уведомления */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
                <CardDescription>
                  Управление системными уведомлениями
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email администраторов для получения уведомлений о новых бронированиях</label>
                  <Input 
                    value={settings.notifications.adminEmailsForNewBookings.join(", ")}
                    onChange={(e) => handleArrayChange("notifications", "adminEmailsForNewBookings", e.target.value)}
                    placeholder="email1@example.com, email2@example.com"
                  />
                  <p className="text-xs text-gray-500">Разделяйте email-адреса запятыми</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="booking-reminders" 
                        checked={settings.notifications.sendBookingReminders}
                        onCheckedChange={(checked) => handleSettingsChange("notifications", "sendBookingReminders", checked)}
                      />
                      <label htmlFor="booking-reminders" className="cursor-pointer">
                        Отправлять напоминания о бронированиях
                      </label>
                    </div>

                    {settings.notifications.sendBookingReminders && (
                      <div className="mt-2">
                        <label className="text-sm font-medium">За сколько часов до начала</label>
                        <Input 
                          type="number"
                          value={settings.notifications.reminderHours}
                          onChange={(e) => handleSettingsChange("notifications", "reminderHours", Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="booking-sound" 
                        checked={settings.notifications.newBookingSound}
                        onCheckedChange={(checked) => handleSettingsChange("notifications", "newBookingSound", checked)}
                      />
                      <label htmlFor="booking-sound" className="cursor-pointer">
                        Звуковое уведомление о новых бронированиях
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="desktop-notifications" 
                        checked={settings.notifications.desktopNotifications}
                        onCheckedChange={(checked) => handleSettingsChange("notifications", "desktopNotifications", checked)}
                      />
                      <label htmlFor="desktop-notifications" className="cursor-pointer">
                        Уведомления на рабочем столе
                      </label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="telegram-bot" 
                      checked={settings.notifications.telegramBotEnabled}
                      onCheckedChange={(checked) => handleSettingsChange("notifications", "telegramBotEnabled", checked)}
                    />
                    <label htmlFor="telegram-bot" className="cursor-pointer">
                      Включить уведомления через Telegram
                    </label>
                  </div>
                  
                  {settings.notifications.telegramBotEnabled && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ID чата Telegram</label>
                      <Input 
                        value={settings.notifications.telegramChatId}
                        onChange={(e) => handleSettingsChange("notifications", "telegramChatId", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Добавьте бота @YourCompanyBot в чат и введите ID чата
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Безопасность */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки безопасности</CardTitle>
                <CardDescription>
                  Управление параметрами безопасности системы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Минимальная длина пароля</label>
                    <Input 
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => handleSettingsChange("security", "passwordMinLength", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Время сессии (минуты)</label>
                    <Input 
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingsChange("security", "sessionTimeout", Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="special-chars" 
                      checked={settings.security.requireSpecialChars}
                      onCheckedChange={(checked) => handleSettingsChange("security", "requireSpecialChars", checked)}
                    />
                    <label htmlFor="special-chars" className="cursor-pointer">
                      Обязательные спецсимволы в пароле
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Максимум неудачных попыток входа</label>
                    <Input 
                      type="number"
                      value={settings.security.failedLoginAttempts}
                      onChange={(e) => handleSettingsChange("security", "failedLoginAttempts", Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="two-factor-auth" 
                      checked={settings.security.twoFactorAuthEnabled}
                      onCheckedChange={(checked) => handleSettingsChange("security", "twoFactorAuthEnabled", checked)}
                    />
                    <label htmlFor="two-factor-auth" className="cursor-pointer">
                      Двухфакторная аутентификация
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Разрешенные IP-адреса (оставьте пустым для всех)</label>
                  <Input 
                    value={settings.security.allowedIpAddresses.join(", ")}
                    onChange={(e) => handleArrayChange("security", "allowedIpAddresses", e.target.value)}
                    placeholder="192.168.1.1, 10.0.0.0/24"
                  />
                  <p className="text-xs text-gray-500">Разделяйте адреса запятыми, можно использовать CIDR-нотацию</p>
                </div>

                <Separator />

                <div className="pt-2">
                  <Button variant="outline" className="gap-2">
                    <LogOut className="h-4 w-4" /> Завершить все активные сессии
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Общие */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
                <CardDescription>
                  Основные параметры системы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Язык системы</label>
                    <Select
                      value={settings.general.language}
                      onValueChange={(value) => handleSettingsChange("general", "language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите язык" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Часовой пояс</label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) => handleSettingsChange("general", "timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите часовой пояс" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                        <SelectItem value="Europe/Kaliningrad">Калининград (UTC+2)</SelectItem>
                        <SelectItem value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</SelectItem>
                        <SelectItem value="Asia/Novosibirsk">Новосибирск (UTC+7)</SelectItem>
                        <SelectItem value="Asia/Vladivostok">Владивосток (UTC+10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Формат даты</label>
                    <Select
                      value={settings.general.dateFormat}
                      onValueChange={(value) => handleSettingsChange("general", "dateFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите формат даты" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD.MM.YYYY">DD.MM.YYYY (31.12.2025)</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Формат времени</label>
                    <Select
                      value={settings.general.timeFormat}
                      onValueChange={(value) => handleSettingsChange("general", "timeFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите формат времени" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 часа (14:30)</SelectItem>
                        <SelectItem value="12h">12 часов (2:30 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ID для Google Analytics</label>
                  <Input 
                    value={settings.general.analyticsId}
                    onChange={(e) => handleSettingsChange("general", "analyticsId", e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Элементов на странице по умолчанию</label>
                  <Select
                    value={String(settings.general.defaultPageSize)}
                    onValueChange={(value) => handleSettingsChange("general", "defaultPageSize", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите размер страницы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="maintenance-mode" 
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingsChange("general", "maintenanceMode", checked)}
                    />
                    <label htmlFor="maintenance-mode" className="cursor-pointer">
                      Режим обслуживания (сайт будет недоступен для обычных пользователей)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="debug-mode" 
                      checked={settings.general.debugMode}
                      onCheckedChange={(checked) => handleSettingsChange("general", "debugMode", checked)}
                    />
                    <label htmlFor="debug-mode" className="cursor-pointer">
                      Режим отладки (расширенное логирование)
                    </label>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" className="gap-2" onClick={handleClearCache}>
                    <RefreshCw className="h-4 w-4" /> Очистить кэш
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Globe className="h-4 w-4" /> Проверить обновления
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  );
};

export default SettingsPage;
