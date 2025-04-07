
import { ReactNode } from "react";

export type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdminBypass: boolean;
  isAdminUser: boolean;
  userEmail: string | null;
  checkAuth: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  getAuthToken: () => Promise<string | null>;
  refreshAuth: () => Promise<boolean>;
};

export type AuthProviderProps = {
  children: ReactNode;
};
