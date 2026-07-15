---
id: HRMS-APP-19
title: Validation Rule Implementation Traceability Matrix
document: 19-validation-rule-implementation-traceability-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix converts the validation-rule library into an implementation traceability pack that engineering, design, QA, data migration, and business teams can use directly.

It maps each critical `Rule Ref` to:

- the canonical `Field Ref`
- the expected API or contract touchpoint
- the payload or DTO model family
- the primary screen surface
- the import-template column that must enforce or precheck the same rule

# 2. Scope Note

This traceability matrix focuses first on high-risk people, identity, family, banking, upload, and import validations because those are the most likely to cause legal, payroll, trust, or data-quality failures if implemented inconsistently.

Where code-level DTO classes or final wireframe IDs do not yet exist, this appendix defines the canonical implementation references that downstream teams should preserve when generating detailed design and code artifacts.

# 3. Canonical Implementation Surfaces

## 3.1 DTO and Payload Reference Index

| DTO Ref | Canonical Payload Family | Primary Use |
|---|---|---|
| `DTO-EMP-001` | EmployeeCreatePayload | worker creation and initial hire record capture |
| `DTO-EMP-PER-001` | EmployeePersonalInfoUpsertPayload | personal-information and biographical updates |
| `DTO-EMP-CON-001` | EmployeeContactInfoUpsertPayload | mobile, email, address, and emergency-contact updates |
| `DTO-EMP-MOB-OTP-001` | EmployeeMobileOtpRequestPayload | OTP request for new or changed mobile number |
| `DTO-EMP-MOB-OTP-002` | EmployeeMobileOtpVerifyPayload | OTP verification and activation of pending mobile number |
| `DTO-EMP-ID-001` | EmployeeNationalIdentityUpsertPayload | PAN, Aadhaar, passport, visa, and work-authorization updates |
| `DTO-EMP-DEP-001` | EmployeeDependentUpsertPayload | spouse, child, parent, and other dependent maintenance |
| `DTO-EMP-BANK-001` | EmployeeBankAccountUpsertPayload | bank-account create or update requests |
| `DTO-EMP-BANK-002` | EmployeeBankVerificationPayload | bank verification, evidence, and approval capture |
| `DTO-EMP-PF-001` | EmployeePfEnrollmentPayload | PF and UAN enrollment or correction |
| `DTO-DOC-UPL-001` | DocumentUploadPayload | document and evidence file uploads |
| `DTO-IMP-EMP-001` | EmployeeMasterImportRow | employee master bulk import staging row |
| `DTO-IMP-ID-001` | EmployeeIdentityImportRow | employee identity import staging row |
| `DTO-IMP-DEP-001` | EmployeeDependentImportRow | dependent import staging row |
| `DTO-IMP-BANK-001` | EmployeeBankImportRow | bank-account import staging row |
| `DTO-IMP-PF-001` | EmployeePfImportRow | PF and UAN import staging row |

## 3.2 Screen Surface Reference Index

| Screen Ref | Screen Surface | Parent Experience |
|---|---|---|
| `SCR-E02-001` | Employee Profile Summary | `E02` people management profile experience |
| `SCR-E02-002` | Personal Information Form | employee profile maintenance |
| `SCR-E02-003` | Contact and OTP Verification Panel | employee contact maintenance |
| `SCR-E02-004` | National Identity Form | identity and compliance panel |
| `SCR-E02-005` | Dependents and Family Form | people and benefits dependent maintenance |
| `SCR-E02-006` | Bank and Tax Maintenance Screen | payout and tax readiness maintenance |
| `SCR-E02-007` | Employee Master Workbench | HR operations employee master experience |
| `SCR-E02-008` | Document Verification Queue | HR operations review and evidence queue |
| `W0-SCR-026` | Bulk Import Wizard and Validation Workbench | implementation import tooling |
| `W0-SCR-027` | Migration Mapping and Reconciliation Workspace | implementation reconciliation tooling |
| `W0-SCR-028` | Validation Command Center | readiness and defect-governance tooling |

## 3.3 Import Template Reference Index

| Import Ref | Template Name | Typical Use |
|---|---|---|
| `IMP-EMP-001` | Employee Master Import | employee creation and personal or employment baseline load |
| `IMP-ID-001` | Employee Identity Import | national identity, passport, and work-authorization load |
| `IMP-DEP-001` | Employee Dependents Import | dependent and family relationship load |
| `IMP-BANK-001` | Employee Bank Accounts Import | payroll payout-account load |
| `IMP-PF-001` | Employee PF Enrollment Import | PF and UAN onboarding or correction load |
| `IMP-DOC-001` | Employee Document Manifest Import | evidence or document metadata load |

