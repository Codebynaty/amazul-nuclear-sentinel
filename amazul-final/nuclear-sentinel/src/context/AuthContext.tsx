import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { can, Permission } from '../services/permissions';
import { Session } from '../types';

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (p: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaura a sessão salva no AsyncStorage ao abrir o app
  useEffect(() => {
    authService.restoreSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, senha: string) => {
    setSession(await authService.login(email, senha));
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const hasPermission = useCallback((p: Permission) => can(session?.user.papel, p), [session]);

  const value = useMemo(
    () => ({ session, loading, signIn, signOut, hasPermission }),
    [session, loading, signIn, signOut, hasPermission],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
