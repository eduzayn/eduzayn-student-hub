
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, Download, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Contrato } from "@/types/matricula";

interface ContratoViewProps {
  contrato: Contrato;
  onAssinar?: (contratoId: string) => Promise<boolean>;
}

const ContratoView: React.FC<ContratoViewProps> = ({ contrato, onAssinar }) => {
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [assinando, setAssinando] = useState(false);
  
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleAssinar = async () => {
    if (!aceitouTermos) {
      toast.warning("É necessário aceitar os termos para assinar o contrato");
      return;
    }
    
    if (!onAssinar) {
      toast.error("Função de assinatura não disponível");
      return;
    }
    
    setAssinando(true);
    try {
      const sucesso = await onAssinar(contrato.id);
      if (sucesso) {
        toast.success("Contrato assinado com sucesso!");
      } else {
        toast.error("Não foi possível assinar o contrato");
      }
    } catch (error) {
      toast.error("Erro ao assinar o contrato");
    } finally {
      setAssinando(false);
    }
  };
  
  const handleDownload = () => {
    toast.success("Iniciando download do contrato");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle>{contrato.titulo}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Código: {contrato.codigo} | Versão: {contrato.versao}
            </div>
          </div>
          
          <div className="flex items-center">
            {contrato.assinado ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Assinado em {formatarData(contrato.data_aceite || '')}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="h-3 w-3 mr-1" />
                Pendente de assinatura
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md border mb-6">
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: contrato.conteudo.replace(/\n/g, '<br />') 
            }} />
          </div>
        </div>
        
        {!contrato.assinado && (
          <div className="border-t pt-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="termos" 
                checked={aceitouTermos} 
                onCheckedChange={(checked) => setAceitouTermos(!!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="termos"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Declaro que li e concordo com os termos do contrato acima
                </Label>
                <p className="text-xs text-muted-foreground">
                  Ao assinar este documento, você concorda com todos os termos e condições estabelecidos.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        
        {!contrato.assinado && (
          <Button disabled={!aceitouTermos || assinando} onClick={handleAssinar}>
            {assinando ? (
              <>Assinando...</>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Assinar Contrato
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContratoView;
