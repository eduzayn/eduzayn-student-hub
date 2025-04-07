
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Interface para os parâmetros de cadastro de aluno
 */
interface AlunoParams {
  firstName: string;
  lastName?: string;
  email: string;
  cpf?: string;
  phoneNumber?: string;
  customField1?: string;
  customField2?: string;
}

/**
 * Hook para interagir com a API do LearnWorlds através das funções edge do Supabase
 */
const useLearnWorldsApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);

  /**
   * Obtém o token JWT do usuário atual ou usa o token bypass para admin
   */
  const getToken = async (): Promise<string | null> => {
    // Primeiro tenta obter a sessão do usuário atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      return session.access_token;
    }

    // Se não tiver sessão, usa o token bypass de admin
    // Note: Isso seria substituído por uma abordagem mais segura em produção
    return 'byZ4yn-#v0lt-2025!SEC'; // Token de bypass para testes
  };

  /**
   * Função auxiliar para fazer requisições para as funções edge
   */
  const makeRequest = async (endpoint: string, method = 'GET', body?: any): Promise<any> => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      
      if (!token) {
        throw new Error('Não foi possível autenticar. Faça login novamente.');
      }

      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const options: RequestInit = {
        method,
        headers,
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
      }

      const url = `https://bioarzkfmcobctblzztm.supabase.co/functions/v1/${endpoint}`;
      console.log(`Fazendo requisição ${method} para ${url}`);
      
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setOfflineMode(false);
      return data;
    } catch (err: any) {
      console.error(`Erro na API LearnWorlds (${endpoint}):`, err);
      setOfflineMode(true);
      setError(err.message || 'Erro ao comunicar com a API');
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
   * Busca cursos da API LearnWorlds
   */
  const getCourses = async (page: number = 1, limit: number = 20, searchTerm: string = ''): Promise<any> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (searchTerm) {
        queryParams.append('q', searchTerm);
      }

      return await makeRequest(`learnworlds-api/courses?${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      return null;
    }
  };

  /**
   * Busca detalhes de um curso específico
   */
  const getCourseDetails = async (courseId: string): Promise<any> => {
    try {
      return await makeRequest(`learnworlds-api/courses/${courseId}`);
    } catch (error) {
      console.error(`Erro ao buscar detalhes do curso ${courseId}:`, error);
      return null;
    }
  };

  /**
   * Busca todos os cursos disponíveis
   */
  const getAllCourses = async (page: number = 1, limit: number = 100): Promise<any> => {
    try {
      const courses = await getCourses(page, limit);
      return courses?.data || [];
    } catch (error) {
      console.error('Erro ao buscar todos os cursos:', error);
      return [];
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
   * Matricula um aluno em um curso específico
   */
  const matricularAlunoEmCurso = async (alunoId: string, cursoId: string): Promise<any> => {
    try {
      const result = await makeRequest(`learnworlds-api/users/${alunoId}/courses/${cursoId}`, 'POST');
      return result;
    } catch (error) {
      console.error(`Erro ao matricular aluno ${alunoId} no curso ${cursoId}:`, error);
      return null;
    }
  };

  /**
   * Inicia sincronização de alunos com LearnWorlds
   */
  const sincronizarAlunos = async (sincronizarTodos: boolean = false): Promise<any> => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicia sincronização de cursos com LearnWorlds
   */
  const sincronizarCursos = async (sincronizarTodos: boolean = false): Promise<any> => {
    try {
      setLoading(true);
      const result = await makeRequest(`learnworlds-courses-sync?syncAll=${sincronizarTodos}`);
      
      if (result.imported > 0 || result.updated > 0) {
        toast.success(
          `Sincronização concluída com sucesso!`, 
          { description: `${result.imported} novos cursos importados e ${result.updated} atualizados.` }
        );
      } else {
        toast.info('Nenhuma alteração foi necessária.');
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao sincronizar cursos:', error);
      toast.error('Erro ao sincronizar cursos com o LearnWorlds');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    offlineMode,
    getUsers,
    getCourses,
    getCourseDetails,
    getAllCourses,
    cadastrarAluno,
    matricularAlunoEmCurso,
    sincronizarAlunos,
    sincronizarCursos
  };
};

export default useLearnWorldsApi;
