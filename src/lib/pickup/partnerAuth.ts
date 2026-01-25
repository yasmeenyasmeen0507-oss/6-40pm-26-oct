import { supabase } from '@/integrations/supabase/client';
import type { PickupPartnerSession } from '@/types/pickup';

const SESSION_KEY = 'pickup_partner_session';
const SESSION_DURATION = 6 * 60 * 60 * 1000; // 6 hours

interface PickupPartnerCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

function generateToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function loginPickupPartner(credentials: PickupPartnerCredentials): Promise<PickupPartnerSession> {
  const { data: agent, error } = await supabase
    .from('pickup_agents')
    .select('*')
    .eq('username', credentials.username)
    .maybeSingle();

  if (error) {
    throw new Error('Unable to verify credentials');
  }

  if (!agent || agent.password !== credentials.password) {
    throw new Error('Invalid username or password');
  }

  const session: PickupPartnerSession = {
    agent: {
      id: agent.id,
      username: agent.username,
      created_at: agent.created_at,
    },
    token: generateToken(),
    expiresAt: Date.now() + (credentials.rememberMe ? 7 * 24 * 60 * 60 * 1000 : SESSION_DURATION),
  };

  savePickupPartnerSession(session);
  return session;
}

export function savePickupPartnerSession(session: PickupPartnerSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getPickupPartnerSession(): PickupPartnerSession | null {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const session: PickupPartnerSession = JSON.parse(stored);
    if (Date.now() > session.expiresAt) {
      clearPickupPartnerSession();
      return null;
    }
    return session;
  } catch (err) {
    clearPickupPartnerSession();
    return null;
  }
}

export function clearPickupPartnerSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function refreshPickupPartnerSession(): void {
  const current = getPickupPartnerSession();
  if (!current) return;
  current.expiresAt = Date.now() + SESSION_DURATION;
  savePickupPartnerSession(current);
}
