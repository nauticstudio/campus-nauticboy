const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// We simulate what layout.tsx does
// Wait, to do that we need the user's access token, which we don't have here.
// Instead, let's just make the query bypassing RLS with service_role to confirm the row exists,
// then check if RLS is enabled on 'profiles' table.

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: profile } = await supabase.from('profiles').select('*').eq('email', 'nauticboyofficial@gmail.com').single();
  console.log('Profile from DB:', profile);
  
  // Try with Anon key (simulating unauthenticated)
  const anonSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: anonData, error: anonError } = await anonSupabase.from('profiles').select('*').eq('email', 'nauticboyofficial@gmail.com').single();
  console.log('Anon fetch result:', { anonData, anonError });
}
check();
