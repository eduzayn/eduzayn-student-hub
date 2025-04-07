
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-1">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduZayn Admin
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
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
                  <Link to="/admin/perfil" className="cursor-pointer flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-muted/30">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-4 bg-background">
        <div className="container px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EduZayn. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Versão 1.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
