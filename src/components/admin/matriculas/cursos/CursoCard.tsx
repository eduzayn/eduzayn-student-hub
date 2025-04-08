
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatarMoeda, formatarCargaHoraria } from "../utils/formatadores";

interface CursoCardProps {
  curso: any;
  selecionado: string | null;
  onSelecionar: (curso: any) => void;
}

const CursoCard: React.FC<CursoCardProps> = ({ 
  curso, 
  selecionado, 
  onSelecionar 
}) => {
  const isSelecionado = selecionado === curso.id;

  return (
    <Card 
      key={curso.id} 
      className={`cursor-pointer transition-colors ${isSelecionado ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
      onClick={() => onSelecionar(curso)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex gap-3 items-center">
              <p className="font-medium text-lg">{curso.titulo}</p>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                {curso.codigo}
              </span>
              {curso.learning_worlds_id && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  LearnWorlds
                </Badge>
              )}
              {curso.acesso && (
                <Badge 
                  variant="outline" 
                  className={`ml-1 ${
                    curso.acesso === 'free' || curso.acesso === 'gratis' || curso.acesso === 'livre' ? 
                    'bg-green-50 text-green-600 border-green-200' : 
                    curso.acesso === 'pago' ? 
                    'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {curso.acesso === 'free' || curso.acesso === 'gratis' || curso.acesso === 'livre' ? 'Gratuito' :
                   curso.acesso === 'pago' ? 'Pago' : curso.acesso}
                </Badge>
              )}
            </div>
            
            {curso.categorias && curso.categorias.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-1">
                {curso.categorias.slice(0, 3).map((categoria: string, i: number) => (
                  <span key={i} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                    {categoria}
                  </span>
                ))}
                {curso.categorias.length > 3 && (
                  <span className="text-xs text-gray-500">+{curso.categorias.length - 3}</span>
                )}
              </div>
            )}
            
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              <span>{curso.modalidade}</span>
              <span>{formatarCargaHoraria(curso.carga_horaria)}</span>
            </div>
            
            <div className="mt-2">
              <span className="text-sm font-medium text-green-600">
                Mensalidade: {formatarMoeda(curso.valor_mensalidade)}
              </span>
              <span className="text-sm text-muted-foreground ml-3">
                Total: {formatarMoeda(curso.valor_total)}
              </span>
            </div>
          </div>
          
          {isSelecionado && (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CursoCard;
