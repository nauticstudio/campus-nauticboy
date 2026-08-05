import { getAccessToken } from './auth'

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3'
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3'

interface CreateUploadSessionInput {
  fileName: string
  mimeType?: string
  fileSize?: number
  folderId?: string
}

export interface GoogleDriveUploadSession {
  uploadUrl: string
  storageProvider: 'google_drive'
  folderId: string
}

export interface GoogleDriveFileMetadata {
  id: string
  name: string
  mimeType: string
  size?: string
  webViewLink?: string
}

export async function createUploadSession({
  fileName,
  mimeType = 'application/octet-stream',
  fileSize,
  folderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
}: CreateUploadSessionInput): Promise<GoogleDriveUploadSession> {
  if (!folderId) {
    throw new Error('Missing GOOGLE_DRIVE_ROOT_FOLDER_ID')
  }

  const token = await getAccessToken()
  const response = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=resumable&supportsAllDrives=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': mimeType,
      ...(fileSize ? { 'X-Upload-Content-Length': String(fileSize) } : {}),
    },
    body: JSON.stringify({
      name: fileName,
      mimeType,
      parents: [folderId],
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const details = await response.json().catch(() => null)
    console.error('Failed to create Google Drive upload session:', details)
    throw new Error('Failed to create Google Drive upload session')
  }

  const uploadUrl = response.headers.get('location')

  if (!uploadUrl) {
    throw new Error('Google Drive did not return an upload session URL')
  }

  return {
    uploadUrl,
    storageProvider: 'google_drive',
    folderId,
  }
}

export async function getFileMetadata(fileId: string): Promise<GoogleDriveFileMetadata> {
  const token = await getAccessToken()
  const response = await fetch(
    `${DRIVE_API_BASE}/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType,size,webViewLink&supportsAllDrives=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    const details = await response.json().catch(() => null)
    console.error('Failed to read Google Drive file metadata:', details)
    throw new Error('Failed to read Google Drive file metadata')
  }

  return response.json()
}

export async function getDownloadUrl(fileId: string): Promise<string> {
  const token = await getAccessToken()
  const url = new URL(`${DRIVE_API_BASE}/files/${encodeURIComponent(fileId)}`)
  url.searchParams.set('alt', 'media')
  url.searchParams.set('supportsAllDrives', 'true')
  url.searchParams.set('access_token', token)

  return url.toString()
}

export async function deleteFile(fileId: string): Promise<void> {
  const token = await getAccessToken()
  const response = await fetch(
    `${DRIVE_API_BASE}/files/${encodeURIComponent(fileId)}?supportsAllDrives=true`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  )

  if (!response.ok && response.status !== 404) {
    const details = await response.json().catch(() => null)
    console.error('Failed to delete Google Drive file:', details)
    throw new Error('Failed to delete Google Drive file')
  }
}
