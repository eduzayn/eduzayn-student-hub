
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Aula {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  duracao: number;
  ordem: number;
  url: string | null;
}

interface Modulo {
  id: string;
  titulo: string;
  descricao: string | null;
  ordem: number;
}

export const useModulos = (cursoId: string) => {
  const [loading, setLoading] = useState(true);
  const [modulos, setModulos] = useState<(Modulo & { aulas: Aula[] })[]>([]);

  useEffect(() => {
    if (cursoId) {
      carregarModulos();
    }
  }, [cursoId]);

  const carregarModulos = async () => {
    setLoading(true);
    try {
      // Buscar módulos
      const { data: modulosData, error: modulosError } = await supabase
        .from('modulos_curso')
        .select('*')
        .eq('curso_id', cursoId)
        .order('ordem', { ascending: true });

      if (modulosError) throw modulosError;
      
      if (!modulosData || modulosData.length === 0) {
        setModulos([]);
        setLoading(false);
        return;
      }

      // Buscar aulas para cada módulo
      const modulosComAulas = await Promise.all(
        modulosData.map(async (modulo) => {
          const { data: aulasData, error: aulasError } = await supabase
            .from('aulas')
            .select('*')
            .eq('modulo_id', modulo.id)
            .order('ordem', { ascending: true });

          if (aulasError) throw aulasError;
          
          return {
            ...modulo,
            aulas: aulasData || []
          };
        })
      );

      setModulos(modulosComAulas);
    } catch (error) {
      console.error("Erro ao carregar módulos e aulas:", error);
      toast.error("Falha ao carregar módulos do curso");
    } finally {
      setLoading(false);
    }
  };

  const formatarDuracao = (minutos: number = 0) => {
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return minutosRestantes > 0 ? `${horas}h ${minutosRestantes}min` : `${horas}h`;
  };

  const totalAulas = modulos.reduce((total, modulo) => total + modulo.aulas.length, 0);

  return {
    loading,
    modulos,
    carregarModulos,
    formatarDuracao,
    totalAulas
  };
};
