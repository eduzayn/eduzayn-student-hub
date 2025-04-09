
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
          course_id: cursoId,
          status: "active",
          enrollmentDate: new Date().toISOString(),
          simulatedResponse: true,
          data: {
            id: `simulated-enrollment-${alunoId}-${cursoId}`,
            student_id: alunoId,
            course_id: cursoId,
            status: "active",
            enrollment_date: new Date().toISOString()
          }
        };
      }

      const result = await makeRequest(`learnworlds-api/users/${alunoId}/courses/${cursoId}`, 'GET');
      
      console.log("Resultado da verificação de matrícula:", result);
      
      if (result && !result.error) {
        return {
          id: result.id || `${alunoId}-${cursoId}`,
          course_id: cursoId,
          status: result.status || "active",
          enrollmentDate: result.enrollmentDate || new Date().toISOString(),
          expirationDate: result.expirationDate,
          learnworlds_id: result.id,
          data: {
            id: result.id || `${alunoId}-${cursoId}`,
            student_id: alunoId,
            course_id: cursoId,
            status: result.status || "active",
            enrollment_date: result.enrollmentDate || new Date().toISOString()
          }
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
          course_id: cursoId,
          status: "active",
          enrollmentDate: new Date().toISOString(),
          simulatedResponse: true,
          data: {
            id: `simulated-enrollment-${alunoId}-${cursoId}`,
            student_id: alunoId,
            course_id: cursoId,
            status: "active",
            enrollment_date: new Date().toISOString()
          }
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
