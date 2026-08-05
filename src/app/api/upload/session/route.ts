import { NextResponse } from 'next/server'
import { createUploadSession } from '@/lib/google-drive/files'
import { createClient } from '@/lib/supabase/server'

interface UploadSessionRequest {
  fileName?: string
  mimeType?: string
  fileSize?: number
  folderId?: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json() as UploadSessionRequest

  if (!body.fileName) {
    return NextResponse.json({ error: 'fileName is required' }, { status: 400 })
  }

  const session = await createUploadSession({
    fileName: body.fileName,
    mimeType: body.mimeType,
    fileSize: body.fileSize,
    folderId: body.folderId,
  })

  return NextResponse.json(session)
}
