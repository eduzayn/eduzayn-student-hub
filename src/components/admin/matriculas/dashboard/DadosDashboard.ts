
import { ReactNode } from "react";
import { FileText, Users, CheckCircle, AlertCircle } from "lucide-react";

export interface CardData {
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  trend: number;
  trendDown?: boolean;
  description: string;
}

export interface ChartDataPoint {
  mes: string;
  matriculas: number;
}

export interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

export const cardsData: CardData[] = [
  {
    title: "Total de Matrículas",
    value: "123",
    icon: FileText,
    trend: 7,
    description: "últimos 30 dias"
  },
  {
    title: "Alunos Ativos",
    value: "87",
    icon: Users,
    trend: 5,
    description: "últimos 30 dias"
  },
  {
    title: "Taxa de Conclusão",
    value: "74%",
    icon: CheckCircle,
    trend: 2,
    description: "últimos 30 dias"
  },
  {
    title: "Pendências",
    value: "12",
    icon: AlertCircle,
    trend: -3,
    trendDown: true,
    description: "últimos 30 dias"
  }
];

export const matriculasData: ChartDataPoint[] = [
  { mes: 'Jan', matriculas: 45 },
  { mes: 'Fev', matriculas: 52 },
  { mes: 'Mar', matriculas: 49 },
  { mes: 'Abr', matriculas: 63 },
  { mes: 'Mai', matriculas: 55 },
  { mes: 'Jun', matriculas: 67 },
  { mes: 'Jul', matriculas: 60 },
  { mes: 'Ago', matriculas: 78 }
];

export const statusData: PieDataPoint[] = [
  { name: 'Ativas', value: 63, color: '#10B981' },
  { name: 'Pendentes', value: 15, color: '#F59E0B' },
  { name: 'Trancadas', value: 8, color: '#6B7280' },
  { name: 'Canceladas', value: 5, color: '#EF4444' }
];

export const pagamentosData: PieDataPoint[] = [
  { name: 'Em dia', value: 72, color: '#10B981' },
  { name: 'Atrasados', value: 18, color: '#EF4444' },
  { name: 'Processando', value: 10, color: '#60A5FA' }
];
