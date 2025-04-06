
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Download, Eye, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Contrato {
  id: string;
  aluno: {
    nome: string;
    email: string;
  };
  matricula: {
    id: string;
    curso: string;
  };
  titulo: string;
  codigo: string;
  data_geracao: string;
  assinado: boolean;
  data_aceite?: string;
  versao: string;
}

interface Aditivo {
  id: string;
  contrato_id: string;
  aluno: {
    nome: string;
  };
  titulo: string;
  motivo: string;
  data_geracao: string;
  assinado: boolean;
  versao: string;
}

const MatriculasContratos: React.FC = () => {
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [aditivos, setAditivos] = useState<Aditivo[]>([]);
  const [tipoTab, setTipoTab] = useState<string>("contratos");
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    
    // Simulamos uma chamada de API com dados fictícios
    setTimeout(() => {
      // Dados fictícios para contratos
      const contratosSimulados: Contrato[] = [
        {
          id: "c1",
          aluno: {
            nome: "João Silva",
            email: "joao@exemplo.com"
          },
          matricula: {
            id: "m1",
            curso: "Engenharia de Software"
          },
          titulo: "Contrato de Prestação de Serviços Educacionais",
          codigo: "CONT-20230001",
          data_geracao: "2023-07-15T14:30:00Z",
          assinado: true,
          data_aceite: "2023-07-15T16:45:00Z",
          versao: "1.0"
        },
        {
          id: "c2",
          aluno: {
            nome: "Maria Oliveira",
            email: "maria@exemplo.com"
          },
          matricula: {
            id: "m2",
            curso: "Análise de Sistemas"
          },
          titulo: "Contrato de Prestação de Serviços Educacionais",
          codigo: "CONT-20230002",
          data_geracao: "2023-07-20T10:15:00Z",
          assinado: false,
          versao: "1.0"
        },
        {
          id: "c3",
          aluno: {
            nome: "Pedro Santos",
            email: "pedro@exemplo.com"
          },
          matricula: {
            id: "m3",
            curso: "Ciência da Computação"
          },
          titulo: "Contrato de Prestação de Serviços Educacionais",
          codigo: "CONT-20230003",
          data_geracao: "2023-08-05T09:45:00Z",
          assinado: true,
          data_aceite: "2023-08-05T14:30:00Z",
          versao: "1.0"
        }
      ];
      
      // Dados fictícios para aditivos
      const aditivosSimulados: Aditivo[] = [
        {
          id: "a1",
          contrato_id: "c1",
          aluno: {
            nome: "João Silva"
          },
          titulo: "Aditivo de Prorrogação de Prazo",
          motivo: "Prorrogação do prazo de conclusão do curso",
          data_geracao: "2023-09-10T11:30:00Z",
          assinado: true,
          versao: "1.1"
        },
        {
          id: "a2",
          contrato_id: "c3",
          aluno: {
            nome: "Pedro Santos"
          },
          titulo: "Aditivo de Alteração de Modalidade",
          motivo: "Mudança de modalidade presencial para online",
          data_geracao: "2023-10-05T08:45:00Z",
          assinado: false,
          versao: "1.1"
        }
      ];
      
      setContratos(contratosSimulados);
      setAditivos(aditivosSimulados);
      setLoading(false);
    }, 1000);
  };
  
  const handleVisualizarContrato = (id: string) => {
    toast.info(`Visualizando contrato ${id}`);
  };
  
  const handleDownloadContrato = (id: string) => {
    toast.success(`Contrato ${id} baixado com sucesso`);
  };
  
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Filtragem dos dados com base na busca
  const contratosFiltrados = contratos.filter(
    contrato =>
      contrato.aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
      contrato.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      contrato.matricula.curso.toLowerCase().includes(busca.toLowerCase())
  );
  
  const aditivosFiltrados = aditivos.filter(
    aditivo =>
      aditivo.aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
      aditivo.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      aditivo.motivo.toLowerCase().includes(busca.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold">Contratos e Aditivos</h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por aluno, código..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          
          <Button>
            <FileText className="h-4 w-4 mr-2" /> Novo Contrato
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="contratos" value={tipoTab} onValueChange={setTipoTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="aditivos">Aditivos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contratos" className="space-y-4">
          {loading ? (
            <div className="rounded-md border">
              <div className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Data Geração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Versão</TableHead>
                    <TableHead className="w-24 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        Nenhum contrato encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    contratosFiltrados.map((contrato) => (
                      <TableRow key={contrato.id}>
                        <TableCell className="font-medium">{contrato.codigo}</TableCell>
                        <TableCell>
                          <div>
                            <div>{contrato.aluno.nome}</div>
                            <div className="text-sm text-muted-foreground">{contrato.aluno.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{contrato.matricula.curso}</TableCell>
                        <TableCell>{formatarData(contrato.data_geracao)}</TableCell>
                        <TableCell>
                          {contrato.assinado ? (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-600">Assinado</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="text-amber-600">Pendente</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>v{contrato.versao}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleVisualizarContrato(contrato.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownloadContrato(contrato.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="aditivos" className="space-y-4">
          {loading ? (
            <div className="rounded-md border">
              <div className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Data Geração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Versão</TableHead>
                    <TableHead className="w-24 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aditivosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        Nenhum aditivo encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    aditivosFiltrados.map((aditivo) => (
                      <TableRow key={aditivo.id}>
                        <TableCell>{aditivo.aluno.nome}</TableCell>
                        <TableCell className="font-medium">{aditivo.titulo}</TableCell>
                        <TableCell>{aditivo.motivo}</TableCell>
                        <TableCell>{formatarData(aditivo.data_geracao)}</TableCell>
                        <TableCell>
                          {aditivo.assinado ? (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-600">Assinado</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="text-amber-600">Pendente</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>v{aditivo.versao}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatriculasContratos;
