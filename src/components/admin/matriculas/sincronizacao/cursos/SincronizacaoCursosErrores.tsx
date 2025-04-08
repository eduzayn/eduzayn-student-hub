
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface SincronizacaoCursosErroresProps {
  detalhesErro: string | null;
  logs: string[];
}

const SincronizacaoCursosErrores: React.FC<SincronizacaoCursosErroresProps> = ({ detalhesErro, logs }) => {
  if (!detalhesErro && !logs.some(log => log.includes("access_denied"))) return null;

  return (
    <>
      {detalhesErro && detalhesErro.includes("API") && (
        <Alert variant="destructive" className="mb-4">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Erro de autenticação da API</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>A autenticação com a API do LearnWorlds falhou. Isso geralmente significa que:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A API Key não está configurada corretamente</li>
              <li>A API Key não tem permissões suficientes</li>
              <li>A API LearnWorlds rejeitou a solicitação de autenticação</li>
            </ul>
            <p className="mt-2 text-sm">
              <span className="font-medium">Solução:</span> Verifique se a API Key está correta nas configurações de segredos da função edge.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {detalhesErro && detalhesErro.includes("Failed to fetch") && (
        <Alert variant="destructive" className="mb-4 border-amber-600">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de conexão com a função edge</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Não foi possível conectar à função edge do Supabase. Isso geralmente significa que:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A função edge "learnworlds-sync" pode estar indisponível</li>
              <li>Há um problema de rede ou CORS impedindo a conexão</li>
              <li>A função edge precisa ser reimplementada</li>
            </ul>
            <p className="mt-2 text-sm">
              <span className="font-medium">Solução:</span> Verifique os logs da função edge no painel do Supabase e certifique-se de que ela está implementada corretamente.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {logs.some(log => log.includes("access_denied")) && (
        <Alert variant="destructive" className="mb-4 border-amber-600">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de autorização na API LearnWorlds</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>A API do LearnWorlds retornou um erro de "access_denied". Isso geralmente significa que:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>O token API obtido não tem permissões suficientes</li>
              <li>A sua conta LearnWorlds não tem acesso à API de cursos</li>
            </ul>
            <p className="mt-2 text-sm">
              <span className="font-medium">Solução:</span> Verifique se a API Key tem as permissões necessárias para acessar a API de cursos.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SincronizacaoCursosErrores;
