import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wcpvwigyqkzpzlxjjmvt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcHZ3aWd5cWt6cHpseGpqbXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Mjk0NzIsImV4cCI6MjA4MzAwNTQ3Mn0.L1_7V_U_u5vJfWYL-8aWKzzMDdIVMHQ5uWuHkKl_HfM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
