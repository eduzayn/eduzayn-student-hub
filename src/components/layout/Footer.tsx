
import React from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube 
} from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-12 pb-6">
      <div className="eduzayn-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary rounded-lg p-1">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EduZayn
              </span>
            </Link>
            <p className="mt-4 text-gray-600 text-sm">
              Plataforma completa para venda de cursos, matrícula automatizada e gestão acadêmica, 
              proporcionando uma experiência moderna e organizada para instituições e alunos.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cursos" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Nossos Cursos
                </Link>
              </li>
              <li>
                <Link to="/quem-somos" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Entre em Contato
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Portal do Aluno
                </Link>
              </li>
              <li>
                <Link to="/consultor" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Área do Consultor
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/termos-de-uso" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidade" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/suporte" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-gray-600 text-sm">
                  Av. Principal, 1000 - Centro<br />
                  São Paulo - SP, 01000-000
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+551100000000" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  (11) 0000-0000
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:contato@eduzayn.com.br" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  contato@eduzayn.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-10 pt-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {year} EduZayn. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
