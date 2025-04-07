
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Curso } from "@/types/matricula";

// Componentes refatorados
import CursoHeader from "./detalhes/CursoHeader";
import CursoEstatisticas from "./detalhes/CursoEstatisticas";
import CursoActions from "./detalhes/CursoActions";
import CursoInfoTab from "./detalhes/CursoInfoTab";
import CursoMatriculasTab from "./detalhes/CursoMatriculasTab";

// Mantém CursosModulos como está
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
        <CursoHeader curso={curso} />
        <CardContent>
          <CursoEstatisticas curso={curso} totalAlunos={totalAlunos} />
        </CardContent>
        <CursoActions cursoId={curso.id} onRefresh={carregarCurso} />
      </Card>

      <Tabs value={detailsTab} onValueChange={setDetailsTab} className="w-full">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="modulos">Módulos e Aulas</TabsTrigger>
          <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="pt-4">
          <CursoInfoTab curso={curso} />
        </TabsContent>

        <TabsContent value="modulos" className="pt-4">
          <CursosModulos cursoId={cursoId} />
        </TabsContent>

        <TabsContent value="matriculas" className="pt-4">
          <CursoMatriculasTab cursoId={cursoId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CursosDetalhes;
