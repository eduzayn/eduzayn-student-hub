
import { useState } from "react";
import { toast } from "sonner";

/**
 * Hook simplificado para comunicação com a API LearnWorlds - Versão temporária
 * Este é um placeholder enquanto a integração com LearnWorlds é reformulada
 */
const useLearnWorldsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const offlineMode = true; // Sempre offline durante a reformulação
  
  // Funções simplificadas que retornam dados simulados
  const buscarCursos = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      console.log(`Simulando busca de cursos (página ${page}, limite ${limit})`);
      // Retorna uma estrutura vazia mas válida
      return {
        data: [],
        meta: { 
          total: 0,
          pages: 0,
          currentPage: page
        }
      };
    } catch (e) {
      console.error("Erro ao buscar cursos:", e);
      setError("Erro ao buscar cursos");
      throw new Error("Erro ao buscar cursos");
    } finally {
      setLoading(false);
    }
  };
  
  const matricularAlunoEmCurso = async (alunoId: string, cursoId: string, options: any) => {
    setLoading(true);
    try {
      console.log(`Simulando matrícula do aluno ${alunoId} no curso ${cursoId}`);
      return {
        id: `sim-${Date.now()}`,
        status: "active",
        simulatedResponse: true
      };
    } catch (e) {
      console.error("Erro ao matricular aluno:", e);
      setError("Erro ao matricular aluno");
      throw new Error("Erro ao matricular aluno");
    } finally {
      setLoading(false);
    }
  };
  
  const verificarMatricula = async (alunoId: string, cursoId: string) => {
    setLoading(true);
    try {
      console.log(`Simulando verificação de matrícula: aluno ${alunoId}, curso ${cursoId}`);
      return null; // Sem matrícula existente
    } catch (e) {
      console.error("Erro ao verificar matrícula:", e);
      setError("Erro ao verificar matrícula");
      throw new Error("Erro ao verificar matrícula");
    } finally {
      setLoading(false);
    }
  };
  
  const sincronizarCursos = async () => {
    toast.info("Sincronização de cursos não disponível durante a reformulação");
    return { success: false, message: "Funcionalidade em reformulação" };
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
};

export default useLearnWorldsApi;
