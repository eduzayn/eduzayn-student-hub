
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase, isAuthenticated } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Verificar autenticação ao carregar o componente e redirecionar para o novo portal
  useEffect(() => {
    const checkAuth = async () => {
      // Verificar bypass de admin
      const isAdminBypass = localStorage.getItem('adminBypassAuthenticated') === 'true';
      
      if (isAdminBypass) {
        // Redirecionar sempre para o portal administrativo quando for bypass
        console.log("Admin bypass detectado, redirecionando para o portal administrativo");
        navigate("/admin");
        return;
      }
      
      // Verificar autenticação normal para usuários comuns
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("Usuário não autenticado, redirecionando para login");
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const adminEmail = localStorage.getItem('adminBypassEmail');
  const isAdminBypass = localStorage.getItem('adminBypassAuthenticated') === 'true';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Portal do Aluno</h1>
        
        {isAdminBypass && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-800 text-lg">Modo Administrador</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">
                Você está conectado como administrador ({adminEmail}) com acesso bypass.
              </p>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acesse seus cursos e continue seus estudos.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Gerencie seus documentos acadêmicos.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Verifique mensalidades e pagamentos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
