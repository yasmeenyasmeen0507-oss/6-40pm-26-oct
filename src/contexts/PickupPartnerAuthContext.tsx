import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PickupPartnerSession } from '@/types/pickup';
import {
  clearPickupPartnerSession,
  getPickupPartnerSession,
  loginPickupPartner,
  refreshPickupPartnerSession,
} from '@/lib/pickup/partnerAuth';

interface PickupPartnerAuthContextType {
  session: PickupPartnerSession | null;
  isLoading: boolean;
  login: (credentials: { username: string; password: string; rememberMe?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
}

const PickupPartnerAuthContext = createContext<PickupPartnerAuthContextType | undefined>(undefined);

export function PickupPartnerAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PickupPartnerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const current = getPickupPartnerSession();
    setSession(current);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const current = getPickupPartnerSession();
      if (!current) {
        setSession(null);
        navigate('/pickup-partner/login');
      } else {
        refreshPickupPartnerSession();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [session, navigate]);

  const login = async (credentials: { username: string; password: string; rememberMe?: boolean }) => {
    const newSession = await loginPickupPartner(credentials);
    setSession(newSession);
    navigate('/pickup-partner/dashboard');
  };

  const logout = async () => {
    clearPickupPartnerSession();
    setSession(null);
    navigate('/pickup-partner/login');
  };

  return (
    <PickupPartnerAuthContext.Provider value={{ session, isLoading, login, logout }}>
      {children}
    </PickupPartnerAuthContext.Provider>
  );
}

export function usePickupPartnerAuth() {
  const ctx = useContext(PickupPartnerAuthContext);
  if (!ctx) throw new Error('usePickupPartnerAuth must be used within PickupPartnerAuthProvider');
  return ctx;
}
