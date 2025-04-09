
import { useState, useCallback } from 'react';
import useLearnWorldsBase from './useLearnWorldsBase';
import { Course, CoursesResponse, SincronizacaoResult } from './types/cursoTypes';
import { mockCursosData } from './utils/mockCursosData';

/**
 * Hook para interagir com a API de cursos do LearnWorlds
 */
const useLearnWorldsCursos = () => {
  const { makeRequest, makePublicRequest, loading, error, offlineMode, setOfflineMode } = useLearnWorldsBase();
  
  const [cursos, setCursos] = useState<Course[]>([]);
  const [totalCursos, setTotalCursos] = useState(0);

  /**
   * Busca cursos do LearnWorlds com suporte a paginação e filtros
   */
  const getCourses = useCallback(async (page = 1, limit = 10, searchTerm = '', categories = ''): Promise<CoursesResponse> => {
    try {
      console.log(`Buscando cursos (página ${page}, limite ${limit})...`);
      
      // Construir parâmetros de consulta
      let queryParams = `?page=${page}&limit=${limit}`;
      if (searchTerm) queryParams += `&search=${encodeURIComponent(searchTerm)}`;
      if (categories) queryParams += `&categories=${encodeURIComponent(categories)}`;
      
      // Endpoint corrigido - removendo duplicação
      const response = await makeRequest(`courses${queryParams}`, 'GET');
      
      if (response && response.data) {
        console.log(`Cursos carregados: ${response.data.length} itens`);
        setCursos(response.data);
        setTotalCursos(response.total || response.data.length);
        
        return {
          data: response.data,
          meta: response.meta || {
            currentPage: page,
            totalPages: Math.ceil((response.total || response.data.length) / limit),
            totalItems: response.total || response.data.length,
            itemsPerPage: limit
          },
          total: response.total || response.data.length,
          success: true
        };
      }
      
      return {
        data: [],
        meta: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit
        },
        total: 0,
        success: false
      };
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      
      if (offlineMode) {
        console.log("Usando dados mockados devido ao modo offline");
        const mockData = mockCursosData.cursos.slice(0, limit);
        return {
          data: mockData,
          meta: {
            currentPage: page,
            totalPages: 1,
            totalItems: mockData.length,
            itemsPerPage: limit
          },
          total: mockData.length,
          success: true
        };
      }
      
      throw error;
    }
  }, [makeRequest, offlineMode]);

  /**
   * Obtém detalhes de um curso específico pelo ID
   */
  const getCourseDetails = useCallback(async (courseId: string): Promise<Course> => {
    try {
      console.log(`Buscando detalhes do curso ${courseId}...`);
      
      // Endpoint corrigido - removendo duplicação
      const response = await makeRequest(`courses/${courseId}`, 'GET');
      
      if (response) {
        console.log("Detalhes do curso carregados");
        return response;
      }
      
      throw new Error("Curso não encontrado");
    } catch (error) {
      console.error(`Erro ao buscar detalhes do curso ${courseId}:`, error);
      
      if (offlineMode) {
        console.log("Usando dados mockados devido ao modo offline");
        const mockCourse = mockCursosData.cursos.find(c => c.id === courseId);
        if (mockCourse) return mockCourse;
      }
      
      throw error;
    }
  }, [makeRequest, offlineMode]);

  /**
   * Obtém todos os cursos disponíveis, lidando com paginação automaticamente
   */
  const getAllCourses = useCallback(async (): Promise<Course[]> => {
    try {
      console.log("Buscando todos os cursos...");
      
      // Para simplificar, vamos obter a primeira página com um limite maior
      const response = await getCourses(1, 100); // Assumindo que não teremos mais de 100 cursos
      
      if (response && response.data) {
        console.log(`Todos os cursos carregados: ${response.data.length} itens`);
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error("Erro ao buscar todos os cursos:", error);
      
      if (offlineMode) {
        console.log("Usando dados mockados devido ao modo offline");
        return mockCursosData.cursos;
      }
      
      throw error;
    }
  }, [getCourses, offlineMode]);

  /**
   * Sincroniza cursos do LearnWorlds com o sistema local
   */
  const sincronizarCursos = useCallback(async (todos: boolean = false): Promise<SincronizacaoResult> => {
    try {
      console.log(`Iniciando sincronização de cursos. Sincronizar todos: ${todos}`);
      
      const params = todos ? { completa: true } : {};
      
      // Endpoint corrigido - removendo duplicação
      const response = await makeRequest('admin/sync/cursos', 'POST', params);
      
      console.log("Resposta da sincronização:", response);
      
      return response;
    } catch (error) {
      console.error("Erro na sincronização de cursos:", error);
      
      // Se estamos em modo offline, retornar uma resposta simulada
      if (offlineMode) {
        const mockResult: SincronizacaoResult = {
          success: true,
          message: "Simulação de sincronização em modo offline",
          imported: 5,
          updated: 3,
          failed: 0,
          total: 8,
          logs: ["Simulação em modo offline ativa - nenhum dado foi sincronizado"],
          syncedItems: 8
        };
        return mockResult;
      }
      
      throw error;
    }
  }, [makeRequest, offlineMode]);

  return {
    getCourses,
    getCourseDetails,
    getAllCourses,
    sincronizarCursos,
    cursos,
    totalCursos,
    loading,
    error,
    offlineMode
  };
};

export default useLearnWorldsCursos;
