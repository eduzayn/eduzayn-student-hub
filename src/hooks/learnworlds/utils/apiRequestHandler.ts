
import { CoursesResponse } from '../types/cursoTypes';
import { getDadosSimulados } from './mockCursosData';
import { processApiResponse } from './apiResponseHandler';

/**
 * Utilitário para lidar com requisições de API
 */
export const handleCourseRequest = async (
  endpoint: string,
  makePublicRequest: any,
  setOfflineMode: any,
  page: number,
  limit: number,
  searchTerm: string
): Promise<CoursesResponse> => {
  console.log(`Fazendo requisição para endpoint: ${endpoint}`);
  
  try {
    const response = await makePublicRequest(endpoint);
    console.log("Resposta de cursos do LearnWorlds:", response);
    
    // Processar e adaptar resposta usando o adaptador
    const processedResponse = processApiResponse(response, setOfflineMode);
    return processedResponse;
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    setOfflineMode(true);
    // Garantir que dados simulados também sigam o formato correto
    return processApiResponse(getDadosSimulados(page, limit, searchTerm), setOfflineMode);
  }
};
