---
id: HRMS-XCUT-16
title: Number Series Runtime and Issuance Controls
document: 16-number-series-runtime-and-issuance-controls.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the runtime behavior for tenant-scoped business identifiers such as employee codes, requisition numbers, case numbers, and document references.

# 2. Scope

This standard applies to:

- sequence definition
- reservation and issuance
- preview and formatting
- concurrency control
- gap policy
- rollback and cancellation behavior

# 3. Series Definition Model

Each series should define:

- owning module
- tenant scope
- optional legal-entity or business-unit scope
- prefix and suffix rules
- date tokens
- counter width
- reset cadence
- gap policy

# 4. Reservation and Issuance Rules

Modes:

- preview only
- reserve pending commit
- immediate issue

Rules:

- preview does not consume final number unless policy explicitly allows soft reservation
- reserve must expire or convert to issue explicitly
- issued values must never be duplicated

# 5. Concurrency Controls

- issuance must be atomic
- hot series should support contention-safe locking or partitioning
- retries after timeout must not create duplicate issued numbers

# 6. Gap Policies

Supported models:

- gaps allowed
- gaps minimized
- gaps prohibited except governed void register

If a reserved number is abandoned under a no-gap policy, the system must record void or cancellation reason rather than silently skipping.

# 7. Rollback and Correction

- once externally referenced, issued numbers should not be reused
- correction should create supersession or cancellation evidence instead of renumbering in place unless governed policy explicitly allows

# 8. APIs

- `POST /api/v1/platform/number-series/preview`
- `POST /api/v1/platform/number-series/reserve`
- `POST /api/v1/platform/number-series/issue`
- `POST /api/v1/platform/number-series/reservations/{reservationId}/cancel`

# 9. Test Expectations

- concurrent issuance unique
- expired reservation released per policy
- no-gap policy records voided number
- tenant A and tenant B sequences isolated
- legal-entity scoped series resolves correct counter

