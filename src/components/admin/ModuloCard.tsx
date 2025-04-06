
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ModuloCardProps {
  titulo: string;
  descricao: string;
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
}

const ModuloCard: React.FC<ModuloCardProps> = ({
  titulo,
  descricao,
  icon: Icon,
  iconColor = "text-primary",
  onClick,
}) => {
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center pt-6 pb-4 text-center h-full">
        <div className={`p-3 rounded-lg bg-muted mb-4 ${iconColor}`}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{titulo}</h3>
        <p className="text-sm text-muted-foreground mb-auto">{descricao}</p>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={onClick}
        >
          Acessar módulo
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModuloCard;
