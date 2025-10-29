import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const getTrendIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-destructive" />;
  if (change < 0) return <TrendingDown className="h-4 w-4 text-primary" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const getTrendColor = (change: number) => {
  if (change > 0) return "text-destructive";
  if (change < 0) return "text-primary";
  return "text-muted-foreground";
};

export const HistoricalData = () => {
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('meter_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('reading_date', { ascending: false });

      if (data) {
        // Calculate change percentages
        const readingsWithChange = data.map((reading, index) => {
          if (index === data.length - 1) {
            return { ...reading, change: 0 };
          }
          const previousReading = data[index + 1];
          const change = ((Number(reading.reading) - Number(previousReading.reading)) / Number(previousReading.reading)) * 100;
          return { ...reading, change };
        });
        setReadings(readingsWithChange);
      }
    } catch (error) {
      console.error('Error fetching readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalUsage = readings.reduce((sum, r) => sum + Number(r.reading), 0);
  const totalCost = readings.reduce((sum, r) => sum + Number(r.cost), 0);
  const avgUsage = readings.length > 0 ? (totalUsage / readings.length).toFixed(0) : "0";
  const avgCost = readings.length > 0 ? (totalCost / readings.length).toFixed(0) : "0";
  const bestMonth = readings.length > 0 
    ? readings.reduce((min, r) => Number(r.reading) < Number(min.reading) ? r : min, readings[0])
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No readings yet. Add your first reading to get started!</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold">Historical Readings</h2>
        <p className="text-muted-foreground">
          Track your energy consumption over time
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Reading History</CardTitle>
          <CardDescription>Your meter readings for the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {readings.map((reading, index) => (
                <Card 
                  key={index} 
                  className="shadow-sm hover:shadow-card transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {format(new Date(reading.reading_date), 'MMMM yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reading: {Number(reading.reading).toLocaleString()} kWh
                          </p>
                        </div>
                      </div>
                      {reading.change !== 0 && (
                        <Badge variant="outline" className="gap-1">
                          {getTrendIcon(reading.change)}
                          <span className={getTrendColor(reading.change)}>
                            {Math.abs(reading.change).toFixed(1)}%
                          </span>
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Usage</p>
                        <p className="text-lg font-bold">{Number(reading.reading).toFixed(0)} kWh</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Cost</p>
                        <p className="text-lg font-bold text-primary">₹{Number(reading.cost).toFixed(0)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Rate</p>
                        <p className="text-lg font-bold">₹12/kWh</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Monthly Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgUsage} kWh</p>
            <p className="text-xs text-muted-foreground">Average per reading</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">₹{totalCost.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">₹{avgCost} average</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Best Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {bestMonth ? format(new Date(bestMonth.reading_date), 'MMMM') : 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground">
              {bestMonth ? `${Number(bestMonth.reading).toFixed(0)} kWh - ₹${Number(bestMonth.cost).toFixed(0)}` : 'No data'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
