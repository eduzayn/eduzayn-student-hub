
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface LogEntry {
  timestamp?: string;
  level?: "info" | "error" | "warning" | "success";
  message: string;
  httpStatus?: number;
}

interface SincronizacaoLogsProps {
  logs: string[] | LogEntry[];
}

const SincronizacaoLogs: React.FC<SincronizacaoLogsProps> = ({ logs }) => {
  // Função para converter string de log para objeto LogEntry
  const parseLogEntry = (log: string | LogEntry): LogEntry => {
    if (typeof log !== 'string') return log;
    
    // Tenta extrair timestamp, nível e código HTTP
    const timestampMatch = log.match(/\[(.*?)\]/);
    const httpStatusMatch = log.match(/status (\d+)/i) || log.match(/HTTP (\d+)/i);
    
    // Identifica o nível do log baseado em palavras-chave
    let level: "info" | "error" | "warning" | "success" = "info";
    if (log.toLowerCase().includes('erro') || log.toLowerCase().includes('falha') || log.toLowerCase().includes('error')) {
      level = "error";
    } else if (log.toLowerCase().includes('aviso') || log.toLowerCase().includes('warning')) {
      level = "warning";
    } else if (log.toLowerCase().includes('sucesso') || log.toLowerCase().includes('concluído') || log.toLowerCase().includes('success')) {
      level = "success";
    }
    
    return {
      timestamp: timestampMatch ? timestampMatch[1] : undefined,
      level,
      message: timestampMatch ? log.replace(timestampMatch[0], '').trim() : log,
      httpStatus: httpStatusMatch ? parseInt(httpStatusMatch[1]) : undefined
    };
  };
  
  // Processa os logs
  const processedLogs = logs.map(parseLogEntry);
  
  // Função para determinar a cor do status HTTP
  const getStatusColor = (status?: number): string => {
    if (!status) return "bg-gray-200 text-gray-800";
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800";
    if (status >= 300 && status < 400) return "bg-blue-100 text-blue-800";
    if (status >= 400 && status < 500) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };
  
  // Função para exibir o ícone correto baseado no nível
  const LogIcon = ({ level }: { level?: string }) => {
    switch(level) {
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Logs de Sincronização</CardTitle>
        <CardDescription>
          Registro detalhado do processo de sincronização
        </CardDescription>
      </CardHeader>
      <CardContent>
        {processedLogs.length > 0 ? (
          <ScrollArea className="h-[400px] rounded border p-4">
            {processedLogs.map((log, index) => (
              <div key={index} className={`pb-3 border-b border-gray-100 mb-3 ${log.level === 'error' ? 'bg-red-50 p-2 rounded' : ''}`}>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <LogIcon level={log.level} />
                  </div>
                  <div className="flex-1 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {log.timestamp && (
                        <span className="text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {log.timestamp}
                        </span>
                      )}
                      
                      {log.level && (
                        <Badge variant={
                          log.level === "error" ? "destructive" : 
                          log.level === "warning" ? "outline" : 
                          log.level === "success" ? "default" : 
                          "secondary"
                        } className="text-[10px] h-5">
                          {log.level.toUpperCase()}
                        </Badge>
                      )}
                      
                      {log.httpStatus && (
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(log.httpStatus)}`}>
                          HTTP {log.httpStatus}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 break-words whitespace-pre-wrap">
                      {log.message}
                    </div>
                  </div>
                </div>
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
  );
};

export default SincronizacaoLogs;
