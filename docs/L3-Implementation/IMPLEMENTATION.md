# Implementation Specifications (L3-Implementation)

## Overview
This document details the technical implementation specifics of the Nautic Campus platform.

## 1. Routing & Data Fetching (Next.js)
- **App Router**: The application strictly uses the Next.js App Router (`src/app`).
- **Route Groups**: 
  - `(campus)`: Main authenticated area.
  - `(auth)`: Authentication views.
- **Data Mutations**: Handled exclusively via Server Actions (`src/app/actions`) rather than API routes.

## 2. Component Architecture
- **UI Primitives**: Built using Shadcn UI and Base UI components.
- **Layouts**: Global layouts include a `Sidebar`, `Header`, and a global `ViewModeSwitcher` (Admin/Student toggle).
- **Styling**: Managed via Tailwind CSS v4 utility classes.

## 3. Database Interactions
- **Supabase Client**: Initialized in `src/lib/supabase/server.ts` and `client.ts`.
- **Query Structure**: Direct Supabase SDK calls within Server Actions (e.g., `adminSupabase.from('software_manufacturers').delete()`).

## 4. Unknowns & Unverified Implementations
### [UNKNOWN] Caching Strategy
- There is no documented strategy for Next.js Data Cache or Full Route Cache invalidation beyond basic `revalidatePath` calls.

### [UNKNOWN] Error Handling Boundary
- No global `error.tsx` or `global-error.tsx` patterns have been formally documented or verified.
