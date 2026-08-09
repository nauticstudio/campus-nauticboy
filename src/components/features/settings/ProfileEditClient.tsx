'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, User as UserIcon, CircleUser } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { updateProfileNameAction, updateEmailAction } from '@/lib/actions/auth'
import { toast } from 'sonner'

interface ProfileEditClientProps {
  initialName: string
  currentEmail: string
  role: string
  isAdmin: boolean
}

/**
 * Perfil del alumno: Nombre + Email (el campus funciona sin contraseña).
 * El cambio de email se confirma vía enlace al nuevo correo (Supabase).
 */
export function ProfileEditClient({ initialName, currentEmail, role, isAdmin }: ProfileEditClientProps) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(currentEmail)
  const [namePending, setNamePending] = useState(false)
  const [emailPending, setEmailPending] = useState(false)
  const router = useRouter()

  const dirtyName = name.trim() !== initialName.trim()
  const dirtyEmail = email.trim().toLowerCase() !== currentEmail.trim().toLowerCase()

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    if (!dirtyName || namePending) return
    setNamePending(true)
    const res = await updateProfileNameAction(name)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('Nombre actualizado')
      router.refresh()
    }
    setNamePending(false)
  }

  async function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!dirtyEmail || emailPending) return
    setEmailPending(true)
    const res = await updateEmailAction(email)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(res.message)
      setEmail('')
      router.refresh()
    }
    setEmailPending(false)
  }

  const initials = (initialName || currentEmail || 'A').charAt(0).toUpperCase()

  return (
    <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
      {/* Identidad */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="border-2 border-white shadow-[var(--shadow-card)] w-16 h-16">
              <AvatarFallback className={
                isAdmin
                  ? 'bg-gradient-to-br from-amber-400 via-orange-400 to-primary text-white text-xl'
                  : 'bg-gradient-to-tr from-ink-600 to-ink-900 text-white text-xl'
              }>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate">{initialName || 'Sin nombre'}</CardTitle>
              <div className="flex items-center gap-1.5 mt-1.5">
                <CircleUser className="w-3.5 h-3.5 text-ink-400" />
                <Badge variant={isAdmin ? 'default' : 'secondary'}>
                  {role === 'admin' ? 'Administrador' : 'Alumno'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400 font-medium">Correo actual</dt>
              <dd className="text-ink-800 font-semibold truncate text-right">{currentEmail}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Nombre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserIcon className="w-4 h-4 text-primary" /> Nombre para mostrar
          </CardTitle>
          <CardDescription>Se muestra en el menú y en tu avatar.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveName} className="contents">
          <CardContent>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={50}
              placeholder="Tu nombre"
              className="h-11"
              aria-label="Nombre completo"
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={!dirtyName || namePending} className="min-w-28">
              {namePending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar nombre'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Email */}
      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="w-4 h-4 text-primary" /> Correo electrónico
          </CardTitle>
          <CardDescription>
            Es tu identidad de acceso. Te enviaremos un enlace de confirmación al nuevo correo;
            hasta que lo confirmes, tu acceso sigue siendo el actual.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveEmail} className="contents">
          <CardContent>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={currentEmail}
              className="h-11"
              aria-label="Nuevo correo"
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={!dirtyEmail || emailPending} className="min-w-28">
              {emailPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cambiar correo'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
