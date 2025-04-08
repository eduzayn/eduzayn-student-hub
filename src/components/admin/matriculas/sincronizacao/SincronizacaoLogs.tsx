
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Copy, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface SincronizacaoLogsProps {
  logs: string[];
}

const SincronizacaoLogs: React.FC<SincronizacaoLogsProps> = ({ logs }) => {
  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'))
      .then(() => toast.success("Logs copiados para a área de transferência"))
      .catch(() => toast.error("Falha ao copiar logs"));
  };

  const handleDownloadLogs = () => {
    const logsText = logs.join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sincronizacao-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Limpeza
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Logs baixados com sucesso");
    }, 100);
  };

  if (!logs || logs.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6 flex justify-center items-center flex-col gap-2">
          <AlertCircle className="h-12 w-12 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">Nenhum log de sincronização disponível</p>
          <p className="text-sm text-muted-foreground">Execute uma sincronização para gerar logs</p>
        </CardContent>
      </Card>
    );
  }

  // Identificar logs de erro para destacar
  const processedLogs = logs.map((log) => {
    const isError = log.toLowerCase().includes("erro") || 
                    log.toLowerCase().includes("falha") ||
                    log.toLowerCase().includes("error");
    
    const isWarning = log.toLowerCase().includes("alerta") || 
                      log.toLowerCase().includes("aviso") ||
                      log.toLowerCase().includes("warning");
    
    const isSuccess = log.toLowerCase().includes("sucesso") ||
                      log.toLowerCase().includes("importado") ||
                      log.toLowerCase().includes("atualizado");
    
    return {
      text: log,
      isError,
      isWarning,
      isSuccess
    };
  });
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Logs de Sincronização</CardTitle>
          <CardDescription>
            {logs.length} registros - {new Date().toLocaleString()}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyLogs}>
            <Copy className="h-4 w-4 mr-1" />
            Copiar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadLogs}>
            <Download className="h-4 w-4 mr-1" />
            Baixar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] border rounded-md p-4 bg-gray-50">
          <div className="font-mono text-sm whitespace-pre-wrap">
            {processedLogs.map((log, index) => (
              <div 
                key={index} 
                className={`py-1 border-b border-gray-100 ${
                  log.isError ? 'text-red-600' : 
                  log.isWarning ? 'text-amber-600' : 
                  log.isSuccess ? 'text-green-600' : ''
                }`}
              >
                {log.text}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {processedLogs.some(log => log.isError) && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erros encontrados</AlertTitle>
            <AlertDescription>
              Alguns erros foram detectados durante a sincronização. Verifique os logs acima para mais detalhes.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SincronizacaoLogs;
