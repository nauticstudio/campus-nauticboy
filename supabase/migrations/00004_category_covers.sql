-- Per-category cover images + icon URLs (Pearl "futuristic" pass).
-- Acecta URLs externas (Supabase Storage, Drive public, CDN) — mismo patrón que
-- cover_image_url de software_products.

alter table public.categories
  add column if not exists icon_url        text,
  add column if not exists cover_image_url text,
  add column if not exists accent_color    text not null default 'coral', -- coral|violet|cyan|emerald|rose
  add column if not exists blurb           text;

comment on column public.categories.accent_color is
  'Accent key used by SmartIcon + covers to tint hover states per category.';

-- Software products get a brand icon too (cards del hub).
alter table public.software_products
  add column if not exists icon_url text;

-- backfill: iconos lucide existentes siguen siendo la fuente primaria; icon_url es
-- override opcional.

-- RLS: las columnas nuevas caen bajo las policies existentes ("categories are
-- viewable by everyone", "only admins can modify") — no hace falta tocar RLS.
