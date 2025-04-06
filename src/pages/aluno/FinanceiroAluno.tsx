
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, AlertCircle, Clock } from "lucide-react";

const FinanceiroAluno: React.FC = () => {
  // Dados mock para exibição
  const resumoFinanceiro = {
    valorMensalidade: 499.90,
    valorTotalCurso: 5998.80,
    parcelasPagas: 3,
    parcelasTotais: 12,
    proximoVencimento: "15/04/2025",
    statusGeral: "em_dia" as const
  };
  
  const parcelas = [
    { 
      id: 1, 
      valor: 499.90, 
      dataVencimento: "15/01/2025", 
      dataPagamento: "12/01/2025",
      status: "pago" as const,
      linkBoleto: "#",
      comprovante: "#"
    },
    { 
      id: 2, 
      valor: 499.90, 
      dataVencimento: "15/02/2025", 
      dataPagamento: "14/02/2025",
      status: "pago" as const,
      linkBoleto: "#",
      comprovante: "#"
    },
    { 
      id: 3, 
      valor: 499.90, 
      dataVencimento: "15/03/2025", 
      dataPagamento: "15/03/2025",
      status: "pago" as const,
      linkBoleto: "#",
      comprovante: "#"
    },
    { 
      id: 4, 
      valor: 499.90, 
      dataVencimento: "15/04/2025", 
      dataPagamento: undefined,
      status: "pendente" as const,
      linkBoleto: "#",
      comprovante: undefined
    },
    { 
      id: 5, 
      valor: 499.90, 
      dataVencimento: "15/05/2025", 
      dataPagamento: undefined,
      status: "pendente" as const,
      linkBoleto: "#",
      comprovante: undefined
    }
  ];
  
  // Função para renderizar o status da parcela
  const renderStatus = (status: string) => {
    switch (status) {
      case "pago":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" /> Pago
          </Badge>
        );
      case "pendente":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" /> Pendente
          </Badge>
        );
      case "atrasado":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" /> Atrasado
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Função para obter a classe de cor do status geral
  const getStatusGeralClass = (status: string) => {
    switch (status) {
      case "em_dia":
        return "text-green-600";
      case "pendente":
        return "text-amber-600";
      case "atrasado":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };
  
  // Função para converter o status em texto legível
  const getStatusGeralText = (status: string) => {
    switch (status) {
      case "em_dia":
        return "Em dia";
      case "pendente":
        return "Pendente";
      case "atrasado":
        return "Atrasado";
      case "bloqueado":
        return "Bloqueado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground">
          Gerencie suas mensalidades e informações de pagamento.
        </p>
      </div>
      
      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
          <CardDescription>Visão geral do seu plano financeiro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor da Mensalidade</p>
              <p className="text-2xl font-bold">
                {resumoFinanceiro.valorMensalidade.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Total do Curso</p>
              <p className="text-2xl font-bold">
                {resumoFinanceiro.valorTotalCurso.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Parcelas</p>
              <p className="text-2xl font-bold">
                {resumoFinanceiro.parcelasPagas}/{resumoFinanceiro.parcelasTotais}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`text-2xl font-bold ${getStatusGeralClass(resumoFinanceiro.statusGeral)}`}>
                {getStatusGeralText(resumoFinanceiro.statusGeral)}
              </p>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Próximo Vencimento</p>
                <p className="font-medium">{resumoFinanceiro.proximoVencimento}</p>
              </div>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm font-medium flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Pagar Agora
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Parcelas */}
      <Tabs defaultValue="parcelas" className="w-full">
        <TabsList>
          <TabsTrigger value="parcelas">Parcelas</TabsTrigger>
          <TabsTrigger value="opcoes">Opções de Pagamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parcelas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Parcelas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Parcela</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Vencimento</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Pagamento</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcelas.map((parcela) => (
                      <tr key={parcela.id} className="border-b">
                        <td className="py-3 px-4">{parcela.id}</td>
                        <td className="py-3 px-4">
                          {parcela.valor.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </td>
                        <td className="py-3 px-4">{parcela.dataVencimento}</td>
                        <td className="py-3 px-4">{parcela.dataPagamento || '-'}</td>
                        <td className="py-3 px-4">{renderStatus(parcela.status)}</td>
                        <td className="py-3 px-4 text-right">
                          {parcela.status === "pendente" ? (
                            <button className="bg-primary text-primary-foreground hover:bg-primary/90 py-1 px-3 rounded-md text-sm">
                              Pagar
                            </button>
                          ) : (
                            <button className="bg-muted hover:bg-muted/80 py-1 px-3 rounded-md text-sm">
                              Comprovante
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="opcoes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Opções de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="mr-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cartão de Crédito</h3>
                    <p className="text-sm text-muted-foreground">
                      Pague com cartão de crédito em até 12x
                    </p>
                  </div>
                  <button className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm font-medium">
                    Selecionar
                  </button>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="mr-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" className="text-muted-foreground">
                      <path fill="currentColor" d="M18 7h-1V6a5 5 0 0 0-10 0v1H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-7 8.5a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5zM15 7H9V6a3 3 0 0 1 6 0v1z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Boleto Bancário</h3>
                    <p className="text-sm text-muted-foreground">
                      Vencimento em 3 dias úteis
                    </p>
                  </div>
                  <button className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm font-medium">
                    Selecionar
                  </button>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="mr-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" className="text-muted-foreground">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67c0-.84.79-1.43 2.1-1.43c1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81c0 1.79 1.49 2.69 3.66 3.21c1.95.46 2.34 1.15 2.34 1.87c0 .53-.39 1.39-2.1 1.39c-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77c-.01-2.2-1.9-2.96-3.66-3.42z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Pix</h3>
                    <p className="text-sm text-muted-foreground">
                      Pagamento instantâneo
                    </p>
                  </div>
                  <button className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm font-medium">
                    Selecionar
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceiroAluno;
