
import { useState, useCallback } from "react";
import { ADMIN_BYPASS_JWT } from "@/hooks/auth/adminBypass";
import { toast } from "sonner";

export const useApiStatus = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);

  const checkAPIConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = ADMIN_BYPASS_JWT;
      console.log("Verificando conexão com API usando token:", token);
      
      // Adicionar logs para verificar os headers que estão sendo enviados
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      
      console.log("Headers enviados:", headers);
      
      const response = await fetch("https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api", {
        method: "GET",
        headers: headers
      });

      console.log("Resposta da API:", response.status);
      
      // Verificar resposta mesmo se não for OK para debug
      let data;
      try {
        data = await response.json();
        console.log("Dados da resposta:", data);
      } catch (e) {
        console.error("Erro ao processar resposta JSON:", e);
        data = { error: "Erro ao processar resposta" };
      }
      
      setResponseData(data);
      setIsConnected(response.ok);
      setLastChecked(new Date().toLocaleTimeString());
      
      if (response.ok) {
        toast.success("Conexão com a API estabelecida com sucesso!");
      } else {
        toast.error(`Erro de conexão: ${response.status} ${data?.message || ''}`);
      }
    } catch (error) {
      console.error("Erro ao verificar conexão com API:", error);
      setIsConnected(false);
      setResponseData({ error: "Falha na conexão" });
      toast.error("Falha ao conectar com a API");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    isLoading, 
    isConnected, 
    lastChecked, 
    responseData, 
    checkAPIConnection 
  };
};
