
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConstructionIcon } from "lucide-react";

interface EmConstrucaoProps {
  title?: string;
}

const EmConstrucao: React.FC<EmConstrucaoProps> = ({ title = "Página" }) => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ConstructionIcon className="h-6 w-6 text-yellow-500" />
            {title} - Em Construção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta funcionalidade está sendo implementada e estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmConstrucao;
