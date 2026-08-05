# Nautic Campus

Campus privado para alumnos de producción musical. La base actual usa Next.js, Supabase Auth/PostgreSQL y Google Drive como almacenamiento de archivos grandes.

## Stack

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase Auth + PostgreSQL
- Google Drive API para archivos

## Configuración local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `nautic-campus/.env.local` desde `.env.example`.

3. Configurar Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Configurar Google Drive:

```bash
GOOGLE_DRIVE_CLIENT_ID=
GOOGLE_DRIVE_CLIENT_SECRET=
GOOGLE_DRIVE_REFRESH_TOKEN=
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google-drive
GOOGLE_DRIVE_ROOT_FOLDER_ID=
```

5. Ejecutar el SQL de `supabase/seed.sql` en Supabase.

6. Iniciar el servidor:

```bash
npm run dev
```

## Google Drive

Crear un proyecto en Google Cloud, habilitar Google Drive API y crear un OAuth Client tipo Web. Agregar como redirect URI:

```text
http://localhost:3000/api/auth/callback/google-drive
```

Con `GOOGLE_DRIVE_CLIENT_ID` y `GOOGLE_DRIVE_CLIENT_SECRET` configurados, abrir:

```text
http://localhost:3000/api/auth/google-drive
```

La callback mostrará el `refresh_token` que hay que guardar en `GOOGLE_DRIVE_REFRESH_TOKEN`.

Crear una carpeta `Campus` en Google Drive y copiar su ID desde la URL. Ese valor va en `GOOGLE_DRIVE_ROOT_FOLDER_ID`.

## Guardrails de costo

Este proyecto debe mantenerse 100% gratis:

- No habilitar Cloud Billing en el proyecto de Google Cloud.
- No solicitar aumentos de cuota de Google Drive API.
- No usar Google Cloud Storage, Cloud CDN, Cloud Run ni servicios pagos.
- Mantener Vercel en Hobby y Supabase en Free.
- Usar Google Drive API solo dentro del uso estándar gratuito y las cuotas documentadas.

## Endpoints de almacenamiento

- `POST /api/upload/session`: crea una sesión resumible de Google Drive para que el navegador suba archivos grandes directo a Drive.
- `GET /api/download/[id]`: valida login, estado del alumno y acceso al recurso antes de redirigir a la descarga por Drive API.

## Nota de arquitectura

Google Drive no ofrece un equivalente idéntico a una URL temporal anónima de descarga. Para mantener costo cero y usar la cuenta de 5TB, el campus usa Google Drive API con tokens de corta vida y scope `drive.file`. Si el proyecto llega a límites de cuota, debe degradar o pausar descargas antes que activar billing.
