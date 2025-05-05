
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Download, FileText, FileCog, Receipt } from "lucide-react";

interface BookingData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId: string;
  carName: string;
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  createdAt: string;
}

interface PrintFormsProps {
  booking: BookingData;
  isOpen: boolean;
  onClose: () => void;
}

const PrintForms: React.FC<PrintFormsProps> = ({ booking, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"contract" | "act" | "invoice">("contract");
  const [printSize, setPrintSize] = useState<"a4" | "a5">("a4");

  // Форматирование дат для документов
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy г.", { locale: ru });
  };

  // Форматирование даты создания договора
  const contractDate = format(new Date(booking.createdAt), "d MMMM yyyy г.", { locale: ru });
  
  // Номер договора (используем ID бронирования)
  const contractNumber = booking.id;
  
  // Вычисление количества дней аренды
  const rentalDays = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Стоимость за день (для примера делим общую сумму на количество дней)
  const dailyRate = Math.round(booking.totalPrice / rentalDays);

  // Данные компании
  const companyData = {
    name: "ООО «АвтоПрокат»",
    address: "г. Москва, ул. Автомобильная, д. 10",
    phone: "+7 (495) 123-45-67",
    email: "info@autoprokate.ru",
    inn: "7712345678",
    kpp: "771201001",
    ogrn: "1157746123456",
    bank: "ПАО Сбербанк",
    bik: "044525225",
    account: "40702810123450000123",
    ceo: "Иванов И.И.",
  };

  // Функция для печати документа
  const printDocument = () => {
    const printContent = document.getElementById("print-content");
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  // Функция для скачивания документа в PDF
  // В реальном приложении здесь можно использовать библиотеку для генерации PDF
  const downloadPdf = () => {
    alert("Функция скачивания PDF будет доступна в следующем обновлении");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Печатные формы документов</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList>
              <TabsTrigger value="contract" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Договор
              </TabsTrigger>
              <TabsTrigger value="act" className="flex items-center gap-2">
                <FileCog className="h-4 w-4" /> Акт приема-передачи
              </TabsTrigger>
              <TabsTrigger value="invoice" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" /> Счет
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Select value={printSize} onValueChange={(value) => setPrintSize(value as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Формат" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">Формат A4</SelectItem>
                <SelectItem value="a5">Формат A5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div id="print-content" className={`bg-white rounded-md border p-8 ${printSize === "a4" ? "min-h-[29.7cm] w-full" : "min-h-[21cm] w-[14.8cm] mx-auto"}`}>
          {/* Договор аренды автомобиля */}
          {activeTab === "contract" && (
            <div className="document-content">
              <div className="text-center mb-6">
                <h2 className="font-bold text-lg">ДОГОВОР АРЕНДЫ АВТОМОБИЛЯ</h2>
                <p>№ {contractNumber} от {contractDate}</p>
              </div>
              
              <p className="mb-4">
                {companyData.name}, именуемое в дальнейшем «Арендодатель», в лице генерального директора {companyData.ceo}, 
                действующего на основании Устава, с одной стороны, и {booking.customerName}, именуемый(-ая) в дальнейшем «Арендатор», 
                с другой стороны, заключили настоящий Договор о нижеследующем:
              </p>
              
              <h3 className="font-bold mb-2">1. ПРЕДМЕТ ДОГОВОРА</h3>
              <p className="mb-4">
                1.1. Арендодатель предоставляет Арендатору во временное пользование автомобиль {booking.carName} (далее - Автомобиль)
                на срок с {formatDate(booking.startDate)} по {formatDate(booking.endDate)} включительно.
              </p>
              
              <h3 className="font-bold mb-2">2. ПРАВА И ОБЯЗАННОСТИ СТОРОН</h3>
              <p className="mb-1">2.1. Арендодатель обязуется:</p>
              <p className="mb-1">2.1.1. Предоставить Арендатору Автомобиль в технически исправном состоянии.</p>
              <p className="mb-1">2.1.2. Предоставить Арендатору необходимые документы на Автомобиль.</p>
              <p className="mb-4">2.1.3. Оказывать консультативную помощь в вопросах эксплуатации Автомобиля.</p>
              
              <p className="mb-1">2.2. Арендатор обязуется:</p>
              <p className="mb-1">2.2.1. Использовать Автомобиль согласно его целевому назначению.</p>
              <p className="mb-1">2.2.2. Своевременно вносить арендную плату.</p>
              <p className="mb-1">2.2.3. Бережно относиться к Автомобилю.</p>
              <p className="mb-4">2.2.4. Вернуть Автомобиль в том состоянии, в котором он был получен.</p>
              
              <h3 className="font-bold mb-2">3. СТОИМОСТЬ И ПОРЯДОК РАСЧЕТОВ</h3>
              <p className="mb-1">
                3.1. Стоимость аренды Автомобиля составляет {dailyRate.toLocaleString("ru-RU")} рублей за сутки.
              </p>
              <p className="mb-1">
                3.2. Общая сумма договора составляет {booking.totalPrice.toLocaleString("ru-RU")} рублей за {rentalDays} суток аренды.
              </p>
              <p className="mb-4">
                3.3. Оплата производится в порядке 100% предоплаты.
              </p>
              
              <h3 className="font-bold mb-2">4. ОТВЕТСТВЕННОСТЬ СТОРОН</h3>
              <p className="mb-4">
                4.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему Договору стороны несут ответственность в соответствии с действующим законодательством РФ.
              </p>
              
              <h3 className="font-bold mb-2">5. АДРЕСА И РЕКВИЗИТЫ СТОРОН</h3>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="font-bold">Арендодатель:</p>
                  <p>{companyData.name}</p>
                  <p>Адрес: {companyData.address}</p>
                  <p>ИНН: {companyData.inn}</p>
                  <p>КПП: {companyData.kpp}</p>
                  <p>ОГРН: {companyData.ogrn}</p>
                  <p>Банк: {companyData.bank}</p>
                  <p>БИК: {companyData.bik}</p>
                  <p>Р/с: {companyData.account}</p>
                  <p>Тел: {companyData.phone}</p>
                </div>
                <div>
                  <p className="font-bold">Арендатор:</p>
                  <p>{booking.customerName}</p>
                  <p>Тел: {booking.customerPhone}</p>
                  <p>Email: {booking.customerEmail}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div>
                  <p className="font-bold mb-10">Арендодатель</p>
                  <p>_________________ / {companyData.ceo}</p>
                  <p className="mt-4">М.П.</p>
                </div>
                <div>
                  <p className="font-bold mb-10">Арендатор</p>
                  <p>_________________ / {booking.customerName.split(' ')[0]} {booking.customerName.split(' ')[1]?.[0]}.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Акт приема-передачи */}
          {activeTab === "act" && (
            <div className="document-content">
              <div className="text-center mb-6">
                <h2 className="font-bold text-lg">АКТ ПРИЕМА-ПЕРЕДАЧИ АВТОМОБИЛЯ</h2>
                <p>к Договору аренды № {contractNumber} от {contractDate}</p>
              </div>
              
              <p className="mb-6">г. Москва</p>
              
              <p className="mb-4">
                {companyData.name}, именуемое в дальнейшем «Арендодатель», в лице генерального директора {companyData.ceo}, 
                действующего на основании Устава, с одной стороны, и {booking.customerName}, именуемый(-ая) в дальнейшем «Арендатор», 
                с другой стороны, составили настоящий Акт о нижеследующем:
              </p>
              
              <p className="mb-4">
                1. В соответствии с Договором аренды № {contractNumber} от {contractDate} Арендодатель передал, а Арендатор принял во временное пользование автомобиль:
              </p>
              
              <div className="mb-6 border p-4 rounded">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-bold w-1/3">Марка, модель:</td>
                      <td>{booking.carName}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Идентификационный номер (VIN):</td>
                      <td>WAUZZZ8T...</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Год выпуска:</td>
                      <td>2023</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Цвет:</td>
                      <td>Серебристый</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Гос. номер:</td>
                      <td>А123БВ777</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="mb-4">
                2. Техническое состояние передаваемого автомобиля: исправен, укомплектован, повреждений и дефектов не имеет.
              </p>
              
              <p className="mb-4">
                3. Автомобиль передается с полным баком топлива.
              </p>
              
              <p className="mb-4">
                4. Показания одометра на момент передачи: 12 345 км.
              </p>
              
              <p className="mb-4">
                5. Вместе с автомобилем передаются:
                <br />- Свидетельство о регистрации ТС;
                <br />- Страховой полис ОСАГО;
                <br />- Комплект ключей (2 шт.);
                <br />- Аптечка, огнетушитель, знак аварийной остановки.
              </p>
              
              <p className="mb-4">
                6. Арендатор подтверждает, что принял автомобиль в исправном состоянии, претензий к техническому состоянию и комплектации не имеет.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div>
                  <p className="font-bold mb-6">Арендодатель</p>
                  <p>_________________ / {companyData.ceo}</p>
                  <p className="mt-4">М.П.</p>
                </div>
                <div>
                  <p className="font-bold mb-6">Арендатор</p>
                  <p>_________________ / {booking.customerName.split(' ')[0]} {booking.customerName.split(' ')[1]?.[0]}.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Счет */}
          {activeTab === "invoice" && (
            <div className="document-content">
              <div className="text-center mb-6">
                <h2 className="font-bold text-lg">СЧЕТ № {booking.id}</h2>
                <p>от {contractDate}</p>
              </div>
              
              <div className="mb-6">
                <p className="font-bold">Поставщик:</p>
                <p>{companyData.name}</p>
                <p>Адрес: {companyData.address}</p>
                <p>ИНН: {companyData.inn} КПП: {companyData.kpp}</p>
                <p>
                  Банковские реквизиты: {companyData.bank}, БИК {companyData.bik},
                  р/с {companyData.account}
                </p>
              </div>
              
              <div className="mb-6">
                <p className="font-bold">Покупатель:</p>
                <p>{booking.customerName}</p>
                <p>Тел: {booking.customerPhone}</p>
                <p>Email: {booking.customerEmail}</p>
              </div>
              
              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">№</th>
                    <th className="border p-2 text-left">Наименование товара (услуги)</th>
                    <th className="border p-2 text-center">Кол-во</th>
                    <th className="border p-2 text-right">Цена</th>
                    <th className="border p-2 text-right">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">1</td>
                    <td className="border p-2">
                      Аренда автомобиля {booking.carName} по договору № {booking.id} от {contractDate}
                    </td>
                    <td className="border p-2 text-center">{rentalDays} сут.</td>
                    <td className="border p-2 text-right">{dailyRate.toLocaleString("ru-RU")}</td>
                    <td className="border p-2 text-right">{booking.totalPrice.toLocaleString("ru-RU")}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="border p-2 text-right font-bold">Итого:</td>
                    <td className="border p-2 text-right font-bold">{booking.totalPrice.toLocaleString("ru-RU")}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="border p-2 text-right font-bold">В том числе НДС (20%):</td>
                    <td className="border p-2 text-right font-bold">{Math.round(booking.totalPrice / 6).toLocaleString("ru-RU")}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="border p-2 text-right font-bold">Всего к оплате:</td>
                    <td className="border p-2 text-right font-bold">{booking.totalPrice.toLocaleString("ru-RU")}</td>
                  </tr>
                </tfoot>
              </table>
              
              <p className="mb-6">
                Всего наименований: 1, на сумму {booking.totalPrice.toLocaleString("ru-RU")} руб.
              </p>
              
              <p className="font-bold mb-6">
                {convertNumberToWords(booking.totalPrice)} рублей 00 копеек
              </p>
              
              <div className="mb-6">
                <p>Оплатить не позднее: {format(new Date(booking.startDate), "d MMMM yyyy г.", { locale: ru })}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div>
                  <p>Руководитель _______________ / {companyData.ceo}</p>
                </div>
                <div>
                  <p>Бухгалтер _______________ / Петрова А.В.</p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="font-bold">М.П.</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
          <Button onClick={downloadPdf} className="gap-2">
            <Download className="h-4 w-4" /> Скачать PDF
          </Button>
          <Button onClick={printDocument} className="gap-2">
            <Printer className="h-4 w-4" /> Печать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Вспомогательная функция для преобразования чисел в строковое представление
function convertNumberToWords(number: number): string {
  const units = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
  
  const ranks = [
    ['', '', ''],
    ['тысяча', 'тысячи', 'тысяч'],
    ['миллион', 'миллиона', 'миллионов'],
    ['миллиард', 'миллиарда', 'миллиардов']
  ];
  
  if (number === 0) return 'ноль';
  
  let str = '';
  let ranki = 0;
  
  while (number > 0) {
    let part = number % 1000;
    number = Math.floor(number / 1000);
    
    if (part === 0) {
      ranki++;
      continue;
    }
    
    let partStr = '';
    
    // Сотни
    if (Math.floor(part / 100) > 0) {
      partStr += hundreds[Math.floor(part / 100)] + ' ';
      part %= 100;
    }
    
    // Десятки и единицы
    if (part >= 10 && part < 20) {
      partStr += teens[part - 10] + ' ';
    } else {
      if (Math.floor(part / 10) > 0) {
        partStr += tens[Math.floor(part / 10)] + ' ';
        part %= 10;
      }
      
      if (part > 0) {
        partStr += units[part] + ' ';
      }
    }
    
    // Добавление разряда
    if (ranki > 0) {
      partStr += ranks[ranki][part === 1 ? 0 : (part >= 2 && part <= 4) ? 1 : 2] + ' ';
    }
    
    str = partStr + str;
    ranki++;
  }
  
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1);
}

export default PrintForms;
