
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Search, AlertCircle, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ADMIN_BYPASS_JWT } from "@/hooks/auth/adminBypass";
import { supabase } from "@/integrations/supabase/client";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import LearnWorldsErrorAlert from "./LearnWorldsErrorAlert";

interface Curso {
  id: string;
  title: string;
  description: string;
  price?: number;
  duration?: string;
  image?: string;
}

const SincronizacaoCursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState(false);
  const [sincronizandoItem, setSincronizandoItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [success, setSuccess] = useState<string | null>(null);
  const itemsPerPage = 10;
  const { getCourses, offlineMode } = useLearnWorldsApi();
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCursos();
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCursos(cursos);
    } else {
      const filtered = cursos.filter(curso =>
        curso.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curso.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCursos(filtered);
    }
  }, [searchQuery, cursos]);

  const fetchCursos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await getCourses(currentPage, itemsPerPage);
      
      if (!resultado) {
        throw new Error("Falha ao carregar cursos");
      }
      
      setCursos(resultado.data || []);
      setFilteredCursos(resultado.data || []);
      setTotalPages(Math.ceil((resultado.total || 0) / itemsPerPage));
      
      if (offlineMode) {
        setError("API LearnWorlds está operando em modo offline. Os dados exibidos são simulados.");
      }
    } catch (err) {
      console.error("Erro ao buscar cursos:", err);
      setError("Não foi possível carregar os cursos da LearnWorlds.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Função para inserir/atualizar um curso no banco de dados
  const sincronizarCursoIndividual = async (curso: Curso) => {
    try {
      setSincronizandoItem(curso.id);
      
      // Verificar se o curso já existe pelo learning_worlds_id
      const { data: existingCourse, error: queryError } = await supabase
        .from('cursos')
        .select('id, titulo')
        .eq('learning_worlds_id', curso.id)
        .maybeSingle();
      
      if (queryError) {
        console.error(`Erro ao buscar curso ${curso.id}:`, queryError);
        throw new Error(`Erro ao verificar curso existente: ${queryError.message}`);
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
          throw new Error(`Erro ao atualizar curso: ${updateError.message}`);
        }
        
        toast.success(`Curso "${curso.title}" atualizado com sucesso!`);
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
          throw new Error(`Erro ao criar curso: ${insertError.message}`);
        }
        
        toast.success(`Curso "${curso.title}" importado com sucesso!`);
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao sincronizar curso ${curso.id}:`, error);
      toast.error(`Erro ao sincronizar curso "${curso.title}"`);
      return false;
    } finally {
      setSincronizandoItem(null);
    }
  };

  const sincronizarCursos = async () => {
    setSincronizando(true);
    setSuccess(null);
    
    try {
      // Buscar todos os cursos da API para sincronizar
      const resultado = await getCourses(1, 100); // Pegamos um número maior para sincronizar mais cursos
      
      if (!resultado || !resultado.data) {
        throw new Error("Falha ao obter cursos para sincronização");
      }
      
      let atualizados = 0;
      let criados = 0;
      let falhas = 0;
      
      // Para cada curso da LearnWorlds
      for (const curso of resultado.data) {
        // Verificar se o curso já existe pelo learning_worlds_id
        const { data: existingCourse, error: queryError } = await supabase
          .from('cursos')
          .select('id, titulo')
          .eq('learning_worlds_id', curso.id)
          .maybeSingle();
        
        if (queryError) {
          console.error(`Erro ao buscar curso ${curso.id}:`, queryError);
          falhas++;
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
            falhas++;
          } else {
            atualizados++;
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
            falhas++;
          } else {
            criados++;
          }
        }
      }
      
      // Mostrar mensagem de sucesso
      const mensagem = `Sincronização concluída: ${criados} cursos importados, ${atualizados} atualizados.${falhas > 0 ? ` ${falhas} falhas.` : ''}`;
      setSuccess(mensagem);
      toast.success(mensagem);
      
      // Recarregar a lista após sincronização
      fetchCursos();
    } catch (err) {
      console.error("Erro ao sincronizar cursos:", err);
      toast.error("Erro ao sincronizar cursos");
      setError(err instanceof Error ? err.message : "Erro ao sincronizar cursos");
    } finally {
      setSincronizando(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calcular índices para paginação
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCursos = filteredCursos.slice(startIndex, endIndex);
  
  // Gerar array com números de páginas para paginação
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com título e botão de sincronização */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sincronização de Cursos</h2>
          <p className="text-muted-foreground">
            Sincronize cursos da plataforma LearnWorlds com o sistema de matrículas
          </p>
        </div>
        <Button 
          onClick={sincronizarCursos}
          disabled={sincronizando}
        >
          {sincronizando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Sincronizar Todos
            </>
          )}
        </Button>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <LearnWorldsErrorAlert errorMessage={error} />
      )}
      
      {/* Mensagem de sucesso */}
      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Campo de busca */}
      <div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cursos..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Tabela de cursos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Cursos disponíveis na LearnWorlds</span>
            <Badge variant="outline" className="ml-2">
              {filteredCursos.length} curso(s)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : currentCursos.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Curso</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="hidden md:table-cell">Duração</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCursos.map((curso) => (
                    <TableRow key={curso.id}>
                      <TableCell className="font-medium">{curso.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{curso.description}</TableCell>
                      <TableCell className="hidden md:table-cell">{curso.duration || "N/A"}</TableCell>
                      <TableCell>
                        {curso.price 
                          ? `R$ ${curso.price.toFixed(2).replace('.', ',')}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => sincronizarCursoIndividual(curso)}
                          disabled={sincronizandoItem === curso.id}
                        >
                          {sincronizandoItem === curso.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Sincronizar"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">Nenhum curso encontrado.</p>
              {searchQuery && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Limpar busca
                </Button>
              )}
            </div>
          )}

          {/* Paginação */}
          {filteredCursos.length > 0 && totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                      <PaginationLink
                        onClick={() => handlePageChange(number)}
                        isActive={currentPage === number}
                        className="cursor-pointer"
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SincronizacaoCursos;
