import { createClient } from '@supabase/supabase-js';

let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/["']/g, "").trim();
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/["']/g, "").trim();

if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase Environment Variables! Check .env.local');
}

// Singleton pattern for Next.js HMR
const globalAny: any = global;
export const supabase = globalAny.supabase || createClient(supabaseUrl, supabaseKey);

if (process.env.NODE_ENV !== 'production') {
  globalAny.supabase = supabase;
}
