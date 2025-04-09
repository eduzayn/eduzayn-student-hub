
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Video, File, Lock, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CursosModulosProps {
  cursoId: string;
}

interface Modulo {
  id: string;
  titulo: string;
  ordem: number;
  aulas: Aula[];
}

interface Aula {
  id: string;
  titulo: string;
  tipo: string;
  duracao?: number;
  bloqueada: boolean;
  concluida?: boolean;
  ordem: number;
}

const CursosModulos: React.FC<CursosModulosProps> = ({ cursoId }) => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarModulos();
  }, [cursoId]);

  const carregarModulos = async () => {
    setLoading(true);
    try {
      // Usar a tabela correta modulos_curso em vez de curso_modulos
      const { data, error } = await supabase
        .from('modulos_curso')
        .select(`
          id,
          titulo,
          ordem,
          aulas(
            id,
            titulo,
            tipo,
            duracao,
            ordem
          )
        `)
        .eq('curso_id', cursoId)
        .order('ordem');

      if (error) throw error;

      // Processar os módulos e adicionar propriedades necessárias às aulas
      const modulosProcessados = data?.map(modulo => ({
        ...modulo,
        aulas: (modulo.aulas || []).map(aula => ({
          ...aula,
          bloqueada: false, // Valor padrão, ajuste conforme necessário
          ordem: aula.ordem || 0
        })).sort((a, b) => a.ordem - b.ordem)
      })) || [];

      setModulos(modulosProcessados);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao carregar módulos:", err);
      setError(err.message || "Erro ao carregar módulos do curso");
      toast.error("Falha ao carregar conteúdo do curso");
      
      // Dados simulados como fallback
      setModulos([
        {
          id: "mod-1",
          titulo: "Módulo 1: Introdução",
          ordem: 1,
          aulas: [
            { id: "a-1", titulo: "Aula 1: Boas-vindas", tipo: "video", duracao: 600, bloqueada: false, ordem: 1 },
            { id: "a-2", titulo: "Aula 2: Objetivos do curso", tipo: "video", duracao: 720, bloqueada: false, ordem: 2 }
          ]
        },
        {
          id: "mod-2",
          titulo: "Módulo 2: Fundamentos",
          ordem: 2,
          aulas: [
            { id: "a-3", titulo: "Aula 3: Conceitos básicos", tipo: "video", duracao: 1200, bloqueada: false, ordem: 1 },
            { id: "a-4", titulo: "Aula 4: Exercícios", tipo: "arquivo", bloqueada: true, ordem: 2 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar ícone baseado no tipo de aula
  const renderIconeAula = (aula: Aula) => {
    if (aula.bloqueada) {
      return <Lock className="h-4 w-4 text-muted-foreground" />;
    }
    
    if (aula.concluida) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    
    switch (aula.tipo?.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'arquivo':
      case 'pdf':
      case 'documento':
        return <File className="h-4 w-4 text-amber-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4 flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>Erro ao carregar conteúdo do curso: {error}</span>
        </CardContent>
      </Card>
    );
  }

  if (modulos.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center py-8 text-muted-foreground">
          Nenhum conteúdo encontrado para este curso.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {modulos.map((modulo) => (
        <Card key={modulo.id}>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">{modulo.titulo}</h3>
            <div className="space-y-3">
              {modulo.aulas.map((aula) => (
                <div key={aula.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <div className="flex items-center gap-2">
                    {renderIconeAula(aula)}
                    <span className={aula.bloqueada ? "text-muted-foreground" : ""}>
                      {aula.titulo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {aula.duracao && (
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(aula.duracao / 60)}:{String(aula.duracao % 60).padStart(2, '0')}
                      </span>
                    )}
                    
                    {aula.bloqueada && (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        Bloqueada
                      </Badge>
                    )}
                    
                    {aula.concluida && (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Concluída
                      </Badge>
                    )}
                    
                    <Badge variant="outline">
                      {aula.tipo === 'video' ? 'Vídeo' : 
                       aula.tipo === 'arquivo' ? 'Arquivo' : 
                       aula.tipo || 'Conteúdo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CursosModulos;
