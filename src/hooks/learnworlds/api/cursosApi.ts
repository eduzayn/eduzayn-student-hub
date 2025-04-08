
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
        endpoint += `&q=${encodeURIComponent(searchTerm)}`;
      }
      
      if (categories) {
        endpoint += `&categories=${encodeURIComponent(categories)}`;
      }
      
      // Usar token público para esta operação - garantindo que usamos o token atualizado
      const response = await makePublicRequest(endpoint);
      console.log("Resposta de cursos do LearnWorlds:", response);
      
      // Verificar se temos uma resposta válida
      if (response && 
          ((response.data && Array.isArray(response.data)) || 
           (response.text && response.text.includes("<!DOCTYPE html>")))) {
        
        // Se for HTML, ativar modo offline
        if (response.text && response.text.includes("<!DOCTYPE html>")) {
          console.warn("Recebida resposta HTML, ativando modo offline");
          setOfflineMode(true);
          return getDadosSimulados(page, limit, searchTerm);
        }
        
        return response;
      } else {
        console.error("Resposta inválida da API de cursos:", response);
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
      
      if (!response || response.error || (response.text && response.text.includes("<!DOCTYPE html>"))) {
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
