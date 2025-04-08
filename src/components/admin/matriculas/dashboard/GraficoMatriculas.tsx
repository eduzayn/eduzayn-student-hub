
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface GraficoMatriculasProps {
  data: Array<{
    mes: string;
    matriculas: number;
  }>;
}

const GraficoMatriculas: React.FC<GraficoMatriculasProps> = ({ data }) => {
  const chartConfig = {
    matriculas: { color: '#3B82F6' }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Matrículas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              {/* Usando parâmetros padrões ao invés de defaultProps */}
              <YAxis 
                width={40} 
                tickFormatter={(value) => `${value}`}
                // Definir propriedades explicitamente ao invés de usar defaultProps
                allowDecimals={false}
                allowDataOverflow={false}
                domain={['auto', 'auto']}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="matriculas" fill="var(--color-matriculas, #3B82F6)" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraficoMatriculas;
