
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExternalLink } from "lucide-react";
import { type LearnWorldsCourse } from "@/services/learnworlds-api";

interface CursoCardProps {
  curso: LearnWorldsCourse;
}

const CursoCard: React.FC<CursoCardProps> = ({ curso }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={curso.thumbnail} 
          alt={curso.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{curso.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{curso.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progresso</span>
            <span className="font-medium">{curso.progress}%</span>
          </div>
          <Progress value={curso.progress} className="h-2" />
        </div>
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
