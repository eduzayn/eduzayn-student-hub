
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabConfiguracaoProps {
  handleConfigurarClick: (tipo: string) => void;
}

const TabConfiguracao: React.FC<TabConfiguracaoProps> = ({ handleConfigurarClick }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Módulo</CardTitle>
        <CardDescription>
          Personalize o módulo de matrículas de acordo com suas necessidades.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">Integração com LearnWorlds</p>
              <p className="text-sm text-muted-foreground">Configurações da integração com LearnWorlds</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => handleConfigurarClick("LearnWorlds")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
          
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">Temas de E-mail</p>
              <p className="text-sm text-muted-foreground">Configurações de temas para e-mails de matrícula</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => handleConfigurarClick("e-mail")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
          
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="font-medium">Configurações Gerais</p>
              <p className="text-sm text-muted-foreground">Ajustes gerais do módulo de matrículas</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => handleConfigurarClick("gerais")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TabConfiguracao;
