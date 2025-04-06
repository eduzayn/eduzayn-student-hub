
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface RouteMapping {
  [key: string]: {
    label: string;
    parent?: string;
  };
}

const routeMap: RouteMapping = {
  "": { label: "Home" },
  "cursos": { label: "Cursos", parent: "" },
  "curso": { label: "Detalhes do Curso", parent: "cursos" },
  "matricula": { label: "Matrícula", parent: "curso" },
  "checkout": { label: "Checkout", parent: "matricula" },
  "confirmacao-sucesso": { label: "Confirmação", parent: "" },
  "quem-somos": { label: "Quem Somos", parent: "" },
  "contato": { label: "Contato", parent: "" },
  "login": { label: "Login", parent: "" },
  "dashboard": { label: "Dashboard", parent: "" }
};

const BreadcrumbNav = () => {
  const location = useLocation();
  
  // Não exibir breadcrumbs na página inicial
  if (location.pathname === "/") {
    return null;
  }
  
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Função para gerar as partes do caminho para construir links
  const getPathParts = (index: number) => {
    return '/' + pathSegments.slice(0, index + 1).join('/');
  };
  
  return (
    <div className="eduzayn-container pt-4 pb-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const path = getPathParts(index);
            
            // Tenta encontrar um rótulo personalizado para o segmento
            let label = segment;
            if (routeMap[segment]) {
              label = routeMap[segment].label;
            } else if (index > 0) {
              // Tentar encontrar se é um parâmetro dinâmico (por exemplo, :id)
              // Aqui simplificamos, mas você poderia ter uma lógica mais avançada
              const parentSegment = pathSegments[index - 1];
              if (parentSegment === "curso") {
                label = "Curso";
              } else if (parentSegment === "checkout") {
                label = "Pagamento";
              } else if (parentSegment === "cursos") {
                label = "Categoria";
              }
            }

            return isLast ? (
              <BreadcrumbItem key={path}>
                <BreadcrumbPage>{label}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={path}>{label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNav;
