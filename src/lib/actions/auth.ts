'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Por favor ingresa tu email y contraseña' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Credenciales inválidas. Por favor verifica tu email y contraseña.' }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Por favor ingresa tu email' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Se ha enviado un enlace de recuperación a tu correo electrónico.' }
}

export async function inviteUserAction(formData: FormData) {
  const email = formData.get('email') as string
  const fullName = formData.get('full_name') as string

  if (!email || !fullName) {
    return { error: 'Por favor completa el nombre completo y el correo electrónico.' }
  }

  const supabaseAdmin = await createAdminClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campus.nauticboy.top'
  const redirectTo = `${siteUrl}/api/auth/callback`

  const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: {
      full_name: fullName,
    },
    redirectTo,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: `Invitación enviada exitosamente a ${email}` }
}
