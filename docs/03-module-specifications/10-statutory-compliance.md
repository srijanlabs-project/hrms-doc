---
id: HRMS-MOD-COM-10
title: Statutory and Compliance Specification
document: 10-statutory-compliance.md
version: 1.1
status: Draft
---

# 1. Business

Statutory and Compliance ensures payroll and workforce operations adhere to labor laws, tax rules, social security regulations, and audit obligations.

Business objectives:

- Support jurisdiction-specific statutory processing
- Reduce compliance risk and reporting effort
- Provide compliance calendars and control visibility
- Maintain auditable evidence for inspections and reviews

Primary stakeholders:

- Compliance teams
- Payroll teams
- HR operations
- Finance teams
- Auditors

Business scenarios:

- Administrators configure or maintain statutory and compliance records in line with tenant policy.
- Operational users execute day-to-day statutory and compliance transactions while the system enforces validations and approvals.
- Managers or approvers review exceptions, pending actions, and escalations related to statutory and compliance.
- Leadership, compliance, or analytics users consume consolidated outputs produced by statutory and compliance.

Success measures:

- Reduction in manual effort and rework for statutory and compliance operations
- Improved data completeness, timeliness, and control adherence for statutory and compliance
- Lower exception volume and faster turnaround for key statutory and compliance transactions
- Higher confidence in downstream reporting, payroll, analytics, or compliance outcomes linked to statutory and compliance

# 2. Functional

The Statutory and Compliance module shall support the full lifecycle of master data, operational transactions, approvals, downstream outputs, and exception handling required for enterprise HRMS deployments.

In-scope capability areas:

- PF, ESIC, professional tax, TDS, gratuity, bonus, minimum wages, and labor welfare processing support
- Country-specific compliance rules and filing calendars
- Compliance checks, statutory registers, and evidence retention
- Alerts for due dates, exceptions, and policy breaches

Core functional expectations:

- The system must provide create, view, update, search, filter, status, and history capabilities for statutory and compliance records where applicable.
- The system must validate mandatory data, business rules, cut-off conditions, policy eligibility, and dependency integrity before finalizing statutory and compliance actions.
- The system must support configurable approval, escalation, correction, cancellation, and reopen behaviors for high-impact statutory and compliance transactions where governance requires them.
- The module must expose reliable outputs to downstream modules, reports, dashboards, and integrations that depend on statutory and compliance.

Business rule themes:

- Configuration drives how statutory and compliance behaves across companies, geographies, worker types, and operating models.
- Historical accuracy must be preserved for material statutory and compliance changes through timestamps, status history, effective dates, snapshots, or equivalent patterns.
- Exception handling for statutory and compliance must be explicit and traceable rather than silently corrected.

# 3. UX

User experience should provide:

- Compliance calendar
- Statutory setup screen
- Exception monitor
- Register and filing export screen

Key screens:

- Compliance calendar
- Statutory setup screen
- Exception monitor
- Register and filing export screen

UX expectations:

- Users should understand the current status, next available actions, and ownership boundaries for every important statutory and compliance record.
- Critical validations for statutory and compliance should be shown inline and early, not only after full-form submission.
- Approvers and administrators should be able to review context, comments, exceptions, and history without leaving the statutory and compliance workflow.
- Views related to statutory and compliance should support responsive layouts, accessible controls, and keyboard-friendly behavior where web channels are used.

Design details to refine during implementation:

- Empty states, loading states, and permission-denied states for statutory and compliance screens
- Inline help, tooltips, and policy references for complex statutory and compliance actions
- Export, print, or document preview patterns associated with statutory and compliance

# 4. API

Representative APIs:

- `POST /api/v1/compliance/rules`
- `GET /api/v1/compliance/calendar`
- `POST /api/v1/compliance/checks/run`
- `GET /api/v1/compliance/registers`

API expectations:

- APIs must enforce role and data-scope validation for statutory and compliance operations.
- APIs should expose explicit status, history, approval, and dependency-aware responses for statutory and compliance.
- Critical statutory and compliance APIs should support idempotency, optimistic concurrency, and safe retry behavior.
- List and search APIs for statutory and compliance should support filtering, pagination, sorting, and export-friendly access patterns.

Integration contract expectations:

