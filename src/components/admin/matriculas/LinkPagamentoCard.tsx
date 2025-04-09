
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, SendHorizontal } from "lucide-react";

interface LinkPagamentoCardProps {
  pagamentoInfo: any;
  alunoNome: string;
  cursoNome: string;
  valor: number;
  formaPagamento: string;
}

const LinkPagamentoCard: React.FC<LinkPagamentoCardProps> = ({
  pagamentoInfo,
  alunoNome,
  cursoNome,
  valor,
  formaPagamento
}) => {
  const formaPagamentoFormatada = {
    "pix": "PIX",
    "boleto": "Boleto",
    "cartao": "Cartão de Crédito",
    "dinheiro": "Dinheiro",
    "isento": "Isento"
  }[formaPagamento] || formaPagamento;
  
  const temLink = Boolean(pagamentoInfo?.link);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-medium text-muted-foreground">Aluno:</span>
              <span>{alunoNome}</span>
              
              <span className="font-medium text-muted-foreground">Curso:</span>
              <span>{cursoNome}</span>
              
              <span className="font-medium text-muted-foreground">Valor:</span>
              <span>R$ {valor.toFixed(2)}</span>
              
              <span className="font-medium text-muted-foreground">Forma de pagamento:</span>
              <span>{formaPagamentoFormatada}</span>
            </div>
          </div>
          
          {temLink ? (
            <div className="space-y-4 border-t pt-4">
              <p className="text-sm">
                O link de pagamento foi gerado e está disponível para envio ao aluno.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {}}
                >
                  {pagamentoInfo?.copiado ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Link
                    </>
                  )}
                </Button>
                
                <Button
                  variant="default"
                  className="flex-1"
                  disabled={pagamentoInfo?.enviado}
                  onClick={() => {}}
                >
                  {pagamentoInfo?.enviado ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      E-mail Enviado
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="h-4 w-4 mr-2" />
                      Enviar por E-mail
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                O link de pagamento para esta matrícula não foi gerado ou não está disponível.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkPagamentoCard;
