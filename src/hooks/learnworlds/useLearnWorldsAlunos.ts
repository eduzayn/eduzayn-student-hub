
import { useState, useCallback } from "react";
import useLearnWorldsBase from "./useLearnWorldsBase";

interface CadastrarAlunoDTO {
  firstName: string;
  lastName: string;
  email: string;
  cpf?: string;
  phoneNumber?: string;
}

interface AlunoDTO {
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

  return {
    getUsers,
    cadastrarAluno,
    dadosListagem,
    loading,
    error,
    offlineMode,
    setOfflineMode
  };
};

export default useLearnWorldsAlunos;
