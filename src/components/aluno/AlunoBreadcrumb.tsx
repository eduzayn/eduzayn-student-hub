
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const AlunoBreadcrumb: React.FC = () => {
  const location = useLocation();
  
  // Mapeamento de rotas para nomes mais amigáveis
  const routeNameMap: Record<string, string> = {
    dashboard: "Dashboard",
    cursos: "Meus Cursos",
    aprendizagem: "Rota de Aprendizagem",
    carteira: "Carteira de Estudante",
    calendario: "Calendário",
    materiais: "Materiais",
    financeiro: "Financeiro",
    documentos: "Documentos",
    certificados: "Certificados",
    comunicacao: "Comunicação",
    estatisticas: "Estatísticas",
    suporte: "Suporte",
    chatana: "Chat com Ana",
    perfil: "Meu Perfil",
    configuracoes: "Configurações",
    notificacoes: "Notificações",
  };
  
  // Divide o caminho em segmentos
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  // Não exibir breadcrumb na página inicial do dashboard
  if (pathSegments.length <= 1 || (pathSegments.length === 1 && pathSegments[0] === "dashboard")) {
    return null;
  }
  
  // Gera os itens do breadcrumb
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const currentPath = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;
    const displayName = routeNameMap[segment] || segment;
    
    return (
      <React.Fragment key={currentPath}>
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{displayName}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to={currentPath}>{displayName}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </React.Fragment>
    );
  });
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AlunoBreadcrumb;
