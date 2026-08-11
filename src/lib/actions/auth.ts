'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdmin } from '@/server/auth/guards'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as z from 'zod'
import { loginSchema, inviteUserSchema, updateProfileNameSchema, updateEmailSchema } from '@/lib/auth/schemas'

/** Devuelve el primer mensaje de validación de zod (en español, ver schemas). */
function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Entrada inválida.'
}

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { error: firstIssueMessage(parsed.error) }
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campus.nauticboy.top'

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${siteUrl}/api/auth/callback`,
      shouldCreateUser: false, // Prevents strangers from creating an account
    },
  })

  if (error) {
    console.error('[login] Error de Supabase:', error)

    const code = (error as { code?: string }).code
    if (code === 'over_email_send_rate_limit' || error.status === 429) {
      return { error: 'Has solicitado demasiados enlaces. Espera unos minutos e inténtalo de nuevo.' }
    }
    // Con shouldCreateUser:false, Supabase rechaza correos que no existen en Auth.
    if (code === 'user_not_found' || /signups not allowed|user not found/i.test(error.message)) {
      return { error: 'Este correo no está registrado en el campus. Contacta con Nautic Boy Academy para recibir tu invitación.' }
    }
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
  const parsed = loginSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { error: firstIssueMessage(parsed.error) }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    console.error('[requestPasswordReset] Error de Supabase:', error)
    return { error: 'No se ha podido procesar la solicitud. Inténtalo de nuevo.' }
  }

  return { success: 'Se ha enviado un enlace de recuperación a tu correo electrónico.' }
}

export async function updateProfileNameAction(fullName: string) {
  const parsed = updateProfileNameSchema.safeParse({ full_name: fullName })
  if (!parsed.success) {
    return { error: firstIssueMessage(parsed.error) }
  }

  // Mutación desde servidor: el cliente nunca toca `profiles` directamente.
  // RLS impone que solo puedas actualizar tu propia fila, y el trigger de la
  // migración 00001 bloquea cualquier cambio de role/status/email.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Debes iniciar sesión.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: parsed.data.full_name })
    .eq('id', user.id)

  if (error) {
    console.error('[updateProfileNameAction] Error:', error)
    return { error: 'No se ha podido actualizar el nombre.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateEmailAction(email: string) {
  const parsed = updateEmailSchema.safeParse({ email })
  if (!parsed.success) {
    return { error: firstIssueMessage(parsed.error) }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Debes iniciar sesión.' }
  }

  const newEmail = parsed.data.email
  if (user.email && newEmail.toLowerCase() === user.email.toLowerCase()) {
    return { error: 'El nuevo correo debe ser distinto al actual.' }
  }

  // Supabase envía el enlace de confirmación al correo NUEVO (y al antiguo si
  // activas "Secure email change"). Hasta confirmar, auth.users.email sigue
  // siendo el anterior, así que el usuario nunca pierde el acceso.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campus.nauticboy.top'
  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: `${siteUrl}/api/auth/callback?next=${encodeURIComponent('/settings/profile?email=updated')}`,
    }
  )

  if (error) {
    console.error('[updateEmailAction] Error de Supabase:', error)

    const code = (error as { code?: string }).code
    if (code === 'email_exists' || /already registered|already in use/i.test(error.message)) {
      return { error: 'Ese correo ya está registrado en otra cuenta.' }
    }
    if (code === 'over_email_send_rate_limit' || error.status === 429) {
      return { error: 'Has solicitado demasiados cambios. Espera un minuto e inténtalo de nuevo.' }
    }
    return { error: 'No se ha podido iniciar el cambio de correo. Inténtalo de nuevo.' }
  }

  return {
    success: true,
    message: 'Te hemos enviado un enlace de confirmación al nuevo correo. Ábrelo para completar el cambio.',
  }
}

export async function syncProfileEmailAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    return { error: 'Debes iniciar sesión.' }
  }

  // El trigger de la migración 00004 permite actualizar email SOLO a un valor
  // que ya esté confirmado en auth.users.email. RLS sigue limitando a tu propia fila.
  const { error } = await supabase
    .from('profiles')
    .update({ email: user.email })
    .eq('id', user.id)

  if (error) {
    console.error('[syncProfileEmailAction] Error:', error)
    return { error: 'El correo se verificó, pero no se pudo actualizar tu perfil. Inténtalo de nuevo.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function inviteUserAction(formData: FormData) {
  // La UI que muestra el botón de invitar no es una frontera de seguridad:
  // cualquier cliente puede invocar esta Server Action. Verificamos el rol aquí.
  const auth = await checkAdmin()
  if (!auth.ok) {
    return { error: auth.error }
  }

  const parsed = inviteUserSchema.safeParse({
    email: formData.get('email'),
    full_name: formData.get('full_name'),
  })
  if (!parsed.success) {
    return { error: firstIssueMessage(parsed.error) }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campus.nauticboy.top'
  const redirectTo = `${siteUrl}/api/auth/callback`

  const { error } = await auth.admin.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: { full_name: parsed.data.full_name },
    redirectTo,
  })

  if (error) {
    console.error('[inviteUserAction] Error de Supabase:', error)
    return { error: 'No se ha podido enviar la invitación. Inténtalo de nuevo.' }
  }

  console.info(`[inviteUserAction] Invitación enviada a ${parsed.data.email} por admin ${auth.user.id}`)
  return { success: `Invitación enviada exitosamente a ${parsed.data.email}` }
}
