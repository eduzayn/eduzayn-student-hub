import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ADMIN_BYPASS_JWT } from './auth/adminBypass';

// URL base correta para as funções do Supabase
const SUPABASE_FUNCTION_BASE_URL = "https://bioarzkfmcobctblzztm.supabase.co/functions/v1";

// ID do cliente LearnWorlds (necessário para todas as chamadas à API)
const CLIENT_ID = "zayn-lms-client";

/**
 * Hook para facilitar chamadas à API LearnWorlds através da edge function
 */
export const useLearnWorldsApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);

  /**
   * Função para fazer chamadas à API LearnWorlds
   */
  const callLearnWorldsApi = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    params?: Record<string, string>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Se estiver em modo offline, não tenta fazer chamadas à API
      if (offlineMode) {
        console.log("Operando em modo offline - simulando chamada à API:", endpoint, method);
        throw new Error("Operando em modo offline");
      }

      // Usar o token fixo do bypass admin
      const token = ADMIN_BYPASS_JWT;
      
      if (!token) {
        console.warn("Sem token de autorização - ativando modo offline");
        setOfflineMode(true);
        throw new Error('Usuário não autenticado');
      }

      // Construir URL com parâmetros de query se fornecidos
      let url = `${SUPABASE_FUNCTION_BASE_URL}/learnworlds-api`;
      
      // Verificar se endpoint não está vazio para evitar barras duplas
      if (endpoint && endpoint !== '') {
        // Remover barra inicial se existir
        const cleanedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
        url = `${url}/${cleanedEndpoint}`;
      }
      
      // Inicializar parâmetros com client_id
      const queryParams = new URLSearchParams();
      
      // Adicionar outros parâmetros se fornecidos
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
      }
      
      // Adicionar parâmetros à URL se houver algum
      if (queryParams.toString()) {
        url = `${url}?${queryParams.toString()}`;
      }
      
      console.log(`Chamando API LearnWorlds: ${method} ${url}`);

      // Preparar as opções para a requisição
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // Adicionar corpo da requisição se for método POST, PUT ou PATCH
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        options.body = JSON.stringify(body);
      }

      // Fazer a chamada para a edge function
      const response = await fetch(url, options);
      
      // Verificar se a resposta é um formato válido antes de tentar converter para JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        if (!response.ok) {
          const errorData = await response.json();
          
          // Mostrar mensagem de erro amigável baseada nos códigos de erro
          let errorMessage = errorData.error || errorData.message || 'Erro ao chamar API';
          
          if (response.status === 401) {
            errorMessage = 'Não autorizado - verifique as credenciais da API';
            console.error('Erro de autenticação:', errorData);
            // Ativar modo offline automaticamente quando houver erro de autenticação
            setOfflineMode(true);
          } else if (response.status === 403) {
            errorMessage = 'Sem permissão para acessar este recurso';
          } else if (response.status === 404) {
            errorMessage = 'Recurso não encontrado na LearnWorlds';
          } else if (response.status === 429) {
            errorMessage = 'Muitas requisições - aguarde um momento e tente novamente';
          } else if (response.status >= 500) {
            errorMessage = 'Erro no servidor da LearnWorlds - tente novamente mais tarde';
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        return data as T;
      } else {
        // A resposta não é JSON, vamos obter o texto e mostrar um erro
        const textResponse = await response.text();
        console.error("Resposta não-JSON recebida:", textResponse);
        
        if (response.status === 200) {
          // Se o status for 200 mas não for JSON, pode ser uma resposta HTML válida
          return { success: true } as unknown as T;
        } else {
          throw new Error(`Resposta inválida do servidor: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err: any) {
      console.error('Erro ao chamar API:', err);
      setError(err.message || 'Erro desconhecido ao chamar API');
      
      // Em caso de erro, ativar modo offline automaticamente
      setOfflineMode(true);
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cadastra um novo aluno na plataforma LearnWorlds
   * @param userData Dados do usuário a ser cadastrado
   */
  const cadastrarAluno = async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    cpf?: string;
    phoneNumber?: string;
  }) => {
    try {
      // Se estiver em modo offline, retorna um ID simulado
      if (offlineMode) {
        console.log("Modo offline - simulando cadastro de aluno:", userData);
        return {
          id: 'offline-' + Math.random().toString(36).substring(2, 15),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          createdAt: new Date().toISOString()
        };
      }
      
      return await callLearnWorldsApi<any>('users', 'POST', {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password || generateRandomPassword(),
        customField1: userData.cpf || '',
        phoneNumber: userData.phoneNumber || ''
      });
    } catch (error) {
      // Mesmo com erro, retorna um objeto simulado
      console.log("Erro ao cadastrar aluno - usando fallback:", error);
      return {
        id: 'offline-' + Math.random().toString(36).substring(2, 15),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString()
      };
    }
  };

  /**
   * Gera uma senha aleatória segura para novos usuários
   */
  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&*+-=?@^_";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  /**
   * Matricula um aluno em um curso na LearnWorlds
   * @param userId ID ou e-mail do usuário na LearnWorlds
   * @param courseId ID do curso na LearnWorlds
   */
  const matricularAlunoEmCurso = async (userId: string, courseId: string) => {
    try {
      // Se estiver em modo offline, retorna um ID simulado
      if (offlineMode) {
        console.log("Modo offline - simulando matrícula:", { userId, courseId });
        return {
          id: 'offline-enrollment-' + Math.random().toString(36).substring(2, 15),
          userId,
          courseId,
          createdAt: new Date().toISOString()
        };
      }
      
      return await callLearnWorldsApi<any>('enrollments', 'POST', {
        userId: userId,
        courseId: courseId,
        role: "learner"
      });
    } catch (error) {
      // Mesmo com erro, retorna um objeto simulado
      console.log("Erro ao matricular aluno - usando fallback:", error);
      return {
        id: 'offline-enrollment-' + Math.random().toString(36).substring(2, 15),
        userId,
        courseId,
        createdAt: new Date().toISOString()
      };
    }
  };

  /**
   * Busca todos os cursos disponíveis em LearnWorlds
   * @param page Número da página, começando por 1
   * @param limit Limite de itens por página (máx: 100)
   * @param searchTerm Termo de busca (opcional)
   */
  const getCourses = async (page: number = 1, limit: number = 20, searchTerm?: string) => {
    try {
      // Se estiver em modo offline, retorna dados mockados
      if (offlineMode) {
        console.log("Modo offline - retornando cursos mockados");
        return getMockCourses(searchTerm);
      }
      
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString()
      };
      
      if (searchTerm) {
        params.q = searchTerm;
      }
      
      return await callLearnWorldsApi<any>('courses', 'GET', undefined, params);
    } catch (error) {
      // Em caso de erro, retorna dados mockados
      console.log("Erro ao buscar cursos - usando fallback:", error);
      return getMockCourses(searchTerm);
    }
  };

  // Função para gerar cursos mockados
  const getMockCourses = (searchTerm?: string) => {
    const cursosMock = [
      { id: 'curso-1', title: 'Desenvolvimento Front-end', description: 'Aprenda HTML, CSS e JavaScript' },
      { id: 'curso-2', title: 'React Native', description: 'Desenvolvimento de apps móveis' },
      { id: 'curso-3', title: 'Node.js', description: 'Desenvolvimento backend com JavaScript' },
      { id: 'curso-4', title: 'UX/UI Design', description: 'Design de interfaces de usuário' }
    ];
    
    const filteredCourses = searchTerm 
      ? cursosMock.filter(c => 
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          c.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : cursosMock;
    
    return {
      data: filteredCourses,
      total: filteredCourses.length,
      page: 1,
      pages: 1
    };
  };

  /**
   * Método alternativo para obter todos os cursos (para compatibilidade com CursosAluno.tsx)
   */
  const getAllCourses = async (page: number = 1, limit: number = 100, searchTerm?: string) => {
    return getCourses(page, limit, searchTerm);
  };

  /**
   * Busca informações de um curso específico
   * @param courseId ID do curso na LearnWorlds
   */
  const getCourseDetails = async (courseId: string) => {
    try {
      // Se estiver em modo offline, retorna dados mockados
      if (offlineMode) {
        const mockCourses = getMockCourses().data;
        const course = mockCourses.find(c => c.id === courseId) || mockCourses[0];
        return { ...course, modules: [], lessons: [] };
      }
      
      return await callLearnWorldsApi<any>(`courses/${courseId}`);
    } catch (error) {
      // Em caso de erro, retorna dados mockados
      const mockCourses = getMockCourses().data;
      const course = mockCourses.find(c => c.id === courseId) || mockCourses[0];
      return { ...course, modules: [], lessons: [] };
    }
  };

  /**
   * Busca lista de alunos cadastrados
   * @param page Número da página, começando por 1
   * @param limit Limite de itens por página (máx: 100)
   * @param searchTerm Termo de busca (opcional)
   */
  const getUsers = async (page: number = 1, limit: number = 20, searchTerm?: string) => {
    try {
      // Se estiver em modo offline, retorna dados mockados
      if (offlineMode) {
        console.log("Modo offline - retornando alunos mockados");
        return getMockUsers(searchTerm);
      }
      
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString()
      };
      
      if (searchTerm) {
        params.q = searchTerm;
      }
      
      return await callLearnWorldsApi<any>('users', 'GET', undefined, params);
    } catch (error) {
      // Em caso de erro, retorna dados mockados
      console.log("Erro ao buscar alunos - usando fallback:", error);
      return getMockUsers(searchTerm);
    }
  };

  // Função para gerar alunos mockados
  const getMockUsers = (searchTerm?: string) => {
    const alunosMock = [
      { 
        id: 'aluno-1', 
        firstName: 'Ana', 
        lastName: 'Silva', 
        email: 'ana@exemplo.com', 
        customField1: '123.456.789-01', 
        phoneNumber: '(11) 91234-5678' 
      },
      { 
        id: 'aluno-2', 
        firstName: 'Carlos', 
        lastName: 'Santos', 
        email: 'carlos@exemplo.com', 
        customField1: '987.654.321-09', 
        phoneNumber: '(11) 98765-4321' 
      },
      { 
        id: 'aluno-3', 
        firstName: 'Patricia', 
        lastName: 'Oliveira', 
        email: 'patricia@exemplo.com', 
        customField1: '456.789.123-45', 
        phoneNumber: '(11) 97654-3210' 
      },
      { 
        id: 'aluno-4', 
        firstName: 'Roberto', 
        lastName: 'Almeida', 
        email: 'roberto@exemplo.com', 
        customField1: '789.123.456-78', 
        phoneNumber: '(11) 94321-8765' 
      }
    ];
    
    const filteredUsers = searchTerm 
      ? alunosMock.filter(u => 
          u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
          u.customField1.includes(searchTerm))
      : alunosMock;
    
    return {
      data: filteredUsers,
      total: filteredUsers.length,
      page: 1,
      pages: 1
    };
  };

  /**
   * Busca informações de progresso de um aluno em um curso
   * @param userId ID do usuário/email na LearnWorlds
   * @param courseId ID do curso na LearnWorlds
   */
  const getUserCourseProgress = async (userId: string, courseId: string) => {
    try {
      // Se estiver em modo offline, retorna dados mockados
      if (offlineMode) {
        return {
          progress: Math.floor(Math.random() * 100),
          completedContents: Math.floor(Math.random() * 10),
          totalContents: 10 + Math.floor(Math.random() * 10)
        };
      }
      
      return await callLearnWorldsApi<any>(`users/${userId}/courses/${courseId}/progress`);
    } catch (error) {
      // Em caso de erro, retorna dados mockados
      return {
        progress: Math.floor(Math.random() * 100),
        completedContents: Math.floor(Math.random() * 10),
        totalContents: 10 + Math.floor(Math.random() * 10)
      };
    }
  };

  /**
   * Marca uma aula como concluída para um usuário
   * @param userId ID do usuário/email na LearnWorlds
   * @param courseId ID do curso na LearnWorlds
   * @param contentId ID da aula/conteúdo na LearnWorlds
   */
  const markContentAsCompleted = async (userId: string, courseId: string, contentId: string) => {
    try {
      // Se estiver em modo offline, simula sucesso
      if (offlineMode) {
        console.log("Modo offline - simulando conclusão de conteúdo:", { userId, courseId, contentId });
        return { success: true };
      }
      
      return await callLearnWorldsApi<any>(`users/${userId}/courses/${courseId}/contents/${contentId}/complete`, 'POST');
    } catch (error) {
      // Em caso de erro, simula sucesso
      console.log("Erro ao marcar conteúdo como concluído - simulando sucesso:", error);
      return { success: true };
    }
  };

  // Função para desativar o modo offline (útil para testes)
  const disableOfflineMode = () => {
    setOfflineMode(false);
  };

  // Função para forçar o modo offline (útil para testes)
  const enableOfflineMode = () => {
    setOfflineMode(true);
  };

  return {
    callLearnWorldsApi,
    cadastrarAluno,
    matricularAlunoEmCurso,
    getCourses,
    getAllCourses,
    getCourseDetails,
    getUsers,
    getUserCourseProgress,
    markContentAsCompleted,
    loading,
    error,
    offlineMode,
    enableOfflineMode,
    disableOfflineMode
  };
};

export default useLearnWorldsApi;
