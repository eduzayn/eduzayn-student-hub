
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  trend: number;
  trendDown?: boolean;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDown = false,
  description
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold mt-1">{value}</div>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div className="flex items-center mt-4 text-sm">
          {trendDown ? (
            <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
          ) : (
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
          )}
          
          <span 
            className={trendDown ? "text-red-500" : "text-green-500"}
          >
            {trendDown ? "-" : "+"}{trend}%
          </span>
          <span className="text-muted-foreground ml-1">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
