
import { useState, useEffect } from 'react';
import useLearnWorldsAlunos, { AlunoParams } from './learnworlds/useLearnWorldsAlunos';
import useLearnWorldsCursos from './learnworlds/useLearnWorldsCursos';
import useLearnWorldsMatriculas from './learnworlds/useLearnWorldsMatriculas';

/**
 * Hook para interagir com a API do LearnWorlds através das funções edge do Supabase
 * Este hook combina a funcionalidade de vários hooks especializados
 */
const useLearnWorldsApi = () => {
  // Estado local para gerenciar erros e modo offline de forma consistente
  const [internalError, setInternalError] = useState<string | null>(null);
  const [internalOfflineMode, setInternalOfflineMode] = useState<boolean>(false);

  // Utilizamos os hooks especializados
  const alunosApi = useLearnWorldsAlunos();
  const cursosApi = useLearnWorldsCursos();
  const matriculasApi = useLearnWorldsMatriculas();

  // Combinamos o status de carregamento
  const loading = alunosApi.loading || cursosApi.loading || matriculasApi.loading;
  
  // Verificamos o status de modo offline de todos os hooks e atualizamos o estado interno
  useEffect(() => {
    const anyOffline = alunosApi.offlineMode || cursosApi.offlineMode || matriculasApi.offlineMode;
    if (anyOffline !== internalOfflineMode) {
      setInternalOfflineMode(anyOffline);
    }
  }, [alunosApi.offlineMode, cursosApi.offlineMode, matriculasApi.offlineMode, internalOfflineMode]);

  // Atualizamos o estado de erro dentro de um useEffect para evitar atualizações durante a renderização
  useEffect(() => {
    const newError = alunosApi.error || cursosApi.error || matriculasApi.error;
    if (newError !== internalError) {
      setInternalError(newError);
    }
  }, [alunosApi.error, cursosApi.error, matriculasApi.error, internalError]);

  // Retornamos todas as funções e estados dos hooks especializados
  return {
    loading,
    error: internalError,
    offlineMode: internalOfflineMode,
    
    // Funções de alunos
    getUsers: alunosApi.getUsers,
    cadastrarAluno: alunosApi.cadastrarAluno,
    sincronizarAlunos: alunosApi.sincronizarAlunos,
    
    // Funções de cursos
    getCourses: cursosApi.getCourses,
    getCourseDetails: cursosApi.getCourseDetails,
    getAllCourses: cursosApi.getAllCourses,
    sincronizarCursos: cursosApi.sincronizarCursos,
    
    // Funções de matrículas
    matricularAlunoEmCurso: matriculasApi.matricularAlunoEmCurso
  };
};

export default useLearnWorldsApi;
export type { AlunoParams };
