
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
      console.log("Testando conexão com token:", ADMIN_BYPASS_JWT);
      
      const response = await fetch("https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_BYPASS_JWT}`
        }
      });
      
      console.log("Status da resposta:", response.status);
      setLastStatus(response.status);
      
      const data = await response.json();
      console.log("Dados da resposta:", data);
      
      if (response.ok) {
        toast.success("Conexão com a API estabelecida com sucesso!");
      } else {
        toast.error(`Erro de conexão: ${response.status} - ${data.message || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      toast.error("Erro ao conectar com a API");
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
