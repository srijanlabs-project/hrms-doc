---
id: HRMS-DOC-005
title: Enterprise HRMS Pending Checklist
document: 05-pending-checklist.md
version: 1.7
status: Draft
---

# 1. Purpose

This checklist summarizes the current closure status across the Enterprise HRMS documentation repository.

# 2. Status Legend

- `Done` means the topic has a usable repository artifact at the target documentation depth for the current wave.
- `Partial` means the topic exists but still needs deeper implementation detail or broader coverage.
- `Pending` means the topic is not yet documented to the depth required for build execution.

# 3. Priority Legend

- `P0` means architecture-critical and should be closed before major build execution scales.
- `P1` means high-value and should be closed during early implementation waves.
- `P2` means important but can follow once the core execution model is stable.

# 4. Pending Checklist

| Ref | Area | Priority | Status | Current Position | What Is Still Needed |
|---|---|---|---|---|---|
| `PEND-001` | Parent module coverage | `P2` | `Done` | all `33` parent modules exist | maintain only |
| `PEND-002` | Deep sub-module coverage | `P2` | `Done` | all `149` `L3` deep specs exist | maintain only |
| `PEND-003` | SaaS-first operating model | `P2` | `Done` | provider versus tenant boundaries documented | maintain only |
| `PEND-004` | Cross-cutting standards | `P1` | `Done` | permissions, workflow, notifications, API, data, governance, testing covered at baseline | maintain only |
| `PEND-005` | Validation and implementation traceability | `P1` | `Done` | rule, field, API, DTO, screen, and import traceability exists | maintain only |
| `PEND-006` | Error, message, KPI, and state references | `P1` | `Done` | baseline appendix pack exists | maintain only |
| `PEND-007` | Exact workforce import headers and preview model | `P1` | `Done` | core employee, identity, dependent, bank, PF, and document imports defined | maintain only |
| `PEND-008` | Canonical DTO field schemas | `P1` | `Done` | highest-risk DTO catalog created | maintain only |
| `PEND-009` | Screen-wise validation checklist | `P1` | `Done` | core people and import screens covered | maintain only |
| `PEND-010` | Product backlog hierarchy | `P1` | `Done` | initiative, epic, feature-group, story, and task decomposition layers now exist | maintain only |
| `PEND-011` | UI UX information architecture | `P2` | `Done` | architecture, inventory, and quality checklist exist | maintain only |
| `PEND-012` | Full wireframe-ready screen pack | `P1` | `Done` | full grouped wireframe-ready screen pack now exists in UI UX architecture | maintain only |
| `PEND-013` | Pixel-ready wireframes and annotated mockups | `P2` | `Partial` | desktop and mobile pixel-ready annotated mockups now exist for all `30` Wave `0` screens `W0-SCR-001` to `W0-SCR-030`, all `3` shared global screens `GLB-SCR-001` to `GLB-SCR-003`, Wave `1` mock pairs `EMP-SCR-001` to `EMP-SCR-008`, `MGR-SCR-001` to `MGR-SCR-007`, `HRO-SCR-001` to `HRO-SCR-005`, and `PEO-SCR-001` to `PEO-SCR-007`, Wave `2` operations mock pairs `WRK-SCR-001` to `WRK-SCR-004`, `PAY-SCR-001` to `PAY-SCR-006`, `LEV-SCR-001` to `LEV-SCR-003`, `DOC-SCR-001` to `DOC-SCR-002`, plus `AST-SCR-001`, `CTR-SCR-001`, and `HSW-SCR-001`, Wave `3` recruiting mock pairs `REC-SCR-001` to `REC-SCR-006`, the Wave `4` service-workbench mock pair `HLP-SCR-001`, and Wave `5` analytics mock pairs `ANL-SCR-001` to `ANL-SCR-005`, giving a `90`-screen / `180`-asset baseline | conditional-state variants, alternate dense-state packs, and the phase-wise screen-registry expansion backlog listed below for mapped-but-not-yet-counted screen families |
| `PEND-014` | OpenAPI-ready API contracts | `P0` | `Done` | service-wide OpenAPI contract master pack now exists | maintain only |
| `PEND-015` | Database schema and ERD pack | `P0` | `Done` | physical schema, DDL guidance, and RLS pack now exist | maintain only |
| `PEND-016` | Final service topology and deployment model | `P0` | `Done` | topology closure pack now includes governance, release, SLO, and contract depth | maintain only |
| `PEND-017` | Domain service decomposition | `P0` | `Done` | domain ownership and inheritance rules now cover all parent-module areas | maintain only |
| `PEND-018` | Shared platform service standards | `P0` | `Done` | shared service standards now include service-specific API and runtime closure packs | maintain only |
| `PEND-019` | Authorization deepening | `P1` | `Done` | row-scope and permission catalog now exists | maintain only |
| `PEND-020` | Workflow and approval deepening | `P0` | `Done` | workflow object transition and callback pack now exists | maintain only |
| `PEND-021` | Event payload and webhook contracts | `P0` | `Done` | event schema, callback, and consumer test pack now exists | maintain only |
| `PEND-022` | Search architecture | `P1` | `Done` | search implementation pack now exists | maintain only |
| `PEND-023` | Configuration runtime design | `P0` | `Done` | configuration service implementation pack now exists | maintain only |
| `PEND-024` | Number series runtime design | `P1` | `Done` | number-series implementation pack now exists | maintain only |
| `PEND-025` | Localization runtime design | `P1` | `Done` | localization implementation pack now exists | maintain only |
| `PEND-026` | Document and file platform design | `P0` | `Done` | document and file service implementation pack now exists | maintain only |
| `PEND-027` | Queue and background job runtime design | `P0` | `Done` | job orchestration implementation pack now exists | maintain only |
| `PEND-028` | Audit service runtime design | `P0` | `Done` | audit service implementation pack now exists | maintain only |
| `PEND-029` | AI and copilot runtime design | `P1` | `Done` | AI gateway implementation pack now exists | maintain only |
| `PEND-030` | Integration hub runtime design | `P0` | `Done` | integration connector contract and runbook pack now exists | maintain only |
| `PEND-031` | Reports and dashboards full inventory | `P1` | `Done` | reports and dashboards master inventory now exists | maintain only |
| `PEND-032` | Test execution packs | `P1` | `Done` | executable test pack set and release scorecards now exist | maintain only |
| `PEND-033` | Cutover and rollback runbooks | `P1` | `Done` | cutover, rollback, and hypercare runbook pack now exists | maintain only |
| `PEND-034` | Industry solution packs | `P2` | `Done` | dedicated industry solution pack library now exists with master governance and `10` sector implementation packs | maintain only |
| `PEND-035` | Support and operations runbooks | `P1` | `Done` | concrete service runbook library now exists | maintain only |
| `PEND-036` | Shared library catalog for common runtime packages | `P0` | `Done` | service governance pack now includes library release workflow and compatibility policy | maintain only |
| `PEND-037` | Dedicated shared service catalog | `P0` | `Done` | dedicated shared service catalog is now implementation-complete across service packs | maintain only |
| `PEND-038` | Independent build and deployment strategy | `P0` | `Done` | deployment governance and release standards are now documented | maintain only |
| `PEND-039` | Service-to-module dependency matrix | `P0` | `Done` | service dependency and ownership closure packs now exist | maintain only |
| `PEND-040` | Service data ownership and database boundary rules | `P0` | `Done` | service-owned schema and ownership packs now exist | maintain only |