# 4. Rule to Field to Implementation Mapping

| Map Ref | Rule Ref | Field Ref | Canonical Field | API or Contract Ref | DTO Ref | Screen Ref | Import Column | Notes |
|---|---|---|---|---|---|---|---|---|
| `MAP-001` | `VAL-001` | `FLD-031` | `legal_name` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.legal_name` | trim and collapse spaces before save and before import acceptance |
| `MAP-002` | `VAL-001` | `FLD-032` | `preferred_name` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.preferred_name` | same normalization as legal-name fields |
| `MAP-003` | `VAL-001` | `FLD-033` | `family_name` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.family_name` | allow null where customer naming model does not separate surname |
| `MAP-004` | `VAL-002` | `FLD-031` | `legal_name` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.legal_name` | allow letters, marks, spaces, apostrophes, hyphens, and periods |
| `MAP-005` | `VAL-002` | `FLD-032` | `preferred_name` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.preferred_name` | reject HTML, control chars, path separators, and obvious junk symbols |
| `MAP-006` | `VAL-003` | `FLD-031` | `legal_name` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.legal_name` | default minimum normalized length `2` unless initials-only policy allows otherwise |
| `MAP-007` | `VAL-004` | `FLD-034` | `free_text_notes` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-PER-001` | `SCR-E02-007` | `IMP-EMP-001.notes` | apply field-class length caps and script sanitization |
| `MAP-008` | `VAL-005` | `FLD-035` | `primary_mobile_number` | `API-032` / `CTR-EMP-CON-PATCH-001` | `DTO-EMP-CON-001` | `SCR-E02-003` | `IMP-EMP-001.primary_mobile_number` | store normalized E.164-style canonical value |
| `MAP-009` | `VAL-006` | `FLD-070` | `pending_mobile_number` | `API-033` / `CTR-EMP-MOB-OTP-POST-001` | `DTO-EMP-CON-001`, `DTO-EMP-MOB-OTP-001`, `DTO-EMP-MOB-OTP-002` | `SCR-E02-003` | `IMP-EMP-001.pending_mobile_number` | changed mobile stays pending until OTP verify succeeds |
| `MAP-010` | `VAL-006` | `FLD-036` | `mobile_otp_verification_status` | `API-034` / `CTR-EMP-MOB-OTP-CMD-001` | `DTO-EMP-MOB-OTP-002` | `SCR-E02-003` | `IMP-EMP-001.mobile_otp_verification_status` | import should normally stage as `unverified` unless governed migration exception exists |
| `MAP-011` | `VAL-007` | `FLD-037` | `mobile_otp_verified_at` | `API-034` / `CTR-EMP-MOB-OTP-CMD-001` | `DTO-EMP-MOB-OTP-001`, `DTO-EMP-MOB-OTP-002` | `SCR-E02-003` | `IMP-EMP-001.mobile_otp_verified_at` | security service must also enforce expiry, retry, and replay limits |
| `MAP-012` | `VAL-008` | `FLD-038` | `personal_email` | `API-032` / `CTR-EMP-CON-PATCH-001` | `DTO-EMP-CON-001` | `SCR-E02-003` | `IMP-EMP-001.personal_email` | email syntax plus policy-driven duplicate checks |
| `MAP-013` | `VAL-009` | `FLD-039` | `date_of_birth` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.date_of_birth` | must be valid calendar date in the past |
| `MAP-014` | `VAL-010` | `FLD-039` | `date_of_birth` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.date_of_birth` | enforce worker-age policy band by tenant and worker type |
| `MAP-015` | `VAL-011` | `FLD-040` | `date_of_joining` | `API-007` / `CTR-EMP-POST-001` | `DTO-EMP-001` | `SCR-E02-001`, `SCR-E02-007` | `IMP-EMP-001.date_of_joining` | compare against `FLD-039 date_of_birth` for minimum work-entry age |
| `MAP-016` | `VAL-012` | `FLD-040` | `date_of_joining` | `API-007` / `CTR-EMP-POST-001` | `DTO-EMP-001` | `SCR-E02-001`, `SCR-E02-007` | `IMP-EMP-001.date_of_joining` | future date allowed only within configured preboarding window |
| `MAP-017` | `VAL-013` | `FLD-039` | `date_of_birth` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.date_of_birth` | invalid dates like `30-Feb` must fail in UI, API, and import layers alike |
| `MAP-018` | `VAL-014` | `FLD-039` | `date_of_birth` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-PER-001` | `SCR-E02-001`, `SCR-E02-002` | `IMP-EMP-001.date_of_birth` | preserve true `29-Feb` value and route non-leap-year fallback in downstream calculations |
| `MAP-019` | `VAL-015` | `FLD-041` | `marriage_date` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.marriage_date` | must be after DOB and not earlier than jurisdiction legal threshold |
| `MAP-020` | `VAL-016` | `FLD-042` | `marital_status` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-PER-001` | `SCR-E02-002` | `IMP-EMP-001.marital_status` | state of marital-status field governs whether marriage date is allowed or required |
| `MAP-021` | `VAL-017` | `FLD-044` | `dependent_date_of_birth` | `API-036` / `CTR-EMP-DEP-POST-001` | `DTO-EMP-DEP-001` | `SCR-E02-005` | `IMP-DEP-001.dependent_date_of_birth` | compare dependent DOB against employee DOB for plausible parent-age gap |
| `MAP-022` | `VAL-018` | `FLD-044` | `dependent_date_of_birth` | `API-036` / `CTR-EMP-DEP-POST-001` | `DTO-EMP-DEP-001` | `SCR-E02-005` | `IMP-DEP-001.dependent_date_of_birth` | sibling-gap threshold enforced with exception routing for same-birth or adopted cases |
| `MAP-023` | `VAL-018` | `FLD-045` | `dependent_birth_context` | `API-036` / `CTR-EMP-DEP-POST-001` | `DTO-EMP-DEP-001` | `SCR-E02-005` | `IMP-DEP-001.birth_context` | explains exception path for twins, adoption, surrogate, step-child, or corrected historical data |
| `MAP-024` | `VAL-019` | `FLD-043` | `dependent_relationship_type` | `API-036` / `CTR-EMP-DEP-POST-001` | `DTO-EMP-DEP-001` | `SCR-E02-005` | `IMP-DEP-001.relationship_type` | relationship type must remain plausible relative to ages and family model |
| `MAP-025` | `VAL-020` | `FLD-046` | `pan_number` | `API-035` / `CTR-EMP-ID-PATCH-001` | `DTO-EMP-ID-001` | `SCR-E02-004` | `IMP-ID-001.pan_number` | uppercase normalize before regex validation and masking policy application |
| `MAP-026` | `VAL-021` | `FLD-047` | `aadhaar_number` | `API-035` / `CTR-EMP-ID-PATCH-001` | `DTO-EMP-ID-001` | `SCR-E02-004` | `IMP-ID-001.aadhaar_number` | exactly `12` digits after spacing cleanup |
| `MAP-027` | `VAL-022` | `FLD-047` | `aadhaar_number` | `API-035` / `CTR-EMP-ID-PATCH-001` | `DTO-EMP-ID-001` | `SCR-E02-004` | `IMP-ID-001.aadhaar_number` | checksum validator enabled only where storage policy and jurisdiction allow |
| `MAP-028` | `VAL-023` | `FLD-048` | `passport_number` | `API-035` / `CTR-EMP-ID-PATCH-001` | `DTO-EMP-ID-001` | `SCR-E02-004` | `IMP-ID-001.passport_number` | country-aware validator selected from `FLD-069 country_code` |
| `MAP-029` | `VAL-024` | `FLD-049` | `passport_issue_date` | `API-035` / `CTR-EMP-ID-PATCH-001` | `DTO-EMP-ID-001` | `SCR-E02-004` | `IMP-ID-001.passport_issue_date` | issue date must exist before expiry date where both values exist |
| `MAP-030` | `VAL-024` | `FLD-050` | `passport_expiry_date` | `API-035` / `CTR-EMP-ID-PATCH-001` | `DTO-EMP-ID-001` | `SCR-E02-004` | `IMP-ID-001.passport_expiry_date` | expired document cannot remain active without governed override state |
| `MAP-031` | `VAL-025` | `FLD-051` | `uan_number` | `API-038` / `CTR-EMP-PF-POST-001` | `DTO-EMP-PF-001` | `SCR-E02-006` | `IMP-PF-001.uan_number` | exactly `12` digits before PF enrollment approval |
| `MAP-032` | `VAL-026` | `FLD-051` | `uan_number` | `API-038` / `CTR-EMP-PF-POST-001` | `DTO-EMP-PF-001` | `SCR-E02-006`, `W0-SCR-028` | `IMP-PF-001.uan_number` | duplicate active UAN goes to exception queue or validation workbench |
| `MAP-033` | `VAL-027` | `FLD-052` | `postal_code` | `API-032` / `CTR-EMP-CON-PATCH-001` | `DTO-EMP-CON-001` | `SCR-E02-003` | `IMP-EMP-001.postal_code` | default India PIN pattern applies only when country profile requires it |
| `MAP-034` | `VAL-028` | `FLD-053` | `state_code` | `API-032` / `CTR-EMP-CON-PATCH-001` | `DTO-EMP-CON-001` | `SCR-E02-003` | `IMP-EMP-001.state_code` | must resolve valid combination with city and postal code |
| `MAP-035` | `VAL-028` | `FLD-054` | `city_code` | `API-032` / `CTR-EMP-CON-PATCH-001` | `DTO-EMP-CON-001` | `SCR-E02-003` | `IMP-EMP-001.city_code` | use master-data-assisted validation rather than free-text-only checks where possible |
| `MAP-036` | `VAL-029` | `FLD-055` | `emergency_contact_phone` | `API-032` / `CTR-EMP-CON-PATCH-001` | `DTO-EMP-CON-001` | `SCR-E02-003` | `IMP-EMP-001.emergency_contact_phone` | apply same normalized phone rules as employee contact fields |
| `MAP-037` | `VAL-030` | `FLD-056` | `bank_account_number` | `API-037` / `CTR-EMP-BANK-POST-001` | `DTO-EMP-BANK-001` | `SCR-E02-006` | `IMP-BANK-001.bank_account_number` | enforce rail-specific length and pattern rules before activation |
| `MAP-038` | `VAL-031` | `FLD-057` | `bank_routing_code` | `API-037` / `CTR-EMP-BANK-POST-001` | `DTO-EMP-BANK-001` | `SCR-E02-006` | `IMP-BANK-001.bank_routing_code` | country or payment-rail pattern such as IFSC, IBAN, SWIFT, ABA, or sort code |
| `MAP-039` | `VAL-032` | `FLD-058` | `currency_amount` | `API-037` / `CTR-EMP-BANK-POST-001` | `DTO-EMP-BANK-001`, `DTO-EMP-PF-001` | `SCR-E02-006`, `SCR-E02-007` | `IMP-BANK-001.allocation_amount` | non-negative with sane upper bounds to catch data-entry or import mistakes |
| `MAP-040` | `VAL-033` | `FLD-059` | `allocation_percent` | `API-037` / `CTR-EMP-BANK-POST-001` | `DTO-EMP-BANK-001` | `SCR-E02-006` | `IMP-BANK-001.allocation_percent` | each value `0-100`; grouped percentages must sum to `100` when split payouts are enabled |
| `MAP-041` | `VAL-034` | `FLD-015` | `status_code` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-PER-001`, `DTO-EMP-ID-001`, `DTO-EMP-BANK-001` | `SCR-E02-007`, `SCR-E02-008` | `IMP-EMP-001.status_code` | valid enum value alone is not enough; transition from current state must also be valid |
| `MAP-042` | `VAL-035` | `FLD-060` | `employee_code` | `API-007` / `CTR-EMP-POST-001` | `DTO-EMP-001`, `DTO-IMP-EMP-001` | `SCR-E02-007`, `W0-SCR-026` | `IMP-EMP-001.employee_code` | uniqueness enforced within tenant context and any narrower customer scope |
| `MAP-043` | `VAL-035` | `FLD-001` | `tenant_id` | `API-040` / `CTR-IMP-EMP-POST-001` | `DTO-EMP-001`, `DTO-IMP-EMP-001` | `SCR-E02-007`, `W0-SCR-027` | `IMP-EMP-001.tenant_code` | required discriminator for scoped uniqueness and migration reconciliation |
| `MAP-044` | `VAL-036` | `FLD-010` | `manager_worker_id` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-001`, `SCR-E02-007` | `IMP-EMP-001.manager_employee_code` | service layer must block self-manager and cyclic assignment patterns |
| `MAP-045` | `VAL-037` | `FLD-016` | `workflow_instance_id` | `API-037` / `CTR-EMP-BANK-POST-001` | `DTO-EMP-BANK-002`, `DTO-EMP-PF-001` | `SCR-E02-007`, `SCR-E02-008`, `W0-SCR-028` | `IMP-EMP-001.workflow_reference` | transition cannot succeed while required evidence or approvals are missing |
| `MAP-046` | `VAL-038` | `FLD-062` | `file_mime_type` | `API-039` / `CTR-EMP-DOC-POST-001` | `DTO-DOC-UPL-001` | `SCR-E02-008` | `IMP-DOC-001.file_mime_type` | MIME allowlist must be enforced server-side, not only in browser controls |
| `MAP-047` | `VAL-038` | `FLD-063` | `file_size_bytes` | `API-039` / `CTR-EMP-DOC-POST-001` | `DTO-DOC-UPL-001` | `SCR-E02-008` | `IMP-DOC-001.file_size_bytes` | file-size limit must be module-aware and centrally configurable |
| `MAP-048` | `VAL-038` | `FLD-064` | `file_name_original` | `API-039` / `CTR-EMP-DOC-POST-001` | `DTO-DOC-UPL-001` | `SCR-E02-008` | `IMP-DOC-001.file_name_original` | sanitize traversal characters before storage or echo back |
| `MAP-049` | `VAL-039` | `FLD-065` | `import_batch_row_no` | `API-040` / `CTR-IMP-EMP-POST-001` | `DTO-IMP-EMP-001`, `DTO-IMP-ID-001`, `DTO-IMP-DEP-001`, `DTO-IMP-BANK-001`, `DTO-IMP-PF-001` | `W0-SCR-026`, `W0-SCR-027`, `W0-SCR-028` | `ALL_IMPORTS.__row_no` | every validation error must be traceable to a source row number |
| `MAP-050` | `VAL-039` | `FLD-066` | `source_record_key` | `API-040` / `CTR-IMP-EMP-POST-001` | `DTO-IMP-EMP-001`, `DTO-IMP-ID-001`, `DTO-IMP-DEP-001`, `DTO-IMP-BANK-001`, `DTO-IMP-PF-001` | `W0-SCR-026`, `W0-SCR-027` | `ALL_IMPORTS.source_record_key` | used for duplicate detection, replay handling, and reconciliation |
| `MAP-051` | `VAL-040` | `FLD-031` | `legal_name` | `API-040` / `CTR-IMP-EMP-POST-001` | `DTO-EMP-PER-001`, `DTO-IMP-EMP-001` | `SCR-E02-007`, `W0-SCR-028` | `IMP-EMP-001.legal_name` | suspicious but syntactically valid data should be flagged for review rather than silently accepted |
| `MAP-052` | `VAL-040` | `FLD-039` | `date_of_birth` | `API-040` / `CTR-IMP-EMP-POST-001` | `DTO-EMP-PER-001`, `DTO-IMP-EMP-001` | `SCR-E02-007`, `W0-SCR-028` | `IMP-EMP-001.date_of_birth` | anomaly scoring should watch for implausible cluster patterns across workers or dependents |
| `MAP-053` | `VAL-040` | `FLD-035` | `primary_mobile_number` | `API-040` / `CTR-IMP-EMP-POST-001` | `DTO-EMP-CON-001`, `DTO-IMP-EMP-001` | `SCR-E02-003`, `W0-SCR-028` | `IMP-EMP-001.primary_mobile_number` | use for suspicious duplicate-contact clustering and mass-fake-data detection |
| `MAP-054` | `VAL-041` | `FLD-073` | `deleted_at` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-PER-001`, `DTO-IMP-EMP-001` | `SCR-E02-007`, `W0-SCR-028` | `ALL_IMPORTS.deleted_at` | soft-deleted rows must not appear in normal selectors, approvals, or active uniqueness checks |
| `MAP-055` | `VAL-041` | `FLD-074` | `deleted_by` | `API-031` / `CTR-EMP-PER-PATCH-001` | `DTO-EMP-PER-001` | `SCR-E02-007` | `ALL_IMPORTS.deleted_by` | logical deletion must remain attributable and recoverable |
| `MAP-056` | `VAL-042` | `FLD-075` | `business_date` | `API-014` / `CTR-LEAVE-POST-001`, `API-016` / `CTR-TIME-POST-001` | `DTO-IMP-EMP-001` | `SCR-E02-007`, `W0-SCR-026`, `W0-SCR-028` | `IMP-EMP-001.business_date` | cutoffs and `today` calculations must resolve through explicit business date rather than raw server clock |
| `MAP-057` | `VAL-042` | `FLD-076` | `business_timezone` | `API-014` / `CTR-LEAVE-POST-001`, `API-016` / `CTR-TIME-POST-001` | `DTO-EMP-CON-001`, `DTO-IMP-EMP-001` | `SCR-E02-003`, `W0-SCR-027` | `IMP-EMP-001.business_timezone` | timezone precedence should be tenant, legal entity, location, or shift policy as configured |
| `MAP-058` | `VAL-043` | `FLD-077` | `action_idempotency_token` | `API-023` / `CTR-TASK-CMD-001`, `API-041` / `CTR-IMP-EMP-CMD-001` | `DTO-EMP-BANK-002`, `DTO-EMP-PF-001` | `SCR-E02-007`, `W0-SCR-028` | `ALL_IMPORTS.action_idempotency_token` | protects against double-click submit or retry duplication |
| `MAP-059` | `VAL-044` | `FLD-017` | `task_id` | `API-023` / `CTR-TASK-CMD-001` | `DTO-EMP-BANK-002`, `DTO-EMP-PF-001` | `SCR-E02-007`, `SCR-E02-008`, `W0-SCR-028` | `ALL_IMPORTS.task_id` | later approver action must fail as stale once first valid action lands |
| `MAP-060` | `VAL-045` | `FLD-078` | `login_status` | `API-009` / `CTR-EMPLIFE-POST-001` | `DTO-EMP-001`, `DTO-EMP-PER-001` | `SCR-E02-001`, `SCR-E02-007` | `IMP-EMP-001.login_status` | exited or suspended worker must not keep interactive access |
| `MAP-061` | `VAL-045` | `FLD-079` | `session_revoked_at` | `API-009` / `CTR-EMPLIFE-POST-001` | `DTO-EMP-PER-001` | `SCR-E02-007` | `IMP-EMP-001.session_revoked_at` | revoke active sessions when employment or access state becomes ineligible |
| `MAP-062` | `VAL-046` | `FLD-001` | `tenant_id` | `API-008` / `CTR-EMP-GET-001`, `API-040` / `CTR-IMP-EMP-POST-001` | `DTO-EMP-001`, `DTO-IMP-EMP-001` | `SCR-E02-007`, `W0-SCR-027` | `ALL_IMPORTS.tenant_code` | global IDs must still resolve inside tenant boundary on every read and write |
| `MAP-063` | `VAL-047` | `FLD-071` | `global_user_id` | `API-007` / `CTR-EMP-POST-001` | `DTO-EMP-001` | `SCR-E02-007` | `IMP-EMP-001.global_user_id` | global provider identity stays unique across all tenants and personas |
| `MAP-064` | `VAL-047` | `FLD-072` | `org_user_id` | `API-007` / `CTR-EMP-POST-001` | `DTO-EMP-001` | `SCR-E02-007` | `IMP-EMP-001.org_user_id` | tenant-scoped identity remains unique inside organization boundary |
| `MAP-065` | `VAL-048` | `FLD-063` | `file_size_bytes` | `API-039` / `CTR-EMP-DOC-POST-001` | `DTO-DOC-UPL-001` | `SCR-E02-008` | `IMP-DOC-001.file_size_bytes` | block oversize files before production persistence |
| `MAP-066` | `VAL-049` | `FLD-080` | `preview_status` | `API-040` / `CTR-IMP-EMP-POST-001`, `API-041` / `CTR-IMP-EMP-CMD-001` | `DTO-IMP-EMP-001`, `DTO-IMP-ID-001`, `DTO-IMP-DEP-001`, `DTO-IMP-BANK-001`, `DTO-IMP-PF-001` | `W0-SCR-026`, `W0-SCR-027`, `W0-SCR-028` | `ALL_IMPORTS.preview_status` | rows must be previewed and commented before commit can touch production tables |

# 5. Implementation Notes

- `API or Contract Ref` values point to the current shared registry and should remain stable even if service boundaries later move.
- `DTO Ref` values in this appendix are canonical implementation names to preserve during schema generation, backend DTO creation, frontend form typing, and import-staging model design.
- `Screen Ref` values represent the primary enforcing surface. If a rule is also surfaced in another screen, that screen must inherit the same rule logic rather than redefining it.
- Import templates must pre-validate what they can, but the API layer remains the authoritative enforcement point.

# 6. Immediate Follow-On Use

This appendix should now drive:

- backend DTO, validator, and error-code implementation
- frontend field-level validation and inline error design
- import-template header standards and row-level rejection logic
- QA traceability from test case to rule, field, and screen
- analytics of top validation failures by field and source channel
