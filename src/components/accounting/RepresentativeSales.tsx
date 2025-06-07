
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RepSale {
  id: string;
  date: string;
  repName: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

const RepresentativeSales = () => {
  const { toast } = useToast();
  const [repSales, setRepSales] = useState<RepSale[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    repName: "",
    itemName: "",
    quantity: 0,
    unitPrice: 0
  });

  const representatives = ["أحمد محمد", "فاطمة علي", "محمود حسن", "نورا سمير", "خالد عبدالله"];
  const items = ["منتج أ", "منتج ب", "منتج ج", "مادة خام س", "مادة خام ص"];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    return formData.quantity * formData.unitPrice;
  };

  const handleSubmit = () => {
    if (!formData.repName || !formData.itemName || formData.quantity <= 0 || formData.unitPrice <= 0) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى ملء جميع الحقول بقيم صحيحة",
        variant: "destructive"
      });
      return;
    }

    const newRepSale: RepSale = {
      id: Date.now().toString(),
      date: formData.date,
      repName: formData.repName,
      itemName: formData.itemName,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalAmount: calculateTotal()
    };

    setRepSales(prev => [...prev, newRepSale]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      repName: "",
      itemName: "",
      quantity: 0,
      unitPrice: 0
    });

    toast({
      title: "تم تسجيل مبيعات المندوب",
      description: "تم تسجيل المبيعة بنجاح",
    });
  };

  const deleteRepSale = (id: string) => {
    setRepSales(prev => prev.filter(sale => sale.id !== id));
    toast({
      title: "تم الحذف",
      description: "تم حذف سجل مبيعات المندوب",
    });
  };

  // Calculate summary by representative
  const repSummary = representatives.map(rep => {
    const repSalesData = repSales.filter(sale => sale.repName === rep);
    const totalSales = repSalesData.length;
    const totalRevenue = repSalesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalQuantity = repSalesData.reduce((sum, sale) => sum + sale.quantity, 0);
    
    return {
      name: rep,
      totalSales,
      totalRevenue,
      totalQuantity,
      averageSale: totalSales > 0 ? totalRevenue / totalSales : 0
    };
  }).filter(rep => rep.totalSales > 0);

  const totalSalesAmount = repSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="border-purple-500">
        <CardHeader className="bg-purple-500 text-white">
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Users className="h-5 w-5" />
            <span>تسجيل مبيعات المندوب</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rep-date">التاريخ</Label>
              <Input
                id="rep-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rep-name">مندوب المبيعات</Label>
              <Select value={formData.repName} onValueChange={(value) => handleInputChange("repName", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر المندوب" />
                </SelectTrigger>
                <SelectContent>
                  {representatives.map(rep => (
                    <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rep-item">اسم الصنف</Label>
              <Select value={formData.itemName} onValueChange={(value) => handleInputChange("itemName", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر الصنف" />
                </SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rep-quantity">الكمية</Label>
              <Input
                id="rep-quantity"
                type="number"
                min="1"
                value={formData.quantity || ""}
                onChange={(e) => handleInputChange("quantity", parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rep-unit-price">سعر الوحدة (ج.م)</Label>
              <Input
                id="rep-unit-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice || ""}
                onChange={(e) => handleInputChange("unitPrice", parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rep-total">المبلغ الإجمالي (ج.م)</Label>
              <Input
                id="rep-total"
                type="text"
                value={`${calculateTotal().toFixed(2)} ج.م`}
                readOnly
                className="mt-1 bg-gray-100 font-semibold"
              />
            </div>
          </div>

          <Button onClick={handleSubmit} className="mt-4 bg-purple-500 hover:bg-purple-600">
            <Users className="h-4 w-4 ml-2" />
            تسجيل المبيعة
          </Button>
        </CardContent>
      </Card>

      {/* Tabs for Sales and Summary */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">جميع المبيعات</TabsTrigger>
          <TabsTrigger value="summary">ملخص المندوبين</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>سجلات مبيعات المندوبين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-excel-gray-dark">
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المندوب</TableHead>
                      <TableHead>اسم الصنف</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">سعر الوحدة</TableHead>
                      <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repSales.map((sale) => (
                      <TableRow key={sale.id} className="hover:bg-excel-gray">
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.repName}</TableCell>
                        <TableCell>{sale.itemName}</TableCell>
                        <TableCell className="text-right">{sale.quantity}</TableCell>
                        <TableCell className="text-right">{sale.unitPrice.toFixed(2)} ج.م</TableCell>
                        <TableCell className="text-right font-semibold">{sale.totalAmount.toFixed(2)} ج.م</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRepSale(sale.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {repSales.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                          لا توجد مبيعات للمندوبين حتى الآن. سجل أول مبيعة أعلاه.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">إجمالي المبيعات</p>
                    <p className="text-2xl font-bold text-purple-600">{repSales.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-green-600">{totalSalesAmount.toFixed(2)} ج.م</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">المندوبين النشطين</p>
                    <p className="text-2xl font-bold text-blue-600">{repSummary.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">المتوسط لكل مندوب</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {repSummary.length > 0 ? (totalSalesAmount / repSummary.length).toFixed(2) : "0.00"} ج.م
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Representative Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <TrendingUp className="h-5 w-5" />
                  <span>الأداء حسب المندوب</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead>المندوب</TableHead>
                        <TableHead className="text-right">إجمالي المبيعات</TableHead>
                        <TableHead className="text-right">إجمالي الكمية</TableHead>
                        <TableHead className="text-right">إجمالي الإيرادات</TableHead>
                        <TableHead className="text-right">متوسط المبيعة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repSummary
                        .sort((a, b) => b.totalRevenue - a.totalRevenue)
                        .map((rep) => (
                        <TableRow key={rep.name} className="hover:bg-purple-50">
                          <TableCell className="font-medium">{rep.name}</TableCell>
                          <TableCell className="text-right">{rep.totalSales}</TableCell>
                          <TableCell className="text-right">{rep.totalQuantity}</TableCell>
                          <TableCell className="text-right font-semibold">{rep.totalRevenue.toFixed(2)} ج.م</TableCell>
                          <TableCell className="text-right">{rep.averageSale.toFixed(2)} ج.م</TableCell>
                        </TableRow>
                      ))}
                      {repSummary.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                            لا توجد بيانات مبيعات المندوبين متاحة.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RepresentativeSales;
