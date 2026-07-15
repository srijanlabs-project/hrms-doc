---
id: HRMS-APP-18
title: Field Validation Standards and Rule Matrix
document: 18-field-validation-standards-and-rule-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix defines the critical field-level and cross-field validation standards for the Enterprise HRMS platform. It exists to prevent embarrassing or legally risky data-quality failures in production, especially in people, identity, payroll, and dependent-data flows.

# 2. Scope Note

This `v1` matrix prioritizes:

- personal, family, and dependent fields
- identity and government identifiers
- mobile and OTP-governed contact changes
- date logic and leap-year behavior
- address, postal, and name validations
- payroll-sensitive identifiers
- cross-field plausibility and legal-age checks

This matrix should be treated as a build-critical validation reference, not only as a UX suggestion.

# 3. Design Principles

- validate server-side even if the frontend already validates
- separate `format validation`, `business-rule validation`, and `cross-field plausibility validation`
- allow jurisdiction-specific configuration where law varies
- distinguish `hard block`, `soft warning`, and `exception-with-approval`
- preserve legitimate real-world variations such as multiple citizenships, adopted children, twins, leap-day births, and lawful exceptions

# 4. Critical Validation Rule Matrix

| Rule Ref | Field or Relationship | Applies To | Validation Type | Rule | Default Enforcement | Config or Jurisdiction Notes |
|---|---|---|---|---|---|---|
| `VAL-001` | legal name, preferred name, family name | personal information | text sanitation | trim leading and trailing whitespace and collapse repeated internal spaces before persistence | Hard block on empty post-trim value | applies to all name-like fields unless explicitly exempt |
| `VAL-002` | legal name, preferred name | personal information | allowed characters | allow Unicode letters, combining marks, spaces, apostrophes, hyphens, and periods; reject control characters, HTML tags, path characters, and obvious junk symbols | Hard block | avoid over-restricting names like `O'Brien`, `Anne-Marie`, `José`, `M. K. Gandhi` |
| `VAL-003` | legal name, preferred name | personal information | minimum content | minimum normalized length of `2` characters after trim; single-character junk blocked unless local policy permits initials-only names | Hard block | initials-only exceptions should be configurable by country or customer policy |
| `VAL-004` | free-text notes and comments | shared text fields | safety and limits | enforce max lengths per field class and sanitize scriptable or dangerous markup | Hard block | keep longer limits for notes than for names |
| `VAL-005` | mobile number | personal information, login recovery, OTP | format | validate against E.164-style pattern `^\+?[0-9]{10,15}$` plus country-aware normalization rules | Hard block | store normalized canonical form where possible |
| `VAL-006` | mobile number create or update | personal information, identity | verification workflow | new or changed primary mobile number becomes effective only after successful OTP verification | Hard block on final activation without OTP | emergency assisted override should require privileged approval and audit |
| `VAL-007` | mobile OTP | identity and access | security | rate-limit OTP requests, set expiry, max attempts, replay prevention, and device or session binding | Hard block | anti-abuse policy should be centrally configurable |
| `VAL-008` | personal email | personal information | format and uniqueness context | validate email syntax and prevent duplicate active primary personal email where customer policy requires uniqueness | Hard block or warning by policy | employee populations may legitimately share family email in some cases; configurable |
| `VAL-009` | date of birth | personal information | date logic | DOB must be a valid calendar date in the past | Hard block | applies to all worker populations |
| `VAL-010` | date of birth | employee and contractor master | age window | employee DOB must satisfy configured minimum and maximum working-age policy bands; default recommendation is min `18`, max `70` unless worker-type policy differs | Hard block | countries, interns, apprentices, and retirees may need different policy bands |
| `VAL-011` | DOB and join date | people management | cross-field | date of joining must not precede DOB plus configured minimum work-entry age; default recommendation `15` absolute floor and stricter employable age by worker type | Hard block | separate legal employable age from system plausibility floor |
| `VAL-012` | join date | onboarding and employment | date window | join date cannot be unreasonably far in the future beyond configured preboarding window | Hard block | typical enterprise preboarding window should be configurable |
| `VAL-013` | 29 February date entry | all date inputs | calendar validity | `29-Feb` may be selected only in leap years; `30-Feb` and invalid month-day combinations always blocked | Hard block | standard calendar validation |
| `VAL-014` | leap-day DOB and anniversary behavior | personal information, benefits, payroll, tenure | date semantics | if DOB or anniversary is `29-Feb`, preserve actual stored date and use documented non-leap-year fallback policy for anniversaries and age calculations | Hard block on inconsistent handling | fallback should be configurable to `28-Feb` or `01-Mar` by use case |
| `VAL-015` | marriage date | personal and family information | cross-field and legal age | marriage date must be after DOB and not earlier than jurisdiction-configured legal minimum marriage age | Hard block | legal age varies by country and sometimes by legal context; use configurable policy |
| `VAL-016` | marital status and marriage date | personal information | cross-field consistency | if marital status implies unmarried state, marriage date should be absent unless historical-exception model is enabled; if marital status implies married, a marriage date may be required by policy | Hard block or warning by policy | divorce, widowhood, annulment, and separated statuses need nuanced handling |
| `VAL-017` | dependent child DOB vs employee DOB | dependents and benefits | plausibility | child DOB must be after employee DOB and after configured minimum parent-age gap; default plausibility floor should be configurable | Hard block | do not hardcode culturally unsafe assumptions; use policy plus warning thresholds |
| `VAL-018` | gap between two biological children | dependents and benefits | plausibility and exception logic | biological children for the same parent should not have DOB gaps under configured threshold such as `7 months`, unless same-birth, adoption, surrogate, step-child, or documented exception applies | Hard block with exception path | twins, triplets, adoption, blended families, and data corrections must be supported |
| `VAL-019` | dependent relationship and DOB | dependents and benefits | relationship consistency | parent, spouse, child, and sibling relationship types must be plausible relative to DOBs and family model | Warning or hard block by rule | use warning mode first if customer data quality is poor during migration |
| `VAL-020` | PAN | national identity | format | enforce `^[A-Z]{5}[0-9]{4}[A-Z]$` after uppercase normalization | Hard block | India-specific rule |
| `VAL-021` | Aadhaar | national identity | format and numeric | enforce exactly `12` numeric digits after space stripping | Hard block | India-specific rule |
| `VAL-022` | Aadhaar checksum | national identity | checksum | where storing full Aadhaar is allowed by policy, run checksum validation in addition to length check | Hard block where enabled | privacy and local regulatory treatment may limit storage or display |
| `VAL-023` | passport number | national identity | country-specific format | validate against issuing-country format profile; for India default pattern may be `1 letter + 7 digits` | Hard block | use issuing-country aware validator registry |
| `VAL-024` | passport issue and expiry dates | national identity | cross-field | expiry date must be after issue date and document cannot be marked active if expired | Hard block | applies to passport, visa, permit, and license-like identities |
| `VAL-025` | UAN or PF number | PF and payroll | format | validate UAN as exactly `12` digits | Hard block | payroll-critical India compliance rule |
| `VAL-026` | UAN | PF and payroll | uniqueness | duplicate active UAN across active PF enrollments should be blocked or routed to exception handling | Hard block or exception-with-approval | migration cleanup may require governed override |
| `VAL-027` | postal code or pincode | address fields | country-specific format | validate postal code using country-aware pattern; India default recommended `^[1-9][0-9]{5}$` | Hard block | must depend on selected country |
| `VAL-028` | state, city, postal code, country | address fields | referential consistency | selected city and postal code must be valid for selected state and country where master data is available | Hard block or warning during migration | master-data-assisted validation strongly preferred |
| `VAL-029` | emergency contact phone | emergency contacts | format | validate using same normalized phone rules as employee contact data | Hard block | alternate country may differ from employee country |
| `VAL-030` | bank account number | bank accounts | format and length | numeric or alphanumeric pattern by country and bank rules, min and max length enforced | Hard block | should be paired with IFSC, SWIFT, IBAN, or routing validations as applicable |
| `VAL-031` | IFSC, IBAN, SWIFT, routing codes | bank accounts | format | validate country or rail-specific banking code patterns | Hard block | required for payroll disbursement reliability |
| `VAL-032` | currency amounts | payroll, compensation, benefits, expenses | numeric bounds | values must be non-negative and within configured sane upper bounds to catch fat-fingered entry | Hard block | thresholds may differ by currency and module |
| `VAL-033` | percentages and weights | performance, compensation, planning | numeric and aggregate | each value must be `0-100`; grouped weights must sum to exactly `100` where the design requires full allocation | Hard block | sum precision and rounding strategy must be explicit |
| `VAL-034` | status values | all state-bearing objects | enum and transition | do not accept free-text status; only closed enums and valid transitions from current state | Hard block | pair with state-transition matrix |
| `VAL-035` | tenant-scoped business keys | employee code, requisition code, connector references | uniqueness scope | uniqueness must be enforced within tenant and any narrower configured scope, not globally unless required by law | Hard block | critical for multi-tenant correctness |
| `VAL-036` | self-referential relationships | manager, approver, family, reviewer references | referential | user cannot be their own manager, direct approver, or invalid self-dependent relation | Hard block | also applies to cyclic hierarchy detection |
| `VAL-037` | mandatory-before-transition | all workflow-driven objects | cross-field and lifecycle | state transition must fail if required fields, docs, or approvals are missing | Hard block | pair with workflow and state matrices |
| `VAL-038` | uploads and attachments | documents and media | file validation | enforce MIME allowlist, max size, extension policy, filename sanitization, and malware-scan hook | Hard block | do not rely only on frontend input constraints |
| `VAL-039` | import files | implementation and migration | batch validation | support per-row validation, duplicate detection, dependency ordering, and rule severity classification | Hard block plus exception report | migration mode may allow governed warnings |
| `VAL-040` | improbable personal data patterns | names, DOB, contact, dependent data | anomaly detection | flag suspicious but syntactically valid data like repeated characters, obviously fake names, duplicate contact clusters, or implausible family patterns | Warning first, then policy escalation | ideal target for AI-assisted data quality monitoring |
| `VAL-041` | soft-deleted records | all soft-deletable objects | lifecycle and query integrity | soft-deleted rows must be excluded from normal reads, search, selectors, approvals, reports, and uniqueness checks unless the design explicitly includes privileged historical access | Hard block | restore and audit views may expose soft-deleted rows under governed permission |
| `VAL-042` | business date and cutoff calculations | attendance, leave, payroll, shift, and SLA-sensitive flows | timezone semantics | `today`, `yesterday`, cutoffs, and business-day boundaries must be computed from explicit tenant, legal-entity, or work-location timezone rather than implicit server UTC | Hard block | use configurable IANA timezone source with clear precedence rules |
| `VAL-043` | high-risk submit or approve commands | workflow, leave, payroll, imports, bank changes, and similar flows | concurrency and replay protection | every high-risk write command shall enforce idempotency token, object version guard, or equivalent replay-safe mechanism so double-clicks or network retries do not create duplicate actions | Hard block | frontend debounce helps UX but server-side protection is mandatory |
| `VAL-044` | concurrent approvals on same object | workflow and approval-driven objects | concurrency conflict | when two approvers act on the same actionable item, only the first valid state transition may succeed and all later actions must fail as stale-state conflicts | Hard block | use optimistic locking or action-token invalidation |
| `VAL-045` | exited or ineligible user login | employee, contractor, admin, and platform access | identity lifecycle | separated, expired, suspended, or deprovisioned users must not retain interactive login eligibility or active sessions beyond configured grace rules | Hard block | support emergency lockout and downstream IdP deprovision hooks |
| `VAL-046` | tenant boundary on all reads and writes | all multi-tenant services and imports | tenancy isolation | global identifiers must never bypass tenant scoping and every request, query, event, and import row must resolve inside the current tenant boundary | Hard block | critical SaaS leakage-prevention rule |
| `VAL-047` | user identity keys | platform and tenant user directories | identifier integrity | every user must have a globally unique provider identity plus a tenant-scoped org identity where applicable, and neither key may be silently repurposed for the other | Hard block | applies to platform admins, org admins, employees, and contingent users |
| `VAL-048` | upload file size | documents, profile uploads, imports, and evidence attachments | file validation | enforce server-side maximum file-size limits by upload channel and document class before persistence or malware scanning handoff | Hard block | limits should be centrally configurable and surfaced in UX guidance |
| `VAL-049` | import preview and commented error feedback | all import templates and migration batches | staging and precommit control | imports must land in preview or staging first, show row-level error comments and warning comments, and only update production tables after explicit governed commit | Hard block | preview should preserve source row numbers, source keys, and comment severity |

