# Query Log — Nautic Campus

## 2026-08-08 — Verificación local + PR 3 (Auditoría seguridad)

**Entorno:** macOS (sin Docker, sin Supabase CLI, sin psql). Verificación estática + typecheck + build.

### Verificación local (migraciones)
- `00001_fix_profiles_rls.sql`, `0002_modules_is_published.sql`, `00003_close_modules_policy_gaps.sql`: cada `CREATE POLICY` tiene su `DROP POLICY IF EXISTS` → idempotentes.
- `00003`: todas las policies SELECT de `modules`, `module_resources`, `announcements`, `software_products`, `software_items`, `software_manufacturers`, `software_categories` exigen `auth.uid() IS NOT NULL`. Ampliado a `software_tags`, `software_product_categories`, `software_product_tags`.
- Seeds endurecidos: `supabase/seed.sql` (sin política duplicada de perfiles) y `supabase/software_schema.sql` (lecturas `true` → `auth.uid() IS NOT NULL`).

### PR 3
- `GET /api/search`: `q` validada (2–64 chars, trim, sin caracteres especiales `.or()`), sin `@ts-ignore` en el embed `categories(slug)`.
- `zod ^4.4.3` añadido como dependencia directa.
- `src/lib/auth/schemas.ts`: esquemas compartidos (`loginSchema`, `inviteUserSchema`, `updateProfileNameSchema`).
- `src/lib/actions/auth.ts`: toda la validación pasa por `safeParse` con mensajes en español.
- `src/lib/supabase/types.ts`: shim que reexporta `Profile`/`Role` desde `src/server/auth/guards.ts`. Cuando haya acceso remoto, `npm run types:db` regenera `src/types/database.ts` con el `Database` completo.
- `Profile.status` tipeado a `'active' | 'inactive' | 'banned' | (string & {})`.
- Typecheck: 0 errores. Build Next.js: OK (todas las rutas `ƒ` y `○` generan correctamente).
