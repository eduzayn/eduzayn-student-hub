
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import {
  Award,
  BarChart,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  IdCard,
  Library,
  MessageCircle,
  Route,
  User
} from "lucide-react";

const AlunoSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/dashboard", title: "Dashboard", icon: Home },
    { path: "/dashboard/cursos", title: "Meus Cursos", icon: BookOpen },
    { path: "/dashboard/aprendizagem", title: "Rota de Aprendizagem", icon: Route },
    { path: "/dashboard/carteira", title: "Carteira de Estudante", icon: IdCard },
    { path: "/dashboard/calendario", title: "Calendário", icon: Calendar },
    { path: "/dashboard/materiais", title: "Materiais", icon: Library },
    { path: "/dashboard/financeiro", title: "Financeiro", icon: CreditCard },
    { path: "/dashboard/documentos", title: "Documentos", icon: FileText },
    { path: "/dashboard/certificados", title: "Certificados", icon: Award },
    { path: "/dashboard/comunicacao", title: "Comunicação", icon: MessageCircle },
    { path: "/dashboard/estatisticas", title: "Estatísticas", icon: BarChart },
  ];

  const supportItems = [
    { path: "/dashboard/suporte", title: "Central de Ajuda", icon: HelpCircle },
    { path: "/dashboard/chatana", title: "Chat com Ana", icon: MessageCircle }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-2">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Portal do Aluno
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <nav>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.path)}
                >
                  <Link to={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          <div className="px-3 mt-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Suporte</h2>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between p-3">
          <Link 
            to="/dashboard/perfil" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <User className="h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
          <span className="text-xs text-muted-foreground">v1.0.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AlunoSidebar;
