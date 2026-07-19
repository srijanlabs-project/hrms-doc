---
id: HRMS-BKL-06
title: Development Execution Plan
document: 06-development-execution-plan.md
version: 1.0
status: Active
---

# 1. Purpose

This is the working development plan for building the Staffsy Enterprise HRMS from the specification library. It sequences the build into phases with explicit deliverables, spec references, and done-criteria. It complements the wave model in `02-release-slicing-and-priority-waves.md` with implementation-level ordering.

Strategy: desktop-first UI from the template boards; mobile follows with dedicated boards. Modular monolith per the tech-stack ADR (`06-cross-cutting-specs/19`). Every screen is built from its template board — never invented.

# 2. Current State (updated 2026-07-19)

Done:

- Repo hygiene, tech-stack ADR, template registry reconciliation
- `app/` monorepo: React 18 + Vite + Tailwind v4 web, NestJS API, both building and wired end to end
- Design tokens from the boards; app shell (top bar, sidebar, footer) matching board T-001
- T-001 My Staffsy page faithful to the board (placeholder data)
- AI brand: Ridz across all touchpoints
- **Phase 1 complete**: Postgres RLS tenancy (tenants + legal_entities), PrismaService.withTenant(), request-context middleware, canonical error envelope, first tenant-scoped API (org/legal-entity, controller/service/repository split), seed + rls-check scripts, ESLint max-lines enforcement. RLS isolation proven both at the DB layer (rls-check script) and over real HTTP (403 tenant-boundary, 422 validation, 201 create, 409 conflict, tenant-scoped 200s all verified against the running API)

# 3. Phase 1 — Data Platform Foundation ✅ Done

Goal: the unretrofittable parts.

| Deliverable | Reference |
|---|---|
| Docker Compose: Postgres 16 + Redis | ADR |
| Prisma setup; migration #1: tenant table + RLS pattern + mandatory-column standard (`tenant_id`, audit columns, soft delete, effective dating) | Appendix 24, 29 |
| Tenant-resolution middleware + request context (`X-Tenant-Code`, `X-Correlation-Id`) | Appendix 23, 28 |
| Canonical error envelope filter + response envelopes | Appendix 17 |
| Seed script: demo tenant | — |

Done when: two tenants seeded; a query with tenant A's context provably cannot read tenant B's rows (automated test).

# 4. Phase 2 — Org & People Core (the proving slice)

Goal: employee system of record end to end.

| Deliverable | Spec | Template board |
|---|---|---|
| Org module: legal entity, department, location, grade CRUD | `08-.../01-organization-management` | Enterprise Workbench (T-003) |
| People module: employee create, list, profile; identifiers, employment details | `08-.../02-people-management/01-employee-master` | T-003 + 360° Workspace (T-004) |
| Authored OpenAPI for both modules; generated typed client for web | Appendix 28, 21, 18 | — |
| Employee directory page (filters, pagination, right drawer) | — | T-003 |
| Employee 360 page (header, tabs, timeline placeholder) | — | T-004 |
| Wire T-001 KPIs/team to real data where available | — | T-001 |

Done when: create employee → appears in directory → open 360 profile → data survives restart → all under RLS.

# 5. Phase 3 — Identity & Access

| Deliverable | Spec |
|---|---|
| Keycloak (Docker) with OIDC; login flow in web | `08-.../03-identity-access` |
| Role model: Employee, Manager, HR Ops, Org Admin (RBAC v1) | Doc 17, appendix 38 |
| Route guards + permission-aware nav (disabled items become role-driven) | Appendix 10 |
| Audit-event capture on auth and people mutations | Doc 11 |

Done when: role-scoped users see role-scoped UI and API access; mutations produce audit rows.

# 6. Phase 4 — Leave (first workflow vertical)

| Deliverable | Spec | Template board |
|---|---|---|
| Leave policy + balance model, accrual job (BullMQ) | `08-.../08-leave-management` | — |
| Apply-leave flow (stepper form with validation) | Appendix 18, 22 | Smart Form (T-005) |
| Workflow engine v1: single-level approval, task inbox | Doc 12 | Approval Workspace (T-007) |
| Leave calendar view | — | Calendar & Attendance (T-008) |
| Notifications v1 (in-app) | Appendix 3, 16 | — |

Done when: employee applies → manager approves → balance decrements → both see status; T-001 leave KPI is live.

# 7. Phase 5 — Attendance & Payroll Control

| Deliverable | Spec | Template board |
|---|---|---|
| Attendance capture (manual/import v1), monthly summary | `08-.../07-workforce-management` | T-008, Attendance workspace board |
| Payroll structures + components; run pipeline: create → freeze inputs → calculate → exceptions → approve → close (worker-executed) | `08-.../09-payroll` | Payroll workspace board, Mass Operations (T-006) |
| Payslip generation + employee payslip view | Doc 13 | T-001, board `pay-scr-*` |
| Statutory v1: PF, ESIC, TDS computation | `08-.../10-statutory-compliance` | Statutory workbench board |

Done when: a monthly run for the demo tenant produces reproducible gross-to-net results with an input snapshot and exception queue; rerun after correction gives identical lineage. Heaviest QA of the program.

# 8. Phase 6 — MVP Completion

Per the MVP boundary in `02-release-slicing-and-priority-waves.md`:

- Recruitment core: requisition → pipeline → offer (Recruitment board, T-005/T-007)
- Onboarding checklist; Manager team dashboard
- Reports v1 (Reports Hub, T-020 board); Org admin dashboard
- Bulk import workbench (T-006) for migration tooling
- Ridz v1: AI-gateway module + Claude API — assistant panel answers from tenant HR data, Ridz Insight cards on dashboards (docs `26-ai-copilot`, appendix 39, 44)

# 9. Cross-Phase Tracks

- **Design track (user):** produce the 7 missing template boards (Configuration Console and Organization Explorer first — needed by Phases 3–4 admin/org screens); standalone Executive Dashboard + AI Workspace exports; then mobile boards for employee-facing flows, sequenced to match build order.
- **Quality track:** RLS isolation tests from Phase 1; API negative tests per appendix 27/41 from Phase 2; payroll golden-file regression suite in Phase 5; CI (GitHub Actions) runs build + typecheck + tests from Phase 1.
- **Docs track:** OpenAPI files and DDL committed per module as built (closing appendices 28/29 incrementally); ADR updated on any stack change.

# 10. Sequencing Rules

1. Never build a screen without its template board; never invent layout.
2. Never ship a module without its OpenAPI contract authored and its RLS tests passing.
3. Workflow, notification, config, and document services are built on first real use case, not speculatively.
4. Mobile work starts only after desktop MVP and with dedicated mobile boards in hand.
5. Ridz features ship only where the underlying module data is live (AI never outpaces source data).

# 11. Indicative Cadence

With a small AI-assisted team working steadily: Phases 1–2 ≈ 2–3 weeks; Phase 3 ≈ 1–2 weeks; Phase 4 ≈ 2–3 weeks; Phase 5 ≈ 4–6 weeks (payroll correctness dominates); Phase 6 ≈ 4–6 weeks. MVP in roughly 3.5–5 months of focused execution. Durations are planning aids, not commitments; payroll and identity phases should not be compressed.
