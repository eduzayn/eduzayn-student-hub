
import React from "react";
import { CreditCard } from "lucide-react";

const PagamentoHeader: React.FC = () => {
  return (
    <div className="md:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Detalhes do Pagamento</h3>
      </div>
    </div>
  );
};

export default PagamentoHeader;
