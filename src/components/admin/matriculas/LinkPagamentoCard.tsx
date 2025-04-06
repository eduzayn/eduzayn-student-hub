
import React from "react";
import { Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface LinkPagamentoCardProps {
  link: string;
  copiado: boolean;
  enviado: boolean;
  email?: string;
  onCopiar: () => void;
  onVoltar: () => void;
  onNova: () => void;
}

const LinkPagamentoCard: React.FC<LinkPagamentoCardProps> = ({
  link,
  copiado,
  enviado,
  email,
  onCopiar,
  onVoltar,
  onNova
}) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription>
          Matrícula criada com sucesso! O link de pagamento está disponível abaixo.
        </AlertDescription>
      </Alert>
      
      <div className="p-4 border rounded-md bg-gray-50">
        <h3 className="font-medium mb-2">Link de Pagamento</h3>
        <div className="flex items-center gap-2 mb-4">
          <input 
            type="text" 
            value={link} 
            readOnly 
            className="flex-1 p-2 rounded border text-sm bg-white"
          />
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={onCopiar}
            className="gap-1"
          >
            {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiado ? 'Copiado' : 'Copiar'}
          </Button>
        </div>
        
        {email && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            {enviado 
              ? <span className="text-green-600 flex items-center gap-1">
                  <Check className="h-3 w-3" /> E-mail enviado para {email}
                </span> 
              : <span>Enviando e-mail para {email}...</span>
            }
          </div>
        )}
      </div>
      
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
