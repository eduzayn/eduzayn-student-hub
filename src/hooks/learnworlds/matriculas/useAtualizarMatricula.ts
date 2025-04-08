
import { useCallback } from 'react';
import { toast } from 'sonner';
import useLearnWorldsBase from '../useLearnWorldsBase';
import { EnrollmentResponse } from '../types/cursoTypes';

/**
 * Hook para atualizar matrículas no LearnWorlds
 */
const useAtualizarMatricula = () => {
  const { makeRequest, loading, error, offlineMode } = useLearnWorldsBase();

  /**
   * Atualiza o status de uma matrícula existente
   */
  const atualizarStatusMatricula = useCallback(async (
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
  }, [makeRequest, offlineMode]);

  return {
    loading,
    error,
    offlineMode,
    atualizarStatusMatricula
  };
};

export default useAtualizarMatricula;
