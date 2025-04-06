
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  message?: string;
  error?: string | null;  // Essa propriedade já existe
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, error }) => {
  // Usar error ou message, o que estiver disponível
  const errorMessage = error || message || "Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.";

  return (
    <Card className="border-red-200">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Não foi possível carregar seus certificados</h3>
        <p className="text-muted-foreground text-center mb-4">
          {errorMessage}
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
