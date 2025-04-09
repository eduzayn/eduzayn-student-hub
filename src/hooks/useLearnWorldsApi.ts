
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SincronizacaoResult, CoursesResponse } from './learnworlds/types/cursoTypes';

export default function useLearnWorldsApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);

  // Função para buscar cursos
  const buscarCursos = async (page = 1, limit = 10): Promise<CoursesResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      if (offlineMode) {
        // Retornar dados simulados se estiver em modo offline
        return {
          data: simulatedCourses,
          meta: {
            total: simulatedCourses.length,
            pages: 1,
            currentPage: 1
          }
        };
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Você precisa estar autenticado para realizar esta ação');
      }

      const { data, error } = await supabase.functions.invoke('learnworlds-api', {
        body: { 
          path: '/courses',
          method: 'GET',
          query: { page, limit }
        }
      });

      if (error) throw error;
      
      return data as CoursesResponse;
    } catch (error: any) {
      setError(error.message || 'Erro ao buscar cursos');
      console.error('Erro ao buscar cursos:', error);
      
      // Se houver erro de conexão, ativar modo offline
      if (error.message && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network error')
      )) {
        setOfflineMode(true);
        toast.error('Modo offline ativado: Usando dados simulados');
      }
      
      // Retornar dados simulados em caso de erro
      return {
        data: simulatedCourses,
        meta: {
          total: simulatedCourses.length,
          pages: 1,
          currentPage: 1
        }
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Função para sincronizar cursos
  const sincronizarCursos = async (): Promise<SincronizacaoResult> => {
    setLoading(true);
    setError(null);
    
    try {
      if (offlineMode) {
        return {
          success: true,
          message: 'Simulação de sincronização bem-sucedida!',
          imported: 5,
          updated: 10,
          failed: 0,
          total: 15,
          logs: ['Sincronização simulada concluída']
        };
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Você precisa estar autenticado para realizar esta ação');
      }

      const { data, error } = await supabase.functions.invoke('learnworlds-api', {
        body: { 
          path: '/sync/courses',
          method: 'POST'
        }
      });

      if (error) throw error;
      
      return data as SincronizacaoResult;
    } catch (error: any) {
      setError(error.message || 'Erro ao sincronizar cursos');
      console.error('Erro ao sincronizar cursos:', error);
      
      // Se houver erro de conexão, ativar modo offline
      if (error.message && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network error')
      )) {
        setOfflineMode(true);
        toast.error('Modo offline ativado: Usando dados simulados');
      }
      
      return {
        success: false,
        message: error.message || 'Erro ao sincronizar cursos'
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Função para matricular aluno em curso
  const matricularAlunoEmCurso = async (alunoId: string, cursoId: string, options: any) => {
    setLoading(true);
    setError(null);
    
    try {
      if (offlineMode) {
        return {
          id: `simulated-${Date.now()}`,
          success: true,
          message: 'Matrícula simulada realizada com sucesso'
        };
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Você precisa estar autenticado para realizar esta ação');
      }

      const { data, error } = await supabase.functions.invoke('learnworlds-api', {
        body: { 
          path: `/users/${alunoId}/courses/${cursoId}`,
          method: 'POST',
          body: options
        }
      });

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      setError(error.message || 'Erro ao matricular aluno');
      console.error('Erro ao matricular aluno:', error);
      
      if (error.message && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network error')
      )) {
        setOfflineMode(true);
        toast.error('Modo offline ativado: Usando dados simulados');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Função para verificar matrícula
  const verificarMatricula = async (alunoId: string, cursoId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (offlineMode) {
        return {
          id: `simulated-${Date.now()}`,
          status: 'active',
          enrollmentDate: new Date().toISOString()
        };
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Você precisa estar autenticado para realizar esta ação');
      }

      const { data, error } = await supabase.functions.invoke('learnworlds-api', {
        body: { 
          path: `/users/${alunoId}/courses/${cursoId}`,
          method: 'GET'
        }
      });

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      setError(error.message || 'Erro ao verificar matrícula');
      console.error('Erro ao verificar matrícula:', error);
      
      if (error.message && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network error')
      )) {
        setOfflineMode(true);
        toast.error('Modo offline ativado: Usando dados simulados');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    offlineMode,
    buscarCursos,
    matricularAlunoEmCurso,
    verificarMatricula,
    sincronizarCursos
  };
}

// Dados simulados para modo offline
const simulatedCourses = [
  {
    id: 'sim-course-1',
    title: 'Desenvolvimento Web Fullstack',
    description: 'Aprenda a desenvolver aplicações web completas.',
    image: '/placeholder.svg',
    price: 997,
    access: 'paid',
    duration: '120 horas'
  },
  {
    id: 'sim-course-2',
    title: 'Design UX/UI',
    description: 'Aprenda a criar interfaces intuitivas e atraentes.',
    image: '/placeholder.svg',
    price: 897,
    access: 'paid',
    duration: '80 horas'
  },
  {
    id: 'sim-course-3',
    title: 'Marketing Digital',
    description: 'Estratégias para divulgação online.',
    image: '/placeholder.svg',
    price: 697,
    access: 'paid',
    duration: '60 horas'
  }
];
