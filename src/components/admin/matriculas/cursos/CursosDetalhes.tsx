
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, DollarSign, Users, BookOpen, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Curso } from "@/types/matricula";
import CursosModulos from "./CursosModulos";

interface CursosDetalhesProps {
  cursoId: string;
}

const CursosDetalhes: React.FC<CursosDetalhesProps> = ({ cursoId }) => {
  const [loading, setLoading] = useState(true);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [detailsTab, setDetailsTab] = useState("info");

  useEffect(() => {
    if (cursoId) {
      carregarCurso();
      carregarTotalAlunos();
    }
  }, [cursoId]);

  const carregarCurso = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .eq('id', cursoId)
        .single();

      if (error) throw error;
      setCurso(data);
    } catch (error) {
      console.error("Erro ao carregar detalhes do curso:", error);
      toast.error("Falha ao carregar detalhes do curso");
    } finally {
      setLoading(false);
    }
  };

  const carregarTotalAlunos = async () => {
    try {
      const { count, error } = await supabase
        .from('matriculas')
        .select('*', { count: 'exact', head: true })
        .eq('curso_id', cursoId);

      if (error) throw error;
      setTotalAlunos(count || 0);
    } catch (error) {
      console.error("Erro ao carregar total de alunos:", error);
    }
  };

  const formatarMoeda = (valor: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!curso) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Curso não encontrado ou foi removido.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className="bg-primary/10">
              {curso.modalidade || 'EAD'}
            </Badge>
            <Badge variant="outline">
              Código: {curso.codigo}
            </Badge>
            {curso.learning_worlds_id && (
              <Badge variant="secondary">
                LearnWorlds ID: {curso.learning_worlds_id}
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl">{curso.titulo}</CardTitle>
          {curso.descricao && (
            <CardDescription className="mt-2">
              {curso.descricao}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-muted/20">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Valor Total</span>
                </div>
                <p className="text-2xl font-bold">{formatarMoeda(curso.valor_total)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Mensalidade</span>
                </div>
                <p className="text-2xl font-bold">{formatarMoeda(curso.valor_mensalidade)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Carga Horária</span>
                </div>
                <p className="text-2xl font-bold">
                  {curso.carga_horaria || 0}h
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Alunos Matriculados</span>
                </div>
                <p className="text-2xl font-bold">{totalAlunos}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={carregarCurso}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button asChild>
            <a 
              href={`/admin/matriculas/nova?cursoId=${curso.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Users className="h-4 w-4 mr-2" />
              Nova Matrícula
            </a>
          </Button>
        </CardFooter>
      </Card>

      <Tabs value={detailsTab} onValueChange={setDetailsTab} className="w-full">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="modulos">Módulos e Aulas</TabsTrigger>
          <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Código do Curso</h3>
                  <p>{curso.codigo}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Modalidade</h3>
                  <p>{curso.modalidade || 'EAD'}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Parcelas</h3>
                  <p>{curso.total_parcelas || 12}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge variant={curso.ativo ? "success" : "destructive"}>
                    {curso.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                {curso.learning_worlds_id && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">ID na LearnWorlds</h3>
                      <p>{curso.learning_worlds_id}</p>
                    </div>
                  </>
                )}
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data de Cadastro</h3>
                  <p>
                    {curso.data_criacao ? new Date(curso.data_criacao).toLocaleDateString('pt-BR') : 'Não disponível'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modulos" className="pt-4">
          <CursosModulos cursoId={cursoId} />
        </TabsContent>

        <TabsContent value="matriculas" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Matrículas</CardTitle>
              <CardDescription>
                Lista de alunos matriculados neste curso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href={`/admin/matriculas/lista?cursoId=${curso.id}`}>
                  <Users className="h-4 w-4 mr-2" />
                  Ver Todas as Matrículas
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CursosDetalhes;
