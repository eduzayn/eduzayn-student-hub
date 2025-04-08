
import useLearnWorldsBase from './useLearnWorldsBase';
import { toast } from 'sonner';

/**
 * Hook para gerenciar cursos no LearnWorlds
 */
const useLearnWorldsCursos = () => {
  const { makeRequest, makePublicRequest, loading, error, offlineMode } = useLearnWorldsBase();

  /**
   * Busca cursos da API LearnWorlds conforme documentação
   * https://api.learnworlds.com/v2/courses
   * 
   * @param page Número da página (padrão: 1)
   * @param limit Limite de cursos por página (padrão: 50)
   * @param options Opções adicionais de filtro (access, categories)
   */
  const getCourses = async (page: number = 1, limit: number = 50, searchTerm: string = '', options: any = {}): Promise<any> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      // Adiciona termo de busca se fornecido (não é um parâmetro padrão da API, mas mantemos por compatibilidade)
      if (searchTerm) {
        queryParams.append('q', searchTerm);
      }

      // Adiciona filtro de acesso se fornecido
      if (options.access) {
        // Pode ser uma string única ou um array
        if (Array.isArray(options.access)) {
          queryParams.append('access', options.access.join(','));
        } else {
          queryParams.append('access', options.access);
        }
      }

      // Adiciona filtro de categorias se fornecido
      if (options.categories) {
        queryParams.append('categories', options.categories);
      }

      // Para diagnóstico
      console.log(`Buscando cursos LearnWorlds: página ${page}, limite ${limit}, parâmetros: ${queryParams.toString()}`);

      // Usando token público para leitura de cursos
      const response = await makePublicRequest(`learnworlds-api/courses?${queryParams}`);
      console.log("Resposta da API de cursos:", response);

      // Verificação específica para erro de client_id
      if (response && response.error && typeof response.error === 'string' && response.error.includes('client_id')) {
        console.error('Erro de configuração da API: client_id ausente ou inválido');
        toast.error("Erro de configuração da API LearnWorlds", {
          description: "ID de cliente ausente ou inválido. Verifique as configurações."
        });
        return { data: [], total: 0, pages: 1 };
      }

      // Verifica se a resposta está no formato esperado
      if (!response || !response.data || !Array.isArray(response.data)) {
        console.error("Formato de resposta inválido da API de cursos:", response);
        toast.error("Formato de resposta inválido da API LearnWorlds");
        return { data: [], total: 0, pages: 1 };
      }

      return {
        data: response.data,
        total: response.meta?.totalItems || response.data.length,
        pages: response.meta?.totalPages || 1
      };
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      
      // Verificar se é um erro relacionado ao client_id
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      if (typeof errorMessage === 'string' && errorMessage.includes('client_id')) {
        toast.error("Erro de configuração da API", {
          description: "ID de cliente LearnWorlds ausente ou inválido"
        });
      } else {
        toast.error("Falha ao buscar cursos", {
          description: errorMessage
        });
      }
      
      return { data: [], total: 0, pages: 1 };
    }
  };

  /**
   * Busca detalhes de um curso específico
   * Usa o token público para operações de leitura
   */
  const getCourseDetails = async (courseId: string): Promise<any> => {
    try {
      console.log(`Buscando detalhes do curso: ${courseId}`);
      const response = await makePublicRequest(`learnworlds-api/courses/${courseId}`);
      console.log(`Detalhes do curso ${courseId} recebidos:`, response);
      return response;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do curso ${courseId}:`, error);
      toast.error(`Erro ao carregar detalhes do curso`, {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
      return null;
    }
  };

  /**
   * Busca todos os cursos disponíveis
   * Suporta paginação automática para obter todos os cursos
   */
  const getAllCourses = async (page: number = 1, limit: number = 50, buscaTodos: boolean = false): Promise<any> => {
    try {
      console.log(`Iniciando busca de cursos. Página: ${page}, Limite: ${limit}, BuscarTodos: ${buscaTodos}`);
      const resultado = await getCourses(page, limit);
      
      if (!resultado || !resultado.data) {
        console.error("Resultado da busca de cursos inválido:", resultado);
        return [];
      }
      
      let cursos = [...resultado.data];
      
      // Se buscarTodos for verdadeiro e houver mais páginas, busca todas recursivamente
      if (buscaTodos && resultado.pages > 1 && page < resultado.pages) {
        console.log(`Buscando página ${page+1} de ${resultado.pages}`);
        const proximosCursos = await getAllCourses(page + 1, limit, true);
        if (Array.isArray(proximosCursos)) {
          cursos = [...cursos, ...proximosCursos];
        }
      }
      
      return cursos;
    } catch (error) {
      console.error('Erro ao buscar todos os cursos:', error);
      toast.error("Falha ao carregar lista completa de cursos");
      return [];
    }
  };

  /**
   * Inicia sincronização de cursos com LearnWorlds
   * Usa autenticação OAuth para operações administrativas
   */
  const sincronizarCursos = async (sincronizarTodos: boolean = false): Promise<any> => {
    try {
      console.log(`Iniciando sincronização de cursos. sincronizarTodos=${sincronizarTodos}`);
      
      toast.info(
        sincronizarTodos ? "Iniciando sincronização completa de cursos..." : "Iniciando sincronização incremental de cursos...",
        { description: "Este processo pode levar alguns instantes." }
      );
      
      // Usamos o endpoint correto para sincronização de cursos com autenticação OAuth
      const result = await makeRequest(`learnworlds-courses-sync?syncAll=${sincronizarTodos}`);
      
      console.log("Resultado da sincronização:", result);
      
      // Verificamos se há erros específicos nos logs
      if (result && result.logs) {
        // Verificar erros relacionados à autenticação OAuth
        const oauthError = result.logs.find((log: string) => 
          log.includes("OAuth") && log.includes("Erro")
        );
        
        if (oauthError) {
          console.error("Erro de autenticação OAuth detectado:", oauthError);
          toast.error('Erro de autenticação OAuth', {
            description: "Falha na autenticação OAuth. Verifique as credenciais CLIENT_ID e CLIENT_SECRET."
          });
        }
      }
      
      // Notificações com base no resultado
      if (result) {
        if (result.imported > 0 || result.updated > 0) {
          toast.success(
            "Sincronização concluída com sucesso!", 
            { description: `${result.imported} novos cursos e ${result.updated} atualizados.` }
          );
        } else if (result.failed > 0) {
          toast.error(
            "Problemas na sincronização", 
            { description: `${result.failed} cursos não puderam ser sincronizados.` }
          );
        } else if (result.total === 0) {
          toast.info("Nenhum curso encontrado para sincronização.");
        } else {
          toast.info("Sincronização concluída sem alterações.");
        }
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao sincronizar cursos:', error);
      
      // Verificar se é um erro relacionado à autenticação OAuth
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      if (typeof errorMessage === 'string' && errorMessage.includes('OAuth')) {
        toast.error('Erro de autenticação OAuth', {
          description: "Falha na autenticação OAuth. Verifique as credenciais CLIENT_ID e CLIENT_SECRET."
        });
      } else if (typeof errorMessage === 'string' && errorMessage.includes('client_id')) {
        toast.error('Erro de configuração da API LearnWorlds', {
          description: "ID de cliente ausente ou inválido nas configurações."
        });
      } else {
        toast.error('Erro ao sincronizar cursos com o LearnWorlds', {
          description: errorMessage
        });
      }
      
      throw error;
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
