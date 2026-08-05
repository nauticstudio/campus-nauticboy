const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) console.error(authError);
  
  const user = users.users.find(u => u.email === 'nauticboyofficial@gmail.com');
  console.log('Auth user:', user ? user.id : 'not found');
  
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id);
    console.log('Profile for user:', profile);
  }
}
check();
