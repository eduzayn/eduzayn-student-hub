
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useHistoricoMatricula = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca o histórico de uma matrícula
   */
  const buscarHistoricoMatricula = async (matriculaId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('historico_matricula')
        .select()
        .eq('matricula_id', matriculaId)
        .order('data_alteracao', { ascending: false });
        
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao buscar histórico da matrícula';
      setError(errorMsg);
      toast.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    buscarHistoricoMatricula
  };
};
