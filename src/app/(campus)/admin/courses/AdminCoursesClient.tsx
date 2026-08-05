'use client'

import { useState } from 'react'
import { Plus, Shield, Edit3, Trash2, Layers, Eye, EyeOff, Loader2, Book } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createCourseAction } from '@/app/actions/courses'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Course {
  id: string
  title: string
  slug: string
  software: string | null
  is_published: boolean
}

const courseSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  software: z.string().optional(),
  description: z.string().optional(),
})

type CourseFormValues = z.infer<typeof courseSchema>

export function AdminCoursesClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      software: "",
      description: "",
    }
  })

  const toggleCourseVisibility = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setCourses(courses.map(c => 
      c.id === id ? { ...c, is_published: !currentStatus } : c
    ))

    // DB Sync
    const { error } = await supabase
      .from('courses')
      .update({ is_published: !currentStatus })
      .eq('id', id)

    if (error) {
      toast.error('Error al cambiar la visibilidad del curso')
      console.error('Error toggling course visibility:', error)
      // Revert on error
      setCourses(courses.map(c => 
        c.id === id ? { ...c, is_published: currentStatus } : c
      ))
    } else {
      toast.success(currentStatus ? 'Curso ocultado' : 'Curso publicado')
      router.refresh()
    }
  }

  const onSubmit = async (data: CourseFormValues) => {
    const slug = data.title.toLowerCase().trim().replace(/[\s\W-]+/g, '-')
    
    const result = await createCourseAction({
      title: data.title,
      description: data.description || '',
      software: data.software,
      slug,
    })

    if (!result.success) {
      toast.error(result.error || "Ocurrió un error al crear el curso")
      return
    }

    toast.success("Curso creado exitosamente")
    setCourses([result.course, ...courses])
    setIsDialogOpen(false)
    reset()
    
    router.push(`/admin/courses/${result.course.id}`)
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" /> Panel de Administración
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Cursos & Módulos</h1>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) reset()
        }}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-600/20 hover:bg-cyan-500 hover:scale-105 active:scale-95 transition-all duration-200">
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Curso</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 rounded-3xl p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader className="space-y-3 mb-6">
                <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 flex items-center justify-center">
                    <Book className="w-4 h-4 text-cyan-600" />
                  </div>
                  Crear Curso Nuevo
                </DialogTitle>
                <DialogDescription className="text-xs font-semibold text-slate-500">
                  Comienza configurando la información básica. El curso nacerá como "Borrador" oculto hasta que tú lo publiques.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Título del Curso</label>
                  <Input 
                    {...register("title")}
                    placeholder="Ej: Ableton Live Masterclass..."
                    className="rounded-xl border-slate-200 text-sm font-semibold bg-slate-50/50"
                  />
                  {errors.title && <p className="text-[10px] text-rose-500 font-bold">{errors.title.message}</p>}
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Software Asociado (Opcional)</label>
                  <Input 
                    {...register("software")}
                    placeholder="Ej: Ableton Live 12, FL Studio..."
                    className="rounded-xl border-slate-200 text-sm font-semibold bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Breve Descripción</label>
                  <textarea 
                    {...register("description")}
                    placeholder="De qué trata este curso..."
                    className="w-full rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50/50 p-3 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <DialogFooter className="mt-6 border-t border-slate-100 pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-11"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creando...</>
                  ) : (
                    'Crear e Ir al Editor'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Cards Grid */}
      {courses.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">No hay cursos registrados</h3>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
            Aún no has agregado ningún curso a tu base de datos de Supabase. Utiliza el botón superior para crear el primero.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-6 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-cyan-100 text-cyan-800 border border-cyan-200">
                    {course.software || 'General'}
                  </span>
                  <button 
                    onClick={() => toggleCourseVisibility(course.id, course.is_published)}
                    className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                      course.is_published 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200' 
                        : 'bg-rose-100/50 text-rose-600 hover:bg-rose-100 border border-rose-200/50'
                    }`}
                    title={course.is_published ? 'Ocultar curso a los alumnos' : 'Publicar curso para alumnos'}
                  >
                    {course.is_published ? (
                      <><Eye className="w-3.5 h-3.5" /> Publicado</>
                    ) : (
                      <><EyeOff className="w-3.5 h-3.5" /> Oculto</>
                    )}
                  </button>
                </div>

                <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                  {course.title}
                </h3>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link href={`/admin/courses/${course.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Editar Módulos
                </Link>
                <button className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
