
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdminUser, checkAuth } = useAuth();
  
  useEffect(() => {
    const verificarAuth = async () => {
      const autenticado = await checkAuth();
      
      if (autenticado) {
        // Verificar se é usuário admin ou normal
        if (isAdminUser) {
          console.log("Redirecionando usuário admin para o portal administrativo");
          navigate("/admin", { replace: true });
        } else {
          console.log("Redirecionando usuário regular para o portal do aluno");
          navigate("/aluno", { replace: true });
        }
      } else {
        console.log("Usuário não autenticado, redirecionando para login");
        navigate("/login", { replace: true });
      }
    };
    
    verificarAuth();
  }, [navigate, isAdminUser, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[300px] p-6">
        <CardContent className="flex flex-col items-center py-8">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-center text-muted-foreground">Verificando autenticação...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
