import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../api/supabaseClient';

interface AuthUser {
  name: string;
  role: 'admin';
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const ACCESS_TOKEN_KEY = 'interlearnhub.accessToken';
const USER_KEY = 'interlearnhub.user';
const AuthContext = createContext<AuthState | undefined>(undefined);
const USE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS !== 'false';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const login = async (email: string, password: string) => {
    if (USE_MOCKS) {
      if (!email || !password) throw new Error('Email and password are required.');
      const mockUser: AuthUser = { name: 'Administrator', role: 'admin' };
      localStorage.setItem(ACCESS_TOKEN_KEY, 'mock-token');
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error('Supabase session token not found.');

    const authUser: AuthUser = {
      name: data.user?.email ?? 'Administrator',
      role: 'admin',
    };

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    void supabase.auth.signOut();
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
