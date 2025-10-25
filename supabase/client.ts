// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl); // Should show your URL
console.log('Supabase Key exists:', !!supabaseAnonKey); // Should be true

export const supabase = createClient(supabaseUrl, supabaseAnonKey);