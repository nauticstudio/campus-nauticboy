# 🎧 Nautic Campus

> **Plataforma privada de alto rendimiento para alumnos de producción musical.**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Drive API](https://img.shields.io/badge/Google_Drive-API_v3-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://developers.google.com/drive)

Sistema de gestión académica y hub de contenidos pesados (plantillas DAW, librerías, stems, masterclasses y proyectos) diseñado para operar a **costo cero perpetuo** con almacenamiento optimizado en la nube.

---

## 📋 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura de Almacenamiento](#-arquitectura-de-almacenamiento)
- [Configuración Local](#-configuración-local)
- [Configuración de Google Drive API](#-configuración-de-google-drive-api)
- [Endpoints de Almacenamiento](#-endpoints-de-almacenamiento)
- [Guardrails de Costo](#-guardrails-de-costo)
- [Nota de Arquitectura](#-nota-de-arquitectura)

---

## 📖 Visión General

**Nautic Campus** es una plataforma web moderna e interactiva orientada a la enseñanza de producción musical. Combina la velocidad de renderizado de **Next.js 16 (App Router)** y **React 19**, la seguridad relacional de **Supabase (PostgreSQL + Auth)**, y la capacidad de distribución masiva de archivos pesados utilizando **Google Drive API** mediante sesiones resumibles *Direct-to-Drive*.

---

## ✨ Características Principales

- 🔐 **Control de Acceso (RBAC):** Autenticación de usuarios y validación de estado de alumno mediante políticas RLS en Supabase PostgreSQL.
- ⚡ **Direct-to-Drive Uploads:** Carga resumible de archivos pesados directa desde el navegador del usuario a Google Drive, evitando intermediación y cuellos de botella en el servidor web.
- 🛡️ **Descargas Verificadas:** Flujo de descarga protegido en dos pasos que autentica sesión, rol activo y permisos sobre el recurso antes de otorgar el acceso.
- 🎨 **UI Modern & Scalable:** Interfaz elegante y reactiva construida con Tailwind CSS v4 y componentes shadcn/ui.
- 💰 **Costo Cero Garantizado:** Arquitectura diseñada para encajar estrictamente en los niveles gratuitos de Vercel Hobby, Supabase Free y Google Cloud Tier.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server Components, Server Actions y API Routes optimizados. |
| **UI Core** | React 19 + TypeScript | Desarrollo estructurado con tipado estricto end-to-end. |
| **Estilos** | Tailwind CSS v4 + shadcn/ui | Sistema de diseño rápido, limpio, accesible y 100% responsivo. |
| **Base de Datos & Auth** | Supabase (PostgreSQL) | Autenticación, gestión de sesiones y base de datos con políticas de seguridad RLS. |
| **Almacenamiento** | Google Drive API (v3) | Gestión y streaming de archivos pesados con alcance `drive.file`. |

---

## 🏗️ Arquitectura de Almacenamiento

La plataforma usa Google Drive como *storage* para archivos pesados (plantillas DAW, librerías, stems, installers, samples). La arquitectura se apoya en estos pilares:

1. **Direct-to-Drive Uploads** — En el panel de administración, el cliente del navegador negocia una *resumable upload session* directamente contra `googleapis.com`. El archivo nunca pasa por el servidor de Next.js; solo se envían los metadatos. Esto elimina límites de cuota de Vercel Serverless Functions y permite subidas multi-gigabyte sin pagar ancho de banda intermedio.

2. **Descargas verificadas en 2 pasos** — Los usuarios finales nunca tocan URLs directas de Drive. El flujo es:
   1. El usuario pulsa el botón de descarga en la UI.
   2. La app llama a `POST /api/download`, que valida: sesión Supabase activa, rol de alumno activo y que el recurso/course está publicado.
   3. Solo si todo pasa, el servidor devuelve una URL de descarga de Drive firmada (o redirige a un path de streaming interno).
   4. La URL tiene TTL corto y no es reutilizable por terceros.

3. **Scopes mínimos** — La cuenta de servicio y el OAuth client usan **solo** `https://www.googleapis.com/auth/drive.file`. Esto da acceso de lectura/escritura únicamente a los archivos que la app crea o a los que se le otorga acceso explícito, no al Drive completo.

4. **Estructura de carpetas** — Todos los archivos viven bajo `GOOGLE_DRIVE_ROOT_FOLDER_ID`. Las subcarpetas se organizan por categoría/curso para mantener la cuota bajo control y facilitar auditoría manual.

---

## ⚙️ Configuración Local

1. **Clona el repo y copia variables:**

   ```bash
   git clone <repo>
   cd nautic-campus
   cp .env.example .env.local
   ```

2. **Configura Supabase:**
   - Crea un proyecto en [supabase.com](https://supabase.com).
   - En Project Settings → API, copia `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`.
   - Copia el `SUPABASE_SERVICE_ROLE_KEY` (¡nunca expongas este al cliente!).
   - Ejecuta las migraciones de `supabase/migrations/` en orden (ej. `npx supabase db push` o manualmente en el SQL editor).
   - Opcional: carga datos de ejemplo con `psql -f supabase/seed.sql`.

3. **Configura Google Drive:** sigue la sección dedicada más abajo.

4. **Arranca el dev server:**

   ```bash
   npm install
   npm run dev
   ```

---

## 🔧 Configuración de Google Drive API

La forma segura de conectar Drive es mediante el **script local** `setup:drive`, que ejecuta el flujo OAuth 2.0 en tu máquina, valida el `state`, e imprime el `refresh_token` directamente en tu terminal. **No** pegues tokens en querystrings ni los busques en el historial del navegador.

### Paso a paso

1. En [Google Cloud Console](https://console.cloud.google.com/), activa la **Google Drive API** para tu proyecto.

2. Crea unas credenciales **OAuth 2.0 Client ID** de tipo **Web application**:
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google-drive`

3. Copia el `Client ID` y `Client Secret` en `.env.local`:

   ```env
   GOOGLE_DRIVE_CLIENT_ID=...
   GOOGLE_DRIVE_CLIENT_SECRET=...
   GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google-drive
   GOOGLE_DRIVE_ROOT_FOLDER_ID=<id-de-la-carpeta-raiz>
   ```

4. Ejecuta el asistente:

   ```bash
   npm run setup:drive
   ```

   Esto abrirá tu navegador en una URL de consentimiento de Google que solo pide el scope `drive.file`. Tras autorizar, el script recibe el código en el callback local, valida el `state`, lo intercambia por tokens y **te muestra el `refresh_token` por stdout**. Guárdalo en `.env.local` como `GOOGLE_DRIVE_REFRESH_TOKEN`.

   > ⚠️ Si usas un usuario de Google distinto al admin de Drive, asegúrate de que ese usuario tenga acceso a la carpeta `GOOGLE_DRIVE_ROOT_FOLDER_ID`.

5. Verifica que el servidor puede autenticarse:

   ```bash
   npm run dev
   # → cualquier endpoint que use /api/upload/session debería responder 200
   ```

---

## 🌐 Endpoints de Almacenamiento

| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload/session` | Inicia una resumable upload session a Drive. Devuelve `session_uri` y `file_id`. | Admin |
| `POST` | `/api/download` | Valida permisos y devuelve una URL de descarga temporal. | Alumno activo |
| `GET` | `/api/download/[id]` | Streaming del recurso pedido (file proxy con verificación). | Alumno activo |

Todos los endpoints que tocan Drive validan el rol en el servidor antes de firmar/redirigir.

---

## 💰 Guardrails de Costo

- **Vercel Hobby:** límite de 100 GB de ancho de banda. Al hacer uploads *Direct-to-Drive*, el tráfico de archivos pesados no cuenta contra Vercel; solo las APIs de metadatos.
- **Supabase Free:** 500 MB de base de datos. Los archivos *nunca* se guardan en Postgres; solo metadatos (título, tamaño, `drive_file_id`, etc.).
- **Google Drive:** cuota de 15 GB (o la de tu Workspace). Al usar `drive.file`, la app solo ve/edita archivos que ella misma crea, evitando sobrescrituras accidentales.
- **Lighthouse / Edge:** la app corre casi todo en Server Components; el streaming de descargas se hace con `ReadableStream` y no almacena en memoria el archivo completo.

---

## 📝 Nota de Arquitectura

- **Autenticación:** Supabase Auth con cookies `httpOnly`. Los Server Actions leen el `session.user.id` del JWT y verifican el rol contra la tabla `profiles` (RLS activado).
- **Autorización:** la capa de acceso se centraliza en `src/server/auth/guards.ts` (`requireUser`, `requireAdmin`, `checkAdmin`).
- **Mutations:** se usan **Server Actions** para formularios de admin y **Route Handlers** solo para lógica con side-effect externo (OAuth, uploads a Drive, streaming).
- **Errores:** los Server Actions devuelven siempre `{ success: boolean, error?: string }` y los Route Handlers `NextResponse.json({ error }, { status })`.
