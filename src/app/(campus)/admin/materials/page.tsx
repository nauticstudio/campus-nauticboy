import { requireAdmin } from '@/server/auth/guards'
import {
  getAllClassMaterialsAdmin,
  getStudentsListAdmin,
} from '@/lib/data/class-materials'
import { ClassMaterialsList } from '@/components/campus/ClassMaterialsList'

export const dynamic = 'force-dynamic'

export default async function AdminMaterialsPage() {
  await requireAdmin()

  const [materials, students] = await Promise.all([
    getAllClassMaterialsAdmin(),
    getStudentsListAdmin(),
  ])

  return (
    <ClassMaterialsList
      initialMaterials={materials}
      students={students}
      isAdmin={true}
      showAdminUI={true}
    />
  )
}
