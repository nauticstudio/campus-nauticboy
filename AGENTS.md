<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Skills

UI/UX agent skills live in [`skills/`](skills/README.md) (SKILL.md format):

- `skills/ui-craft` — design engineering + anti-slop rules (educlopez/ui-craft, MIT)
- `skills/apple-design` — Apple-HIG-grounded UI/UX review (dickwu/apple-design-skill)
- `skills/tasteful-ui` — taste-first redesign workflow (DonkeyKing01/tasteful-ui-skill, MIT)
- `skills/ux-audit-skill` + `skills/design-critic-skill` — evidence-backed audits & visual critique (sergekostenchuk/ui-ux-agent-skill-system, Apache-2.0; depend on `skills/shared/`)

When a skill's guidance conflicts with the Nautic v3 design system (single coral accent, no glow/glassmorphism/pixel-grids), Nautic v3 takes precedence.
