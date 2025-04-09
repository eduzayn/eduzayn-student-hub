
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
  const meta = response.meta || {};

  return {
    data: formattedData,
    meta: {
      total: meta.totalItems || meta.total || formattedData.length,
      pages: meta.totalPages || meta.pages || 1,
      currentPage: meta.page || meta.currentPage || 1
    },
    success: true
  };
};
