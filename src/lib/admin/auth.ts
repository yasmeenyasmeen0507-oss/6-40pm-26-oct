import bcrypt from 'bcryptjs';
import { supabase } from '@/integrations/supabase/client';
import type { AdminUser, AdminSession, LoginCredentials } from '@/types/admin';

const SESSION_KEY = 'admin_session';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export async function loginAdmin(credentials: LoginCredentials): Promise<AdminSession> {
  try {
    // Fetch admin user
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', credentials.username)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Database error during login:', error);
      throw new Error('Failed to connect to database');
    }

    if (!adminUser) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, adminUser.password_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Update last login timestamp
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUser.id);

    // Log login activity (non-blocking)
    logAdminActivity({
      admin_user_id: adminUser.id,
      action_type: 'login',
      table_name: 'admin_users',
      record_id: adminUser.id,
    }).catch((err) => console.warn('Failed to log login activity:', err));

    // Create session
    const session: AdminSession = {
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
        created_at: adminUser.created_at,
        last_login: new Date().toISOString(),
        is_active: adminUser.is_active,
      },
      token: generateToken(),
      expiresAt: Date.now() + SESSION_DURATION,
    };

    saveSession(session, credentials.rememberMe);
    return session;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutAdmin(): Promise<void> {
  const session = getSession();

  if (session) {
    // Log logout activity (non-blocking)
    logAdminActivity({
      admin_user_id: session.user.id,
      action_type: 'logout',
      table_name: 'admin_users',
      record_id: session.user.id,
    }).catch((err) => console.warn('Failed to log logout activity:', err));
  }

  clearSession();
}

export function getSession(): AdminSession | null {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session: AdminSession = JSON.parse(sessionStr);

    // Check if session expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    clearSession();
    return null;
  }
}

export function saveSession(session: AdminSession, rememberMe: boolean = false): void {
  try {
    if (rememberMe) {
      // Remember for 7 days
      session.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

export function isSessionValid(): boolean {
  const session = getSession();
  return session !== null;
}

export async function refreshSession(): Promise<void> {
  const session = getSession();
  if (!session) return;

  // Extend session expiry
  session.expiresAt = Date.now() + SESSION_DURATION;
  saveSession(session);
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function logAdminActivity(activity: {
  admin_user_id: string;
  action_type: 'create' | 'update' | 'delete' | 'export' | 'login' | 'logout' | 'status_change';
  table_name: string;
  record_id?: string;
  before_data?: any;
  after_data?: any;
}): Promise<void> {
  try {
    const { error } = await supabase.from('admin_activity_logs').insert({
      admin_user_id: activity.admin_user_id,
      action_type: activity.action_type,
      table_name: activity.table_name,
      record_id: activity.record_id || null,
      before_data: activity.before_data || null,
      after_data: activity.after_data || null,
      ip_address: null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });

    if (error) {
      console.error('Failed to log admin activity:', error);
      // Don't throw - activity logging shouldn't break main functionality
    }
  } catch (error) {
    console.error('Exception during activity logging:', error);
    // Silently fail - don't break the app
  }
}

export async function updateAdminPassword(
  adminId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    // Fetch current password hash
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('id', adminId)
      .single();

    if (error || !adminUser) {
      throw new Error('Admin user not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, adminUser.password_hash);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password_hash: newPasswordHash })
      .eq('id', adminId);

    if (updateError) {
      throw new Error('Failed to update password');
    }

    // Log password change (non-blocking)
    logAdminActivity({
      admin_user_id: adminId,
      action_type: 'update',
      table_name: 'admin_users',
      record_id: adminId,
      after_data: { password_changed: true },
    }).catch((err) => console.warn('Failed to log password change:', err));
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
}