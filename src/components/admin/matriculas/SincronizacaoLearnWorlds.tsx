
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Settings } from "lucide-react";

const SincronizacaoLearnWorlds: React.FC = () => {
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error" | "testing">("idle");
  const [apiResponse, setApiResponse] = useState<string>("");

  const testLearnWorldsApi = async () => {
    setIsTestingApi(true);
    setApiStatus("testing");
    setApiResponse("");

    try {
      const response = await fetch("/functions/v1/learnworlds-api/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer admin-bypass-token" // Usando token de bypass para teste
        }
      });

      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
      
      if (response.ok) {
        setApiStatus("success");
      } else {
        setApiStatus("error");
      }
    } catch (error) {
      console.error("Erro ao testar API:", error);
      setApiResponse(error instanceof Error ? error.message : "Erro desconhecido");
      setApiStatus("error");
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <span>Configurações da Sincronização</span>
        </CardTitle>
        <CardDescription>
          Gerencie as configurações de conexão com a plataforma LearnWorlds
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Esta seção permite configurar e testar a conexão com a API da LearnWorlds. 
            As credenciais para acesso à API são gerenciadas através das variáveis de ambiente do servidor.
          </p>
          
          <Alert variant={apiStatus === "error" ? "destructive" : "default"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Status da Integração</AlertTitle>
            <AlertDescription>
              A integração com a LearnWorlds requer credenciais de API válidas. 
              Utilize o botão abaixo para verificar o status da conexão.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button 
                onClick={testLearnWorldsApi} 
                disabled={isTestingApi}
                variant={apiStatus === "success" ? "outline" : "default"}
              >
                {isTestingApi ? "Testando..." : "Testar Conexão com API"}
              </Button>
            </div>
            
            {apiResponse && (
              <div className="p-4 bg-muted rounded-md">
                <p className="font-semibold mb-2 text-sm">Resposta da API:</p>
                <pre className="text-xs overflow-x-auto">{apiResponse}</pre>
              </div>
            )}
          </div>
          
          <div className="bg-muted p-4 rounded-md mt-6">
            <h3 className="font-medium mb-2">Informações sobre a API LearnWorlds</h3>
            <p className="text-sm text-muted-foreground">
              A API LearnWorlds permite integrar recursos e dados entre seu site e a plataforma LearnWorlds.
              Para mais informações, consulte a <a href="https://www.learnworlds.dev/" target="_blank" rel="noopener noreferrer" className="text-primary underline">documentação oficial</a>.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <p className="text-xs text-muted-foreground">
          Status da conexão: {apiStatus === "success" ? "Conectado" : apiStatus === "testing" ? "Testando..." : apiStatus === "error" ? "Falha na conexão" : "Não testado"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default SincronizacaoLearnWorlds;
