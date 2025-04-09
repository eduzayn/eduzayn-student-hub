
import { SincronizacaoResult } from '../types/cursoTypes';

/**
 * Serviço para sincronização de cursos
 */
export const courseSyncService = (makeRequest: any) => {
  /**
   * Sincroniza cursos do LearnWorlds com o banco de dados local
   */
  const sincronizarCursos = async (todos: boolean = false): Promise<SincronizacaoResult> => {
    try {
      // Esta função requer token de administrador
      console.log(`Iniciando sincronização de cursos (todos=${todos})`);
      const response = await makeRequest(`learnworlds-api/sync?type=courses&syncAll=${todos}`, "POST");
      console.log("Resposta da sincronização:", response);
      
      if (!response || response.error) {
        throw new Error(response?.message || "Erro na sincronização de cursos");
      }
      
      return {
        success: true,
        message: "Cursos sincronizados com sucesso",
        imported: response.imported || 0,
        updated: response.updated || 0,
        failed: response.failed || 0,
        total: response.total || 0,
        logs: response.logs || [],
        syncedItems: response.imported + response.updated || 0
      };
    } catch (error: any) {
      console.error("Erro ao sincronizar cursos:", error);
      
      return {
        success: false,
        message: error.message || "Erro ao sincronizar cursos",
        imported: 0,
        updated: 0,
        failed: 0,
        total: 0,
        logs: [error.message || "Erro desconhecido"]
      };
    }
  };

  return { sincronizarCursos };
};
