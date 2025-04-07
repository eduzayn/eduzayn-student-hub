
import useLearnWorldsBase from './useLearnWorldsBase';
import { toast } from 'sonner';

/**
 * Hook para gerenciar cursos no LearnWorlds
 */
const useLearnWorldsCursos = () => {
  const { makeRequest, loading, error, offlineMode } = useLearnWorldsBase();

  /**
   * Busca cursos da API LearnWorlds
   */
  const getCourses = async (page: number = 1, limit: number = 20, searchTerm: string = ''): Promise<any> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (searchTerm) {
        queryParams.append('q', searchTerm);
      }

      return await makeRequest(`learnworlds-api/courses?${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      return null;
    }
  };

  /**
   * Busca detalhes de um curso específico
   */
  const getCourseDetails = async (courseId: string): Promise<any> => {
    try {
      return await makeRequest(`learnworlds-api/courses/${courseId}`);
    } catch (error) {
      console.error(`Erro ao buscar detalhes do curso ${courseId}:`, error);
      return null;
    }
  };

  /**
   * Busca todos os cursos disponíveis
   */
  const getAllCourses = async (page: number = 1, limit: number = 100): Promise<any> => {
    try {
      const courses = await getCourses(page, limit);
      return courses?.data || [];
    } catch (error) {
      console.error('Erro ao buscar todos os cursos:', error);
      return [];
    }
  };

  /**
   * Inicia sincronização de cursos com LearnWorlds
   */
  const sincronizarCursos = async (sincronizarTodos: boolean = false): Promise<any> => {
    try {
      // Usamos o endpoint correto para sincronização de cursos: learnworlds-courses-sync
      const result = await makeRequest(`learnworlds-courses-sync?syncAll=${sincronizarTodos}`);
      
      if (result.imported > 0 || result.updated > 0) {
        toast.success(
          `Sincronização concluída com sucesso!`, 
          { description: `${result.imported} novos cursos importados e ${result.updated} atualizados.` }
        );
      } else {
        toast.info('Nenhuma alteração foi necessária.');
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao sincronizar cursos:', error);
      toast.error('Erro ao sincronizar cursos com o LearnWorlds');
      return null;
    }
  };

  return {
    loading,
    error,
    offlineMode,
    getCourses,
    getCourseDetails,
    getAllCourses,
    sincronizarCursos
  };
};

export default useLearnWorldsCursos;
