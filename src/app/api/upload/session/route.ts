import { NextResponse } from 'next/server'
import { createUploadSession } from '@/lib/google-drive/files'
import { checkAdmin } from '@/server/auth/guards'

interface UploadSessionRequest {
  fileName?: string
  mimeType?: string
  fileSize?: number
  folderId?: string
}

export async function POST(request: Request) {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.code === 'UNAUTHENTICATED' ? 'Unauthorized' : 'Forbidden' },
      { status: auth.code === 'UNAUTHENTICATED' ? 401 : 403 }
    )
  }

  let body: UploadSessionRequest
  try {
    body = (await request.json()) as UploadSessionRequest
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la petición no válido' }, { status: 400 })
  }

  if (typeof body.fileName !== 'string' || body.fileName.trim().length === 0) {
    return NextResponse.json({ error: 'fileName is required' }, { status: 400 })
  }

  const session = await createUploadSession({
    fileName: body.fileName.trim(),
    mimeType: body.mimeType,
    fileSize: body.fileSize,
    folderId: body.folderId,
  })

  return NextResponse.json(session)
}
