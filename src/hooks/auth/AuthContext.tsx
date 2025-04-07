
import { createContext, useContext } from "react";
import { AuthContextType, AuthProviderProps } from "./types";
import { useAuthProvider } from "./useAuthProvider";

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  isAdminBypass: false,
  isAdminUser: false,
  userEmail: null,
  checkAuth: async () => false,
  getAccessToken: async () => null,
  getAuthToken: async () => null,
  refreshAuth: async () => false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authState = useAuthProvider();
  
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
