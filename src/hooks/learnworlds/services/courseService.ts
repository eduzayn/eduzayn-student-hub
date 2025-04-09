
import { CoursesResponse } from '../types/cursoTypes';
import { handleCourseRequest } from '../utils/apiRequestHandler';

/**
 * Serviço para operações com cursos
 */
export const courseService = (makePublicRequest: any, setOfflineMode: any) => {
  /**
   * Busca cursos do LearnWorlds com paginação
   */
  const getCourses = async (
    page = 1, 
    limit = 20, 
    searchTerm = "", 
    categories = ""
  ): Promise<CoursesResponse> => {
    console.log(`Buscando cursos LearnWorlds: página ${page}, limite ${limit}, parâmetros: page=${page}&limit=${limit}`);
    
    // Construir endpoint com parâmetros de consulta
    let endpoint = `learnworlds-api/courses?page=${page}&limit=${limit}`;
    
    if (searchTerm) {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      endpoint += `&q=${encodedSearchTerm}`;
      console.log(`Termo de busca codificado: '${encodedSearchTerm}'`);
    }
    
    if (categories) {
      endpoint += `&categories=${encodeURIComponent(categories)}`;
    }
    
    // Usar token público para esta operação - garantindo que usamos o token atualizado
    return handleCourseRequest(endpoint, makePublicRequest, setOfflineMode, page, limit, searchTerm);
  };

  return { getCourses };
};
