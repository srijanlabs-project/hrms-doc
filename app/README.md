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

## Testing (apps/api)

```bash
npm run test --workspace @staffsy/api        # unit + integration + e2e, once
npm run test:watch --workspace @staffsy/api  # watch mode
npm run test:cov --workspace @staffsy/api    # with coverage
```

Runs against your real local Postgres (the same `staffsy` database `npm run
db:seed` populates) — there's no separate test database or mocked Prisma
client, since the RLS suite specifically needs real Postgres RLS policies to
prove tenant isolation against. A few tests write ephemeral rows (a
`test-*`/`e2e-test-*` tenant, a throwaway Department) directly into that
database and don't clean them up — harmless in a local dev DB, but don't
point `DATABASE_URL` at anything you care about keeping pristine.

Coverage (W0·E32, "broader integration coverage" scope): RLS tenant
isolation across 5 tables (`test/rls.integration.spec.ts`), the payroll
gross-to-net calculation engine and leave proration (pure unit tests, no DB:
`src/payroll/calc/payroll-calculator.spec.ts`, `src/leave/prorate.spec.ts`),
and e2e coverage (real HTTP requests via supertest against a fully
bootstrapped Nest app) of auth/OTP session flow, tenant provisioning,
Department CRUD, the leave-request approval state machine, and the
configurable import engine (dry-run/commit/rollback). Not exhaustive across
every module — see `docs/09-product-backlog/06-development-execution-plan.md`
Phase 41 for what's covered and why.

## Governing references

- Tech stack: `docs/06-cross-cutting-specs/19-technology-stack-decision-record.md`
- Template registry: `docs/10-ui-ux-architecture/screen-ui-designs/cgpt/templates/README.md`
- Build sequence: wave model in `docs/09-product-backlog/02-release-slicing-and-priority-waves.md`
- Design tokens: `apps/web/src/styles/tokens.css` (single source; extracted from the template boards)

## Build strategy

Desktop-first (1440px, 12-column). Responsive grid and breakpoints are in place from day one but mobile layouts are a later phase with dedicated mobile boards.
