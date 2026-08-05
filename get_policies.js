require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role to bypass RLS and query pg_policies, wait actually we can just query pg_policies using postgres connection, or via REST if allowed. 

// Better: Just use the service role key if available in .env.local
