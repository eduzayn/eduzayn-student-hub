
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

export const useStatusMatricula = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Atualiza o status de uma matrícula e registra no histórico
   */
  const atualizarStatusMatricula = async (
    id: string,
    novoStatus: string,
    statusAnterior: string,
    motivo: string = "",
    userId: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Atualizar a matrícula - usando tipagem correta
      type MatriculaUpdate = Database["public"]["Tables"]["matriculas"]["Update"];
      
      const { error: updateError } = await supabase
        .from('matriculas')
        .update({ status: novoStatus as MatriculaUpdate["status"] })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // Registrar no histórico
      const historicoData = {
        matricula_id: id,
        status_anterior: statusAnterior,
        status_novo: novoStatus,
        motivo: motivo,
        alterado_por: userId
      };
      
      const { error: historicoError } = await supabase
        .from('historico_matricula')
        .insert(historicoData);
        
      if (historicoError) {
        // Reverter atualização da matrícula em caso de erro ao registrar histórico
        await supabase
          .from('matriculas')
          .update({ status: statusAnterior as MatriculaUpdate["status"] })
          .eq('id', id);
          
        throw historicoError;
      }
      
      toast.success(`Status da matrícula atualizado para: ${novoStatus}`);
      return true;
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao atualizar status da matrícula';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    atualizarStatusMatricula
  };
};
