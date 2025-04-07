
import { Button } from "@/components/ui/button";
import { ADMIN_BYPASS_JWT } from "@/hooks/auth/adminBypass";
import { Check, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TestAPIConnectionButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastStatus, setLastStatus] = useState<number | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Registrar o token e seu tamanho para debug
      console.log("Testando conexão com token (primeiros 5 chars):", ADMIN_BYPASS_JWT.substring(0, 5) + "...");
      console.log("Comprimento do token:", ADMIN_BYPASS_JWT.length);
      
      // Preparar headers para a requisição
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ADMIN_BYPASS_JWT}`
      };
      
      console.log("Headers enviados:", headers);
      
      // Fazer a requisição para a API
      const response = await fetch("https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api", {
        method: "GET",
        headers: headers
      });
      
      console.log("Status da resposta:", response.status);
      setLastStatus(response.status);
      
      // Processar a resposta
      const data = await response.json();
      console.log("Dados da resposta:", data);
      
      if (response.ok) {
        toast.success("Conexão com a API estabelecida com sucesso!");
      } else {
        // Exibir mensagens de erro mais detalhadas quando disponíveis
        let errorMsg = `Erro ${response.status}: ${data.message || "Erro desconhecido"}`;
        
        if (data.debug) {
          console.log("Detalhes de debug:", data.debug);
          if (typeof data.debug === 'object') {
            const debugInfo = Object.entries(data.debug)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");
            errorMsg += `\nDebug: ${debugInfo}`;
          } else {
            errorMsg += `\nDebug: ${data.debug}`;
          }
        }
        
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      toast.error("Erro ao conectar com a API: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={testConnection} 
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : lastStatus === 200 ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      Testar Conexão API
    </Button>
  );
};

export default TestAPIConnectionButton;
