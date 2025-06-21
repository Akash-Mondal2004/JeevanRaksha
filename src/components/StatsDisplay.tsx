
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Heart, AlertTriangle } from "lucide-react";

const StatsDisplay = () => {
  const stats = [
    {
      id: 1,
      label: "Active Volunteers",
      value: "2,847",
      change: "+127 today",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      changeColor: "text-green-600"
    },
    {
      id: 2,
      label: "Lives Saved",
      value: "15,429",
      change: "+89 this week",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
      changeColor: "text-green-600"
    },
    {
      id: 3,
      label: "Response Time",
      value: "4.2 min",
      change: "-1.3 min improved",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-100",
      changeColor: "text-green-600"
    },
    {
      id: 4,
      label: "Active Alerts",
      value: "23",
      change: "3 resolved today",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      changeColor: "text-blue-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        
        return (
          <Card key={stat.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-900">{stat.value}</p>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className={`text-xs ${stat.changeColor} font-medium`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsDisplay;
