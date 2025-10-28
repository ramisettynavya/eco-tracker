import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Leaf, TrendingDown, Sun, Wind, Droplets } from "lucide-react";

const tips = [
  {
    icon: Lightbulb,
    title: "Switch to LED Bulbs",
    description: "LED bulbs use 75% less energy and last 25 times longer than incandescent lighting.",
    impact: "High",
    savings: "Up to ₹6,000/year",
    category: "Lighting",
  },
  {
    icon: TrendingDown,
    title: "Optimize AC Temperature",
    description: "Set your thermostat to 78°F (26°C) when you're home and higher when away.",
    impact: "High",
    savings: "Up to ₹9,600/year",
    category: "Cooling",
  },
  {
    icon: Sun,
    title: "Unplug Idle Devices",
    description: "Electronics use power even when turned off. Unplug chargers and appliances when not in use.",
    impact: "Medium",
    savings: "Up to ₹4,000/year",
    category: "Electronics",
  },
  {
    icon: Droplets,
    title: "Fix Water Leaks",
    description: "A dripping faucet can waste up to 3,000 gallons per year, increasing water heating costs.",
    impact: "Medium",
    savings: "Up to ₹2,800/year",
    category: "Water",
  },
  {
    icon: Wind,
    title: "Use Ceiling Fans",
    description: "Ceiling fans help circulate air, allowing you to raise the AC temperature by 4°F.",
    impact: "Medium",
    savings: "Up to ₹3,600/year",
    category: "Cooling",
  },
  {
    icon: Leaf,
    title: "Wash Clothes in Cold Water",
    description: "90% of the energy used by washing machines goes to heating water.",
    impact: "Low",
    savings: "Up to ₹2,000/year",
    category: "Appliances",
  },
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "High":
      return "bg-primary text-primary-foreground";
    case "Medium":
      return "bg-chart-2 text-foreground";
    case "Low":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const EnergyTips = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold">Energy Saving Tips</h2>
        <p className="text-muted-foreground">
          Personalized recommendations based on your usage patterns
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <Card 
              key={index} 
              className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02]"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="bg-gradient-primary p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge className={getImpactColor(tip.impact)}>
                    {tip.impact} Impact
                  </Badge>
                </div>
                <CardTitle className="mt-4">{tip.title}</CardTitle>
                <CardDescription>{tip.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tip.description}</p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Potential Savings</span>
                  <span className="font-semibold text-primary">{tip.savings}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Leaf className="h-12 w-12 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Your Impact</h3>
              <p className="text-primary-foreground/90">
                By implementing these tips, you could save up to <strong>₹28,000 per year</strong> and 
                reduce your carbon footprint by approximately <strong>2.5 tons of CO₂</strong> annually.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
