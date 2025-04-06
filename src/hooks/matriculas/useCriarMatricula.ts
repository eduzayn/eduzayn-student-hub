
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Matricula } from "@/types/matricula";
import type { Database } from "@/integrations/supabase/types";

export const useCriarMatricula = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cria uma nova matrícula
   */
  const criarMatricula = async (matriculaData: Omit<Matricula, "id">) => {
    setLoading(true);
    setError(null);
    
    try {
      // Explicitamente tipando para o tipo esperado pelo banco de dados
      type MatriculaInsert = Database["public"]["Tables"]["matriculas"]["Insert"];
      
      // Converter os dados para o tipo esperado pelo Supabase
      const dadosParaInserir = matriculaData as unknown as MatriculaInsert;
      
      const { data, error } = await supabase
        .from('matriculas')
        .insert(dadosParaInserir)
        .select('id')
        .single();
        
      if (error) throw error;
      
      toast.success('Matrícula criada com sucesso!');
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao criar matrícula';
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
    criarMatricula
  };
};
