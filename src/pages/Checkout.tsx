
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cursoInfo, setCursoInfo] = useState({
    nome: `Curso ${id || ''}`,
    preco: "R$ 997,00",
    modalidade: "Online"
  });
  
  // Simular pagamento (em um ambiente real, você integraria com o gateway de pagamento)
  const processarPagamento = () => {
    setLoading(true);
    
    // Simulação de processamento de pagamento
    setTimeout(() => {
      setLoading(false);
      toast.success("Pagamento processado com sucesso!");
      navigate("/confirmacao-sucesso");
    }, 2000);
  };
  
  return (
    <div className="eduzayn-container py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Detalhes do Pagamento</h2>
            <Separator className="my-4" />
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-md" 
                  placeholder="Digite seu nome completo" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-md" 
                  placeholder="Digite seu e-mail" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">CPF</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-md" 
                  placeholder="Digite seu CPF" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input 
                  type="tel" 
                  className="w-full p-3 border rounded-md" 
                  placeholder="Digite seu telefone" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
                <select className="w-full p-3 border rounded-md">
                  <option value="">Selecione uma forma de pagamento</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="boleto">Boleto Bancário</option>
                  <option value="pix">PIX</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Resumo da Compra</h2>
            <Separator className="my-4" />
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Curso:</span>
                <span className="font-medium">{cursoInfo.nome}</span>
              </div>
              <div className="flex justify-between">
                <span>Modalidade:</span>
                <span>{cursoInfo.modalidade}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{cursoInfo.preco}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
              onClick={processarPagamento}
              disabled={loading}
            >
              {loading ? "Processando..." : "Finalizar Compra"}
            </Button>
            
            <p className="mt-4 text-sm text-center text-gray-500">
              Ao finalizar a compra você concorda com os termos e condições e políticas de privacidade.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
