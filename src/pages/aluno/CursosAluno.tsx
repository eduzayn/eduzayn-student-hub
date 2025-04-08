
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BookOpen, Grid3X3, ListFilter } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import CursoCard from "@/components/aluno/curso/CursoCard";
import { getUserCourses, getCurrentUserId, type LearnWorldsCourse } from "@/services/learnworlds-api";
import useLearnWorldsApi, { Course } from "@/hooks/useLearnWorldsApi";
import { toast } from "sonner";

const mapCourseToLearnWorldsCourse = (curso: Course): LearnWorldsCourse => {
  return {
    id: curso.id,
    title: curso.title,
    description: curso.description || curso.shortDescription || "",
    // Removendo 'image' e usando apenas 'thumbnail' que é a propriedade correta em LearnWorldsCourse
    price: curso.price || curso.price_final || 0, 
    modalidade: "EAD",
    access: curso.access || "paid",
    duration: curso.duration || "60 horas",
    progress: 0,
    thumbnail: curso.image || curso.courseImage || ""
  };
};

const CursosAluno: React.FC = () => {
  const [cursos, setCursos] = useState<LearnWorldsCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { getAllCourses } = useLearnWorldsApi();
  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getCurrentUserId();
        setUserId(id || "user123"); // Fallback para "user123" se não estiver autenticado
      } catch (err) {
        console.error("Erro ao buscar ID do usuário:", err);
        toast.error("Erro ao identificar usuário", { 
          description: "Usando perfil padrão para demonstração" 
        });
        setUserId("user123"); // Fallback em caso de erro
      }
    };
    
    fetchUserId();
  }, []);
  
  useEffect(() => {
    const fetchCursos = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        const cursosApi = await getAllCourses();
        
        if (cursosApi && Array.isArray(cursosApi)) {
          const cursosFormatados = cursosApi.map(mapCourseToLearnWorldsCourse);
          setCursos(cursosFormatados);
        } else {
          const data = await getUserCourses(userId);
          setCursos(data);
        }
        
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError("Não foi possível carregar seus cursos. Por favor, tente novamente mais tarde.");
        
        try {
          const fallbackData = await getUserCourses(userId);
          if (fallbackData && fallbackData.length > 0) {
            setCursos(fallbackData);
            setError(null);
            toast.info("Usando dados locais", { description: "Não foi possível conectar ao servidor" });
          }
        } catch (fallbackErr) {
          console.error("Erro também no método fallback:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCursos();
  }, [userId, getAllCourses]);
  
  const cursosEmAndamento = cursos.filter(curso => curso.progress > 0 && curso.progress < 100);
  const cursosNaoIniciados = cursos.filter(curso => curso.progress === 0);
  const cursosConcluidos = cursos.filter(curso => curso.progress === 100);
  
  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Meus Cursos</h1>
        </div>
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
  
  if (error && cursos.length === 0) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Cursos</h1>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-muted'}`}
            aria-label="Visualização em Grade"
          >
            <Grid3X3 size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-muted'}`}
            aria-label="Visualização em Lista"
          >
            <ListFilter size={18} />
          </button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {cursosEmAndamento.map(curso => (
                <CursoCard key={curso.id} curso={curso} visualizacao={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Você não tem cursos em andamento no momento.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Escolha um curso da aba "Não Iniciados" para começar seus estudos.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="nao-iniciados">
          {cursosNaoIniciados.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {cursosNaoIniciados.map(curso => (
                <CursoCard key={curso.id} curso={curso} visualizacao={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Você não tem cursos não iniciados.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="concluidos">
          {cursosConcluidos.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {cursosConcluidos.map(curso => (
                <CursoCard key={curso.id} curso={curso} visualizacao={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Você ainda não concluiu nenhum curso.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Continue estudando para receber seu certificado!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CursosAluno;
