# Plan de refinamiento UI/UX premium

Estado: propuesta de implementación incremental

Producto: Nautic Campus

Base visual obligatoria: Nautic v3

## 1. Objetivo y alcance

Elevar la percepción de calidad de Nautic Campus sin rediseñar su arquitectura ni cambiar sus contratos de producto. En este plan, “premium” significa:

- jerarquía clara y contenido fácil de escanear;
- controles confiables, accesibles y con respuesta inmediata;
- una gramática visual consistente entre acceso, campus y administración;
- superficies oscuras sólidas, hairlines finas y coral `#ff6213` como única firma de marca;
- movimiento breve y funcional, sin glow, glassmorphism ni decoraciones que compitan con el contenido;
- comportamiento estable desde móvil hasta escritorio.

El alcance cubre las superficies de autenticación, navegación, Academia, recursos, software, cursos, materiales de clase, favoritos, progreso, novedades, configuración y administración. No incluye cambios de stack, modelo de datos, RBAC, rutas públicas, APIs de almacenamiento ni dependencias nuevas.

## 2. Evidencia de partida

### Objetivo auditado

Implementación local de Nautic Campus en Next.js 16.3, React 19, Tailwind CSS 4 y componentes Base UI/shadcn.

### Evidencia disponible

- `source`: rutas, layouts, componentes, acciones y tokens bajo `src/`.
- `browser`: DOM renderizado de `/login` en el servidor local.
- `screenshot`: acceso en viewport de escritorio y en `390 × 844`.
- `automated`: TypeScript, ESLint y cálculo local de contraste de los tokens principales.

### Comprobaciones ejecutadas

- revisión del árbol de rutas y de los componentes compartidos;
- revisión de `src/app/globals.css` y del contrato Nautic v3;
- revisión de navegación, búsqueda, estados, cursos, progreso y superficies administrativas;
- servidor local con `npm run dev`;
- inspección del acceso en escritorio y móvil;
- `npm run typecheck`;
- `npm run lint`;
- cálculo WCAG de combinaciones de color relevantes.

### Comprobaciones no disponibles

- Las rutas protegidas no pudieron inspeccionarse renderizadas porque el navegador local no tenía una sesión autenticada.
- No hay configuración de Playwright, axe o Lighthouse en el proyecto; no se atribuyen resultados a esas herramientas.
- No existen pruebas visuales o snapshots previos contra los que comparar regresiones.

### Privacidad

Toda la revisión fue local. No se enviaron código, capturas, credenciales ni datos del producto a servicios externos.

## 3. Dirección recomendada: Nautic Studio Precision

La dirección existente es válida y debe refinarse, no reemplazarse. El producto debe sentirse como una herramienta profesional de estudio: preciso, silencioso, técnico y centrado en el material de audio.

### Principios ejecutables

1. **Contenido antes que atmósfera.** Portadas, títulos, versiones, formatos y acciones deben dominar la lectura; el fondo solo crea profundidad.
2. **Una acción primaria por contexto.** Coral para foco, selección y acción principal; estados de sistema pueden usar colores semánticos, sin convertirse en colores de marca.
3. **Superficies sólidas.** `background → surface → surface-elevated → surface-input`; el blur queda limitado a overlays y menús flotantes.
4. **Tipografía con roles estables.** Space Grotesk para títulos, Plus Jakarta Sans para interfaz y JetBrains Mono solo para versiones, tamaños o valores técnicos.
5. **Densidad operativa media.** El campus debe ser cómodo; administración puede ser más densa, pero no debe recurrir a texto de 9–10 px para sostener la jerarquía.
6. **Movimiento como feedback.** Duraciones de 120–220 ms para controles y hasta 400 ms para entrada de página; sin rotaciones decorativas, pulsos permanentes o saltos de tarjetas.
7. **Verdad de producto.** Ningún control debe parecer disponible si no ejecuta una acción real y ningún indicador debe simular progreso que no se conserva.

### Elementos que se preservan

- paleta ink + coral y tipografías actuales;
- arquitectura App Router, Server Components y Server Actions;
- navegación por Academia/categorías y búsqueda global con `⌘K`;
- RBAC y selector de vista administrador/alumno;
- catálogo unificado de recursos y software;
- componentes Base UI existentes cuando su comportamiento ya es correcto.

## 4. Matriz de hallazgos

