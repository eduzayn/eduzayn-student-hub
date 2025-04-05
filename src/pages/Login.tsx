
import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const Login = () => {
  return (
    <MainLayout>
      <div className="eduzayn-container py-12">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        <p className="text-gray-600 mb-4">
          Página de login para alunos e consultores.
        </p>
        <p className="text-gray-600">
          Aqui será implementado o formulário de login integrado com Supabase,
          permitindo acesso ao portal do aluno ou ao painel do consultor.
        </p>
      </div>
    </MainLayout>
  );
};

export default Login;
