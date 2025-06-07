
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sale {
  id: string;
  date: string;
  itemName: string;
  quantitySold: number;
  unitPrice: number;
  customer: string;
  totalAmount: number;
}

const PieceSales = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    itemName: "",
    quantitySold: 0,
    unitPrice: 0,
    customer: ""
  });

  // Mock inventory data - in real app this would come from incoming records
  const inventory = {
    "منتج أ": { stock: 100, price: 25.00 },
    "منتج ب": { stock: 50, price: 15.50 },
    "منتج ج": { stock: 75, price: 30.00 },
    "مادة خام س": { stock: 200, price: 10.00 },
    "مادة خام ص": { stock: 150, price: 12.50 }
  };

  const customers = ["عميل أ", "عميل ب", "عميل ج", "عميل عارض", "طلب إلكتروني"];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-populate unit price when item is selected
      if (field === "itemName" && typeof value === "string") {
        updated.unitPrice = inventory[value as keyof typeof inventory]?.price || 0;
      }
      
      return updated;
    });
  };

  const calculateTotal = () => {
    return formData.quantitySold * formData.unitPrice;
  };

  const getAvailableStock = () => {
    return inventory[formData.itemName as keyof typeof inventory]?.stock || 0;
  };

  const isStockSufficient = () => {
    return formData.quantitySold <= getAvailableStock();
  };

  const handleSubmit = () => {
    if (!formData.itemName || !formData.customer || formData.quantitySold <= 0 || formData.unitPrice <= 0) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى ملء جميع الحقول بقيم صحيحة",
        variant: "destructive"
      });
      return;
    }

    if (!isStockSufficient()) {
      toast({
        title: "المخزون غير كافي",
        description: `يتوفر فقط ${getAvailableStock()} وحدة من ${formData.itemName}`,
        variant: "destructive"
      });
      return;
    }

    const newSale: Sale = {
      id: Date.now().toString(),
      date: formData.date,
      itemName: formData.itemName,
      quantitySold: formData.quantitySold,
      unitPrice: formData.unitPrice,
      customer: formData.customer,
      totalAmount: calculateTotal()
    };

    setSales(prev => [...prev, newSale]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      itemName: "",
      quantitySold: 0,
      unitPrice: 0,
      customer: ""
    });

    toast({
      title: "تم تسجيل البيع",
      description: "تم تسجيل البيع بنجاح وتحديث المخزون",
    });
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(sale => sale.id !== id));
    toast({
      title: "تم حذف البيع",
      description: "تم حذف سجل البيع",
    });
  };

  const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Input Form */}
      <Card className="border-blue-500">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <ShoppingCart className="h-5 w-5" />
            <span>تسجيل بيع قطعة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sale-date">التاريخ</Label>
              <Input
                id="sale-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sale-item">اسم الصنف</Label>
              <Select value={formData.itemName} onValueChange={(value) => handleInputChange("itemName", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر الصنف" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(inventory).map(item => (
                    <SelectItem key={item} value={item}>
                      {item} (المخزون: {inventory[item as keyof typeof inventory].stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sale-customer">العميل</Label>
              <Select value={formData.customer} onValueChange={(value) => handleInputChange("customer", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر العميل" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sale-quantity">الكمية المباعة</Label>
              <Input
                id="sale-quantity"
                type="number"
                min="1"
                value={formData.quantitySold || ""}
                onChange={(e) => handleInputChange("quantitySold", parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
              {formData.itemName && (
                <p className="text-sm text-gray-600 mt-1">
                  متوفر: {getAvailableStock()} وحدة
                  {!isStockSufficient() && formData.quantitySold > 0 && (
                    <span className="text-red-600 flex items-center mt-1">
                      <AlertTriangle className="h-4 w-4 ml-1" />
                      المخزون غير كافي!
                    </span>
                  )}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sale-unit-price">سعر الوحدة (ر.س)</Label>
              <Input
                id="sale-unit-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice || ""}
                onChange={(e) => handleInputChange("unitPrice", parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sale-total">المبلغ الإجمالي (ر.س)</Label>
              <Input
                id="sale-total"
                type="text"
                value={`${calculateTotal().toFixed(2)} ر.س`}
                readOnly
                className="mt-1 bg-gray-100 font-semibold"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="mt-4 bg-blue-500 hover:bg-blue-600"
            disabled={!isStockSufficient() && formData.quantitySold > 0}
          >
            <ShoppingCart className="h-4 w-4 ml-2" />
            تسجيل البيع
          </Button>
        </CardContent>
      </Card>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-blue-600">{sales.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-green-600">{totalSalesAmount.toFixed(2)} ر.س</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">متوسط البيع</p>
              <p className="text-2xl font-bold text-purple-600">
                {sales.length > 0 ? (totalSalesAmount / sales.length).toFixed(2) : "0.00"} ر.س
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجلات المبيعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-excel-gray-dark">
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">اسم الصنف</TableHead>
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">سعر الوحدة</TableHead>
                  <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-excel-gray">
                    <TableCell className="text-right">{sale.date}</TableCell>
                    <TableCell className="text-right">{sale.itemName}</TableCell>
                    <TableCell className="text-right">{sale.customer}</TableCell>
                    <TableCell className="text-right">{sale.quantitySold}</TableCell>
                    <TableCell className="text-right">{sale.unitPrice.toFixed(2)} ر.س</TableCell>
                    <TableCell className="text-right font-semibold">{sale.totalAmount.toFixed(2)} ر.س</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSale(sale.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {sales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      لا توجد سجلات مبيعات بعد. سجل أول بيع من الأعلى.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PieceSales;
