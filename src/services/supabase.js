// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error('⚠️ Supabase credentials not found!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  console.error('See SUPABASE_SETUP.md for instructions');
}

// Create Supabase client (will use empty strings if not configured, which will cause API calls to fail)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Database table names
export const TABLES = {
  SAVED_RECIPES: 'saved_recipes',
  USER_PROFILES: 'user_profiles',
  RECIPE_VIEWS: 'recipe_views'
};

