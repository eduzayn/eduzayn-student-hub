
import { getDetalhesCursoSimulado } from '../utils/mockCursosData';

/**
 * Serviço para buscar detalhes de cursos
 */
export const courseDetailsService = (makePublicRequest: any, setOfflineMode: any) => {
  /**
   * Busca detalhes de um curso específico por ID
   */
  const getCourseDetails = async (courseId: string): Promise<any> => {
    try {
      console.log(`Buscando detalhes do curso ID: ${courseId}`);
      const response = await makePublicRequest(`learnworlds-api/courses/${courseId}`);
      
      // Verificar se recebemos HTML (erro comum)
      if (!response || response.error || 
          (response.text && typeof response.text === 'string' && 
           (response.text.includes("<!DOCTYPE html>") || response.text.includes("<html")))) {
        setOfflineMode(true);
        return getDetalhesCursoSimulado(courseId);
      }
      
      console.log(`Detalhes recebidos para curso ${courseId}:`, response);
      
      // Adicionar flag de API OAuth
      return { ...response, api_oauth: true };
    } catch (error) {
      console.error(`Erro ao buscar detalhes do curso ${courseId}:`, error);
      setOfflineMode(true);
      return getDetalhesCursoSimulado(courseId);
    }
  };

  return { getCourseDetails };
};
