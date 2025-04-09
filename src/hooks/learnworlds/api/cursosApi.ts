
import { CoursesResponse, Course, SincronizacaoResult } from '../types/cursoTypes';
import { getDadosSimulados, getDetalhesCursoSimulado } from '../utils/mockCursosData';

/**
 * Funções de API relacionadas a cursos do LearnWorlds
 */
export const cursosApi = (makeRequest: any, makePublicRequest: any, setOfflineMode: any) => {
  /**
   * Adapta o formato da resposta da API para o formato esperado
   */
  const adaptApiResponse = (response: any): CoursesResponse => {
    if (!response || !response.data) {
      return { 
        data: [],
        meta: {
          total: 0,
          pages: 1,
          currentPage: 1
        }
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
    
    // Adaptar metadados
    return {
      data: formattedData,
      meta: {
        total: response.meta?.totalItems || formattedData.length,
        pages: response.meta?.totalPages || 1,
        currentPage: response.meta?.page || response.meta?.currentPage || 1
      },
      success: true
    };
  };

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
      
      // DIAGNÓSTICO ADICIONAL: Verificar o formato exato da resposta para debug
      console.log("Tipo da resposta:", typeof response);
      console.log("Estrutura da resposta:", Object.keys(response));
      
      // Verificar resposta e adaptar formato se necessário
      if (response.data !== undefined) {
        if (Array.isArray(response.data)) {
          console.log("Dados recebidos (primeiros 2 itens):", response.data.slice(0, 2));
          
          // Registrar todos os IDs para diagnóstico
          const allIds = response.data.map((c: Course) => c.id).join(", ");
          console.log("Todos os IDs dos cursos:", allIds);
          
          const dataProperties = response.data.some((item: any) => 
            item.id !== undefined || item.title !== undefined);
          
          if (dataProperties) {
            console.log("✅ Usando dados reais de cursos da API OAuth 2.0:", response.data.length, "cursos encontrados");
            setOfflineMode(false);
            
            // Adaptar formato de resposta para o esperado por CoursesResponse
            return adaptApiResponse(response);
          } else {
            console.error("⚠️ Os dados não têm as propriedades esperadas de cursos!");
          }
        } else {
          console.warn("⚠️ API retornou dados em formato não-array:", typeof response.data);
        }
      }
      
      // Se chegamos aqui, não conseguimos interpretar os dados
      console.error("Formato de resposta inválido da API de cursos:", response);
      setOfflineMode(true);
      return getDadosSimulados(page, limit, searchTerm);
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
  
  /**
   * Sincroniza cursos do LearnWorlds com o banco de dados local
   */
  const sincronizarCursos = async (todos: boolean = false): Promise<SincronizacaoResult> => {
    try {
      // Esta função requer token de administrador
      console.log(`Iniciando sincronização de cursos (todos=${todos})`);
      const response = await makeRequest(`learnworlds-sync?type=courses&syncAll=${todos}`, "POST");
      console.log("Resposta da sincronização:", response);
      
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
