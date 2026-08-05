-- =============================================
-- 1. PROFILES (usuarios)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student'
    CHECK (role IN ('admin', 'student')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- =============================================
-- 2. COURSES (cursos / colecciones)
-- =============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT,         -- URL de la portada
  software TEXT,                -- "Ableton Live 12", "FL Studio 24"
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 3. MODULES (módulos dentro de un curso)
-- =============================================
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- =============================================
-- 4. CATEGORIES (sidebar dinámica de la academia)
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'folder',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 5. RESOURCES (archivos / contenido)
-- =============================================
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,

  -- Almacenamiento (NUNCA un link público permanente)
  storage_provider TEXT NOT NULL DEFAULT 'google_drive'
    CHECK (storage_provider IN ('google_drive')),
  storage_path TEXT NOT NULL,         -- Google Drive file ID
  file_name TEXT NOT NULL,
  file_extension TEXT NOT NULL,
  file_size BIGINT,

  -- Clasificación
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  software TEXT,
  version TEXT DEFAULT '1.0',
  author TEXT DEFAULT 'Nautic Boy',
  tags TEXT[] DEFAULT '{}',

  -- Acceso
  is_restricted BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 6. MODULE_RESOURCES (recurso ↔ módulo)
-- =============================================
CREATE TABLE module_resources (
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (module_id, resource_id)
);

-- =============================================
-- 7. ENROLLMENTS (alumno ↔ curso)
-- =============================================
CREATE TABLE enrollments (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

-- =============================================
-- 8. FAVORITES
-- =============================================
CREATE TABLE favorites (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, resource_id)
);

-- =============================================
-- 9. PROGRESS (por módulo, no por recurso)
-- =============================================
CREATE TABLE progress (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, module_id)
);

-- =============================================
-- 10. ANNOUNCEMENTS (novedades)
-- =============================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL DEFAULT 'new_resource'
    CHECK (type IN ('new_resource', 'update', 'announcement')),
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_tags ON resources USING GIN(tags);
CREATE UNIQUE INDEX idx_resources_storage_path ON resources(storage_provider, storage_path);
CREATE INDEX idx_resources_search ON resources
  USING GIN(to_tsvector('spanish', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_module_resources_module ON module_resources(module_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_modules_course ON modules(course_id);

-- =============================================
-- FUNCIÓN: verificar acceso a recurso
-- =============================================
CREATE OR REPLACE FUNCTION user_can_access_resource(
  p_user_id UUID,
  p_resource_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM resources WHERE id = p_resource_id AND is_published = true) THEN
    RETURN false;
  END IF;

  -- Si el recurso no es restringido, acceso libre
  IF NOT (SELECT is_restricted FROM resources WHERE id = p_resource_id) THEN
    RETURN true;
  END IF;

  -- Si es restringido, verificar enrollment en algún curso que contenga el recurso
  RETURN EXISTS (
    SELECT 1
    FROM enrollments e
    JOIN modules m ON m.course_id = e.course_id
    JOIN module_resources mr ON mr.module_id = m.id
    WHERE e.user_id = p_user_id
      AND mr.resource_id = p_resource_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGER: Create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    -- Si es el correo del admin, se le asigna rol admin por defecto
    CASE WHEN new.email = 'tu-email-admin@ejemplo.com' THEN 'admin' ELSE 'student' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger first in case it exists to avoid errors on multiple runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Profiles: usuario puede leer su propio perfil. Admin puede leer todos.
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Courses: todos pueden leer los cursos publicados. Admin puede leer todos y modificar.
CREATE POLICY "Everyone can view published courses" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access courses" ON courses USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Modules: todos pueden ver los módulos.
CREATE POLICY "Everyone can view modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Admin full access modules" ON modules USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Categories: todos pueden verlas.
CREATE POLICY "Everyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin full access categories" ON categories USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Resources: los alumnos solo leen recursos publicados a los que tienen acceso.
CREATE POLICY "Users can view accessible resources" ON resources
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND is_published = true
    AND (
      is_restricted = false
      OR user_can_access_resource(auth.uid(), id)
    )
  );
CREATE POLICY "Admin full access resources" ON resources USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Module_resources: lectura libre.
CREATE POLICY "Everyone can view module_resources" ON module_resources FOR SELECT USING (true);
CREATE POLICY "Admin full access module_resources" ON module_resources USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Enrollments: usuario puede ver las suyas.
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin full access enrollments" ON enrollments USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Favorites: usuario puede gestionar las suyas.
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Progress: usuario puede gestionar el suyo.
CREATE POLICY "Users can view own progress" ON progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON progress FOR ALL USING (auth.uid() = user_id);

-- Announcements: todos pueden leer.
CREATE POLICY "Everyone can view announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Admin full access announcements" ON announcements USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- SEED DATA
-- =============================================
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Plantillas', 'plantillas', 'Templates y proyectos completos', 'layout-template', 1),
('Presets', 'presets', 'Presets para sintes y efectos', 'sliders', 2),
('Samples', 'samples', 'Librerías de percusión y fx', 'drum', 3),
('Plugins', 'plugins', 'Instrumentos virtuales y efectos', 'plug', 4),
('PDFs', 'pdfs', 'Guías teóricas y manuales', 'file-text', 5),
('Videos', 'videos', 'Tutoriales cortos y tips', 'video', 6),
('Cheatsheets', 'cheatsheets', 'Hojas de referencia rápida', 'brain-circuit', 7),
('Desafíos', 'desafios', 'Retos de producción', 'target', 8)
ON CONFLICT (slug) DO NOTHING;
