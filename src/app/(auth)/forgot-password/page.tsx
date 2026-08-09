import { redirect } from 'next/navigation'

/**
 * El campus usa acceso por magic link (sin contraseñas). Mantener una página
 * de "recuperar contraseña" apuntando a un flujo inexistente solo genera
 * confusión y una superficie rota; redireccionamos al login.
 */
export default function ForgotPasswordPage() {
  redirect('/login')
}
