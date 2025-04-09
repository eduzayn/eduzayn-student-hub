
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Lock } from "lucide-react";

interface ErrorAlertProps {
  error: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  // Detectar se o erro está relacionado a OAuth
  const isOAuthError = error?.toLowerCase().includes("access_token") || 
                       error?.toLowerCase().includes("oauth") ||
                       error?.toLowerCase().includes("token");
  
  return (
    <Alert variant="destructive" className="mb-4">
      {isOAuthError ? (
        <Lock className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      <AlertTitle>
        {isOAuthError 
          ? "Erro de Autenticação OAuth"
          : "Erro ao carregar alunos"
        }
      </AlertTitle>
      <AlertDescription className="mt-2 text-sm">
        {isOAuthError ? (
          <>
            <p>A autenticação OAuth com a LearnWorlds falhou. O acesso aos dados de alunos requer um token OAuth válido.</p>
            <p className="mt-1">Verifique as credenciais <strong>client_id</strong> e <strong>client_secret</strong> nas configurações da função edge.</p>
          </>
        ) : (
          <>
            <p>{error}</p>
            <p className="mt-1 text-xs">Usando dados simulados como alternativa.</p>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
