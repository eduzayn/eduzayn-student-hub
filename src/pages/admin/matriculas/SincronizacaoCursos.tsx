
import React from "react";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Home } from "lucide-react";
import SincronizacaoCursos from "@/components/admin/matriculas/SincronizacaoCursos";

const SincronizacaoCursosPage: React.FC = () => {
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/matriculas">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/matriculas/sincronizacao">
              Sincronização
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Sincronização de Cursos</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Sincronização de Cursos LearnWorlds
            </CardTitle>
          </CardHeader>
        </Card>
        
        <SincronizacaoCursos />
      </div>
    </MatriculasLayout>
  );
};

export default SincronizacaoCursosPage;
