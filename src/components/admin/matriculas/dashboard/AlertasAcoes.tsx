
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CreditCard, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AlertasAcoes: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas e Ações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <Clock className="text-amber-500 mr-3" />
              <span className="font-medium">
                5 matrículas aguardando aprovação de documentos
              </span>
            </div>
            <Button size="sm" onClick={() => navigate("/admin/matriculas/documentos")}>
              Verificar
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="text-red-500 mr-3" />
              <span className="font-medium">
                8 pagamentos atrasados precisam de atenção
              </span>
            </div>
            <Button size="sm" onClick={() => navigate("/admin/matriculas/pagamentos")}>
              Verificar
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <FileText className="text-blue-500 mr-3" />
              <span className="font-medium">
                3 contratos pendentes de assinatura
              </span>
            </div>
            <Button size="sm" onClick={() => navigate("/admin/matriculas/contratos")}>
              Verificar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertasAcoes;
