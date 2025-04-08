
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Loader2 } from "lucide-react";

interface SincronizacaoBotoesProps {
  loading: boolean;
  onSincronizar: (todos: boolean) => void;
}

const SincronizacaoBotoes: React.FC<SincronizacaoBotoesProps> = ({ 
  loading, 
  onSincronizar 
}) => {
  return (
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
            onClick={() => onSincronizar(false)}
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
            onClick={() => onSincronizar(true)}
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
  );
};

export default SincronizacaoBotoes;
