
import { createContext, useContext, ReactNode } from "react";
import { useAuthProvider } from "./useAuthProvider";

// Interface para o contexto de autenticação
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdminUser: boolean;
  userEmail: string | null;
  checkAuth: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  getAuthToken: () => Promise<string | null>;
  refreshAuth: () => Promise<boolean>;
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider para o contexto de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Utilizando o hook useAuthProvider para gerenciar autenticação
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
