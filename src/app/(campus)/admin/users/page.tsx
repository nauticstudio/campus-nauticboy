'use client'

import { useState } from 'react'
import { Users, UserPlus, Shield, Search, MoreVertical, CheckCircle, Ban, Mail, Crown } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: 'u1',
      email: 'nauticboyofficial@gmail.com',
      full_name: 'Nautic Boy',
      role: 'admin',
      status: 'active',
      created_at: '2026-08-04'
    },
    {
      id: 'u2',
      email: 'alumno1@gmail.com',
      full_name: 'Carlos Mendoza',
      role: 'student',
      status: 'active',
      created_at: '2026-08-01'
    },
    {
      id: 'u3',
      email: 'alumno2@hotmail.com',
      full_name: 'Sofía Martínez',
      role: 'student',
      status: 'suspended',
      created_at: '2026-07-28'
    }
  ])

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" /> Panel de Administración
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Usuarios</h1>
        </div>

        <button 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-600/20 hover:bg-cyan-500 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear Usuario / Alumno</span>
        </button>
      </div>

      {/* Users Table Card */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-sm">
        
        {/* Table Search Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Total: {users.length} Usuarios
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Usuario</th>
                <th className="py-4 px-6">Rol</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Fecha Registro</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className={`relative w-9 h-9 rounded-full text-white font-extrabold flex items-center justify-center text-xs shadow-2xs ${u.role === 'admin' ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-amber-500/40' : 'bg-gradient-to-tr from-cyan-500 to-blue-600'}`}>
                      {u.role === 'admin' && <Crown className="w-4 h-4 absolute -top-1.5 -right-1 text-yellow-400 drop-shadow-md rotate-[15deg]" fill="currentColor" />}
                      {u.full_name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block text-sm">{u.full_name}</span>
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {u.email}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center w-max gap-1 ${
                      u.role === 'admin' 
                        ? 'bg-amber-100 text-amber-800 border-amber-200' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
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

                  <td className="py-4 px-6 text-slate-500 font-medium">
                    {u.created_at}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100">
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
