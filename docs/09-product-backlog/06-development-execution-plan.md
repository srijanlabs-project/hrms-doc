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

# 2. Current State (updated 2026-07-20)

Done:

- Repo hygiene, tech-stack ADR, template registry reconciliation
- `app/` monorepo: React 18 + Vite + Tailwind v4 web, NestJS API, both building and wired end to end
- Design tokens from the boards; app shell (top bar, sidebar, footer) matching board T-001
- T-001 My Staffsy page faithful to the board (placeholder data)
- AI brand: Ridz across all touchpoints
- **Phase 1 complete**: Postgres RLS tenancy (tenants + legal_entities), PrismaService.withTenant(), request-context middleware, canonical error envelope, first tenant-scoped API (org/legal-entity, controller/service/repository split), seed + rls-check scripts, ESLint max-lines enforcement. RLS isolation proven both at the DB layer (rls-check script) and over real HTTP (403 tenant-boundary, 422 validation, 201 create, 409 conflict, tenant-scoped 200s all verified against the running API)
- **Phase 2 complete (proving slice)**: Department (org module) and Employee (people module) built against their sub-module specs, both RLS-protected. T-003 Enterprise Workbench (directory: filters, table, quick-preview drawer, add-employee form) and T-004 360° Workspace (profile: header, tabs, About, honestly-placeholder KPIs for modules that don't exist yet) built from the boards and wired to live data end to end — create, list, filter, duplicate-conflict, and cross-tenant isolation all verified via curl and in the browser. Two documented simplifications: the create form is single-step (T-005's full stepper deferred) and the pages run inside the existing employee-facing shell rather than a dedicated WS-03 HR Workspace shell (T-003's own Data Management nav deferred to when that template is built)
- **Phase 3 complete (RBAC v1)**: OTP-only login (no passwords) — `OtpChallenge` table behind an `OtpProvider` interface, `StaticDevOtpProvider` returning a fixed dev code so the full flow is testable with no email/SMS gateway; DB-backed revocable sessions + JWT cookie; User/Session/OtpChallenge models under RLS; AuthGuard + RolesGuard wired globally; four seeded roles (org_admin, hr_ops, manager, employee — via seeded users, not yet a self-serve admin UI). Closed a real security gap in the process: Phase 1/2 trusted a client-supplied `X-Tenant-Code` header for every request; AuthGuard now overrides tenant scope with the verified session's tenantId, so a spoofed header can no longer widen access (proven with a live test: a valid acme session sending `X-Tenant-Code: globex` still only sees acme data). Verified end to end: OTP request for real vs. nonexistent accounts returns an identical response (no enumeration), wrong code → generic 401, correct code → 200 + working cookie, wrong role → 403, logout → session revoked and subsequent reuse → 401. Login page has no template board (checked the full registry, genuinely not there) — built from tokens.
- **Phase 4 complete (Leave, first workflow vertical)**: LeavePolicy/LeaveRequest/Notification models under RLS. Balance is deliberately live-computed (pro-rata by months elapsed since joining, minus approved-request days for the current calendar year) rather than a persisted ledger updated by a BullMQ job — no queue infrastructure exists yet (same Docker gap noted in the ADR), and the live calculation is real math against real data, just not queue-backed. Single-level approval only (requestor's direct manager, resolved via Employee.managerId), with org_admin/hr_ops override. Built from three boards: Apply Leave (T-005, single-step, real balance rail), Approvals (T-007, queue + decision panel, real KPI counts), Time Off Calendar (T-008, month grid of own leave). In-app notifications on submit and decision, wired to a real bell dropdown with unread count. T-001's Leave Balance KPI and greeting name are now live. Role-aware nav: the Team/Approvals section only renders for manager/hr_ops/org_admin — a first, partial close of the Phase 3 permission-aware-nav deferral (still only this one item). Caught and fixed a real regression during this phase: the OTP refactor had silently dropped `AuthModule`'s `exports` array, which nothing caught until `LeaveModule` became the first cross-module consumer of `AuthRepository` — surfaced immediately by the "always start the server and verify" discipline, not by typecheck. Verified end to end through the actual browser UI, not just curl: employee applies (T-005) → manager sees it in the approval queue with correct KPI counts (T-007) → approves → balance decrements live → notification bell shows both the submission and decision events → employee's hub and T-001 KPI reflect the new balance. RLS re-verified (18/18) after the new tables.

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

# 4. Phase 2 — Org & People Core (the proving slice) ✅ Done

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

## 4.1 Deferred from Phase 2, tracked for a future People Core pass

Personal-information is its own sub-module by spec design (`02-personal-information.md`), separate from the employee-master core built above — not a Phase 2 gap, a deliberate boundary.

| Item | Spec status | Notes |
|---|---|---|
| DOB, marital/marriage status, dependents (incl. kids, parents as dependents), address, emergency contacts | Spec'd — `02-personal-information.md`, `DTO-EMP-DEP-001` | Ready to build against; not started |
| Certificates | Spec'd, split across two modules | Professional certs: `12-learning-and-development/02-certifications.md`. Certificate files: `14-employee-documents.md` (generic document repository) |
| Parent details (father's/mother's name) | Not explicit | Inferred to reuse the dependents model (`relationship_type = parent`); needs spec confirmation before building |
| Hobbies, sports, personal awards/recognitions | **Not in the spec library at all** | Needs a spec addition (personal-information or employee-experience module) before this can be built with the same discipline as everything else |

This becomes its own People Core pass once Phase 3 (Identity & Access) lands, since several of these fields are self-service-editable with approval workflows that need real auth/roles to be meaningful.

# 5. Phase 3 — Identity & Access ✅ Done (RBAC v1; SSO deferred)

| Deliverable | Spec | Status |
|---|---|---|
| OTP-only login (request/verify/logout/session), real revocable sessions; two-step login flow in web | `08-.../03-identity-and-access/01-authentication`, `03-mfa` (challenge shape) | Done — passwordless, no `passwordHash` required |
| Dev OTP delivery behind an `OtpProvider` interface (fixed code, no real gateway) | — | Done — one-file swap-in before UAT, see ADR §7 |
| Role model: org_admin, hr_ops, manager, employee (RBAC v1) | Doc 17, appendix 38 | Done — plain string roles, not the governed role/permission catalog (04-roles.md, 05-permissions.md) |
| API route guards (AuthGuard + RolesGuard) | Appendix 10 | Done |
| Real SMS/email OTP delivery for UAT | `03-mfa` §3 channel list | **Deferred** — explicitly a post-development task per user direction; swap `OtpProvider`'s implementation only |
| Keycloak (OIDC) SSO/MFA/federation | `08-.../02-sso`, `03-mfa` | **Deferred** — blocked on Docker/hosted IdP availability; see ADR §7 revisit trigger. OTP auth is the spec-sanctioned interim path, not a replacement |
| Permission-aware nav (sidebar items conditionally shown by role) | Appendix 10 | **Deferred** — nav is currently role-blind; only gates API writes, not nav visibility |
| Audit-event capture on auth and people mutations | Doc 11 | **Deferred** — no audit log yet; login/logout/mutation events aren't persisted. Next-highest-value hardening after this phase |

Done when: role-scoped users see role-scoped API access — met. UI-level nav gating and audit trail are explicitly carried forward, not silently dropped.

# 6. Phase 4 — Leave (first workflow vertical) ✅ Done

| Deliverable | Spec | Template board | Status |
|---|---|---|---|
| Leave policy + live balance model | `08-.../08-leave-management/01-leave-policies` | — | Done — 3 fixed leave types (Annual/Casual/Sick), no versioning/applicability matrix |
| Apply-leave flow | Appendix 18, 22 | Smart Form (T-005) | Done — single-step, not the board's 3-step stepper |
| Single-level approval + task inbox | `08-.../08-leave-management/03-leave-approval` | Approval Workspace (T-007) | Done — direct-manager-only routing, org_admin/hr_ops override |
| Leave calendar view | — | Calendar & Attendance (T-008) | Done — leave-only month grid |
| Notifications v1 (in-app) | Appendix 3, 16 | — | Done — submit + decision events, bell dropdown with unread count |
| Accrual as a persisted ledger + BullMQ job | `08-.../08-leave-management/02-leave-accrual` | — | **Deferred** — balance is live-computed instead (see current-state note); revisit once queue infrastructure exists |
| Multi-level/conditional approval chains, delegation, escalation, team-overlap visibility | `03-leave-approval` §3 | — | **Deferred** — single-level only |
| Policy versioning, publish/simulation, carry-forward, encashment | `01-leave-policies` | — | **Deferred** — fixed flat entitlement only |

Done when: employee applies → manager approves → balance decrements → both see status; T-001 leave KPI is live. **Met — verified through the actual browser UI**, not just curl.

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
