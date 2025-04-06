import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Award, Search, Loader2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getCachedFreepikImage } from "@/utils/freepikAPI";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Mock featured courses data
const mockCourses = [
  // Cursos existentes
  {
    id: 1,
    title: "Administração de Empresas",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 597,00",
    originalPrice: "R$ 897,00",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Pedagogia",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 547,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Artes Visuais",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Gestão de Recursos Humanos",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "1.5 anos",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    title: "Marketing Digital",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "1.5 anos",
    price: "R$ 427,00",
    originalPrice: "R$ 627,00",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    title: "Excel Avançado",
    category: "Formação Livre",
    categorySlug: "formacao-livre",
    duration: "60 horas",
    price: "R$ 197,00",
    originalPrice: "R$ 297,00",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    title: "Técnicas de Vendas",
    category: "Capacitação Profissional",
    categorySlug: "capacitacao-profissional",
    duration: "80 horas",
    price: "R$ 247,00",
    originalPrice: "R$ 347,00",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    title: "Data Science",
    category: "Capacitação Profissional",
    categorySlug: "capacitacao-profissional",
    duration: "120 horas",
    price: "R$ 347,00",
    originalPrice: "R$ 447,00",
    image: "/placeholder.svg",
  },
  
  // Novos cursos de graduação tecnológica (18 meses)
  {
    id: 9,
    title: "Análise e Desenvolvimento de Sistemas",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 797,00",
    image: "/placeholder.svg",
  },
  {
    id: 10,
    title: "Gestão da Tecnologia da Informação",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 797,00",
    image: "/placeholder.svg",
  },
  {
    id: 11,
    title: "Marketing Digital",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 797,00",
    image: "/placeholder.svg",
  },
  
  // Novos cursos de licenciatura (3.5+ anos)
  {
    id: 12,
    title: "Letras - Português",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 547,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  {
    id: 13,
    title: "Matemática",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 547,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  
  // Novos cursos de Bacharelado (3.5+ anos)
  {
    id: 14,
    title: "Ciências Contábeis",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 597,00",
    originalPrice: "R$ 897,00",
    image: "/placeholder.svg",
  },
  {
    id: 15,
    title: "Engenharia Civil",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "5 anos",
    price: "R$ 647,00",
    originalPrice: "R$ 947,00",
    image: "/placeholder.svg",
  },
  
  // Adicionando novos cursos de Segunda Licenciatura
  {
    id: 100,
    title: "Sociologia",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 101,
    title: "Ciências da Religião",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 102,
    title: "Educação Especial",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 103,
    title: "Educação Física",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 104,
    title: "Filosofia",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 105,
    title: "Geografia",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 106,
    title: "História",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  // MBA Courses
  {
    id: 200,
    title: "MBA em Administração de Pessoal",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 201,
    title: "MBA em Auditoria Contábil",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 202,
    title: "MBA em Contabilidade Gerencial",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 203,
    title: "MBA em Finanças Corporativas e Controladoria",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 204,
    title: "MBA em Gestão Ambiental",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 205,
    title: "MBA em Gestão da Produção",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 206,
    title: "MBA em Gestão da Tecnologia da Informação",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 207,
    title: "MBA em Gestão de Cadeia de Suprimentos",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 208,
    title: "MBA em Gestão Estratégica e Inovação",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 209,
    title: "MBA em Gestão de Farmácias e Drogarias",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 210,
    title: "MBA em Gestão de Marketing Digital",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 211,
    title: "MBA em Gestão de Pessoas e Talentos",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 212,
    title: "MBA em Gestão de Saúde",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 213,
    title: "MBA em Gestão Empresarial",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 214,
    title: "MBA em Gestão Hospitalar",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 215,
    title: "MBA em Gestão Pública",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 216,
    title: "MBA em Gestão Social",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 217,
    title: "MBA em Logística Empresarial",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 218,
    title: "MBA em Logística e Supply Chain Management",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 219,
    title: "MBA em Marketing Estratégico",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 220,
    title: "MBA em Modelagem e Gestão de Processos",
    category: "MBA",
    categorySlug: "mba",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  
  // Cursos de Pós-Graduação em Direito
  {
    id: 300,
    title: "Arbitragem e Mediação de Conflitos",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 301,
    title: "Compliance",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 302,
    title: "Direito Administrativo",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 303,
    title: "Direito Aduaneiro",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 304,
    title: "Direito Ambiental",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 305,
    title: "Direito Civil e Processual Civil",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 306,
    title: "Direito Contratual",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 307,
    title: "Direito Constitucional",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 308,
    title: "Direito de Família e Sucessões",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 309,
    title: "Direito Digital",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 310,
    title: "Direito do Trabalho e Processual Trabalhista",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 311,
    title: "Direito dos Novos Negócios",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 312,
    title: "Direito Educacional",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 313,
    title: "Direito Empresarial",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 314,
    title: "Direito Eleitoral",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 315,
    title: "Direito Imobiliário",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 316,
    title: "Direito Internacional",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 317,
    title: "Direito LGBT+",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 318,
    title: "Direito Notarial e Registral",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 319,
    title: "Direito Penal e Processual Penal",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 320,
    title: "Direito Previdenciário",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 321,
    title: "Direito Previdenciário com Habilitação em Docência no Ensino Superior",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 322,
    title: "Direito Público Licitatório",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 323,
    title: "Direito Público Constitucional, Administrativo e Tributário",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 324,
    title: "Direito Tributário",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 325,
    title: "Direito Tributário e Processual Tributário",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 326,
    title: "Direitos Humanos e Diversidade Sócio Econômica",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 327,
    title: "Informática Forense",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 328,
    title: "Perícia e Auditoria Contábil",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  
  // Healthcare Postgraduate Courses
  {
    id: 400,
    title: "Análises Clínicas e Diagnóstico Laboratorial",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 401,
    title: "Atenção e Cuidado com Idosos",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 402,
    title: "Atendimento na Unidade Básica de Saúde",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 403,
    title: "Atendimento na Unidade Básica de Saúde - Enfermagem",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 404,
    title: "Atendimento na Unidade Básica de Saúde - Farmácia",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 405,
    title: "Atendimento na Unidade Básica de Saúde - Nutrição",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 406,
    title: "Cuidados Básico em Hospitais Municipais",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 407,
    title: "Farmacologia Clínica",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 408,
    title: "Fisioterapia Aplicada às Atividades Físicas",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 409,
    title: "Gestão da Saúde Municipal",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 410,
    title: "Gestão de Pandemias",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  }
];

const CourseList = () => {
  const { categoria: categorySlug } = useParams<{ categoria?: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingImages, setLoadingImages] = useState(false);
  const [coursesWithImages, setCoursesWithImages] = useState([...mockCourses]);
  
  // Filtrar cursos com base na categoria e termo de busca
  const filteredCourses = coursesWithImages.filter((course) => {
    const matchesCategory = categorySlug ? course.categorySlug === categorySlug : true;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Grupo de categorias para mostrar os filtros
  const categories = [
    { name: "Todos os Cursos", slug: undefined },
    { name: "Graduação", slug: "graduacao" },
    { name: "Segunda Licenciatura", slug: "segunda-licenciatura" },
    { name: "Pós-Graduação", slug: "pos-graduacao" },
    { name: "MBA", slug: "mba" },
    { name: "Formação Livre", slug: "formacao-livre" },
    { name: "Capacitação Profissional", slug: "capacitacao-profissional" },
  ];

  // Carrega imagens para os cursos
  useEffect(() => {
    const loadCourseImages = async () => {
      try {
        setLoadingImages(true);
        const updatedCourses = await Promise.all(
          mockCourses.map(async (course) => {
            try {
              // Tenta encontrar uma imagem relacionada ao título do curso
              const searchTerm = course.title.split(" ")[0]; // Usa a primeira palavra do título
              const imageUrl = await getCachedFreepikImage(
                `${searchTerm} education course`
              );
              
              return { ...course, image: imageUrl || "/placeholder.svg" };
            } catch (error) {
              console.error(`Erro ao carregar imagem para ${course.title}:`, error);
              return course;
            }
          })
        );
        
        setCoursesWithImages(updatedCourses);
        setLoadingImages(false);
      } catch (error) {
        console.error("Erro ao carregar imagens para cursos:", error);
        toast.error("Não foi possível carregar algumas imagens de cursos.");
        setLoadingImages(false);
      }
    };
    
    loadCourseImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho e Barra de Busca */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {categorySlug
            ? `Cursos de ${categories.find(cat => cat.slug === categorySlug)?.name || categorySlug}`
            : "Todos os Cursos"}
        </h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Link
              key={category.slug || "all"}
              to={category.slug ? `/cursos/${category.slug}` : "/cursos"}
              className={`px-4 py-2 rounded-full text-sm ${
                (category.slug === categorySlug) || (!category.slug && !categorySlug)
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Indicador de Carregamento */}
      {loadingImages && (
        <div className="flex justify-center mb-6">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <span className="ml-2">Carregando imagens dos cursos...</span>
        </div>
      )}
      
      {/* Lista de Cursos */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Link to={`/curso/${course.id}`} key={course.id}>
              <Card className="h-full flex flex-col transition-transform hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="p-0">
                  <AspectRatio ratio={16/9} className="bg-muted">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="object-cover w-full h-full rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <Badge className="mb-2" variant="outline">
                    {course.category}
                  </Badge>
                  <CardTitle className="text-xl mb-2 line-clamp-2">{course.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm line-through text-muted-foreground">
                          {course.originalPrice}
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {course.price}
                        </div>
                      </div>
                      <Button size="sm">
                        <BookOpen className="mr-1 h-4 w-4" /> Ver Curso
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-xl font-semibold mb-2">Nenhum curso encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar seus filtros ou termos de busca.
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseList;
