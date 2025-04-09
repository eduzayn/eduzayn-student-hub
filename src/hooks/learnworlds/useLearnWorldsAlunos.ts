
import { useState, useCallback } from "react";
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
  firstName?: string;
  lastName?: string;
  email: string;
  customField1?: string; // CPF
  phoneNumber?: string;
  registrationDate?: string;
  lastLoginDate?: string;
  coursesList?: string[];
  text?: string; // Adicionado para suportar respostas em formato não-JSON
  simulatedResponse?: boolean; // Adicionado para identificar respostas simuladas
  
  // Campos específicos da API v2
  username?: string;
  created?: number;
  last_login?: number;
  is_admin?: boolean;
  is_instructor?: boolean;
  is_suspended?: boolean;
  fields?: Record<string, any>;
  tags?: string[];
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
  const { 
    makeRequest, 
    makePublicRequest, 
    loading, 
    error, 
    offlineMode, 
    setOfflineMode 
  } = useLearnWorldsBase();
  
  const [dadosListagem, setDadosListagem] = useState<{ total: number; data: AlunoDTO[] }>({ 
    total: 0, 
    data: [] 
  });

  /**
   * Obtém a lista de usuários/alunos do LearnWorlds
   * Importante: Este endpoint requer autenticação OAuth
   */
  const getUsers = useCallback(async (page = 1, limit = 20, query = ""): Promise<{ total: number; data: AlunoDTO[] }> => {
    try {
      console.log("Buscando usuários com autenticação OAuth...");
      
      // Construir endpoint com parâmetros adaptados para a API v2
      let endpoint = `users?page=${page}&items_per_page=${limit}`;
      
      // Se há termo de busca, consideramos que pode ser email ou nome
      if (query) {
        if (query.includes("@")) {
          endpoint += `&email=${encodeURIComponent(query)}`;
        } else if (query.startsWith("id:")) {
          // Busca por ID específico
          const userId = query.substring(3);
          endpoint = `users/${userId}`;
        } else {
          // Busca por nome ou outra informação
          endpoint += `&search=${encodeURIComponent(query)}`;
        }
      }
      
      console.log("Endpoint de busca de usuários:", endpoint);
      
      const response = await makeRequest(endpoint, 'GET', null, true);
      
      if (response) {
        console.log("Resposta da API:", response);
        
        // Verificar se é uma resposta única (busca por ID) ou lista
        let formattedData = [];
        let total = 0;
        
        if (Array.isArray(response.data)) {
          // Listagem de usuários com paginação
          formattedData = response.data.map((user: any) => ({
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.fields?.first_name || user.fields?.firstName || "",
            lastName: user.fields?.last_name || user.fields?.lastName || "",
            created: user.created,
            last_login: user.last_login,
            is_admin: user.is_admin,
            is_instructor: user.is_instructor,
            is_suspended: user.is_suspended,
            fields: user.fields,
            tags: user.tags || []
          }));
          total = response.total || response.meta?.totalItems || formattedData.length;
        } else if (response.id) {
          // Resposta individual (usuário único)
          formattedData = [{
            id: response.id,
            email: response.email,
            username: response.username,
            firstName: response.fields?.first_name || response.fields?.firstName || "",
            lastName: response.fields?.last_name || response.fields?.lastName || "",
            created: response.created,
            last_login: response.last_login,
            is_admin: response.is_admin,
            is_instructor: response.is_instructor,
            is_suspended: response.is_suspended,
            fields: response.fields,
            tags: response.tags || []
          }];
          total = 1;
        }
        
        console.log("Dados formatados:", formattedData);
        setDadosListagem({
          total,
          data: formattedData
        });
        
        return {
          total,
          data: formattedData
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
   * Importante: Este endpoint requer autenticação OAuth
   */
  const cadastrarAluno = useCallback(async (dados: CadastrarAlunoDTO): Promise<AlunoDTO | null> => {
    try {
      console.log("Tentando cadastrar aluno via OAuth:", dados);
      
      // Adaptar dados para o formato esperado pela API v2
      const dadosAPI = {
        email: dados.email,
        fields: {
          first_name: dados.firstName,
          last_name: dados.lastName,
          cpf: dados.cpf,
          phone_number: dados.phoneNumber
        }
      };
      
      const response = await makeRequest('users', 'POST', dadosAPI, true);
      
      if (response) {
        console.log("Aluno cadastrado com sucesso via OAuth:", response);
        return {
          id: response.id,
          email: response.email,
          firstName: dados.firstName,
          lastName: dados.lastName,
          customField1: dados.cpf,
          phoneNumber: dados.phoneNumber
        };
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
   * Importante: Este endpoint requer autenticação OAuth
   */
  const sincronizarAlunos = useCallback(async (todos: boolean = false): Promise<any> => {
    try {
      console.log(`Iniciando sincronização de alunos via OAuth. Sincronizar todos: ${todos}`);
      
      // Parâmetros para a função de sincronização
      const params = todos ? { completa: true } : {};
      
      // Endpoint corrigido - removendo duplicação
      const endpoint = `admin/sync/alunos`;
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
