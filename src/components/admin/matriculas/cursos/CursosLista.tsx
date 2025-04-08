
import React from "react";
import CursoCard from "./CursoCard";
import CursosEmptyState from "./CursosEmptyState";
import CursosLoadingSkeleton from "./CursosLoadingSkeleton";

interface CursosListaProps {
  cursos: any[];
  selecionado: string | null;
  loading: boolean;
  onSelecionar: (curso: any) => void;
}

const CursosLista: React.FC<CursosListaProps> = ({ 
  cursos, 
  selecionado, 
  loading, 
  onSelecionar 
}) => {
  if (loading) {
    return <CursosLoadingSkeleton />;
  }

  // Filtrar para não mostrar cursos simulados na lista
  const cursosExibir = cursos.filter(curso => 
    !curso.simulado && 
    !curso.simulatedResponse && 
    curso.titulo // Garantir que tenha um título
  );

  if (cursosExibir.length === 0) {
    return <CursosEmptyState />;
  }

  // Função auxiliar para extrair o ID do LearnWorlds de um curso
  const getLearnWorldsId = (curso: any): string => {
    // Prioriza o campo learning_worlds_id se disponível
    if (curso.learning_worlds_id) {
      return curso.learning_worlds_id;
    }
    
    // Se tiver um ID normal, usa ele
    if (curso.id) {
      return curso.id;
    }
    
    // Fallback para um valor único
    return `curso-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Função para verificar se um curso está selecionado
  const isCursoSelecionado = (curso: any): boolean => {
    if (!selecionado) return false;
    
    // Verifica se o ID selecionado corresponde ao curso atual
    return selecionado === getLearnWorldsId(curso) || 
           selecionado === curso.id;
  };

  return (
    <div className="space-y-3">
      {cursosExibir.map(curso => (
        <CursoCard 
          key={getLearnWorldsId(curso)}
          curso={curso} 
          selecionado={isCursoSelecionado(curso)}
          onSelecionar={onSelecionar} 
        />
      ))}
    </div>
  );
};

export default CursosLista;
