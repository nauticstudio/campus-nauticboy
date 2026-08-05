import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 })
  }

  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: 'Missing Google Drive credentials in env' },
      { status: 500 }
    )
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  })

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json()
      return NextResponse.json({ error: 'Failed to exchange code for token', details: error }, { status: 400 })
    }

    const data = await tokenResponse.json()
    
    // We display the refresh token so the user can copy it and save it in their .env.local
    return new NextResponse(
      `<html>
        <body style="font-family: monospace; padding: 2rem;">
          <h2>Google Drive Authorization Successful!</h2>
          <p>Please copy the <strong>refresh_token</strong> below and paste it into your <code>.env.local</code> file as <code>GOOGLE_DRIVE_REFRESH_TOKEN</code>.</p>
          <div style="background: #f4f4f4; padding: 1rem; border-radius: 8px; word-break: break-all;">
            <strong>refresh_token:</strong><br/>
            ${data.refresh_token || 'NO REFRESH TOKEN RETURNED. Did you consent previously? You might need to revoke access in your Google Account and try again.'}
          </div>
          <p>You can now close this window and restart your Next.js server.</p>
        </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    )
  } catch (error) {
    console.error('Error exchanging code:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
