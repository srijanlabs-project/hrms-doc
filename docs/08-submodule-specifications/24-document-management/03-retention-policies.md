---
id: HRMS-SUB-24-03
title: Retention policies Specification
document: 03-retention-policies.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Retention Policies governs how documents, evidence, records, and repository artifacts are retained, archived, held, reviewed, and ultimately purged or preserved.

In scope:

- Retention-rule definition
- Record-classification linkage
- Legal hold and investigation hold behavior
- Archive, review, purge, and exception handling
- Evidence and audit support for record lifecycle management

# 2. Business

Document retention is a legal, compliance, and privacy obligation. HRMS platforms must hold some records for years while removing others when no longer justified. Weak retention control increases regulatory risk, privacy exposure, storage cost, and audit failure.

Business objectives:

- Apply consistent retention treatment by document type and jurisdiction
- Preserve required records while avoiding over-retention
- Support legal hold and investigation needs without ad hoc file handling
- Provide auditable evidence of retention and purge decisions

# 3. Functional

The system shall support:

- Retention policies by document class, record context, country, legal entity, and regulatory basis
- Active retention, archive retention, and purge eligibility stages
- Legal hold, investigation hold, and exception hold behavior
- Scheduled retention review, purge execution, and purge deferral
- Inheritance of retention from linked business process such as employee lifecycle, case, or compliance record
- Reporting of upcoming retention milestones and hold inventory

Detailed rules:

- Legal hold must override scheduled purge until explicitly released
- Retention calculation should support date anchors such as creation date, separation date, closure date, or contract end date
- Policy changes should affect future lifecycle behavior while preserving evidence of prior retention basis
- Purge should be irreversible in production but preceded by approval or review where policy requires
- Mixed-scope records linked to multiple business contexts should resolve against the strictest applicable retention rule unless otherwise approved
- Sample or dry-run review should be possible before high-volume purge batches execute
- Records under investigation but not formal legal hold should support a lighter exception-hold class where policy allows

# 4. UX

Primary screens:

- Retention policy catalog
- Retention rule editor
- Archive and purge review queue
- Legal hold dashboard
- Record retention timeline view

UX expectations:

- Policy owners should understand how rules apply by document class and date anchor
- Compliance teams should review upcoming purge candidates with clear reason and hold status
- Repository users should see retention state without needing to interpret legal policy text

# 5. API

Representative APIs:

- `POST /api/v1/documents/retention-policies`
- `GET /api/v1/documents/retention-policies/{policyId}`
- `POST /api/v1/documents/records/{recordId}/legal-hold`
- `POST /api/v1/documents/retention/review`
- `POST /api/v1/documents/retention/purge`
- `GET /api/v1/documents/retention/timeline/{recordId}`

# 6. Database

Core entities:

- `retention_policy`
- `retention_policy_version`
- `record_retention_assignment`
- `record_retention_event`
- `legal_hold`
- `purge_execution_batch`

Key fields:

- Policy code, document class, jurisdiction, legal basis, active status
- Retention anchor type, active-retention duration, archive duration, purge review rule
- Record ID, assigned policy version, calculated purge eligibility date
- Hold type, hold owner, hold reason, hold release date
- Purge batch, approved by, executed at, exception count
- Override rationale, dry-run result summary, and strictest-rule resolution indicator
- Notification lead time and archive-tier target

# 7. Events

Published events:

- `retention.policy_published`
- `retention.review_due`
- `retention.hold_applied`
- `retention.hold_released`
- `retention.purge_completed`

Consumed events:

- `employee.separated`
- `case.closed`
- `investigation.opened`
- `document.classification_changed`

# 8. Reports

Required reports:

- Retention inventory report
- Upcoming purge review report
- Legal hold report
- Purge execution report
- Over-retained document exception report
- Dry-run purge impact report
- Retention-policy conflict report

# 9. Dashboards

Operational dashboards:

- Records due for archive or purge
- Active legal holds
- Purge backlog by document class
- Policy coverage by repository type
- Over-retention risk hotspots

# 10. Security

Security requirements:

- Retention-policy and purge rights should be limited to compliance-authorized roles
- Legal hold records may be highly sensitive and require separate visibility
- Purge operations should follow strong confirmation and segregation-of-duties rules

# 11. Audit

Audit coverage shall include:

- Policy creation and revision
- Legal-hold application and release
- Retention-date recalculation events
- Purge approvals and execution results
- User access to restricted hold information

# 12. AI

AI-assisted opportunities:

- Suggest likely retention classification from document type and linked record
- Detect records likely assigned to incorrect retention policy
- Summarize over-retention or purge-risk themes for compliance teams

AI guardrails:

- AI suggestions must not execute purge, archive, or hold actions automatically
- Conflicted-rule recommendations should show the policy factors that drove the suggestion

# 13. Test Cases

Core test scenarios:

- Apply retention policy based on document class and employee separation date
- Block purge while legal hold is active
- Recalculate retention after linked-case closure date changes
- Execute purge batch with audit evidence
- Report records that exceed intended retention period
- Run dry-run purge and verify no destructive action occurs
- Resolve strictest-applicable retention rule across multi-linked records

# 14. Workflows

Primary workflow:

1. Policy owner defines retention rule.
2. Records inherit or are assigned policy based on classification and context.
3. System tracks archive and purge milestones.
4. Holds override lifecycle where needed.
5. Purge or continued retention is executed with audit evidence.

# 15. State Machine

Record retention state model:

- `Active Retention`
- `Archive Eligible`
- `Archived`
- `Purge Review`
- `On Hold`
- `Purged`

# 16. Permissions

Representative permissions:

- `retention_policy.manage`
- `retention_hold.manage`
- `retention_review.perform`
- `retention_purge.execute`
- `retention_timeline.view`
- `retention_audit.view`

# 17. Notifications

Notification scenarios:

- Purge review due
- Legal hold applied
- Legal hold release pending review
- Purge batch completed or failed
- Over-retention anomaly detected

# 18. Configuration

Configurable parameters:

- Date anchors
- Archive durations
- Purge approval thresholds
- Hold taxonomy
- Jurisdictional override rules

# 19. Edge Cases

Important edge cases:

- Same record is subject to multiple legal jurisdictions
- Linked business record date changes after retention already calculated
- Document is reclassified after years of storage
- Purge batch starts while new legal hold is applied concurrently
