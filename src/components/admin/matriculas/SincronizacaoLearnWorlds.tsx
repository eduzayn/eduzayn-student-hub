
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Settings, RefreshCw, Check, X, AlarmClock, Database, BarChart2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

const SincronizacaoLearnWorlds: React.FC = () => {
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error" | "testing">("idle");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);
  const [isComparingData, setIsComparingData] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<{
    cursos: { learnworlds: number, supabase: number, matching: number },
    alunos: { learnworlds: number, supabase: number, matching: number },
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"api" | "dados">("api");
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

  const compareLearnWorldsData = async () => {
    setIsComparingData(true);
    
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Não foi possível obter token de autenticação");
      }
      
      // Verificar API status primeiro
      const apiStatusResponse = await fetch("/functions/v1/learnworlds-api/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      const apiStatusData = await apiStatusResponse.json();
      if (!apiStatusResponse.ok || apiStatusData.status !== "online") {
        throw new Error("API LearnWorlds não está online. Verifique a configuração primeiro.");
      }
      
      // Buscar contagem de alunos do LearnWorlds
      const lwStudentsResponse = await fetch("/functions/v1/learnworlds-api/users?limit=1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      const lwStudentsData = await lwStudentsResponse.json();
      const lwStudentsCount = lwStudentsData.total || 0;
      
      // Buscar contagem de cursos do LearnWorlds
      const lwCoursesResponse = await fetch("/functions/v1/learnworlds-api/courses?limit=1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      const lwCoursesData = await lwCoursesResponse.json();
      const lwCoursesCount = lwCoursesData.total || 0;
      
      // Buscar contagem de alunos do Supabase com learnworlds_id não nulo
      const { count: sbStudentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('learnworlds_id', 'is', null);
      
      // Buscar contagem de cursos do Supabase com learning_worlds_id não nulo
      const { count: sbCoursesCount } = await supabase
        .from('cursos')
        .select('*', { count: 'exact', head: true })
        .not('learning_worlds_id', 'is', null);
      
      // Calcular correspondência
      const studentsMatching = Math.min(lwStudentsCount, sbStudentsCount || 0);
      const coursesMatching = Math.min(lwCoursesCount, sbCoursesCount || 0);
      
      setComparisonResult({
        alunos: { 
          learnworlds: lwStudentsCount, 
          supabase: sbStudentsCount || 0, 
          matching: studentsMatching
        },
        cursos: { 
          learnworlds: lwCoursesCount, 
          supabase: sbCoursesCount || 0, 
          matching: coursesMatching
        }
      });
      
      toast.success("Comparação de dados realizada com sucesso");
    } catch (error) {
      console.error("Erro ao comparar dados:", error);
      toast.error("Erro ao comparar dados com LearnWorlds");
    } finally {
      setIsComparingData(false);
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

  // Função helper para determinar o variant correto do Alert
  const getAlertVariant = () => {
    if (apiStatus === "error") return "destructive";
    if (apiStatus === "success") return "default";
    return "default"; // Para idle e testing, usar default
  };

  // Função para calcular a porcentagem de correspondência
  const calculateMatchPercentage = (matching: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((matching / total) * 100);
  };

  // Função para obter a cor baseada na porcentagem de correspondência
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 font-bold";
    if (percentage >= 70) return "text-yellow-600 font-bold";
    return "text-red-600 font-bold";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <span>Sincronização com LearnWorlds</span>
        </CardTitle>
        <CardDescription>
          Verifique a conexão e sincronização com a plataforma LearnWorlds
        </CardDescription>
      </CardHeader>

      <Separator />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "api" | "dados")} className="w-full">
        <CardContent className="pt-6">
          <TabsList className="mb-6">
            <TabsTrigger value="api">Status da API</TabsTrigger>
            <TabsTrigger value="dados">Comparação de Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-6">
            <Alert variant={getAlertVariant()} 
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
          </TabsContent>

          <TabsContent value="dados" className="space-y-6">
            <Alert>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <AlertTitle>Comparação de Dados LearnWorlds → Supabase</AlertTitle>
              </div>
              <AlertDescription>
                Verifique se os dados da API LearnWorlds foram corretamente sincronizados com o Supabase.
                {comparisonResult && (
                  <div className="mt-2 text-xs">
                    Última verificação: {new Date().toLocaleString()}
                  </div>
                )}
              </AlertDescription>
            </Alert>

            <Button 
              onClick={compareLearnWorldsData} 
              disabled={isComparingData || apiStatus !== "success"}
              className="w-fit"
              variant="outline"
            >
              {isComparingData ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Comparando dados...
                </>
              ) : (
                <>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Verificar Sincronização de Dados
                </>
              )}
            </Button>

            {comparisonResult && (
              <div className="rounded-md border p-4 mt-4">
                <h3 className="font-medium mb-4">Resultado da Comparação</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Dados</TableHead>
                      <TableHead className="text-right">LearnWorlds</TableHead>
                      <TableHead className="text-right">Supabase</TableHead>
                      <TableHead className="text-right">Correspondência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Alunos</TableCell>
                      <TableCell className="text-right">{comparisonResult.alunos.learnworlds}</TableCell>
                      <TableCell className="text-right">{comparisonResult.alunos.supabase}</TableCell>
                      <TableCell className={`text-right ${getMatchColor(calculateMatchPercentage(comparisonResult.alunos.matching, comparisonResult.alunos.learnworlds))}`}>
                        {comparisonResult.alunos.matching} ({calculateMatchPercentage(comparisonResult.alunos.matching, comparisonResult.alunos.learnworlds)}%)
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Cursos</TableCell>
                      <TableCell className="text-right">{comparisonResult.cursos.learnworlds}</TableCell>
                      <TableCell className="text-right">{comparisonResult.cursos.supabase}</TableCell>
                      <TableCell className={`text-right ${getMatchColor(calculateMatchPercentage(comparisonResult.cursos.matching, comparisonResult.cursos.learnworlds))}`}>
                        {comparisonResult.cursos.matching} ({calculateMatchPercentage(comparisonResult.cursos.matching, comparisonResult.cursos.learnworlds)}%)
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="mt-4 p-4 bg-muted rounded-md text-sm">
                  <h4 className="font-semibold mb-2">Legenda:</h4>
                  <ul className="space-y-1">
                    <li><span className="text-green-600 font-bold">Verde (≥90%)</span>: Sincronização ótima</li>
                    <li><span className="text-yellow-600 font-bold">Amarelo (≥70%)</span>: Sincronização parcial</li>
                    <li><span className="text-red-600 font-bold">Vermelho (&lt;70%)</span>: Sincronização insuficiente</li>
                  </ul>
                </div>

                {(comparisonResult.alunos.learnworlds > comparisonResult.alunos.supabase || 
                  comparisonResult.cursos.learnworlds > comparisonResult.cursos.supabase) && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                      Ação Recomendada
                    </h4>
                    <p className="text-sm">
                      Existem dados na LearnWorlds que ainda não foram sincronizados com o Supabase. 
                      Considere executar uma sincronização completa.
                    </p>
                  </div>
                )}

                {(comparisonResult.alunos.learnworlds < comparisonResult.alunos.supabase || 
                  comparisonResult.cursos.learnworlds < comparisonResult.cursos.supabase) && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Observação
                    </h4>
                    <p className="text-sm">
                      Existem mais registros no Supabase do que na LearnWorlds. Isso pode indicar
                      registros criados manualmente ou que a API LearnWorlds não está retornando todos os dados.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-muted p-4 rounded-md mt-6">
              <h3 className="font-medium mb-2">Credenciais da API LearnWorlds</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold mb-1">CLIENT ID</p>
                  <p className="text-xs text-muted-foreground bg-background rounded p-2 overflow-auto">
                    66abb5fdf8655b4b800c7278
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">CLIENT SECRET</p>
                  <p className="text-xs text-muted-foreground bg-background rounded p-2 overflow-auto">
                    5lT9XbVrXwv9ulYNufC3OdU4ewon4wUocMENvWEa3pBc8hIOix
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-semibold mb-1">API URL</p>
                  <p className="text-xs text-muted-foreground bg-background rounded p-2 overflow-auto">
                    https://grupozayneducacional.com.br/admin/api/
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <p className="text-xs text-muted-foreground">
          Status da conexão: {apiStatus === "success" ? "Conectado" : apiStatus === "testing" ? "Testando..." : apiStatus === "error" ? "Falha na conexão" : "Não testado"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default SincronizacaoLearnWorlds;
