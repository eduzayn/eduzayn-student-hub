
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface GraficoStatusProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  title: string;
}

const GraficoStatus: React.FC<GraficoStatusProps> = ({ data, title }) => {
  const chartConfig = {
    ativas: { color: '#10B981' },
    pendentes: { color: '#F59E0B' },
    trancadas: { color: '#6B7280' },
    canceladas: { color: '#EF4444' },
    emDia: { color: '#10B981' },
    atrasados: { color: '#EF4444' },
    processando: { color: '#60A5FA' }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraficoStatus;