| Severidad | Hallazgo | Evidencia | Impacto | Corrección prevista | Verificación |
| :-- | :-- | :-- | :-- | :-- | :-- |
| P1 | Contraste insuficiente en acciones y texto oscuro heredado | `automated`, `source` | Texto normal blanco sobre coral 500 da `3.00:1`; `ink-500` sobre `surface` da `2.80:1` e `ink-900` sobre `surface` da `1.08:1`. Hay candidatos en 15 archivos del campus. | Usar foreground ink sobre coral 500 o coral 700 con blanco; migrar texto secundario a tokens con ≥ `4.5:1`; retirar `sand-*` y `text-ink-900` de superficies oscuras. | Matriz de contraste + inspección en navegador de cada estado. |
| P1 | La búsqueda global construye destinos que no corresponden con las rutas reales | `source` | Recursos apuntan a `/academy/{categoría}/{recurso}` aunque no existe esa ruta; software apunta a `/software/{slug}` sin fabricante. | Corregir el contrato de `/api/search` y reutilizar los href canónicos ya definidos por la biblioteca. | Buscar un curso, recurso y producto; cada resultado debe abrir una ruta 200 válida. |
| P1 | Progreso y finalización comunican un estado que no se conserva | `source` | El curso cambia `completed` solo en estado React y `/progress` muestra ceros calculados localmente; se pierde confianza. | Dentro del alcance UI, ocultar o marcar claramente la función como no persistente. La persistencia real requiere un trabajo de producto/datos separado. | Recargar después de una interacción y comprobar que la UI no promete conservación inexistente. |
| P1 | Hay acciones administrativas visualmente activas sin implementación | `source` | “Publicar anuncio” y eliminar anuncio no tienen handler; parecen operativas. | Ocultar o mostrar como no disponibles hasta que exista la acción real. No simular éxito. | Inventario de controles habilitados: todos deben producir un resultado verificable. |
| P1 | Interacciones críticas no son plenamente operables con teclado | `source` | El encabezado de módulo usa un `div` con `onClick`; el dock elimina el outline; existen botones solo con icono sin nombre accesible. | Usar `button`, `aria-expanded`, `aria-controls`, `aria-current`, labels accesibles y foco visible. | Recorrido completo solo con teclado y snapshot del árbol accesible. |
| P2 | El dock móvil está sobrecargado y depende de scroll horizontal | `source` | Inicio, búsqueda, categorías dinámicas, favoritos y menú compiten en una banda estrecha; el destino “Menú” puede quedar fuera de vista. | Fijar cinco destinos estables y mover categorías al menú/Academia. Mantener el concepto de dock sin reconstruir el shell. | Sin overflow a 320, 360 y 390 px; todos los destinos principales visibles y ≥ 44 px. |
| P2 | No existen estados de ruta `loading`, `error` o `not-found` | `source` | Las rutas dinámicas y `force-dynamic` pueden parecer bloqueadas o caer en fallbacks genéricos. | Añadir límites de estado del App Router en el grupo campus y en rutas dinámicas críticas. | Navegación lenta simulada, error recuperable y slug inexistente con UI Nautic. |
| P2 | El sistema visual tiene implementaciones paralelas y tokens incompletos | `source` | Conviven `Card`, `NauticCard`, `.glass-card`, formularios ad hoc y componentes de perfil duplicados; `--radius-sm` se usa sin definirse. | Establecer primitivas canónicas y migrar por uso; eliminar código muerto solo después de confirmar que no tiene consumidores. | Cero variables CSS indefinidas; una primitiva por rol; imports sin consumidores eliminados. |
| P2 | La aplicación se aleja de sus propios guardrails Nautic v3 | `source` | Se registraron 34 usos de `glass-card`, 29 de `backdrop-blur`, 20 sombras coral arbitrarias y 95 `transition-all`. | Aplicar un presupuesto de efectos: blur solo en overlays, sin glow coral y transiciones por propiedad. | Búsqueda estática de patrones + revisión visual antes/después. |
| P2 | Texto demasiado pequeño y contraste secundario frágil | `source`, `automated` | Hay 174 candidatos de 9–11 px; `ink-400` sobre `surface` queda en `4.39:1`. | Mínimo 12 px para metadatos legibles y 14 px para texto de tarea; usar un token secundario con margen de contraste. | Contraste AA y zoom del 200 % sin pérdida de contenido o controles. |
| P2 | Faltan estados asíncronos y de error coherentes en búsqueda y formularios | `source` | Algunos flujos solo registran errores en consola o no distinguen vacío, error y reintento. | Definir patrón común `idle/loading/success/error/empty`, con `aria-live` para feedback. | Forzar error y latencia por flujo; nunca dejar el control en estado ambiguo. |
| P3 | Acceso claro y campus oscuro se sienten como productos distintos | `screenshot`, `source` | El login está bien compuesto y responde sin overflow, pero usa la paleta `sand` declarada legacy y una sombra/glow más intensa que v3. | Migrar el acceso a la misma gramática de superficies o documentar explícitamente una variante clara con los mismos tokens y contraste. | Comparativa de acceso y primera pantalla autenticada sin ruptura de marca. |
| P3 | Heroes repetidos y ornamentación desplazan tareas operativas | `source` | Varias páginas repiten banner grande, badge, glow y copy introductorio antes del contenido. | Reservar hero amplio para Academia/inicio; usar page headers compactos en progreso, novedades y administración. | Contenido o acción principal visible en el primer viewport de 768 px de alto. |

