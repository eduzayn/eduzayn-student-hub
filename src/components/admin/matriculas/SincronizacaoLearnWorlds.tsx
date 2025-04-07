
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Settings, RefreshCw, Check, X, AlarmClock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const SincronizacaoLearnWorlds: React.FC = () => {
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error" | "testing">("idle");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);
  const { getAccessToken } = useAuth();

  // Executar verificação automática ao montar o componente
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setIsTestingApi(true);
    setApiStatus("testing");
    setApiResponse("");
    
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Não foi possível obter token de autenticação");
      }
      
      const response = await fetch("/functions/v1/learnworlds-api/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      // Verificar se a resposta é realmente JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        setApiResponse(JSON.stringify(data, null, 2));
        
        if (response.ok && data.status === "online") {
          setApiStatus("success");
          toast.success("API LearnWorlds está online e funcionando corretamente");
        } else {
          setApiStatus("error");
          toast.error("API LearnWorlds não está configurada corretamente");
        }
      } else {
        // Se não for JSON, obter o texto bruto
        const textResponse = await response.text();
        console.error("Resposta não é JSON: ", textResponse);
        setApiResponse("Resposta não é no formato JSON esperado. Verifique o console para mais detalhes.");
        setApiStatus("error");
        toast.error("Resposta inválida da API");
      }
    } catch (error) {
      console.error("Erro ao testar API:", error);
      setApiResponse(error instanceof Error ? error.message : "Erro desconhecido");
      setApiStatus("error");
      toast.error("Erro ao conectar com a API LearnWorlds");
    } finally {
      setIsTestingApi(false);
      setLastTestedAt(new Date().toLocaleTimeString());
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
      case "testing":
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return <AlarmClock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <span>Teste de Conexão com LearnWorlds</span>
        </CardTitle>
        <CardDescription>
          Verifique se a conexão com a API da LearnWorlds está funcionando corretamente
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="space-y-6">
          <Alert variant={apiStatus === "error" ? "destructive" : apiStatus === "success" ? "default" : "outline"} 
            className={apiStatus === "success" ? "border-green-500 bg-green-50 text-green-900" : undefined}>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <AlertTitle>Status da Integração</AlertTitle>
            </div>
            <AlertDescription>
              {apiStatus === "testing" && "Testando conexão com a API LearnWorlds..."}
              {apiStatus === "success" && "API LearnWorlds conectada com sucesso!"}
              {apiStatus === "error" && "Falha na conexão com a API LearnWorlds."}
              {apiStatus === "idle" && "Clique no botão abaixo para testar a conexão."}
              {lastTestedAt && <div className="mt-1 text-xs">Última verificação: {lastTestedAt}</div>}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={checkApiStatus} 
              disabled={isTestingApi}
              className="w-fit"
              variant={apiStatus === "success" ? "outline" : "default"}
            >
              {isTestingApi ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Testar Conexão com API
                </>
              )}
            </Button>
            
            {apiStatus !== "idle" && !isTestingApi && (
              <div className="rounded-md border p-4 mt-4">
                <h3 className="font-medium mb-2">Resultado do Teste</h3>
                
                {apiResponse ? (
                  <div className="p-4 bg-muted rounded-md overflow-x-auto">
                    <p className="font-semibold mb-2 text-sm">Resposta da API:</p>
                    <pre className="text-xs whitespace-pre-wrap">{apiResponse}</pre>
                  </div>
                ) : (
                  <Skeleton className="h-20 w-full" />
                )}
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
