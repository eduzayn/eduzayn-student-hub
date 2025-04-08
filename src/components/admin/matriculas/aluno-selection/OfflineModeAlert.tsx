
import React from "react";
import { WifiOff } from "lucide-react";

const OfflineModeAlert: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-center gap-2">
      <WifiOff className="h-4 w-4 text-amber-500" />
      <div>
        <p className="text-amber-800 font-medium">Modo offline ativado</p>
        <p className="text-xs text-amber-600">
          Operando com dados locais. As alterações serão sincronizadas quando a conexão for restabelecida.
        </p>
      </div>
    </div>
  );
};

export default OfflineModeAlert;
