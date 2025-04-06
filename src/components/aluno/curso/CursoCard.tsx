
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, BookOpen, Clock } from "lucide-react";
import { type LearnWorldsCourse } from "@/services/learnworlds-api";

interface CursoCardProps {
  curso: LearnWorldsCourse;
  visualizacao?: 'grid' | 'list';
}

const CursoCard: React.FC<CursoCardProps> = ({ curso, visualizacao = 'grid' }) => {
  // Formatar descrição para limitar tamanho
  const descriçãoFormatada = curso.description && curso.description.length > 100
    ? `${curso.description.substring(0, 100)}...` 
    : curso.description;

  // Determinar a cor do progresso com base no valor
  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress > 70) return "bg-emerald-500"; 
    if (progress > 30) return "bg-blue-500";
    return "bg-primary";
  };

  // Renderização no modo lista
  if (visualizacao === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          <div className="w-[120px] h-[90px] overflow-hidden">
            <img 
              src={curso.thumbnail || "https://via.placeholder.com/120x90?text=Curso"} 
              alt={curso.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-lg">{curso.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progresso</span>
                <span className="font-medium">{curso.progress}%</span>
              </div>
              <Progress 
                value={curso.progress} 
                className="h-2" 
                indicatorClassName={getProgressColor(curso.progress)} 
              />
            </CardContent>
            <CardFooter className="py-2 px-3 mt-auto flex justify-between items-center">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" /> 
                <span>{curso.duration || "Auto-estudo"}</span>
              </div>
              <Button asChild size="sm" variant="outline" className="ml-auto">
                <Link to={`/dashboard/cursos/${curso.id}`}>
                  Acessar <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    );
  }
  
  // Renderização no modo grade (padrão)
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={curso.thumbnail || "https://via.placeholder.com/300x180?text=Curso"} 
          alt={curso.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{curso.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{descriçãoFormatada}</p>
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between text-xs">
            <span>Progresso</span>
            <span className="font-medium">{curso.progress}%</span>
          </div>
          <Progress 
            value={curso.progress} 
            className="h-2" 
            indicatorClassName={getProgressColor(curso.progress)} 
          />
        </div>
        {curso.duration && (
          <div className="flex items-center mt-3 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" /> 
            <span>{curso.duration}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link to={`/dashboard/cursos/${curso.id}`}>
            <span>Acessar Curso</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CursoCard;
