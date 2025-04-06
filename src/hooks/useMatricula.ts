
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Matricula } from "@/types/matricula";

export const useMatricula = () => {
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

  /**
   * Cria uma nova matrícula
   */
  const criarMatricula = async (matriculaData: Omit<Matricula, "id">) => {
    setLoading(true);
    setError(null);
    
    try {
      // Aqui está a correção: não usar array na inserção
      const { data, error } = await supabase
        .from('matriculas')
        .insert(matriculaData)
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
      // Atualizar a matrícula - usando casting para resolver problema de tipos
      const { error: updateError } = await supabase
        .from('matriculas')
        .update({ status: novoStatus as any })
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
          .update({ status: statusAnterior as any })
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
      
      // Atualizar a matrícula - usando casting para resolver problema de tipos
      const { data: matriculaAtualizada, error: updateError } = await supabase
        .from('matriculas')
        .update(dadosAtualizacao as any)
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
    buscarMatriculas,
    buscarMatricula,
    criarMatricula,
    atualizarMatricula,
    atualizarStatusMatricula,
    buscarHistoricoMatricula
  };
};
