-- =============================================
-- NAUTIC CAMPUS - SOFTWARE LIBRARY SCHEMA ONLY
-- (No dummy data inserted - Clean State)
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

-- 5. SOFTWARE ITEMS (Installers, Expansions, Presets, Factory Content)
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

NOTIFY pgrst, 'reload schema';
