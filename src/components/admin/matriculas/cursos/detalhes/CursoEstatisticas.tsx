
import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { DollarSign, Clock, Users } from "lucide-react";
import { Curso } from "@/types/matricula";

interface CursoEstatisticasProps {
  curso: Curso;
  totalAlunos: number;
}

const CursoEstatisticas: React.FC<CursoEstatisticasProps> = ({ curso, totalAlunos }) => {
  const formatarMoeda = (valor: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-muted/20">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">Valor Total</span>
          </div>
          <p className="text-2xl font-bold">{formatarMoeda(curso.valor_total)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/20">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">Mensalidade</span>
          </div>
          <p className="text-2xl font-bold">{formatarMoeda(curso.valor_mensalidade)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/20">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">Carga Horária</span>
          </div>
          <p className="text-2xl font-bold">
            {curso.carga_horaria || 0}h
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/20">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">Alunos Matriculados</span>
          </div>
          <p className="text-2xl font-bold">{totalAlunos}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CursoEstatisticas;
