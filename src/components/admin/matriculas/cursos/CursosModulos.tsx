
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Video, File, BookOpen, RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Modulo {
  id: string;
  titulo: string;
  descricao: string | null;
  ordem: number;
}

interface Aula {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  duracao: number;
  ordem: number;
  url: string | null;
}

interface CursosModulosProps {
  cursoId: string;
}

const CursosModulos: React.FC<CursosModulosProps> = ({ cursoId }) => {
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

  const getTipoAulaIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'documento':
        return <File className="h-4 w-4" />;
      case 'quiz':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[250px] mb-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (modulos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Módulos do Curso</CardTitle>
          <CardDescription>
            Este curso ainda não possui módulos ou aulas cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <h3 className="text-lg font-medium">Nenhum módulo encontrado</h3>
              <p>Este curso ainda não possui conteúdo cadastrado.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={carregarModulos}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Módulos do Curso</CardTitle>
            <CardDescription>
              Total: {modulos.length} módulos, 
              {modulos.reduce((total, modulo) => total + modulo.aulas.length, 0)} aulas
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={carregarModulos}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {modulos.map((modulo) => (
            <AccordionItem key={modulo.id} value={modulo.id}>
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-left">
                  <Badge variant="outline" className="mr-2">
                    {modulo.ordem}
                  </Badge>
                  <div>
                    {modulo.titulo}
                    <p className="text-xs text-muted-foreground font-normal">
                      {modulo.aulas.length} aulas
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {modulo.descricao && (
                  <div className="mb-4 text-muted-foreground">
                    {modulo.descricao}
                  </div>
                )}
                
                <div className="space-y-2">
                  {modulo.aulas.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhuma aula cadastrada neste módulo
                    </div>
                  ) : (
                    modulo.aulas.map((aula) => (
                      <div 
                        key={aula.id} 
                        className="flex items-center justify-between p-3 rounded-md border bg-muted/30"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                            {getTipoAulaIcon(aula.tipo || 'video')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" size="sm" className="h-5 px-1">
                                {aula.ordem}
                              </Badge>
                              <p className="font-medium">{aula.titulo}</p>
                            </div>
                            {aula.descricao && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {aula.descricao}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="text-xs">{formatarDuracao(aula.duracao || 0)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default CursosModulos;
