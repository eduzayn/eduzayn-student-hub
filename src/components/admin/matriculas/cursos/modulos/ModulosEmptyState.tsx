
import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, RefreshCw } from "lucide-react";

interface ModulosEmptyStateProps {
  onRefresh: () => void;
}

const ModulosEmptyState: React.FC<ModulosEmptyStateProps> = ({ onRefresh }) => {
  return (
    <>
      <CardContent>
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <div className="text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2" />
            <h3 className="text-lg font-medium">Nenhum módulo encontrado</h3>
            <p>Este curso ainda não possui conteúdo cadastrado.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </CardFooter>
    </>
  );
};

export default ModulosEmptyState;
