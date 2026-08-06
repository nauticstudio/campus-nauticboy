-- =============================================
-- NAUTIC CAMPUS - SOFTWARE LIBRARY FULL SCHEMA & SEED
-- =============================================

-- 1. MANUFACTURERS
CREATE TABLE IF NOT EXISTS software_manufacturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS software_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Layers',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TAGS
CREATE TABLE IF NOT EXISTS software_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  tag_type TEXT NOT NULL DEFAULT 'genre',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SOFTWARE PRODUCTS
CREATE TABLE IF NOT EXISTS software_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id UUID NOT NULL REFERENCES software_manufacturers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  cover_image_url TEXT,
  logo_image_url TEXT,
  version TEXT DEFAULT '1.0',
  compatibility TEXT DEFAULT 'Windows 10/11 & macOS 12+',
  formats TEXT[] DEFAULT ARRAY['VST3', 'AU', 'AAX'],
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SOFTWARE ITEMS
CREATE TABLE IF NOT EXISTS software_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES software_products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'expansion',
  description TEXT,
  cover_image_url TEXT,
  file_size TEXT,
  version TEXT,
  download_url TEXT NOT NULL,
  preset_count INTEGER DEFAULT 0,
  genre_tag TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. JUNCTION TABLES
CREATE TABLE IF NOT EXISTS software_product_categories (
  product_id UUID REFERENCES software_products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES software_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE IF NOT EXISTS software_product_tags (
  product_id UUID REFERENCES software_products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES software_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE software_manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_product_tags ENABLE ROW LEVEL SECURITY;

-- 8. POLICIES (Public Read Access)
DROP POLICY IF EXISTS "Public Read Manufacturers" ON software_manufacturers;
CREATE POLICY "Public Read Manufacturers" ON software_manufacturers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Categories" ON software_categories;
CREATE POLICY "Public Read Categories" ON software_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Tags" ON software_tags;
CREATE POLICY "Public Read Tags" ON software_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON software_products;
CREATE POLICY "Public Read Products" ON software_products FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public Read Items" ON software_items;
CREATE POLICY "Public Read Items" ON software_items FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public Read Product Categories" ON software_product_categories;
CREATE POLICY "Public Read Product Categories" ON software_product_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Product Tags" ON software_product_tags;
CREATE POLICY "Public Read Product Tags" ON software_product_tags FOR SELECT USING (true);

-- =============================================
-- SEED DATA (FABRICANTES Y PRODUCTOS)
-- =============================================

INSERT INTO software_manufacturers (id, name, slug, logo_url, description)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'reFX', 'refx', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=150&auto=format&fit=crop&q=80', 'Pioneros en sintetizadores y expansiones de alta calidad para producción electrónica.'),
  ('a2222222-2222-2222-2222-222222222222', 'Vengeance Sound', 'vengeance-sound', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80', 'Creadores de VPS Avenger y algunas de las mejores librerías de la industria.'),
  ('a3333333-3333-3333-3333-333333333333', 'FabFilter', 'fabfilter', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', 'Estándar de la industria para ecualizadores, compresores y procesamiento de señal.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO software_categories (id, name, slug, icon)
VALUES 
  ('c1111111-1111-1111-1111-111111111111', 'Sintetizadores & Samplers', 'synths', 'Cpu'),
  ('c2222222-2222-2222-2222-222222222222', 'Efectos & Procesamiento', 'fx', 'Sliders')
ON CONFLICT (slug) DO NOTHING;

-- NEXUS 5
INSERT INTO software_products (id, manufacturer_id, name, slug, tagline, description, cover_image_url, version, compatibility, formats, is_featured)
VALUES (
  'b1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'Nexus 5',
  'nexus-5',
  'El sintetizador ROMpler definitivo para música electrónica.',
  'Nexus 5 reinventa la producción musical con un motor de audio de última generación, miles de presets listos para usar y una biblioteca de expansiones sin rival.',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
  '5.2.1',
  'Windows 10/11 (64-bit) | macOS 12+ (Apple Silicon Native)',
  ARRAY['VST3', 'AU', 'AAX'],
  true
) ON CONFLICT (slug) DO NOTHING;

-- VPS AVENGER 2
INSERT INTO software_products (id, manufacturer_id, name, slug, tagline, description, cover_image_url, version, compatibility, formats, is_featured)
VALUES (
  'b2222222-2222-2222-2222-222222222222',
  'a2222222-2222-2222-2222-222222222222',
  'VPS Avenger 2',
  'vps-avenger-2',
  'El sintetizador de síntesis híbrida más versátil del planeta.',
  'Con síntesis multisintética, wavetable, granular y multisample, VPS Avenger 2 es la estación de diseño sonoro definitiva.',
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
  '2.0.4',
  'Windows 10/11 | macOS 11+ (Intel & M1/M2/M3)',
  ARRAY['VST3', 'AU', 'AAX'],
  true
) ON CONFLICT (slug) DO NOTHING;

-- PRO-Q 3
INSERT INTO software_products (id, manufacturer_id, name, slug, tagline, description, cover_image_url, version, compatibility, formats, is_featured)
VALUES (
  'b3333333-3333-3333-3333-333333333333',
  'a3333333-3333-3333-3333-333333333333',
  'Pro-Q 3',
  'pro-q-3',
  'El ecualizador quirúrgico de precisión referencia en la industria.',
  'FabFilter Pro-Q 3 ofrece la mejor calidad de sonido posible, ecualización dinámica y un flujo de trabajo rápido e intuitivo.',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
  '3.24',
  'Windows 10/11 | macOS 10.13+',
  ARRAY['VST', 'VST3', 'AU', 'AAX'],
  true
) ON CONFLICT (slug) DO NOTHING;

-- ITEMS FOR NEXUS 5
INSERT INTO software_items (product_id, title, item_type, description, file_size, version, download_url, preset_count, genre_tag, sort_order)
VALUES 
  ('b1111111-1111-1111-1111-111111111111', 'Instalador Windows (v5.2.1)', 'installer_win', 'Incluye instalador VST3 y AAX de 64 bits para Windows.', '250 MB', '5.2.1', 'https://drive.google.com/uc?export=download&id=DEMO_WIN_NEXUS', 0, NULL, 1),
  ('b1111111-1111-1111-1111-111111111111', 'Instalador macOS (v5.2.1 Apple Silicon Native)', 'installer_mac', 'Instalador VST3, AU y AAX compatible con M1/M2/M3 e Intel.', '310 MB', '5.2.1', 'https://drive.google.com/uc?export=download&id=DEMO_MAC_NEXUS', 0, NULL, 2),
  ('b1111111-1111-1111-1111-111111111111', 'Nexus 5 Factory Content (Core Library)', 'factory_content', 'Biblioteca base oficial con más de 4,000 presets de fábrica.', '18.5 GB', '5.0', 'https://drive.google.com/uc?export=download&id=DEMO_FACTORY_NEXUS', 4000, NULL, 3),
  ('b1111111-1111-1111-1111-111111111111', 'Hard Techno Vol. 1', 'expansion', 'Screaming leads, kiks distorsionados y bajos oscuros para Hard Techno.', '1.2 GB', '1.0', 'https://drive.google.com/uc?export=download&id=DEMO_EXP_HT1', 150, 'Hard Techno', 4),
  ('b1111111-1111-1111-1111-111111111111', 'Melodic Techno Essentials', 'expansion', 'Arps hipnóticos, plucks atmosféricos y plads profundos estilo Afterlife.', '1.5 GB', '1.0', 'https://drive.google.com/uc?export=download&id=DEMO_EXP_MT1', 180, 'Melodic Techno', 5),
  ('b1111111-1111-1111-1111-111111111111', 'Synthwave & Retrowave', 'expansion', 'Sonidos analógicos vintage de los 80s rediseñados para producciones modernas.', '850 MB', '1.0', 'https://drive.google.com/uc?export=download&id=DEMO_EXP_SW1', 120, 'Synthwave', 6),
  ('b1111111-1111-1111-1111-111111111111', 'Peak Time EDM & Festival', 'expansion', 'Leads masivos, chords agresivos y drops para los escenarios más grandes.', '1.8 GB', '1.0', 'https://drive.google.com/uc?export=download&id=DEMO_EXP_EDM1', 200, 'EDM', 7)
ON CONFLICT DO NOTHING;

-- ITEMS FOR AVENGER 2
INSERT INTO software_items (product_id, title, item_type, description, file_size, version, download_url, preset_count, genre_tag, sort_order)
VALUES 
  ('b2222222-2222-2222-2222-222222222222', 'Instalador Windows (v2.0.4)', 'installer_win', 'Instalador oficial VPS Avenger 2 para Windows.', '180 MB', '2.0.4', 'https://drive.google.com/uc?export=download&id=DEMO_WIN_AVENGER', 0, NULL, 1),
  ('b2222222-2222-2222-2222-222222222222', 'Instalador macOS (v2.0.4 Universal)', 'installer_mac', 'Instalador universal macOS VST3 / AU / AAX.', '220 MB', '2.0.4', 'https://drive.google.com/uc?export=download&id=DEMO_MAC_AVENGER', 0, NULL, 2),
  ('b2222222-2222-2222-2222-222222222222', 'Avenger 2 Factory Content', 'factory_content', 'Contenido base oficial Avenger 2 (Wavetables, Samples, Presets).', '7.4 GB', '2.0', 'https://drive.google.com/uc?export=download&id=DEMO_FACTORY_AVENGER', 3000, NULL, 3),
  ('b2222222-2222-2222-2222-222222222222', 'Cyberpunk 2099 Expansion Pack', 'expansion', 'Sonidos oscuros, agresivos e industriales inspirados en el futuro cyberpunk.', '950 MB', '1.0', 'https://drive.google.com/uc?export=download&id=DEMO_EXP_CYBER', 140, 'Cyberpunk', 4)
ON CONFLICT DO NOTHING;

-- ITEMS FOR PRO-Q 3
INSERT INTO software_items (product_id, title, item_type, description, file_size, version, download_url, preset_count, genre_tag, sort_order)
VALUES 
  ('b3333333-3333-3333-3333-333333333333', 'FabFilter Total Bundle Installer (Win/Mac)', 'installer_win', 'Instalador completo que incluye Pro-Q 3, Pro-L 2, Pro-C 2 y más.', '95 MB', '3.24', 'https://drive.google.com/uc?export=download&id=DEMO_FABFILTER', 0, NULL, 1)
ON CONFLICT DO NOTHING;

NOTIFY pgrst, 'reload schema';
