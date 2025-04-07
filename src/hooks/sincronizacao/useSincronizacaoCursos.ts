
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ADMIN_BYPASS_JWT } from "@/hooks/auth/adminBypass";
import { supabase } from "@/integrations/supabase/client";

export const useSincronizacaoCursos = () => {
  const [isSyncingCursos, setIsSyncingCursos] = useState<boolean>(false);
  const [countCursos, setCountCursos] = useState<number | undefined>(undefined);
  const [lastSyncCursos, setLastSyncCursos] = useState<string | null>(null);

  const loadCountCursos = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('cursos')
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        setCountCursos(count);
      }
    } catch (error) {
      console.error("Erro ao carregar contagem de cursos:", error);
    }
  }, []);

  const sincronizarCursos = useCallback(async () => {
    setIsSyncingCursos(true);
    try {
      const response = await fetch("https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_BYPASS_JWT}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao sincronizar cursos: ${response.status}`);
      }

      const data = await response.json();
      
      // Inserir ou atualizar cursos na tabela cursos
      for (const curso of data.data) {
        // Verificar se o curso já existe pelo learning_worlds_id
        const { data: existingCourse, error: queryError } = await supabase
          .from('cursos')
          .select('id, titulo')
          .eq('learning_worlds_id', curso.id)
          .maybeSingle();
        
        if (queryError) {
          console.error(`Erro ao buscar curso ${curso.id}:`, queryError);
          continue;
        }
        
        // Converter duração para minutos (formato esperado)
        const duracao = curso.duration 
          ? parseInt(curso.duration.replace(/\D/g, '')) * 60  // Simplificação: assume formato "X horas"
          : 0;
        
        // Se já existe, atualizar
        if (existingCourse) {
          const { error: updateError } = await supabase
            .from('cursos')
            .update({
              titulo: curso.title,
              descricao: curso.description || '',
              valor_total: curso.price || 0,
              valor_mensalidade: curso.price ? (curso.price / 12) : 0,
              carga_horaria: duracao,
              imagem_url: curso.image || '',
              data_atualizacao: new Date().toISOString()
            })
            .eq('learning_worlds_id', curso.id);
          
          if (updateError) {
            console.error(`Erro ao atualizar curso ${curso.id}:`, updateError);
          }
        } else {
          // Se não existe, inserir novo registro
          const { error: insertError } = await supabase
            .from('cursos')
            .insert({
              titulo: curso.title,
              descricao: curso.description || '',
              codigo: `LW-${curso.id.substring(0, 6).toUpperCase()}`,
              learning_worlds_id: curso.id,
              valor_total: curso.price || 0,
              valor_mensalidade: curso.price ? (curso.price / 12) : 0,
              carga_horaria: duracao,
              imagem_url: curso.image || '',
              modalidade: 'EAD',
              data_criacao: new Date().toISOString(),
              data_atualizacao: new Date().toISOString()
            });
          
          if (insertError) {
            console.error(`Erro ao inserir curso ${curso.id}:`, insertError);
          }
        }
      }

      // Atualizar contagem e última sincronização
      setLastSyncCursos(new Date().toLocaleTimeString());
      loadCountCursos();
      toast.success(`${data.data.length} cursos sincronizados com sucesso!`);
    } catch (error) {
      console.error("Erro na sincronização de cursos:", error);
      toast.error("Erro ao sincronizar cursos. Verifique o console para mais detalhes.");
    } finally {
      setIsSyncingCursos(false);
    }
  }, [loadCountCursos]);

  return {
    isSyncingCursos,
    countCursos,
    lastSyncCursos,
    loadCountCursos,
    sincronizarCursos
  };
};
