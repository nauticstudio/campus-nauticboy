'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Shield, Search, MoreVertical, CheckCircle, Ban, Mail, Crown, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { inviteUserAction } from "@/lib/actions/auth"
import { formatDate } from "@/lib/date"

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  status: string
  created_at: string
}

export function AdminUsersClient({ initialUsers }: { initialUsers: UserProfile[] }) {
  const [users] = useState<UserProfile[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const filteredUsers = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const res = await inviteUserAction(formData)
    setLoading(false)

    if (res.error) {
      setMessage({ type: 'error', text: res.error })
    } else if (res.success) {
      setMessage({ type: 'success', text: res.success })
      setTimeout(() => {
        setIsInviteOpen(false)
        setMessage(null)
        router.refresh()
      }, 2000)
    }
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" /> Panel de Administración
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink-900 tracking-editorial">Gestión de Usuarios</h1>
        </div>

        <button 
          onClick={() => {
            setMessage(null)
            setIsInviteOpen(true)
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/95 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invitar Alumno por Correo</span>
        </button>
      </div>

      {/* Invite User Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-ink-900 rounded-[var(--radius)] p-6">
          <form onSubmit={handleInviteSubmit}>
            <DialogHeader className="space-y-2 mb-4">
              <DialogTitle className="font-display text-xl font-semibold">Invitar Alumno al Campus</DialogTitle>
              <DialogDescription className="text-xs font-medium text-ink-500">
                Se enviará un enlace de acceso directo y seguro de un solo uso al correo del alumno.
              </DialogDescription>
            </DialogHeader>

            {message && (
              <div className={`p-3 rounded-xl text-xs font-bold mb-4 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-ink-600 uppercase">Nombre Completo del Alumno</label>
                <Input name="full_name" placeholder="Ej: Lucas González" required className="rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-600 uppercase">Correo Electrónico</label>
                <Input name="email" type="email" placeholder="alumno@ejemplo.com" required className="rounded-xl mt-1" />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="submit" disabled={loading} className="w-full bg-ink-900 hover:bg-ink-800 text-white font-bold rounded-xl h-11">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar Invitación Mágica'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Users Table Card */}
      <div className="glass-card rounded-[var(--radius)] overflow-hidden shadow-sm">
        
        {/* Table Search Header */}
        <div className="p-5 border-b border-sand-200 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o correo..." 
              className="w-full bg-sand-100 border border-sand-300 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-coral-500/25"
            />
          </div>

          <span className="text-xs font-semibold text-ink-400 hidden sm:inline">
            Total: {filteredUsers.length} Usuarios Registrados
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-sand-100/80 text-ink-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Usuario</th>
                <th className="py-4 px-6">Rol</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Fecha Registro</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-sand-100/60 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className={`relative w-9 h-9 rounded-full text-white font-extrabold flex items-center justify-center text-xs shadow-2xs ${u.role === 'admin' ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-amber-500/40' : 'bg-gradient-to-tr from-coral-500 to-coral-700'}`}>
                      {u.role === 'admin' && <Crown className="w-4 h-4 absolute -top-1.5 -right-1 text-yellow-400 drop-shadow-md rotate-[15deg]" fill="currentColor" />}
                      {(u.full_name || u.email || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-extrabold text-ink-900 block text-sm">{u.full_name || 'Sin nombre'}</span>
                      <span className="text-ink-400 font-medium flex items-center gap-1">
                        <Mail className="w-3 h-3 text-ink-400" /> {u.email}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                      u.role === 'admin' 
                        ? 'bg-amber-100 text-amber-800 border-amber-200' 
                        : 'bg-sand-100 text-ink-700 border-sand-300'
                    }`}>
                      {u.role === 'admin' && <Crown className="w-3 h-3 text-amber-600" />}
                      {u.role === 'admin' ? 'Fundador & Admin' : 'Alumno'}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      u.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-rose-100 text-rose-800 border-rose-200'
                    }`}>
                      {u.status === 'active' ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Activo
                        </>
                      ) : (
                        <>
                          <Ban className="w-3 h-3 text-rose-600" /> Suspendido
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-ink-500 font-medium">
                    {formatDate(u.created_at)}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button className="p-2 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-sand-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}
