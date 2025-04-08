
import { useState } from 'react';
import { toast } from 'sonner';
import useLearnWorldsBase from './useLearnWorldsBase';
import { EnrollmentResponse } from './types/cursoTypes';

/**
 * Hook para gerenciar matrículas no LearnWorlds
 */
const useLearnWorldsMatriculas = () => {
  const { makeRequest, loading, error, offlineMode } = useLearnWorldsBase();
  const [matriculaStatus, setMatriculaStatus] = useState<{
    success: boolean;
    message: string;
    enrollmentId?: string;
  } | null>(null);

  /**
   * Matricula um aluno em um curso específico
   * @param alunoId ID do aluno no LearnWorlds
   * @param cursoId ID do curso no LearnWorlds
   * @param dadosAdicionais Dados adicionais para a matrícula
   */
  const matricularAlunoEmCurso = async (
    alunoId: string, 
    cursoId: string, 
    dadosAdicionais?: {
      status?: 'active' | 'inactive' | 'completed';
      expirationDate?: string;
      notifyUser?: boolean;
    }
  ): Promise<EnrollmentResponse | null> => {
    console.log(`Tentando matricular aluno ${alunoId} no curso ${cursoId}`);
    
    try {
      if (offlineMode) {
        console.log("Modo offline detectado, usando matricula simulada");
        const simulatedResponse: EnrollmentResponse = {
          id: `simulated-enrollment-${Date.now()}`,
          userId: alunoId,
          courseId: cursoId,
          status: "active",
          enrollmentDate: new Date().toISOString(),
          learnworlds_id: `lw-${alunoId}-${cursoId}`,
          simulatedResponse: true
        };
        
        setMatriculaStatus({
          success: true,
          message: "Matrícula simulada realizada com sucesso",
          enrollmentId: simulatedResponse.id
        });
        
        return simulatedResponse;
      }

      // Preparar os dados para envio
      const matriculaData = {
        userId: alunoId,
        courseId: cursoId,
        status: dadosAdicionais?.status || "active",
        expirationDate: dadosAdicionais?.expirationDate,
        notifyUser: dadosAdicionais?.notifyUser ?? true
      };
      
      console.log("Dados da matrícula:", matriculaData);
      
      // Fazer a chamada para a API
      const result = await makeRequest(`learnworlds-api/users/${alunoId}/courses/${cursoId}`, 'POST', matriculaData);
      
      console.log("Resultado da matrícula:", result);
      
      if (result && !result.error) {
        setMatriculaStatus({
          success: true,
          message: "Matrícula realizada com sucesso no LearnWorlds",
          enrollmentId: result.id || `${alunoId}-${cursoId}`
        });
        
        toast.success("Matrícula realizada com sucesso no LearnWorlds!");
        
        return {
          id: result.id || `${alunoId}-${cursoId}`,
          userId: alunoId,
          courseId: cursoId,
          status: result.status || "active",
          enrollmentDate: result.enrollmentDate || new Date().toISOString(),
          expirationDate: result.expirationDate,
          learnworlds_id: result.id
        };
      } else {
        throw new Error(result?.error || "Erro desconhecido ao matricular aluno");
      }
    } catch (error: any) {
      console.error(`Erro ao matricular aluno ${alunoId} no curso ${cursoId}:`, error);
      
      setMatriculaStatus({
        success: false,
        message: error.message || "Ocorreu um erro ao realizar a matrícula"
      });
      
      toast.error("Falha ao matricular aluno", {
        description: error.message || "Ocorreu um erro ao realizar a matrícula"
      });
      
      // Se estamos em modo offline, criamos uma resposta simulada mesmo com erro
      if (offlineMode) {
        console.log("Modo offline - gerando matrícula simulada mesmo com erro");
        return {
          id: `simulated-enrollment-${Date.now()}`,
          userId: alunoId,
          courseId: cursoId,
          status: "active",
          enrollmentDate: new Date().toISOString(),
          learnworlds_id: `lw-${alunoId}-${cursoId}`,
          simulatedResponse: true
        };
      }
      
      return null;
    }
  };

  /**
   * Verifica o status de uma matrícula existente
   */
  const verificarMatricula = async (alunoId: string, cursoId: string): Promise<EnrollmentResponse | null> => {
    console.log(`Verificando matrícula do aluno ${alunoId} no curso ${cursoId}`);
    
    try {
      if (offlineMode) {
        console.log("Modo offline detectado, retornando status simulado");
        return {
          id: `simulated-enrollment-${alunoId}-${cursoId}`,
          userId: alunoId,
          courseId: cursoId,
          status: "active",
          enrollmentDate: new Date().toISOString(),
          simulatedResponse: true
        };
      }

      const result = await makeRequest(`learnworlds-api/users/${alunoId}/courses/${cursoId}`, 'GET');
      
      console.log("Resultado da verificação de matrícula:", result);
      
      if (result && !result.error) {
        return {
          id: result.id || `${alunoId}-${cursoId}`,
          userId: alunoId,
          courseId: cursoId,
          status: result.status || "active",
          enrollmentDate: result.enrollmentDate || new Date().toISOString(),
          expirationDate: result.expirationDate,
          learnworlds_id: result.id
        };
      } else if (result && result.error && result.error.includes("not enrolled")) {
        // Aluno não está matriculado
        return null;
      } else {
        throw new Error(result?.error || "Erro ao verificar matrícula");
      }
    } catch (error) {
      console.error(`Erro ao verificar matrícula do aluno ${alunoId} no curso ${cursoId}:`, error);
      
      if (offlineMode) {
        return {
          id: `simulated-enrollment-${alunoId}-${cursoId}`,
          userId: alunoId,
          courseId: cursoId,
          status: "active",
          enrollmentDate: new Date().toISOString(),
          simulatedResponse: true
        };
      }
      
      return null;
    }
  };

  /**
   * Atualiza o status de uma matrícula existente
   */
  const atualizarStatusMatricula = async (
    alunoId: string, 
    cursoId: string, 
    novoStatus: "active" | "inactive" | "completed"
  ): Promise<EnrollmentResponse | null> => {
    console.log(`Atualizando status da matrícula do aluno ${alunoId} no curso ${cursoId} para ${novoStatus}`);
    
    try {
      if (offlineMode) {
        console.log("Modo offline detectado, simulando atualização de status");
        return {
          id: `simulated-enrollment-${alunoId}-${cursoId}`,
          userId: alunoId,
          courseId: cursoId,
          status: novoStatus,
          enrollmentDate: new Date().toISOString(),
          simulatedResponse: true
        };
      }

      const result = await makeRequest(
        `learnworlds-api/users/${alunoId}/courses/${cursoId}`, 
        'PUT', 
        { status: novoStatus }
      );
      
      console.log("Resultado da atualização de status:", result);
      
      if (result && !result.error) {
        toast.success(`Status da matrícula atualizado para ${novoStatus}`);
        
        return {
          id: result.id || `${alunoId}-${cursoId}`,
          userId: alunoId,
          courseId: cursoId,
          status: novoStatus,
          enrollmentDate: result.enrollmentDate || new Date().toISOString(),
          expirationDate: result.expirationDate,
          learnworlds_id: result.id
        };
      } else {
        throw new Error(result?.error || "Erro ao atualizar status da matrícula");
      }
    } catch (error) {
      console.error(`Erro ao atualizar status da matrícula do aluno ${alunoId} no curso ${cursoId}:`, error);
      
      toast.error("Falha ao atualizar status da matrícula");
      
      if (offlineMode) {
        return {
          id: `simulated-enrollment-${alunoId}-${cursoId}`,
          userId: alunoId,
          courseId: cursoId,
          status: novoStatus,
          enrollmentDate: new Date().toISOString(),
          simulatedResponse: true
        };
      }
      
      return null;
    }
  };

  return {
    loading,
    error,
    offlineMode,
    matriculaStatus,
    matricularAlunoEmCurso,
    verificarMatricula,
    atualizarStatusMatricula
  };
};

export default useLearnWorldsMatriculas;
