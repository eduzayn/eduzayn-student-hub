
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldAlert, WifiOff } from "lucide-react";
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
  // Verificar se o erro é relacionado a autenticação (401)
  const isAuthError = error?.includes('401') || 
                      error?.toLowerCase().includes('token') || 
                      error?.toLowerCase().includes('autenticação') ||
                      error?.toLowerCase().includes('autorização') ||
                      detalhesErro?.includes('401') ||
                      detalhesErro?.toLowerCase().includes('não autorizado');

  return (
    <>
      {error && <LearnWorldsErrorAlert errorMessage={error} />}
      
      {isAuthError && (
        <Alert variant="destructive" className="mb-6 border-amber-600 bg-amber-50">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Erro de Autenticação</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Foi detectado um erro de autenticação (HTTP 401). Isso geralmente ocorre por:</p>
            <ul className="list-disc pl-6 text-sm">
              <li>Token de API inválido ou expirado</li>
              <li>Problemas com as credenciais configuradas</li>
              <li>Permissões insuficientes para o usuário atual</li>
            </ul>
            <p className="text-sm font-medium mt-2">
              Verifique as configurações de API em "Configurações &gt; Integrações" ou contate o suporte.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {detalhesErro && !isAuthError && (
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
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Modo Offline</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>O sistema está operando em modo offline. Algumas funcionalidades podem estar limitadas.</p>
            <p className="text-sm">Possíveis causas:</p>
            <ul className="list-disc pl-6 text-sm">
              <li>Problemas de conexão com os serviços LearnWorlds</li>
              <li>Erro nas funções edge do Supabase</li>
              <li>Credenciais inválidas ou erros de configuração</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SincronizacaoAlertas;
