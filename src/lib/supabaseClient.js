import { createClient } from '@supabase/supabase-js' 
// Your Supabase project URL (replace with your actual value) 
const supabaseUrl = 'https://qzgqehegeaciunbbvkyt.supabase.co' 
// Your public API key (SAFE to use in frontend) 
const supabaseKey = 'sb_publishable_wZyIj-W0HBbEKFviv83YwQ_x12xX5ud' 
// Create a connection to Supabase 
export const supabase = createClient(supabaseUrl, supabaseKey) 