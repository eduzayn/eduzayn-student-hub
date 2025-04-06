
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Bell, Mail, Search, LogOut } from "lucide-react";
import { logoutUser } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AlunoHeader: React.FC = () => {
  const navigate = useNavigate();
  // Estado para armazenar informações do usuário (seria substituído por dados reais vindos do contexto ou API)
  const adminBypassEmail = localStorage.getItem('adminBypassEmail');
  
  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };
  
  // Função para obter iniciais do nome
  const getInitials = (name: string) => {
    if (!name) return "UA";
    const parts = name.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <SidebarTrigger />
      
      <Link to="/dashboard" className="hidden md:block">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-lg p-1">
            <span className="h-5 w-5 text-white font-bold">EA</span>
          </div>
          <span className="font-semibold">EduZayn</span>
        </div>
      </Link>
      
      <div className="w-full flex-1 md:w-auto md:flex-none">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar..." 
            className="pl-8 md:w-[200px] lg:w-[300px]" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Mensagens */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
              3
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Mensagens</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-60 overflow-auto">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1 leading-none">
                  <span className="text-sm font-medium">Secretaria Acadêmica</span>
                  <span className="text-xs text-muted-foreground">Documentos pendentes para análise</span>
                  <span className="text-xs text-muted-foreground">Há 2 horas</span>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/comunicacao" className="w-full text-center cursor-pointer">
                Ver todas as mensagens
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
              5
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-60 overflow-auto">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1 leading-none">
                  <span className="text-sm font-medium">Nova atividade disponível</span>
                  <span className="text-xs text-muted-foreground">Módulo 3 - Desenvolvimento web</span>
                  <span className="text-xs text-muted-foreground">Há 1 hora</span>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/notificacoes" className="w-full text-center cursor-pointer">
                Ver todas as notificações
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Perfil do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{getInitials(adminBypassEmail || "")}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/perfil">Meu Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/configuracoes">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-500 focus:text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AlunoHeader;
