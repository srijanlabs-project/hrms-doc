---
id: HRMS-APP-22
title: Screen-wise Validation Checklist for UI UX and QA
document: 22-screen-wise-validation-checklist-ui-ux-qa.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix translates the canonical validation rules into screen-by-screen implementation and test checklists for design, frontend engineering, backend engineering, and QA.

# 2. Checklist Format

Each screen below captures:

- UI validation expectations
- UX safety expectations
- API or state expectations
- QA must-test focus

# 3. Screen Checklists

## 3.1 `SCR-E02-002` Personal Information Form

- UI: trim and normalize names before save preview, block invalid date combinations, prevent invalid leap-day entry, show inline field error next to DOB and marriage-date fields.
- UX: explain why marriage date or DOB is blocked, never silently auto-correct dates, show policy-aware age messaging.
- API: save must enforce `VAL-001` to `VAL-016`, `VAL-041`, and `VAL-043` server-side.
- QA: test underage marriage, non-leap-year `29-Feb`, future DOB, duplicate submit, and stale tab resubmit.

## 3.2 `SCR-E02-003` Contact and OTP Verification Panel

- UI: mobile change stays visibly pending until OTP success, postal and address validations react to selected country, emergency-contact phone uses same normalization model.
- UX: clearly separate active mobile from pending mobile, show resend cooldown and expiry, show timezone-sensitive cutoffs where relevant.
- API: enforce `VAL-005`, `VAL-006`, `VAL-007`, `VAL-008`, `VAL-027`, `VAL-028`, `VAL-029`, `VAL-042`, and `VAL-043`.
- QA: test OTP expiry, replay, double-click verify, country change after postal entry, and duplicate personal email behavior.

## 3.3 `SCR-E02-004` National Identity Form

- UI: mask highly restricted identifiers appropriately, show country-aware examples, prevent impossible issue and expiry combinations.
- UX: explain privacy handling for Aadhaar or passport data and show why a document is expired or inactive.
- API: enforce `VAL-020` to `VAL-024`, `VAL-034`, `VAL-038`, and `VAL-046`.
- QA: test PAN case normalization, Aadhaar checksum toggle, expired passport active-state attempt, and cross-tenant ID lookup denial.

## 3.4 `SCR-E02-005` Dependents and Family Form

- UI: relationship list must be closed enum driven, sibling-gap or plausibility warnings must identify the conflicting rows, exception context must be capturable.
- UX: do not shame unusual family structures; show governed exception path for adoption, same birth, surrogate, or corrected history.
- API: enforce `VAL-017`, `VAL-018`, `VAL-019`, `VAL-034`, `VAL-043`, and `VAL-044`.
- QA: test twins, adopted child, biological child under seven-month gap, self-dependent invalid reference, and two users editing same dependent set.

## 3.5 `SCR-E02-006` Bank and Tax Maintenance Screen

- UI: mask bank numbers, show country-aware routing help, show payroll cutoff warning before submit, keep split-payout total visible.
- UX: explain whether a bank change affects current payroll or next cycle, show maker-checker status clearly.
- API: enforce `VAL-030` to `VAL-033`, `VAL-037`, `VAL-042`, `VAL-043`, and `VAL-048`.
- QA: test double-click bank submit, invalid IFSC or SWIFT, oversize proof upload, and concurrent approval conflict.

## 3.6 `SCR-E02-007` Employee Master Workbench

- UI: inactive or soft-deleted records must be visually distinct and excluded from active selectors by default, status actions must derive from allowed transitions only.
- UX: show why an action is unavailable, show stale-record warning after another actor updates state, highlight login disablement for exited users.
- API: enforce `VAL-034`, `VAL-035`, `VAL-036`, `VAL-041`, `VAL-045`, `VAL-046`, and `VAL-047`.
- QA: test self-manager block, exited employee login state, soft-deleted search exclusion, and stale transition after another admin action.

## 3.7 `SCR-E02-008` Document Verification Queue

- UI: show file-size and MIME restrictions before upload, show blocked versus warning evidence issues separately, never preview restricted documents without privilege.
- UX: make document-expiry and rejection reasons understandable and auditable.
- API: enforce `VAL-024`, `VAL-038`, `VAL-048`, and `VAL-046`.
- QA: test invalid MIME, oversize upload, expired evidence document, and cross-tenant document access denial.

## 3.8 `W0-SCR-026` Bulk Import Wizard and Validation Workbench

- UI: enforce exact header matching, show preview status per row, allow filtered defect review by severity, and block commit while blocking rows remain.
- UX: user must understand source row, target field, rule reference, and suggested fix without reading logs.
- API: enforce `VAL-035`, `VAL-039`, `VAL-046`, `VAL-047`, and `VAL-049`.
- QA: test missing header, wrong-case header, duplicate employee code in same batch, row-order dependency issues, and commit attempt before preview.

## 3.9 `W0-SCR-027` Migration Mapping and Reconciliation Workspace

- UI: show source-to-canonical mapping explicitly and surface tenant boundary, timezone, and identity-key assumptions.
- UX: highlight when a source field maps to a high-risk canonical field or when no safe mapping exists.
- API: enforce `VAL-042`, `VAL-046`, `VAL-047`, and `VAL-049`.
- QA: test source key collision, global-versus-org identity confusion, and wrong-tenant reconciliation attempt.

## 3.10 `W0-SCR-028` Validation Command Center

- UI: show rule trend counts, top blocking rules, stale-approval conflicts, and preview-versus-commit readiness clearly.
- UX: business users should be able to understand what is blocked, why, and who owns the next action.
- API: aggregate outcomes from `VAL-039`, `VAL-040`, `VAL-043`, `VAL-044`, `VAL-045`, and `VAL-049`.
- QA: test duplicate-command telemetry, timezone-boundary defects, soft-delete leakage alerts, and import-go-live signoff gating.

# 4. Immediate Follow-On Use

This appendix should drive:

- UI acceptance criteria
- frontend validation implementation
- QA negative and edge-case regression packs
- design review checklists before wireframing and development
