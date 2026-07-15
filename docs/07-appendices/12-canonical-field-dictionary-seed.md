---
id: HRMS-APP-12
title: Canonical Field Dictionary Seed
document: 12-canonical-field-dictionary-seed.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a seeded canonical field dictionary for the most reused enterprise identifiers and control fields across modules. It is intended to reduce drift in naming, data typing, integration mapping, and analytics lineage.

# 2. Scope Note

This `v1` seed focuses on:

- identity and tenant lineage fields
- organization and worker reference keys
- effective-dating and status fields
- workflow, audit, and integration correlation fields
- high-risk people, identity, dependent, banking, and import-validation fields

This is still not yet the full enterprise field dictionary, but it now includes the critical fields needed to implement the current validation-rule pack.

# 3. Canonical Field Dictionary

| Field Ref | Canonical Field | Entity Context | Type | Required | Privacy Class | Primary Owner | Description | Engineering Notes |
|---|---|---|---|---|---|---|---|---|
| `FLD-001` | `tenant_id` | all tenant-scoped entities | UUID or stable string key | Yes | Internal | platform core | unique tenant identifier | mandatory on almost all business records and events |
| `FLD-002` | `tenant_code` | tenant | string | Yes | Internal | platform core | human-readable tenant code | unique and immutable after activation unless governed |
| `FLD-003` | `person_id` | person, employee, contractor-linked entities | UUID | Yes where human subject exists | Restricted | people core | canonical human identity anchor | should outlive worker-type transitions |
| `FLD-004` | `employee_id` | employee entities | UUID or enterprise code | Yes for employee records | Restricted | people core | unique employee record identifier | do not reuse as global person anchor |
| `FLD-005` | `contractor_id` | contractor entities | UUID or enterprise code | Yes for contractor records | Restricted | external workforce core | unique contractor record identifier | separate from employee identity |
| `FLD-006` | `legal_entity_id` | employment, payroll, requisition, contractor contexts | UUID | Yes where statutory employer applies | Confidential | organization management | employing or contracting legal entity | crucial for payroll and compliance routing |
| `FLD-007` | `business_unit_id` | org-scoped records | UUID | Optional by module | Internal | organization management | business unit reference | analytics and access scoping commonly use this |
| `FLD-008` | `department_id` | org-scoped records | UUID | Optional by module | Internal | organization management | department reference | often part of approvals and reporting |
| `FLD-009` | `location_id` | attendance, travel, compliance, employment contexts | UUID | Optional by module | Internal | organization management | work or regulatory location reference | may drive timezone and country rules |
| `FLD-010` | `manager_worker_id` | reporting and approvals | UUID | Optional | Confidential | organization management | current primary manager reference | matrix relationships should use additional structures |
| `FLD-011` | `employment_status` | employee and employment assignment | enum | Yes | Confidential | people core | current employment lifecycle status | values should map to state machine index later |
| `FLD-012` | `worker_type` | people and external workforce contexts | enum | Yes | Confidential | organization management | employee, contractor, intern, external workforce, and similar classifications | cross-module policy driver |
| `FLD-013` | `effective_from` | effective-dated entities | datetime or date | Yes on effective-dated rows | Internal | owning module | start of validity window | must use consistent timezone handling rules |
| `FLD-014` | `effective_to` | effective-dated entities | datetime or date | Optional | Internal | owning module | end of validity window | null usually indicates open-ended |
| `FLD-015` | `status_code` | generalized state-bearing entities | string or enum | Yes | Internal | owning module | current business status value | avoid free-text statuses in transactional tables |
| `FLD-016` | `workflow_instance_id` | workflow-linked entities | UUID | Optional | Internal | workflow engine | linked workflow instance reference | required where task routing exists |
| `FLD-017` | `task_id` | workflow task, approvals, notifications | UUID | Optional | Internal | workflow engine | workflow task identifier | use for inbox and audit correlation |
| `FLD-018` | `document_id` | document-linked entities | UUID | Optional | Restricted | document repository | unique document metadata identifier | separate from storage object key |
| `FLD-019` | `audit_event_id` | audit entities and references | UUID | Yes for audit store | Restricted | audit engine | unique audit-event identifier | immutable append-only evidence key |
| `FLD-020` | `actor_id` | audit, workflow, API, support session | UUID or service principal key | Yes | Restricted | identity and access | user or system actor performing the action | must support human and service identities |
| `FLD-021` | `correlation_id` | API, events, workflow, integration | string | Yes for async or multi-step operations | Internal | platform core | end-to-end request or process correlation key | mandatory for observability |
| `FLD-022` | `source_system_code` | integration and migration entities | string | Optional | Internal | integration platform | source system identifier | required for mastered import or sync flows |
| `FLD-023` | `idempotency_key` | command APIs and import batches | string | Optional but recommended | Internal | API gateway plus owning service | replay-safe client command key | should be persisted for command APIs |
| `FLD-024` | `created_at` | almost all persisted entities | datetime | Yes | Internal | owning module | row creation timestamp | use UTC storage standard |
| `FLD-025` | `updated_at` | mutable entities | datetime | Yes for mutable rows | Internal | owning module | last update timestamp | use optimistic concurrency where needed |
| `FLD-026` | `created_by` | mutable entities | actor key | Yes | Restricted | owning module | creator actor reference | supports audit and attribution |
| `FLD-027` | `updated_by` | mutable entities | actor key | Yes for mutable rows | Restricted | owning module | last updater actor reference | should align with audit actor where possible |
| `FLD-028` | `privacy_classification` | restricted or export-sensitive entities | enum | Optional but recommended | Restricted | security governance | declared data sensitivity level | useful for masking and export control automation |
| `FLD-029` | `version_no` | versioned configs, templates, contracts, schemas | integer | Optional by entity | Internal | owning module | incrementing version number | required for published configuration artifacts |
| `FLD-030` | `is_active` | reference and config entities | boolean | Optional by entity | Internal | owning module | active or inactive indicator | not a substitute for lifecycle status on transactional objects |
| `FLD-031` | `legal_name` | employee personal profile | string | Yes | Restricted | people core | primary legal full name used for employment and statutory records | normalize whitespace before persistence |
| `FLD-032` | `preferred_name` | employee personal profile | string | Optional by policy | Restricted | people core | employee-preferred display or chosen name | allow culturally valid punctuation and Unicode characters |
| `FLD-033` | `family_name` | employee personal profile | string | Optional by country or naming model | Restricted | people core | surname or family name component where model separates it | do not assume every population uses the same name structure |
| `FLD-034` | `free_text_notes` | comments, remarks, explanatory fields | text | Optional | Confidential | owning module | long-form user-entered explanatory content | sanitize markup and enforce field-class length caps |
| `FLD-035` | `primary_mobile_number` | employee contact profile | string | Optional or required by policy | Restricted | people core | employee primary mobile number used for contact and OTP verification | store normalized canonical format |
| `FLD-036` | `mobile_otp_verification_status` | employee contact verification | enum | Yes when mobile exists | Confidential | identity and access | verification state for the pending or active mobile number | drives whether a new value is trusted |
| `FLD-037` | `mobile_otp_verified_at` | employee contact verification | datetime | Optional | Confidential | identity and access | timestamp of successful OTP verification | required for audit and anti-replay analysis |
| `FLD-038` | `personal_email` | employee contact profile | string | Optional by policy | Restricted | people core | employee personal email for contact and recovery use cases | uniqueness may be tenant-policy driven rather than universal |
| `FLD-039` | `date_of_birth` | employee and dependent biographical records | date | Yes for employee populations that require it | Restricted | people core | birth date used for age, eligibility, and statutory checks | preserve true source date including leap-day births |
| `FLD-040` | `date_of_joining` | employment assignment | date | Yes for employees | Confidential | people core | employee start or join date | must align with preboarding and work-entry policy |
| `FLD-041` | `marriage_date` | employee personal and family profile | date | Optional | Restricted | people core | legal or declared marriage date where captured | must align with marital status and jurisdiction rules |
| `FLD-042` | `marital_status` | employee personal profile | enum | Optional by country or policy | Restricted | people core | declared marital-status category | should remain enum-driven and workflow-safe |
| `FLD-043` | `dependent_relationship_type` | employee dependent records | enum | Yes for dependent rows | Restricted | people core | relationship classification such as child, spouse, parent, or sibling | relationship drives eligibility and plausibility rules |
| `FLD-044` | `dependent_date_of_birth` | employee dependent records | date | Yes for age-sensitive dependent rows | Restricted | people core | dependent birth date | required for family plausibility and benefit eligibility rules |
| `FLD-045` | `dependent_birth_context` | employee dependent records | enum | Optional | Restricted | people core | context such as biological, adopted, step-child, surrogate, or multiple birth | used to route exception logic for sibling-gap checks |
| `FLD-046` | `pan_number` | national identity | string | Optional by country and tax applicability | Highly Restricted | compliance and identity operations | permanent account number for India tax identity | uppercase normalized before validation and masking rules apply |
| `FLD-047` | `aadhaar_number` | national identity | string | Optional by country and policy | Highly Restricted | compliance and identity operations | Aadhaar identifier where legally storable and permitted | storage and display may require masking or tokenization |
| `FLD-048` | `passport_number` | national identity | string | Optional | Highly Restricted | compliance and identity operations | passport identifier issued by country authority | validator must be issuing-country aware |
| `FLD-049` | `passport_issue_date` | national identity | date | Optional | Highly Restricted | compliance and identity operations | passport issue date | paired validation with expiry and active status required |
| `FLD-050` | `passport_expiry_date` | national identity | date | Optional | Highly Restricted | compliance and identity operations | passport expiry date | active document cannot remain valid after expiry |
| `FLD-051` | `uan_number` | provident fund and payroll compliance | string | Optional by statutory applicability | Highly Restricted | payroll compliance | universal account number for India PF context | duplicate detection and exact-length validation required |
| `FLD-052` | `postal_code` | address | string | Optional or required by country policy | Restricted | people core | postal or PIN code for residential or mailing address | validate with country-aware pattern profile |
| `FLD-053` | `state_code` | address | string | Optional or required by country policy | Internal | people core | state or region code for address master alignment | should resolve against country-aware master data |
| `FLD-054` | `city_code` | address | string | Optional | Internal | people core | city or locality code for address master alignment | prefer master-data keys over free text where available |
| `FLD-055` | `emergency_contact_phone` | employee emergency contacts | string | Optional by policy | Restricted | people core | contact number for emergency contact record | uses normalized phone rules even if country differs |
| `FLD-056` | `bank_account_number` | employee bank account | string | Yes when payout account is required | Highly Restricted | payroll operations | employee bank or payout account number | always mask in non-privileged views and logs |
| `FLD-057` | `bank_routing_code` | employee bank account | string | Yes where local payment rail requires it | Highly Restricted | payroll operations | IFSC, SWIFT, IBAN fragment, ABA, sort code, or equivalent routing key | route-specific validators apply by country and payment rail |
| `FLD-058` | `currency_amount` | payroll, compensation, benefits, and expense amounts | decimal | Module-specific | Confidential | owning module | money amount for transactional or planning use | enforce sane upper bounds in addition to non-negative check |
| `FLD-059` | `allocation_percent` | goal weights, payout splits, allocation rules | decimal | Optional by design | Internal | owning module | percentage allocation value | grouped values may need sum-to-100 validation |
| `FLD-060` | `employee_code` | employee master | string | Yes where enterprise code is used | Confidential | people core | tenant-scoped human-readable employee identifier | uniqueness must be tenant-scoped, not global |
| `FLD-061` | `bank_change_effective_from` | employee bank account change requests | date | Optional | Confidential | payroll operations | first eligible date on which the changed payout account becomes active | must respect payroll freeze and cut-off rules |
| `FLD-062` | `file_mime_type` | document and upload metadata | string | Yes for uploads | Internal | document repository | detected or asserted MIME type of uploaded content | enforce allowlist server-side |
| `FLD-063` | `file_size_bytes` | document and upload metadata | integer | Yes for uploads | Internal | document repository | file size in bytes | validate against per-file and per-module maximums |
| `FLD-064` | `file_name_original` | document and upload metadata | string | Optional | Internal | document repository | original client-supplied file name | sanitize path separators and risky characters before storage |
| `FLD-065` | `import_batch_row_no` | import staging row | integer | Yes for imports | Internal | implementation tooling | row number from staging import batch | required for row-level defect reporting and reconciliation |
| `FLD-066` | `source_record_key` | import and integration staging | string | Optional | Internal | implementation tooling | external record identifier from source file or system | useful for duplicate detection and rerun reconciliation |
| `FLD-067` | `document_status` | identity, compliance, and document entities | enum | Yes where document lifecycle exists | Internal | owning module | active, expired, pending-review, rejected, or similar document state | pair with state-transition and expiry validation rules |
| `FLD-068` | `account_holder_name` | employee bank account | string | Yes when payout account exists | Restricted | payroll operations | beneficiary or account-holder name for verification and payout readiness | owner mismatch may require review or rejection |
| `FLD-069` | `country_code` | address, identity, bank, and policy-driven records | string | Yes where country-specific rules apply | Internal | organization management | country discriminator for validation profile selection | required for country-aware validators and master-data resolution |
| `FLD-070` | `pending_mobile_number` | employee contact change request | string | Optional | Restricted | identity and access | untrusted mobile number awaiting OTP success | must not replace active mobile until verified |
| `FLD-071` | `global_user_id` | all user and actor identities | UUID | Yes | Restricted | identity and access | provider-wide unique user identifier across platform and all tenants | never reused and never overloaded with tenant business keys |
| `FLD-072` | `org_user_id` | tenant-scoped user identities | string or UUID | Yes where tenant-local identity exists | Restricted | identity and access | tenant-specific user identifier for platform user, employee, contingent worker, or delegated admin context | unique only inside tenant boundary unless legal rule says otherwise |
| `FLD-073` | `deleted_at` | soft-deletable business entities | datetime | Optional | Internal | owning module | soft-delete timestamp marking logical deletion | active queries must exclude rows unless privileged recovery or audit flow applies |
| `FLD-074` | `deleted_by` | soft-deletable business entities | actor key | Optional | Restricted | owning module | actor who performed logical deletion | required for defensible restore and audit traceability |
| `FLD-075` | `business_date` | attendance, leave, payroll, and cutoff-sensitive transactions | date | Optional by module | Internal | owning module | date interpreted in tenant, legal-entity, or work-location business timezone | must not be derived from implicit server timezone rules |
| `FLD-076` | `business_timezone` | tenant, legal entity, location, and cutoff contexts | IANA timezone string | Yes where cutoff logic applies | Internal | organization management | explicit timezone used for date-boundary and cutoff calculations | avoid ambiguous local-offset-only storage |
| `FLD-077` | `action_idempotency_token` | approvals, submits, commits, and other high-risk commands | string | Optional but recommended | Internal | API gateway plus owning service | unique token preventing double-submit or replay of user actions | should be bound to actor, command type, and object version where feasible |
| `FLD-078` | `login_status` | workforce and admin identities | enum | Yes | Confidential | identity and access | current authentication eligibility such as active, suspended, locked, or deprovisioned | must react to employment and access-governance state changes |
| `FLD-079` | `session_revoked_at` | workforce and admin identities | datetime | Optional | Restricted | identity and access | timestamp when active sessions were invalidated due to exit, suspension, or security event | used for token revocation and emergency lockout logic |
| `FLD-080` | `preview_status` | import staging rows and precommit validation results | enum | Yes for import staging | Internal | implementation tooling | row status such as clean, warning, blocked, corrected, or commit-ready | drives preview workbench state and commit eligibility |

# 4. Engineering Rules

- do not create alternate names for these fields in new modules without a documented exception
- warehouse, API, and event models should preserve canonical names wherever feasible
- where legacy integration payloads differ, use explicit mapping and never silent semantic drift
- privacy classification should be available to masking and export-control logic
- field references used in validation and import design should remain stable even if UI labels or legacy source-column headers change
- globally unique identities and tenant-scoped identities must both be modeled explicitly rather than treated as interchangeable

# 5. Immediate Follow-On Use

This seed dictionary should feed:

- canonical API schema naming
- integration mapping sheets
- warehouse model naming
- metadata framework extensions
- rule-engine field references
