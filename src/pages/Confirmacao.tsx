
import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const Confirmacao = () => {
  return (
    <MainLayout>
      <div className="eduzayn-container py-12">
        <h1 className="text-3xl font-bold mb-6">Confirmação de Matrícula</h1>
        <p className="text-gray-600 mb-4">
          Página de confirmação após pagamento bem-sucedido.
        </p>
        <p className="text-gray-600">
          Aqui serão exibidas informações sobre o próximo passo, acesso ao portal do aluno
          e instruções para começar os estudos.
        </p>
      </div>
    </MainLayout>
  );
};

export default Confirmacao;
