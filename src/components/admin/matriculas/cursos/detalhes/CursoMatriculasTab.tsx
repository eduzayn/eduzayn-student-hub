
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface CursoMatriculasTabProps {
  cursoId: string;
}

const CursoMatriculasTab: React.FC<CursoMatriculasTabProps> = ({ cursoId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Matrículas</CardTitle>
        <CardDescription>
          Lista de alunos matriculados neste curso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <a href={`/admin/matriculas/lista?cursoId=${cursoId}`}>
            <Users className="h-4 w-4 mr-2" />
            Ver Todas as Matrículas
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CursoMatriculasTab;
