// src/lib/supabase.js

import { createClient } from '@supabase/supabase-js';

// 1. FIX: Use 'import.meta.env' instead of 'process.env' for client-side environments (like Vite).
// This resolves the 'ReferenceError: process is not defined'.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing or set to default placeholders. Please update src/lib/supabase.js and your .env file.");
    // In a production build, you might prefer to throw an error, 
    // but in development, console.error is often friendlier.
}

// Create and export the Supabase client instance
// NOTE: Type annotations removed to comply with the .js file extension.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
