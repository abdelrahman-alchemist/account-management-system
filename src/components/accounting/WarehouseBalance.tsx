
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Search, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InventoryItem {
  itemName: string;
  totalIncoming: number;
  totalOutgoing: number;
  currentStock: number;
  unitPrice: number;
  totalValue: number;
  status: 'good' | 'low' | 'critical';
}

const WarehouseBalance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Mock data - in real app this would be calculated from incoming and sales data
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        itemName: "منتج أ",
        totalIncoming: 500,
        totalOutgoing: 350,
        currentStock: 150,
        unitPrice: 25.00,
        totalValue: 3750.00,
        status: 'good'
      },
      {
        itemName: "منتج ب",
        totalIncoming: 300,
        totalOutgoing: 280,
        currentStock: 20,
        unitPrice: 15.50,
        totalValue: 310.00,
        status: 'low'
      },
      {
        itemName: "منتج ج",
        totalIncoming: 200,
        totalOutgoing: 190,
        currentStock: 10,
        unitPrice: 30.00,
        totalValue: 300.00,
        status: 'critical'
      },
      {
        itemName: "مادة خام س",
        totalIncoming: 1000,
        totalOutgoing: 600,
        currentStock: 400,
        unitPrice: 10.00,
        totalValue: 4000.00,
        status: 'good'
      },
      {
        itemName: "مادة خام ص",
        totalIncoming: 800,
        totalOutgoing: 650,
        currentStock: 150,
        unitPrice: 12.50,
        totalValue: 1875.00,
        status: 'good'
      }
    ];
    setInventory(mockInventory);
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventory.filter(item => item.status === 'low' || item.status === 'critical');
  const criticalItems = inventory.filter(item => item.status === 'critical');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <TrendingUp className="h-4 w-4" />;
      case 'low': return <TrendingDown className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'جيد';
      case 'low': return 'منخفض';
      case 'critical': return 'حرج';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6" dir="rtl">
      {/* Alerts */}
      {criticalItems.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>تنبيه مخزون حرج:</strong> {criticalItems.length} عنصر/عناصر لديها مستويات مخزون منخفضة جداً وتحتاج إعادة تخزين فوري.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-600">إجمالي الأصناف</p>
              <p className="text-lg md:text-2xl font-bold text-blue-600">{inventory.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-600">إجمالي القيمة</p>
              <p className="text-lg md:text-2xl font-bold text-green-600">{totalInventoryValue.toFixed(2)} ج.م</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-600">أصناف منخفضة</p>
              <p className="text-lg md:text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-600">أصناف حرجة</p>
              <p className="text-lg md:text-2xl font-bold text-red-600">{criticalItems.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Balance Table */}
      <Card className="border-orange-500">
        <CardHeader className="bg-orange-500 text-white p-3 md:p-6">
          <CardTitle className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Warehouse className="h-5 w-5" />
              <span className="text-sm md:text-base">رصيد مخزن المستودع</span>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الأصناف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-white text-black text-sm"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-orange-50">
                  <TableHead className="text-right text-xs md:text-sm">اسم الصنف</TableHead>
                  <TableHead className="text-right text-xs md:text-sm">إجمالي الواردات</TableHead>
                  <TableHead className="text-right text-xs md:text-sm">إجمالي الصادرات</TableHead>
                  <TableHead className="text-right text-xs md:text-sm">المخزون الحالي</TableHead>
                  <TableHead className="text-right text-xs md:text-sm">سعر الوحدة</TableHead>
                  <TableHead className="text-right text-xs md:text-sm">إجمالي القيمة</TableHead>
                  <TableHead className="text-center text-xs md:text-sm">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow 
                    key={item.itemName} 
                    className={`hover:bg-orange-50 ${item.status === 'critical' ? 'bg-red-50' : ''}`}
                  >
                    <TableCell className="font-medium text-xs md:text-sm p-2 md:p-4">{item.itemName}</TableCell>
                    <TableCell className="text-right text-xs md:text-sm p-2 md:p-4">{item.totalIncoming}</TableCell>
                    <TableCell className="text-right text-xs md:text-sm p-2 md:p-4">{item.totalOutgoing}</TableCell>
                    <TableCell className="text-right font-semibold text-xs md:text-sm p-2 md:p-4">
                      {item.currentStock}
                      {item.status === 'critical' && (
                        <AlertTriangle className="inline mr-2 h-3 w-3 md:h-4 md:w-4 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs md:text-sm p-2 md:p-4">{item.unitPrice.toFixed(2)} ج.م</TableCell>
                    <TableCell className="text-right font-semibold text-xs md:text-sm p-2 md:p-4">{item.totalValue.toFixed(2)} ج.م</TableCell>
                    <TableCell className="text-center p-2 md:p-4">
                      <Badge className={`${getStatusColor(item.status)} flex items-center space-x-1 space-x-reverse justify-center text-xs`}>
                        {getStatusIcon(item.status)}
                        <span>{getStatusText(item.status)}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8 text-xs md:text-sm">
                      {searchTerm ? `لا توجد أصناف تطابق "${searchTerm}"` : "لا توجد بيانات مخزون متاحة"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Movement Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-lg">أصناف تحتاج اهتمام</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="space-y-3">
              {lowStockItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-xs md:text-sm">جميع الأصناف لديها مستويات مخزون كافية</p>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item.itemName} className="flex items-center justify-between p-2 md:p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-xs md:text-sm">{item.itemName}</p>
                      <p className="text-xs text-gray-600">المخزون الحالي: {item.currentStock} وحدة</p>
                    </div>
                    <Badge className={`${getStatusColor(item.status)} text-xs`}>
                      {item.status === 'critical' ? 'حرج' : 'مخزون منخفض'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-lg">أعلى الأصناف قيمة</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="space-y-3">
              {inventory
                .sort((a, b) => b.totalValue - a.totalValue)
                .slice(0, 5)
                .map((item) => (
                  <div key={item.itemName} className="flex items-center justify-between p-2 md:p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-xs md:text-sm">{item.itemName}</p>
                      <p className="text-xs text-gray-600">{item.currentStock} وحدة</p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-xs md:text-sm">{item.totalValue.toFixed(2)} ج.م</p>
                      <p className="text-xs text-gray-600">{item.unitPrice.toFixed(2)} ج.م/وحدة</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarehouseBalance;
