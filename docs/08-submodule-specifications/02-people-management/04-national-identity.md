---
id: HRMS-SUB-02-04
title: National identity Specification
document: 04-national-identity.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

National Identity governs the secure capture, verification, maintenance, and controlled use of government-issued identity and work-eligibility records.

In scope:

- National ID, passport, visa, permit, and social identifiers
- Verification status and evidence management
- Expiry tracking and renewal workflows
- Jurisdiction-specific storage and masking rules
- Downstream use in payroll, travel, background checks, and compliance

# 2. Business

Identity records are highly sensitive and legally regulated. They are essential for right-to-work checks, statutory reporting, travel booking, banking, benefits, and background verification, but must be stored and used with strict governance.

Business outcomes:

- Maintain compliant and accurate identity records
- Reduce risk from expired, missing, or invalid work-authorization data
- Support audit and verification without uncontrolled data exposure
- Enable country-specific identity practices in a global platform

# 3. Functional

The system shall support:

- Multiple identity-document types per employee with country mapping
- Document number, issue date, expiry date, issuing authority, and status
- Verification status such as unverified, pending, verified, failed, or expired
- Upload of document images and proof of validation artifacts
- Expiry monitoring for passport, visa, permit, and license-type identities
- History preservation for replaced or reissued identifiers where legally allowed
- Self-service submission with HR or compliance verification
- Country-specific constraints on uniqueness, masking, and retention

Validation rules:

- Identity format and checksum validation shall be configurable by document type and country
- Expired work-authorization documents shall trigger compliance warning and workflow restrictions where required
- Duplicate active identity number shall be blocked or escalated based on document type
- Some identifiers shall be stored only in masked or tokenized form if policy requires
- PAN shall follow `^[A-Z]{5}[0-9]{4}[A-Z]$` where PAN is applicable
- Aadhaar shall be exactly `12` numeric digits and may additionally enforce checksum validation where storage policy allows
- Passport, visa, permit, and national-ID formats shall be validated using issuing-country aware rule profiles
- Issue date, expiry date, and status shall remain cross-field consistent so an expired document cannot remain active silently

# 4. UX

The user experience shall provide:

- Secure identity-record workspace with masked default display
- Document upload with quality and expiry guidance
- HR verification screen showing evidence, status, and exception notes
- Reminder banners for upcoming expiries and missing mandatory identity records

# 5. API

Representative APIs:

- `GET /api/v1/people/employees/{employeeId}/identity-records`
- `POST /api/v1/people/employees/{employeeId}/identity-records`
- `PATCH /api/v1/people/identity-records/{recordId}`
- `POST /api/v1/people/identity-records/{recordId}/verify`
- `POST /api/v1/people/identity-records/{recordId}/renewal`

API requirements:

- Full identifier values shall be returned only to privileged roles
- Verification endpoints shall preserve verifier identity and evidence reference
- Audit-safe retrieval modes shall support masked and unmasked variants

# 6. Database

Core entities:

- `employee_identity_record`
- `identity_document_attachment`
- `identity_verification_log`
- `identity_expiry_alert`
- `identity_country_rule`

Key data requirements:

- Identity records shall store document type, number token, masked display value, and effective status
- Verification logs shall capture actor, method, date, and outcome
- Country rules shall define format, uniqueness, retention, and masking behavior

# 7. Events

The platform shall publish:

- `employee.identity-record.created`
- `employee.identity-record.verified`
- `employee.identity-record.expiring`
- `employee.identity-record.expired`
- `employee.work-authorization.at-risk`

# 8. Reports

Required reports:

- Missing mandatory identity report
- Expiring work-authorization report
- Failed verification and duplicate-identity exception report
- Identity-document audit history report

# 9. Dashboards

Dashboards shall show:

- Verification completion by population
- Upcoming expiries by country and document type
- High-risk compliance exceptions
- Identity-data quality trend

# 10. Security

Security controls shall include:

- Encryption at rest and in transit for all identity data and attachments
- Role-based masking and just-in-time access for full values
- Download restrictions and watermarking for sensitive documents
- Retention and deletion aligned with jurisdictional requirements

# 11. Audit

The audit trail shall capture:

- View, create, update, and delete actions on identity records
- Verification decisions and evidence access
- Unmask events for privileged users
- Expiry-rule changes and alert dismissals

# 12. AI

AI capabilities may include:

- OCR-assisted capture from uploaded documents
- Data-extraction confidence scoring and mismatch detection
- Expiry-risk forecasting for compliance teams

AI guardrails:

- OCR output shall require human review before final save
- AI shall not auto-verify identity documents

# 13. Test Cases

Minimum test coverage shall include:

- Duplicate active passport number triggers exception
- Expired visa changes compliance status correctly
- Unauthorized user sees masked identifier only
- OCR extraction allows manual correction before save
- Country rule enforces document-specific format validation

# 14. Workflows

Primary workflow:

1. Employee or HR submits identity record and evidence.
2. System validates country and document rules.
3. Verifier reviews and approves or rejects.
4. Expiry monitoring runs throughout document life.
5. Renewal or replacement updates historical lineage.

# 15. State Machine

Supported states:

- `draft`
- `pending-verification`
- `verified`
- `rejected`
- `expiring`
- `expired`
- `replaced`
- `archived`

# 16. Permissions

Permissions shall include:

- View masked identity data
- View full identity data
- Create or edit identity records
- Verify identity documents
- Download identity attachments
- Manage retention and purge controls

# 17. Notifications

Notifications shall support:

- Missing mandatory identity reminders
- Expiry warnings to employee and compliance owners
- Verification approval and rejection notices
- High-risk work-authorization escalation alerts

# 18. Configuration

Administrators shall configure:

- Identity-document types by country
- Format and checksum rules
- Expiry reminder thresholds
- Masking, retention, and approval requirements
- Country-specific format rules for passport, permit, and national-ID types
- Whether checksum validation is enabled for eligible identifiers such as Aadhaar

# 19. Edge Cases

The design shall address:

- Employee has multiple citizenships and passports
- Country prohibits storage of full identifier after verification
- Identity number changes due to reissue or legal correction
- Employee works in one country with permit from another
- Document image is unreadable but urgent onboarding must proceed under exception flow
