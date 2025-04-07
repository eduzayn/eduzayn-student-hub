
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Users, BookOpen } from "lucide-react";

interface DirectSyncOptionsProps {
  isSyncingAlunos: boolean;
  isSyncingCursos: boolean;
  isConnected: boolean;
  onSyncAlunos: () => void;
  onSyncCursos: () => void;
}

const DirectSyncOptions: React.FC<DirectSyncOptionsProps> = ({
  isSyncingAlunos,
  isSyncingCursos,
  isConnected,
  onSyncAlunos,
  onSyncCursos
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Sincronização Direta</h3>
      <div className="flex flex-col gap-4">
        <Button 
          variant="outline" 
          className="w-full" 
          disabled={isSyncingAlunos || !isConnected}
          onClick={onSyncAlunos}
        >
          {isSyncingAlunos ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando alunos...
            </>
          ) : (
            <>
              <Users className="mr-2 h-4 w-4" />
              Importar Alunos Diretamente
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          disabled={isSyncingCursos || !isConnected}
          onClick={onSyncCursos}
        >
          {isSyncingCursos ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando cursos...
            </>
          ) : (
            <>
              <BookOpen className="mr-2 h-4 w-4" />
              Importar Cursos Diretamente
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DirectSyncOptions;
