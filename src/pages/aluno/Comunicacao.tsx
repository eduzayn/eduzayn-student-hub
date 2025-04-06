
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NovoProtocoloDialog } from "@/components/comunicacao/NovoProtocoloDialog";
import { ProtocolosList } from "@/components/comunicacao/ProtocolosList";
import { ChatProtocolo } from "@/components/comunicacao/ChatProtocolo";
import { AtendentesOnline } from "@/components/comunicacao/AtendentesOnline";
import { StatusProtocolo, Protocolo } from "@/types/comunicacao";

const Comunicacao = () => {
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<Protocolo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<StatusProtocolo | 'todos'>('todos');
  const { toast } = useToast();

  useEffect(() => {
    carregarProtocolos();
  }, []);

  const carregarProtocolos = async () => {
    setIsLoading(true);
    try {
      // Aqui faríamos a chamada para o Supabase para buscar os protocolos do aluno
      // Por enquanto usaremos dados mockados
      const mockProtocolos: Protocolo[] = [
        {
          id: "1",
          numero: "P2025-00001",
          titulo: "Problema com acesso ao material do módulo 2",
          mensagem: "Não consigo acessar o PDF do módulo 2 do curso de Gestão Financeira.",
          setor: "tutoria",
          status: "aberto",
          dataCriacao: new Date().toISOString(),
          dataAtualizacao: new Date().toISOString(),
          alunoId: "1",
          tempoEspera: "5 minutos"
        },
        {
          id: "2",
          numero: "P2025-00002",
          titulo: "Solicitação de declaração de matrícula",
          mensagem: "Preciso de uma declaração de matrícula para apresentar na empresa onde trabalho.",
          setor: "secretaria",
          status: "em_andamento",
          dataCriacao: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          dataAtualizacao: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          alunoId: "1",
          responsavelId: "101",
          tempoEspera: "2 horas"
        },
        {
          id: "3",
          numero: "P2025-00003",
          titulo: "Dúvida sobre parcela em atraso",
          mensagem: "Gostaria de verificar a possibilidade de parcelamento de uma mensalidade em atraso.",
          setor: "financeiro",
          status: "respondido",
          dataCriacao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          dataAtualizacao: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          alunoId: "1",
          responsavelId: "202"
        },
        {
          id: "4",
          numero: "P2025-00004",
          titulo: "Problemas para acessar aula ao vivo",
          mensagem: "Estou tendo dificuldades para acessar a aula ao vivo marcada para hoje.",
          setor: "suporte",
          status: "encerrado",
          dataCriacao: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          dataAtualizacao: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
          alunoId: "1",
          responsavelId: "303"
        }
      ];
      
      setProtocolos(mockProtocolos);
    } catch (error) {
      console.error("Erro ao carregar protocolos:", error);
      toast({
        title: "Erro ao carregar protocolos",
        description: "Ocorreu um erro ao buscar seus protocolos. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCriarProtocolo = async (novoProtocolo: Partial<Protocolo>) => {
    try {
      // Aqui faríamos a chamada para o Supabase para criar um novo protocolo
      // Por enquanto apenas adicionaremos ao estado
      const protocolo: Protocolo = {
        id: `${protocolos.length + 1}`,
        numero: `P2025-0000${protocolos.length + 1}`,
        titulo: novoProtocolo.titulo || "",
        mensagem: novoProtocolo.mensagem || "",
        setor: novoProtocolo.setor || "suporte",
        status: "aberto",
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        alunoId: "1",
        tempoEspera: "Aguardando atendimento"
      };
      
      setProtocolos([protocolo, ...protocolos]);
      setIsDialogOpen(false);
      toast({
        title: "Protocolo criado com sucesso",
        description: `Seu protocolo ${protocolo.numero} foi criado e será atendido em breve.`,
      });
    } catch (error) {
      console.error("Erro ao criar protocolo:", error);
      toast({
        title: "Erro ao criar protocolo",
        description: "Ocorreu um erro ao criar seu protocolo. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const protocolosFiltrados = filtroStatus === 'todos' 
    ? protocolos 
    : protocolos.filter(p => p.status === filtroStatus);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunicação</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe seus atendimentos e entre em contato com nossos departamentos.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <AtendentesOnline />
        </div>

        <div className="col-span-1 md:col-span-3">
          <Tabs defaultValue="protocolos" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="protocolos">Meus Protocolos</TabsTrigger>
              <TabsTrigger value="chat">Atendimento Ativo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="protocolos" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Meus Protocolos</CardTitle>
                  <CardDescription>
                    Acompanhe o status de todas as suas solicitações.
                  </CardDescription>
                  <div className="flex mt-2 space-x-2">
                    <Button 
                      variant={filtroStatus === 'todos' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFiltroStatus('todos')}
                    >
                      Todos
                    </Button>
                    <Button 
                      variant={filtroStatus === 'aberto' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFiltroStatus('aberto')}
                    >
                      <Clock className="mr-1 h-4 w-4" /> Abertos
                    </Button>
                    <Button 
                      variant={filtroStatus === 'em_andamento' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFiltroStatus('em_andamento')}
                    >
                      <AlertCircle className="mr-1 h-4 w-4" /> Em Andamento
                    </Button>
                    <Button 
                      variant={filtroStatus === 'respondido' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFiltroStatus('respondido')}
                    >
                      <MessageSquare className="mr-1 h-4 w-4" /> Respondidos
                    </Button>
                    <Button 
                      variant={filtroStatus === 'encerrado' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFiltroStatus('encerrado')}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" /> Encerrados
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProtocolosList 
                    protocolos={protocolosFiltrados} 
                    isLoading={isLoading} 
                    onSelect={(protocolo) => setProtocoloSelecionado(protocolo)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chat" className="space-y-4 pt-4">
              <Card className="min-h-[600px]">
                <CardHeader className="pb-2">
                  <CardTitle>
                    {protocoloSelecionado 
                      ? `Atendimento - ${protocoloSelecionado.numero} - ${protocoloSelecionado.titulo}` 
                      : "Atendimento"}
                  </CardTitle>
                  <CardDescription>
                    {protocoloSelecionado 
                      ? `Setor: ${protocoloSelecionado.setor.charAt(0).toUpperCase() + protocoloSelecionado.setor.slice(1)} • Aberto em: ${new Date(protocoloSelecionado.dataCriacao).toLocaleDateString('pt-BR')}`
                      : "Selecione um protocolo para visualizar a conversa."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {protocoloSelecionado ? (
                    <ChatProtocolo protocolo={protocoloSelecionado} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium">Nenhum protocolo selecionado</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        Selecione um protocolo da lista para visualizar a conversa ou crie um novo atendimento.
                      </p>
                      <Button 
                        className="mt-4" 
                        variant="outline"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <NovoProtocoloDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleCriarProtocolo}
      />
    </div>
  );
};

export default Comunicacao;
