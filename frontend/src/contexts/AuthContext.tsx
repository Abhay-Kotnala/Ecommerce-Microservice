import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  userId: string;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useOidcAuth();

  const user: User | null = auth.user ? {
    id: auth.user.profile.sub || '',
    username: auth.user.profile.preferred_username || '',
    email: auth.user.profile.email || '',
    roles: (auth.user.profile.realm_access?.roles as string[]) || [],
  } : null;

  useEffect(() => {
    console.log("Auth State Changed:", {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      error: auth.error
    });
    if (auth.error) {
      console.error("Auth Error:", auth.error);
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, auth.error]);

  const login = () => {
    console.log("Login requested...");
    return auth.signinRedirect().catch(err => console.error("Login failed:", err));
  };
  const logout = () => {
    console.log("Logout requested...");
    auth.removeUser();
    auth.signoutRedirect();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: auth.isAuthenticated,
    login,
    logout,
    userId: user?.id || '',
    token: auth.user?.access_token || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
