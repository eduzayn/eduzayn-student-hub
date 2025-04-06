
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, CheckCircle, User, Plus } from "lucide-react";
import { toast } from "sonner";

interface SelectAlunoProps {
  onAlunoSelecionado: (aluno: any) => void;
}

const SelectAluno: React.FC<SelectAlunoProps> = ({ onAlunoSelecionado }) => {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  
  useEffect(() => {
    carregarAlunos();
  }, []);
  
  const carregarAlunos = async (termoBusca = "") => {
    setLoading(true);
    
    try {
      // Simular carregamento de alunos do banco de dados
      // No futuro, substituir por chamada real ao Supabase
      setTimeout(() => {
        const dadosSimulados = [
          {
            id: "a1",
            nome: "Ana Silva",
            email: "ana@exemplo.com",
            cpf: "12345678901",
            telefone: "(11) 91234-5678"
          },
          {
            id: "a2",
            nome: "Carlos Santos",
            email: "carlos@exemplo.com",
            cpf: "10987654321",
            telefone: "(11) 98765-4321"
          },
          {
            id: "a3",
            nome: "Patricia Oliveira",
            email: "patricia@exemplo.com",
            cpf: "45678912301",
            telefone: "(11) 97654-3210"
          }
        ];
        
        // Filtragem pela busca (se houver)
        const filtrados = termoBusca ? 
          dadosSimulados.filter(a => 
            a.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
            a.email.toLowerCase().includes(termoBusca.toLowerCase()) ||
            a.cpf.includes(termoBusca)
          ) : dadosSimulados;
        
        setAlunos(filtrados);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar a lista de alunos");
      setLoading(false);
    }
  };
  
  const handleBusca = () => {
    carregarAlunos(busca);
  };
  
  const handleSelecionar = (aluno: any) => {
    setSelecionado(aluno.id);
    onAlunoSelecionado(aluno);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selecione o Aluno</h2>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBusca()}
          />
        </div>
        <Button onClick={handleBusca}>Buscar</Button>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>
      
      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-60" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {alunos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>Nenhum aluno encontrado</p>
              </div>
            ) : (
              alunos.map(aluno => (
                <Card 
                  key={aluno.id} 
                  className={`cursor-pointer transition-colors ${selecionado === aluno.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSelecionar(aluno)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {aluno.nome.split(' ').map((parte: string) => parte[0]).join('').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <p className="font-medium">{aluno.nome}</p>
                          <p className="text-sm text-muted-foreground">{aluno.email}</p>
                          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                            <span>CPF: {aluno.cpf}</span>
                            <span>Tel: {aluno.telefone}</span>
                          </div>
                        </div>
                      </div>
                      
                      {selecionado === aluno.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectAluno;
