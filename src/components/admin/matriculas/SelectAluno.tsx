
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, CheckCircle, User, Plus, X, AlertCircle, WifiOff } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

interface SelectAlunoProps {
  onAlunoSelecionado: (aluno: any) => void;
}

interface NovoAlunoForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
}

const SelectAluno: React.FC<SelectAlunoProps> = ({ onAlunoSelecionado }) => {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [formNovoAluno, setFormNovoAluno] = useState<NovoAlunoForm>({
    nome: "",
    sobrenome: "",
    email: "",
    cpf: "",
    telefone: ""
  });
  
  const { getUsers, cadastrarAluno, loading, error, offlineMode } = useLearnWorldsApi();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    carregarAlunos();
  }, []);
  
  const carregarAlunos = async (termoBusca = "") => {
    try {
      // Busca alunos da API LearnWorlds
      const resultado = await getUsers(1, 20, termoBusca);
      
      if (!resultado || !resultado.data) {
        throw new Error("Erro ao carregar alunos do LearnWorlds");
      }
      
      // Mapeando os dados retornados para o formato necessário
      const alunosFormatados = resultado.data.map((aluno: any) => ({
        id: aluno.id,
        nome: `${aluno.firstName || ''} ${aluno.lastName || ''}`.trim(),
        email: aluno.email,
        cpf: aluno.customField1 || '', // Assumindo que o CPF está no campo customField1
        telefone: aluno.phoneNumber || '',
        learnworlds_id: aluno.id
      }));
      
      setAlunos(alunosFormatados);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar a lista de alunos");
      
      // Em caso de falha, carrega dados simulados como fallback
      carregarAlunosSimulados(termoBusca);
    }
  };
  
  // Função de fallback com dados simulados
  const carregarAlunosSimulados = (termoBusca = "") => {
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
  };
  
  const handleBusca = () => {
    carregarAlunos(busca);
  };
  
  const handleSelecionar = (aluno: any) => {
    setSelecionado(aluno.id);
    onAlunoSelecionado({
      ...aluno,
      // Garantir que temos o ID do LearnWorlds
      learnworlds_id: aluno.learnworlds_id || aluno.id
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormNovoAluno(prev => ({ ...prev, [name]: value }));
  };

  const handleCriarNovoAluno = async () => {
    try {
      // Validação básica
      if (!formNovoAluno.nome || !formNovoAluno.email) {
        toast.error("Nome e e-mail são obrigatórios");
        return;
      }

      // Cadastrar aluno no LearnWorlds
      const resultado = await cadastrarAluno({
        firstName: formNovoAluno.nome,
        lastName: formNovoAluno.sobrenome,
        email: formNovoAluno.email,
        cpf: formNovoAluno.cpf,
        phoneNumber: formNovoAluno.telefone
      });

      if (!resultado) {
        throw new Error("Falha ao cadastrar aluno no LearnWorlds");
      }

      // Criar o novo aluno no formato esperado
      const novoAluno = {
        id: resultado.id,
        nome: `${formNovoAluno.nome} ${formNovoAluno.sobrenome}`.trim(),
        email: formNovoAluno.email,
        cpf: formNovoAluno.cpf,
        telefone: formNovoAluno.telefone,
        learnworlds_id: resultado.id
      };

      // Adicionar o novo aluno à lista e selecioná-lo
      setAlunos(prev => [novoAluno, ...prev]);
      handleSelecionar(novoAluno);
      
      // Fechar o diálogo e limpar o formulário
      setDialogAberto(false);
      setFormNovoAluno({
        nome: "",
        sobrenome: "",
        email: "",
        cpf: "",
        telefone: ""
      });
      
      toast.success("Aluno cadastrado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar novo aluno:", error);
      toast.error(error.message || "Erro ao criar novo aluno");
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selecione o Aluno</h2>
      
      {/* Modo Offline Banner */}
      {offlineMode && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-amber-500" />
          <div>
            <p className="text-amber-800 font-medium">Modo offline ativado</p>
            <p className="text-xs text-amber-600">
              Operando com dados locais. As alterações serão sincronizadas quando a conexão for restabelecida.
            </p>
          </div>
        </div>
      )}
      
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
        <Button onClick={handleBusca} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </Button>
        <Button variant="outline" onClick={() => setDialogAberto(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>
      
      {error && !offlineMode && (
        <div className="bg-destructive/10 p-3 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span>Erro ao buscar alunos: {error}</span>
        </div>
      )}
      
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{aluno.nome}</p>
                            {aluno.learnworlds_id && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                LearnWorlds
                              </Badge>
                            )}
                            {aluno.id.startsWith('offline-') && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                Offline
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{aluno.email}</p>
                          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                            <span>CPF: {aluno.cpf || 'Não informado'}</span>
                            <span>Tel: {aluno.telefone || 'Não informado'}</span>
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

      {/* Diálogo para criar novo aluno */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
            <DialogDescription>
              {offlineMode 
                ? "Você está em modo offline. Os dados serão armazenados localmente até que a conexão seja restabelecida."
                : "Preencha os dados do aluno para cadastrá-lo na plataforma LearnWorlds e no sistema."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="nome" className="text-right">
                  Nome
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formNovoAluno.nome}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="sobrenome" className="text-right">
                  Sobrenome
                </Label>
                <Input
                  id="sobrenome"
                  name="sobrenome"
                  value={formNovoAluno.sobrenome}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-right">
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formNovoAluno.email}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="cpf" className="text-right">
                CPF
              </Label>
              <Input
                id="cpf"
                name="cpf"
                value={formNovoAluno.cpf}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="telefone" className="text-right">
                Telefone
              </Label>
              <Input
                id="telefone"
                name="telefone"
                value={formNovoAluno.telefone}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              onClick={handleCriarNovoAluno}
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Aluno"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectAluno;
