
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle, RefreshCw, ArrowLeft, Loader2, Info, ShieldAlert, Link } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import SincronizacaoLogs from "@/components/admin/matriculas/sincronizacao/SincronizacaoLogs";
import SincronizacaoAlertas from "@/components/admin/matriculas/sincronizacao/SincronizacaoAlertas";
import LearnWorldsStatusDetails from "@/components/admin/matriculas/LearnWorldsStatusDetails";

const SincronizacaoCursos: React.FC = () => {
  const navigate = useNavigate();
  const { sincronizarCursos, loading, error, offlineMode } = useLearnWorldsApi();
  const [resultado, setResultado] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [detalhesErro, setDetalhesErro] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState<boolean>(false);
  const [schoolId, setSchoolId] = useState<string>("grupozayneducacional");
  
  // Obter o school ID do hook base
  useEffect(() => {
    try {
      // Importar dinamicamente para evitar problemas de dependência circular
      import('@/hooks/learnworlds/useLearnWorldsBase').then(module => {
        const useLearnWorldsBase = module.default;
        const { LEARNWORLDS_SCHOOL_ID } = useLearnWorldsBase();
        setSchoolId(LEARNWORLDS_SCHOOL_ID);
      });
    } catch (err) {
      console.error('Erro ao obter School ID:', err);
      setSchoolId("grupozayneducacional"); // Fallback
    }
  }, []);
  
  const handleSincronizar = async (todos: boolean = false) => {
    try {
      setSincronizando(true);
      setDetalhesErro(null);
      
      toast.info(
        todos ? "Iniciando sincronização completa..." : "Iniciando sincronização incremental...", 
        { description: "Este processo pode demorar alguns instantes." }
      );
      
      console.log(`Chamando API para sincronização de cursos (todos=${todos})`);
      
      const result = await sincronizarCursos(todos);
      console.log("Resposta da sincronização:", result);
      
      if (result) {
        setResultado(result);
        setLogs(result.logs || []);
        
        // Verificar mensagens de erro específicas nos logs
        const apiErrorLog = result.logs?.find(log => 
          log.includes("API") && 
          log.includes("Erro")
        );
        
        const accessDeniedLog = result.logs?.find(log =>
          log.includes("access_denied") || log.includes("401") || log.includes("403")
        );
        
        if (apiErrorLog) {
          setDetalhesErro("Erro da API LearnWorlds: Verifique se a API Key está configurada corretamente.");
          toast.error("Erro da API LearnWorlds", {
            description: "Falha na autenticação. Verifique a API key."
          });
        } else if (accessDeniedLog) {
          setDetalhesErro("Erro de autorização na API LearnWorlds. Verifique se o token da API tem permissões suficientes.");
          toast.error("Erro de autorização", {
            description: "O token da API não tem permissões suficientes"
          });
        }
        
        // Notificar o usuário sobre o resultado
        if (result.imported > 0 || result.updated > 0) {
          toast.success(
            "Sincronização concluída com sucesso!", 
            { description: `${result.imported} novos cursos e ${result.updated} atualizados.` }
          );
        } else if (result.failed > 0) {
          toast.error(
            "Problemas na sincronização", 
            { description: `${result.failed} cursos não puderam ser sincronizados.` }
          );
        } else if (result.total === 0) {
          toast.info("Nenhum curso encontrado para sincronização.");
        } else {
          toast.info("Nenhuma alteração foi necessária.");
        }
      } else {
        setDetalhesErro("Não foi possível obter resultados da sincronização");
        toast.error("Falha na sincronização", { 
          description: "Não foi possível obter resultados da sincronização" 
        });
      }
    } catch (error: any) {
      console.error("Erro ao sincronizar:", error);
      
      // Exibir erro específico relacionado à autenticação
      if (error.message && error.message.includes("API")) {
        setDetalhesErro("Erro de autenticação da API LearnWorlds: Falha na autenticação. Verifique a API key.");
        toast.error("Erro de autenticação da API", { 
          description: "Falha na autenticação. Verifique a API key."
        });
      } else if (error.message && error.message.includes("client_id")) {
        setDetalhesErro("Erro na API do LearnWorlds: ID do cliente ausente ou incorreto. Verifique as configurações da API.");
        toast.error("Erro de configuração da API", { 
          description: "ID do cliente LearnWorlds ausente ou incorreto nas configurações."
        });
      } else if (error.message && error.message.includes("Failed to fetch")) {
        setDetalhesErro("Erro de conexão com a função edge. Verifique se a função está ativa e se não há problemas de rede ou CORS.");
        toast.error("Erro de conexão", {
          description: "Não foi possível conectar à função edge do Supabase."
        });
      } else {
        setDetalhesErro(error.message || "Erro desconhecido durante a sincronização");
        toast.error("Erro na sincronização", { description: error.message });
      }
    } finally {
      setSincronizando(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sincronização de Cursos</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/matriculas/sincronizacao")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Status da integração com LearnWorlds */}
      <LearnWorldsStatusDetails 
        schoolId={schoolId}
        offlineMode={offlineMode}
        error={error}
      />

      {/* Alertas de erro ou status */}
      <SincronizacaoAlertas 
        error={error}
        detalhesErro={detalhesErro}
        offlineMode={offlineMode}
      />
      
      {/* Alerta específico de erro de autenticação API */}
      {detalhesErro && detalhesErro.includes("API") && (
        <Alert variant="destructive" className="mb-4">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Erro de autenticação da API</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>A autenticação com a API do LearnWorlds falhou. Isso geralmente significa que:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A API Key não está configurada corretamente</li>
              <li>A API Key não tem permissões suficientes</li>
              <li>A API LearnWorlds rejeitou a solicitação de autenticação</li>
            </ul>
            <p className="mt-2 text-sm">
              <span className="font-medium">Solução:</span> Verifique se a API Key está correta nas configurações de segredos da função edge.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Alerta específico de erro de conexão */}
      {detalhesErro && detalhesErro.includes("Failed to fetch") && (
        <Alert variant="destructive" className="mb-4 border-amber-600">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de conexão com a função edge</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Não foi possível conectar à função edge do Supabase. Isso geralmente significa que:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A função edge "learnworlds-sync" pode estar indisponível</li>
              <li>Há um problema de rede ou CORS impedindo a conexão</li>
              <li>A função edge precisa ser reimplementada</li>
            </ul>
            <p className="mt-2 text-sm">
              <span className="font-medium">Solução:</span> Verifique os logs da função edge no painel do Supabase e certifique-se de que ela está implementada corretamente.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Alerta específico de erro de acesso */}
      {logs.some(log => log.includes("access_denied")) && (
        <Alert variant="destructive" className="mb-4 border-amber-600">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de autorização na API LearnWorlds</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>A API do LearnWorlds retornou um erro de "access_denied". Isso geralmente significa que:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>O token API obtido não tem permissões suficientes</li>
              <li>A sua conta LearnWorlds não tem acesso à API de cursos</li>
            </ul>
            <p className="mt-2 text-sm">
              <span className="font-medium">Solução:</span> Verifique se a API Key tem as permissões necessárias para acessar a API de cursos.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="sincronizacao">
        <TabsList>
          <TabsTrigger value="sincronizacao">Sincronização</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="sincronizacao">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sincronização Incremental</CardTitle>
                <CardDescription>
                  Sincroniza apenas os cursos que foram modificados ou são novos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => handleSincronizar(false)}
                  disabled={loading || sincronizando}
                >
                  {(loading || sincronizando) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {(loading || sincronizando) ? "Sincronizando..." : "Sincronizar Novos Cursos"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sincronização Completa</CardTitle>
                <CardDescription>
                  Sincroniza todos os cursos do LearnWorlds. Isso pode demorar mais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  onClick={() => handleSincronizar(true)}
                  disabled={loading || sincronizando}
                >
                  {(loading || sincronizando) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {(loading || sincronizando) ? "Sincronizando..." : "Sincronizar Todos os Cursos"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultado da Sincronização */}
          {resultado && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resultado da Sincronização</CardTitle>
                <CardDescription>
                  Concluído em {new Date().toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                      <div className="text-xs text-green-700 font-semibold">NOVOS CURSOS</div>
                      <div className="text-2xl font-bold text-green-600">{resultado.imported}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="text-xs text-blue-700 font-semibold">ATUALIZADOS</div>
                      <div className="text-2xl font-bold text-blue-600">{resultado.updated}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="text-xs text-amber-700 font-semibold">FALHAS</div>
                      <div className="text-2xl font-bold text-amber-600">{resultado.failed}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm font-medium">Total processado: {resultado.total}</div>
                    <Badge variant={offlineMode ? "destructive" : "outline"}>
                      {offlineMode ? "Modo Offline" : "Online"}
                    </Badge>
                  </div>

                  {resultado.failed > 0 && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Atenção</AlertTitle>
                      <AlertDescription>
                        {resultado.failed} cursos não puderam ser sincronizados. 
                        Verifique os logs para mais detalhes.
                      </AlertDescription>
                    </Alert>
                  )}

                  {resultado.imported === 0 && resultado.updated === 0 && resultado.failed === 0 && (
                    <Alert className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Verificação concluída</AlertTitle>
                      <AlertDescription>
                        A API do LearnWorlds foi consultada, mas nenhum curso foi encontrado para sincronizar.
                        Verifique as credenciais da API e se há cursos disponíveis na plataforma.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs">
          <SincronizacaoLogs logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SincronizacaoCursos;
