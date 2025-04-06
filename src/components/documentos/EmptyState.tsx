
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, FileX } from "lucide-react";

interface EmptyStateProps {
  tipo: "pendentes" | "enviados";
}

const EmptyState: React.FC<EmptyStateProps> = ({ tipo }) => {
  if (tipo === "pendentes") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileCheck className="h-16 w-16 text-green-500 mb-4" />
          <p className="text-lg font-medium mb-2">Não há documentos pendentes!</p>
          <p className="text-muted-foreground text-center">
            Todos os seus documentos foram enviados e estão em análise ou já foram aprovados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileX className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Nenhum documento enviado</p>
        <p className="text-muted-foreground text-center">
          Você ainda não enviou nenhum documento. Confira a aba "Documentos Pendentes".
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