- Service contracts must make it clear which statutory and compliance actions are synchronous, asynchronous, or event-driven.
- Error payloads must separate validation failures, permission failures, business-rule conflicts, dependency issues, and transient platform errors.
- High-impact mutation APIs for statutory and compliance should include audit-friendly identifiers, timestamps, and actor context in responses or logs.

# 5. Database

Core entities:

- `statutory_rule`
- `compliance_calendar`
- `compliance_check_result`
- `statutory_register`
- `filing_status`

Data model expectations:

- The statutory and compliance data model should preserve business identifiers, technical identifiers, state metadata, and ownership references.
- Material statutory and compliance changes should be historized through effective dating, status history, snapshots, or immutable result records where appropriate.
- Referential integrity must prevent destructive change when dependent modules still rely on statutory and compliance data.
- Sensitive fields associated with statutory and compliance should support masking, encryption, or restricted access policies where required.

Database design concerns:

- Indexing should support the most common search, dashboard, approval queue, and reporting patterns for statutory and compliance.
- Archival or retention controls for statutory and compliance should not break audit traceability.
- Dynamic or tenant-specific fields for statutory and compliance should be modeled without compromising reporting and validation.

# 6. Events

Published events:

- `compliance.check.failed`
- `compliance.filing.generated`
- `compliance.deadline.reminder`

Consumed events:

- `payroll.run.closed`
- `employee.updated`

Event design expectations:

- Statutory and Compliance events must carry enough business context for downstream consumers to act without re-querying excessive state whenever practical.
- Event publication must be reliable, duplicate-safe, and compatible with reprocessing where statutory and compliance has regulatory or payroll impact.
- Event consumers that depend on statutory and compliance should handle late-arriving, retried, or out-of-order events gracefully.

# 7. Reports

Standard reports:

- `Statutory liability report`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.
- `Compliance exception report`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.
- `Filing readiness report`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.

Reporting expectations:

- Reports for statutory and compliance should support operational review, historical analysis, and compliance or audit evidence as needed.
- Report filters should generally support company, location, date range, status, employee scope, and approver or owner scope where applicable.

# 8. Dashboards

Dashboards should show:

- `Upcoming deadlines`: summary view intended to surface actionable indicators, pending issues, and movement over time.
- `Open compliance exceptions`: summary view intended to surface actionable indicators, pending issues, and movement over time.
- `Jurisdiction risk summary`: summary view intended to surface actionable indicators, pending issues, and movement over time.

Dashboard expectations:

- Dashboards must highlight pending action, SLA risk, trend movement, and exception hotspots for statutory and compliance.
- Executives and managers should see aggregated statutory and compliance indicators, while administrators should have drill-down capability into operational detail.

# 9. Security

Security requirements:

- Enforce role-based access with least-privilege defaults
- Protect sensitive data fields, exports, and administrative actions
- Support scoped access by tenant, company, geography, or team where applicable
- Require strong authentication for privileged operations
- Support approval and override controls for high-impact statutory and compliance actions.
- Restrict export, print, download, or API bulk-read paths for statutory and compliance where the module contains sensitive or payroll-impacting information.
- Support maker-checker, delegation, and segregation-of-duties enforcement where statutory and compliance exposes privileged operations.

# 10. Audit

Audit logs must capture:

- Capture create, update, approve, reject, and close actions
- Store actor, timestamp, source channel, and correlation reference
- Retain before-and-after values for material changes
- Support audit search and evidence export
- Capture module-specific changes, approvals, overrides, and exceptions for statutory and compliance records.
- Preserve sufficient evidence to reconstruct end-to-end statutory and compliance decisions during internal review, customer escalation, or compliance audit.

# 11. AI

AI opportunities:

- Highlight likely compliance breaches
- Explain rule impact on payroll outcomes
- Suggest missing setup for new geographies

AI guardrails:

- AI output related to statutory and compliance must be permission-aware and scoped to authorized data.
- AI suggestions should remain explainable, reviewable, and non-final for high-risk statutory and compliance decisions unless explicitly governed otherwise.

# 12. Test Cases

Representative test cases:

- Verify create, update, and view operations with valid data
- Verify permission boundaries for privileged and non-privileged roles
- Verify workflow transitions, approvals, and rejections
- Verify integration and event behavior for success and failure paths
- Verify reporting outputs and audit traceability
- Verify positive, negative, boundary, and recovery paths for the most critical statutory and compliance workflows.
- Verify that statutory and compliance behaves correctly across role scopes, company scopes, and tenant configuration variations.

