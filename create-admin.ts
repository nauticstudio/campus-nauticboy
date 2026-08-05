import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

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
    console.error('Error creando usuario:', error.message)
    return
  }

  console.log('Usuario creado con éxito en auth.users:', data.user.id)

  // Actualizar rol a admin en la tabla profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', data.user.id)

  if (profileError) {
    console.error('Error actualizando rol a admin:', profileError.message)
  } else {
    console.log('Rol de administrador asignado correctamente en la tabla profiles!')
    console.log('Credenciales listas:')
    console.log('Email: nauticboyofficial@gmail.com')
    console.log('Contraseña: NauticPassword123!')
  }
}

createAdmin()
