
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  FileText, 
  Users, 
  CreditCard, 
  ClipboardList,
  Settings,
  Plus,
  BarChart2,
  Home,
  List,
  FilePlus,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const MatriculasSidebar: React.FC = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { label: "Dashboard", href: "/admin/matriculas", icon: Home },
    { label: "Lista de Matrículas", href: "/admin/matriculas/lista", icon: List },
    { label: "Nova Matrícula", href: "/admin/matriculas/nova", icon: FilePlus },
    { label: "Alunos", href: "/admin/matriculas/alunos", icon: Users },
    { label: "Cursos", href: "/admin/matriculas/cursos", icon: BookOpen },
    { label: "Pagamentos", href: "/admin/matriculas/pagamentos", icon: CreditCard },
    { label: "Contratos", href: "/admin/matriculas/contratos", icon: FileText },
    { label: "Sincronização", href: "/admin/matriculas/sincronizacao", icon: RefreshCw },
    { label: "Configurações", href: "/admin/matriculas/configuracoes", icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col h-screen w-64 bg-white border-r">
      <div className="p-4">
        <h2 className="font-bold text-lg flex items-center">
          <ClipboardList className="mr-2 h-5 w-5 text-primary" />
          <span>Módulo Matrículas</span>
        </h2>
      </div>
      
      <Separator />
      
      <Button
        className="mx-4 my-4 gap-2"
        onClick={() => navigate("/admin/matriculas/nova")}
      >
        <Plus className="h-4 w-4" /> Nova Matrícula
      </Button>
      
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-2">
          {menuItems.map((item) => (
            <NavItem key={item.href} href={item.href} icon={item.icon}>
              {item.label}
            </NavItem>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/admin")}
        >
          Voltar ao Portal Admin
        </Button>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.FC<{ className?: string }>;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, children }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
          isActive
            ? "bg-primary text-white" 
            : "text-gray-600 hover:bg-gray-100"
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </NavLink>
  );
};

export default MatriculasSidebar;
