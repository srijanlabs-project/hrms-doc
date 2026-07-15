---
id: HRMS-APP-01
title: Glossary and Terminology
document: 01-glossary-and-terminology.md
version: 2.0
status: Draft
---

# 1. Purpose

This appendix provides a seeded glossary of enterprise HRMS, SaaS, security, and implementation terminology used across the documentation library.

# 2. How To Use

- Use these terms as the preferred canonical vocabulary in product, design, engineering, QA, implementation, and support artifacts.
- Prefer these definitions over local synonyms unless a module explicitly requires narrower wording.
- Where a term maps to a reference table, use the linked appendix as the implementation-facing source of truth.

# 3. Seed Glossary

| Term Ref | Term | Definition | Preferred Usage Note | Related Reference |
|---|---|---|---|---|
| `TERM-001` | `Platform Admin` | Provider-side SaaS operator role that manages platform-wide controls, tenant lifecycle, support access, and shared-service governance. | Do not use for customer HR or tenant-business actions. | `docs/11-saas-operating-model/02-admin-hierarchy-and-control-boundaries.md` |
| `TERM-002` | `Org Admin` | Highest customer-owned administrative role inside one tenant. | Preferred user-facing label for customer admin. | `docs/11-saas-operating-model/02-admin-hierarchy-and-control-boundaries.md` |
| `TERM-003` | `Tenant` | Logical customer boundary containing isolated data, configuration, workflows, and audit trails. | Use as the primary SaaS isolation term. | [07-entity-ownership-and-module-reference-matrix.md](D:/HRMS-doc/docs/07-appendices/07-entity-ownership-and-module-reference-matrix.md) |
| `TERM-004` | `Control Plane` | Provider-operated administrative and operational layer for the SaaS platform. | Separate from tenant business plane in UX and APIs. | `docs/11-saas-operating-model/01-saas-first-operating-model.md` |
| `TERM-005` | `Tenant Plane` | Customer-operated administrative and business layer inside a single tenant. | Home for org admin and business personas. | `docs/11-saas-operating-model/01-saas-first-operating-model.md` |
| `TERM-006` | `System of Record` | Canonical service or data domain that owns authoritative creation and maintenance of a business entity. | Use in integration and data-ownership decisions. | [07-entity-ownership-and-module-reference-matrix.md](D:/HRMS-doc/docs/07-appendices/07-entity-ownership-and-module-reference-matrix.md) |
| `TERM-007` | `Canonical Field` | Standard field name and meaning expected across APIs, events, storage, and analytics. | Avoid semantic drift or duplicate aliases. | [12-canonical-field-dictionary-seed.md](D:/HRMS-doc/docs/07-appendices/12-canonical-field-dictionary-seed.md) |
| `TERM-008` | `Contract Ref` | Stable identifier for an API request or response family. | Required before full schema breakdown. | [08-api-registry-and-contract-index.md](D:/HRMS-doc/docs/07-appendices/08-api-registry-and-contract-index.md) |
| `TERM-009` | `Object Ref` | Stable identifier for a major state-bearing business or platform object. | Use in state-transition and error mapping. | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `TERM-010` | `Event Ref` | Stable identifier for a domain event or platform event definition. | Use in event, notification, and message mapping. | [09-event-producer-consumer-matrix.md](D:/HRMS-doc/docs/07-appendices/09-event-producer-consumer-matrix.md) |
| `TERM-011` | `Idempotency` | Ability to safely retry a command without causing duplicate side effects. | Mandatory for high-risk POST and async replay flows. | [08-api-registry-and-contract-index.md](D:/HRMS-doc/docs/07-appendices/08-api-registry-and-contract-index.md) |
| `TERM-012` | `Effective Dating` | Time-bounded validity model using `effective_from` and `effective_to` or equivalent. | Critical for people, org, payroll, and configuration records. | [12-canonical-field-dictionary-seed.md](D:/HRMS-doc/docs/07-appendices/12-canonical-field-dictionary-seed.md) |
| `TERM-013` | `Segregation of Duties` | Control model preventing risky combinations of actions or access from residing with the same actor. | Commonly abbreviated as `SoD`. | `docs/06-cross-cutting-specs/01-permission-role-model.md` |
| `TERM-014` | `Support Session` | Time-bound, audited provider access session into a customer tenant for troubleshooting or support. | Must never be treated as default standing access. | `docs/11-saas-operating-model/04-data-security-privacy-and-trust-model.md` |
| `TERM-015` | `Privacy Classification` | Declared data-sensitivity level used to drive masking, export, AI, and audit behavior. | Prefer the term `privacy classification` over vague `sensitive flag`. | [12-canonical-field-dictionary-seed.md](D:/HRMS-doc/docs/07-appendices/12-canonical-field-dictionary-seed.md) |
| `TERM-016` | `Approval Pending` | State in which a business object awaits one or more formal decisions before progressing. | Use for object state, not generic task presence. | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `TERM-017` | `Replay` | Controlled reprocessing of a previously published event or integration payload. | Must respect idempotency and audit rules. | [09-event-producer-consumer-matrix.md](D:/HRMS-doc/docs/07-appendices/09-event-producer-consumer-matrix.md) |
| `TERM-018` | `Quota` | Contracted or configured platform limit such as storage, API volume, or enabled consumption. | Different from technical throttling implementation detail. | [11-configuration-key-catalog.md](D:/HRMS-doc/docs/07-appendices/11-configuration-key-catalog.md) |
| `TERM-019` | `Message Template` | Parameterized notification or UX message definition keyed for channel, locale, and event context. | Distinct from notification dispatch records. | [16-message-catalog-by-event.md](D:/HRMS-doc/docs/07-appendices/16-message-catalog-by-event.md) |
| `TERM-020` | `KPI Formula` | Explicit definition of how a metric is calculated, filtered, and interpreted. | Required for consistent dashboard and report engineering. | [15-report-and-kpi-formula-catalog.md](D:/HRMS-doc/docs/07-appendices/15-report-and-kpi-formula-catalog.md) |

# 4. Maintenance Rules

- Add new glossary entries only where the term is reused across multiple modules or stakeholder groups.
- If a term becomes implementation-critical, link it to the appropriate appendix or cross-cutting standard.
- Prefer updating existing definitions over creating near-duplicate synonyms.
