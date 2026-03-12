import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  hasDetails: boolean;
  login: (token: string, role: string, hasDetails: boolean) => void;
  logout: () => void;
  setHasDetails: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [hasDetails, setHasDetailsState] = useState<boolean>(
    localStorage.getItem('hasDetails') === 'true'
  );

  const login = (token: string, role: string, hasDetails: boolean) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('hasDetails', String(hasDetails));
    setToken(token);
    setRole(role);
    setHasDetailsState(hasDetails);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setHasDetailsState(false);
  };

  const setHasDetails = (v: boolean) => {
    localStorage.setItem('hasDetails', String(v));
    setHasDetailsState(v);
  };

  return (
    <AuthContext.Provider value={{ token, role, hasDetails, login, logout, setHasDetails }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
