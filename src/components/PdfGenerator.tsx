
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FilePdf, Download, Eye, Settings, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Типы документов для генерации
export enum DocumentType {
  CONTRACT = 'contract',
  INVOICE = 'invoice',
  ACT = 'act',
  REPORT = 'report',
  CUSTOM = 'custom'
}

// Интерфейс для контрактных данных
export interface ContractData {
  contractNumber: string;
  contractDate: string;
  customerName: string;
  customerDetails: {
    email: string;
    phone: string;
    address?: string;
  };
  companyDetails: {
    name: string;
    address: string;
    inn: string;
    kpp: string;
    bank: string;
    bankAccount: string;
    representative: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    unit: string;
    total: number;
  }[];
  totalAmount: number;
  startDate: string;
  endDate: string;
  additionalInfo?: string;
}

interface PdfGeneratorProps {
  initialDocumentType?: DocumentType;
  initialData?: Partial<ContractData>;
  onGenerate?: (documentType: DocumentType, documentData: ContractData, options: any) => void;
}

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ 
  initialDocumentType = DocumentType.CONTRACT,
  initialData = {},
  onGenerate
}) => {
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState<DocumentType>(initialDocumentType);
  const [documentData, setDocumentData] = useState<Partial<ContractData>>({
    contractNumber: initialData.contractNumber || `D${Math.floor(1000 + Math.random() * 9000)}`,
    contractDate: initialData.contractDate || new Date().toISOString().split('T')[0],
    customerName: initialData.customerName || '',
    customerDetails: initialData.customerDetails || {
      email: '',
      phone: '',
      address: ''
    },
    companyDetails: initialData.companyDetails || {
      name: 'ООО «АвтоПрокат»',
      address: 'г. Москва, ул. Автомобильная, д. 10',
      inn: '7712345678',
      kpp: '771201001',
      bank: 'ПАО Сбербанк',
      bankAccount: '40702810123450000123',
      representative: 'Иванов И.И.'
    },
    items: initialData.items || [{
      name: 'Аренда автомобиля',
      quantity: 1,
      price: 3500,
      unit: 'день',
      total: 3500
    }],
    totalAmount: initialData.totalAmount || 3500,
    startDate: initialData.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData.endDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    additionalInfo: initialData.additionalInfo || ''
  });

  const [options, setOptions] = useState({
    format: 'A4',
    orientation: 'portrait',
    includeSignatures: true,
    includeLogo: true,
    includeHeader: true,
    includeFooter: true,
    colorScheme: 'default'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Обновление данных документа
  const updateDocumentData = (field: string, value: any) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Обновление вложенных данных
  const updateNestedData = (category: string, field: string, value: any) => {
    setDocumentData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof ContractData],
        [field]: value
      }
    }));
  };

  // Обновление элементов списка
  const updateItemData = (index: number, field: string, value: any) => {
    const newItems = [...(documentData.items || [])];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    // Пересчитываем total для этого элемента
    if (field === 'quantity' || field === 'price') {
      const qty = field === 'quantity' ? value : newItems[index].quantity;
      const price = field === 'price' ? value : newItems[index].price;
      newItems[index].total = qty * price;
    }
    
    // Пересчитываем общую сумму
    const newTotal = newItems.reduce((sum, item) => sum + item.total, 0);
    
    setDocumentData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: newTotal
    }));
  };

  // Добавление нового элемента
  const addNewItem = () => {
    const newItems = [...(documentData.items || []), {
      name: '',
      quantity: 1,
      price: 0,
      unit: 'день',
      total: 0
    }];
    
    setDocumentData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  // Удаление элемента
  const removeItem = (index: number) => {
    const newItems = [...(documentData.items || [])];
    newItems.splice(index, 1);
    
    // Пересчитываем общую сумму
    const newTotal = newItems.reduce((sum, item) => sum + item.total, 0);
    
    setDocumentData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: newTotal
    }));
  };

  // Генерация PDF
  const generatePdf = async () => {
    setIsGenerating(true);
    try {
      // В реальном приложении здесь был бы запрос к API для генерации PDF
      // Имитируем задержку
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Создаем URL с данными документа и опциями для предпросмотра
      // В реальном приложении здесь был бы ответ от сервера с URL для скачивания
      setPreviewUrl(`data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggMjQ3Pj4Kc3RyZWFtCnicLZBNDsIgEIX3nGLWdCGQQiksTdTEe1h2J2qANKV14eluiCaT+TN57yMD9vUVwgXMoAI63tH0hFpZZiS9Y0ADbwTNQ7O0X7TnDroN4jBEb9GEpHNQhiN6xIocvSF3zTnA7I30ZVDDxxCdqHuVl8fkGRRnBG1mVw0/Gl2q0VRAYh8F1QQPKYIBVsHFEH/GYhB5MFxznbON4J1N7QKvvfZHRkDi1qORPNM9jYGvk+ni+v6a6rHsn89xMXKbXI2DI3bD47i4H1/kAqf1Vd0KZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUiBdCi9Db3VudCAxCi9NZWRpYUJveCBbMCAwIDMwMCAzMDBdCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Qcm9kdWNlciAod2todG1sdG9wZGYpCi9DcmVhdGlvbkRhdGUgKEQ6MjAyMzA1MDUxMjM0MjMrMDInMDAnKQo+PgplbmRvYmoKNyAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKL09wZW5BY3Rpb24gWzMgMCBSIC9GaXRIIG51bGxdCi9QYWdlTGF5b3V0IC9PbmVDb2x1bW4KPj4KZW5kb2JqCnhyZWYKMCA4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDM0NiAwMDAwMCBuIAowMDAwMDAwNDMzIDAwMDAwIG4gCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA4NyAwMDAwMCBuIAowMDAwMDAwNTIxIDAwMDAwIG4gCjAwMDAwMDA2MTMgMDAwMDAgbiAKMDAwMDAwMDcwMCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDgKL1Jvb3QgNyAwIFIKL0luZm8gNiAwIFIKPj4Kc3RhcnR4cmVmCjgwMwolJUVPRgo=`);
      
      // Вызываем callback, если он предоставлен
      if (onGenerate) {
        onGenerate(
          documentType, 
          documentData as ContractData, 
          options
        );
      }
      
      toast({
        title: "Документ сгенерирован",
        description: "PDF-файл успешно создан и готов к скачиванию",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Ошибка генерации",
        description: "Не удалось создать PDF-документ. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Скачивание PDF
  const downloadPdf = () => {
    if (!previewUrl) {
      generatePdf().then(() => {
        // После генерации инициируем скачивание
        if (previewUrl) {
          const link = document.createElement('a');
          link.href = previewUrl;
          link.download = `${getDocumentTitle()}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast({
            title: "Скачивание начато",
            description: "PDF-файл будет сохранен на ваше устройство",
          });
        }
      });
    } else {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = `${getDocumentTitle()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Скачивание начато",
        description: "PDF-файл будет сохранен на ваше устройство",
      });
    }
  };

  // Получение названия документа
  const getDocumentTitle = () => {
    const docTypes = {
      [DocumentType.CONTRACT]: 'Договор',
      [DocumentType.INVOICE]: 'Счет',
      [DocumentType.ACT]: 'Акт',
      [DocumentType.REPORT]: 'Отчет',
      [DocumentType.CUSTOM]: 'Документ'
    };
    
    return `${docTypes[documentType]}_${documentData.contractNumber || ''}_${new Date().toISOString().split('T')[0]}`;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Форма редактирования */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Генерация PDF-документа</CardTitle>
            <CardDescription>
              Создайте и скачайте документ в формате PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Тип документа</Label>
                <Select
                  value={documentType}
                  onValueChange={(value: DocumentType) => setDocumentType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип документа" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DocumentType.CONTRACT}>Договор</SelectItem>
                    <SelectItem value={DocumentType.INVOICE}>Счет</SelectItem>
                    <SelectItem value={DocumentType.ACT}>Акт приема-передачи</SelectItem>
                    <SelectItem value={DocumentType.REPORT}>Отчет</SelectItem>
                    <SelectItem value={DocumentType.CUSTOM}>Другой документ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">Основное</TabsTrigger>
                  <TabsTrigger value="customer">Клиент</TabsTrigger>
                  <TabsTrigger value="items">Услуги</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contractNumber">Номер документа</Label>
                        <Input 
                          id="contractNumber" 
                          value={documentData.contractNumber || ''}
                          onChange={(e) => updateDocumentData('contractNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contractDate">Дата документа</Label>
                        <Input 
                          id="contractDate" 
                          type="date"
                          value={documentData.contractDate || ''}
                          onChange={(e) => updateDocumentData('contractDate', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Дата начала</Label>
                        <Input 
                          id="startDate" 
                          type="date"
                          value={documentData.startDate || ''}
                          onChange={(e) => updateDocumentData('startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">Дата окончания</Label>
                        <Input 
                          id="endDate" 
                          type="date"
                          value={documentData.endDate || ''}
                          onChange={(e) => updateDocumentData('endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Дополнительная информация</Label>
                      <Input 
                        id="additionalInfo" 
                        value={documentData.additionalInfo || ''}
                        onChange={(e) => updateDocumentData('additionalInfo', e.target.value)}
                        placeholder="Примечания, дополнительные условия и т.д."
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="customer" className="space-y-4">
                  <div className="grid gap-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">ФИО клиента</Label>
                      <Input 
                        id="customerName" 
                        value={documentData.customerName || ''}
                        onChange={(e) => updateDocumentData('customerName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input 
                        id="customerEmail" 
                        type="email"
                        value={documentData.customerDetails?.email || ''}
                        onChange={(e) => updateNestedData('customerDetails', 'email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Телефон</Label>
                      <Input 
                        id="customerPhone" 
                        value={documentData.customerDetails?.phone || ''}
                        onChange={(e) => updateNestedData('customerDetails', 'phone', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerAddress">Адрес</Label>
                      <Input 
                        id="customerAddress" 
                        value={documentData.customerDetails?.address || ''}
                        onChange={(e) => updateNestedData('customerDetails', 'address', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="items" className="space-y-4">
                  <div className="space-y-4 py-2">
                    {documentData.items?.map((item, index) => (
                      <div key={index} className="grid gap-3 rounded-md border p-3">
                        <div className="grid grid-cols-6 gap-2">
                          <div className="col-span-3 space-y-1">
                            <Label htmlFor={`item-name-${index}`} className="text-xs">Наименование</Label>
                            <Input 
                              id={`item-name-${index}`} 
                              value={item.name}
                              onChange={(e) => updateItemData(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`item-quantity-${index}`} className="text-xs">Кол-во</Label>
                            <Input 
                              id={`item-quantity-${index}`} 
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemData(index, 'quantity', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`item-price-${index}`} className="text-xs">Цена</Label>
                            <Input 
                              id={`item-price-${index}`} 
                              type="number"
                              value={item.price}
                              onChange={(e) => updateItemData(index, 'price', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`item-unit-${index}`} className="text-xs">Ед.</Label>
                            <Select
                              value={item.unit}
                              onValueChange={(value) => updateItemData(index, 'unit', value)}
                            >
                              <SelectTrigger id={`item-unit-${index}`}>
                                <SelectValue placeholder="Ед." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="день">день</SelectItem>
                                <SelectItem value="шт">шт</SelectItem>
                                <SelectItem value="час">час</SelectItem>
                                <SelectItem value="км">км</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            Итого: {item.total.toLocaleString('ru-RU')} ₽
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={addNewItem}
                    >
                      Добавить пункт
                    </Button>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-lg font-medium">Общая сумма:</span>
                      <span className="text-lg font-bold">
                        {documentData.totalAmount?.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <Separator />
              
              <div>
                <h3 className="mb-3 font-medium">Параметры PDF</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="format" className="text-sm">Формат</Label>
                    <Select
                      value={options.format}
                      onValueChange={(value) => setOptions({ ...options, format: value })}
                    >
                      <SelectTrigger id="format" className="w-[120px]">
                        <SelectValue placeholder="Формат" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A5">A5</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="orientation" className="text-sm">Ориентация</Label>
                    <Select
                      value={options.orientation}
                      onValueChange={(value) => setOptions({ ...options, orientation: value })}
                    >
                      <SelectTrigger id="orientation" className="w-[120px]">
                        <SelectValue placeholder="Ориентация" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Портретная</SelectItem>
                        <SelectItem value="landscape">Альбомная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signatures" className="text-sm">Подписи</Label>
                    <Switch 
                      id="signatures"
                      checked={options.includeSignatures}
                      onCheckedChange={(checked) => setOptions({ ...options, includeSignatures: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="logo" className="text-sm">Логотип</Label>
                    <Switch 
                      id="logo"
                      checked={options.includeLogo}
                      onCheckedChange={(checked) => setOptions({ ...options, includeLogo: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="header" className="text-sm">Заголовок</Label>
                    <Switch 
                      id="header"
                      checked={options.includeHeader}
                      onCheckedChange={(checked) => setOptions({ ...options, includeHeader: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="footer" className="text-sm">Нижний колонтитул</Label>
                    <Switch 
                      id="footer"
                      checked={options.includeFooter}
                      onCheckedChange={(checked) => setOptions({ ...options, includeFooter: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                // Сбрасываем к начальным значениям
                setDocumentData({
                  contractNumber: `D${Math.floor(1000 + Math.random() * 9000)}`,
                  contractDate: new Date().toISOString().split('T')[0],
                  customerName: '',
                  customerDetails: {
                    email: '',
                    phone: '',
                    address: ''
                  },
                  companyDetails: {
                    name: 'ООО «АвтоПрокат»',
                    address: 'г. Москва, ул. Автомобильная, д. 10',
                    inn: '7712345678',
                    kpp: '771201001',
                    bank: 'ПАО Сбербанк',
                    bankAccount: '40702810123450000123',
                    representative: 'Иванов И.И.'
                  },
                  items: [{
                    name: 'Аренда автомобиля',
                    quantity: 1,
                    price: 3500,
                    unit: 'день',
                    total: 3500
                  }],
                  totalAmount: 3500,
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  additionalInfo: ''
                });
                setPreviewUrl(null);
              }}
            >
              <Settings className="h-4 w-4" />
              Сбросить
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={generatePdf}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Генерация...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Предпросмотр
                  </>
                )}
              </Button>
              <Button
                className="gap-2"
                onClick={downloadPdf}
                disabled={isGenerating && !previewUrl}
              >
                {isGenerating && !previewUrl ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    Генерация...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Скачать PDF
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Предпросмотр */}
      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Предпросмотр документа</CardTitle>
            <CardDescription>
              {previewUrl ? (
                <div className="flex items-center text-green-600">
                  <Check className="mr-1 h-4 w-4" />
                  Документ готов к скачиванию
                </div>
              ) : (
                "Нажмите 'Предпросмотр' для генерации PDF"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[600px] w-full overflow-hidden rounded-md border bg-white">
              {previewUrl ? (
                <iframe 
                  ref={iframeRef}
                  src={previewUrl} 
                  className="h-full w-full"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <FilePdf className="mb-4 h-16 w-16 text-gray-300" />
                  <h3 className="mb-2 text-lg font-medium">Здесь будет предпросмотр документа</h3>
                  <p className="mb-4 text-sm text-gray-500">
                    Заполните форму слева и нажмите "Предпросмотр" для генерации PDF-документа
                  </p>
                  <Button 
                    variant="outline"
                    className="gap-2"
                    onClick={generatePdf}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Генерация...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Сгенерировать PDF
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          {previewUrl && (
            <CardFooter>
              <Button 
                className="w-full gap-2"
                onClick={downloadPdf}
              >
                <Download className="h-4 w-4" />
                Скачать PDF
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PdfGenerator;
