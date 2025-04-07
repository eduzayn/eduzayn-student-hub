
import useLearnWorldsBase from './useLearnWorldsBase';

/**
 * Hook para gerenciar matrículas no LearnWorlds
 */
const useLearnWorldsMatriculas = () => {
  const { makeRequest, loading, error, offlineMode } = useLearnWorldsBase();

  /**
   * Matricula um aluno em um curso específico
   */
  const matricularAlunoEmCurso = async (alunoId: string, cursoId: string): Promise<any> => {
    try {
      const result = await makeRequest(`learnworlds-api/users/${alunoId}/courses/${cursoId}`, 'POST');
      return result;
    } catch (error) {
      console.error(`Erro ao matricular aluno ${alunoId} no curso ${cursoId}:`, error);
      return null;
    }
  };

  return {
    loading,
    error,
    offlineMode,
    matricularAlunoEmCurso
  };
};

export default useLearnWorldsMatriculas;
