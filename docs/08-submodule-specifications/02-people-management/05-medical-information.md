---
id: HRMS-SUB-02-05
title: Medical information Specification
document: 05-medical-information.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Medical Information governs the controlled management of employee health-related data that is legitimately required for occupational safety, statutory compliance, insurance operations, or workplace accommodation.

In scope:

- Fitness, disability, and accommodation records
- Occupational health declarations where legally allowed
- Medical certificates linked to leave, incident, or benefits workflows
- Blood group and emergency-health fields where policy permits
- Strict access, consent, retention, and minimization controls

# 2. Business

Medical information is among the most sensitive data in the HRMS estate. It must be captured only when necessary, protected rigorously, and made available only to authorized workflows such as emergency response, safety compliance, disability accommodation, and insurance support.

Business outcomes:

- Support lawful and minimal handling of health-related employee data
- Improve readiness for workplace accommodations and safety response
- Provide verifiable linkage between medical evidence and approved HR processes
- Reduce unauthorized visibility or misuse of sensitive health information

# 3. Functional

The system shall support:

- Medical-profile elements that are explicitly approved by policy and jurisdiction
- Storage of medical certificates for leave, injury, disability, or accommodation cases
- Occupational health statuses such as fit, fit with restrictions, unfit, or under review
- Accommodation requests and restrictions linked to work arrangements, equipment, or scheduling
- Consent capture where legal basis requires explicit employee authorization
- Restricted attachment storage for health documents
- Expiry and review tracking for temporary medical restrictions
- Separation between general profile data and confidential medical-case data

Validation rules:

- Only configured medical fields may be collected for a given country or workforce segment
- Access to medical data shall require role, purpose, and sometimes case assignment validation
- Sensitive medical documents shall not be downloadable by general HR or managers unless policy permits
- Expired temporary restriction shall trigger review rather than silent deletion

# 4. UX

The user experience shall provide:

- Highly restricted medical-information screens with clear confidentiality labeling
- Separate employee process views for submitting certificates or accommodation requests
- Occupational-health case view for authorized staff only
- Minimal-exposure summaries for managers, showing only work-relevant restrictions where allowed

# 5. API

Representative APIs:

- `GET /api/v1/people/employees/{employeeId}/medical-information`
- `POST /api/v1/people/employees/{employeeId}/medical-certificates`
- `POST /api/v1/people/employees/{employeeId}/accommodation-requests`
- `PATCH /api/v1/people/medical-cases/{caseId}`
- `POST /api/v1/people/medical-cases/{caseId}/consent`

API requirements:

- APIs shall enforce purpose-based authorization, not just broad role checks
- Non-privileged responses shall return only work-relevant flags, not diagnosis details
- Attachment retrieval shall be logged and optionally watermark-controlled

# 6. Database

Core entities:

- `employee_medical_profile`
- `medical_certificate`
- `medical_case`
- `workplace_accommodation`
- `medical_consent_record`
- `medical_access_log`

Key data requirements:

- Medical profile fields shall be configurable and sparse by jurisdiction
- Medical cases shall separate confidential details from employment-facing restrictions
- Consent records shall store basis, scope, and revocation date where applicable

# 7. Events

The platform shall publish:

- `employee.medical-certificate.submitted`
- `employee.medical-restriction.updated`
- `employee.accommodation.requested`
- `employee.medical-consent.updated`

# 8. Reports

Required reports:

- Occupational restriction review report
- Accommodation request status report
- Medical-certificate linkage report for leave or injury cases
- Sensitive-data access review report

# 9. Dashboards

Dashboards shall show:

- Open accommodation and fitness-review cases
- Expiring temporary restrictions
- Pending confidential-case review workload
- Access-review anomalies for health data

# 10. Security

Security controls shall include:

- Strong encryption and separate handling policies for medical records
- Need-to-know and purpose-based access enforcement
- Enhanced audit on view, export, and attachment access
- Retention and purge rules aligned with local health-data laws

# 11. Audit

The audit trail shall capture:

- Every access to medical records or attachments
- Consent creation, update, and revocation
- Case status changes and restriction updates
- Manager-visible summary changes derived from medical cases

# 12. AI

AI capabilities may include:

- Classification of uploaded certificate types
- Detection of missing required supporting data
- Reminder suggestions for review of temporary accommodations

AI guardrails:

- AI shall not infer diagnosis or make medical judgments
- AI shall not expose sensitive details to non-authorized audiences

# 13. Test Cases

Minimum test coverage shall include:

- Manager sees only approved work restriction summary
- Unauthorized HR user cannot access medical attachment
- Consent-required workflow blocks save until consent exists
- Temporary restriction expiry triggers review notification
- Medical certificate links correctly to leave case

# 14. Workflows

Primary workflow:

1. Medical data or document is submitted through authorized process.
2. System validates legal basis, permissions, and required evidence.
3. Authorized reviewer updates status or accommodation outcome.
4. Employment-facing restrictions are published in controlled summary form.
5. Retention and review rules govern ongoing storage and expiry.

# 15. State Machine

Supported states:

- `draft`
- `submitted`
- `under-review`
- `approved`
- `restricted-active`
- `expired-review`
- `closed`
- `purged`

# 16. Permissions

Permissions shall include:

- View work-restriction summary
- View confidential medical case
- Upload medical certificate
- Approve accommodation or restriction outcome
- Access audit logs for medical data

# 17. Notifications

Notifications shall support:

- Confidential review tasks for occupational-health users
- Employee acknowledgment of submitted medical evidence
- Expiry reminders for temporary restrictions
- Minimal manager notice when work-impacting accommodation is approved

# 18. Configuration

Administrators shall configure:

- Allowed medical-data fields by jurisdiction
- Access scopes and purpose categories
- Consent requirements
- Retention and purge schedules
- Accommodation and restriction classifications

# 19. Edge Cases

The design shall address:

- Jurisdiction forbids storing certain health attributes entirely
- Same medical certificate supports both leave and insurance claim processes
- Employee revokes consent after lawful collection
- Emergency response requires blood group visibility but only for a limited population
- Accommodation applies only temporarily during phased return to work
