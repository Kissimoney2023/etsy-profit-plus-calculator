import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase Environment Variables missing!");
  throw new Error('Missing Supabase environment variables');
}

if (!supabaseUrl.startsWith('https://')) {
  console.warn("Supabase URL does not start with https://. This leads to connection errors.");
}

console.log("Supabase Client Initialized with:", supabaseUrl);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
