import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingDown, TrendingUp, Calendar } from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";

const mockData = [
  { month: "Jan", usage: 450, cost: 67.5 },
  { month: "Feb", usage: 420, cost: 63.0 },
  { month: "Mar", usage: 480, cost: 72.0 },
  { month: "Apr", usage: 390, cost: 58.5 },
  { month: "May", usage: 410, cost: 61.5 },
  { month: "Jun", usage: 520, cost: 78.0 },
];

export const DashboardOverview = () => {
  const currentUsage = 520;
  const previousUsage = 410;
  const percentChange = ((currentUsage - previousUsage) / previousUsage * 100).toFixed(1);
  const isIncrease = currentUsage > previousUsage;

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
            <div className="text-2xl font-bold">{currentUsage} kWh</div>
            <p className="text-xs text-muted-foreground">June 2024</p>
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
              {isIncrease ? 'Increase' : 'Decrease'} from May
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$78.00</div>
            <p className="text-xs text-muted-foreground">At $0.15/kWh</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Usage</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17.3 kWh</div>
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
              <LineChart data={mockData}>
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
              <BarChart data={mockData}>
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
