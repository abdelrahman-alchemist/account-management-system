import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Printer, FileText, Receipt, BarChart3, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PrintManager = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    customerName: "",
    customerAddress: "",
    date: new Date().toISOString().split('T')[0],
    items: [
      { name: "منتج أ", quantity: 1, price: 500.00 },
      { name: "منتج ب", quantity: 2, price: 310.00 }
    ],
    salesRep: "",
    notes: ""
  });

  const printTemplates = [
    { id: "invoice", name: "فاتورة مبيعات", icon: Receipt },
    { id: "stock-report", name: "تقرير المخزون", icon: Package },
    { id: "account-statement", name: "كشف الحساب", icon: BarChart3 },
    { id: "barcode-labels", name: "تسميات الباركود", icon: FileText }
  ];

  const salesReps = ["أحمد محمد", "فاطمة أحمد", "محمد علي", "نورا حسن", "علي حسام"];

  const handleInputChange = (field: string, value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.14; // 14% VAT in Egypt
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePrint = () => {
    if (!selectedTemplate) {
      toast({
        title: "مطلوب اختيار قالب",
        description: "يرجى اختيار قالب للطباعة",
        variant: "destructive"
      });
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const content = document.querySelector('.print-content')?.innerHTML || '';
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>طباعة - ${printTemplates.find(t => t.id === selectedTemplate)?.name}</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .total { font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }

    toast({
      title: "تم إرسال الطباعة",
      description: `تم إرسال ${printTemplates.find(t => t.id === selectedTemplate)?.name} للطابعة`,
    });
  };

  const renderInvoicePreview = () => (
    <div className="print-content bg-white p-6 border rounded-lg shadow-sm text-sm">
      <div className="header text-center mb-6">
        <h1 className="text-2xl font-bold text-excel-green">فاتورة مبيعات</h1>
        <p className="text-gray-600">نظام المحاسبة الشامل</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2">إلى:</h3>
          <p className="font-medium">{invoiceData.customerName || "اسم العميل"}</p>
          <p className="text-gray-600 whitespace-pre-line">{invoiceData.customerAddress || "عنوان العميل"}</p>
        </div>
        <div className="text-right">
          <p><span className="font-semibold">رقم الفاتورة:</span> {invoiceData.invoiceNumber}</p>
          <p><span className="font-semibold">التاريخ:</span> {invoiceData.date}</p>
          {invoiceData.salesRep && (
            <p><span className="font-semibold">المندوب:</span> {invoiceData.salesRep}</p>
          )}
        </div>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="border-b-2 border-excel-green">
            <th className="text-right py-2">الصنف</th>
            <th className="text-right py-2">الكمية</th>
            <th className="text-right py-2">السعر</th>
            <th className="text-right py-2">المجموع</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{item.name}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">{item.price.toFixed(2)} ج.م</td>
              <td className="text-right py-2">{(item.quantity * item.price).toFixed(2)} ج.م</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-48">
          <div className="flex justify-between py-1">
            <span>المجموع الفرعي:</span>
            <span>{calculateSubtotal().toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between py-1">
            <span>ضريبة القيمة المضافة (14%):</span>
            <span>{calculateTax().toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between py-2 border-t font-bold text-lg total">
            <span>المجموع الكلي:</span>
            <span>{calculateTotal().toFixed(2)} ج.م</span>
          </div>
        </div>
      </div>

      {invoiceData.notes && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">ملاحظات:</h4>
          <p className="text-gray-600">{invoiceData.notes}</p>
        </div>
      )}

      <div className="mt-8 text-center text-gray-500 text-xs">
        <p>شكراً لتعاملكم معنا!</p>
        <p>تم إنشاؤها بواسطة نظام المحاسبة الشامل</p>
      </div>
    </div>
  );

  const renderStockReportPreview = () => (
    <div className="print-content bg-white p-6 border rounded-lg shadow-sm text-sm">
      <div className="header text-center mb-6">
        <h1 className="text-2xl font-bold text-excel-green">تقرير المخزون</h1>
        <p className="text-gray-600">بتاريخ {new Date().toLocaleDateString('ar-EG')}</p>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-excel-green">
            <th className="text-right py-2">اسم الصنف</th>
            <th className="text-right py-2">المخزون الحالي</th>
            <th className="text-right py-2">سعر الوحدة</th>
            <th className="text-right py-2">القيمة الإجمالية</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">منتج أ</td>
            <td className="text-right py-2">150</td>
            <td className="text-right py-2">500.00 ج.م</td>
            <td className="text-right py-2">75,000.00 ج.م</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">منتج ب</td>
            <td className="text-right py-2">20</td>
            <td className="text-right py-2">310.00 ج.م</td>
            <td className="text-right py-2">6,200.00 ج.م</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">منتج ج</td>
            <td className="text-right py-2">10</td>
            <td className="text-right py-2">600.00 ج.م</td>
            <td className="text-right py-2">6,000.00 ج.م</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderPreview = () => {
    switch (selectedTemplate) {
      case "invoice":
        return (
          <div className="print-content bg-white p-6 border rounded-lg shadow-sm text-sm">
            <div className="header text-center mb-6">
              <h1 className="text-2xl font-bold text-excel-green">فاتورة مبيعات</h1>
              <p className="text-gray-600">نظام المحاسبة الشامل</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">إلى:</h3>
                <p className="font-medium">{invoiceData.customerName || "اسم العميل"}</p>
                <p className="text-gray-600 whitespace-pre-line">{invoiceData.customerAddress || "عنوان العميل"}</p>
              </div>
              <div className="text-right">
                <p><span className="font-semibold">رقم الفاتورة:</span> {invoiceData.invoiceNumber}</p>
                <p><span className="font-semibold">التاريخ:</span> {invoiceData.date}</p>
                {invoiceData.salesRep && (
                  <p><span className="font-semibold">المندوب:</span> {invoiceData.salesRep}</p>
                )}
              </div>
            </div>

            <table className="w-full mb-6">
              <thead>
                <tr className="border-b-2 border-excel-green">
                  <th className="text-right py-2">الصنف</th>
                  <th className="text-right py-2">الكمية</th>
                  <th className="text-right py-2">السعر</th>
                  <th className="text-right py-2">المجموع</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">{item.price.toFixed(2)} ج.م</td>
                    <td className="text-right py-2">{(item.quantity * item.price).toFixed(2)} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-48">
                <div className="flex justify-between py-1">
                  <span>المجموع الفرعي:</span>
                  <span>{calculateSubtotal().toFixed(2)} ج.م</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>ضريبة القيمة المضافة (14%):</span>
                  <span>{calculateTax().toFixed(2)} ج.م</span>
                </div>
                <div className="flex justify-between py-2 border-t font-bold text-lg total">
                  <span>المجموع الكلي:</span>
                  <span>{calculateTotal().toFixed(2)} ج.م</span>
                </div>
              </div>
            </div>

            {invoiceData.notes && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">ملاحظات:</h4>
                <p className="text-gray-600">{invoiceData.notes}</p>
              </div>
            )}

            <div className="mt-8 text-center text-gray-500 text-xs">
              <p>شكراً لتعاملكم معنا!</p>
              <p>تم إنشاؤها بواسطة نظام المحاسبة الشامل</p>
            </div>
          </div>
        );
      case "stock-report":
        return (
          <div className="print-content bg-white p-6 border rounded-lg shadow-sm text-sm">
            <div className="header text-center mb-6">
              <h1 className="text-2xl font-bold text-excel-green">تقرير المخزون</h1>
              <p className="text-gray-600">بتاريخ {new Date().toLocaleDateString('ar-EG')}</p>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-excel-green">
                  <th className="text-right py-2">اسم الصنف</th>
                  <th className="text-right py-2">المخزون الحالي</th>
                  <th className="text-right py-2">سعر الوحدة</th>
                  <th className="text-right py-2">القيمة الإجمالية</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">منتج أ</td>
                  <td className="text-right py-2">150</td>
                  <td className="text-right py-2">500.00 ج.م</td>
                  <td className="text-right py-2">75,000.00 ج.م</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">منتج ب</td>
                  <td className="text-right py-2">20</td>
                  <td className="text-right py-2">310.00 ج.م</td>
                  <td className="text-right py-2">6,200.00 ج.م</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">منتج ج</td>
                  <td className="text-right py-2">10</td>
                  <td className="text-right py-2">600.00 ج.م</td>
                  <td className="text-right py-2">6,000.00 ج.م</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "account-statement":
        return (
          <div className="print-content bg-white p-6 border rounded-lg shadow-sm text-sm">
            <div className="header text-center mb-6">
              <h1 className="text-2xl font-bold text-excel-green">كشف حساب</h1>
              <p className="text-gray-600">الفترة: {new Date().toLocaleDateString('ar-EG')}</p>
            </div>
            <p className="text-center text-gray-500">سيظهر هنا معاينة كشف الحساب</p>
          </div>
        );
      case "barcode-labels":
        return (
          <div className="print-content bg-white p-6 border rounded-lg shadow-sm text-sm">
            <div className="header text-center mb-6">
              <h1 className="text-2xl font-bold text-excel-green">تسميات الباركود</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="border p-3 text-center">
                  <p className="font-mono text-xs">1234567890{i}</p>
                  <p className="text-xs mt-1">منتج {i}</p>
                  <div className="h-6 bg-black mt-2" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, black 0px, black 2px, white 2px, white 4px)'
                  }}></div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 p-6 border rounded-lg text-center">
            <p className="text-gray-500">اختر قالباً لمشاهدة المعاينة</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 p-4" dir="rtl">
      {/* Template Selection */}
      <Card className="border-violet-500">
        <CardHeader className="bg-violet-500 text-white pb-3">
          <CardTitle className="flex items-center space-x-2 space-x-reverse text-base">
            <Printer className="h-4 w-4" />
            <span>مركز الطباعة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {printTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className={`h-16 flex flex-col space-y-1 text-xs ${
                    selectedTemplate === template.id ? "bg-violet-500 text-white" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{template.name}</span>
                </Button>
              );
            })}
          </div>

          {selectedTemplate === "invoice" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="customer-name" className="text-sm">اسم العميل</Label>
                <Input
                  id="customer-name"
                  value={invoiceData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="sales-rep" className="text-sm">مندوب المبيعات</Label>
                <Select value={invoiceData.salesRep} onValueChange={(value) => handleInputChange("salesRep", value)}>
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue placeholder="اختر المندوب" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesReps.map(rep => (
                      <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="customer-address" className="text-sm">عنوان العميل</Label>
                <Textarea
                  id="customer-address"
                  value={invoiceData.customerAddress}
                  onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes" className="text-sm">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={invoiceData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>
            </div>
          )}

          <Button onClick={handlePrint} className="w-full bg-violet-500 hover:bg-violet-600 h-9 text-sm">
            <Printer className="h-3 w-3 ml-1" />
            طباعة المستند
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">معاينة الطباعة</CardTitle>
        </CardHeader>
        <CardContent>
          {renderPreview()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintManager;
