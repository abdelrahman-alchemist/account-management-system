
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Printer, Download, Github } from "lucide-react";
import IncomingRecording from "@/components/accounting/IncomingRecording";
import PieceSales from "@/components/accounting/PieceSales";
import RepresentativeSales from "@/components/accounting/RepresentativeSales";
import WarehouseBalance from "@/components/accounting/WarehouseBalance";
import AccountStatement from "@/components/accounting/AccountStatement";
import BarcodeManager from "@/components/accounting/BarcodeManager";
import PrintManager from "@/components/accounting/PrintManager";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("incoming");
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
    toast({
      title: "طباعة",
      description: "تم إرسال الصفحة للطباعة",
    });
  };

  const handleExport = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `تقرير-محاسبي-${currentDate}.html`;
    
    const content = document.documentElement.outerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "تصدير",
      description: "تم تصدير البيانات بنجاح",
    });
  };

  const handleGithubLink = () => {
    // Replace with your actual GitHub repository URL
    const githubUrl = "https://github.com/yourusername/ledger-flow-excel-suite";
    window.open(githubUrl, '_blank');
    
    toast({
      title: "GitHub",
      description: "سيتم فتح صفحة المشروع على GitHub",
    });
  };

  return (
    <div className="min-h-screen bg-excel-gray" dir="rtl">
      {/* Header - Fully Responsive */}
      <div className="bg-excel-green text-white p-2 sm:p-3 md:p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 space-x-reverse">
            <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            <div className="text-center sm:text-right">
              <h1 className="text-base sm:text-lg md:text-2xl font-bold">نظام المحاسبة الشامل</h1>
              <p className="text-xs sm:text-sm text-excel-green-light hidden sm:block">برنامج محاسبي متكامل</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-excel-green hover:bg-excel-gray-dark text-xs h-7 sm:h-8 px-2 sm:px-3"
              onClick={handleGithubLink}
            >
              <Github className="h-3 w-3 ml-1" />
              <span className="hidden xs:inline">GitHub</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-excel-green hover:bg-excel-gray-dark text-xs h-7 sm:h-8 px-2 sm:px-3"
              onClick={handlePrint}
            >
              <Printer className="h-3 w-3 ml-1" />
              <span className="hidden xs:inline">طباعة</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-excel-green hover:bg-excel-gray-dark text-xs h-7 sm:h-8 px-2 sm:px-3"
              onClick={handleExport}
            >
              <Download className="h-3 w-3 ml-1" />
              <span className="hidden xs:inline">تصدير</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Enhanced Mobile Responsiveness */}
      <div className="max-w-7xl mx-auto p-1 sm:p-2 md:p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-First Tab Layout */}
          <div className="mb-2 sm:mb-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 bg-white border border-gray-200 h-auto p-1">
              <TabsTrigger 
                value="incoming" 
                className="data-[state=active]:bg-excel-green data-[state=active]:text-white text-[10px] sm:text-xs p-1 sm:p-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] flex flex-col sm:flex-row items-center justify-center text-center"
              >
                <span className="block sm:inline">تسجيل</span>
                <span className="block sm:inline sm:mr-1">الواردات</span>
              </TabsTrigger>
              <TabsTrigger 
                value="piece-sales" 
                className="data-[state=active]:bg-excel-green data-[state=active]:text-white text-[10px] sm:text-xs p-1 sm:p-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] flex flex-col sm:flex-row items-center justify-center text-center"
              >
                <span className="block sm:inline">مبيعات</span>
                <span className="block sm:inline sm:mr-1">القطع</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rep-sales" 
                className="data-[state=active]:bg-excel-green data-[state=active]:text-white text-[10px] sm:text-xs p-1 sm:p-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] flex flex-col sm:flex-row items-center justify-center text-center"
              >
                <span className="block sm:inline">مبيعات</span>
                <span className="block sm:inline sm:mr-1">المندوبين</span>
              </TabsTrigger>
              <TabsTrigger 
                value="warehouse" 
                className="data-[state=active]:bg-excel-green data-[state=active]:text-white text-[10px] sm:text-xs p-1 sm:p-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] flex flex-col sm:flex-row items-center justify-center text-center"
              >
                <span className="block sm:inline">رصيد</span>
                <span className="block sm:inline sm:mr-1">المخزن</span>
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-excel-green data-[state=active]:text-white text-[10px] sm:text-xs p-1 sm:p-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] flex flex-col sm:flex-row items-center justify-center text-center col-span-2 sm:col-span-1"
              >
                <span className="block sm:inline">كشف</span>
                <span className="block sm:inline sm:mr-1">الحساب</span>
              </TabsTrigger>
              <TabsTrigger 
                value="barcode" 
                className="data-[state=active]:bg-excel-green data-[state=active]:text-white text-[10px] sm:text-xs p-1 sm:p-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] flex flex-col sm:flex-row items-center justify-center text-center"
              >
                <span className="block sm:inline">إدارة</span>
                <span className="block sm:inline sm:mr-1">الباركود</span>
              </TabsTrigger>
              <TabsTrigger 
                value="print" 
                className="data-[state=active]:bg-excel-green data-[state=active]:text-white text-[10px] sm:text-xs p-1 sm:p-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] flex flex-col sm:flex-row items-center justify-center text-center"
              >
                <span className="block sm:inline">مركز</span>
                <span className="block sm:inline sm:mr-1">الطباعة</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="incoming" className="mt-0">
            <IncomingRecording />
          </TabsContent>

          <TabsContent value="piece-sales" className="mt-0">
            <PieceSales />
          </TabsContent>

          <TabsContent value="rep-sales" className="mt-0">
            <RepresentativeSales />
          </TabsContent>

          <TabsContent value="warehouse" className="mt-0">
            <WarehouseBalance />
          </TabsContent>

          <TabsContent value="account" className="mt-0">
            <AccountStatement />
          </TabsContent>

          <TabsContent value="barcode" className="mt-0">
            <BarcodeManager />
          </TabsContent>

          <TabsContent value="print" className="mt-0">
            <PrintManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
