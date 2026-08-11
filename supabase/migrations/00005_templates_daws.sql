-- Renombre visible: la categoría "Plantillas" pasa a llamarse "Templates".
-- El slug `plantillas` se conserva para no romper rutas (/academy/plantillas)
-- ni los resources ya asociados por category_id.
update public.categories
  set name = 'Templates'
  where slug = 'plantillas';

-- Nueva categoría: DAWs (estaciones de trabajo de audio digital).
insert into public.categories (name, slug, description, icon, sort_order)
values ('DAWs', 'daws', 'Estaciones de trabajo de audio digital', 'audio-lines', 9)
on conflict (slug) do nothing;
