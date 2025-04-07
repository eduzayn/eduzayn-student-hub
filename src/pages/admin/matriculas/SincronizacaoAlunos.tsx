
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle, RefreshCw, ArrowLeft, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";

const SincronizacaoAlunos: React.FC = () => {
  const navigate = useNavigate();
  const { sincronizarAlunos, loading } = useLearnWorldsApi();
  const [resultado, setResultado] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const handleSincronizar = async (todos: boolean = false) => {
    try {
      const result = await sincronizarAlunos(todos);
      if (result) {
        setResultado(result);
        setLogs(result.logs || []);
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sincronização de Alunos</h1>
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
                  Sincroniza apenas os alunos que foram modificados ou são novos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => handleSincronizar(false)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {loading ? "Sincronizando..." : "Sincronizar Novos Alunos"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sincronização Completa</CardTitle>
                <CardDescription>
                  Sincroniza todos os alunos do LearnWorlds. Isso pode demorar mais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  onClick={() => handleSincronizar(true)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {loading ? "Sincronizando..." : "Sincronizar Todos os Alunos"}
                </Button>
              </CardContent>
            </Card>
          </div>

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
                      <div className="text-xs text-green-700 font-semibold">NOVOS ALUNOS</div>
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
                  
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">Total processado: {resultado.total}</div>
                  </div>

                  {resultado.failed > 0 && (
                    <Alert variant="warning" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Atenção</AlertTitle>
                      <AlertDescription>
                        {resultado.failed} alunos não puderam ser sincronizados. 
                        Verifique os logs para mais detalhes.
                      </AlertDescription>
                    </Alert>
                  )}

                  {resultado.imported === 0 && resultado.updated === 0 && resultado.failed === 0 && (
                    <Alert className="mt-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Tudo em dia</AlertTitle>
                      <AlertDescription>
                        Nenhuma alteração foi necessária. Todos os alunos já estão sincronizados.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Logs de Sincronização</CardTitle>
              <CardDescription>
                Registro detalhado do processo de sincronização
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length > 0 ? (
                <ScrollArea className="h-[400px] rounded border p-4">
                  {logs.map((log, index) => (
                    <div key={index} className="pb-2 text-xs font-mono">
                      {log}
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  Nenhum log disponível. Execute uma sincronização para ver os logs.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SincronizacaoAlunos;
