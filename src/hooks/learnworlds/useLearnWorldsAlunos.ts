
import { useState, useCallback, Dispatch, SetStateAction } from "react";
import useLearnWorldsBase from "./useLearnWorldsBase";

export interface CadastrarAlunoDTO {
  firstName: string;
  lastName: string;
  email: string;
  cpf?: string;
  phoneNumber?: string;
}

export interface AlunoDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  customField1?: string; // CPF
  phoneNumber?: string;
  registrationDate: string;
  lastLoginDate?: string;
  coursesList?: string[];
}

// Interface AlunoParams para uso externo
export interface AlunoParams {
  id?: string;
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  learnworlds_id?: string;
}

const useLearnWorldsAlunos = () => {
  const { loading, error, offlineMode, setOfflineMode, makeRequest, makePublicRequest } = useLearnWorldsBase();
  const [dadosListagem, setDadosListagem] = useState<{ total: number; data: AlunoDTO[] }>({ 
    total: 0, 
    data: [] 
  });

  /**
   * Obtém a lista de usuários/alunos do LearnWorlds
   */
  const getUsers = useCallback(async (page = 1, limit = 10, query = ""): Promise<{ total: number; data: AlunoDTO[] }> => {
    try {
      const endpoint = `learnworlds-api/users?page=${page}&limit=${limit}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
      
      const response = await makeRequest(endpoint, 'GET');
      
      if (response && response.data) {
        setDadosListagem({
          total: response.total || response.data.length,
          data: response.data
        });
        return {
          total: response.total || response.data.length,
          data: response.data
        };
      }
      
      return { total: 0, data: [] };
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }, [makeRequest]);

  /**
   * Cadastra um novo aluno no LearnWorlds
   */
  const cadastrarAluno = useCallback(async (dados: CadastrarAlunoDTO): Promise<AlunoDTO | null> => {
    try {
      console.log("Tentando cadastrar aluno:", dados);
      
      const response = await makeRequest('learnworlds-api/users', 'POST', dados);
      
      if (response && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      throw error;
    }
  }, [makeRequest]);

  /**
   * Sincroniza alunos do LearnWorlds com o sistema
   * @param todos Se verdadeiro, sincroniza todos os alunos. Caso contrário, apenas os novos ou modificados.
   */
  const sincronizarAlunos = useCallback(async (todos: boolean = false): Promise<any> => {
    try {
      console.log(`Iniciando sincronização de alunos. Sincronizar todos: ${todos}`);
      
      // Parâmetros para a função de sincronização
      const params = todos ? { completa: true } : {};
      
      const endpoint = `learnworlds-api/admin/sync/alunos`;
      const response = await makeRequest(endpoint, 'POST', params);
      
      console.log("Resposta da sincronização:", response);
      
      return response;
    } catch (error) {
      console.error("Erro na sincronização de alunos:", error);
      throw error;
    }
  }, [makeRequest]);

  return {
    getUsers,
    cadastrarAluno,
    sincronizarAlunos,
    dadosListagem,
    loading,
    error,
    offlineMode,
    setOfflineMode
  };
};

export default useLearnWorldsAlunos;
