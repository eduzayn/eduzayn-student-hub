
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, AlertTriangleIcon, RefreshCw, UserCircle2, Database, UsersIcon, Loader2, InfoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

// Interface para resultados da sincronização
interface SyncResults {
  imported: number;
  updated: number;
  failed: number;
  total: number;
  logs: string[];
}

const SincronizacaoAlunos: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">("checking");
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const { getAccessToken } = useAuth();

  // Verificar o status da API ao carregar o componente
  useEffect(() => {
    checkApiStatus();
  }, []);

  // Função para verificar o status da API LearnWorlds
  const checkApiStatus = async () => {
    try {
      setApiStatus("checking");
      
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error("Usuário não autenticado");
      }
      
      const response = await fetch('/functions/v1/learnworlds-api/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao verificar status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "online") {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch (error) {
      console.error("Erro ao verificar status da API:", error);
      setApiStatus("offline");
    }
  };

  // Função para iniciar a sincronização de alunos
  const sincronizarAlunos = async (syncAll: boolean = false) => {
    try {
      setIsSynchronizing(true);
      setSyncResults(null);
      setSyncLogs([]);
      
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error("Usuário não autenticado");
      }
      
      // Parâmetros de consulta para a API
      const params = new URLSearchParams();
      if (syncAll) {
        params.append('syncAll', 'true');
      }
      params.append('pageSize', '20'); // Tamanho da página reduzido para teste
      
      const url = `/functions/v1/learnworlds-sync?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro na sincronização: ${response.status}`);
      }
      
      const results = await response.json();
      
      // Atualizar os resultados e logs
      setSyncResults(results);
      setSyncLogs(results.logs || []);
      
      // Mostrar notificação de sucesso
      toast.success(
        `Sincronização concluída`, 
        { description: `${results.imported} importados, ${results.updated} atualizados, ${results.failed} falhas` }
      );
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast.error("Falha na sincronização", { description: error instanceof Error ? error.message : "Erro desconhecido" });
    } finally {
      setIsSynchronizing(false);
    }
  };

  // Função para criar ou atualizar um perfil manualmente
  const criarPerfilManualmente = async (email: string, nome: string, sobrenome: string, learnworldsId: string) => {
    try {
      // Chamar a função criar perfil sem auth direto via SQL
      const { data, error } = await supabase.functions.invoke("create-profile", {
        body: {
          email,
          firstName: nome, 
          lastName: sobrenome,
          phone: null,
          learnworldsId
        }
      });
      
      if (error) throw error;
      
      toast.success("Perfil criado/atualizado com sucesso", {
        description: `ID: ${data}`
      });
      
      return data;
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      toast.error("Falha ao criar perfil", { 
        description: error instanceof Error ? error.message : "Erro desconhecido" 
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            <span>Sincronização de Alunos</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={apiStatus === "online" ? "outline" : "destructive"} 
              className={`${apiStatus === "online" ? "bg-green-50 text-green-700 border-green-200" : apiStatus === "checking" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-red-50"}`}
            >
              {apiStatus === "online" ? (
                <>
                  <CheckIcon className="h-3 w-3 mr-1" />
                  API Online
                </>
              ) : apiStatus === "checking" ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <AlertTriangleIcon className="h-3 w-3 mr-1" />
                  API Offline
                </>
              )}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkApiStatus} 
              disabled={apiStatus === "checking"}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${apiStatus === "checking" ? "animate-spin" : ""}`} />
              Verificar API
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Sincronize dados de alunos entre LearnWorlds e o sistema de matrículas
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <Tabs defaultValue="sincronizar">
          <TabsList className="mb-4">
            <TabsTrigger value="sincronizar">Sincronizar</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="ajuda">Ajuda</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sincronizar" className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Sincronização de Alunos</AlertTitle>
              <AlertDescription>
                Esta funcionalidade importa dados de alunos da plataforma LearnWorlds para o sistema de matrículas.
                Você pode sincronizar todos os alunos ou apenas a página atual.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-4 py-4">
              <Button 
                onClick={() => sincronizarAlunos(false)} 
                disabled={isSynchronizing || apiStatus !== "online"}
              >
                {isSynchronizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCircle2 className="mr-2 h-4 w-4" />}
                Sincronizar Página Atual
              </Button>
              
              <Button 
                onClick={() => sincronizarAlunos(true)} 
                variant="secondary" 
                disabled={isSynchronizing || apiStatus !== "online"}
              >
                {isSynchronizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UsersIcon className="mr-2 h-4 w-4" />}
                Sincronizar Todos
              </Button>
            </div>
            
            {syncResults && (
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-medium">Resultados da Sincronização</h3>
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{syncResults.total}</div>
                      <p className="text-xs text-muted-foreground">Total de alunos</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">{syncResults.imported}</div>
                      <p className="text-xs text-muted-foreground">Novos importados</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">{syncResults.updated}</div>
                      <p className="text-xs text-muted-foreground">Atualizados</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-red-600">{syncResults.failed}</div>
                      <p className="text-xs text-muted-foreground">Falhas</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Logs de Sincronização</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  {syncLogs.length > 0 ? (
                    <div className="space-y-1">
                      {syncLogs.map((log, index) => (
                        <div key={index} className="text-sm font-mono">
                          {log}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Database className="mx-auto h-8 w-8 opacity-50" />
                      <p className="mt-2">Nenhum log disponível</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ajuda">
            <Card>
              <CardHeader>
                <CardTitle>Ajuda sobre Sincronização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <h3 className="font-medium">Como funciona a sincronização?</h3>
                <p>O processo de sincronização conecta à API da LearnWorlds e importa dados de alunos para nosso sistema.</p>
                
                <h3 className="font-medium mt-4">Por que sincronizar?</h3>
                <p>A sincronização permite que alunos cadastrados na plataforma LearnWorlds sejam automaticamente importados para o sistema de matrículas, facilitando a gestão integrada.</p>
                
                <h3 className="font-medium mt-4">Resolução de problemas</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Verifique se o status da API está online</li>
                  <li>Confira se as configurações da API estão corretas nas variáveis de ambiente</li>
                  <li>Analise os logs de sincronização para identificar eventuais erros</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <p className="text-xs text-muted-foreground">
          Último status da API: <span className={apiStatus === "online" ? "text-green-600" : "text-red-600"}>
            {apiStatus === "online" ? "Online" : apiStatus === "checking" ? "Verificando..." : "Offline"}
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SincronizacaoAlunos;
