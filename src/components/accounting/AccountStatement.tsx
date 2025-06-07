
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Transaction {
  id: string;
  date: string;
  type: 'incoming' | 'sale' | 'expense';
  description: string;
  amountIn: number;
  amountOut: number;
  balance: number;
}

const AccountStatement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app this would come from all modules
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        date: "2024-06-01",
        type: "incoming",
        description: "شراء من الموردين أ ب ج - منتج أ (100 وحدة)",
        amountIn: 2500.00,
        amountOut: 0,
        balance: 2500.00
      },
      {
        id: "2",
        date: "2024-06-02",
        type: "sale",
        description: "بيع للعميل أ - منتج أ (25 وحدة)",
        amountIn: 0,
        amountOut: 625.00,
        balance: 1875.00
      },
      {
        id: "3",
        date: "2024-06-03",
        type: "expense",
        description: "مصاريف المكتب والمرافق",
        amountIn: 0,
        amountOut: 150.00,
        balance: 1725.00
      },
      {
        id: "4",
        date: "2024-06-04",
        type: "incoming",
        description: "شراء من تجارة س ص ع - منتج ب (50 وحدة)",
        amountIn: 775.00,
        amountOut: 0,
        balance: 2500.00
      },
      {
        id: "5",
        date: "2024-06-04",
        type: "sale",
        description: "مبيعات المندوب أحمد محمد - منتج ب (10 وحدات)",
        amountIn: 0,
        amountOut: 155.00,
        balance: 2345.00
      },
      {
        id: "6",
        date: "2024-06-05",
        type: "sale",
        description: "بيع للعميل ب - منتج ج (5 وحدات)",
        amountIn: 0,
        amountOut: 150.00,
        balance: 2195.00
      },
      {
        id: "7",
        date: "2024-06-05",
        type: "expense",
        description: "تكاليف النقل والتوصيل",
        amountIn: 0,
        amountOut: 85.00,
        balance: 2110.00
      }
    ];

    // Calculate running balance
    let runningBalance = 0;
    const transactionsWithBalance = mockTransactions.map(transaction => {
      runningBalance += transaction.amountIn - transaction.amountOut;
      return {
        ...transaction,
        balance: runningBalance
      };
    });

    setTransactions(transactionsWithBalance);
    setFilteredTransactions(transactionsWithBalance);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(t => t.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(t => t.date <= dateTo);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, filterType, dateFrom, dateTo, searchTerm]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'incoming': return 'bg-green-100 text-green-800';
      case 'sale': return 'bg-blue-100 text-blue-800';
      case 'expense': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'incoming': return 'واردات';
      case 'sale': return 'مبيعات';
      case 'expense': return 'مصاريف';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <TrendingUp className="h-4 w-4" />;
      case 'sale': return <DollarSign className="h-4 w-4" />;
      case 'expense': return <TrendingDown className="h-4 w-4" />;
      default: return null;
    }
  };

  const totalIncoming = transactions.reduce((sum, t) => sum + t.amountIn, 0);
  const totalOutgoing = transactions.reduce((sum, t) => sum + t.amountOut, 0);
  const currentBalance = totalIncoming - totalOutgoing;

  const clearFilters = () => {
    setFilterType("all");
    setDateFrom("");
    setDateTo("");
    setSearchTerm("");
  };

  return (
    <div className="space-y-4 p-4" dir="rtl">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">إجمالي الواردات</p>
              <p className="text-lg font-bold text-green-600">{totalIncoming.toFixed(2)} ج.م</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-red-100">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">إجمالي الصادرات</p>
              <p className="text-lg font-bold text-red-600">{totalOutgoing.toFixed(2)} ج.م</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">الرصيد الحالي</p>
              <p className={`text-lg font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentBalance.toFixed(2)} ج.م
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">إجمالي المعاملات</p>
              <p className="text-lg font-bold text-purple-600">{transactions.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Alert */}
      {currentBalance < 1000 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <TrendingDown className="h-4 w-4" />
          <AlertDescription>
            <strong>تحذير رصيد منخفض:</strong> الرصيد الحالي أقل من 1,000 ج.م. يُنصح بمراجعة التدفق النقدي.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Filter className="h-4 w-4" />
              <span>المرشحات</span>
            </div>
            <Button variant="outline" onClick={clearFilters} size="sm" className="text-xs">
              مسح المرشحات
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-sm font-medium">نوع المعاملة</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="incoming">واردات</SelectItem>
                  <SelectItem value="sale">مبيعات</SelectItem>
                  <SelectItem value="expense">مصاريف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">من تاريخ</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1 h-9"
              />
            </div>
            <div>
              <label className="text-sm font-medium">إلى تاريخ</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1 h-9"
              />
            </div>
            <div>
              <label className="text-sm font-medium">البحث في الوصف</label>
              <Input
                placeholder="ابحث في المعاملات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Statement Table */}
      <Card className="border-indigo-500">
        <CardHeader className="bg-indigo-500 text-white pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Calendar className="h-4 w-4" />
              <span>كشف الحساب</span>
            </div>
            <Button variant="outline" size="sm" className="bg-white text-indigo-500 hover:bg-gray-100 text-xs h-8">
              <Download className="h-3 w-3 ml-1" />
              تصدير
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-indigo-50">
                  <TableHead className="text-right text-xs">التاريخ</TableHead>
                  <TableHead className="text-right text-xs">النوع</TableHead>
                  <TableHead className="text-right text-xs">الوصف</TableHead>
                  <TableHead className="text-right text-xs">مبلغ داخل</TableHead>
                  <TableHead className="text-right text-xs">مبلغ خارج</TableHead>
                  <TableHead className="text-right text-xs">الرصيد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-indigo-50">
                    <TableCell className="text-xs">{transaction.date}</TableCell>
                    <TableCell>
                      <Badge className={`${getTypeColor(transaction.type)} flex items-center space-x-1 space-x-reverse w-fit text-xs`}>
                        {getTypeIcon(transaction.type)}
                        <span>{getTypeName(transaction.type)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs text-xs">{transaction.description}</TableCell>
                    <TableCell className="text-right text-xs">
                      {transaction.amountIn > 0 ? (
                        <span className="text-green-600 font-semibold">
                          +{transaction.amountIn.toFixed(2)} ج.م
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {transaction.amountOut > 0 ? (
                        <span className="text-red-600 font-semibold">
                          -{transaction.amountOut.toFixed(2)} ج.م
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className={`text-right font-bold text-xs ${transaction.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.balance.toFixed(2)} ج.م
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8 text-sm">
                      لا توجد معاملات تطابق المرشحات الحالية.
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

export default AccountStatement;
