
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import LearnWorldsErrorAlert from "@/components/admin/matriculas/LearnWorldsErrorAlert";
import useSincronizacaoCursos from "@/hooks/sincronizacao/useSincronizacaoCursos";

interface SincronizacaoCursosProps {
  // Props if needed
}

const SincronizacaoCursos: React.FC<SincronizacaoCursosProps> = () => {
  const { sincronizarCursos, loading, resultado } = useSincronizacaoCursos();
  const [logs, setLogs] = useState<string[]>([]);
  
  const handleSincronizar = async () => {
    try {
      const result = await sincronizarCursos();
      
      if (result && result.success) {
        toast.success("Sincronização concluída com sucesso!");
        setLogs(result.logs || []);
      }
    } catch (error) {
      console.error("Erro ao sincronizar cursos:", error);
      toast.error("Falha ao sincronizar cursos");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sincronização de Cursos</CardTitle>
          <CardDescription>
            Sincronize os cursos da plataforma LearnWorlds com o sistema de matrículas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleSincronizar} 
              disabled={loading}
              className="space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Iniciar Sincronização</span>
                </>
              )}
            </Button>
          </div>
          
          {resultado && (
            <Alert 
              variant={resultado.success ? "default" : "destructive"}
              className={resultado.success ? "bg-green-50 border-green-200" : ""}
            >
              {resultado.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{resultado.success ? "Sucesso" : "Erro"}</AlertTitle>
              <AlertDescription>{resultado.message}</AlertDescription>
            </Alert>
          )}
          
          {logs && logs.length > 0 && (
            <Card className="mt-4">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Logs de Sincronização</CardTitle>
              </CardHeader>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4 font-mono text-sm">
                  {logs.map((log, index) => (
                    <div key={index} className={`pb-1 ${log.includes("Erro") ? "text-red-500" : ""}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SincronizacaoCursos;
