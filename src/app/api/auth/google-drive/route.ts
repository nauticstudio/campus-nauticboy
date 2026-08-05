import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'Missing GOOGLE_DRIVE_CLIENT_ID or GOOGLE_DRIVE_REDIRECT_URI in env' },
      { status: 500 }
    )
  }

  // Google OAuth 2.0 authorization endpoint
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.append('client_id', clientId)
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('response_type', 'code')
  
  // Scopes needed for Google Drive
  authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/drive')
  
  // Important for getting a refresh_token
  authUrl.searchParams.append('access_type', 'offline')
  // Force consent screen to ensure refresh token is returned even if previously authorized
  authUrl.searchParams.append('prompt', 'consent')

  return NextResponse.redirect(authUrl.toString())
}
