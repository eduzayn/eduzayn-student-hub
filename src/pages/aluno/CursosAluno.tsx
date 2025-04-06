
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import CursoCard from "@/components/aluno/curso/CursoCard";
import { getUserCourses, type LearnWorldsCourse } from "@/services/learnworlds-api";

const CursosAluno: React.FC = () => {
  const [cursos, setCursos] = useState<LearnWorldsCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simula o ID do usuário atual (normalmente viria do contexto de autenticação)
  const userId = "user123";
  
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const data = await getUserCourses(userId);
        setCursos(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError("Não foi possível carregar seus cursos. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCursos();
  }, [userId]);
  
  // Filtra cursos por progresso
  const cursosEmAndamento = cursos.filter(curso => curso.progress > 0 && curso.progress < 100);
  const cursosNaoIniciados = cursos.filter(curso => curso.progress === 0);
  const cursosConcluidos = cursos.filter(curso => curso.progress === 100);
  
  // Renderização de carregamento
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Meus Cursos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-[180px] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Exibição de erro
  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Meus Cursos</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Meus Cursos</h1>
      
      <Tabs defaultValue="em-andamento" className="space-y-4">
        <TabsList>
          <TabsTrigger value="em-andamento" className="relative">
            Em Andamento
            {cursosEmAndamento.length > 0 && (
              <span className="ml-2 text-xs bg-primary text-white rounded-full px-1.5 py-0.5">
                {cursosEmAndamento.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="nao-iniciados">
            Não Iniciados
            {cursosNaoIniciados.length > 0 && (
              <span className="ml-2 text-xs bg-gray-500 text-white rounded-full px-1.5 py-0.5">
                {cursosNaoIniciados.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="concluidos">
            Concluídos
            {cursosConcluidos.length > 0 && (
              <span className="ml-2 text-xs bg-green-500 text-white rounded-full px-1.5 py-0.5">
                {cursosConcluidos.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="em-andamento">
          {cursosEmAndamento.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursosEmAndamento.map(curso => (
                <CursoCard key={curso.id} curso={curso} />
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-muted-foreground">
              Você não tem cursos em andamento no momento.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="nao-iniciados">
          {cursosNaoIniciados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursosNaoIniciados.map(curso => (
                <CursoCard key={curso.id} curso={curso} />
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-muted-foreground">
              Você não tem cursos não iniciados.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="concluidos">
          {cursosConcluidos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursosConcluidos.map(curso => (
                <CursoCard key={curso.id} curso={curso} />
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-muted-foreground">
              Você ainda não concluiu nenhum curso.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CursosAluno;
