
import React, { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, BookOpen, FileEdit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Curso } from "@/types/matricula";

interface CursosListProps {
  onCursoSelect: (cursoId: string) => void;
}

const CursosList: React.FC<CursosListProps> = ({ onCursoSelect }) => {
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filtro, setFiltro] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limitPorPagina = 10;

  useEffect(() => {
    carregarCursos();
  }, [page]);

  const carregarCursos = async () => {
    setLoading(true);
    try {
      // Buscar total para paginação
      const { count, error: countError } = await supabase
        .from('cursos')
        .select('*', { count: 'exact', head: true })
        .ilike('titulo', `%${filtro}%`);

      if (countError) throw countError;
      
      // Calcular total de páginas
      if (count) {
        setTotalPages(Math.ceil(count / limitPorPagina));
      }

      // Buscar cursos para a página atual
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .ilike('titulo', `%${filtro}%`)
        .order('titulo', { ascending: true })
        .range((page - 1) * limitPorPagina, page * limitPorPagina - 1);

      if (error) throw error;
      
      setCursos(data || []);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      toast.error("Falha ao carregar cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1); // Voltar para primeira página ao filtrar
    carregarCursos();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lista de Cursos</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => carregarCursos()}
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                window.location.href = "/admin/matriculas/sincronizacao";
              }}
            >
              <BookOpen className="h-4 w-4 mr-2" /> Sincronizar Cursos
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Buscar curso por título..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" /> Buscar
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cursos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhum curso encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    cursos.map((curso) => (
                      <TableRow key={curso.id}>
                        <TableCell className="font-medium">{curso.titulo}</TableCell>
                        <TableCell>{curso.codigo}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {curso.modalidade || 'EAD'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(curso.valor_total || 0)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onCursoSelect(curso.id)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CursosList;
