
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TabVisaoGeral: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Módulo de Matrículas - Nova Versão</CardTitle>
        <CardDescription>
          O sistema de matrículas está sendo redesenhado para uma melhor experiência.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Estamos trabalhando em uma nova versão mais robusta e confiável 
          para o gerenciamento de matrículas. Em breve, novas funcionalidades 
          estarão disponíveis.
        </p>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-blue-800 font-medium">Nota de desenvolvimento</p>
          <p className="text-blue-600 text-sm">
            Aguarde as próximas atualizações para ter acesso a todas as funcionalidades.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TabVisaoGeral;
