# Staffsy — Enterprise HRMS Application

Product application monorepo for the Staffsy Enterprise HRMS. Specifications live in [`../docs`](../docs); this workspace implements them.

## Structure

```
app/
  apps/
    web/   React 18 + Vite + Tailwind v4 — desktop-first UI built from the Staffsy template boards
    api/   NestJS modular monolith — service boundaries per docs/06-cross-cutting-specs
  packages/  (future: shared contract types, generated OpenAPI client)
```

## Commands

```bash
npm install            # once, from app/
npm run dev:web        # web on http://localhost:5173
npm run dev:api        # api on http://localhost:3000
npm run build          # build all workspaces
```

## Governing references

- Tech stack: `docs/06-cross-cutting-specs/19-technology-stack-decision-record.md`
- Template registry: `docs/10-ui-ux-architecture/screen-ui-designs/cgpt/templates/README.md`
- Build sequence: wave model in `docs/09-product-backlog/02-release-slicing-and-priority-waves.md`
- Design tokens: `apps/web/src/styles/tokens.css` (single source; extracted from the template boards)

## Build strategy

Desktop-first (1440px, 12-column). Responsive grid and breakpoints are in place from day one but mobile layouts are a later phase with dedicated mobile boards.
