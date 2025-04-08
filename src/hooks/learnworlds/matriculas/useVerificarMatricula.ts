
import { useCallback } from 'react';
import useLearnWorldsBase from '../useLearnWorldsBase';
import { EnrollmentResponse } from '../types/cursoTypes';

/**
 * Hook para verificar matrículas no LearnWorlds
 */
const useVerificarMatricula = () => {
  const { makeRequest, loading, error, offlineMode } = useLearnWorldsBase();

  /**
   * Verifica o status de uma matrícula existente
   */
  const verificarMatricula = useCallback(async (alunoId: string, cursoId: string): Promise<EnrollmentResponse | null> => {
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
  }, [makeRequest, offlineMode]);

  return {
    loading,
    error,
    offlineMode,
    verificarMatricula
  };
};

export default useVerificarMatricula;
