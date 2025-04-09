
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MatriculaErrorDisplayProps {
  offlineMode?: boolean;
  error?: string | null;
}

const MatriculaErrorDisplay: React.FC<MatriculaErrorDisplayProps> = ({ 
  offlineMode, 
  error 
}) => {
  return (
    <div className="space-y-4 mb-6">
      {offlineMode && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Modo Offline</AlertTitle>
          <AlertDescription>
            O sistema está operando em modo offline. Algumas funcionalidades podem estar limitadas.
            A integração com a plataforma LearnWorlds está em reformulação.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MatriculaErrorDisplay;
