
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Matricula } from "@/types/matricula";
import type { Database } from "@/integrations/supabase/types";

export const useAtualizarMatricula = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Atualiza uma matrícula existente e registra a alteração no histórico
   */
  const atualizarMatricula = async (
    id: string,
    dadosAtualizacao: Partial<Matricula>,
    motivo: string = "",
    userId: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar matrícula atual para saber status antes da atualização
      const { data: matriculaAtual, error: fetchError } = await supabase
        .from('matriculas')
        .select('status')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Utilizar o tipo correto para atualização
      type MatriculaUpdate = Database["public"]["Tables"]["matriculas"]["Update"];
      
      // Atualizar a matrícula com o tipo correto
      const { data: matriculaAtualizada, error: updateError } = await supabase
        .from('matriculas')
        .update(dadosAtualizacao as MatriculaUpdate)
        .eq('id', id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      // Registrar no histórico se o status foi alterado
      if (dadosAtualizacao.status && dadosAtualizacao.status !== matriculaAtual.status) {
        const historicoData = {
          matricula_id: id,
          status_anterior: matriculaAtual.status,
          status_novo: dadosAtualizacao.status,
          motivo: motivo,
          alterado_por: userId
        };
        
        const { error: historicoError } = await supabase
          .from('historico_matricula')
          .insert(historicoData);
          
        if (historicoError) {
          toast.error(`Matrícula atualizada, mas houve erro ao registrar histórico: ${historicoError.message}`);
        }
      }
      
      toast.success('Matrícula atualizada com sucesso!');
      return matriculaAtualizada;
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao atualizar matrícula';
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
    atualizarMatricula
  };
};
