
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";

interface APIStatusProps {
  isConnected: boolean;
  lastChecked: string | null;
  isLoading: boolean;
  responseData: any;
  onRefresh: () => void;
}

const APIStatusCard: React.FC<APIStatusProps> = ({ 
  isConnected, 
  lastChecked, 
  isLoading, 
  responseData,
  onRefresh 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Status da API</h3>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Verificar Conexão
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="animate-spin h-4 w-4" />
          <p>Verificando conexão com a API...</p>
        </div>
      ) : (
        <Alert variant={isConnected ? "default" : "destructive"}>
          <div className="flex items-center">
            {isConnected ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2" />
            )}
            <AlertTitle>
              {isConnected ? "API Conectada" : "Falha na conexão com a API LearnWorlds"}
            </AlertTitle>
          </div>
          <AlertDescription className="pt-2">
            {isConnected 
              ? "A conexão com a API LearnWorlds está funcionando corretamente."
              : "Não foi possível estabelecer conexão com a API LearnWorlds. Verifique as credenciais ou tente novamente mais tarde."}
            {lastChecked && (
              <p className="text-xs text-muted-foreground mt-1">
                Última verificação: {lastChecked}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {responseData && (
        <div className="bg-slate-50 p-4 rounded-md border mt-4">
          <h4 className="text-sm font-medium mb-2">Resposta da API:</h4>
          <pre className="text-xs bg-slate-100 p-3 rounded overflow-auto max-h-48">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default APIStatusCard;