## 5. Plan de implementación

Cada fase debe entregarse como un cambio independiente, revisable y reversible. No avanzar al pulido visual de una superficie mientras conserve un P1 funcional o de accesibilidad.

### Fase 1 — Bloqueos de confianza y accesibilidad

**Objetivo:** eliminar problemas que impiden leer, navegar o confiar en la interfaz.

Archivos principales:

- `src/app/globals.css`
- `src/components/ui/button.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/CommandMenu.tsx`
- `src/app/api/search/route.ts`
- `src/app/(campus)/courses/[slug]/CourseDetailClient.tsx`
- `src/app/(campus)/progress/page.tsx`
- `src/app/(campus)/updates/page.tsx`
- `src/app/(campus)/admin/announcements/page.tsx`

Tareas:

1. Cambiar el foreground primario de los controles coral a ink-950 y retirar `text-white` explícito de botones coral, salvo iconos decorativos que cumplan el contraste gráfico.
2. Sustituir en el campus `text-ink-900/700/600/500` y `sand-*` por roles oscuros válidos.
3. Convertir módulos expandibles y controles solo-icono a semántica y etiquetas accesibles.
4. Aumentar áreas táctiles del dock y acciones críticas a un mínimo de `44 × 44` px.
5. Corregir los href de búsqueda con un único generador de rutas canónicas.
6. Retirar o explicitar affordances no funcionales de progreso y anuncios.

Criterios de aceptación:

- contraste WCAG AA para texto normal y estados focus/disabled;
- navegación primaria completa con teclado, sin foco invisible;
- cero resultados de búsqueda que terminen en una ruta inexistente;
- cero controles habilitados sin resultado real;
- ninguna pantalla del campus con texto ink oscuro sobre superficie oscura.

### Fase 2 — Consolidación mínima del sistema Nautic v3

**Objetivo:** crear una base mantenible antes de pulir pantallas.

Archivos principales:

- `src/app/globals.css`
- `src/components/ui/nautic-card.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/library/EmptyState.tsx`

Tareas:

1. Definir roles semánticos de texto, control, superficie, borde, foco, estado y radio; incluir `--radius-sm` o dejar de usarlo.
2. Mantener `NauticCard` como superficie canónica del campus; adaptar `Card` a los mismos tokens o migrar sus consumidores activos.
3. Normalizar variantes de botón, campo, badge, chip, tarjeta, empty state y skeleton.
4. Establecer alturas mínimas: 40 px en controles compactos de escritorio y 44 px en móvil/acciones primarias.
5. Restringir tamaños: cuerpo 14–16 px, metadata 12–13 px y 10–11 px solo para valores técnicos no esenciales.
6. Retirar implementaciones duplicadas o sin uso únicamente después de comprobar imports y comportamiento.

Criterios de aceptación:

- cero variables de diseño indefinidas;
- cero tokens `sand-*` fuera de una variante de auth formalmente documentada;
- una primitiva canónica por rol;
- ningún componente compartido depende de color de página hardcodeado;
- estados hover, focus, active, disabled y loading definidos para cada control.

### Fase 3 — Shell, navegación y estados de ruta

**Objetivo:** hacer que moverse por el campus se sienta inmediato y predecible.

Archivos principales:

- `src/app/(campus)/layout.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/CommandMenu.tsx`
- `src/components/layout/UserAvatarMenu.tsx`
- nuevos límites de estado bajo `src/app/(campus)/`

Tareas:

1. Mantener en móvil cinco destinos estables: Inicio, Academia, Buscar, Favoritos y Menú.
2. Mover categorías, cursos y herramientas administrativas al drawer/Academia para evitar scroll horizontal del dock.
3. Unificar estado activo con forma, texto y `aria-current`, no solo color.
4. Mantener en escritorio marca, breadcrumbs, búsqueda y cuenta; evitar duplicar destinos entre top bar y dock.
5. Añadir a búsqueda estados de carga, error, vacío, reciente y reintento, conservando `⌘K`.
6. Añadir `loading.tsx`, `error.tsx` y `not-found.tsx` con primitivas Nautic. En Next.js 16, priorizar `loading.tsx` en rutas dinámicas para feedback inmediato y prefetch parcial.

