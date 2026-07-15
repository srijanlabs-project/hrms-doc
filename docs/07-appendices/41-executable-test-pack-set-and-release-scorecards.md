---
id: HRMS-APP-41
title: Executable Test Pack Set and Release Scorecards
document: 41-executable-test-pack-set-and-release-scorecards.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the test-pack depth gap by defining module-specific executable pack groups and release-gate scorecards for the highest-risk HRMS areas.

# 2. Critical Module Pack Set

| Pack ID | Module | Pack Focus |
|---|---|---|
| `TPK-001` | People Core | employee create, edit, lifecycle, identifiers, dependents, bank changes |
| `TPK-002` | Leave | request, approval, balance, accrual, edge-date behavior |
| `TPK-003` | Payroll | run creation, validation, processing, exception, finalize |
| `TPK-004` | Workflow | task routing, delegation, stale action, override |
| `TPK-005` | Documents and Files | upload, scan, signed retrieval, evidence, signatures |
| `TPK-006` | Integrations | inbound validation, outbound retry, replay, dead-letter |
| `TPK-007` | Configuration and Security | config publish, rollback, scope resolution, SoD, support session |
| `TPK-008` | Imports | validate, preview, correction, commit, idempotent rerun |

# 3. Release Scorecard Gates

Every release scorecard should include:

- API negative pass rate
- role and scope pass rate
- E2E critical flow pass rate
- import regression outcome
- performance smoke outcome
- security regression outcome
- UAT signoff status
- unresolved critical defect count

# 4. Minimum Release Gate Rule

- no unresolved critical defect in payroll, auth, workflow, file evidence, or tenant isolation areas
- no failed mandatory pack in `TPK-001` to `TPK-008`
- cutover-only features require cutover rehearsal evidence

