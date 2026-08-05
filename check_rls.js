const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'profiles' }).catch(() => ({}));
  console.log('Policies using RPC:', data, error);
  
  // Alternative: query pg_policies directly
  const { data: policies, error: dbError } = await supabase.from('pg_policies').select('*').eq('tablename', 'profiles').catch(() => ({}));
  console.log('pg_policies query:', policies, dbError);
}

check();
