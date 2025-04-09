
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, RefreshCw } from "lucide-react";

export interface SincronizacaoAlertasProps {
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
      {offlineMode && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Modo Offline</AlertTitle>
          <AlertDescription>
            O sistema está operando em modo offline. Algumas funcionalidades podem estar limitadas.
          </AlertDescription>
        </Alert>
      )}
      
      {error && !offlineMode && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro na API</AlertTitle>
          <AlertDescription>
            {error}
            {detalhesErro && <div className="mt-2 text-sm">{detalhesErro}</div>}
          </AlertDescription>
        </Alert>
      )}
      
      {detalhesErro && !error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro na Sincronização</AlertTitle>
          <AlertDescription>
            {detalhesErro}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SincronizacaoAlertas;
