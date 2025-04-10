import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Users, FileText, Award, AlertCircle } from "lucide-react";

import LessonList from "@/components/aluno/curso/LessonList";
import VideoPlayer from "@/components/aluno/curso/VideoPlayer";
import { 
  getUserCourses, 
  getCourseLessons,
  getCurrentUserId,
  markLessonAsCompleted
} from "@/services/learnworlds-api";
import { LearnWorldsCourse, LearnWorldsLesson } from "@/hooks/learnworlds/types/cursoTypes";

const DetalheCurso: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const [course, setCourse] = useState<LearnWorldsCourse | null>(null);
  const [lessons, setLessons] = useState<LearnWorldsLesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id || "user123"); // Fallback para "user123" se não estiver autenticado
    };
    
    fetchUserId();
  }, []);
  
  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId || !userId) {
        return;
      }

      try {
        setLoading(true);
        
        const courses = await getUserCourses(userId);
        const foundCourse = courses.find(c => c.id === courseId);
        
        if (!foundCourse) {
          setError("Curso não encontrado");
          setLoading(false);
          return;
        }
        
        setCourse(foundCourse);
        
        const courseLessons = await getCourseLessons(courseId, userId);
        setLessons(courseLessons);
        
        const firstIncomplete = courseLessons.find(lesson => !lesson.completed);
        setCurrentLessonId(firstIncomplete ? firstIncomplete.id : (courseLessons.length > 0 ? courseLessons[0].id : null));
        
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados do curso:", err);
        setError("Não foi possível carregar o curso. Por favor, tente novamente mais tarde.");
        setLoading(false);
        
        toast({
          variant: "destructive",
          title: "Erro ao carregar curso",
          description: "Ocorreu um erro ao carregar os dados do curso. Por favor, tente novamente.",
        });
      }
    };
    
    loadCourseData();
  }, [courseId, userId, toast]);
  
  const handleSelectLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson && !lesson.locked) {
      setCurrentLessonId(lessonId);
    } else if (lesson && lesson.locked) {
      toast({
        variant: "destructive",
        title: "Aula bloqueada",
        description: "Esta aula ainda não está disponível para visualização.",
      });
    }
  };
  
  const handleLessonComplete = async () => {
    if (!currentLessonId || !courseId || !userId) return;
    
    try {
      await markLessonAsCompleted(courseId, currentLessonId, userId);
      
      setLessons(prevLessons => 
        prevLessons.map(lesson => 
          lesson.id === currentLessonId 
            ? { ...lesson, completed: true } 
            : lesson
        )
      );
      
      if (course) {
        const completedLessons = lessons.filter(l => 
          l.completed || l.id === currentLessonId
        ).length;
        
        const newProgress = Math.floor((completedLessons / lessons.length) * 100);
        setCourse({
          ...course,
          progress: newProgress
        });
      }
      
      toast({
        title: "Aula concluída!",
        description: "Seu progresso foi salvo com sucesso.",
      });
      
      const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
      const nextIncompleteLesson = lessons.slice(currentIndex + 1).find(l => !l.completed && !l.locked);
      
      if (nextIncompleteLesson) {
        setCurrentLessonId(nextIncompleteLesson.id);
      }
    } catch (error) {
      console.error("Erro ao marcar aula como concluída:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar progresso",
        description: "Não foi possível salvar seu progresso. Tente novamente mais tarde.",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-2" />
            <h2 className="text-2xl font-bold mb-2">Erro ao carregar curso</h2>
            <p className="text-muted-foreground">{error || "Curso não encontrado"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const currentLesson = lessons.find(l => l.id === currentLessonId) || null;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{lessons.length} aulas</span>
          <span>•</span>
          <span>{course.progress}% concluído</span>
        </div>
        <Progress value={course.progress} className="h-2 mt-2" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {currentLesson ? (
            <VideoPlayer 
              lesson={currentLesson} 
              courseId={courseId || ""} 
              userId={userId || "user123"} 
              onComplete={handleLessonComplete} 
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Selecione uma aula para começar a assistir.</p>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="conteudo">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
              <TabsTrigger value="materiais">Materiais</TabsTrigger>
              <TabsTrigger value="forum">Fórum</TabsTrigger>
              <TabsTrigger value="notas">Notas</TabsTrigger>
            </TabsList>
            <TabsContent value="conteudo" className="p-4">
              <div className="prose max-w-none">
                <h3>Sobre este curso</h3>
                <p>{course.description}</p>
                <h4>Objetivos de aprendizagem</h4>
                <ul>
                  <li>Compreender os conceitos fundamentais</li>
                  <li>Aplicar o conhecimento em projetos práticos</li>
                  <li>Desenvolver habilidades avançadas na área</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="materiais" className="p-4">
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Material complementar.pdf</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Exercícios práticos.zip</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="forum" className="p-4">
              <div className="text-center p-4">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">Fórum de discussão</h3>
                <p className="text-muted-foreground">Participe da comunidade e tire suas dúvidas com professores e outros alunos.</p>
              </div>
            </TabsContent>
            <TabsContent value="notas" className="p-4">
              <div className="text-center p-4">
                <Award className="h-12 w-12 mx-auto text-amber-500 mb-2" />
                <h3 className="text-lg font-medium">Avaliações</h3>
                <p className="text-muted-foreground">Seu progresso nas avaliações aparecerá aqui quando disponível.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <LessonList 
                lessons={lessons}
                currentLessonId={currentLessonId}
                onSelectLesson={handleSelectLesson}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetalheCurso;
