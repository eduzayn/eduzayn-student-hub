
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ADMIN_BYPASS_JWT } from "@/hooks/auth/adminBypass";
import { supabase } from "@/integrations/supabase/client";

export const useSincronizacaoAlunos = () => {
  const [isSyncingAlunos, setIsSyncingAlunos] = useState<boolean>(false);
  const [countAlunos, setCountAlunos] = useState<number | undefined>(undefined);
  const [lastSyncAlunos, setLastSyncAlunos] = useState<string | null>(null);

  const loadCountAlunos = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        setCountAlunos(count);
      }
    } catch (error) {
      console.error("Erro ao carregar contagem de alunos:", error);
    }
  }, []);

  const sincronizarAlunos = useCallback(async () => {
    setIsSyncingAlunos(true);
    try {
      const response = await fetch("https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_BYPASS_JWT}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao sincronizar alunos: ${response.status}`);
      }

      const data = await response.json();
      
      // Inserir ou atualizar alunos na tabela profiles
      for (const aluno of data.data) {
        // Verificar se o aluno já existe
        const { data: existingUser, error: queryError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', aluno.email)
          .maybeSingle();
        
        if (queryError) {
          console.error(`Erro ao buscar aluno ${aluno.email}:`, queryError);
          continue;
        }
        
        // Se já existe, atualizar
        if (existingUser) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              first_name: aluno.firstName,
              last_name: aluno.lastName,
              phone: aluno.phoneNumber || '',
              updated_at: new Date().toISOString()
            })
            .eq('email', aluno.email);
          
          if (updateError) {
            console.error(`Erro ao atualizar aluno ${aluno.email}:`, updateError);
          }
        } else {
          // Se não existe, inserir novo registro
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: crypto.randomUUID(), // Gerar UUID
              first_name: aluno.firstName,
              last_name: aluno.lastName,
              email: aluno.email,
              phone: aluno.phoneNumber || '',
              role: 'student',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (insertError) {
            console.error(`Erro ao inserir aluno ${aluno.email}:`, insertError);
          }
        }
      }

      // Atualizar contagem e última sincronização
      setLastSyncAlunos(new Date().toLocaleTimeString());
      loadCountAlunos();
      toast.success(`${data.data.length} alunos sincronizados com sucesso!`);
    } catch (error) {
      console.error("Erro na sincronização de alunos:", error);
      toast.error("Erro ao sincronizar alunos. Verifique o console para mais detalhes.");
    } finally {
      setIsSyncingAlunos(false);
    }
  }, [loadCountAlunos]);

  return {
    isSyncingAlunos,
    countAlunos,
    lastSyncAlunos,
    loadCountAlunos,
    sincronizarAlunos
  };
};
