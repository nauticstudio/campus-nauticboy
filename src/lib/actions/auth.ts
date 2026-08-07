'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Por favor ingresa tu correo electrónico' }
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campus.nauticboy.top'

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/api/auth/callback`,
    },
  })

  if (error) {
    return { error: 'Ocurrió un error al enviar el enlace mágico. Intenta nuevamente.' }
  }

  return { success: '¡Enlace mágico enviado! Revisa tu bandeja de entrada.' }
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
    let errorMessage = 'Ocurrió un error inesperado al enviar la invitación.';
    if (typeof error.message === 'string') {
      errorMessage = error.message;
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error);
    }
    return { error: errorMessage }
  }

  return { success: `Invitación enviada exitosamente a ${email}` }
}
