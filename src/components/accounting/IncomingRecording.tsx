
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IncomingRecord {
  id: string;
  date: string;
  supplier: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

const IncomingRecording = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<IncomingRecord[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    supplier: "",
    itemName: "",
    quantity: 0,
    unitPrice: 0
  });

  const suppliers = ["موردون أ ب ج", "تجارة س ص ع", "الواردات العالمية", "الموزعون المحليون"];
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
    if (!formData.supplier || !formData.itemName || formData.quantity <= 0 || formData.unitPrice <= 0) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى ملء جميع الحقول بقيم صحيحة",
        variant: "destructive"
      });
      return;
    }

    const newRecord: IncomingRecord = {
      id: Date.now().toString(),
      date: formData.date,
      supplier: formData.supplier,
      itemName: formData.itemName,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalAmount: calculateTotal()
    };

    setRecords(prev => [...prev, newRecord]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      supplier: "",
      itemName: "",
      quantity: 0,
      unitPrice: 0
    });

    toast({
      title: "تم إضافة السجل",
      description: "تم إضافة سجل الوارد بنجاح وتحديث المخزون",
    });
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
    toast({
      title: "تم حذف السجل",
      description: "تم حذف السجل من النظام",
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6" dir="rtl">
      {/* Input Form - Enhanced Mobile Layout */}
      <Card className="border-excel-green">
        <CardHeader className="bg-excel-green text-white p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center space-x-2 space-x-reverse text-sm sm:text-base md:text-lg">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>إضافة سجل وارد</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="date" className="text-xs sm:text-sm">التاريخ</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="supplier" className="text-xs sm:text-sm">المورد</Label>
              <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                <SelectTrigger className="mt-1 text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder="اختر المورد" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier} value={supplier} className="text-xs sm:text-sm">{supplier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="itemName" className="text-xs sm:text-sm">اسم الصنف</Label>
              <Select value={formData.itemName} onValueChange={(value) => handleInputChange("itemName", value)}>
                <SelectTrigger className="mt-1 text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder="اختر الصنف" />
                </SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item} value={item} className="text-xs sm:text-sm">{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity" className="text-xs sm:text-sm">الكمية</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity || ""}
                onChange={(e) => handleInputChange("quantity", parseFloat(e.target.value) || 0)}
                className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>

            <div>
              <Label htmlFor="unitPrice" className="text-xs sm:text-sm">سعر الوحدة (ج.م)</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice || ""}
                onChange={(e) => handleInputChange("unitPrice", parseFloat(e.target.value) || 0)}
                className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>

            <div>
              <Label htmlFor="total" className="text-xs sm:text-sm">المبلغ الإجمالي (ج.م)</Label>
              <Input
                id="total"
                type="text"
                value={`${calculateTotal().toFixed(2)} ج.م`}
                readOnly
                className="mt-1 bg-gray-100 font-semibold text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="mt-3 sm:mt-4 bg-excel-green hover:bg-excel-green-dark w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
            إضافة السجل
          </Button>
        </CardContent>
      </Card>

      {/* Records Table - Enhanced Mobile Responsiveness */}
      <Card>
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-sm sm:text-base md:text-lg">سجلات الواردات</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-excel-gray-dark">
                  <TableHead className="text-right text-xs sm:text-sm p-2 sm:p-4">التاريخ</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm p-2 sm:p-4 hidden sm:table-cell">المورد</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm p-2 sm:p-4">الصنف</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm p-2 sm:p-4">الكمية</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm p-2 sm:p-4 hidden md:table-cell">سعر الوحدة</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm p-2 sm:p-4">الإجمالي</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm p-2 sm:p-4">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id} className="hover:bg-excel-gray">
                    <TableCell className="text-right text-xs sm:text-sm p-2 sm:p-4">{record.date}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm p-2 sm:p-4 hidden sm:table-cell">{record.supplier}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm p-2 sm:p-4">
                      <div>
                        <div>{record.itemName}</div>
                        <div className="text-xs text-gray-500 sm:hidden">{record.supplier}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm p-2 sm:p-4">{record.quantity}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm p-2 sm:p-4 hidden md:table-cell">{record.unitPrice.toFixed(2)} ج.م</TableCell>
                    <TableCell className="text-right font-semibold text-xs sm:text-sm p-2 sm:p-4">
                      <div>
                        <div>{record.totalAmount.toFixed(2)} ج.م</div>
                        <div className="text-xs text-gray-500 md:hidden">{record.unitPrice.toFixed(2)} ج.م/وحدة</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center p-2 sm:p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRecord(record.id)}
                        className="text-red-600 hover:text-red-800 h-6 w-6 sm:h-8 sm:w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-6 sm:py-8 text-xs sm:text-sm">
                      لا توجد سجلات واردات بعد. أضف أول سجل من الأعلى.
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

export default IncomingRecording;
