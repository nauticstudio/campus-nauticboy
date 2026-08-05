const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  try {
    const { error } = await supabase.from('enrollments').select('*').limit(1);
    console.log('enrollments:', error || 'exists');
  } catch (e) {
    console.log('enrollments error:', e.message);
  }
}
check();
