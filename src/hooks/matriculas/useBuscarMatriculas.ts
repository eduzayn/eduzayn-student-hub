
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Matricula } from "@/types/matricula";

export const useBuscarMatriculas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Busca todas as matrículas
   */
  const buscarMatriculas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('matriculas')
        .select(`
          id,
          aluno_id,
          curso_id,
          data_inicio,
          data_conclusao,
          status,
          progresso,
          forma_ingresso,
          origem_matricula,
          turno,
          observacoes
        `)
        .order('data_inicio', { ascending: false });
        
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao buscar matrículas';
      setError(errorMsg);
      toast.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca uma matrícula específica
   */
  const buscarMatricula = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('matriculas')
        .select(`
          id,
          aluno_id,
          curso_id,
          data_inicio,
          data_conclusao,
          status,
          progresso,
          forma_ingresso,
          origem_matricula,
          turno,
          observacoes
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      const errorMsg = err.message || `Erro ao buscar matrícula com ID: ${id}`;
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    buscarMatriculas,
    buscarMatricula
  };
};
