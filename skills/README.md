# Agent Skills — nautic-campus

Skills de UI/UX para agentes de código (Cline, Claude Code, Codex, Cursor…), en formato `SKILL.md`. Se instalaron el 2026-08-10 para apoyar el sistema de diseño **Nautic v3** (acento coral único `#ff6213`, sin glassmorphism/glow/pixel-grids/anti-slop).

## Skills instaladas

| Skill | Origen | Propósito | Licencia |
|---|---|---|---|
| `ui-craft/` | [educlopez/ui-craft](https://github.com/educlopez/ui-craft) | Design engineering: reglas anti-slop, fase de discovery antes de codar, guías de layout/tipografía/color/motion/a11y, recetas (dashboard, landing, auth) | MIT |
| `apple-design/` | [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill) | Auditoría UI/UX contra Apple HIG generalizada (53 documentos de guía: color, tipografía, layout, a11y, motion, dark mode…) | Derivada de Apple HIG (sin licencia formal) |
| `tasteful-ui/` | [DonkeyKing01/tasteful-ui-skill](https://github.com/DonkeyKing01/tasteful-ui-skill) | Flujo "taste-first": explorar dirección visual → brief de diseño → implementar → verificar; reglas anti-genérico | MIT |
| `ux-audit-skill/` | [sergekostenchuk/ui-ux-agent-skill-system](https://github.com/sergekostenchuk/ui-ux-agent-skill-system) | Auditoría UX respaldada por evidencia: matriz de severidad, rutas WCAG, briefs de refactor, regression checks | Apache-2.0 |
| `design-critic-skill/` | idem | Crítica visual: jerarquía, spacing, tipografía, contraste, anti-slop, briefs de pulido | Apache-2.0 |
| `shared/` | idem | Recursos compartidos de las dos skills anteriores (`privacy-policy.md`, `tool_inventory.json`, contratos de reporting). **No es una skill.** | Apache-2.0 |

## Uso

Cada skill es un directorio con un `SKILL.md` (frontmatter con `name` + `description`) más referencias. Cópiala a la carpeta de skills de tu agente:

```bash
# Claude Code
cp -R skills/ui-craft ~/.claude/skills/ui-craft

# Codex
cp -R skills/tasteful-ui ~/.codex/skills/tasteful-ui

# Cursor / kx: añadir el SKILL.md como regla de proyecto
```

Las skills `ux-audit-skill` y `design-critic-skill` dependen de `../shared/` (rutas relativas ajustadas al extraerlas del repo original); si las mueves, conserva `shared/` al mismo nivel.

## Precedencia con Nautic v3

Estas skills son genéricas. Cuando entren en conflicto con el sistema Nautic v3 (palette coral única, tokens en `src/app/globals.css` y `CLAUDE.md`), **Nautic v3 gana**. En particular, ignorar las guías de glassmorphism/glow (`apple-design/references/hig/liquid-glass.md` queda como referencia solo si el producto lo pide explícitamente).
