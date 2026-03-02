import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Missing Supabase Environment Variables! API requests will fail.');
}

const url = supabaseUrl || 'https://missing-env.supabase.co';
const key = supabaseKey || 'missing-key';

// Ensure we use the service role key if available for backend admin tasks
export const supabase = createClient(url, key, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});
