
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SincronizacaoLogsProps {
  logs: string[];
}

const SincronizacaoLogs: React.FC<SincronizacaoLogsProps> = ({ logs }) => {
  return (
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
  );
};

export default SincronizacaoLogs;
