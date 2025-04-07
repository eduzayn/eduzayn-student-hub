
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SincronizacaoCardProps {
  title: string;
  description: string;
  buttonText: string;
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
  count,
  lastSync,
  onSync,
  isSyncing,
  icon,
}) => {
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
              {count} registros
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
                {buttonText}
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
