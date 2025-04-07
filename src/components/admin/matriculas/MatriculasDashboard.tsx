
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  CreditCard,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend 
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const MatriculasDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Dados de exemplo para o gráfico de matrículas
  const matriculasData = [
    { mes: 'Jan', matriculas: 45 },
    { mes: 'Fev', matriculas: 52 },
    { mes: 'Mar', matriculas: 49 },
    { mes: 'Abr', matriculas: 63 },
    { mes: 'Mai', matriculas: 55 },
    { mes: 'Jun', matriculas: 67 },
    { mes: 'Jul', matriculas: 60 },
    { mes: 'Ago', matriculas: 78 }
  ];
  
  // Dados de exemplo para o gráfico de status
  const statusData = [
    { name: 'Ativas', value: 63, color: '#10B981' },
    { name: 'Pendentes', value: 15, color: '#F59E0B' },
    { name: 'Trancadas', value: 8, color: '#6B7280' },
    { name: 'Canceladas', value: 5, color: '#EF4444' }
  ];
  
  // Dados de exemplo para o gráfico de pagamentos
  const pagamentosData = [
    { name: 'Em dia', value: 72, color: '#10B981' },
    { name: 'Atrasados', value: 18, color: '#EF4444' },
    { name: 'Processando', value: 10, color: '#60A5FA' }
  ];
  
  // Configuração das cores dos gráficos
  const chartConfig = {
    matriculas: { color: '#3B82F6' },
    ativas: { color: '#10B981' },
    pendentes: { color: '#F59E0B' },
    trancadas: { color: '#6B7280' },
    canceladas: { color: '#EF4444' },
    emDia: { color: '#10B981' },
    atrasados: { color: '#EF4444' },
    processando: { color: '#60A5FA' }
  };
  
  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total de Matrículas"
          value="123"
          icon={FileText}
          trend={7}
          description="últimos 30 dias"
        />
        <DashboardCard 
          title="Alunos Ativos"
          value="87"
          icon={Users}
          trend={5}
          description="últimos 30 dias"
        />
        <DashboardCard 
          title="Taxa de Conclusão"
          value="74%"
          icon={CheckCircle}
          trend={2}
          description="últimos 30 dias"
        />
        <DashboardCard 
          title="Pendências"
          value="12"
          icon={AlertCircle}
          trend={-3}
          trendDown
          description="últimos 30 dias"
        />
      </div>
      
      {/* Alertas e Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas e Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center">
                <Clock className="text-amber-500 mr-3" />
                <span className="font-medium">
                  5 matrículas aguardando aprovação de documentos
                </span>
              </div>
              <Button size="sm" onClick={() => navigate("/admin/matriculas/documentos")}>
                Verificar
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="text-red-500 mr-3" />
                <span className="font-medium">
                  8 pagamentos atrasados precisam de atenção
                </span>
              </div>
              <Button size="sm" onClick={() => navigate("/admin/matriculas/pagamentos")}>
                Verificar
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <FileText className="text-blue-500 mr-3" />
                <span className="font-medium">
                  3 contratos pendentes de assinatura
                </span>
              </div>
              <Button size="sm" onClick={() => navigate("/admin/matriculas/contratos")}>
                Verificar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de Matrículas por Mês */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Matrículas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <BarChart data={matriculasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  {/* Removendo o uso de defaultProps e definindo as props diretamente */}
                  <YAxis width={40} tickFormatter={(value) => `${value}`} />
                  <RechartsTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="matriculas" fill="var(--color-matriculas, #3B82F6)" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Gráficos de Status e Pagamentos */}
        <div className="space-y-4">
          {/* Status das Matrículas */}
          <Card>
            <CardHeader>
              <CardTitle>Status das Matrículas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Status dos Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <Pie
                      data={pagamentosData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pagamentosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Botões de Ação Rápida */}
      <div className="flex flex-wrap gap-4">
        <Button 
          className="flex-1" 
          onClick={() => navigate("/admin/matriculas/nova")}
        >
          Nova Matrícula
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => navigate("/admin/matriculas/relatorios")}
        >
          Gerar Relatórios
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={() => navigate("/admin/matriculas/configuracoes")}
        >
          Configurações
        </Button>
      </div>
    </div>
  );
};

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

export default MatriculasDashboard;

