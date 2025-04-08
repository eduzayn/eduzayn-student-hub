
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import LearnWorldsErrorAlert from "@/components/admin/matriculas/LearnWorldsErrorAlert";

interface SincronizacaoAlertasProps {
  error: string | null;
  detalhesErro: string | null;
  offlineMode: boolean;
}

const SincronizacaoAlertas: React.FC<SincronizacaoAlertasProps> = ({
  error,
  detalhesErro,
  offlineMode
}) => {
  return (
    <>
      {error && <LearnWorldsErrorAlert errorMessage={error} />}
      
      {detalhesErro && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Detalhes do Erro</AlertTitle>
          <AlertDescription className="break-words whitespace-pre-wrap">
            {detalhesErro}
          </AlertDescription>
        </Alert>
      )}
      
      {offlineMode && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Modo Offline</AlertTitle>
          <AlertDescription>
            O sistema está operando em modo offline. Algumas funcionalidades podem estar limitadas.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SincronizacaoAlertas;
