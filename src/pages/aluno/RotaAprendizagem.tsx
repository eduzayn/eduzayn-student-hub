
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import RotaMapa from "@/components/aluno/aprendizagem/RotaMapa";
import RotaProgresso from "@/components/aluno/aprendizagem/RotaProgresso";
import { getRotaAprendizagem, getCurrentUserId } from "@/services/learnworlds-api";
import type { RotaAprendizagemType } from "@/types/aprendizagem";

const RotaAprendizagem: React.FC = () => {
  const [rotaAprendizagem, setRotaAprendizagem] = useState<RotaAprendizagemType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Busca o ID do usuário atual
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id || "user123"); // Fallback para "user123" se não estiver autenticado
    };
    
    fetchUserId();
  }, []);

  // Carrega dados da rota de aprendizagem quando o ID do usuário estiver disponível
  useEffect(() => {
    const fetchRotaAprendizagem = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const data = await getRotaAprendizagem(userId);
        setRotaAprendizagem(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar rota de aprendizagem:", err);
        setError("Não foi possível carregar sua rota de aprendizagem. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRotaAprendizagem();
  }, [userId]);

  // Renderização de carregamento
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Rota de Aprendizagem</h1>
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[150px]" />
            <Skeleton className="h-[150px]" />
          </div>
        </div>
      </div>
    );
  }

  // Exibição de erro
  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Rota de Aprendizagem</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Caso não tenha dados (situação improvável após verificar erros)
  if (!rotaAprendizagem) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Rota de Aprendizagem</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Nenhuma rota de aprendizagem disponível no momento.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Rota de Aprendizagem</h1>
      <p className="text-muted-foreground">
        Acompanhe seu progresso e visualize seu caminho de aprendizagem personalizado.
      </p>
      
      <Tabs defaultValue="mapa" className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="mapa">Mapa de Aprendizagem</TabsTrigger>
          <TabsTrigger value="progresso">Meu Progresso</TabsTrigger>
        </TabsList>
        <TabsContent value="mapa" className="space-y-4">
          <RotaMapa 
            rotaAprendizagem={rotaAprendizagem} 
            userId={userId || "user123"} 
          />
        </TabsContent>
        <TabsContent value="progresso" className="space-y-4">
          <RotaProgresso 
            rotaAprendizagem={rotaAprendizagem} 
            userId={userId || "user123"} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RotaAprendizagem;
