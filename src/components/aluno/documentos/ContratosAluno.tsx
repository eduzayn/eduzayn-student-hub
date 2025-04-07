
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useContratos } from "@/hooks/useContratos";
import ContratoView from "./ContratoView";
import { useAuth } from "@/hooks/use-auth";
import { Contrato, Aditivo } from "@/types/matricula";

const ContratosAluno: React.FC = () => {
  const { userEmail } = useAuth();
  const { buscarContratosAluno, assinarContrato, carregando } = useContratos();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [contratoAtual, setContratoAtual] = useState<Contrato | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  
  useEffect(() => {
    carregarContratos();
  }, []);
  
  const carregarContratos = async () => {
    try {
      // Normalmente buscaríamos com o ID real do aluno autenticado
      // Para demonstração, vamos usar um ID fictício
      const dadosContratos = await buscarContratosAluno("a1");
      setContratos(dadosContratos);
    } catch (error) {
      toast.error("Erro ao carregar contratos");
    }
  };
  
  const handleVisualizarContrato = (contrato: Contrato) => {
    setContratoAtual(contrato);
    setDialogAberto(true);
  };
  
  const handleAssinarContrato = async (contratoId: string): Promise<boolean> => {
    try {
      await assinarContrato(contratoId);
      await carregarContratos();
      return true;
    } catch (error) {
      console.error("Erro na assinatura:", error);
      return false;
    }
  };
  
  const handleDownloadContrato = (contratoId: string) => {
    toast.success(`Iniciando download do contrato ${contratoId}`);
  };
  
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Meus Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contratos">
            <TabsList>
              <TabsTrigger value="contratos">Contratos</TabsTrigger>
              <TabsTrigger value="aditivos">Aditivos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contratos" className="mt-4">
              {carregando ? (
                <div className="text-center py-8 text-muted-foreground">Carregando contratos...</div>
              ) : contratos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Você não possui contratos
                </div>
              ) : (
                <div className="space-y-4">
                  {contratos.map((contrato) => (
                    <Card key={contrato.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h3 className="font-medium">{contrato.titulo}</h3>
                            <div className="text-sm text-muted-foreground">
                              {contrato.matricula.curso} - Código: {contrato.codigo}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Data: {formatarData(contrato.data_geracao)}
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <Badge variant={contrato.assinado ? "outline" : "secondary"}>
                              {contrato.assinado ? "Assinado" : "Pendente"}
                            </Badge>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleVisualizarContrato(contrato)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                              </Button>
                              
                              <Button size="sm" variant="outline" onClick={() => handleDownloadContrato(contrato.id)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="aditivos">
              <div className="text-center py-8 text-muted-foreground">
                Você não possui aditivos contratuais
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Contrato</DialogTitle>
          </DialogHeader>
          {contratoAtual && (
            <ContratoView 
              contrato={contratoAtual} 
              onAssinar={handleAssinarContrato}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContratosAluno;
