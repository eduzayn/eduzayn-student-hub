
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MenuIcon, 
  X as CloseIcon, 
  User, 
  BookOpen, 
  Info, 
  Home 
} from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="eduzayn-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-1">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduZayn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/cursos" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Cursos
            </Link>
            <Link to="/quem-somos" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Quem Somos
            </Link>
            <Link to="/contato" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Contato
            </Link>
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden md:flex items-center space-x-3">
            <Button asChild variant="outline">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Link to="/dashboard">Portal do Aluno</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="eduzayn-container py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium p-2 rounded-md transition-colors"
                onClick={toggleMenu}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/cursos" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium p-2 rounded-md transition-colors"
                onClick={toggleMenu}
              >
                <BookOpen className="h-5 w-5" />
                <span>Cursos</span>
              </Link>
              <Link 
                to="/quem-somos" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium p-2 rounded-md transition-colors"
                onClick={toggleMenu}
              >
                <Info className="h-5 w-5" />
                <span>Quem Somos</span>
              </Link>
              <Link 
                to="/contato" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium p-2 rounded-md transition-colors"
                onClick={toggleMenu}
              >
                <User className="h-5 w-5" />
                <span>Contato</span>
              </Link>
              <div className="pt-2 flex flex-col space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login" onClick={toggleMenu}>Entrar</Link>
                </Button>
                <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Link to="/dashboard" onClick={toggleMenu}>Portal do Aluno</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
