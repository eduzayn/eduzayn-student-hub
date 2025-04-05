
import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const Checkout = () => {
  const { id } = useParams();
  
  return (
    <MainLayout>
      <div className="eduzayn-container py-12">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <p className="text-gray-600 mb-4">
          Página de checkout para o curso ID: {id}
        </p>
        <p className="text-gray-600">
          Aqui será implementado o formulário de pagamento integrado com o Asaas,
          permitindo pagamento via boleto, Pix ou cartão de crédito.
        </p>
      </div>
    </MainLayout>
  );
};

export default Checkout;
