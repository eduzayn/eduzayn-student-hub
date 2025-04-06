
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Award, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getCachedFreepikImage } from "@/utils/freepikAPI";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Dados simulados para os cursos
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
  },
  {
    id: 411,
    title: "Gestão de Saúde",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 412,
    title: "Gestão em Saúde Pública",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 413,
    title: "Gestão Farmacêutica",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 414,
    title: "Neuropsicologia Clínica",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 415,
    title: "Psicanálise",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 416,
    title: "Psicologia Hospitalar",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 417,
    title: "Saúde Mental",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 418,
    title: "Segurança de Pacientes e Gestão dos Riscos Assistenciais",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 419,
    title: "Sexologia",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  
  // New Nutrition-related Postgraduate Courses
  {
    id: 420,
    title: "Nutrição Clínica",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 421,
    title: "Nutrição Dietética",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 422,
    title: "Nutrição Esportiva",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 423,
    title: "Nutrição em Cirurgia Estética",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 424,
    title: "Fitoterapia e Suplementação Nutricional",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  {
    id: 425,
    title: "Atendimento na Unidade Básica de Saúde - Nutrição",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/placeholder.svg",
  },
  
  // Novo curso de Formação Livre em Psicanálise
  {
    id: 500,
    title: "Formação Livre em Psicanálise",
    category: "Formação Livre",
    categorySlug: "formacao-livre",
    duration: "800 horas",
    price: "R$ 197,00",
    originalPrice: "R$ 297,00",
    image: "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
    description: "Curso completo de formação livre em psicanálise com 800 horas de carga horária total, abordando desde conceitos introdutórios até tópicos avançados em clínica e sexualidade.",
    curriculum: [
      { module: "Introdução à EAD", hours: 30 },
      { module: "Diversidade Étnico Racial, Gênero e Direitos Humanos", hours: 40 },
      { module: "Formação e Ética do Psicanalista", hours: 40 },
      { module: "Complexo de Édipo e Castração", hours: 40 },
      { module: "Introdução à Psicanálise", hours: 40 },
      { module: "Libido, Pulsões e Sexualidade", hours: 40 },
      { module: "Metodologia da Pesquisa Científica", hours: 40 },
      { module: "Narcisismo e a Cultura da Indiferença", hours: 40 },
      { module: "O Aparelho psíquico, aspectos clínicos e Teóricos", hours: 40 },
      { module: "O Método Psicanalítico", hours: 40 },
      { module: "Práticas e Procedimentos em Clínica", hours: 40 },
      { module: "Processos de Transferência e Resistência", hours: 40 },
      { module: "Psicanálise da Criança e do Adolescente", hours: 40 },
      { module: "Psicanálise II", hours: 40 },
      { module: "Psicopatologias I", hours: 40 },
      { module: "Psicopatologias II", hours: 40 },
      { module: "Sonhos, Simbologia e Representação", hours: 40 },
      { module: "Tópicos Avançados em Clínica", hours: 40 },
      { module: "Tópicos Avançados em Sexualidade", hours: 40 }
    ]
  },
  
  // Novo curso de Pós-Graduação em Psicanálise
  {
    id: 501,
    title: "Pós-Graduação em Psicanálise",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "6 meses",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    image: "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
    description: "Curso de pós-graduação em psicanálise para formação de profissionais para atuação clínica com base na teoria psicanalítica.",
    curriculum: [
      { module: "Introdução à EAD", hours: 30 },
      { module: "Diversidade Étnico Racial, Gênero e Direitos Humanos", hours: 40 },
      { module: "Formação e Ética do Psicanalista", hours: 40 },
      { module: "Complexo de Édipo e Castração", hours: 40 },
      { module: "Introdução à Psicanálise", hours: 40 },
      { module: "Libido, Pulsões e Sexualidade", hours: 40 },
      { module: "Metodologia da Pesquisa Científica", hours: 40 },
      { module: "Narcisismo e a Cultura da Indiferença", hours: 40 },
      { module: "O Aparelho psíquico, aspectos clínicos e Teóricos", hours: 40 },
      { module: "O Método Psicanalítico", hours: 40 },
      { module: "Práticas e Procedimentos em Clínica", hours: 40 },
      { module: "Processos de Transferência e Resistência", hours: 40 },
      { module: "Psicanálise da Criança e do Adolescente", hours: 40 },
      { module: "Psicanálise II", hours: 40 },
      { module: "Psicopatologias I", hours: 40 },
      { module: "Psicopatologias II", hours: 40 },
      { module: "Sonhos, Simbologia e Representação", hours: 40 },
      { module: "Tópicos Avançados em Clínica", hours: 40 },
      { module: "Tópicos Avançados em Sexualidade", hours: 40 },
      { module: "Trabalho de Conclusão de Curso (Opcional)", hours: 0 }
    ]
  }
];

const Cursos = () => {
  const { categoria } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [courseImages, setCourseImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  
  // Carregar imagens para os cursos
  useEffect(() => {
    const loadCourseImages = async () => {
      try {
        setLoading(true);
        
        // Preparar objeto inicial
        const initialImages = filteredCourses.reduce((acc, course) => {
          // Use a imagem existente se for um upload personalizado
          if (course.image.startsWith("/lovable-uploads/")) {
            acc[course.id] = course.image;
          } else {
            acc[course.id] = '/placeholder.svg'; // Placeholder inicial
          }
          return acc;
        }, {} as Record<number, string>);
        
        setCourseImages(initialImages);
        
        // Tentar carregar imagens do bucket do Supabase para cada categoria
        const imagePromises = filteredCourses.map(async (course) => {
          // Pular cursos que já têm imagem personalizada
          if (course.image.startsWith("/lovable-uploads/")) {
            return { id: course.id, imageUrl: course.image };
          }
          
          const categoryName = course.category.toLowerCase().replace(/\s+/g, '-');
          
          try {
            // Listar arquivos no bucket com um prefixo correspondente à categoria
            const { data: files, error } = await supabase
              .storage
              .from('category_images')
              .list(categoryName);
              
            if (error || !files?.length) {
              // Tentar usar a imagem específica do curso se disponível
              const courseSlug = course.title.toLowerCase().replace(/\s+/g, '-');
              const { data: courseFiles } = await supabase
                .storage
                .from('course_images')
                .list(courseSlug);
                
              if (courseFiles?.length) {
                const randomIndex = Math.floor(Math.random() * courseFiles.length);
                const selectedFile = courseFiles[randomIndex];
                
                const { data: publicURL } = supabase
                  .storage
                  .from('course_images')
                  .getPublicUrl(`${courseSlug}/${selectedFile.name}`);
                  
                return { id: course.id, imageUrl: publicURL.publicUrl };
              }
              
              // Usar placeholder se não encontrar
              return { id: course.id, imageUrl: '/placeholder.svg' };
            }
            
            // Escolher uma imagem aleatória se várias estiverem disponíveis
            const randomIndex = Math.floor(Math.random() * files.length);
            const selectedFile = files[randomIndex];
            
            // Obter a URL pública para o arquivo
            const { data: publicURL } = supabase
              .storage
              .from('category_images')
              .getPublicUrl(`${categoryName}/${selectedFile.name}`);
              
            return { id: course.id, imageUrl: publicURL.publicUrl };
          } catch (err) {
            console.error(`Erro ao carregar imagem para o curso ${course.title}:`, err);
            return { id: course.id, imageUrl: '/placeholder.svg' };
          }
        });
        
        const results = await Promise.all(imagePromises);
        
        const imagesMap = results.reduce((acc, { id, imageUrl }) => {
          acc[id] = imageUrl;
          return acc;
        }, {} as Record<number, string>);
        
        setCourseImages(imagesMap);
      } catch (err) {
        console.error("Falha ao carregar imagens dos cursos:", err);
        toast.error("Não foi possível carregar algumas imagens");
      } finally {
        setLoading(false);
      }
    };
    
    loadCourseImages();
  }, [filteredCourses]);
  
  // Filter courses based on category slug and search query
  useEffect(() => {
    const filtered = mockCourses.filter(course => {
      // Filter by category if provided
      const categoryMatch = categoria 
        ? course.categorySlug === categoria
        : true;
      
      // Filter by search query if provided
      const searchMatch = searchQuery
        ? course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          course.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      return categoryMatch && searchMatch;
    });
    
    setFilteredCourses(filtered);
  }, [categoria, searchQuery]);

  // Function to get the page title based on category
  const getPageTitle = () => {
    if (!categoria) return "Todos os Cursos";
    
    switch (categoria) {
      case "graduacao": return "Cursos de Graduação";
      case "segunda-licenciatura": return "Cursos de Segunda Licenciatura";
      case "segunda-graduacao-bacharelado": return "Cursos de Segunda Graduação Bacharelado";
      case "pos-graduacao": return "Cursos de Pós-Graduação";
      case "mba": return "Cursos de MBA";
      case "formacao-livre": return "Cursos de Formação Livre";
      case "capacitacao-profissional": return "Cursos de Capacitação Profissional";
      case "formacao-pedagogica": return "Cursos de Formação Pedagógica";
      default: return "Cursos";
    }
  };

  return (
    <MainLayout>
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
          <p className="text-gray-600 mb-8">
            Encontre o curso ideal para sua formação acadêmica e profissional
          </p>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome de curso ou categoria..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando cursos...</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={courseImages[course.id] || '/placeholder.svg'} 
                      alt={course.title} 
                      className="w-full h-48 object-cover" 
                      onError={(e) => {
                        // Fallback para placeholder se a imagem falhar
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <Badge 
                      className="absolute top-3 right-3"
                      variant="secondary"
                    >
                      {course.category}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl">
                      <Link 
                        to={`/curso/${course.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {course.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-gray-900">{course.price}</div>
                      <div className="text-sm text-gray-500">
                        <span className="line-through">{course.originalPrice}</span>
                        <span className="ml-2">em até 12x no cartão</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4">
                    <Button asChild className="w-full">
                      <Link to={`/curso/${course.id}`}>
                        Saiba Mais
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              !loading && (
                <div className="col-span-full text-center py-16">
                  <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Nenhum curso encontrado</h3>
                  <p className="text-gray-600 mb-6">
                    Tente ajustar seus filtros ou busca para encontrar o curso desejado.
                  </p>
                  <Button onClick={() => setSearchQuery("")}>
                    Limpar Busca
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Cursos;
