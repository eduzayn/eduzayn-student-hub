
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { useContratos } from "@/hooks/useContratos";

interface ContratoEditorProps {
  contratoId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const ContratoEditor: React.FC<ContratoEditorProps> = ({ contratoId, onSave, onCancel }) => {
  const { salvarModelo, carregarModelo, carregando } = useContratos();
  const [aba, setAba] = useState<string>("editor");
  const [titulo, setTitulo] = useState<string>("");
  const [versao, setVersao] = useState<string>("1.0");
  const [categoria, setCategoria] = useState<string>("");
  const [conteudo, setConteudo] = useState<string>("");
  
  React.useEffect(() => {
    if (contratoId) {
      const carregarContrato = async () => {
        try {
          const modelo = await carregarModelo(contratoId);
          if (modelo) {
            setTitulo(modelo.titulo);
            setVersao(modelo.versao);
            setCategoria(modelo.categoria || "");
            setConteudo(modelo.conteudo);
          }
        } catch (error) {
          toast.error("Erro ao carregar modelo de contrato");
        }
      };
      
      carregarContrato();
    }
  }, [contratoId]);
  
  const handleSalvar = async () => {
    if (!titulo.trim()) {
      toast.warning("Digite um título para o modelo");
      return;
    }
    
    if (!conteudo.trim()) {
      toast.warning("O conteúdo do contrato não pode estar vazio");
      return;
    }
    
    try {
      await salvarModelo({
        id: contratoId,
        titulo,
        versao,
        categoria,
        conteudo
      });
      
      toast.success("Modelo de contrato salvo com sucesso");
      if (onSave) onSave();
    } catch (error) {
      toast.error("Erro ao salvar modelo de contrato");
    }
  };
  
  const handlePrevisualizar = () => {
    setAba("preview");
  };
  
  const formatarConteudoPreview = () => {
    // Aqui podemos processar as variáveis do modelo, se necessário
    let previewContent = conteudo;
    
    // Substituir variáveis por valores de exemplo
    previewContent = previewContent.replace(/\{\{nome_aluno\}\}/g, "Nome do Aluno");
    previewContent = previewContent.replace(/\{\{nome_curso\}\}/g, "Nome do Curso");
    previewContent = previewContent.replace(/\{\{data_matricula\}\}/g, "01/01/2025");
    
    return previewContent;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{contratoId ? "Editar Modelo de Contrato" : "Novo Modelo de Contrato"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Modelo</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Contrato de Prestação de Serviços Educacionais"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="versao">Versão</Label>
              <Input
                id="versao"
                value={versao}
                onChange={(e) => setVersao(e.target.value)}
                placeholder="Ex: 1.0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graduacao">Graduação</SelectItem>
                  <SelectItem value="pos-graduacao">Pós-Graduação</SelectItem>
                  <SelectItem value="curso-livre">Cursos Livres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Tabs value={aba} onValueChange={setAba} className="w-full">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Prévia</TabsTrigger>
            <TabsTrigger value="variaveis">Variáveis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo do Contrato</Label>
              <Textarea
                id="conteudo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                className="min-h-[400px] font-mono"
                placeholder="Digite o conteúdo do contrato aqui..."
              />
              <p className="text-sm text-muted-foreground mt-2">
                Use variáveis como {"{{nome_aluno}}"} ou {"{{nome_curso}}"} que serão substituídas pelos dados reais.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">{titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formatarConteudoPreview().replace(/\n/g, '<br />') }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="variaveis" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Variáveis Disponíveis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Dados do Aluno</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><code>{"{{nome_aluno}}"}</code> - Nome completo do aluno</li>
                      <li><code>{"{{email_aluno}}"}</code> - Email do aluno</li>
                      <li><code>{"{{cpf_aluno}}"}</code> - CPF do aluno</li>
                      <li><code>{"{{telefone_aluno}}"}</code> - Telefone do aluno</li>
                      <li><code>{"{{endereco_aluno}}"}</code> - Endereço do aluno</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Dados do Curso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><code>{"{{nome_curso}}"}</code> - Nome do curso</li>
                      <li><code>{"{{codigo_curso}}"}</code> - Código do curso</li>
                      <li><code>{"{{valor_curso}}"}</code> - Valor total do curso</li>
                      <li><code>{"{{valor_mensalidade}}"}</code> - Valor da mensalidade</li>
                      <li><code>{"{{carga_horaria}}"}</code> - Carga horária do curso</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Dados da Matrícula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><code>{"{{data_matricula}}"}</code> - Data da matrícula</li>
                      <li><code>{"{{codigo_matricula}}"}</code> - Código da matrícula</li>
                      <li><code>{"{{data_inicio}}"}</code> - Data de início do curso</li>
                      <li><code>{"{{data_termino}}"}</code> - Data de término do curso</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Outros Dados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><code>{"{{data_atual}}"}</code> - Data atual</li>
                      <li><code>{"{{hora_atual}}"}</code> - Hora atual</li>
                      <li><code>{"{{nome_instituicao}}"}</code> - Nome da instituição</li>
                      <li><code>{"{{cnpj_instituicao}}"}</code> - CNPJ da instituição</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrevisualizar}>
            <Eye className="mr-2 h-4 w-4" /> Prévia
          </Button>
          <Button onClick={handleSalvar} disabled={carregando}>
            <Save className="mr-2 h-4 w-4" /> Salvar Modelo
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContratoEditor;
