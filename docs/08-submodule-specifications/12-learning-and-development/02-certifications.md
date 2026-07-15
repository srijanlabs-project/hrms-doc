---
id: HRMS-SUB-12-02
title: Certifications Specification
document: 02-certifications.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Certifications governs professional, regulatory, technical, and internal certification records required for role eligibility, development, customer commitments, and compliance.

In scope:

- Certification catalog and requirement mapping
- Certification attainment and verification
- Expiry, renewal, and suspension risk tracking
- Role and skill eligibility linkage
- Evidence storage and auditability

# 2. Business

Certifications can be mandatory for legal compliance, customer contracts, safety, quality standards, or internal role architecture. Without a governed certification process, employees may perform regulated work without valid credentials, creating compliance and business risk.

Business objectives:

- Maintain verified certification records for each applicable worker
- Prevent lapses in mandatory credentials
- Support role eligibility, staffing decisions, and audit evidence
- Improve visibility into renewal risk and certification coverage

# 3. Functional

The system shall support:

- Certification types such as external license, internal certification, technical accreditation, safety qualification, and customer-required credential
- Requirement mapping by role, job family, geography, project, customer account, or workforce type
- Attainment through internal completion, external upload, or verified admin entry
- Expiry, renewal, grace period, suspension, and revocation tracking
- Verification of issuer, certificate number, evidence, and approval state
- Linkage to skill profiles, compliance rules, staffing eligibility, or contractor access

Detailed rules:

- Mandatory certifications should block eligibility for specific work or roles when expired or missing
- Renewal reminders must be driven by valid-until dates and configurable lead times
- External evidence should support review and revalidation rather than blind acceptance
- Same certification may have different validity windows by region or issuer
- Equivalency mappings should be explicit and auditable where one credential can satisfy another requirement
- Revoked certifications must immediately affect role-eligibility outcomes when configured as critical

# 4. UX

Primary screens:

- Certification catalog
- Employee certification profile
- Verification and evidence review queue
- Expiry and renewal dashboard
- Role eligibility view

UX expectations:

- Employees should know which certifications they hold, which are expiring, and what action is needed
- Managers should see staffing risk caused by missing or expiring credentials
- Admins should review evidence and validity without navigating across multiple modules

# 5. API

Representative APIs:

- `POST /api/v1/learning/certifications`
- `POST /api/v1/learning/certifications/{certificationId}/records`
- `GET /api/v1/learning/certifications/records/{recordId}`
- `POST /api/v1/learning/certifications/records/{recordId}/verify`
- `POST /api/v1/learning/certifications/records/{recordId}/renew`
- `GET /api/v1/learning/certifications/eligibility`

# 6. Database

Core entities:

- `certification_catalog`
- `certification_requirement`
- `certification_record`
- `certification_verification`
- `certification_renewal_case`
- `certification_evidence`

Key fields:

- Certification code, type, issuer, role applicability, validity rules
- Employee ID, certification number, issue date, expiry date, status
- Verification source, verifier, confidence, approval status
- Renewal due date, grace period end, blocker flag
- Evidence file reference, issuer metadata, review comment
- Equivalency group, criticality tier, regulatory flag
- Staffing-eligibility impact and compliance-block indicator

# 7. Events

Published events:

- `certification.record_created`
- `certification.verified`
- `certification.expiry_due`
- `certification.expired`
- `certification.renewed`

Consumed events:

- `learning.course_completed`
- `employee.role_changed`
- `project.staffing_request_created`
- `contractor.compliance.case_created`

# 8. Reports

Required reports:

- Certification coverage report
- Expiring certification report
- Missing mandatory certification report
- Renewal completion report
- Verification exception report
- Equivalency-usage report
- Customer- or project-specific credential readiness report

# 9. Dashboards

Operational dashboards:

- Certification expiry risk by team
- Role eligibility gaps
- Verification backlog
- Renewal completion status

# 10. Security

Security requirements:

- Certification evidence may contain IDs or sensitive personal information and must be protected
- Eligibility views should expose only information necessary for staffing or compliance decisions
- Verification and override rights should be limited to authorized roles

# 11. Audit

Audit coverage shall include:

- Certification record creation and edit history
- Verification and approval actions
- Renewal and expiry state changes
- Evidence access and export
- Manual override of mandatory-status decisions

# 12. AI

AI-assisted opportunities:

- Extract issuer and expiry metadata from uploaded certificates
- Predict renewal risk or likely lapse populations
- Suggest equivalent certifications where policy permits mapping

AI guardrails:

- AI metadata extraction should remain reviewable before activating certification status
- Eligibility-blocking recommendations must not bypass human validation for regulated roles

# 13. Test Cases

Core test scenarios:

- Create verified certification record
- Trigger expiry reminder at configured lead time
- Block role eligibility for expired mandatory certification
- Renew certification and restore active status
- Reject invalid uploaded evidence
- Apply equivalency mapping to satisfy a role requirement
- Revoke previously active certification and update downstream eligibility

# 14. Workflows

Primary workflow:

1. Certification requirement is defined.
2. Employee attains or uploads evidence.
3. Admin or system verifies the certification.
4. Expiry monitoring and renewal reminders run.
5. Eligibility and compliance consumers use the active certification state.

# 15. State Machine

Certification record state model:

- `Draft`
- `Pending Verification`
- `Active`
- `Expiring`
- `Expired`
- `Revoked`
- `Renewed`

# 16. Permissions

Representative permissions:

- `certification_catalog.manage`
- `certification_record.create`
- `certification_record.verify`
- `certification_record.override`
- `certification_record.view_sensitive`
- `certification_audit.view`

# 17. Notifications

Notification scenarios:

- Certification due to expire
- Verification pending
- Certification expired
- Renewal approved or rejected
- Role eligibility impacted by certification lapse

# 18. Configuration

Configurable parameters:

- Validity periods
- Renewal reminder cadence
- Mandatory-role mappings
- Grace-period behavior
- Equivalent-certification rules

# 19. Edge Cases

Important edge cases:

- Same certification issued by different issuers with different validity rules
- Employee changes role requiring new certification while previous remains active
- Evidence shows renewal date but not explicit expiry date
- Certification remains active for one site but not another due to local rules
