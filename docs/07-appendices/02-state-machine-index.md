---
id: HRMS-APP-02
title: State Machine Index
document: 02-state-machine-index.md
version: 2.0
status: Draft
---

# 1. Purpose

This appendix acts as the master index for state-bearing objects across the Enterprise HRMS platform and points readers to the populated transition detail.

# 2. Primary Detailed Reference

Primary source for transition-level implementation detail:

- [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md)

# 3. Object Index

| Object Ref | Business Object | Owning Module | Primary Detail Source | Notes |
|---|---|---|---|---|
| `OBJ-TENANT` | Tenant | Administration / Tenant Management | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | provider and customer lifecycle boundary object |
| `OBJ-EMPLOYEE` | Employee Master | People Management | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | foundational workforce lifecycle object |
| `OBJ-CONTRACTOR` | Contractor Master | Contractor and External Workforce | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | non-employee lifecycle object |
| `OBJ-REQUISITION` | Requisition | Recruitment and ATS | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | core hiring demand object |
| `OBJ-LEAVE` | Leave Request | Leave Management | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | approval-driven transactional object |
| `OBJ-EXIT` | Exit Case | People Management / Exit | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | multi-module offboarding control object |
| `OBJ-PAYRUN` | Payroll Run | Payroll | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | high-risk processing lifecycle object |
| `OBJ-WFDEF` | Workflow Definition | Foundation and Platform / Workflow Engine | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | versioned control-plane object |
| `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | shared runtime orchestration object |
| `OBJ-WFSIGN` | Signature Request | Document Management / Digital Signatures | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) | document execution lifecycle object |

# 4. Usage Rules

- use `Object Ref` values in error catalogs, API contracts, QA negative scenarios, and workflow callback mappings
- extend this index whenever a new business-critical state machine is introduced
- if detailed legal transition edges are missing in the source spec, mark them as inferred until validated
