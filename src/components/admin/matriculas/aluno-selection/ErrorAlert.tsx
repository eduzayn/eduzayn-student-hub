
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  error: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  // Detectar se o erro está relacionado a OAuth
  const isOAuthError = error?.toLowerCase().includes("access_token") || 
                       error?.toLowerCase().includes("oauth") ||
                       error?.toLowerCase().includes("token");
  
  // Detectar erro específico de client_id
  const isClientIdError = error?.toLowerCase().includes("client_id") || 
                          error?.toLowerCase().includes("missing client_id");

  // Detectar erro de autorização
  const isAuthError = error?.toLowerCase().includes("401") || 
                      error?.toLowerCase().includes("403") ||
                      error?.toLowerCase().includes("autorização");
  
  return (
    <Alert variant="destructive" className="mb-4">
      {isOAuthError ? (
        <Lock className="h-4 w-4" />
      ) : isAuthError ? (
        <Info className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      <AlertTitle>
        {isOAuthError 
          ? "Erro de Autenticação OAuth"
          : isAuthError
            ? "Erro de Autorização API"
            : "Erro ao carregar alunos"
        }
      </AlertTitle>
      <AlertDescription className="mt-2 text-sm">
        {isClientIdError ? (
          <>
            <p>A autenticação OAuth com a LearnWorlds falhou. O client_id não foi encontrado ou é inválido.</p>
            <p className="mt-1">Verifique se as credenciais <strong>LEARNWORLDS_CLIENT_ID</strong> e <strong>LEARNWORLDS_CLIENT_SECRET</strong> estão configuradas corretamente nas variáveis de ambiente da função edge.</p>
          </>
        ) : isOAuthError ? (
          <>
            <p>A autenticação OAuth com a LearnWorlds falhou. O acesso aos dados de alunos requer um token OAuth válido.</p>
            <p className="mt-1">Verifique as credenciais nas configurações da função edge.</p>
          </>
        ) : isAuthError ? (
          <>
            <p>Erro de autorização na API do LearnWorlds. O sistema não conseguiu autenticar usando o token fornecido.</p>
            <p className="mt-1">Verifique se o token de API está correto e possui as permissões necessárias.</p>
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
