---
id: HRMS-SUB-20-02
title: Compliance Specification
document: 02-compliance.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Contractor Compliance governs the monitoring, validation, expiry control, and exception management of mandatory documents, trainings, permits, insurance, statutory artifacts, and workforce controls required for external workers.

In scope:

- Compliance requirement definition and assignment
- Document and evidence collection
- Expiry, renewal, and suspension triggers
- Compliance review and exception handling
- Integration to access, site entry, and contractor lifecycle controls

# 2. Business

External workforce compliance is often a major audit and legal risk area because third-party workers may require different permits, certifications, insurance, tax forms, safety trainings, and contractual evidence before they can enter a site or access systems. Weak compliance control can lead to safety incidents, unauthorized site presence, legal penalties, and vendor disputes.

Business objectives:

- Ensure contractors meet all required compliance prerequisites before activation and during engagement
- Reduce audit findings through centralized evidence and expiry tracking
- Trigger timely renewal, suspension, or offboarding action when compliance fails
- Support site, country, vendor, and role-specific compliance differences

Key stakeholders:

- Vendor Management and Procurement
- Site Administration and Security
- EHS, Risk, and Compliance Teams
- HR and External Workforce Operations
- Audit and Legal

# 3. Functional

The system shall support:

- Requirement sets by contractor category, site, country, vendor type, role, or activity
- Collection of licenses, certifications, insurances, IDs, medical clearance, induction completion, tax forms, and contractual artifacts
- Expiry-date tracking, renewal reminders, and grace-period logic
- Compliance review, approval, rejection, waiver, and exception pathways
- Suspension or restricted-access outcomes when critical compliance lapses
- Site-entry and system-access integration based on real-time compliance status

Detailed rules:

- Critical compliance failures should block activation or trigger suspension automatically where policy requires
- Expiry calculations must use the valid-from and valid-to semantics of each document or requirement type
- Waivers must be explicit, time-bound, risk-scored, and auditable
- Different sites or countries may require different evidence for the same contractor role
- Compliance status should be explainable at requirement level, not just pass or fail at summary level

# 4. UX

Primary screens:

- Contractor compliance dashboard
- Requirement and evidence checklist
- Expiry and renewal queue
- Exception and waiver review panel
- Site-readiness summary

UX expectations:

- Compliance teams should see blocker status, missing evidence, and expiry risk instantly
- Vendors or sponsors should understand exactly what evidence is missing or rejected
- Site admins should be able to consume a simple readiness outcome without accessing excess personal detail

# 5. API

Representative APIs:

- `POST /api/v1/external-workforce/compliance/cases`
- `GET /api/v1/external-workforce/compliance/cases/{caseId}`
- `POST /api/v1/external-workforce/compliance/cases/{caseId}/evidence`
- `POST /api/v1/external-workforce/compliance/cases/{caseId}/approve`
- `POST /api/v1/external-workforce/compliance/cases/{caseId}/waive`
- `POST /api/v1/external-workforce/compliance/cases/{caseId}/suspend-access`

API expectations:

- Evidence APIs must support upload, metadata extraction, rejection, and resubmission
- Compliance-evaluation APIs should return requirement-level outcomes with severity and expiry detail
- Waiver and suspend-access APIs must require explicit reason, duration, and operator authority

# 6. Database

Core entities:

- `contractor_compliance_case`
- `contractor_compliance_requirement`
- `contractor_compliance_evidence`
- `contractor_compliance_review`
- `contractor_compliance_waiver`
- `contractor_compliance_expiry_alert`

Key fields:

- Contractor ID, requirement set, site, country, role, status
- Requirement type, criticality, due date, expiry date, grace period
- Evidence type, file reference, issuer, validation result, reviewer
- Waiver reason, expiry, risk rating, approver
- Access-block indicator, suspension trigger, vendor escalation status

Data design expectations:

- Compliance records should support both current snapshot and historical evidence lineage
- Evidence should be associated to requirement and contractor context, not only stored as generic document files
- Expiry alerts should remain linked to the evidence artifact that triggered them

# 7. Events

Published events:

- `contractor_compliance.case_created`
- `contractor_compliance.evidence_submitted`
- `contractor_compliance.approved`
- `contractor_compliance.failed`
- `contractor_compliance.expiry_due`
- `contractor_compliance.suspension_triggered`

Consumed events:

- `contractor.activated`
- `site.rule_changed`
- `training.completed`
- `insurance.policy_renewed`
- `access.badge_requested`

# 8. Reports

Required reports:

- Contractor compliance status report
- Expired or expiring compliance report
- Waiver report
- Site-readiness report
- Vendor compliance performance report

# 9. Dashboards

Operational dashboards:

- Contractors blocked by compliance failure
- Expiry heatmap by site and vendor
- Waivers awaiting review
- High-risk compliance gaps
- Renewal backlog and SLA status

# 10. Security

Security requirements:

- Compliance evidence may include IDs, medical fitness, or insurance-sensitive data and must be access-controlled
- Site-readiness outputs should reveal only what the consumer needs to act
- Waiver and suspension controls should be restricted to risk-authorized roles

# 11. Audit

Audit coverage shall include:

- Requirement assignment changes
- Evidence upload, rejection, and approval
- Waiver creation, extension, and expiry
- Automatic suspension or reactivation triggered by compliance state
- Sensitive evidence access and export

# 12. AI

AI-assisted opportunities:

- Extract document metadata and expiry dates from uploaded evidence
- Predict likely compliance failure before engagement start
- Cluster vendors or sites with recurring non-compliance patterns

AI guardrails:

- AI may suggest classification or expiry but must not auto-approve critical compliance evidence
- Medical or regulated document data should follow strict privacy controls in AI flows

# 13. Test Cases

Core test scenarios:

- Block contractor activation for missing critical requirement
- Approve valid evidence and mark requirement satisfied
- Trigger expiry alert and suspension after grace period
- Apply time-bound waiver and expire it correctly
- Restore compliant status after renewed evidence submission

# 14. Workflows

Primary workflow:

1. Contractor engagement creates or updates compliance case.
2. Required evidence is requested from vendor, sponsor, or contractor.
3. Compliance team reviews and approves or rejects evidence.
4. Expiry and renewal monitoring runs throughout active engagement.
5. Compliance failures trigger restriction, suspension, or offboarding action.

# 15. State Machine

Compliance case state model:

- `Draft`
- `Pending Evidence`
- `Under Review`
- `Compliant`
- `Non-Compliant`
- `Waived`
- `Suspended`
- `Closed`

# 16. Permissions

Representative permissions:

- `contractor_compliance.manage`
- `contractor_compliance.review`
- `contractor_compliance.waive`
- `contractor_compliance.suspend`
- `contractor_compliance.view_sensitive`
- `contractor_compliance.audit.view`

# 17. Notifications

Notification scenarios:

- Evidence required
- Evidence rejected and resubmission needed
- Expiry approaching
- Critical compliance failure triggered suspension
- Waiver nearing expiry

# 18. Configuration

Configurable parameters:

- Requirement sets by site, category, or geography
- Critical vs non-critical rule model
- Reminder cadence and grace periods
- Waiver approval thresholds
- Access-block integration behavior

# 19. Edge Cases

Important edge cases:

- Same contractor works at multiple sites with different requirement sets
- Evidence is valid in one country but not another
- Contractor is active when a new compliance rule is introduced mid-engagement
- Vendor submits bulk evidence with mixed validity across workers
