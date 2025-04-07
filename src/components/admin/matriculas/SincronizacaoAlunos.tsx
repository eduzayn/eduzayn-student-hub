
import React, { useState, useEffect } from "react";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2, RefreshCw, Check, AlertCircle, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";

// URL para o status da edge function
const EDGE_FUNCTION_STATUS_URL = `/functions/v1/learnworlds-api/status`;

const SincronizacaoAlunos: React.FC = () => {
  const { toast } = useToast();
  const { getUsers, loading, error, offlineMode, enableOfflineMode } = useLearnWorldsApi();
  
  const [sincronizando, setSincronizando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [statusSincronizacao, setStatusSincronizacao] = useState("");
  const [resultados, setResultados] = useState<{
    total: number;
    novos: number;
    atualizados: number;
    falhas: number;
  }>({
    total: 0,
    novos: 0,
    atualizados: 0,
    falhas: 0,
  });
  const [logsSincronizacao, setLogsSincronizacao] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">("checking");
  
  // Verificar status da API quando o componente montar
  useEffect(() => {
    verificarStatusAPI();
  }, []);
  
  // Função para verificar se a API está online
  const verificarStatusAPI = async () => {
    setApiStatus("checking");
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token || 'admin-bypass-token';
      
      const response = await fetch(EDGE_FUNCTION_STATUS_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
        enableOfflineMode();
      }
    } catch (error) {
      console.error("Erro ao verificar status da API:", error);
      setApiStatus("offline");
      enableOfflineMode();
    }
  };
  
  // Função para iniciar a sincronização
  const sincronizarAlunos = async () => {
    if (sincronizando) return;
    
    try {
      setSincronizando(true);
      setProgresso(0);
      setStatusSincronizacao("Iniciando sincronização...");
      setLogsSincronizacao(["Iniciando processo de sincronização..."]);
      
      // Resetar contadores
      setResultados({
        total: 0,
        novos: 0,
        atualizados: 0,
        falhas: 0,
      });
      
      // Mostrar toast para informar o usuário
      toast({
        title: "Sincronização iniciada",
        description: "A sincronização de alunos do LearnWorlds foi iniciada."
      });
      
      // Buscar alunos da LearnWorlds
      adicionarLog("Buscando alunos do LearnWorlds...");
      const resultado = await getUsers(1, 100);
      
      if (!resultado || !resultado.data) {
        throw new Error("Não foi possível obter a lista de alunos do LearnWorlds");
      }
      
      const alunos = resultado.data;
      setResultados(prev => ({ ...prev, total: alunos.length }));
      adicionarLog(`${alunos.length} alunos encontrados no LearnWorlds`);
      
      // Para cada aluno, sincronizar com o banco de dados
      let novos = 0;
      let atualizados = 0;
      let falhas = 0;
      
      for (let i = 0; i < alunos.length; i++) {
        const aluno = alunos[i];
        setProgresso(Math.round(((i + 1) / alunos.length) * 100));
        
        try {
          adicionarLog(`Sincronizando ${aluno.firstName} ${aluno.lastName} (${aluno.email})...`);
          
          // Verificar se o aluno já existe no banco de dados
          const { data: alunosExistentes, error: errorConsulta } = await supabase
            .from('profiles')
            .select('id, email')
            .eq('email', aluno.email)
            .maybeSingle();
          
          if (errorConsulta) {
            throw new Error(`Erro ao consultar aluno: ${errorConsulta.message}`);
          }
          
          if (!alunosExistentes) {
            // Aluno não existe, criar novo
            adicionarLog(`Criando novo perfil para ${aluno.email}...`);
            
            // Usar RPC para criar um perfil sem auth
            const { error: errorRPC } = await supabase
              .rpc('create_profile_without_auth', {
                user_email: aluno.email,
                user_first_name: aluno.firstName || '',
                user_last_name: aluno.lastName || '',
                user_phone: aluno.phoneNumber || '',
                user_learnworlds_id: aluno.id
              });
            
            if (errorRPC) {
              throw new Error(`Erro ao criar perfil: ${errorRPC.message}`);
            }
            
            novos++;
            adicionarLog(`✅ Novo perfil criado para ${aluno.email}`);
          } else {
            // Aluno existe, atualizar
            adicionarLog(`Atualizando perfil existente para ${aluno.email}...`);
            
            const { error: errorUpdate } = await supabase
              .from('profiles')
              .update({
                first_name: aluno.firstName || '',
                last_name: aluno.lastName || '',
                phone: aluno.phoneNumber || '',
                learnworlds_id: aluno.id,
                updated_at: new Date().toISOString()
              })
              .eq('email', aluno.email);
            
            if (errorUpdate) {
              throw new Error(`Erro ao atualizar perfil: ${errorUpdate.message}`);
            }
            
            atualizados++;
            adicionarLog(`✅ Perfil atualizado para ${aluno.email}`);
          }
        } catch (error) {
          console.error(`Erro ao sincronizar aluno ${aluno.email}:`, error);
          falhas++;
          adicionarLog(`❌ Erro ao sincronizar ${aluno.email}: ${error.message}`);
        }
      }
      
      // Atualizar resultados finais
      setResultados({
        total: alunos.length,
        novos,
        atualizados,
        falhas,
      });
      
      setStatusSincronizacao("Sincronização concluída");
      adicionarLog("✅ Processo de sincronização concluído");
      
      toast({
        title: "Sincronização concluída",
        description: `${novos} novos alunos, ${atualizados} atualizados, ${falhas} falhas.`
      });
      
    } catch (error) {
      console.error("Erro ao sincronizar alunos:", error);
      setStatusSincronizacao(`Erro: ${error.message}`);
      adicionarLog(`❌ Erro na sincronização: ${error.message}`);
      
      toast({
        variant: "destructive",
        title: "Erro na sincronização",
        description: error.message
      });
    } finally {
      setSincronizando(false);
    }
  };
  
  // Função para adicionar log
  const adicionarLog = (mensagem: string) => {
    setLogsSincronizacao(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${mensagem}`]);
  };
  
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Sincronização de Alunos</h1>
            <p className="text-muted-foreground mt-1">
              Mantenha os dados dos alunos sincronizados com a plataforma LearnWorlds
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={verificarStatusAPI}
              disabled={apiStatus === "checking"}
              className="gap-2"
            >
              {apiStatus === "checking" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Verificar Conexão
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Status da Conexão</CardTitle>
            <CardDescription>Status atual da conexão com a API do LearnWorlds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {apiStatus === "online" ? (
                <>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-medium text-green-700">API LearnWorlds Online</span>
                </>
              ) : apiStatus === "offline" ? (
                <>
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="font-medium text-red-700">API LearnWorlds Offline</span>
                  <span className="text-sm text-muted-foreground ml-2">(Usando dados simulados)</span>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="font-medium text-yellow-700">Verificando Status da API...</span>
                </>
              )}
            </div>
            
            {apiStatus === "offline" && (
              <Alert variant="default" className="mt-4 border-yellow-300 bg-yellow-50">
                <WifiOff className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <span className="font-medium">Modo offline ativado.</span> Algumas funcionalidades podem estar limitadas. 
                  A sincronização usará dados simulados até que a conexão com o LearnWorlds seja restabelecida.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sincronização Manual</CardTitle>
                <CardDescription>Importar alunos do LearnWorlds para o sistema</CardDescription>
              </div>
              
              <Button 
                onClick={sincronizarAlunos} 
                disabled={sincronizando}
                className="gap-2"
              >
                {sincronizando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {sincronizando ? "Sincronizando..." : "Iniciar Sincronização"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sincronizando && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">{statusSincronizacao}</p>
                <Progress value={progresso} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Progresso: {progresso}%</p>
              </div>
            )}
            
            {!sincronizando && resultados.total > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Resultado da Última Sincronização</h3>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">{resultados.total}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-green-600">Novos</p>
                    <p className="text-xl font-bold text-green-700">{resultados.novos}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-blue-600">Atualizados</p>
                    <p className="text-xl font-bold text-blue-700">{resultados.atualizados}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-red-600">Falhas</p>
                    <p className="text-xl font-bold text-red-700">{resultados.falhas}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-2">Logs da Sincronização</h3>
              <div className="bg-muted p-3 rounded-lg max-h-60 overflow-y-auto font-mono text-xs">
                {logsSincronizacao.length > 0 ? (
                  logsSincronizacao.map((log, index) => (
                    <div key={index} className="pb-1">{log}</div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Nenhum log disponível</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MatriculasLayout>
  );
};

export default SincronizacaoAlunos;
