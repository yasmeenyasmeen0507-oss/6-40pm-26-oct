// src/lib/supabase.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 1. FIX: Use 'import.meta.env' instead of 'process.env' for client-side environments (like Vite).
// Ensure your environment variables are named VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

if (supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.error("Supabase environment variables are missing or set to default placeholders. Please update src/lib/supabase.ts and your .env file.");
}

// Create and export the Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
