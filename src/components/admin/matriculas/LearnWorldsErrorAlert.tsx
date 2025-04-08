
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LearnWorldsErrorAlertProps {
  errorMessage: string;
  showHelp?: boolean;
}

const LearnWorldsErrorAlert: React.FC<LearnWorldsErrorAlertProps> = ({ errorMessage, showHelp = true }) => {
  // Determinar tipo de erro para personalização da mensagem
  const isConnectionError = errorMessage.includes('Failed to fetch') || 
                            errorMessage.includes('conexão') ||
                            errorMessage.includes('rede');
  
  const isAuthError = errorMessage.includes('client_id') || 
                      errorMessage.includes('token') || 
                      errorMessage.includes('401') ||
                      errorMessage.includes('403') ||
                      errorMessage.includes('autorização');

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro na integração com LearnWorlds</AlertTitle>
      <AlertDescription className="space-y-2">
        <div className="font-normal">{errorMessage}</div>
        
        {showHelp && (
          <div className="mt-3 text-xs">
            {isConnectionError && (
              <div className="space-y-1">
                <p className="font-medium">Soluções possíveis:</p>
                <ul className="list-disc pl-5">
                  <li>Verifique se a função edge está ativa no painel do Supabase</li>
                  <li>Confirme que não há problemas de configuração CORS</li>
                  <li>Verifique se o URL da API está correto</li>
                </ul>
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => window.open('https://bioarzkfmcobctblzztm.supabase.co/functions', '_blank')}
                  >
                    Verificar funções edge
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
            
            {isAuthError && (
              <div className="space-y-1">
                <p className="font-medium">Soluções possíveis:</p>
                <ul className="list-disc pl-5">
                  <li>Verifique se o School ID está configurado corretamente</li>
                  <li>Confirme que o token API tem as permissões necessárias</li>
                  <li>Verifique se as credenciais de API estão atualizadas</li>
                </ul>
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => window.open('https://bioarzkfmcobctblzztm.supabase.co/settings/functions', '_blank')}
                  >
                    Verificar segredos
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default LearnWorldsErrorAlert;
