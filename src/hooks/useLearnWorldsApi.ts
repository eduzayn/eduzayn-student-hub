
import { useState, useEffect } from 'react';
import useLearnWorldsAlunos, { AlunoParams } from './learnworlds/useLearnWorldsAlunos';
import useLearnWorldsCursos from './learnworlds/useLearnWorldsCursos';
import useLearnWorldsMatriculas from './learnworlds/useLearnWorldsMatriculas';

/**
 * Hook para interagir com a API do LearnWorlds através das funções edge do Supabase
 * Este hook combina a funcionalidade de vários hooks especializados
 */
const useLearnWorldsApi = () => {
  // Utilizamos os hooks especializados
  const alunosApi = useLearnWorldsAlunos();
  const cursosApi = useLearnWorldsCursos();
  const matriculasApi = useLearnWorldsMatriculas();

  // Combinamos o status de carregamento e erro de todos os hooks
  const loading = alunosApi.loading || cursosApi.loading || matriculasApi.loading;
  const [error, setError] = useState<string | null>(null);
  const offlineMode = alunosApi.offlineMode || cursosApi.offlineMode || matriculasApi.offlineMode;

  // Atualizamos o estado de erro dentro de um useEffect para evitar atualizações durante a renderização
  useEffect(() => {
    if (alunosApi.error || cursosApi.error || matriculasApi.error) {
      setError(alunosApi.error || cursosApi.error || matriculasApi.error);
    } else {
      // Limpar o erro se nenhum dos hooks tem erro
      setError(null);
    }
  }, [alunosApi.error, cursosApi.error, matriculasApi.error]);

  // Retornamos todas as funções e estados dos hooks especializados
  return {
    loading,
    error,
    offlineMode,
    
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
