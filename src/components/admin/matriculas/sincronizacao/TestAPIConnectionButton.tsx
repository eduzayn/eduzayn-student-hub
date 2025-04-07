
import { Button } from "@/components/ui/button";
import { ADMIN_BYPASS_JWT } from "@/hooks/auth/adminBypass";
import { Check, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const TestAPIConnectionButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastStatus, setLastStatus] = useState<number | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Depuração inicial
      const token = ADMIN_BYPASS_JWT;
      console.log("Testando conexão com token:", token);
      console.log("Comprimento do token:", token.length);
      
      // Preparar headers para a requisição
      const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      });
      
      console.log("Headers enviados:", {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      });
      
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

      // Armazenar informações para debug
      setDebugInfo({
        tokenLength: token.length,
        tokenValue: token,
        status: response.status,
        responseData: data
      });
      
      if (response.ok) {
        toast.success("Conexão com a API estabelecida com sucesso!");
      } else {
        // Exibir mensagens de erro mais detalhadas quando disponíveis
        let errorMsg = `Erro ${response.status}: ${data.message || "Erro desconhecido"}`;
        
        if (data.debug) {
          console.log("Detalhes de debug:", data.debug);
          setDebugInfo(prevInfo => ({...prevInfo, debug: data.debug}));
          
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
        setDebugOpen(true);
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setDebugInfo({
        error: error instanceof Error ? error.message : "Erro desconhecido",
        tokenLength: ADMIN_BYPASS_JWT.length,
        tokenValue: ADMIN_BYPASS_JWT
      });
      toast.error("Erro ao conectar com a API: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      setDebugOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
        ) : lastStatus === 401 ? (
          <AlertCircle className="h-4 w-4 text-red-500" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        Testar Conexão API
      </Button>

      <Dialog open={debugOpen} onOpenChange={setDebugOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Informações de Diagnóstico da API</DialogTitle>
            <DialogDescription>
              Detalhes técnicos para ajudar a identificar problemas de conexão.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-60">
              <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm">
              <h4 className="font-semibold">Por que estou vendo erro 401?</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>O token no frontend pode não corresponder ao token esperado no backend</li>
                <li>A função edge pode precisar ser reimplantada para carregar o secret atualizado</li>
                <li>Recomendação: Verifique se o token <code>ADMIN_BYPASS_TOKEN</code> no Supabase corresponde exatamente ao <code>ADMIN_BYPASS_JWT</code> no frontend</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setDebugOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestAPIConnectionButton;
