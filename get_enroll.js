const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('enrollments').select('*').limit(1).catch(() => ({}));
  console.log('enrollments:', error || 'exists');
  
  const { data: d2, error: e2 } = await supabase.from('user_courses').select('*').limit(1).catch(() => ({}));
  console.log('user_courses:', e2 || 'exists');
}
check();
