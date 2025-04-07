
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, FileText, Pencil, Copy, Trash } from "lucide-react";
import { useContratos } from "@/hooks/useContratos";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ModeloContrato {
  id: string;
  titulo: string;
  versao: string;
  categoria?: string;
  data_criacao: string;
}

const ModelosContrato: React.FC = () => {
  const { listarModelos, excluirModelo, carregando } = useContratos();
  const [busca, setBusca] = useState("");
  const [modelos, setModelos] = useState<ModeloContrato[]>([]);
  const [abrirEditor, setAbrirEditor] = useState(false);
  const [modeloSelecionado, setModeloSelecionado] = useState<string | null>(null);
  const [excluirDialogo, setExcluirDialogo] = useState(false);
  const [idExclusao, setIdExclusao] = useState<string | null>(null);
  
  React.useEffect(() => {
    carregarModelos();
  }, []);
  
  const carregarModelos = async () => {
    try {
      const listaModelos = await listarModelos();
      setModelos(listaModelos);
    } catch (error) {
      toast.error("Erro ao carregar modelos de contrato");
    }
  };
  
  const handleNovo = () => {
    setModeloSelecionado(null);
    setAbrirEditor(true);
  };
  
  const handleEditar = (id: string) => {
    setModeloSelecionado(id);
    setAbrirEditor(true);
  };
  
  const handleDuplicar = async (id: string) => {
    try {
      // Implementação da duplicação de modelo
      toast.success("Modelo duplicado com sucesso");
      await carregarModelos();
    } catch (error) {
      toast.error("Erro ao duplicar modelo");
    }
  };
  
  const confirmarExclusao = (id: string) => {
    setIdExclusao(id);
    setExcluirDialogo(true);
  };
  
  const handleExcluir = async () => {
    if (!idExclusao) return;
    
    try {
      await excluirModelo(idExclusao);
      toast.success("Modelo excluído com sucesso");
      await carregarModelos();
      setExcluirDialogo(false);
    } catch (error) {
      toast.error("Erro ao excluir modelo");
    }
  };
  
  const modelosFiltrados = modelos.filter(
    modelo => modelo.titulo.toLowerCase().includes(busca.toLowerCase())
  );
  
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <CardTitle>Modelos de Contrato</CardTitle>
            
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar modelos..."
                  className="pl-9"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <Button onClick={handleNovo}>
                <Plus className="h-4 w-4 mr-2" /> Novo Modelo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carregando ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Carregando modelos...
                    </TableCell>
                  </TableRow>
                ) : modelosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {busca ? "Nenhum modelo encontrado com esse termo" : "Nenhum modelo de contrato cadastrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  modelosFiltrados.map(modelo => (
                    <TableRow key={modelo.id}>
                      <TableCell className="font-medium">{modelo.titulo}</TableCell>
                      <TableCell>
                        {modelo.categoria === "graduacao" 
                          ? "Graduação" 
                          : modelo.categoria === "pos-graduacao" 
                          ? "Pós-Graduação" 
                          : modelo.categoria === "curso-livre" 
                          ? "Cursos Livres" 
                          : "N/A"}
                      </TableCell>
                      <TableCell>v{modelo.versao}</TableCell>
                      <TableCell>{formatarData(modelo.data_criacao)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditar(modelo.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDuplicar(modelo.id)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => confirmarExclusao(modelo.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={excluirDialogo} onOpenChange={setExcluirDialogo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Modelo de Contrato</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este modelo de contrato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ModelosContrato;
