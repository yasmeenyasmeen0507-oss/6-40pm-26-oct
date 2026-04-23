import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AdminSession, LoginCredentials } from '@/types/admin';
import {
  loginAdmin,
  logoutAdmin,
  getSession,
  isSessionValid,
  refreshSession,
} from '@/lib/admin/auth';

interface AdminAuthContextType {
  session: AdminSession | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = () => {
      const currentSession = getSession();
      setSession(currentSession);
      setIsLoading(false);
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      if (!isSessionValid()) {
        setSession(null);
        navigate('/admin/login');
      } else {
        refreshSession();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [session, navigate]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const newSession = await loginAdmin(credentials);
      setSession(newSession);
      navigate('/admin/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await logoutAdmin();
    setSession(null);
    navigate('/admin/login');
  };

  const refreshAuth = () => {
    const currentSession = getSession();
    setSession(currentSession);
  };

  return (
    <AdminAuthContext.Provider value={{ session, isLoading, login, logout, refreshAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
