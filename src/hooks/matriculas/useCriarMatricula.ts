
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
      console.log("Dados recebidos para criar matrícula:", matriculaData);
      
      // Explicitamente tipando para o tipo esperado pelo banco de dados
      type MatriculaInsert = Database["public"]["Tables"]["matriculas"]["Insert"];
      
      // Converter os dados para o tipo esperado pelo Supabase
      // Remover campos que possam não existir na tabela
      
      const dadosParaInserir: MatriculaInsert = {
        aluno_id: matriculaData.aluno_id,
        curso_id: matriculaData.curso_id,
        data_inicio: matriculaData.data_inicio,
        status: matriculaData.status, // Já validado como sendo um dos valores aceitos
        observacoes: matriculaData.observacoes || null,
        forma_ingresso: matriculaData.forma_ingresso || null,
      };
      
      console.log("Dados filtrados para inserir:", dadosParaInserir);
      
      const { data, error } = await supabase
        .from('matriculas')
        .insert(dadosParaInserir)
        .select('id')
        .single();
        
      if (error) {
        console.error("Erro do Supabase:", error);
        throw error;
      }
      
      toast.success('Matrícula criada com sucesso!');
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao criar matrícula';
      console.error("Erro detalhado:", err);
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
