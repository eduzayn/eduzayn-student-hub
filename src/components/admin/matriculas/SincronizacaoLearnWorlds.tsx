
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, Download, Check, AlertCircle, ChevronRight, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface SyncResults {
  imported: number;
  updated: number;
  failed: number;
  total: number;
  logs: string[];
}

const SincronizacaoLearnWorlds: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState<number>(100);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [results, setResults] = useState<SyncResults | null>(null);
  const [activeTab, setActiveTab] = useState<string>("sync");
  const { isLoggedIn, getAuthToken } = useAuth();

  const handleSincronizar = async (syncAll: boolean = false) => {
    if (!isLoggedIn) {
      toast.error("Você precisa estar autenticado para sincronizar alunos");
      return;
    }

    setLoading(true);
    setResults(null);
    
    try {
      const token = await getAuthToken();
      
      if (!token) {
        toast.error("Não foi possível obter o token de autenticação");
        return;
      }

      // Construir URL com parâmetros de consulta
      const params = new URLSearchParams();
      params.append("syncAll", syncAll ? "true" : "false");
      params.append("pageSize", pageSize.toString());
      params.append("page", pageNumber.toString());
      
      const response = await fetch(`/functions/v1/learnworlds-sync?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha na sincronização");
      }

      const data = await response.json();
      setResults(data);
      
      if (data.imported > 0 || data.updated > 0) {
        toast.success(
          `Sincronização concluída com sucesso`, 
          { 
            description: `${data.imported} alunos importados e ${data.updated} atualizados.` 
          }
        );
      } else {
        toast.info(
          "Sincronização concluída",
          {
            description: "Nenhum aluno foi importado ou atualizado."
          }
        );
      }
      
      setActiveTab("logs");
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast.error("Erro ao sincronizar com LearnWorlds", {
        description: error.message || "Tente novamente mais tarde"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadges = () => {
    if (!results) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Check className="w-3 h-3 mr-1" /> {results.imported} Importados
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <RefreshCw className="w-3 h-3 mr-1" /> {results.updated} Atualizados
        </Badge>
        {results.failed > 0 && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" /> {results.failed} Falhas
          </Badge>
        )}
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <Users className="w-3 h-3 mr-1" /> {results.total} Total
        </Badge>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" /> Sincronização de Alunos LearnWorlds
        </CardTitle>
        <CardDescription>
          Sincronize os dados dos alunos da plataforma LearnWorlds com o sistema de matrículas
        </CardDescription>
        {renderStatusBadges()}
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-6">
          <TabsTrigger value="sync">Sincronizar</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <CardContent>
          <TabsContent value="sync">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sincronização por Páginas</h3>
                <p className="text-sm text-muted-foreground">
                  Busque e sincronize alunos da LearnWorlds por páginas específicas
                </p>
                
                <div className="flex items-end gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="pageSize">
                      Alunos por página
                    </label>
                    <Input 
                      id="pageSize" 
                      type="number" 
                      value={pageSize} 
                      onChange={(e) => setPageSize(parseInt(e.target.value) || 10)} 
                      className="w-32"
                      min={1}
                      max={500}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="pageNumber">
                      Número da página
                    </label>
                    <Input 
                      id="pageNumber" 
                      type="number" 
                      value={pageNumber} 
                      onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)} 
                      className="w-32"
                      min={1}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => handleSincronizar(false)} 
                    disabled={loading}
                    className="ml-2"
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Sincronizar Página
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sincronização Completa</h3>
                <p className="text-sm text-muted-foreground">
                  Busque e sincronize todos os alunos da LearnWorlds (pode demorar)
                </p>
                
                <Button 
                  onClick={() => handleSincronizar(true)} 
                  disabled={loading}
                  variant="secondary"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  Sincronizar Todos os Alunos
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <div className="space-y-4">
              <div className="border rounded-md">
                <ScrollArea className="h-[400px] w-full">
                  {results && results.logs.length > 0 ? (
                    <div className="p-4 space-y-2 font-mono text-sm">
                      {results.logs.map((log, index) => (
                        <div 
                          key={index} 
                          className={`py-1 px-2 rounded ${
                            log.includes("erro") || log.includes("falha") 
                              ? "bg-red-50 text-red-700" 
                              : log.includes("atualizado") 
                                ? "bg-blue-50 text-blue-700" 
                                : log.includes("importado") 
                                  ? "bg-green-50 text-green-700" 
                                  : "bg-gray-50"
                          }`}
                        >
                          <ChevronRight className="inline h-3 w-3 mr-1" />
                          {log.replace(/\[\d{4}-\d{2}-\d{2}T.*?Z\]/, '')}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      {loading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin mb-2" />
                          <p>Processando sincronização...</p>
                        </div>
                      ) : (
                        <p>Nenhum log disponível. Execute uma sincronização primeiro.</p>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Os alunos importados são armazenados na tabela de perfis e podem ser associados a matrículas
        </p>
      </CardFooter>
    </Card>
  );
};

export default SincronizacaoLearnWorlds;
