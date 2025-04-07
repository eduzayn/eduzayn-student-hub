
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw, ChevronLeft, ChevronRight, Users, Download, Loader2 } from "lucide-react";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import LearnWorldsErrorAlert from "./LearnWorldsErrorAlert";
import { supabase } from "@/integrations/supabase/client";

const SincronizacaoAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState<boolean>(false);
  const { getUsers, offlineMode } = useLearnWorldsApi();
  
  useEffect(() => {
    carregarAlunos();
  }, [page]);
  
  const carregarAlunos = async (termo?: string) => {
    setLoading(true);
    setApiError(null);
    
    try {
      const termoBusca = termo !== undefined ? termo : busca;
      const resultado = await getUsers(page, 10, termoBusca);
      
      if (!resultado) {
        throw new Error("Falha ao carregar alunos do LearnWorlds");
      }
      
      setAlunos(resultado.data || []);
      setTotalPages(resultado.pages || 1);
      
      if (offlineMode) {
        setApiError("API LearnWorlds está operando em modo offline. Os dados exibidos são simulados.");
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      setApiError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    setPage(1); // Voltar para a primeira página ao buscar
    carregarAlunos(busca);
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(p => p + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  };
  
  const refreshAlunos = () => {
    carregarAlunos();
    toast.success("Lista de alunos atualizada");
  };

  const sincronizarAlunos = async () => {
    setSincronizando(true);
    try {
      // Primeiro obtém os alunos atuais
      const resultado = await getUsers(1, 100); // Pegamos um número maior para sincronizar mais alunos
      
      if (!resultado || !resultado.data) {
        throw new Error("Falha ao obter alunos para sincronização");
      }
      
      let atualizados = 0;
      let criados = 0;
      
      // Para cada aluno da LearnWorlds
      for (const aluno of resultado.data) {
        // Verificar se já existe no Supabase
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
          } else {
            atualizados++;
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
          } else {
            criados++;
          }
        }
      }
      
      toast.success(`Sincronização concluída: ${criados} alunos importados, ${atualizados} atualizados.`);
      // Recarregar a lista após sincronização
      carregarAlunos();
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast.error("Erro ao sincronizar alunos. Verifique o console para detalhes.");
      setApiError(error instanceof Error ? error.message : "Erro na sincronização");
    } finally {
      setSincronizando(false);
    }
  };
  
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Alunos LearnWorlds
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshAlunos} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="default" size="sm" onClick={sincronizarAlunos} disabled={sincronizando || loading}>
              {sincronizando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Sincronizar Todos
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {apiError && (
            <LearnWorldsErrorAlert errorMessage={apiError} />
          )}
          
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar alunos por nome, email ou CPF..."
                className="pl-8"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              Buscar
            </Button>
          </div>
          
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum aluno encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      alunos.map((aluno) => (
                        <TableRow key={aluno.id}>
                          <TableCell className="font-medium">{aluno.id}</TableCell>
                          <TableCell>{`${aluno.firstName} ${aluno.lastName}`}</TableCell>
                          <TableCell>{aluno.email}</TableCell>
                          <TableCell>{aluno.customField1 || "N/A"}</TableCell>
                          <TableCell>{aluno.phoneNumber || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {alunos.length > 0 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Página {page} de {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Página anterior</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Próxima página</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mt-6 text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <p>Estes alunos estão sincronizados com a plataforma LearnWorlds. Clique em "Sincronizar Todos" para importá-los para o banco de dados.</p>
            <p className="mt-1">Total de alunos encontrados: {alunos.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SincronizacaoAlunos;
