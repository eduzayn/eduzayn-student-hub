
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import useAuthProvider from "./useAuthProvider";
import { AuthContextType, AuthProviderProps } from "./types";

// Create the authentication context
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

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
