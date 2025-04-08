
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
  
  // Dados diagnósticos para debug
  console.log("Exibindo cursos:", cursosExibir);
  console.log("Total de cursos para exibição:", cursosExibir.length);
  console.log("Modo offline?", offlineMode);
  
  // Verificações específicas de origem de dados
  const cursosSimulados = cursosExibir.filter(c => c.simulado);
  const cursosReais = cursosExibir.filter(c => !c.simulado);
  console.log("Cursos simulados:", cursosSimulados.length);
  console.log("Cursos reais:", cursosReais.length);
  
  // Listagem de todos os cursos para diagnóstico
  console.log("Lista completa de cursos:");
  cursosExibir.forEach((curso, index) => {
    console.log(`${index+1}. "${curso.titulo}" - ID: ${curso.id} - LW ID: ${curso.learning_worlds_id} - Simulado: ${curso.simulado}`);
  });
  
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
        {offlineMode && " (usando dados simulados)"}
        {!offlineMode && cursosSimulados.length > 0 && cursosReais.length === 0 && " (todos os dados são simulados)"}
        {!offlineMode && cursosSimulados.length > 0 && cursosReais.length > 0 && " (mistura de dados reais e simulados)"}
        {!offlineMode && cursosReais.length > 0 && cursosSimulados.length === 0 && " (dados reais)"}
      </div>
      
      {!offlineMode && cursosSimulados.length > 0 && cursosReais.length === 0 && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-md mb-3 text-amber-800 text-sm">
          <p><strong>Importante:</strong> A API está online, mas todos os cursos foram identificados como simulados.</p>
          <p>Isso pode indicar um problema de comunicação com o LearnWorlds ou um problema de formato nos dados recebidos.</p>
        </div>
      )}
      
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
