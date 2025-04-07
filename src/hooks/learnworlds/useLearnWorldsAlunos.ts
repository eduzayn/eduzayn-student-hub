
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

      return await makeRequest(`learnworlds-api/users?${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return null;
    }
  };

  /**
   * Cadastra um novo aluno na plataforma LearnWorlds
   */
  const cadastrarAluno = async (alunoData: AlunoParams): Promise<any> => {
    try {
      const result = await makeRequest('learnworlds-api/users', 'POST', alunoData);
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
      // Usamos o endpoint correto para sincronização de alunos: learnworlds-sync
      const result = await makeRequest(`learnworlds-sync?syncAll=${sincronizarTodos}`);
      
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
      toast.error('Erro ao sincronizar alunos com o LearnWorlds');
      return null;
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
