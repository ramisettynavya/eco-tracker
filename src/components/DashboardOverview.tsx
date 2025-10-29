import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingDown, TrendingUp, Calendar } from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, subMonths } from "date-fns";

export const DashboardOverview = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentMonthUsage, setCurrentMonthUsage] = useState(0);
  const [previousMonthUsage, setPreviousMonthUsage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get readings from last 6 months
      const sixMonthsAgo = subMonths(new Date(), 6);
      const { data: readings } = await supabase
        .from('meter_readings')
        .select('*')
        .eq('user_id', user.id)
        .gte('reading_date', format(sixMonthsAgo, 'yyyy-MM-dd'))
        .order('reading_date', { ascending: true });

      if (readings && readings.length > 0) {
        // Group by month and sum usage
        const monthlyData = readings.reduce((acc: any, reading: any) => {
          const month = format(new Date(reading.reading_date), 'MMM');
          if (!acc[month]) {
            acc[month] = { month, usage: 0, cost: 0 };
          }
          acc[month].usage += Number(reading.reading);
          acc[month].cost += Number(reading.cost);
          return acc;
        }, {});

        const chartArray = Object.values(monthlyData);
        setChartData(chartArray);

        // Get current and previous month usage
        if (chartArray.length >= 1) {
          const current = chartArray[chartArray.length - 1] as any;
          setCurrentMonthUsage(current.usage);
        }
        if (chartArray.length >= 2) {
          const previous = chartArray[chartArray.length - 2] as any;
          setPreviousMonthUsage(previous.usage);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const percentChange = previousMonthUsage > 0 
    ? ((currentMonthUsage - previousMonthUsage) / previousMonthUsage * 100).toFixed(1)
    : "0";
  const isIncrease = currentMonthUsage > previousMonthUsage;
  const avgDailyUsage = currentMonthUsage > 0 ? (currentMonthUsage / 30).toFixed(1) : "0";
  const estimatedCost = (currentMonthUsage * 12).toFixed(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthUsage.toFixed(0)} kWh</div>
            <p className="text-xs text-muted-foreground">{format(new Date(), 'MMMM yyyy')}</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">vs Last Month</CardTitle>
            {isIncrease ? (
              <TrendingUp className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-4 w-4 text-primary" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isIncrease ? 'text-destructive' : 'text-primary'}`}>
              {isIncrease ? '+' : ''}{percentChange}%
            </div>
            <p className="text-xs text-muted-foreground">
              {isIncrease ? 'Increase' : 'Decrease'} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{estimatedCost}</div>
            <p className="text-xs text-muted-foreground">At ₹12/kWh</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Usage</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDailyUsage} kWh</div>
            <p className="text-xs text-muted-foreground">Per day this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Energy Usage Trend</CardTitle>
            <CardDescription>Monthly consumption over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>Monthly electricity costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="cost" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
