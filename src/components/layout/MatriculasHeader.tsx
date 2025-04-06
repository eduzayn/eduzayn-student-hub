
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Bell, Search, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/integrations/supabase/client";

const MatriculasHeader: React.FC = () => {
  const navigate = useNavigate();
  
  // Função para lidar com o logout
  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };
  
  // Função para alternar a visibilidade do sidebar em dispositivos móveis
  const toggleMobileSidebar = () => {
    document.body.classList.toggle("sidebar-open");
  };
  
  return (
    <header className="h-16 border-b bg-white flex items-center px-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden mr-2"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      <div className="md:ml-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="search"
            placeholder="Buscar matrícula, aluno, contrato..."
            className="pl-9 w-full md:w-80 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">Administrador</p>
                <p className="text-sm text-muted-foreground">admin@eduzayn.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button className="flex w-full items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500 focus:text-red-500 cursor-pointer"
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

export default MatriculasHeader;
