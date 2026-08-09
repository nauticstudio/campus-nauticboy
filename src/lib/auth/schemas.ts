import { z } from 'zod'

/**
 * Esquemas compartidos de autenticación.
 *
 * Centralizados aquí para que login / invitación / reset-password usen la
 * misma definición (mensaje en español incluido) y ningún Server Action haga
 * parsing ad-hoc de `FormData` antes de llegar a Supabase.
 */
export const emailSchema = z
  .string({ error: 'Introduce un correo electrónico válido.' })
  .trim()
  .max(254, 'Introduce un correo electrónico válido.')
  .pipe(z.email('Introduce un correo electrónico válido.'))

export const fullNameSchema = z
  .string({ error: 'Introduce un nombre válido.' })
  .trim()
  .min(2, 'El nombre debe tener al menos 2 caracteres.')
  .max(80, 'El nombre no puede superar 80 caracteres.')

export const loginSchema = z.object({ email: emailSchema })

export const inviteUserSchema = z.object({
  email: emailSchema,
  full_name: fullNameSchema,
})

export const updateProfileNameSchema = z.object({
  full_name: fullNameSchema,
})

export const updateEmailSchema = z.object({ email: emailSchema })

export type LoginInput = z.infer<typeof loginSchema>
export type InviteUserInput = z.infer<typeof inviteUserSchema>
export type UpdateProfileNameInput = z.infer<typeof updateProfileNameSchema>
