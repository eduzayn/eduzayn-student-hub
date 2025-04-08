
import { CoursesResponse, Course, SincronizacaoResult } from '../types/cursoTypes';
import { getDadosSimulados, getDetalhesCursoSimulado } from '../utils/mockCursosData';

/**
 * Funções de API relacionadas a cursos do LearnWorlds
 */
export const cursosApi = (makeRequest: any, makePublicRequest: any, setOfflineMode: any) => {
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
    
    try {
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
      console.log(`Fazendo requisição para endpoint: ${endpoint}`);
      const response = await makePublicRequest(endpoint);
      console.log("Resposta de cursos do LearnWorlds:", response);
      
      // Verificar se temos uma resposta válida
      if (!response) {
        console.error("Resposta nula da API de cursos");
        setOfflineMode(true);
        return getDadosSimulados(page, limit, searchTerm);
      }
      
      // Verificar se recebemos HTML (erro comum)
      if (response.text && typeof response.text === 'string' && 
          (response.text.includes("<!DOCTYPE html>") || response.text.includes("<html"))) {
        console.warn("Recebida resposta HTML, ativando modo offline");
        setOfflineMode(true);
        return getDadosSimulados(page, limit, searchTerm);
      }
      
      // Verificar se temos dados no formato esperado
      if (response.data !== undefined && Array.isArray(response.data) && response.data.length > 0) {
        // CORREÇÃO: Verificar se os dados são válidos antes de usar
        console.log("Usando dados reais de cursos da API LearnWorlds");
        setOfflineMode(false);
        return response;
      } else {
        console.error("Formato de resposta inválido ou sem dados da API de cursos:", response);
        setOfflineMode(true);
        return getDadosSimulados(page, limit, searchTerm);
      }
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      setOfflineMode(true);
      return getDadosSimulados(page, limit, searchTerm);
    }
  };
  
  /**
   * Busca detalhes de um curso específico por ID
   */
  const getCourseDetails = async (courseId: string): Promise<any> => {
    try {
      const response = await makePublicRequest(`learnworlds-api/courses/${courseId}`);
      
      // Verificar se recebemos HTML (erro comum)
      if (!response || response.error || 
          (response.text && typeof response.text === 'string' && 
           (response.text.includes("<!DOCTYPE html>") || response.text.includes("<html")))) {
        setOfflineMode(true);
        return getDetalhesCursoSimulado(courseId);
      }
      
      return response;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do curso ${courseId}:`, error);
      setOfflineMode(true);
      return getDetalhesCursoSimulado(courseId);
    }
  };
  
  /**
   * Sincroniza cursos do LearnWorlds com o banco de dados local
   */
  const sincronizarCursos = async (todos: boolean = false): Promise<SincronizacaoResult> => {
    try {
      // Esta função requer token de administrador
      const response = await makeRequest(`learnworlds-sync?type=courses&syncAll=${todos}`, "POST");
      
      if (!response || response.error) {
        throw new Error(response?.message || "Erro na sincronização de cursos");
      }
      
      return {
        success: true,
        message: "Cursos sincronizados com sucesso",
        imported: response.imported || 0,
        updated: response.updated || 0,
        failed: response.failed || 0,
        total: response.total || 0,
        logs: response.logs || [],
        syncedItems: response.imported + response.updated || 0
      };
    } catch (error: any) {
      console.error("Erro ao sincronizar cursos:", error);
      
      return {
        success: false,
        message: error.message || "Erro ao sincronizar cursos",
        imported: 0,
        updated: 0,
        failed: 0,
        total: 0,
        logs: [error.message || "Erro desconhecido"]
      };
    }
  };

  return {
    getCourses,
    getCourseDetails,
    sincronizarCursos
  };
};
