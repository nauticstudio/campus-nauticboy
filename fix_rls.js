const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// We need the pg integration to execute raw sql, but we don't have it via the JS client.
// We can query pg_policies using service_role but pg_policies might not be exposed to the PostgREST API by default.
// Let's try anyway.
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('pg_policies').select('*');
  console.log(data, error);
}
check();
