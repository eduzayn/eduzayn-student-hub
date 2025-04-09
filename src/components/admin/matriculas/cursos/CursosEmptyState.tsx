
import React from "react";
import { BookOpen } from "lucide-react";

const CursosEmptyState: React.FC = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Nenhum curso encontrado</h3>
      <p className="text-muted-foreground mb-6">
        Não foram encontrados cursos disponíveis. Tente sincronizar os cursos com a plataforma LearnWorlds.
      </p>
    </div>
  );
};

export default CursosEmptyState;
