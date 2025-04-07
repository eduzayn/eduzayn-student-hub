
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader,
} from "@/components/ui/card";

// Componentes refatorados
import ModulosHeader from "./modulos/ModulosHeader";
import ModulosLista from "./modulos/ModulosLista";
import ModulosEmptyState from "./modulos/ModulosEmptyState";
import ModulosLoading from "./modulos/ModulosLoading";

// Hook para gerenciamento de dados
import { useModulos } from "./modulos/hooks/useModulos";

interface CursosModulosProps {
  cursoId: string;
}

const CursosModulos: React.FC<CursosModulosProps> = ({ cursoId }) => {
  const { loading, modulos, carregarModulos, formatarDuracao, totalAulas } = useModulos(cursoId);

  if (loading) {
    return <ModulosLoading />;
  }

  if (modulos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <ModulosHeader 
            modulosCount={0} 
            aulasCount={0} 
            onRefresh={carregarModulos} 
          />
        </CardHeader>
        <ModulosEmptyState onRefresh={carregarModulos} />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <ModulosHeader 
          modulosCount={modulos.length}
          aulasCount={totalAulas}
          onRefresh={carregarModulos}
        />
      </CardHeader>
      <CardContent>
        <ModulosLista 
          modulos={modulos} 
          formatarDuracao={formatarDuracao} 
        />
      </CardContent>
    </Card>
  );
};

export default CursosModulos;
