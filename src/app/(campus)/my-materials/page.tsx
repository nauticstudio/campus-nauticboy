import { requireUser } from '@/server/auth/guards'
import { getAdminViewMode } from '@/app/actions/view-mode'
import {
  getStudentClassMaterials,
  getAllClassMaterialsAdmin,
  getStudentsListAdmin,
} from '@/lib/data/class-materials'
import { ClassMaterialsList } from '@/components/campus/ClassMaterialsList'

export const dynamic = 'force-dynamic'

export default async function MyMaterialsPage() {
  const { profile } = await requireUser()
  const isAdmin = profile?.role === 'admin'

  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  // Si es admin en modo admin, cargamos todos los materiales y la lista de alumnos
  if (showAdminUI) {
    const [materials, students] = await Promise.all([
      getAllClassMaterialsAdmin(),
      getStudentsListAdmin(),
    ])

    return (
      <ClassMaterialsList
        initialMaterials={materials}
        students={students}
        isAdmin={isAdmin}
        showAdminUI={true}
      />
    )
  }

  // Vista de alumno (o admin en vista alumno): solo sus propios materiales
  const studentMaterials = await getStudentClassMaterials()

  return (
    <ClassMaterialsList
      initialMaterials={studentMaterials}
      isAdmin={isAdmin}
      showAdminUI={false}
    />
  )
}
