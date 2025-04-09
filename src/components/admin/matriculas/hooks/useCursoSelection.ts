
import { useState, useEffect } from "react";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { carregarCursos } from "./cursos/cursosLoader";
import { toast } from "sonner";

/**
 * Hook para seleção de cursos com suporte a paginação e busca
 */
export const useCursoSelection = (onCursoSelecionado: (curso: any) => void) => {
  const [busca, setBusca] = useState("");
  const [cursos, setCursos] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isBuscaAtiva, setIsBuscaAtiva] = useState(false);
  const [forceReload, setForceReload] = useState(0); // Contador para forçar recargas
  const { getCourses, loading, error, offlineMode } = useLearnWorldsApi();
  
  // Cursos por página - podemos aumentar se necessário
  const cursosPerPage = 50;
  
  // Carregar cursos quando o componente montar, página mudar ou forçar recarga
  useEffect(() => {
    if (!isBuscaAtiva) {
      carregarCursos({ 
        getCourses, 
        setTotalPages, 
        setCursos, 
        offlineMode 
      }, "", page, cursosPerPage);
    } else {
      carregarCursos({ 
        getCourses, 
        setTotalPages, 
        setCursos, 
        offlineMode 
      }, busca, page, cursosPerPage);
    }
  }, [page, offlineMode, forceReload]);
  
  // Handler para a busca de cursos
  const handleBusca = () => {
    setPage(1); // Resetar para primeira página quando fizer uma nova busca
    setIsBuscaAtiva(true);
    carregarCursos({ getCourses, setTotalPages, setCursos, offlineMode }, busca, 1, cursosPerPage);
  };
  
  // Função para forçar a recarga dos cursos ignorando o cache
  const recarregarCursos = () => {
    toast.info("Recarregando cursos do servidor...");
    setForceReload(prev => prev + 1); // Incrementa para forçar o useEffect
  };
  
  // Handler para selecionar um curso
  const handleSelecionar = (curso: any) => {
    // Prioriza o ID do LearnWorlds se disponível
    const cursoId = curso.learning_worlds_id || curso.id;
    setSelecionado(cursoId);
    
    // CORREÇÃO: Garantir explicitamente que simulado seja booleano e preservar o valor original
    const cursoProcessado = {
      ...curso,
      simulado: curso.simulado === true, // Preserva o valor original, mas garante que seja booleano
      api_oauth: curso.api_oauth === true || false, // Preserva flag de origem OAuth
      learning_worlds_id: curso.learning_worlds_id || curso.id
    };
    
    onCursoSelecionado(cursoProcessado);
  };

  // Limpar a busca e carregar todos os cursos
  const limparBusca = () => {
    setBusca("");
    setIsBuscaAtiva(false);
    setPage(1);
    carregarCursos({ getCourses, setTotalPages, setCursos, offlineMode }, "", 1, cursosPerPage);
  };

  return {
    busca,
    setBusca,
    cursos,
    selecionado,
    loading,
    error,
    offlineMode,
    page,
    totalPages,
    setPage,
    handleBusca,
    handleSelecionar,
    limparBusca,
    recarregarCursos
  };
};

export default useCursoSelection;
