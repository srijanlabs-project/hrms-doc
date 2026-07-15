---
id: HRMS-APP-29
title: Physical Schema DDL and RLS Pack
document: 29-physical-schema-ddl-and-rls-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix converts the database baseline into a physical-schema pack by service, including table ownership, canonical column typing guidance, indexing, partitioning, encryption expectations, and row-level security posture.

# 2. Canonical Column Typing

| Field Class | Recommended Type |
|---|---|
| primary keys | `UUID` |
| tenant key | `UUID` |
| business code | `VARCHAR(64)` |
| status enum | `VARCHAR(32)` or governed enum |
| long notes | `TEXT` |
| money | `DECIMAL(18,2)` |
| percentage | `DECIMAL(7,4)` |
| timestamps | `TIMESTAMPTZ` |
| business dates | `DATE` |
| JSON policy blobs | `JSONB` |

# 3. Service-Owned Physical Schema Matrix

| Service | Core Tables | Partitioning Candidate | RLS Basis |
|---|---|---|---|
| `People Core Service` | `person`, `employee_master`, `employment_assignment`, `employee_identifier`, `employee_bank_account` | none initially; history tables may partition by tenant or year later | `tenant_id` plus worker scope |
| `Leave Service` | `leave_policy`, `leave_policy_version`, `leave_balance_ledger`, `leave_request`, `leave_request_day` | `leave_request` by business year if scale requires | `tenant_id` plus team or HR scope |
| `Payroll Service` | `payroll_run`, `payroll_employee_result`, `payroll_component_result`, `payroll_exception` | payroll result tables by payroll period | `tenant_id` plus payroll group |
| `Workflow Service` | `workflow_definition`, `workflow_instance`, `workflow_task`, `workflow_task_decision`, `workflow_delegation` | `workflow_task_decision` by year if needed | `tenant_id` plus task visibility |
| `Audit Service` | `audit_event`, `audit_export`, `audit_legal_hold` | `audit_event` by month or quarter | `tenant_id` plus privileged investigator scope |
| `File Service` | `file_record`, `file_scan_result`, `file_access_grant` | `file_access_grant` optional; access logs by month | `tenant_id` plus file access scope |
| `Integration Hub Service` | `integration_connector`, `integration_contract_version`, `integration_run`, `integration_message`, `integration_dead_letter` | `integration_message` by month | `tenant_id` plus connector scope |
| `Job Orchestration Service` | `job_definition`, `job_schedule`, `job_run`, `job_attempt`, `job_dead_letter` | `job_run` and `job_attempt` by month | provider or tenant job context |

# 4. Example Physical Table Guidance

## 4.1 `employee_master`

- primary key: `id UUID`
- unique: `tenant_id, employee_code`
- foreign keys: `tenant_id`, `person_id`, `legal_entity_id`
- indexes:
  - `tenant_id, employee_code`
  - `tenant_id, employment_status`
  - `tenant_id, updated_at`

## 4.2 `leave_request`

- primary key: `id UUID`
- unique optional command dedupe index: `tenant_id, action_idempotency_token`
- indexes:
  - `tenant_id, employee_id, business_date`
  - `tenant_id, status_code, business_date`
  - `tenant_id, workflow_instance_id`

## 4.3 `payroll_employee_result`

- primary key: `id UUID`
- unique: `tenant_id, payroll_run_id, employee_id, result_version`
- partition suggestion: payroll period or fiscal year
- encryption and masking required for monetary components

# 5. RLS Policy Posture

## 5.1 Required RLS Example Patterns

- employee self: `tenant_id` plus `employee_id = current_actor_employee_id`
- manager scope: `tenant_id` plus membership in manager projection
- HR scope: `tenant_id` plus authorized org-node coverage
- provider support: explicit support-session token plus tenant binding

## 5.2 RLS Rules

- provider support policies must never be always-on
- RLS should complement service-layer authorization, not replace it
- exports and background jobs must use explicit service or support principals with scoped context

# 6. Encryption and Tokenization

- PAN, Aadhaar, passport, bank account, and UAN should use field-level protection or tokenization
- audit and file metadata must never store clear text secret material
- object-store keys may be opaque but should not embed tenant-sensitive semantics

# 7. Migration and DDL Completion Rule

Each service DDL pack should next include:

- exact table create statements
- exact indexes
- foreign-key policy
- retention or partition statements
- RLS policy statements

