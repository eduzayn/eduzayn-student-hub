import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Award, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    title: "Engenharia Civil",
    category: "Segunda Graduação",
    categorySlug: "segunda-graduacao",
    duration: "3 anos",
    price: "R$ 697,00",
    originalPrice: "R$ 997,00",
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
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 10,
    title: "Big Data e Inteligência Analítica",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 11,
    title: "Cidades Inteligentes",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 12,
    title: "Coaching e Desenvolvimento Humano",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 13,
    title: "Comércio Exterior",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 14,
    title: "Design de Animação",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 15,
    title: "Designer de Interiores",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 16,
    title: "Designer de Produto",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 17,
    title: "Designer Gráfico",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 18,
    title: "Despachante Documentalista",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 19,
    title: "Educador Social",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 20,
    title: "Empreendedorismo Educacional",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 21,
    title: "Estética e Cosmética",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 22,
    title: "Gestão Ambiental",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 23,
    title: "Gestão Comercial",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 24,
    title: "Gestão da Produção Industrial",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 25,
    title: "Gestão da Qualidade",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 26,
    title: "Gestão de Agronegócios",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 27,
    title: "Gestão de Clínica e Consultório",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 28,
    title: "Gestão de Cooperativas",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 29,
    title: "Gestão de Investimentos",
    category: "Graduação Tecnológica",
    categorySlug: "graduacao",
    duration: "18 meses",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  
  // Novos cursos de licenciatura (3.5+ anos)
  {
    id: 30,
    title: "Artes Visuais",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 31,
    title: "Ciências da Religião",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 32,
    title: "Educação Especial",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 33,
    title: "Educação Física",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 34,
    title: "Filosofia",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 35,
    title: "Geografia",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 36,
    title: "História",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 37,
    title: "Letras - Língua Portuguesa e Libras",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 38,
    title: "Letras - Português e Espanhol",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 39,
    title: "Letras - Português e Inglês",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 40,
    title: "Pedagogia",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  {
    id: 41,
    title: "Sociologia",
    category: "Licenciatura",
    categorySlug: "graduacao",
    duration: "3.5 anos",
    price: "R$ 497,00",
    originalPrice: "R$ 697,00",
    image: "/placeholder.svg",
  },
  
  // Novos cursos de Bacharelado (3.5+ anos)
  {
    id: 42,
    title: "Administração",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 547,00",
    originalPrice: "R$ 747,00",
    image: "/placeholder.svg",
  },
  {
    id: 43,
    title: "Biblioteconomia",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 547,00",
    originalPrice: "R$ 747,00",
    image: "/placeholder.svg",
  },
  {
    id: 44,
    title: "Ciências Contábeis",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 547,00",
    originalPrice: "R$ 747,00",
    image: "/placeholder.svg",
  },
  {
    id: 45,
    title: "Educação Física",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 547,00",
    originalPrice: "R$ 747,00",
    image: "/placeholder.svg",
  },
  {
    id: 46,
    title: "Engenharia de Aplicação",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 647,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  {
    id: 47,
    title: "Engenharia de Dados",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 647,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  {
    id: 48,
    title: "Engenharia de Design Digital",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 647,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  {
    id: 49,
    title: "Engenharia de Manutenção e Diagnóstico Industrial",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 647,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  {
    id: 50,
    title: "Engenharia de Sistemas",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 647,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  {
    id: 51,
    title: "Engenharia de Software",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 647,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  {
    id: 52,
    title: "Psicopedagogia",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 597,00",
    originalPrice: "R$ 797,00",
    image: "/placeholder.svg",
  },
  {
    id: 53,
    title: "Publicidade e Propaganda",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 597,00",
    originalPrice: "R$ 797,00",
    image: "/placeholder.svg",
  },
  {
    id: 54,
    title: "Relações Internacionais",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 597,00",
    originalPrice: "R$ 797,00",
    image: "/placeholder.svg",
  },
  {
    id: 55,
    title: "Serviço Social",
    category: "Bacharelado",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 547,00",
    originalPrice: "R$ 747,00",
    image: "/placeholder.svg",
  },
  {
    id: 56,
    title: "Artes Visuais",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 57,
    title: "Sociologia",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 58,
    title: "Ciências da Religião",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 59,
    title: "Educação Especial",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 60,
    title: "Educação Física",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 61,
    title: "Filosofia",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 62,
    title: "Geografia",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 63,
    title: "História",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 64,
    title: "Letras - Língua Portuguesa e Libras",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 65,
    title: "Matemática",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 66,
    title: "Música",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 67,
    title: "Letras Português/Inglês",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 68,
    title: "Letras Português/Espanhol",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-graduacao",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  
  // Cursos de Formação Pedagógica
  {
    id: 69,
    title: "Artes Visuais",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 70,
    title: "Sociologia",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 71,
    title: "Ciências da Religião",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 72,
    title: "Educação Especial",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 73,
    title: "Educação Física",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 74,
    title: "Filosofia",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 75,
    title: "Geografia",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 76,
    title: "História",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 77,
    title: "Letras - Língua Portuguesa e Libras",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 78,
    title: "Matemática",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 79,
    title: "Música",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 80,
    title: "Letras Português/Inglês",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
  {
    id: 81,
    title: "Letras Português/Espanhol",
    category: "Formação Pedagógica",
    categorySlug: "formacao-pedagogica",
    duration: "12 meses",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  },
];

const Cursos = () => {
  const { categoria } = useParams();
  const [currentCategory, setCurrentCategory] = useState(categoria || "todos");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (categoria) {
      setCurrentCategory(categoria);
    }
  }, [categoria]);
  
  // Filtrar cursos com base na categoria selecionada e termo de busca
  const filteredCourses = mockCourses
    .filter(course => currentCategory === "todos" || course.categorySlug === currentCategory)
    .filter(course => 
      searchTerm === "" || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Categorias disponíveis - Adicionando a nova categoria
  const categories = [
    { id: "todos", name: "Todos os Cursos" },
    { id: "graduacao", name: "Graduação" },
    { id: "segunda-graduacao", name: "Segunda Graduação" },
    { id: "pos-graduacao", name: "Pós-Graduação" },
    { id: "formacao-livre", name: "Formação Livre" },
    { id: "capacitacao-profissional", name: "Capacitação Profissional" },
    { id: "formacao-pedagogica", name: "Formação Pedagógica" }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="eduzayn-container">
          <h1 className="text-3xl font-bold mb-6">
            {currentCategory === "todos" 
              ? "Todos os Cursos" 
              : categories.find(cat => cat.id === currentCategory)?.name || "Cursos"}
          </h1>
          
          {/* Campo de Busca */}
          <div className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text"
                placeholder="Buscar por nome de curso ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Filtros de Categoria */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {categories.map((cat) => (
                <Button 
                  key={cat.id} 
                  variant={currentCategory === cat.id ? "default" : "outline"}
                  className="whitespace-nowrap"
                  onClick={() => setCurrentCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Resultados da busca */}
          {searchTerm && (
            <p className="mb-4 text-gray-600">
              Exibindo {filteredCourses.length} resultado(s) para "{searchTerm}"
            </p>
          )}
          
          {/* Grid de Cursos */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum curso encontrado</h3>
              <p className="text-gray-500">Tente modificar sua busca ou filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary">{course.category}</Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">
                      <Link to={`/curso/${course.id}`} className="hover:text-primary transition-colors">
                        {course.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-2 space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>Certificado</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-bold text-primary">{course.price}</span>
                      <span className="text-sm text-gray-500 line-through">{course.originalPrice}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/curso/${course.id}`}>
                        Saiba Mais
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Cursos;
