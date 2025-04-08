
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface SincronizacaoResultadoProps {
  resultado: {
    imported: number;
    updated: number;
    failed: number;
    total: number;
  } | null;
}

const SincronizacaoResultado: React.FC<SincronizacaoResultadoProps> = ({ resultado }) => {
  if (!resultado) return null;

  return (
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
            <Alert variant="destructive" className="mt-4">
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
  );
};

export default SincronizacaoResultado;
