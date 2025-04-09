
import { useState } from 'react';
import { toast } from 'sonner';
import useLearnWorldsBase from '../useLearnWorldsBase';
import { EnrollmentResponse } from '../types/cursoTypes';

/**
 * Hook para matricular alunos em cursos no LearnWorlds
 */
const useMatricularAluno = () => {
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
          courseId: cursoId,
          status: "active",
          enrollmentDate: new Date().toISOString(),
          learnworlds_id: `lw-${alunoId}-${cursoId}`,
          simulatedResponse: true,
          data: {
            id: `simulated-enrollment-${Date.now()}`,
            student_id: alunoId,
            course_id: cursoId,
            status: "active",
            enrollment_date: new Date().toISOString()
          }
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
          courseId: cursoId,
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
          courseId: cursoId,
          status: "active",
          enrollmentDate: new Date().toISOString(),
          learnworlds_id: `lw-${alunoId}-${cursoId}`,
          simulatedResponse: true,
          data: {
            id: `simulated-enrollment-${Date.now()}`,
            student_id: alunoId,
            course_id: cursoId,
            status: "active",
            enrollment_date: new Date().toISOString()
          }
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
    matricularAlunoEmCurso
  };
};

export default useMatricularAluno;
