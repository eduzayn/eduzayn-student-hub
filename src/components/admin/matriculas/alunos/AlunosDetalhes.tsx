
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Edit2, Save, Loader2, UserCircle2, BookOpen, FileText, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AlunosDetalhesProps {
  aluno: any;
  onBack: () => void;
  onReload: () => void;
}

const AlunosDetalhes: React.FC<AlunosDetalhesProps> = ({ aluno, onBack, onReload }) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [matriculas, setMatriculas] = useState<any[]>([]);
  const [isLoadingMatriculas, setIsLoadingMatriculas] = useState(true);
  
  const [alunoData, setAlunoData] = useState({
    first_name: aluno.first_name || '',
    last_name: aluno.last_name || '',
    email: aluno.email || '',
    phone: aluno.phone || '',
    numero_matricula: aluno.numero_matricula || '',
    status: aluno.status || 'ativo',
  });
  
  // Carregar as matrículas do aluno
  const carregarMatriculas = async () => {
    try {
      setIsLoadingMatriculas(true);
      
      const { data, error } = await supabase
        .from('matriculas')
        .select(`
          *,
          cursos:curso_id (
            id,
            titulo,
            codigo,
            modalidade
          )
        `)
        .eq('aluno_id', aluno.id)
        .order('data_criacao', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setMatriculas(data || []);
    } catch (error) {
      console.error("Erro ao carregar matrículas:", error);
      toast.error("Falha ao carregar matrículas do aluno");
    } finally {
      setIsLoadingMatriculas(false);
    }
  };
  
  useEffect(() => {
    carregarMatriculas();
  }, [aluno.id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAlunoData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (value: string) => {
    setAlunoData(prev => ({ ...prev, status: value }));
  };
  
  const salvarAluno = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: alunoData.first_name,
          last_name: alunoData.last_name,
          email: alunoData.email,
          phone: alunoData.phone,
          numero_matricula: alunoData.numero_matricula,
          status: alunoData.status,
        })
        .eq('id', aluno.id);
        
      if (error) {
        throw error;
      }
      
      toast.success("Dados do aluno atualizados com sucesso");
      setEditMode(false);
      onReload(); // Recarregar a lista de alunos para refletir as mudanças
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      toast.error("Falha ao atualizar dados do aluno");
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatarData = (dataString: string | null) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Função de utilidade para determinar a variante do badge com base no status
  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'ativo':
        return 'default';
      case 'trancado':
        return 'secondary';
      case 'concluido':
        return 'outline'; // Alterado de 'success' para 'outline'
      case 'cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para lista
        </Button>
        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>
            <Edit2 className="mr-2 h-4 w-4" /> Editar Dados
          </Button>
        ) : (
          <Button onClick={salvarAluno} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <UserCircle2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>{aluno.first_name} {aluno.last_name}</CardTitle>
              <CardDescription>{aluno.email}</CardDescription>
              <Badge variant="outline" className="mt-1">
                {aluno.numero_matricula ? `Matrícula: ${aluno.numero_matricula}` : 'Sem matrícula'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6">
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nome</Label>
                  {editMode ? (
                    <Input
                      id="first_name"
                      name="first_name"
                      value={alunoData.first_name}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  ) : (
                    <div className="border rounded-md px-3 py-2">{alunoData.first_name}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name">Sobrenome</Label>
                  {editMode ? (
                    <Input
                      id="last_name"
                      name="last_name"
                      value={alunoData.last_name}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  ) : (
                    <div className="border rounded-md px-3 py-2">{alunoData.last_name}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {editMode ? (
                    <Input
                      id="email"
                      name="email"
                      value={alunoData.email}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  ) : (
                    <div className="border rounded-md px-3 py-2">{alunoData.email}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  {editMode ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={alunoData.phone}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  ) : (
                    <div className="border rounded-md px-3 py-2">{alunoData.phone || '-'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numero_matricula">Número de Matrícula</Label>
                  {editMode ? (
                    <Input
                      id="numero_matricula"
                      name="numero_matricula"
                      value={alunoData.numero_matricula}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  ) : (
                    <div className="border rounded-md px-3 py-2">{alunoData.numero_matricula || '-'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {editMode ? (
                    <Select
                      value={alunoData.status}
                      onValueChange={handleStatusChange}
                      disabled={isSaving}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="trancado">Trancado</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="border rounded-md px-3 py-2">
                      <Badge 
                        variant={getStatusVariant(alunoData.status)}
                      >
                        {alunoData.status || 'Não definido'}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>ID do LearnWorlds</Label>
                  <div className="border rounded-md px-3 py-2">
                    {aluno.learnworlds_id || 'Não vinculado'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Data de Cadastro</Label>
                  <div className="border rounded-md px-3 py-2">
                    {formatarData(aluno.created_at)}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="matriculas">
              {isLoadingMatriculas ? (
                <div className="text-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">Carregando matrículas...</p>
                </div>
              ) : matriculas.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                  <p className="text-muted-foreground">Aluno não possui matrículas</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => window.location.href=`/admin/matriculas/nova?aluno=${aluno.id}`}
                  >
                    Criar nova matrícula
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {matriculas.map((matricula) => (
                    <Card key={matricula.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-medium">{matricula.cursos?.titulo}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{matricula.cursos?.modalidade}</Badge>
                              <Badge 
                                variant={getStatusVariant(matricula.status)}
                              >
                                {matricula.status}
                              </Badge>
                              {matricula.progresso > 0 && (
                                <Badge variant="default" className="bg-blue-500">
                                  {matricula.progresso}% concluído
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Matriculado em: {formatarData(matricula.data_inicio)}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => window.location.href = `/admin/matriculas/lista?id=${matricula.id}`}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Detalhes
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => window.location.href = `/admin/matriculas/pagamentos?matricula=${matricula.id}`}
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pagamentos
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground">
            ID: {aluno.id}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AlunosDetalhes;
