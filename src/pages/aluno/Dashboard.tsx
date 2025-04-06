
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, CreditCard, Bell } from "lucide-react";

const Dashboard: React.FC = () => {
  // Função para obter a saudação baseada na hora do dia
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  };
  
  // Dados mock para exibição (em produção viriam de uma API)
  const adminBypassEmail = localStorage.getItem('adminBypassEmail');
  const nomeUsuario = adminBypassEmail ? adminBypassEmail.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') : "Aluno";
  const resumos = [
    { titulo: "Cursos Ativos", valor: "3", icone: BookOpen, cor: "bg-blue-100 text-blue-700" },
    { titulo: "Próximas Atividades", valor: "5", icone: Calendar, cor: "bg-amber-100 text-amber-700" },
    { titulo: "Financeiro", valor: "Em dia", icone: CreditCard, cor: "bg-green-100 text-green-700" },
    { titulo: "Notificações", valor: "8", icone: Bell, cor: "bg-purple-100 text-purple-700" }
  ];

  return (
    <div className="space-y-6">
      {/* Header com saudação */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getSaudacao()}, {nomeUsuario}!
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu Portal do Aluno. Confira seu progresso e atividades.
        </p>
      </div>
      
      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {resumos.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-2xl font-bold">{item.valor}</p>
              <div className={`${item.cor} p-2 rounded-full`}>
                <item.icone className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Cursos em andamento */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Meus Cursos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="h-32 bg-gradient-to-r from-primary to-accent rounded-t-lg mb-4"></div>
              <CardTitle>Desenvolvimento Web Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "45%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Última atividade: <span className="font-medium">Ontem</span>
                </p>
                <button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium">
                  Continuar
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg mb-4"></div>
              <CardTitle>Design de Interfaces</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "78%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Última atividade: <span className="font-medium">Hoje</span>
                </p>
                <button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium">
                  Continuar
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="h-32 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-lg mb-4"></div>
              <CardTitle>Marketing Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">23%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "23%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Última atividade: <span className="font-medium">3 dias atrás</span>
                </p>
                <button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium">
                  Continuar
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Colunas de Agenda e Atividades */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Agenda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agenda Semanal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-2">
              <p className="font-medium">Entrega de Projeto</p>
              <p className="text-sm text-muted-foreground">Hoje, 23:59</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4 py-2">
              <p className="font-medium">Encontro Virtual</p>
              <p className="text-sm text-muted-foreground">Amanhã, 15:00</p>
            </div>
            <div className="border-l-4 border-muted pl-4 py-2">
              <p className="font-medium">Prova Final</p>
              <p className="text-sm text-muted-foreground">Sexta-feira, 14:00</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="font-medium">Quiz completado</p>
                  <p className="text-sm text-muted-foreground">Introdução ao HTML</p>
                  <p className="text-xs text-muted-foreground">Hoje, 13:45</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <div>
                  <p className="font-medium">Material visualizado</p>
                  <p className="text-sm text-muted-foreground">CSS Avançado</p>
                  <p className="text-xs text-muted-foreground">Ontem, 19:20</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">Atividade avaliada</p>
                  <p className="text-sm text-muted-foreground">Projeto Final - Nota: 9.5</p>
                  <p className="text-xs text-muted-foreground">2 dias atrás</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