Criterios de aceptación:

- cero scroll horizontal del shell entre 320 y 1440 px;
- ruta y destino activo siempre identificables;
- interacción usable con teclado, touch y lector de pantalla;
- navegación dinámica muestra feedback antes de 150 ms si la respuesta todavía no llegó;
- error y 404 ofrecen recuperación clara.

### Fase 4 — Flujos del alumno

**Objetivo:** priorizar descubrimiento, comprensión y descarga del contenido.

Orden de trabajo:

1. **Acceso:** alinear paleta, sombra y feedback del magic link con Nautic v3; conservar la composición y el buen comportamiento móvil actuales.
2. **Academia:** mantener un único hero editorial; aclarar conteos y reducir competencia entre portada, badge y CTA.
3. **Categoría/biblioteca:** unificar búsqueda, filtros, favoritos y cards; hacer visible plataforma, formato, versión y tamaño sin depender del hover.
4. **Software:** mantener color de plataforma solo como semántica secundaria; priorizar nombre, compatibilidad y descarga.
5. **Curso:** convertir módulos en accordion accesible, aclarar descarga y eliminar cualquier promesa de progreso no persistente.
6. **Material de clase:** reforzar fecha, feedback docente y archivos; ofrecer acciones de descarga grandes y consistentes.
7. **Favoritos, novedades y progreso:** usar headers compactos, empty states honestos y contenido por encima de decoración.

Archivos principales:

- `src/app/(auth)/**`
- `src/app/(campus)/academy/**`
- `src/components/campus/CategoryCard.tsx`
- `src/components/library/**`
- `src/components/software/SoftwareCatalog.tsx`
- `src/app/(campus)/software/[manufacturerSlug]/[productSlug]/page.tsx`
- `src/app/(campus)/courses/[slug]/CourseDetailClient.tsx`
- `src/components/campus/ClassMaterial*.tsx`
- `src/app/(campus)/favorites/page.tsx`
- `src/app/(campus)/updates/page.tsx`
- `src/app/(campus)/progress/page.tsx`

Criterios de aceptación:

- el usuario puede localizar y descargar un recurso sin depender de hover;
- los filtros comunican selección y cantidad, y se pueden limpiar;
- los empty states explican qué ocurrió y qué acción sigue;
- la información esencial cabe en el primer viewport de cada pantalla operativa;
- no hay cambios de layout inesperados al cargar imágenes o resultados.

### Fase 5 — Flujos administrativos

**Objetivo:** hacer la administración más densa, segura y consistente sin rediseñar sus contratos.

Archivos principales:

- `src/app/(campus)/admin/**`
- `src/components/admin/**`
- `src/components/layout/ViewModeSwitcher.tsx`

Tareas:

1. Unificar page header, toolbar, búsqueda, filtros, tabla/lista y estados vacíos.
2. Estandarizar todos los diálogos con título, descripción, campos, validación, error, cancelación y acción principal.
3. Sustituir `window.confirm` por un diálogo accesible para acciones destructivas existentes.
4. Mantener acciones destructivas separadas visualmente y exigir nombre/impacto explícito.
5. Evitar tablas ilegibles en móvil: usar scroll con affordance visible o una vista compacta por registro.
6. Mostrar estado de publicación con texto + icono + color; no con color únicamente.
7. Resolver errores de lint en archivos UI tocados; no silenciar reglas de React ni TypeScript.

Criterios de aceptación:

- ningún diálogo pierde datos sin advertencia o deja el submit en estado incierto;
- crear, editar, publicar y eliminar tienen confirmación y feedback coherentes cuando la acción existe;
- administración es usable a 768, 1024 y 1440 px;
- los archivos modificados pasan ESLint y TypeScript sin excepciones nuevas.

### Fase 6 — Pulido visual y movimiento

**Objetivo:** aplicar refinamiento solo cuando los flujos ya sean correctos.

Tareas:

1. Reemplazar `transition-all` por propiedades concretas.
2. Eliminar glows coral, rotaciones, pulsos permanentes y escalados repetitivos.
3. Limitar blur a command palette, dropdown, sheet y modal; tarjetas y páginas usan superficies sólidas.
4. Permitir como máximo una luz ambiental estática y de baja opacidad en heroes editoriales.
5. Estandarizar radios, hairlines, elevación y ratios de imagen por tipo de contenido.
6. Mantener `prefers-reduced-motion` y evitar que la animación retrase información o interacción.
7. Revisar copy, mayúsculas, etiquetas y nomenclatura para un tono directo y técnico.

