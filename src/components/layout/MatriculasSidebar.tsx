
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  FileText, 
  Users, 
  CreditCard, 
  ClipboardList,
  Settings,
  Plus,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const MatriculasSidebar: React.FC = () => {
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
        onClick={() => window.location.href = "/admin/matriculas/nova"}
      >
        <Plus className="h-4 w-4" /> Nova Matrícula
      </Button>
      
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-2">
          <NavItem href="/admin/matriculas" icon={BarChart2}>
            Dashboard
          </NavItem>
          <NavItem href="/admin/matriculas/lista" icon={ClipboardList}>
            Matrículas
          </NavItem>
          <NavItem href="/admin/matriculas/alunos" icon={Users}>
            Alunos
          </NavItem>
          <NavItem href="/admin/matriculas/cursos" icon={BookOpen}>
            Cursos
          </NavItem>
          <NavItem href="/admin/matriculas/contratos" icon={FileText}>
            Contratos
          </NavItem>
          <NavItem href="/admin/matriculas/pagamentos" icon={CreditCard}>
            Pagamentos
          </NavItem>
          
          <Separator className="my-4" />
          
          <NavItem href="/admin/matriculas/configuracoes" icon={Settings}>
            Configurações
          </NavItem>
        </nav>
      </ScrollArea>
      
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.location.href = "/admin"}
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
