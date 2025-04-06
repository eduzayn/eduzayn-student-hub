
import { useState, useEffect } from 'react';
import { Matricula } from '@/types/matricula';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useMatricula(matriculaId?: string) {
  const [matricula, setMatricula] = useState<Matricula | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (matriculaId) {
      fetchMatricula(matriculaId);
    }
  }, [matriculaId]);

  const fetchMatricula = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('matriculas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setMatricula(data as Matricula);
    } catch (err: any) {
      setError(err);
      toast.error('Erro ao carregar a matrícula');
      console.error('Erro ao buscar matrícula:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateMatricula = async (updatedData: Partial<Matricula>) => {
    if (!matriculaId) return { success: false, error: new Error('ID da matrícula não fornecido') };
    
    try {
      setLoading(true);
      
      // Atualizar os dados da matrícula
      const { data, error } = await supabase
        .from('matriculas')
        .update(updatedData)
        .eq('id', matriculaId)
        .select();

      if (error) throw error;
      
      // Atualizar o estado local
      setMatricula(prev => prev ? { ...prev, ...updatedData } : null);
      
      toast.success('Matrícula atualizada com sucesso');
      return { success: true, data };
      
    } catch (err: any) {
      setError(err);
      toast.error('Erro ao atualizar a matrícula');
      console.error('Erro ao atualizar matrícula:', err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const createMatricula = async (matriculaData: Omit<Matricula, 'id'>) => {
    try {
      setLoading(true);
      
      // Criar nova matrícula
      const { data, error } = await supabase
        .from('matriculas')
        .insert([matriculaData])
        .select();

      if (error) throw error;
      
      toast.success('Matrícula criada com sucesso');
      return { success: true, data: data[0] };
      
    } catch (err: any) {
      setError(err);
      toast.error('Erro ao criar matrícula');
      console.error('Erro ao criar matrícula:', err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const cancelarMatricula = async (motivo: string) => {
    if (!matriculaId) return { success: false, error: new Error('ID da matrícula não fornecido') };
    
    try {
      setLoading(true);
      
      // Buscar o status atual antes de atualizar
      const { data: currentData, error: fetchError } = await supabase
        .from('matriculas')
        .select('status')
        .eq('id', matriculaId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const statusAnterior = currentData.status;
      
      // Atualizar o status da matrícula para inativo
      const { data, error } = await supabase
        .from('matriculas')
        .update({ status: 'inativo' })
        .eq('id', matriculaId)
        .select();

      if (error) throw error;
      
      // Registrar no histórico da matrícula
      const { error: historyError } = await supabase
        .from('historico_matricula')
        .insert([{
          matricula_id: matriculaId,
          status_anterior: statusAnterior,
          status_novo: 'inativo',
          motivo: motivo,
          alterado_por: (await supabase.auth.getUser()).data.user?.id
        }]);
        
      if (historyError) throw historyError;
      
      // Atualizar o estado local
      setMatricula(prev => prev ? { ...prev, status: 'inativo' } : null);
      
      toast.success('Matrícula cancelada com sucesso');
      return { success: true, data };
      
    } catch (err: any) {
      setError(err);
      toast.error('Erro ao cancelar a matrícula');
      console.error('Erro ao cancelar matrícula:', err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const trancarMatricula = async (motivo: string) => {
    if (!matriculaId) return { success: false, error: new Error('ID da matrícula não fornecido') };
    
    try {
      setLoading(true);
      
      // Buscar o status atual antes de atualizar
      const { data: currentData, error: fetchError } = await supabase
        .from('matriculas')
        .select('status')
        .eq('id', matriculaId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const statusAnterior = currentData.status;
      
      // Atualizar o status da matrícula para trancado
      const { data, error } = await supabase
        .from('matriculas')
        .update({ status: 'trancado' })
        .eq('id', matriculaId)
        .select();

      if (error) throw error;
      
      // Registrar no histórico da matrícula
      const { error: historyError } = await supabase
        .from('historico_matricula')
        .insert([{
          matricula_id: matriculaId,
          status_anterior: statusAnterior,
          status_novo: 'trancado',
          motivo: motivo,
          alterado_por: (await supabase.auth.getUser()).data.user?.id
        }]);
        
      if (historyError) throw historyError;
      
      // Atualizar o estado local
      setMatricula(prev => prev ? { ...prev, status: 'trancado' } : null);
      
      toast.success('Matrícula trancada com sucesso');
      return { success: true, data };
      
    } catch (err: any) {
      setError(err);
      toast.error('Erro ao trancar a matrícula');
      console.error('Erro ao trancar matrícula:', err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    matricula,
    loading,
    error,
    fetchMatricula,
    updateMatricula,
    createMatricula,
    cancelarMatricula,
    trancarMatricula
  };
}
