import { useState } from "react";
import { DashboardOverview } from "@/components/DashboardOverview";
import { ManualEntry } from "@/components/ManualEntry";
import { OCRCapture } from "@/components/OCRCapture";
import { EnergyTips } from "@/components/EnergyTips";
import { HistoricalData } from "@/components/HistoricalData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Camera, TrendingUp, Lightbulb, BarChart3, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EcoTrack</h1>
                <p className="text-sm text-muted-foreground">Energy Usage Tracker</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-card shadow-card">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4 mr-2" />
              Log Reading
            </TabsTrigger>
            <TabsTrigger value="ocr" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Camera className="h-4 w-4 mr-2" />
              Scan Meter
            </TabsTrigger>
            <TabsTrigger value="tips" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Lightbulb className="h-4 w-4 mr-2" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="animate-fade-in">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="manual" className="animate-fade-in">
            <ManualEntry />
          </TabsContent>

          <TabsContent value="ocr" className="animate-fade-in">
            <OCRCapture />
          </TabsContent>

          <TabsContent value="tips" className="animate-fade-in">
            <EnergyTips />
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <HistoricalData />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