# 5. Recommended Immediate Closure Order

The next highest-value closure sequence should be:

1. `PEND-013` pixel-ready wireframes and annotated mockups
2. maintenance expansion of completed `Done` items as implementation evolves

# 6. `PEND-013` Phase-Wise Screen Expansion Checklist

This checklist tracks the next screen phases for module and sub-module areas that are already mapped in the coverage matrix but are not yet counted in the current `90`-screen mockup registry.

Current expansion audit position:

- `78` module or sub-module coverage rows still reference screen refs outside the current mockup registry
- `85` unique screen refs are still not counted in the current baseline
- this is a registry and mockup-expansion gap, not a screen-mapping gap

| Phase | Screen Families To Add | Module and Sub-Module Coverage To Close | Status |
|---|---|---|---|
| `Phase 6` | `ORG-SCR-001` to `ORG-SCR-004`, `ORG-ADM-001` to `ORG-ADM-004`, `ORG-ADM-007`, `ORG-ADM-008`, `IAM-SCR-001` to `IAM-SCR-004`, `ADM-SCR-004`, `ADM-SCR-007`, `OPS-SCR-001`, `OPS-SCR-002`, `MSS-SCR-003` | `00 Foundation and Platform`: feature flag framework, scheduler, search engine, template engine, number series engine, configuration framework, workflow engine, business rules engine, audit engine. `01 Organization Management`: tenant, company, legal entity, holding company and group company, org structure, geo and workplace structure, reporting structure, cost or profit or project hierarchy, job classification, calendars, policies, branding. `03 Identity and Access`: user accounts, authentication, SSO, MFA, OAuth and federation, roles, permissions, delegation, proxy login, session management, device management. `28 Administration`: templates, number series, branding, localization, system settings, tenant management. `29 Security and Governance`: RBAC, ABAC, access reviews, segregation of duties, data masking, encryption, consent management, audit logs. `30 DevOps and Operations`: monitoring, health checks, logging, background jobs, feature toggles, release management. | `Pending` |
| `Phase 7` | `PRF-SCR-001` to `PRF-SCR-005`, `LRN-SCR-001` to `LRN-SCR-004`, `TAL-SCR-001` to `TAL-SCR-003`, `CMP-SCR-001` to `CMP-SCR-004` | `02 People Management`: contact details and address, passport or visa or driving license, education and experience, certifications or skills or languages, probation and confirmation, promotion or demotion or transfer, deputation and secondment, salary revision, contract renewal. `05 Manager Self Service`: team attendance, team leave, budget approvals, performance reviews, hiring approvals, transfers and promotions. `09 Payroll`: salary structures, pay components, earnings and deductions, loans and advances, variable pay, incentives and bonus. `11 Performance Management`: goal management, OKRs and KPIs, competencies, check-ins, 1:1 meetings, appraisals, 360 feedback, calibration, bell curve, promotions linkage, performance improvement plans. `12 Learning and Development`: LMS, course catalog, learning paths, skill development, certifications, compliance training, assessments, external content integration. `13 Talent Management`: succession planning, career planning, workforce planning linkage, talent reviews, HiPo identification, talent matrix, bench strength. `14 Compensation and Benefits`: compensation planning, salary reviews, merit cycles, bonus planning, incentives, ESOPs, insurance, benefits administration, flexible benefits. | `Pending` |
| `Phase 8` | `ESS-SCR-004` to `ESS-SCR-006`, `TRV-SCR-001` to `TRV-SCR-004`, `XPN-SCR-001` to `XPN-SCR-004` | `04 Employee Self Service`: leave, attendance, travel, claims, payslips, benefits, assets, helpdesk, goals, learning. `16 Travel Management`: travel requests, trip planning, itinerary, booking integration, travel advances, travel expense settlement. `17 Expense Management`: expense claims, per diem, receipts, OCR, approvals, reimbursements, corporate card reconciliation. | `Pending` |
| `Phase 9` | `EXR-SCR-001` to `EXR-SCR-004`, `VWP-SCR-001` to `VWP-SCR-003`, `AST-SCR-002`, `AST-SCR-003`, `HLP-SCR-002`, `HLP-SCR-003` | `15 Employee Experience`: surveys, pulse surveys, recognition, rewards, social feed, communities, events, employee communications, wellness programs. `18 Asset Management`: asset catalog, software licenses, asset maintenance, asset audits. `19 Helpdesk and Case Management`: SLA management, knowledge base, escalations. `21 Visitor and Workplace Management`: visitor registration, gate pass, meeting management, desk booking, room booking, shuttle management, parking, cafeteria. | `Pending` |
| `Phase 10` | `CTR-SCR-002`, `CTR-SCR-003`, `HSW-SCR-002` to `HSW-SCR-004`, `COMMS-SCR-001` to `COMMS-SCR-003`, `DOC-SCR-003`, `DOC-SCR-004` | `00 Foundation and Platform`: notification engine, document generation engine. `20 Contractor and External Workforce`: contractor master, vendor employees, agency management, contracts, compliance, access control. `22 Health Safety and Wellness`: incident reporting, safety audits, risk assessments, PPE management, occupational health, medical checkups, vaccination, emergency response. `23 Communication Platform`: email, SMS, push notifications, WhatsApp, announcements, news, bulletin board, campaigns. `24 Document Management`: digital signatures, OCR, retention policies. | `Pending` |
| `Phase 11` | `STA-SCR-001` to `STA-SCR-004`, `AIC-SCR-001` to `AIC-SCR-005`, `INT-SCR-001` to `INT-SCR-004` | `00 Foundation and Platform`: event bus, integration hub, AI platform. `10 Statutory and Compliance`: PF, ESIC, professional tax, labour welfare fund, gratuity, bonus compliance, minimum wages, shops and establishment, factory compliance, TDS, country-specific compliance, compliance calendar. `25 Analytics and BI`: attrition analytics, predictive analytics, custom reports where AI explainability screens are supporting context. `26 AI and Copilot`: HR copilot, employee copilot, manager copilot, recruiter copilot, payroll copilot, policy assistant, organization insights, natural language querying, attrition prediction, flight risk prediction, skills graph, AI resume matching, AI interview summaries, AI workforce planning. `27 Integration Platform`: REST APIs, GraphQL optional layer, webhooks, event streaming, ERP integration, CRM integration, finance systems integration, identity provider integration, payroll banks integration, biometric devices integration. `29 Security and Governance`: data retention and compliance monitoring where statutory and retention workspaces are supporting screens. | `Pending` |
| `Phase 12` | `WRK-SCR-005`, `TST-SCR-001` to `TST-SCR-004` | `07 Workforce Management`: overtime, comp-off, flexible hours through the missing overtime and comp-off console. `32 Testing and Quality`: test data management, regression testing, performance testing, security testing, accessibility testing, UAT support. | `Pending` |

Working interpretation for this checklist:

- a module or sub-module can already be screen-mapped and still appear here if its mapped screen refs are not yet counted in the production mockup registry
- cross-module supporting screens are intentionally repeated where a single future screen family closes multiple module gaps
- `PEND-013` should not move to `Done` until these phase families and the major conditional-state variants are registered and produced

# 7. Decision Note

The repository has now closed the `P0` and `P1` documentation baseline and depth backlog for the current phase. The only remaining listed gap is the `P2` pixel-ready experience layer.