# 13. Workflows

Key workflows:

- Compliance review workflow
- Statutory filing approval
- Exception remediation workflow

Typical workflow:

1. A user or system initiates a transaction based on configured rules.
2. The system validates data, permissions, and policy conditions.
3. Approval, notification, and integration steps run where required.
4. Final outcomes are recorded, audited, and exposed to downstream consumers.

Workflow checkpoints:

- Entry validation must reject invalid or incomplete statutory and compliance requests before they become operational debt.
- Mid-workflow status visibility must make it clear who owns the next step in a statutory and compliance process.
- Terminal states must be unambiguous so reports and downstream modules interpret statutory and compliance outcomes consistently.

# 14. State Machine

Primary states:

- Draft
- Configured
- Due
- Submitted
- Accepted
- Exception

Illustrative transition path:

- `Draft -> Configured`
- `Configured -> Due`
- `Due -> Submitted`
- `Submitted -> Accepted`
- `Accepted -> Exception`

State management expectations:

- Invalid transitions in statutory and compliance must be blocked and clearly explained to the caller or user.
- Reopen, rollback, or correction behavior for statutory and compliance must be explicit and audit-controlled.

# 15. Permissions

Typical roles:

- Compliance Admin
- Payroll Admin
- Finance Approver
- Auditor

Role expectations:

- `Compliance Admin`: view or act on statutory and compliance data according to configured responsibility and data scope.
- `Payroll Admin`: view or act on statutory and compliance data according to configured responsibility and data scope.
- `Finance Approver`: view or act on statutory and compliance data according to configured responsibility and data scope.
- `Auditor`: view or act on statutory and compliance data according to configured responsibility and data scope.

# 16. Notifications

Notifications should be sent for:

- Submission received
- Approval requested
- Approved or rejected outcome
- Exception or failure detected
- Completion or publish confirmation
- Critical cut-off, expiry, approval delay, or exception events affecting statutory and compliance.

Notification expectations:

- Channel, urgency, audience, and reminder behavior for statutory and compliance should be configurable but governed.
- Notification content for statutory and compliance should expose enough context to act without revealing unnecessary sensitive data.

# 17. Configuration

Configurable items:

- Jurisdiction rules
- Threshold values
- Calendar frequency
- Evidence retention policy

Configuration governance:

- Changes to statutory and compliance configuration should follow controlled release and approval practices where operational impact is high.
- Tenant-specific configuration for statutory and compliance should not break cross-module reporting, integrations, or auditability.

# 18. Edge Cases

- Mid-period regulation change
- Employee tax setup incomplete at close
- Conflicting country and company rules

Handling expectations:

- Edge conditions in statutory and compliance should be surfaced explicitly to users, support teams, and logs rather than silently ignored.
- Where auto-recovery is possible for statutory and compliance, the system should still preserve traceability of the correction path.

# 19. Dependencies

- Payroll
- People Management
- Security and Governance

Dependency expectations:

- Upstream dependencies must provide timely, valid, and scope-consistent inputs to statutory and compliance.
- Downstream consumers of statutory and compliance should not rely on undocumented side effects or ambiguous status semantics.

# 20. Integrations

- Government filing portals
- Tax engines
- Document repositories

Integration expectations:

- Integration points for statutory and compliance must define ownership of source of truth, sync direction, retry behavior, and reconciliation responsibility.
- Any external dependency affecting statutory and compliance should be observable through logs, monitoring, and exception reporting.

# 21. Non-Functional Requirements

- Support enterprise-scale data volumes and concurrent access
- Provide reliable APIs and background processing with retry-safe behavior
- Maintain full auditability for regulated operations
- Support localization, observability, and role-aware performance targets
- Statutory and Compliance should preserve performance under realistic enterprise volume, approval concurrency, and reporting load.
- Background jobs, imports, or integrations tied to statutory and compliance should be restartable and observable without corrupting business state.

# 22. Assumptions

- Workflow approval may be enabled or disabled by tenant policy
- Role and data access rules vary by tenant, geography, and legal requirements
- Integration endpoints may be internal platform services or external systems
- The detailed field dictionary, event catalog, and error catalog for statutory and compliance will continue to evolve under the appendix framework without invalidating this module baseline.
