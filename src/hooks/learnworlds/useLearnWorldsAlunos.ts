
import { useState } from 'react';
import useLearnWorldsBase from './useLearnWorldsBase';
import { toast } from 'sonner';

/**
 * Interface para os parâmetros de cadastro de aluno
 */
export interface AlunoParams {
  firstName: string;
  lastName?: string;
  email: string;
  cpf?: string;
  phoneNumber?: string;
  customField1?: string;
  customField2?: string;
}

/**
 * Hook para gerenciar alunos no LearnWorlds
 */
const useLearnWorldsAlunos = () => {
  const { makeRequest, loading, error, offlineMode } = useLearnWorldsBase();

  /**
   * Busca usuários da API LearnWorlds
   */
  const getUsers = async (page: number = 1, limit: number = 20, searchTerm: string = ''): Promise<any> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (searchTerm) {
        queryParams.append('q', searchTerm);
      }

      console.log(`Buscando usuários com parâmetros: page=${page}, limit=${limit}, searchTerm=${searchTerm || 'nenhum'}`);
      const result = await makeRequest(`learnworlds-api/users?${queryParams}`);
      console.log('Resultado da busca de usuários:', result);
      return result;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao buscar usuários. Verifique os logs para mais detalhes.');
      return null;
    }
  };

  /**
   * Cadastra um novo aluno na plataforma LearnWorlds
   */
  const cadastrarAluno = async (alunoData: AlunoParams): Promise<any> => {
    try {
      console.log('Enviando dados para cadastro de aluno:', JSON.stringify(alunoData, null, 2));
      const result = await makeRequest('learnworlds-api/users', 'POST', alunoData);
      console.log('Resultado do cadastro de aluno:', result);
      return result;
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      throw error;
    }
  };

  /**
   * Inicia sincronização de alunos com LearnWorlds
   */
  const sincronizarAlunos = async (sincronizarTodos: boolean = false): Promise<any> => {
    try {
      console.log(`Iniciando sincronização - sincronizarTodos=${sincronizarTodos}`);
      
      // Usamos o endpoint correto para sincronização de alunos: learnworlds-sync
      const url = `learnworlds-sync?syncAll=${sincronizarTodos}`;
      console.log(`Chamando endpoint: ${url}`);
      
      const result = await makeRequest(url);
      console.log("Resposta da sincronização recebida:", result);
      
      // Verifica se a resposta contém os campos esperados
      if (!result || typeof result !== 'object') {
        console.error("Formato de resposta inválido:", result);
        toast.error("Formato de resposta inválido da API de sincronização");
        return null;
      }
      
      if (result.imported > 0 || result.updated > 0) {
        toast.success(
          `Sincronização concluída com sucesso!`, 
          { description: `${result.imported} novos alunos importados e ${result.updated} atualizados.` }
        );
      } else {
        toast.info('Nenhuma alteração foi necessária.');
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao sincronizar alunos:', error);
      
      // Melhor tratamento de erros
      let mensagemErro = "Erro ao sincronizar alunos com o LearnWorlds";
      
      if (error instanceof Error) {
        console.error('Detalhes do erro:', error.message);
        console.error('Stack trace:', error.stack);
        mensagemErro = `Erro na sincronização: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        try {
          console.error('Detalhes do erro:', JSON.stringify(error));
          mensagemErro = "Erro na API de sincronização. Verifique os logs.";
        } catch (e) {
          console.error('Erro não serializável:', error);
        }
      }
      
      toast.error(mensagemErro);
      throw error; // Propaga o erro para tratamento adicional
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
