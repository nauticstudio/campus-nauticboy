require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Software Library...');

  // 1. Manufacturers
  const { data: refx, error: refxErr } = await supabase
    .from('software_manufacturers')
    .upsert({
      name: 'reFX',
      slug: 'refx',
      logo_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=150&auto=format&fit=crop&q=80',
      description: 'Pioneros en sintetizadores y expansiones de alta calidad para producción electrónica.'
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (refxErr) {
    console.error('Error creating manufacturer (did you run software_schema.sql first?):', refxErr.message);
    return;
  }

  const { data: vengeance } = await supabase
    .from('software_manufacturers')
    .upsert({
      name: 'Vengeance Sound',
      slug: 'vengeance-sound',
      logo_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
      description: 'Creadores de VPS Avenger y algunas de las mejores librerías de la industria.'
    }, { onConflict: 'slug' })
    .select()
    .single();

  const { data: fabfilter } = await supabase
    .from('software_manufacturers')
    .upsert({
      name: 'FabFilter',
      slug: 'fabfilter',
      logo_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80',
      description: 'Estándar de la industria para ecualizadores, compresores y procesamiento de señal.'
    }, { onConflict: 'slug' })
    .select()
    .single();

  // 2. Categories
  const { data: catSynth } = await supabase
    .from('software_categories')
    .upsert({ name: 'Sintetizadores & Samplers', slug: 'synths', icon: 'Cpu' }, { onConflict: 'slug' })
    .select().single();

  const { data: catFx } = await supabase
    .from('software_categories')
    .upsert({ name: 'Efectos & Procesamiento', slug: 'fx', icon: 'Sliders' }, { onConflict: 'slug' })
    .select().single();

  // 3. Products
  // NEXUS 5
  const { data: nexus } = await supabase
    .from('software_products')
    .upsert({
      manufacturer_id: refx.id,
      name: 'Nexus 5',
      slug: 'nexus-5',
      tagline: 'El sintetizador ROMpler definitivo para música electrónica.',
      description: 'Nexus 5 reinventa la producción musical con un motor de audio de última generación, miles de presets listos para usar y una biblioteca de expansiones sin rival.',
      cover_image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      version: '5.2.1',
      compatibility: 'Windows 10/11 (64-bit) | macOS 12+ (Apple Silicon Native)',
      formats: ['VST3', 'AU', 'AAX'],
      is_featured: true
    }, { onConflict: 'slug' })
    .select().single();

  // VPS AVENGER 2
  const { data: avenger } = await supabase
    .from('software_products')
    .upsert({
      manufacturer_id: vengeance.id,
      name: 'VPS Avenger 2',
      slug: 'vps-avenger-2',
      tagline: 'El sintetizador de síntesis híbrida más versátil del planeta.',
      description: 'Con síntesis multisintética, wavetable, granular y multisample, VPS Avenger 2 es la estación de diseño sonoro definitiva.',
      cover_image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
      version: '2.0.4',
      compatibility: 'Windows 10/11 | macOS 11+ (Intel & M1/M2/M3)',
      formats: ['VST3', 'AU', 'AAX'],
      is_featured: true
    }, { onConflict: 'slug' })
    .select().single();

  // PRO-Q 3
  const { data: proq } = await supabase
    .from('software_products')
    .upsert({
      manufacturer_id: fabfilter.id,
      name: 'Pro-Q 3',
      slug: 'pro-q-3',
      tagline: 'El ecualizador quirúrgico de precisión referencia en la industria.',
      description: 'FabFilter Pro-Q 3 ofrece la mejor calidad de sonido posible, ecualización dinámica y un flujo de trabajo rápido e intuitivo.',
      cover_image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      version: '3.24',
      compatibility: 'Windows 10/11 | macOS 10.13+',
      formats: ['VST', 'VST3', 'AU', 'AAX'],
      is_featured: true
    }, { onConflict: 'slug' })
    .select().single();

  // Link categories
  await supabase.from('software_product_categories').upsert([
    { product_id: nexus.id, category_id: catSynth.id },
    { product_id: avenger.id, category_id: catSynth.id },
    { product_id: proq.id, category_id: catFx.id }
  ]);

  // 4. Software Items (Ecosistemas)
  // Items Nexus 5
  await supabase.from('software_items').delete().eq('product_id', nexus.id);
  await supabase.from('software_items').insert([
    {
      product_id: nexus.id,
      title: 'Instalador Windows (v5.2.1)',
      item_type: 'installer_win',
      description: 'Incluye instalador VST3 y AAX de 64 bits para Windows.',
      file_size: '250 MB',
      version: '5.2.1',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_WIN_NEXUS',
      sort_order: 1
    },
    {
      product_id: nexus.id,
      title: 'Instalador macOS (v5.2.1 Apple Silicon Native)',
      item_type: 'installer_mac',
      description: 'Instalador VST3, AU y AAX compatible con M1/M2/M3 e Intel.',
      file_size: '310 MB',
      version: '5.2.1',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_MAC_NEXUS',
      sort_order: 2
    },
    {
      product_id: nexus.id,
      title: 'Nexus 5 Factory Content (Core Library)',
      item_type: 'factory_content',
      description: 'Biblioteca base oficial con más de 4,000 presets de fábrica.',
      file_size: '18.5 GB',
      version: '5.0',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_FACTORY_NEXUS',
      sort_order: 3
    },
    {
      product_id: nexus.id,
      title: 'Hard Techno Vol. 1',
      item_type: 'expansion',
      description: 'Screaming leads, kiks distorsionados y bajos oscuros para Hard Techno.',
      cover_image_url: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=400&auto=format&fit=crop&q=80',
      file_size: '1.2 GB',
      preset_count: 150,
      genre_tag: 'Hard Techno',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_EXP_HT1',
      sort_order: 4
    },
    {
      product_id: nexus.id,
      title: 'Melodic Techno Essentials',
      item_type: 'expansion',
      description: 'Arps hipnóticos, plucks atmosféricos y plads profundos estilo Afterlife.',
      cover_image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
      file_size: '1.5 GB',
      preset_count: 180,
      genre_tag: 'Melodic Techno',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_EXP_MT1',
      sort_order: 5
    },
    {
      product_id: nexus.id,
      title: 'Synthwave & Retrowave',
      item_type: 'expansion',
      description: 'Sonidos analógicos vintage de los 80s rediseñados para producciones modernas.',
      cover_image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
      file_size: '850 MB',
      preset_count: 120,
      genre_tag: 'Synthwave',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_EXP_SW1',
      sort_order: 6
    },
    {
      product_id: nexus.id,
      title: 'Peak Time EDM & Festival',
      item_type: 'expansion',
      description: 'Leads masivos, chords agresivos y drops para los escenarios más grandes.',
      cover_image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
      file_size: '1.8 GB',
      preset_count: 200,
      genre_tag: 'EDM',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_EXP_EDM1',
      sort_order: 7
    }
  ]);

  // Items Avenger 2
  await supabase.from('software_items').delete().eq('product_id', avenger.id);
  await supabase.from('software_items').insert([
    {
      product_id: avenger.id,
      title: 'Instalador Windows (v2.0.4)',
      item_type: 'installer_win',
      description: 'Instalador oficial VPS Avenger 2 para Windows.',
      file_size: '180 MB',
      version: '2.0.4',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_WIN_AVENGER',
      sort_order: 1
    },
    {
      product_id: avenger.id,
      title: 'Instalador macOS (v2.0.4 Universal)',
      item_type: 'installer_mac',
      description: 'Instalador universal macOS VST3 / AU / AAX.',
      file_size: '220 MB',
      version: '2.0.4',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_MAC_AVENGER',
      sort_order: 2
    },
    {
      product_id: avenger.id,
      title: 'Avenger 2 Factory Content',
      item_type: 'factory_content',
      description: 'Contenido base oficial Avenger 2 (Wavetables, Samples, Presets).',
      file_size: '7.4 GB',
      version: '2.0',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_FACTORY_AVENGER',
      sort_order: 3
    },
    {
      product_id: avenger.id,
      title: 'Cyberpunk 2099 Expansion Pack',
      item_type: 'expansion',
      description: 'Sonidos oscuros, agresivos e industriales inspirados en el futuro cyberpunk.',
      cover_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
      file_size: '950 MB',
      preset_count: 140,
      genre_tag: 'Cyberpunk',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_EXP_CYBER',
      sort_order: 4
    }
  ]);

  // Items Pro-Q 3
  await supabase.from('software_items').delete().eq('product_id', proq.id);
  await supabase.from('software_items').insert([
    {
      product_id: proq.id,
      title: 'FabFilter Total Bundle Installer (Win/Mac)',
      item_type: 'installer_win',
      description: 'Instalador completo que incluye Pro-Q 3, Pro-L 2, Pro-C 2 y más.',
      file_size: '95 MB',
      version: '3.24',
      download_url: 'https://drive.google.com/uc?export=download&id=DEMO_FABFILTER',
      sort_order: 1
    }
  ]);

  console.log('Seeding completed successfully!');
}

seed();
