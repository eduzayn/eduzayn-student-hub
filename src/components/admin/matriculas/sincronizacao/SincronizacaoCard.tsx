
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SincronizacaoCardProps {
  title: string;
  description: string;
  buttonText?: string;
  syncLabel?: string; // Adicionando propriedade opcional
  countLabel?: string; // Adicionando propriedade opcional
  count?: number;
  lastSync?: string;
  onSync: () => void;
  isSyncing: boolean;
  icon: React.ReactNode;
}

const SincronizacaoCard: React.FC<SincronizacaoCardProps> = ({
  title,
  description,
  buttonText,
  syncLabel,
  countLabel,
  count,
  lastSync,
  onSync,
  isSyncing,
  icon,
}) => {
  // Usar buttonText ou syncLabel, garantindo que pelo menos um esteja disponível
  const displayButtonText = buttonText || syncLabel || "Sincronizar";
  const displayCountLabel = countLabel || "registros";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </CardTitle>
          {count !== undefined && (
            <Badge variant="secondary" className="ml-2">
              {count} {displayCountLabel}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Button onClick={onSync} disabled={isSyncing}>
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                {displayButtonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          {lastSync && (
            <p className="text-xs text-muted-foreground">
              Última sincronização: {lastSync}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SincronizacaoCard;
