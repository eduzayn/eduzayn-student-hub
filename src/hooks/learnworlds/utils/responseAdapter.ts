
import { CoursesResponse } from '../types/cursoTypes';

/**
 * Adapta o formato da resposta da API para o formato esperado
 */
export const adaptApiResponse = (response: any): CoursesResponse => {
  if (!response || !response.data) {
    return { 
      data: [],
      meta: {
        total: 0,
        pages: 1,
        currentPage: 1
      },
      success: false
    };
  }
  
  // Mapear os dados para o formato esperado
  const formattedData = Array.isArray(response.data) 
    ? response.data.map((curso: any) => {
        const { simulado, ...restoCurso } = curso;
        return { 
          ...restoCurso,
          api_oauth: true 
        };
      })
    : [];
  
  // Adaptar metadados para o formato esperado de CoursesResponse
  const responseMeta = response.meta || {};
  
  // Mapear diretamente os campos para o formato esperado
  // Se tiver o formato da API LearnWorlds (page, totalItems, etc.) adapta para o formato interno
  const meta = {
    total: responseMeta.totalItems || responseMeta.total || formattedData.length,
    pages: responseMeta.totalPages || responseMeta.pages || 1,
    currentPage: responseMeta.page || responseMeta.currentPage || 1
  };

  return {
    data: formattedData,
    meta,
    success: true
  };
};
