
import React from "react";
import CursoCard from "./CursoCard";
import CursosEmptyState from "./CursosEmptyState";
import CursosLoadingSkeleton from "./CursosLoadingSkeleton";

interface CursosListaProps {
  cursos: any[];
  selecionado: string | null;
  loading: boolean;
  offlineMode?: boolean;
  onSelecionar: (curso: any) => void;
}

const CursosLista: React.FC<CursosListaProps> = ({ 
  cursos, 
  selecionado, 
  loading, 
  onSelecionar,
  offlineMode = false
}) => {
  if (loading) {
    return <CursosLoadingSkeleton />;
  }
  
  // Mostrar todos os cursos que têm título válido
  const cursosExibir = cursos.filter(curso => curso.titulo || curso.title); 
  
  // Logs para diagnóstico
  console.log("Exibindo cursos:", cursosExibir.length);
  console.log("Modo offline?", offlineMode);
  console.log("Exemplo de curso:", cursosExibir[0]);
  
  // Verificações específicas de origem de dados
  // CORREÇÃO: Identificação correta de cursos simulados - procurando explicitamente pelo flag
  const cursosSimulados = cursosExibir.filter(c => c.simulado === true).length;
  const cursosReais = cursosExibir.length - cursosSimulados;
  console.log("Cursos simulados:", cursosSimulados);
  console.log("Cursos reais:", cursosReais);
  
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
      <div className="text-sm text-muted-foreground mb-2">
        Mostrando {cursosExibir.length} cursos
        {offlineMode ? " (usando dados simulados)" : " da API LearnWorlds"}
        {!offlineMode && cursosSimulados > 0 && (
          <span className="text-amber-600"> ({cursosSimulados} simulados, {cursosReais} reais)</span>
        )}
      </div>
      
      {cursosExibir.map(curso => (
        <CursoCard 
          key={getLearnWorldsId(curso)}
          curso={{
            ...curso,
            // CORREÇÃO: Garantir que simulado seja um booleano explícito usando o valor existente
            simulado: curso.simulado === true
          }} 
          selecionado={isCursoSelecionado(curso)}
          onSelecionar={onSelecionar} 
        />
      ))}
    </div>
  );
};

export default CursosLista;
