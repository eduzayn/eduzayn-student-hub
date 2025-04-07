
import React from "react";
import { 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Curso } from "@/types/matricula";

interface CursoHeaderProps {
  curso: Curso;
}

const CursoHeader: React.FC<CursoHeaderProps> = ({ curso }) => {
  return (
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
  );
};

export default CursoHeader;
