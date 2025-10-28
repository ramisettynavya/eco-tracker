import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const historicalReadings = [
  { date: "2024-06-01", reading: 12845.67, usage: 520, cost: 78.0, change: 26.8 },
  { date: "2024-05-01", reading: 12325.67, usage: 410, cost: 61.5, change: 5.1 },
  { date: "2024-04-01", reading: 11915.67, usage: 390, cost: 58.5, change: -18.8 },
  { date: "2024-03-01", reading: 11525.67, usage: 480, cost: 72.0, change: 14.3 },
  { date: "2024-02-01", reading: 11045.67, usage: 420, cost: 63.0, change: -6.7 },
  { date: "2024-01-01", reading: 10625.67, usage: 450, cost: 67.5, change: 0 },
];

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
              {historicalReadings.map((reading, index) => (
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
                            {new Date(reading.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reading: {reading.reading.toLocaleString()} kWh
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
                        <p className="text-lg font-bold">{reading.usage} kWh</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Cost</p>
                        <p className="text-lg font-bold text-primary">₹{(reading.cost * 80).toFixed(0)}</p>
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
            <p className="text-2xl font-bold">445 kWh</p>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Cost (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">₹32,040</p>
            <p className="text-xs text-muted-foreground">₹5,340 average/month</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Best Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">April</p>
            <p className="text-xs text-muted-foreground">390 kWh - ₹4,680</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
