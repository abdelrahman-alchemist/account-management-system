import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scan, Plus, Search, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeItem {
  id: string;
  barcode: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  category: string;
}

const BarcodeManager = () => {
  const { toast } = useToast();
  const [barcodeItems, setBarcodeItems] = useState<BarcodeItem[]>([
    {
      id: "1",
      barcode: "1234567890123",
      itemName: "منتج أ",
      unitPrice: 25.00,
      quantity: 150,
      category: "منتجات"
    },
    {
      id: "2",
      barcode: "2345678901234",
      itemName: "منتج ب",
      unitPrice: 15.50,
      quantity: 20,
      category: "منتجات"
    },
    {
      id: "3",
      barcode: "3456789012345",
      itemName: "منتج ج",
      unitPrice: 30.00,
      quantity: 10,
      category: "منتجات"
    },
    {
      id: "4",
      barcode: "4567890123456",
      itemName: "مادة خام س",
      unitPrice: 10.00,
      quantity: 400,
      category: "مواد خام"
    },
    {
      id: "5",
      barcode: "5678901234567",
      itemName: "مادة خام ص",
      unitPrice: 12.50,
      quantity: 150,
      category: "مواد خام"
    }
  ]);

  const [formData, setFormData] = useState({
    barcode: "",
    itemName: "",
    unitPrice: 0,
    quantity: 0,
    category: "منتجات"
  });

  const [searchBarcode, setSearchBarcode] = useState("");
  const [searchResult, setSearchResult] = useState<BarcodeItem | null>(null);

  const categories = ["منتجات", "مواد خام", "لوازم", "معدات"];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.barcode || !formData.itemName || formData.unitPrice <= 0 || formData.quantity < 0) {
      toast({
        title: "التحقق من البيانات",
        description: "يرجى ملء جميع الحقول بقيم صحيحة",
        variant: "destructive"
      });
      return;
    }

    // Check if barcode already exists
    if (barcodeItems.some(item => item.barcode === formData.barcode)) {
      toast({
        title: "الباركود مكرر",
        description: "هذا الباركود موجود بالفعل في النظام",
        variant: "destructive"
      });
      return;
    }

    const newBarcodeItem: BarcodeItem = {
      id: Date.now().toString(),
      barcode: formData.barcode,
      itemName: formData.itemName,
      unitPrice: formData.unitPrice,
      quantity: formData.quantity,
      category: formData.category
    };

    setBarcodeItems(prev => [...prev, newBarcodeItem]);
    setFormData({
      barcode: "",
      itemName: "",
      unitPrice: 0,
      quantity: 0,
      category: "منتجات"
    });

    toast({
      title: "الباركود تم إضافة",
      description: "تم إضافة باركود الصنف بنجاح",
    });
  };

  const deleteBarcodeItem = (id: string) => {
    setBarcodeItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "الباركود تم حذف",
      description: "تم حذف عنصر باركود",
    });
  };

  const handleBarcodeSearch = () => {
    if (!searchBarcode.trim()) {
      toast({
        title: "بحث فارغ",
        description: "يرجى إدخال رقم باركود للبحث",
        variant: "destructive"
      });
      return;
    }

    const found = barcodeItems.find(item => item.barcode === searchBarcode.trim());
    
    if (found) {
      setSearchResult(found);
      toast({
        title: "تم العثور على الصنف",
        description: `تم العثور على: ${found.itemName}`,
      });
    } else {
      setSearchResult(null);
      toast({
        title: "لم يتم العثور على الصنف",
        description: "لا يوجد صنف بهذا الرقم",
        variant: "destructive"
      });
    }
  };

  const generateRandomBarcode = () => {
    const barcode = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    setFormData(prev => ({ ...prev, barcode: barcode.toString() }));
  };

  return (
    <div className="space-y-4 p-4" dir="rtl">
      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="manage" className="text-xs">إدارة الباركود</TabsTrigger>
          <TabsTrigger value="search" className="text-xs">البحث بالباركود</TabsTrigger>
          <TabsTrigger value="list" className="text-xs">جميع الأصناف</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="mt-4">
          {/* Add Barcode Form */}
          <Card className="border-green-500">
            <CardHeader className="bg-green-500 text-white pb-3">
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-base">
                <Plus className="h-4 w-4" />
                <span>إضافة صنف جديد بالباركود</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <Label htmlFor="barcode" className="text-sm">الباركود</Label>
                  <div className="flex space-x-2 space-x-reverse mt-1">
                    <Input
                      id="barcode"
                      placeholder="أدخل أو امسح الباركود"
                      value={formData.barcode}
                      onChange={(e) => handleInputChange("barcode", e.target.value)}
                      className="flex-1 h-9 text-sm"
                    />
                    <Button 
                      variant="outline" 
                      onClick={generateRandomBarcode}
                      className="px-3 h-9 text-xs"
                    >
                      توليد
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="item-name" className="text-sm">اسم الصنف</Label>
                  <Input
                    id="item-name"
                    placeholder="أدخل اسم الصنف"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange("itemName", e.target.value)}
                    className="mt-1 h-9 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="unit-price" className="text-sm">سعر الوحدة (ج.م)</Label>
                  <Input
                    id="unit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice || ""}
                    onChange={(e) => handleInputChange("unitPrice", parseFloat(e.target.value) || 0)}
                    className="mt-1 h-9 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-sm">الكمية</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity || ""}
                    onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
                    className="mt-1 h-9 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm">الفئة</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-9 text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full bg-green-500 hover:bg-green-600 h-9 text-sm">
                <Plus className="h-3 w-3 ml-1" />
                إضافة صنف بالباركود
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="mt-4">
          {/* Barcode Search */}
          <Card className="border-blue-500">
            <CardHeader className="bg-blue-500 text-white pb-3">
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-base">
                <Scan className="h-4 w-4" />
                <span>البحث بالباركود</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex space-x-2 space-x-reverse mb-4">
                <Input
                  placeholder="أدخل أو امسح الباركود للبحث"
                  value={searchBarcode}
                  onChange={(e) => setSearchBarcode(e.target.value)}
                  className="flex-1 h-9 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                />
                <Button onClick={handleBarcodeSearch} className="bg-blue-500 hover:bg-blue-600 h-9 text-sm">
                  <Search className="h-3 w-3 ml-1" />
                  بحث
                </Button>
              </div>

              {searchResult && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-green-800">تم العثور على الصنف</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div>
                        <p className="text-xs text-gray-600">الباركود</p>
                        <p className="font-semibold text-sm">{searchResult.barcode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">اسم الصنف</p>
                        <p className="font-semibold text-sm">{searchResult.itemName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">سعر الوحدة</p>
                        <p className="font-semibold text-sm">{searchResult.unitPrice.toFixed(2)} ج.م</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">الكمية</p>
                        <p className="font-semibold text-sm">{searchResult.quantity}</p>
                      </div>
                    </div>
                    <div>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        {searchResult.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          {/* All Barcode Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-base">
                <Package className="h-4 w-4" />
                <span>جميع أصناف الباركود</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-excel-gray-dark">
                      <TableHead className="text-right text-xs">الباركود</TableHead>
                      <TableHead className="text-right text-xs">اسم الصنف</TableHead>
                      <TableHead className="text-right text-xs">الفئة</TableHead>
                      <TableHead className="text-right text-xs">سعر الوحدة</TableHead>
                      <TableHead className="text-right text-xs">الكمية</TableHead>
                      <TableHead className="text-right text-xs">القيمة الإجمالية</TableHead>
                      <TableHead className="text-center text-xs">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {barcodeItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-excel-gray">
                        <TableCell className="font-mono text-xs">{item.barcode}</TableCell>
                        <TableCell className="font-medium text-xs">{item.itemName}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs">{item.unitPrice.toFixed(2)} ج.م</TableCell>
                        <TableCell className="text-right text-xs">{item.quantity}</TableCell>
                        <TableCell className="text-right font-semibold text-xs">
                          {(item.unitPrice * item.quantity).toFixed(2)} ج.م
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteBarcodeItem(item.id)}
                            className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BarcodeManager;
