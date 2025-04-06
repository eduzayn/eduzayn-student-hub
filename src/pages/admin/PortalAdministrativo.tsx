
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  DollarSign, 
  Building, 
  Users, 
  GraduationCap,
  BookOpen,
  Store,
  MapPin,
  BarChart,
  FileText
} from "lucide-react";

import ModuloCard from "@/components/admin/ModuloCard";

const PortalAdministrativo: React.FC = () => {
  const navigate = useNavigate();

  const modulos = [
    {
      id: "aplicacoes",
      titulo: "Módulos de Aplicação",
      descricao: "Gerenciamento central de todos os módulos da plataforma",
      icon: BarChart,
      iconColor: "text-blue-500",
      path: "/admin/aplicacoes"
    },
    {
      id: "chat",
      titulo: "Módulo de Chat",
      descricao: "Gestão de comunicações internas e externas",
      icon: MessageSquare,
      iconColor: "text-indigo-500",
      path: "/admin/chat"
    },
    {
      id: "contabilidade",
      titulo: "Módulo de Contabilidade",
      descricao: "Controle financeiro e contábil",
      icon: DollarSign,
      iconColor: "text-green-500",
      path: "/admin/contabilidade"
    },
    {
      id: "financeiro",
      titulo: "Módulo Financeiro Empresarial",
      descricao: "Gestão financeira completa",
      icon: Building,
      iconColor: "text-blue-500",
      path: "/admin/financeiro"
    },
    {
      id: "material",
      titulo: "Módulo de Material Didático",
      descricao: "Gestão de materiais e conteúdos",
      icon: FileText,
      iconColor: "text-purple-500",
      path: "/admin/material"
    },
    {
      id: "matriculas",
      titulo: "Módulo de Matrículas",
      descricao: "Processos de matrícula e renovação",
      icon: Users,
      iconColor: "text-indigo-500",
      path: "/admin/matriculas"
    },
    {
      id: "aluno",
      titulo: "Portal do Aluno",
      descricao: "Área exclusiva para alunos",
      icon: GraduationCap,
      iconColor: "text-blue-600",
      path: "/dashboard"
    },
    {
      id: "professor",
      titulo: "Portal do Professor",
      descricao: "Ambiente de produção de conteúdo educacional",
      icon: BookOpen,
      iconColor: "text-cyan-500",
      path: "/admin/professor"
    },
    {
      id: "parceiro",
      titulo: "Portal do Parceiro",
      descricao: "Gestão de parcerias e convênios",
      icon: Store,
      iconColor: "text-amber-500",
      path: "/admin/parceiro"
    },
    {
      id: "polo",
      titulo: "Portal do Polo",
      descricao: "Administração de unidades e polos",
      icon: MapPin,
      iconColor: "text-red-500",
      path: "/admin/polo"
    },
    {
      id: "rh",
      titulo: "Módulo de RH",
      descricao: "Gestão de recursos humanos",
      icon: Users,
      iconColor: "text-purple-500",
      path: "/admin/rh"
    }
  ];

  const handleModuloClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Portal Administrativo</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao ecossistema EduZayn. Selecione um módulo para acessar suas funcionalidades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulos.map((modulo) => (
          <ModuloCard
            key={modulo.id}
            titulo={modulo.titulo}
            descricao={modulo.descricao}
            icon={modulo.icon}
            iconColor={modulo.iconColor}
            onClick={() => handleModuloClick(modulo.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default PortalAdministrativo;