# 5. Validation Severity Model

| Severity Mode | Meaning | Typical Use |
|---|---|---|
| `Hard block` | request cannot proceed | identity, legal, payroll, security, or state-integrity rules |
| `Soft warning` | request can proceed but user must acknowledge or reviewer must inspect | plausibility checks and non-legal anomalies |
| `Exception-with-approval` | request is blocked unless an authorized override workflow is used | migration cleanups, documented legal exceptions, emergency corrections |

# 6. Special Date Handling Rules

## 6.1 Leap-Year Rules

- date pickers must not allow invalid dates
- stored dates must preserve actual entered dates, including `29-Feb`
- age, tenure, anniversary, and benefit-cycle calculations must use a single documented fallback rule for non-leap years
- fallback policy must be configurable by use case rather than hardcoded globally

## 6.2 Legal and Biological Plausibility Rules

- legal-age checks must be jurisdiction-aware
- plausibility checks should support exception pathways for adoption, surrogacy, blended families, and historical correction cases
- do not silently auto-correct implausible dates; always force explicit user action or review

# 7. OTP and Sensitive-Field Change Rules

- mobile-number addition or update must not become active until OTP is verified
- if OTP verification fails or expires, the pending value must remain untrusted
- sensitive identifier updates such as PAN, Aadhaar, UAN, and bank details should support maker-checker or evidence attachment where policy requires
- high-risk changes should emit audit events and optionally trigger out-of-band notifications

# 8. Engineering Rules

- each high-risk field should eventually map to a stable `Field Ref` plus one or more `Rule Ref` values
- server-side services must never trust client-side validation alone
- country-specific validation profiles should be data-driven where feasible
- warning-mode validations must still be logged for downstream quality reporting
- import flows should support validation severity classes: `block`, `warn`, and `allow-with-override`
- operational validation must cover timezone boundaries, idempotency, concurrency, soft-delete behavior, and tenant-isolation guarantees in addition to field syntax

# 9. Immediate Follow-On Use

This matrix should drive:

- DTO and API validation rules
- dynamic-form validation metadata
- import and migration validation engines
- QA boundary and negative test design
- exception and override workflows
