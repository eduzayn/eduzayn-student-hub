
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Loader2 } from "lucide-react";

interface SincronizacaoCursosBotoesProps {
  loading: boolean;
  sincronizando: boolean;
  onSincronizar: (todos: boolean) => void;
}

const SincronizacaoCursosBotoes: React.FC<SincronizacaoCursosBotoesProps> = ({ 
  loading, 
  sincronizando,
  onSincronizar 
}) => {
  return (
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
            onClick={() => onSincronizar(false)}
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
            onClick={() => onSincronizar(true)}
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
  );
};

export default SincronizacaoCursosBotoes;
