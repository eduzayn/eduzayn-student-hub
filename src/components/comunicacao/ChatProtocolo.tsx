
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, Send } from "lucide-react";
import { Protocolo, Mensagem } from "@/types/comunicacao";
import { useToast } from "@/hooks/use-toast";

interface ChatProtocoloProps {
  protocolo: Protocolo;
}

export const ChatProtocolo: React.FC<ChatProtocoloProps> = ({ protocolo }) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const mensagensContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const carregarMensagens = async () => {
      setIsLoading(true);
      try {
        // Simulação de chamada à API
        setTimeout(() => {
          // Dados mockados
          const mensagensMock: Mensagem[] = [
            {
              id: "1",
              protocoloId: protocolo.id,
              conteudo: protocolo.mensagem,
              dataCriacao: protocolo.dataCriacao,
              autorId: protocolo.alunoId,
              autorNome: "Você",
              autorTipo: "aluno",
              lida: true
            }
          ];
          
          // Se o protocolo tiver status diferente de "aberto", adiciona resposta do atendente
          if (protocolo.status !== "aberto") {
            const respostaAtendente: Mensagem = {
              id: "2",
              protocoloId: protocolo.id,
              conteudo: protocolo.status === "encerrado" 
                ? "Olá! Verificamos seu pedido e o problema já foi resolvido. Estamos encerrando este protocolo. Se precisar de mais alguma coisa, não hesite em abrir um novo atendimento."
                : "Olá! Estamos analisando sua solicitação e retornaremos o mais breve possível. Para mais informações, pode responder diretamente neste chat.",
              dataCriacao: new Date(new Date(protocolo.dataCriacao).getTime() + 3600000).toISOString(),
              autorId: protocolo.responsavelId || "atendente1",
              autorNome: "Atendente",
              autorTipo: "atendente",
              lida: true
            };
            mensagensMock.push(respostaAtendente);
          }
          
          setMensagens(mensagensMock);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
        toast({
          title: "Erro ao carregar mensagens",
          description: "Ocorreu um erro ao carregar as mensagens. Tente novamente mais tarde.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    if (protocolo && protocolo.id) {
      carregarMensagens();
    }
  }, [protocolo, toast]);

  useEffect(() => {
    if (mensagensContainerRef.current) {
      mensagensContainerRef.current.scrollTop = mensagensContainerRef.current.scrollHeight;
    }
  }, [mensagens]);

  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim()) return;
    
    setIsSending(true);
    
    try {
      // Criar nova mensagem
      const novaMensagemObj: Mensagem = {
        id: `temp-${Date.now()}`,
        protocoloId: protocolo.id,
        conteudo: novaMensagem,
        dataCriacao: new Date().toISOString(),
        autorId: "aluno-id",
        autorNome: "Você",
        autorTipo: "aluno",
        lida: false
      };
      
      // Adicionar à lista local
      setMensagens(prev => [...prev, novaMensagemObj]);
      setNovaMensagem("");
      
      // Simulação de envio para API
      setTimeout(() => {
        // Simulação de resposta do atendente (só para protocolos em andamento)
        if (protocolo.status === "em_andamento" || protocolo.status === "respondido") {
          setTimeout(() => {
            const respostaAtendente: Mensagem = {
              id: `resp-${Date.now()}`,
              protocoloId: protocolo.id,
              conteudo: "Obrigado pelo retorno. Estamos verificando as informações e retornaremos em breve.",
              dataCriacao: new Date().toISOString(),
              autorId: protocolo.responsavelId || "atendente1",
              autorNome: "Atendente",
              autorTipo: "atendente",
              lida: true
            };
            
            setMensagens(prev => [...prev, respostaAtendente]);
          }, 3000);
        }
        
        setIsSending(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive"
      });
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const formatDatetime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('pt-BR', {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Renderização de estados de loading
  if (isLoading) {
    return (
      <div className="flex flex-col h-[500px]">
        <div className="flex-1 space-y-4 p-4 overflow-y-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i} 
              className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end gap-2">
                {i % 2 !== 0 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                )}
                <div className={`max-w-md rounded-lg p-4 ${i % 2 === 0 ? 'bg-primary/10' : 'bg-muted'}`}>
                  <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 w-48 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded mt-2"></div>
                </div>
                {i % 2 === 0 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-200 rounded"></div>
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const podeResponder = protocolo.status !== "encerrado";

  return (
    <div className="flex flex-col h-[500px]">
      <div 
        ref={mensagensContainerRef}
        className="flex-1 space-y-4 p-4 overflow-y-auto"
      >
        {mensagens.map((mensagem) => (
          <div 
            key={mensagem.id}
            className={`flex ${mensagem.autorTipo === "aluno" ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-end gap-2">
              {mensagem.autorTipo !== "aluno" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{mensagem.autorNome[0]}</AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`max-w-md rounded-lg p-3 ${
                  mensagem.autorTipo === "aluno" 
                    ? 'bg-primary/10 text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <div className="font-medium text-xs mb-1">
                  {mensagem.autorTipo === "aluno" ? "Você" : mensagem.autorNome}
                </div>
                <div className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</div>
                <div className="text-xs opacity-70 mt-1">
                  {formatDatetime(mensagem.dataCriacao)}
                </div>
              </div>
              {mensagem.autorTipo === "aluno" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4">
        {podeResponder ? (
          <div className="flex gap-2">
            <Textarea 
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 min-h-[40px] resize-none"
              disabled={isSending}
            />
            <Button 
              onClick={handleEnviarMensagem}
              disabled={!novaMensagem.trim() || isSending}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="bg-muted p-3 rounded-md text-sm text-center">
            Este protocolo está encerrado e não aceita mais respostas.
            <br />
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => toast({
                title: "Novo atendimento",
                description: "Para abrir um novo atendimento, use o botão 'Novo Atendimento' no topo da página."
              })}
            >
              Criar novo atendimento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