Criterios de aceptación:

- no queda glow como indicador de jerarquía;
- hover no desplaza contenido ni es requisito para entender una acción;
- animaciones de control entre 120–220 ms y entradas de página ≤ 400 ms;
- reduced motion conserva toda la información y el feedback;
- la jerarquía sigue siendo clara con imágenes desactivadas.

### Fase 7 — Verificación y cierre

Matriz mínima de viewports:

| Contexto | Viewport |
| :-- | :-- |
| Móvil compacto | `320 × 568` |
| Móvil objetivo | `390 × 844` |
| Tablet | `768 × 1024` |
| Laptop | `1024 × 768` |
| Escritorio | `1440 × 900` |

Recorridos obligatorios:

1. solicitar magic link y validar error/éxito;
2. abrir Academia, filtrar una categoría y limpiar filtros;
3. abrir búsqueda global y navegar a curso, recurso y software;
4. marcar/desmarcar favorito y verificar rollback de error;
5. descargar recursos macOS, Windows y material de clase;
6. recorrer un curso solo con teclado;
7. cambiar vista admin/alumno;
8. abrir/cerrar menús y diálogos, incluyendo Escape y retorno de foco;
9. probar vacío, carga, error, no encontrado y contenido parcial;
10. ejecutar flujos administrativos habilitados.

Validaciones técnicas por fase:

```bash
npm run typecheck
npm run lint
npm run build
git diff --check
```

Para archivos tocados, ejecutar además ESLint dirigido antes del lint global. Registrar capturas locales de los viewports anteriores y comparar jerarquía, overflow, foco, estados y contenido; no introducir una dependencia de regresión visual hasta que exista una necesidad técnica acordada.

## 6. Secuencia de entregas

| Entrega | Contenido | Dependencia | Tamaño relativo |
| :-- | :-- | :-- | :-- |
| 1 | Contraste, semántica, targets y rutas de búsqueda | Ninguna | M |
| 2 | Tokens y primitivas Nautic v3 | Entrega 1 | M |
| 3 | Shell, dock, command menu y estados de ruta | Entrega 2 | M |
| 4 | Academia, recursos, software y cursos | Entrega 3 | L |
| 5 | Materiales, favoritos, novedades, progreso y auth | Entrega 3 | M |
| 6 | Administración y diálogos | Entregas 1–3 | L |
| 7 | Movimiento, copy y regresión final | Entregas 4–6 | M |

No mezclar más de una entrega grande en el mismo diff. Cada entrega debe conservar rutas, datos y comportamiento fuera de su superficie.

## 7. Definición de terminado

El refinamiento se considera completo cuando:

- no quedan hallazgos P1 abiertos;
- todo texto y control cumple WCAG AA en sus estados reales;
- todas las acciones habilitadas funcionan y ofrecen feedback;
- navegación, filtros, descarga y formularios se completan con teclado y touch;
- no existe overflow horizontal no intencional en la matriz de viewports;
- no quedan tokens light legacy, variables indefinidas o primitivas visuales paralelas en superficies activas del campus;
- las rutas dinámicas tienen loading, error y not-found coherentes;
- `typecheck`, build y validaciones de archivos tocados pasan;
- el lint global no empeora y cualquier fallo preexistente fuera de alcance queda documentado;
- las capturas antes/después demuestran mejora de jerarquía y consistencia, no solo un cambio de estilo.

## 8. Riesgos y límites

1. **Auditoría visual protegida.** Antes de implementar las fases 3–6, se necesita una sesión local de prueba para capturar el campus y verificar decisiones contra render real.
2. **Progreso persistente.** Hacerlo real implica definir almacenamiento, permisos y mutaciones. Eso excede un refinamiento UI; hasta entonces la interfaz debe ser honesta y no simular persistencia.
3. **Anuncios.** Implementar CRUD requiere acciones de servidor que hoy no existen. El plan solo autoriza retirar o desactivar affordances engañosas; el CRUD debe ser una tarea funcional separada.
4. **Baseline de lint.** El repositorio ya presenta errores y warnings en áreas UI y acciones. Cada fase debe limpiar los archivos que toca sin ampliar el cambio a backend no relacionado.
5. **Capturas de terceros.** Portadas y datos privados deben permanecer en el entorno local; cualquier servicio externo de análisis requeriría autorización explícita.
