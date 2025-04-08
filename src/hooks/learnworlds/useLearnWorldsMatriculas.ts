
import { useState } from 'react';
import useLearnWorldsBase from './useLearnWorldsBase';
import { toast } from 'sonner';

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
   */
  const matricularAlunoEmCurso = async (
    alunoId: string, 
    cursoId: string, 
    dadosAdicionais?: {
      status?: string;
      expirationDate?: string;
      notifyUser?: boolean;
    }
  ): Promise<any> => {
    console.log(`Tentando matricular aluno ${alunoId} no curso ${cursoId}`);
    
    try {
      if (offlineMode) {
        console.log("Modo offline detectado, usando matricula simulada");
        setMatriculaStatus({
          success: true,
          message: "Matrícula simulada realizada com sucesso",
          enrollmentId: `simulated-enrollment-${Date.now()}`
        });
        return {
          id: `simulated-enrollment-${Date.now()}`,
          learnworlds_id: `lw-${alunoId}-${cursoId}`,
          status: "active",
          simulatedResponse: true
        };
      }

      // Preparar os dados para envio
      const matriculaData = {
        userId: alunoId,
        courseId: cursoId,
        status: dadosAdicionais?.status || "active",
        expirationDate: dadosAdicionais?.expirationDate,
        notifyUser: dadosAdicionais?.notifyUser ?? false
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
        
        return result;
      } else {
        throw new Error(result?.error || "Erro desconhecido ao matricular aluno");
      }
    } catch (error: any) {
      console.error(`Erro ao matricular aluno ${alunoId} no curso ${cursoId}:`, error);
      
      setMatriculaStatus({
        success: false,
        message: error.message || "Ocorreu um erro ao realizar a matrícula"
      });
      
      // Se estamos em modo offline, criamos uma resposta simulada mesmo com erro
      if (offlineMode) {
        console.log("Modo offline - gerando matrícula simulada mesmo com erro");
        return {
          id: `simulated-enrollment-${Date.now()}`,
          learnworlds_id: `lw-${alunoId}-${cursoId}`,
          status: "active",
          simulatedResponse: true
        };
      }
      
      return null;
    }
  };

  /**
   * Verifica o status de uma matrícula existente
   */
  const verificarMatricula = async (alunoId: string, cursoId: string): Promise<any> => {
    console.log(`Verificando matrícula do aluno ${alunoId} no curso ${cursoId}`);
    
    try {
      if (offlineMode) {
        console.log("Modo offline detectado, retornando status simulado");
        return {
          id: `simulated-enrollment-${alunoId}-${cursoId}`,
          status: "active",
          enrollmentDate: new Date().toISOString(),
          simulatedResponse: true
        };
      }

      const result = await makeRequest(`learnworlds-api/users/${alunoId}/courses/${cursoId}`, 'GET');
      
      console.log("Resultado da verificação de matrícula:", result);
      
      return result;
    } catch (error) {
      console.error(`Erro ao verificar matrícula do aluno ${alunoId} no curso ${cursoId}:`, error);
      
      if (offlineMode) {
        return {
          id: `simulated-enrollment-${alunoId}-${cursoId}`,
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
  ): Promise<any> => {
    console.log(`Atualizando status da matrícula do aluno ${alunoId} no curso ${cursoId} para ${novoStatus}`);
    
    try {
      if (offlineMode) {
        console.log("Modo offline detectado, simulando atualização de status");
        return {
          id: `simulated-enrollment-${alunoId}-${cursoId}`,
          status: novoStatus,
          simulatedResponse: true
        };
      }

      const result = await makeRequest(
        `learnworlds-api/users/${alunoId}/courses/${cursoId}`, 
        'PUT', 
        { status: novoStatus }
      );
      
      console.log("Resultado da atualização de status:", result);
      
      return result;
    } catch (error) {
      console.error(`Erro ao atualizar status da matrícula do aluno ${alunoId} no curso ${cursoId}:`, error);
      
      if (offlineMode) {
        return {
          id: `simulated-enrollment-${alunoId}-${cursoId}`,
          status: novoStatus,
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
