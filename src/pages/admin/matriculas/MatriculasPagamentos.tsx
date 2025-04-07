
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Download, 
  Filter, 
  MoreHorizontal, 
  Search 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import MatriculasLayout from "@/components/layout/MatriculasLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pagamento, PagamentoCompleto } from "@/types/matricula";

const MatriculasPagamentos: React.FC = () => {
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");
  
  // Consulta modificada para buscar os pagamentos
  const { data: pagamentos, isLoading, error } = useQuery({
    queryKey: ["pagamentos", filtro],
    queryFn: async () => {
      let query = supabase.from("pagamentos_matricula").select(`
        *,
        matriculas(
          id,
          aluno_id,
          curso_id,
          aluno:aluno_id(email),
          curso:curso_id(titulo)
        )
      `);
      
      if (filtro !== "todos") {
        query = query.eq("status", filtro);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Erro na consulta de pagamentos:", error);
        throw new Error(error.message);
      }
      
      // Transformando os dados para corresponder à interface PagamentoCompleto
      const pagamentosProcessados = data?.map(pagamento => {
        return {
          ...pagamento,
          matriculas: {
            id: pagamento.matriculas?.id,
            alunos: {
              nome: pagamento.matriculas?.aluno?.email?.split('@')[0] || 'Sem nome',
              email: pagamento.matriculas?.aluno?.email
            },
            cursos: {
              titulo: pagamento.matriculas?.curso?.titulo || 'Curso não especificado'
            }
          }
        };
      }) as PagamentoCompleto[] || [];
      
      return pagamentosProcessados;
    },
    meta: {
      onSettled: (data, error: Error | null) => {
        if (error) {
          toast.error("Erro ao carregar pagamentos: " + error.message);
        }
      }
    }
  });
  
  // Estado para a aba ativa
  const [activeTab, setActiveTab] = useState("pagamentos");
  
  // Função para converter status em badge
  const renderStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: string, label: string }> = {
      pendente: { variant: "outline", label: "Pendente" },
      processando: { variant: "secondary", label: "Processando" },
      pago: { variant: "success", label: "Pago" },
      atrasado: { variant: "destructive", label: "Atrasado" },
      cancelado: { variant: "outline", label: "Cancelado" },
    };
    
    const statusInfo = statusMap[status] || { variant: "default", label: status };
    
    return (
      <Badge variant={statusInfo.variant as any}>
        {statusInfo.label}
      </Badge>
    );
  };
  
  // Filtrar pagamentos com base na busca
  const pagamentosFiltrados = pagamentos?.filter((pagamento) => {
    if (!busca) return true;
    
    const termoLower = busca.toLowerCase();
    const aluno = pagamento.matriculas?.alunos?.nome || "";
    const curso = pagamento.matriculas?.cursos?.titulo || "";
    
    return (
      aluno.toLowerCase().includes(termoLower) ||
      curso.toLowerCase().includes(termoLower) ||
      pagamento.forma_pagamento.toLowerCase().includes(termoLower)
    );
  });
  
  // Função para formatar moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Cálculo de totais para estatísticas
  const totalRecebido = pagamentos
    ? pagamentos
        .filter(p => p.status === 'pago')
        .reduce((acc, p) => acc + Number(p.valor), 0)
    : 0;
    
  const totalPendentes = pagamentos
    ? pagamentos.filter(p => p.status === 'pendente').length
    : 0;
    
  const totalAtrasados = pagamentos
    ? pagamentos.filter(p => p.status === 'atrasado').length
    : 0;

  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Pagamentos</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pagamentos" className="space-y-6">
            {/* Cabeçalho e estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Recebido
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatarMoeda(totalRecebido)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pendentes
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalPendentes}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pagamentos Atrasados
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalAtrasados}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Barra de filtro e busca */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filtro}
                  onValueChange={setFiltro}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="pago">Pagos</SelectItem>
                    <SelectItem value="atrasado">Atrasados</SelectItem>
                    <SelectItem value="cancelado">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar pagamento..."
                  className="pl-8"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>
            
            {/* Tabela de pagamentos */}
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center p-6 text-destructive">
                    Erro ao carregar pagamentos
                  </div>
                ) : pagamentosFiltrados?.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">
                    Nenhum pagamento encontrado
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagamentosFiltrados?.map((pagamento) => (
                        <TableRow key={pagamento.id}>
                          <TableCell className="font-medium">
                            {pagamento.matriculas?.alunos?.nome || "N/A"}
                          </TableCell>
                          <TableCell>
                            {pagamento.matriculas?.cursos?.titulo || "N/A"}
                          </TableCell>
                          <TableCell>{formatarMoeda(Number(pagamento.valor))}</TableCell>
                          <TableCell>{pagamento.forma_pagamento}</TableCell>
                          <TableCell>
                            {format(new Date(pagamento.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(pagamento.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Registrar pagamento
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <a 
                                    href={pagamento.link_pagamento} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center w-full"
                                  >
                                    Abrir link de pagamento
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <div className="flex items-center">
                                    <Download className="mr-2 h-4 w-4" />
                                    Baixar comprovante
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configuracoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Pagamento</CardTitle>
                <CardDescription>
                  Configure os gateways de pagamento e as opções de parcelamento.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Asaas</CardTitle>
                      <CardDescription>
                        Configurações para o gateway de pagamento Asaas.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Status:</h3>
                          <Badge className="bg-green-500">Conectado</Badge>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Configurar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Lytex</CardTitle>
                      <CardDescription>
                        Configurações para o gateway de pagamento Lytex.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Status:</h3>
                          <Badge variant="outline">Não configurado</Badge>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Configurar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MatriculasLayout>
  );
};

export default MatriculasPagamentos;
