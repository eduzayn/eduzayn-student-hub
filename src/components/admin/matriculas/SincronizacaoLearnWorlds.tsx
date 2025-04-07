
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import APIStatusCard from "./sincronizacao/APIStatusCard";
import SincronizacaoCard from "./sincronizacao/SincronizacaoCard";
import DirectSyncOptions from "./sincronizacao/DirectSyncOptions";
import { useDataSync } from "@/hooks/sincronizacao/useDataSync";
import TestAPIConnectionButton from "./sincronizacao/TestAPIConnectionButton";

const SincronizacaoLearnWorlds: React.FC = () => {
  const { 
    isLoading, 
    isConnected, 
    lastChecked,
    responseData,
    checkAPIConnection,
    countAlunos,
    countCursos,
    isSyncingAlunos,
    isSyncingCursos,
    lastSyncAlunos,
    lastSyncCursos,
    sincronizarAlunos,
    sincronizarCursos
  } = useDataSync();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Conexão com LearnWorlds API</CardTitle>
          <div className="flex space-x-2">
            <TestAPIConnectionButton />
          </div>
        </CardHeader>
        <CardContent>
          <APIStatusCard
            isConnected={isConnected}
            lastChecked={lastChecked}
            isLoading={isLoading}
            responseData={responseData}
            onRefresh={checkAPIConnection}
          />
        </CardContent>
      </Card>

      <SincronizacaoCard 
        title="Alunos"
        description="Sincronize alunos da plataforma LearnWorlds"
        count={countAlunos}
        lastSync={lastSyncAlunos}
        isSyncing={isSyncingAlunos}
        onSync={sincronizarAlunos}
        buttonText="Sincronizar Alunos"
        countLabel="alunos cadastrados"
        icon={<RefreshCw className="h-4 w-4 mr-2" />}
      />

      <SincronizacaoCard 
        title="Cursos"
        description="Sincronize cursos da plataforma LearnWorlds"
        count={countCursos}
        lastSync={lastSyncCursos}
        isSyncing={isSyncingCursos}
        onSync={sincronizarCursos}
        buttonText="Sincronizar Cursos"
        countLabel="cursos cadastrados"
        icon={<RefreshCw className="h-4 w-4 mr-2" />}
      />

      <Card>
        <CardHeader>
          <CardTitle>Sincronização Direta</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-4">
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              A sincronização direta permite acessar recursos específicos da API do LearnWorlds. 
              Use apenas se souber o que está fazendo.
            </AlertDescription>
          </Alert>
          
          <DirectSyncOptions 
            isSyncingAlunos={isSyncingAlunos}
            isSyncingCursos={isSyncingCursos}
            isConnected={isConnected}
            onSyncAlunos={sincronizarAlunos}
            onSyncCursos={sincronizarCursos}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SincronizacaoLearnWorlds;
