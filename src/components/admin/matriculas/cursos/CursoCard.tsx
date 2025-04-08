
import React from "react";
import { Card } from "@/components/ui/card";
import { formatarMoeda } from "@/utils/formatarMoeda";
import { ExternalLink } from "lucide-react";

interface CursoCardProps {
  curso: any;
  selecionado: boolean;
  onSelecionar: (curso: any) => void;
}

const CursoCard: React.FC<CursoCardProps> = ({ curso, selecionado, onSelecionar }) => {
  // Extrai o ID do LearnWorlds, garantindo que está disponível
  const learnWorldsId = curso.learning_worlds_id || curso.id || "";
  
  // Função auxiliar para abrir o curso no LearnWorlds em uma nova aba
  const abrirLearnWorlds = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o card seja selecionado
    
    // Verifica se temos a URL completa ou precisamos construí-la
    let url = curso.url;
    if (!url && learnWorldsId) {
      url = `https://grupozayneducacional.com.br/course/${learnWorldsId}`;
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Verificar se o curso é simulado (mostrando apenas como informação)
  const isSimulatedCourse = curso.simulado || curso.simulatedResponse;

  return (
    <Card 
      onClick={() => onSelecionar(curso)}
      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        selecionado ? "border-2 border-primary" : ""
      } ${isSimulatedCourse ? "border-dashed border-amber-300 bg-amber-50" : ""}`}
      data-testid="curso-card"
      data-curso-id={curso.id}
      data-lw-id={learnWorldsId}
    >
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{curso.titulo}</h3>
            {isSimulatedCourse && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                Simulado
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Código: {curso.codigo} {learnWorldsId && `| ID LearnWorlds: ${learnWorldsId}`}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {curso.modalidade}
            </span>
            <span className="text-sm">
              {curso.carga_horaria} min
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatarMoeda(curso.valor_total)}</p>
          <p className="text-sm text-muted-foreground">
            ou {formatarMoeda(curso.valor_mensalidade)}/mês
          </p>
          
          {(curso.url || learnWorldsId) && (
            <button 
              onClick={abrirLearnWorlds}
              className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
              title="Abrir no LearnWorlds"
              data-testid="ver-lw-btn"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Ver no LW
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CursoCard;
