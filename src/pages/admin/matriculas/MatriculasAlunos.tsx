
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Search, RefreshCw, UserCircle2, Users, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import AlunosDetalhes from "@/components/admin/matriculas/alunos/AlunosDetalhes";
import AlunosFiltro from "@/components/admin/matriculas/alunos/AlunosFiltro";

const MatriculasAlunos: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { getUsers, loading: loadingApi } = useLearnWorldsApi();
  
  const [alunos, setAlunos] = useState<any[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  
  const pageSize = 10;
  
  // Carregar alunos do banco de dados
  const carregarAlunos = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setAlunos(data);
        aplicarFiltros(data, searchTerm, filtroStatus);
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Falha ao carregar alunos", { 
        description: "Não foi possível buscar os dados dos alunos" 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Aplicar filtros nos alunos
  const aplicarFiltros = (data: any[], termo: string, status: string) => {
    let resultado = [...data];
    
    // Filtrar por termo de busca
    if (termo) {
      resultado = resultado.filter(aluno => 
        aluno.first_name?.toLowerCase().includes(termo.toLowerCase()) ||
        aluno.last_name?.toLowerCase().includes(termo.toLowerCase()) ||
        aluno.email?.toLowerCase().includes(termo.toLowerCase()) ||
        aluno.numero_matricula?.toLowerCase().includes(termo.toLowerCase())
      );
    }
    
    // Filtrar por status
    if (status !== "todos") {
      resultado = resultado.filter(aluno => aluno.status === status);
    }
    
    // Aplicar paginação
    setTotalPages(Math.ceil(resultado.length / pageSize));
    
    // Atualizar alunos filtrados
    setFilteredAlunos(resultado);
  };
  
  // Efeito para carregar alunos quando o componente for montado
  useEffect(() => {
    if (isLoggedIn) {
      carregarAlunos();
    }
  }, [isLoggedIn]);
  
  // Efeito para aplicar filtros quando os critérios mudarem
  useEffect(() => {
    aplicarFiltros(alunos, searchTerm, filtroStatus);
  }, [searchTerm, filtroStatus, currentPage]);
  
  // Lidar com a pesquisa
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Voltar para a primeira página ao pesquisar
  };
  
  // Obter os alunos da página atual
  const getCurrentPageAlunos = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAlunos.slice(startIndex, endIndex);
  };
  
  // Navegar para o formulário de nova matrícula com aluno pré-selecionado
  const criarNovaMatricula = (aluno: any) => {
    navigate('/admin/matriculas/nova', { state: { alunoSelecionado: aluno } });
  };
  
  // Função para exibir os detalhes do aluno
  const verDetalhes = (aluno: any) => {
    setAlunoSelecionado(aluno);
  };

  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Users className="mr-2" /> Gestão de Alunos
        </h1>
        
        <Tabs defaultValue="lista" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="lista">Lista de Alunos</TabsTrigger>
            <TabsTrigger value="detalhes" disabled={!alunoSelecionado}>
              {alunoSelecionado ? `${alunoSelecionado.first_name} ${alunoSelecionado.last_name}` : "Detalhes"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lista">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg font-medium">Alunos</CardTitle>
                  <CardDescription>
                    Gerenciamento de alunos no sistema de matrículas
                  </CardDescription>
                </div>
                <Button onClick={() => navigate('/admin/matriculas/nova')}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Nova Matrícula
                </Button>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar aluno por nome, email ou matrícula..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => carregarAlunos()}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                      Atualizar
                    </Button>
                    
                    <AlunosFiltro 
                      filtroStatus={filtroStatus} 
                      setFiltroStatus={setFiltroStatus} 
                    />
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">Matrícula</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <RefreshCw className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground mt-2">Carregando alunos...</p>
                          </TableCell>
                        </TableRow>
                      ) : getCurrentPageAlunos().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <UserCircle2 className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                            <p className="text-muted-foreground">Nenhum aluno encontrado</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Cadastre um novo aluno para começar'}
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        getCurrentPageAlunos().map((aluno) => (
                          <TableRow key={aluno.id}>
                            <TableCell className="font-medium">
                              {aluno.first_name} {aluno.last_name}
                            </TableCell>
                            <TableCell>{aluno.email}</TableCell>
                            <TableCell className="hidden md:table-cell">{aluno.numero_matricula || '-'}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge 
                                variant={
                                  aluno.status === 'ativo' ? 'default' : 
                                  aluno.status === 'trancado' ? 'secondary' : 
                                  aluno.status === 'concluido' ? 'success' :
                                  aluno.status === 'cancelado' ? 'destructive' : 'outline'
                                }
                              >
                                {aluno.status || 'Não definido'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => verDetalhes(aluno)}
                                >
                                  Ver
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => criarNovaMatricula(aluno)}
                                >
                                  Matricular
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            onClick={() => setCurrentPage(page)}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="detalhes">
            {alunoSelecionado ? (
              <AlunosDetalhes 
                aluno={alunoSelecionado} 
                onBack={() => setAlunoSelecionado(null)} 
                onReload={carregarAlunos} 
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Selecione um aluno para ver detalhes</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MatriculasLayout>
  );
};

export default MatriculasAlunos;
