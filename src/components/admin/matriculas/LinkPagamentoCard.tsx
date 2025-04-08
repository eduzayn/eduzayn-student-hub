
import React, { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface LinkPagamentoCardProps {
  link?: string;
  copiado?: boolean;
  enviado?: boolean;
  email?: string;
  onCopiar?: () => void;
  onVoltar?: () => void;
  onNova?: () => void;
  // Novas props para compatibilidade com MatriculaStep4
  pagamentoInfo?: any;
  alunoNome?: string;
  cursoNome?: string;
  valor?: number;
  formaPagamento?: string;
}

const LinkPagamentoCard: React.FC<LinkPagamentoCardProps> = ({
  link,
  copiado = false,
  enviado = false,
  email,
  onCopiar,
  onVoltar,
  onNova,
  pagamentoInfo,
  alunoNome,
  cursoNome,
  valor,
  formaPagamento
}) => {
  const [copiadoInterno, setCopiadoInterno] = useState(copiado);
  
  // Se tivermos pagamentoInfo, extraímos informações dele
  const linkPagamento = link || pagamentoInfo?.link_pagamento || pagamentoInfo?.link;
  const emailDestinatario = email || pagamentoInfo?.email;
  
  const handleCopiar = () => {
    if (onCopiar) {
      onCopiar();
    } else if (linkPagamento) {
      navigator.clipboard.writeText(linkPagamento);
      setCopiadoInterno(true);
      toast.success("Link copiado para a área de transferência");
      
      setTimeout(() => setCopiadoInterno(false), 3000);
    }
  };
  
  const descricaoPagamento = cursoNome && valor 
    ? `Matrícula para ${cursoNome} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)}`
    : "Matrícula";
  
  const metodoPagamento = formaPagamento 
    ? `via ${formaPagamento.toUpperCase()}` 
    : "";

  return (
    <div className="space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription>
          Matrícula criada com sucesso! {alunoNome ? `O aluno ${alunoNome} está matriculado.` : ""} {linkPagamento ? "O link de pagamento está disponível abaixo." : ""}
        </AlertDescription>
      </Alert>
      
      {linkPagamento && (
        <div className="p-4 border rounded-md bg-gray-50">
          <h3 className="font-medium mb-2">Link de Pagamento {metodoPagamento}</h3>
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="text" 
              value={linkPagamento} 
              readOnly 
              className="flex-1 p-2 rounded border text-sm bg-white"
            />
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={handleCopiar}
              className="gap-1"
            >
              {copiadoInterno ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiadoInterno ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
          
          {emailDestinatario && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="h-4 w-4" />
              {enviado 
                ? <span className="text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> E-mail enviado para {emailDestinatario}
                  </span> 
                : <span>Enviando e-mail para {emailDestinatario}...</span>
              }
            </div>
          )}
          
          {descricaoPagamento && (
            <div className="mt-2 text-sm text-gray-600">
              <p>{descricaoPagamento}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={onVoltar}
        >
          Voltar para Matrículas
        </Button>
        <Button 
          type="button"
          onClick={onNova}
        >
          Nova Matrícula
        </Button>
      </div>
    </div>
  );
};

export default LinkPagamentoCard;
