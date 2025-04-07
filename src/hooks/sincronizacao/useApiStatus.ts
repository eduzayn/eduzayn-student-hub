
import { useState, useCallback } from "react";
import { ADMIN_BYPASS_JWT } from "@/hooks/auth/adminBypass";

export const useApiStatus = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);

  const checkAPIConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_BYPASS_JWT}`
        }
      });

      const data = await response.json();
      setResponseData(data);
      setIsConnected(response.ok);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Erro ao verificar conexão com API:", error);
      setIsConnected(false);
      setResponseData({ error: "Falha na conexão" });
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
