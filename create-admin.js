require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdmin() {
  console.log('Creando usuario admin...')
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'nauticboyofficial@gmail.com',
    password: 'NauticPassword123!',
    email_confirm: true,
    user_metadata: {
      full_name: 'Nautic Boy'
    }
  })

  if (error) {
    if (error.message.includes('User already registered')) {
        console.log('El usuario ya existe, actualizando su rol a admin...')
        // We need to fetch the user ID to update the role
        const { data: userData } = await supabase.from('profiles').select('id').eq('email', 'nauticboyofficial@gmail.com').single()
        if(userData) {
           await supabase.from('profiles').update({ role: 'admin' }).eq('id', userData.id)
           console.log('Rol actualizado a admin correctamente!')
        }
    } else {
        console.error('Error creando usuario:', error.message)
    }
    return
  }

  console.log('Usuario creado con éxito en auth.users:', data.user.id)

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', data.user.id)

  if (profileError) {
    console.error('Error actualizando rol a admin:', profileError.message)
  } else {
    console.log('Rol de administrador asignado correctamente en la tabla profiles!')
  }
}

createAdmin()
