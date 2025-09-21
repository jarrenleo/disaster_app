import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey)
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY. Add them to your .env and restart the dev server.'
  );

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
export type SupabaseClientType = typeof supabase;
