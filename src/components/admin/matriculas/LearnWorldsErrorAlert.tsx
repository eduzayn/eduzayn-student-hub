
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, WifiOff } from "lucide-react";

interface LearnWorldsErrorAlertProps {
  error?: string;
  offlineMode?: boolean;
  retry?: () => void;
}

const LearnWorldsErrorAlert: React.FC<LearnWorldsErrorAlertProps> = ({
  error,
  offlineMode,
  retry
}) => {
  if (offlineMode) {
    return (
      <Alert variant="warning" className="mb-4">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Modo offline ativado</AlertTitle>
        <AlertDescription>
          <p>A conexão com a API do LearnWorlds não está disponível. Operando com dados simulados.</p>
          {retry && (
            <button 
              onClick={retry}
              className="text-blue-600 hover:text-blue-800 underline mt-2 text-sm">
              Tentar novamente
            </button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro na API</AlertTitle>
        <AlertDescription>
          <p>{error}</p>
          {retry && (
            <button 
              onClick={retry}
              className="text-red-100 hover:text-white underline mt-2 text-sm">
              Tentar novamente
            </button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default LearnWorldsErrorAlert;
