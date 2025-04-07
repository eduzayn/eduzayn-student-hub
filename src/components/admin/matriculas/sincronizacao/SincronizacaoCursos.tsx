
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import LearnWorldsErrorAlert from "@/components/admin/matriculas/LearnWorldsErrorAlert";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";

interface SincronizacaoCursosProps {
  // Props if needed
}

const SincronizacaoCursos: React.FC<SincronizacaoCursosProps> = () => {
  const { sincronizarCursos, loading, error, offlineMode } = useLearnWorldsApi();
  const [resultado, setResultado] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const handleSincronizar = async (todos: boolean = false) => {
    try {
      const result = await sincronizarCursos(todos);
      if (result) {
        setResultado(result);
        setLogs(result.logs || []);
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      toast.error("Erro ao sincronizar cursos com LearnWorlds");
    }
  };

  return (
    <div className="p-4">
      {error && <LearnWorldsErrorAlert errorMessage={error} />}
      
      {offlineMode && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Modo Offline</AlertTitle>
          <AlertDescription>
            O sistema está operando em modo offline. Algumas funcionalidades podem estar limitadas.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {loading ? "Sincronizando..." : "Sincronizar Novos Cursos"}
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
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {loading ? "Sincronizando..." : "Sincronizar Todos os Cursos"}
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
              
              <div className="mt-4">
                <div className="text-sm font-medium mb-1">Total processado: {resultado.total}</div>
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
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Tudo em dia</AlertTitle>
                  <AlertDescription>
                    Nenhuma alteração foi necessária. Todos os cursos já estão sincronizados.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
};

export default SincronizacaoCursos;
