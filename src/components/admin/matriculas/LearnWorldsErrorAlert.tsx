
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LearnWorldsErrorAlertProps {
  errorMessage: string;
}

const LearnWorldsErrorAlert: React.FC<LearnWorldsErrorAlertProps> = ({ errorMessage }) => {
  // Determinando se é um erro de API offline ou outro tipo de erro
  const isOfflineError = errorMessage.includes("offline") || 
                          errorMessage.includes("simulados") ||
                          errorMessage.includes("mockados");
  
  return (
    <Alert variant={isOfflineError ? "default" : "destructive"} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {isOfflineError ? "Modo Offline Ativo" : "Erro na API LearnWorlds"}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {errorMessage}
        {isOfflineError && (
          <p className="mt-1 text-sm">
            Os dados exibidos são simulados para demonstração. Conecte-se à API real para visualizar dados atuais.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default LearnWorldsErrorAlert;
