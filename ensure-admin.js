require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function ensureAdminProfile() {
  console.log('Buscando usuario...')
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error al listar usuarios:', listError.message)
    return
  }

  const adminUser = usersData.users.find(u => u.email === 'nauticboyofficial@gmail.com')

  if (!adminUser) {
    console.error('No se encontró el usuario admin en auth.users')
    return
  }

  console.log('Usuario encontrado con ID:', adminUser.id)

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: adminUser.id,
      email: adminUser.email,
      full_name: 'Nautic Boy Admin',
      role: 'admin',
      status: 'active'
    })

  if (upsertError) {
    console.error('Error al upsert del perfil:', upsertError.message)
  } else {
    console.log('¡Perfil de Admin creado/actualizado exitosamente en la tabla profiles!')
  }
}

ensureAdminProfile()
