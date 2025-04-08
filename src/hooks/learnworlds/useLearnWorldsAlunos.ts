
import { useState, useCallback } from 'react';
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
  const sincronizarAlunos = useCallback(async (sincronizarTodos: boolean = false): Promise<any> => {
    try {
      console.log(`Iniciando sincronização - sincronizarTodos=${sincronizarTodos}`);
      
      // Gerando logs mais detalhados
      const logs = [`[${new Date().toISOString()}] Iniciando sincronização de alunos (sincronizarTodos=${sincronizarTodos})`];
      
      // Usamos o endpoint correto para sincronização de alunos: learnworlds-sync
      const url = `learnworlds-sync?syncAll=${sincronizarTodos}`;
      logs.push(`[${new Date().toISOString()}] Chamando endpoint: ${url}`);
      console.log(`Chamando endpoint: ${url}`);
      
      try {
        const result = await makeRequest(url);
        console.log("Resposta da sincronização recebida:", result);
        
        // Adicionar logs recebidos da API
        if (result && Array.isArray(result.logs)) {
          logs.push(...result.logs);
        }
        
        // Verifica se a resposta contém os campos esperados
        if (!result || typeof result !== 'object') {
          const errorMessage = "Formato de resposta inválido da API de sincronização";
          logs.push(`[${new Date().toISOString()}] ERRO: ${errorMessage}`);
          toast.error(errorMessage);
          return {
            imported: 0,
            updated: 0,
            failed: 0,
            total: 0,
            logs
          };
        }
        
        // Adicionar resumo ao final dos logs
        logs.push(`[${new Date().toISOString()}] Sincronização concluída: ${result.imported} importados, ${result.updated} atualizados, ${result.failed} falhas`);
        
        // Resultado com feedback visual
        if (result.imported > 0 || result.updated > 0) {
          toast.success(
            `Sincronização concluída com sucesso!`, 
            { description: `${result.imported} novos alunos importados e ${result.updated} atualizados.` }
          );
        } else if (result.failed > 0) {
          toast.warning(
            `Sincronização concluída com avisos`,
            { description: `${result.failed} falhas na sincronização.` }
          );
        } else {
          toast.info('Nenhuma alteração foi necessária.');
        }
        
        // Garantir que o resultado sempre tenha logs
        return {
          ...result,
          logs: logs
        };
      } catch (requestError: any) {
        // Extrair código HTTP se disponível
        const statusCode = requestError.status || 500;
        const errorDetail = requestError.message || "Erro desconhecido";
        logs.push(`[${new Date().toISOString()}] ERRO HTTP ${statusCode}: ${errorDetail}`);
        
        console.error('Erro na requisição de sincronização:', requestError);
        throw new Error(`Erro de comunicação (HTTP ${statusCode}): ${errorDetail}`);
      }
    } catch (error: any) {
      console.error('Erro ao sincronizar alunos:', error);
      
      // Melhor tratamento de erros
      let mensagemErro = "Erro ao sincronizar alunos com o LearnWorlds";
      const logs = [`[${new Date().toISOString()}] ERRO: ${error.message || mensagemErro}`];
      
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
      
      // Retornar um objeto com formato válido contendo os logs de erro
      return {
        imported: 0,
        updated: 0,
        failed: 1,
        total: 0,
        logs
      };
    }
  }, [makeRequest]);

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
