
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDataSync } from "@/hooks/sincronizacao/useDataSync";
import APIStatusCard from "./sincronizacao/APIStatusCard";
import SincronizacaoCard from "./sincronizacao/SincronizacaoCard";
import DirectSyncOptions from "./sincronizacao/DirectSyncOptions";

const SincronizacaoLearnWorlds: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("status");
  const { 
    isLoading, isConnected, lastChecked, responseData, checkAPIConnection,
    isSyncingAlunos, countAlunos, lastSyncAlunos, sincronizarAlunos,
    isSyncingCursos, countCursos, lastSyncCursos, sincronizarCursos
  } = useDataSync();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sincronização com LearnWorlds</CardTitle>
          <CardDescription>
            Verifique a conexão e sincronize dados com a plataforma LearnWorlds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="status">Status da API</TabsTrigger>
              <TabsTrigger value="dados">Sincronização de Dados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status">
              <APIStatusCard 
                isConnected={isConnected}
                lastChecked={lastChecked}
                isLoading={isLoading}
                responseData={responseData}
                onRefresh={checkAPIConnection}
              />
            </TabsContent>
            
            <TabsContent value="dados">
              <div className="grid md:grid-cols-2 gap-4">
                <SincronizacaoCard
                  title="Alunos"
                  description="Sincronize os alunos da LearnWorlds com o sistema"
                  buttonText="Sincronizar Alunos"
                  count={countAlunos}
                  lastSync={lastSyncAlunos}
                  onSync={() => navigate("/admin/matriculas/sincronizacao/alunos")}
                  isSyncing={isSyncingAlunos}
                  icon={<Users className="h-4 w-4" />}
                />
                
                <SincronizacaoCard
                  title="Cursos"
                  description="Sincronize os cursos da LearnWorlds com o sistema"
                  buttonText="Sincronizar Cursos"
                  count={countCursos}
                  lastSync={lastSyncCursos}
                  onSync={() => navigate("/admin/matriculas/sincronizacao/cursos")}
                  isSyncing={isSyncingCursos}
                  icon={<BookOpen className="h-4 w-4" />}
                />
              </div>
              
              <DirectSyncOptions 
                isSyncingAlunos={isSyncingAlunos}
                isSyncingCursos={isSyncingCursos}
                isConnected={isConnected}
                onSyncAlunos={sincronizarAlunos}
                onSyncCursos={sincronizarCursos}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SincronizacaoLearnWorlds;
