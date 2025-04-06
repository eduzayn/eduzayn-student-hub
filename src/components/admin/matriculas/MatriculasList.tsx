
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/card";
import { Search, MoreHorizontal, Filter, Plus } from "lucide-react";
import StatusMatricula from "./StatusMatricula";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Matricula {
  id: string;
  aluno: {
    id: string;
    nome: string;
    email: string;
  };
  curso: {
    id: string;
    titulo: string;
  };
  status: string;
  data_inicio: string;
  forma_ingresso: string;
}

const MatriculasList: React.FC = () => {
  const navigate = useNavigate();
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");
  
  useEffect(() => {
    fetchMatriculas();
  }, []);
  
  const fetchMatriculas = async () => {
    setLoading(true);
    
    try {
      // Por enquanto, vamos apenas simular o retorno - dados fictícios
      // No futuro, isso virá do Supabase
      setTimeout(() => {
        const dadosSimulados: Matricula[] = [
          {
            id: "1",
            aluno: {
              id: "a1",
              nome: "Ana Silva",
              email: "ana@exemplo.com"
            },
            curso: {
              id: "c1",
              titulo: "Análise de Sistemas"
            },
            status: "ativo",
            data_inicio: "2023-06-15T00:00:00Z",
            forma_ingresso: "Online"
          },
          {
            id: "2",
            aluno: {
              id: "a2",
              nome: "Carlos Santos",
              email: "carlos@exemplo.com"
            },
            curso: {
              id: "c2",
              titulo: "Engenharia de Software"
            },
            status: "pendente",
            data_inicio: "2023-07-10T00:00:00Z",
            forma_ingresso: "Presencial"
          },
          {
            id: "3",
            aluno: {
              id: "a3",
              nome: "Patricia Oliveira",
              email: "patricia@exemplo.com"
            },
            curso: {
              id: "c1",
              titulo: "Análise de Sistemas"
            },
            status: "trancado",
            data_inicio: "2023-05-20T00:00:00Z",
            forma_ingresso: "Transferência"
          },
          {
            id: "4",
            aluno: {
              id: "a4",
              nome: "Roberto Almeida",
              email: "roberto@exemplo.com"
            },
            curso: {
              id: "c3",
              titulo: "Ciência da Computação"
            },
            status: "formado",
            data_inicio: "2023-02-01T00:00:00Z",
            forma_ingresso: "Online"
          },
          {
            id: "5",
            aluno: {
              id: "a5",
              nome: "Mariana Costa",
              email: "mariana@exemplo.com"
            },
            curso: {
              id: "c2",
              titulo: "Engenharia de Software"
            },
            status: "inativo",
            data_inicio: "2023-08-05T00:00:00Z",
            forma_ingresso: "Presencial"
          }
        ];
        
        setMatriculas(dadosSimulados);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao buscar matrículas:", error);
      toast.error("Erro ao carregar matrículas");
      setLoading(false);
    }
  };
  
  // Filtragem das matrículas por status e busca
  const matriculasFiltradas = matriculas.filter(matricula => {
    // Filtro de status
    if (filtroStatus !== "todos" && matricula.status !== filtroStatus) {
      return false;
    }
    
    // Filtro de busca
    if (busca) {
      const termoBusca = busca.toLowerCase();
      return (
        matricula.aluno.nome.toLowerCase().includes(termoBusca) ||
        matricula.aluno.email.toLowerCase().includes(termoBusca) ||
        matricula.curso.titulo.toLowerCase().includes(termoBusca)
      );
    }
    
    return true;
  });
  
  // Formatar data para exibição
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold">Lista de Matrículas</h2>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por aluno, curso..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="trancado">Trancado</SelectItem>
                <SelectItem value="formado">Formado</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button onClick={() => navigate("/admin/matriculas/nova")}>
              <Plus className="h-4 w-4 mr-2" /> Nova
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        // Esqueleto de carregamento
        <div className="rounded-md border">
          <div className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Ingresso</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matriculasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Nenhuma matrícula encontrada
                  </TableCell>
                </TableRow>
              ) : (
                matriculasFiltradas.map((matricula) => (
                  <TableRow key={matricula.id}>
                    <TableCell className="font-medium">#{matricula.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{matricula.aluno.nome}</div>
                        <div className="text-sm text-muted-foreground">{matricula.aluno.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{matricula.curso.titulo}</TableCell>
                    <TableCell>
                      <StatusMatricula status={matricula.status} />
                    </TableCell>
                    <TableCell>{formatarData(matricula.data_inicio)}</TableCell>
                    <TableCell>{matricula.forma_ingresso}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/admin/matriculas/${matricula.id}`)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/matriculas/${matricula.id}/editar`)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => alert(`Gerar contrato para matrícula ${matricula.id}`)}>
                            Gerar contrato
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            Cancelar matrícula
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MatriculasList;
