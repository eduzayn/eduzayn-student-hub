
import useLearnWorldsBase from './useLearnWorldsBase';
import { toast } from 'sonner';

export interface AlunoParams {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  customField1?: string; // CPF
  cpf?: string; // Adicionamos este campo para compatibilidade
}

/**
 * Hook para gerenciar alunos no LearnWorlds
 */
const useLearnWorldsAlunos = () => {
  const { makeRequest, makePublicRequest, loading, error, offlineMode } = useLearnWorldsBase();

  /**
   * Busca usuários (alunos) da API LearnWorlds
   * @param page Número da página (padrão: 1)
   * @param limit Limite de registros por página (padrão: 50)
   * @param query Termo de busca opcional
   */
  const getUsers = async (page: number = 1, limit: number = 50, query?: string): Promise<any> => {
    try {
      let url = `learnworlds-api/users?page=${page}&limit=${limit}`;
      
      // Adiciona o parâmetro de busca se fornecido
      if (query) {
        url += `&query=${encodeURIComponent(query)}`;
      }
      
      const response = await makePublicRequest(url);
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return { data: [] };
    }
  };

  /**
   * Cadastra um novo aluno no LearnWorlds
   */
  const cadastrarAluno = async (params: AlunoParams): Promise<any> => {
    try {
      // Se for fornecido o campo cpf, transfere para customField1
      if (params.cpf && !params.customField1) {
        params.customField1 = params.cpf;
      }
      
      const response = await makeRequest('learnworlds-api/users', 'POST', params);
      return response;
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      throw error;
    }
  };

  /**
   * Sincroniza alunos do LearnWorlds com o banco de dados local
   */
  const sincronizarAlunos = async (sincronizarTodos: boolean = false): Promise<any> => {
    try {
      toast.info(
        sincronizarTodos ? "Iniciando sincronização completa de alunos..." : "Iniciando sincronização de alunos...", 
        { description: "Este processo pode demorar alguns instantes." }
      );
      
      // Usar a função unificada com parâmetro type=users
      const result = await makeRequest(`learnworlds-sync?syncAll=${sincronizarTodos}&type=users`);
      
      // Retorna o resultado da sincronização
      if (result.imported > 0 || result.updated > 0) {
        toast.success(
          "Sincronização concluída com sucesso!", 
          { description: `${result.imported} novos alunos e ${result.updated} atualizados.` }
        );
      } else {
        toast.info("Nenhuma alteração foi necessária.");
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao sincronizar alunos:', error);
      toast.error('Erro ao sincronizar alunos com o LearnWorlds', {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
      throw error;
    }
  };

  return {
    loading,
    error,
    offlineMode,
    getUsers,
    cadastrarAluno,
    sincronizarAlunos
  };
};

export default useLearnWorldsAlunos;
