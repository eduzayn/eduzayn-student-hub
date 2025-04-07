
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { ADMIN_BYPASS_JWT } from "@/hooks/auth/adminBypass";
import { supabase } from "@/integrations/supabase/client";

interface APIStatusProps {
  isConnected: boolean;
  lastChecked: string | null;
  isLoading: boolean;
  responseData: any;
  onRefresh: () => void;
}

const APIStatus: React.FC<APIStatusProps> = ({ 
  isConnected, 
  lastChecked, 
  isLoading, 
  responseData,
  onRefresh 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Status da API</h3>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Verificar Conexão
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="animate-spin h-4 w-4" />
          <p>Verificando conexão com a API...</p>
        </div>
      ) : (
        <Alert variant={isConnected ? "default" : "destructive"}>
          <div className="flex items-center">
            {isConnected ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2" />
            )}
            <AlertTitle>
              {isConnected ? "API Conectada" : "Falha na conexão com a API LearnWorlds"}
            </AlertTitle>
          </div>
          <AlertDescription className="pt-2">
            {isConnected 
              ? "A conexão com a API LearnWorlds está funcionando corretamente."
              : "Não foi possível estabelecer conexão com a API LearnWorlds. Verifique as credenciais ou tente novamente mais tarde."}
            {lastChecked && (
              <p className="text-xs text-muted-foreground mt-1">
                Última verificação: {lastChecked}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {responseData && (
        <div className="bg-slate-50 p-4 rounded-md border mt-4">
          <h4 className="text-sm font-medium mb-2">Resposta da API:</h4>
          <pre className="text-xs bg-slate-100 p-3 rounded overflow-auto max-h-48">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

interface SincronizacaoCardProps {
  title: string;
  description: string;
  buttonText: string;
  count?: number;
  lastSync?: string;
  onSync: () => void;
  isSyncing: boolean;
  icon: React.ReactNode;
}

const SincronizacaoCard: React.FC<SincronizacaoCardProps> = ({
  title,
  description,
  buttonText,
  count,
  lastSync,
  onSync,
  isSyncing,
  icon,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </CardTitle>
          {count !== undefined && (
            <Badge variant="secondary" className="ml-2">
              {count} registros
            </Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Button onClick={onSync} disabled={isSyncing}>
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                {buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          {lastSync && (
            <p className="text-xs text-muted-foreground">
              Última sincronização: {lastSync}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SincronizacaoLearnWorlds: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  
  const [isSyncingAlunos, setIsSyncingAlunos] = useState<boolean>(false);
  const [isSyncingCursos, setIsSyncingCursos] = useState<boolean>(false);
  const [countAlunos, setCountAlunos] = useState<number | undefined>(undefined);
  const [countCursos, setCountCursos] = useState<number | undefined>(undefined);
  const [lastSyncAlunos, setLastSyncAlunos] = useState<string | null>(null);
  const [lastSyncCursos, setLastSyncCursos] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("status");

  useEffect(() => {
    checkAPIConnection();
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      // Carregar contagem de alunos
      const { count: alunosCount, error: alunosError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (!alunosError) {
        setCountAlunos(alunosCount);
      }
      
      // Carregar contagem de cursos
      const { count: cursosCount, error: cursosError } = await supabase
        .from('cursos')
        .select('*', { count: 'exact', head: true });
      
      if (!cursosError) {
        setCountCursos(cursosCount);
      }
    } catch (error) {
      console.error("Erro ao carregar contagens:", error);
    }
  };

  const checkAPIConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_BYPASS_JWT}`
        }
      });

      const data = await response.json();
      setResponseData(data);
      setIsConnected(response.ok);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Erro ao verificar conexão com API:", error);
      setIsConnected(false);
      setResponseData({ error: "Falha na conexão" });
    } finally {
      setIsLoading(false);
    }
  };

  const sincronizarAlunos = async () => {
    setIsSyncingAlunos(true);
    try {
      const response = await fetch("https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_BYPASS_JWT}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao sincronizar alunos: ${response.status}`);
      }

      const data = await response.json();
      
      // Inserir ou atualizar alunos na tabela profiles
      for (const aluno of data.data) {
        // Verificar se o aluno já existe
        const { data: existingUser, error: queryError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', aluno.email)
          .maybeSingle();
        
        if (queryError) {
          console.error(`Erro ao buscar aluno ${aluno.email}:`, queryError);
          continue;
        }
        
        // Se já existe, atualizar
        if (existingUser) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              first_name: aluno.firstName,
              last_name: aluno.lastName,
              phone: aluno.phoneNumber || '',
              updated_at: new Date().toISOString()
            })
            .eq('email', aluno.email);
          
          if (updateError) {
            console.error(`Erro ao atualizar aluno ${aluno.email}:`, updateError);
          }
        } else {
          // Se não existe, inserir novo registro
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: crypto.randomUUID(), // Gerar UUID
              first_name: aluno.firstName,
              last_name: aluno.lastName,
              email: aluno.email,
              phone: aluno.phoneNumber || '',
              role: 'student',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (insertError) {
            console.error(`Erro ao inserir aluno ${aluno.email}:`, insertError);
          }
        }
      }

      // Atualizar contagem e última sincronização
      setLastSyncAlunos(new Date().toLocaleTimeString());
      loadCounts();
      toast.success(`${data.data.length} alunos sincronizados com sucesso!`);
    } catch (error) {
      console.error("Erro na sincronização de alunos:", error);
      toast.error("Erro ao sincronizar alunos. Verifique o console para mais detalhes.");
    } finally {
      setIsSyncingAlunos(false);
    }
  };

  const sincronizarCursos = async () => {
    setIsSyncingCursos(true);
    try {
      const response = await fetch("https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_BYPASS_JWT}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao sincronizar cursos: ${response.status}`);
      }

      const data = await response.json();
      
      // Inserir ou atualizar cursos na tabela cursos
      for (const curso of data.data) {
        // Verificar se o curso já existe pelo learning_worlds_id
        const { data: existingCourse, error: queryError } = await supabase
          .from('cursos')
          .select('id, titulo')
          .eq('learning_worlds_id', curso.id)
          .maybeSingle();
        
        if (queryError) {
          console.error(`Erro ao buscar curso ${curso.id}:`, queryError);
          continue;
        }
        
        // Converter duração para minutos (formato esperado)
        const duracao = curso.duration 
          ? parseInt(curso.duration.replace(/\D/g, '')) * 60  // Simplificação: assume formato "X horas"
          : 0;
        
        // Se já existe, atualizar
        if (existingCourse) {
          const { error: updateError } = await supabase
            .from('cursos')
            .update({
              titulo: curso.title,
              descricao: curso.description || '',
              valor_total: curso.price || 0,
              valor_mensalidade: curso.price ? (curso.price / 12) : 0,
              carga_horaria: duracao,
              imagem_url: curso.image || '',
              data_atualizacao: new Date().toISOString()
            })
            .eq('learning_worlds_id', curso.id);
          
          if (updateError) {
            console.error(`Erro ao atualizar curso ${curso.id}:`, updateError);
          }
        } else {
          // Se não existe, inserir novo registro
          const { error: insertError } = await supabase
            .from('cursos')
            .insert({
              titulo: curso.title,
              descricao: curso.description || '',
              codigo: `LW-${curso.id.substring(0, 6).toUpperCase()}`,
              learning_worlds_id: curso.id,
              valor_total: curso.price || 0,
              valor_mensalidade: curso.price ? (curso.price / 12) : 0,
              carga_horaria: duracao,
              imagem_url: curso.image || '',
              modalidade: 'EAD',
              data_criacao: new Date().toISOString(),
              data_atualizacao: new Date().toISOString()
            });
          
          if (insertError) {
            console.error(`Erro ao inserir curso ${curso.id}:`, insertError);
          }
        }
      }

      // Atualizar contagem e última sincronização
      setLastSyncCursos(new Date().toLocaleTimeString());
      loadCounts();
      toast.success(`${data.data.length} cursos sincronizados com sucesso!`);
    } catch (error) {
      console.error("Erro na sincronização de cursos:", error);
      toast.error("Erro ao sincronizar cursos. Verifique o console para mais detalhes.");
    } finally {
      setIsSyncingCursos(false);
    }
  };

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
              <APIStatus 
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
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                />
                
                <SincronizacaoCard
                  title="Cursos"
                  description="Sincronize os cursos da LearnWorlds com o sistema"
                  buttonText="Sincronizar Cursos"
                  count={countCursos}
                  lastSync={lastSyncCursos}
                  onSync={() => navigate("/admin/matriculas/sincronizacao/cursos")}
                  isSyncing={isSyncingCursos}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>}
                />
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Sincronização Direta</h3>
                <div className="flex flex-col gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={isSyncingAlunos || !isConnected}
                    onClick={sincronizarAlunos}
                  >
                    {isSyncingAlunos ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sincronizando alunos...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users mr-2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        Importar Alunos Diretamente
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={isSyncingCursos || !isConnected}
                    onClick={sincronizarCursos}
                  >
                    {isSyncingCursos ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sincronizando cursos...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open mr-2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                        Importar Cursos Diretamente
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SincronizacaoLearnWorlds;
