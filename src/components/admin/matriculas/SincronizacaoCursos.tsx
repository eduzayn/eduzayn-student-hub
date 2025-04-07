
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw, ChevronLeft, ChevronRight, Book } from "lucide-react";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import LearnWorldsErrorAlert from "./LearnWorldsErrorAlert";

const SincronizacaoCursos: React.FC = () => {
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const { getCourses, offlineMode } = useLearnWorldsApi();
  
  useEffect(() => {
    carregarCursos();
  }, [page]);
  
  const carregarCursos = async (termo?: string) => {
    setLoading(true);
    setApiError(null);
    
    try {
      const termoBusca = termo !== undefined ? termo : busca;
      const resultado = await getCourses(page, 10, termoBusca);
      
      if (!resultado) {
        throw new Error("Falha ao carregar cursos do LearnWorlds");
      }
      
      setCursos(resultado.data || []);
      setTotalPages(resultado.pages || 1);
      
      if (offlineMode) {
        setApiError("API LearnWorlds está operando em modo offline. Os dados exibidos são simulados.");
      }
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      setApiError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    setPage(1); // Voltar para a primeira página ao buscar
    carregarCursos(busca);
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
  
  const refreshCursos = () => {
    carregarCursos();
    toast.success("Lista de cursos atualizada");
  };
  
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <Book className="mr-2 h-5 w-5" />
            Cursos LearnWorlds
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refreshCursos}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          {apiError && (
            <LearnWorldsErrorAlert errorMessage={apiError} />
          )}
          
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar cursos..."
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
                  <Skeleton className="h-12 w-12 rounded" />
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
                      <TableHead>Nome do Curso</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Duração</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cursos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Nenhum curso encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      cursos.map((curso) => (
                        <TableRow key={curso.id}>
                          <TableCell className="font-medium">{curso.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{curso.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {curso.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {curso.price ? new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            }).format(curso.price) : "N/A"}
                          </TableCell>
                          <TableCell>{curso.duration || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {cursos.length > 0 && (
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
            <p>Estes cursos estão sincronizados com a plataforma LearnWorlds. Qualquer alteração feita na plataforma será refletida aqui após a sincronização.</p>
            <p className="mt-1">Total de cursos encontrados: {cursos.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SincronizacaoCursos;
