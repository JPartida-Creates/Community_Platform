import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { SessionUser } from '../types';

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  setUser: (user: SessionUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const session = await api.session();
      setUser(session.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshSession, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must run inside AuthProvider.');
  return context;
}
