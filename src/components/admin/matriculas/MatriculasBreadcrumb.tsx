
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const MatriculasBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Mapeamento de caminhos para nomes amigáveis
  const pathMap: Record<string, string> = {
    'admin': 'Admin',
    'matriculas': 'Matrículas',
    'nova': 'Nova Matrícula',
    'lista': 'Lista de Matrículas',
    'alunos': 'Alunos',
    'cursos': 'Cursos',
    'contratos': 'Contratos',
    'pagamentos': 'Pagamentos',
    'configuracoes': 'Configurações',
    'sincronizacao': 'Sincronização'
  };
  
  return (
    <nav className="flex items-center text-sm mb-6">
      <Link
        to="/admin"
        className="text-gray-500 hover:text-primary flex items-center"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        // Construir o link para este nível do breadcrumb
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = pathMap[value] || value;
        
        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            {isLast ? (
              <span className="font-medium">{displayName}</span>
            ) : (
              <Link
                to={to}
                className="text-gray-500 hover:text-primary"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default MatriculasBreadcrumb;
