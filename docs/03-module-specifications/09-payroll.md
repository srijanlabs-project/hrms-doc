---
id: HRMS-MOD-PAY-09
title: Payroll Specification
document: 09-payroll.md
version: 1.1
status: Draft
---

# 1. Business

Payroll transforms employee compensation rules and payroll inputs into accurate, auditable, and compliant employee pay outcomes.

Business objectives:

- Ensure accurate and timely payroll processing
- Support complex earnings, deductions, and statutory calculations
- Reduce payroll exceptions through validation and governance
- Provide transparent payslips and reconciliation outputs

Primary stakeholders:

- Payroll administrators
- Finance teams
- HR operations
- Employees
- Compliance teams

Business scenarios:

- Administrators configure or maintain payroll records in line with tenant policy.
- Operational users execute day-to-day payroll transactions while the system enforces validations and approvals.
- Managers or approvers review exceptions, pending actions, and escalations related to payroll.
- Leadership, compliance, or analytics users consume consolidated outputs produced by payroll.

Success measures:

- Reduction in manual effort and rework for payroll operations
- Improved data completeness, timeliness, and control adherence for payroll
- Lower exception volume and faster turnaround for key payroll transactions
- Higher confidence in downstream reporting, payroll, analytics, or compliance outcomes linked to payroll

# 2. Functional

The Payroll module shall support the full lifecycle of master data, operational transactions, approvals, downstream outputs, and exception handling required for enterprise HRMS deployments.

In-scope capability areas:

- Salary structures, pay components, loans, advances, bonus, arrears, and retro pay
- Payroll calendar, input consolidation, validation, gross-to-net processing, and period close
- Payslip publication, bank advice, posting outputs, and full-and-final settlement
- Multi-company and external payroll engine support where required
- AI-assisted anomaly detection across payroll inputs, results, reimbursement outliers, statutory patterns, and unexpected workforce-cost movement
- Payroll anomaly copilot with root-cause explanation, confidence scoring, and approval-routing recommendations for blocking or high-value exceptions

Core functional expectations:

- The system must provide create, view, update, search, filter, status, and history capabilities for payroll records where applicable.
- The system must validate mandatory data, business rules, cut-off conditions, policy eligibility, and dependency integrity before finalizing payroll actions.
- The system must support configurable approval, escalation, correction, cancellation, and reopen behaviors for high-impact payroll transactions where governance requires them.
- The module must expose reliable outputs to downstream modules, reports, dashboards, and integrations that depend on payroll.

Business rule themes:

- Configuration drives how payroll behaves across companies, geographies, worker types, and operating models.
- Historical accuracy must be preserved for material payroll changes through timestamps, status history, effective dates, snapshots, or equivalent patterns.
- Exception handling for payroll must be explicit and traceable rather than silently corrected.

# 3. UX

User experience should provide:

- Payroll run cockpit
- Validation and exception queue
- Payroll anomaly review and approval-routing workspace
- Employee payroll detail screen
- Payslip viewer
- Full-and-final workspace

Key screens:

- Payroll run cockpit
- Validation and exception queue
- Payroll anomaly review and approval-routing workspace
- Employee payroll detail screen
- Payslip viewer
- Full-and-final workspace

UX expectations:

- Users should understand the current status, next available actions, and ownership boundaries for every important payroll record.
- Critical validations for payroll should be shown inline and early, not only after full-form submission.
- Approvers and administrators should be able to review context, comments, exceptions, and history without leaving the payroll workflow.
- Views related to payroll should support responsive layouts, accessible controls, and keyboard-friendly behavior where web channels are used.

Design details to refine during implementation:

- Empty states, loading states, and permission-denied states for payroll screens
- Inline help, tooltips, and policy references for complex payroll actions
- Export, print, or document preview patterns associated with payroll

# 4. API

Representative APIs:

- `POST /api/v1/payroll/runs`
- `POST /api/v1/payroll/runs/{runId}/validate`
- `POST /api/v1/payroll/runs/{runId}/process`
- `POST /api/v1/payroll/anomalies/analyze`
- `POST /api/v1/payroll/anomalies/{anomalyId}/route`
- `GET /api/v1/payroll/employees/{employeeId}/payslips`

API expectations:

- APIs must enforce role and data-scope validation for payroll operations.
- APIs should expose explicit status, history, approval, and dependency-aware responses for payroll.
- Critical payroll APIs should support idempotency, optimistic concurrency, and safe retry behavior.
- List and search APIs for payroll should support filtering, pagination, sorting, and export-friendly access patterns.

Integration contract expectations:

- Service contracts must make it clear which payroll actions are synchronous, asynchronous, or event-driven.
- Error payloads must separate validation failures, permission failures, business-rule conflicts, dependency issues, and transient platform errors.
- High-impact mutation APIs for payroll should include audit-friendly identifiers, timestamps, and actor context in responses or logs.

# 5. Database

Core entities:

- `pay_component`
- `salary_structure`
- `payroll_run`
- `payroll_input`
- `payroll_result`
- `payroll_anomaly_case`
- `payroll_anomaly_explanation`
- `payslip`
- `final_settlement`

Data model expectations:

- The payroll data model should preserve business identifiers, technical identifiers, state metadata, and ownership references.
- Material payroll changes should be historized through effective dating, status history, snapshots, or immutable result records where appropriate.
- Referential integrity must prevent destructive change when dependent modules still rely on payroll data.
- Sensitive fields associated with payroll should support masking, encryption, or restricted access policies where required.

Database design concerns:

- Indexing should support the most common search, dashboard, approval queue, and reporting patterns for payroll.
- Archival or retention controls for payroll should not break audit traceability.
- Dynamic or tenant-specific fields for payroll should be modeled without compromising reporting and validation.

# 6. Events

Published events:

- `payroll.run.validated`
- `payroll.anomaly.detected`
- `payroll.anomaly.routed`
- `payroll.run.closed`
- `payroll.payslip.published`

Consumed events:

- `attendance.period.finalized`
- `leave.period.finalized`
- `expense.claim.approved`

Event design expectations:

- Payroll events must carry enough business context for downstream consumers to act without re-querying excessive state whenever practical.
- Event publication must be reliable, duplicate-safe, and compatible with reprocessing where payroll has regulatory or payroll impact.
- Event consumers that depend on payroll should handle late-arriving, retried, or out-of-order events gracefully.

# 7. Reports

Standard reports:

- `Payroll register`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.
- `Payroll variance report`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.
- `Bank advice report`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.

Reporting expectations:

- Reports for payroll should support operational review, historical analysis, and compliance or audit evidence as needed.
- Report filters should generally support company, location, date range, status, employee scope, and approver or owner scope where applicable.

# 8. Dashboards

Dashboards should show:

- `Payroll runs by status`: summary view intended to surface actionable indicators, pending issues, and movement over time.
- `Employees processed vs pending`: summary view intended to surface actionable indicators, pending issues, and movement over time.
- `Period variance indicators`: summary view intended to surface actionable indicators, pending issues, and movement over time.
- `Anomaly severity and route backlog`: summary view intended to surface blocking anomalies, explanation confidence, and pending decision routing by owner.

Dashboard expectations:

- Dashboards must highlight pending action, SLA risk, trend movement, and exception hotspots for payroll.
- Executives and managers should see aggregated payroll indicators, while administrators should have drill-down capability into operational detail.

# 9. Security

Security requirements:

- Enforce role-based access with least-privilege defaults
- Protect sensitive data fields, exports, and administrative actions
- Support scoped access by tenant, company, geography, or team where applicable
- Require strong authentication for privileged operations
- Support approval and override controls for high-impact payroll actions.
- Restrict export, print, download, or API bulk-read paths for payroll where the module contains sensitive or payroll-impacting information.
- Support maker-checker, delegation, and segregation-of-duties enforcement where payroll exposes privileged operations.

# 10. Audit

Audit logs must capture:

- Capture create, update, approve, reject, and close actions
- Store actor, timestamp, source channel, and correlation reference
- Retain before-and-after values for material changes
- Support audit search and evidence export
- Capture module-specific changes, approvals, overrides, and exceptions for payroll records.
- Preserve sufficient evidence to reconstruct end-to-end payroll decisions during internal review, customer escalation, or compliance audit.

# 11. AI

AI opportunities:

- Detect anomalous payroll variance
- Explain likely causes of payroll exceptions
- Recommend validation checks from prior periods
- Flag suspicious outliers before approval using peer-group, prior-period, policy-threshold, and cost-center-based anomaly models
- Recommend approver routing, urgency, and evidence checklist for each anomaly case without auto-approving or auto-closing payroll-impacting decisions

AI guardrails:

- AI output related to payroll must be permission-aware and scoped to authorized data.
- AI suggestions should remain explainable, reviewable, and non-final for high-risk payroll decisions unless explicitly governed otherwise.
- Any anomaly explanation must preserve traceability back to source records, comparison cohorts, triggered rules, and threshold logic so payroll users can challenge or override the recommendation safely.

# 12. Test Cases

Representative test cases:

- Verify create, update, and view operations with valid data
- Verify permission boundaries for privileged and non-privileged roles
- Verify workflow transitions, approvals, and rejections
- Verify integration and event behavior for success and failure paths
- Verify reporting outputs and audit traceability
- Verify positive, negative, boundary, and recovery paths for the most critical payroll workflows.
- Verify that payroll behaves correctly across role scopes, company scopes, and tenant configuration variations.

# 13. Workflows

Key workflows:

- Monthly payroll run
- Payroll approval and close
- Full-and-final settlement

Typical workflow:

1. A user or system initiates a transaction based on configured rules.
2. The system validates data, permissions, and policy conditions.
3. Approval, notification, and integration steps run where required.
4. Final outcomes are recorded, audited, and exposed to downstream consumers.

Workflow checkpoints:

- Entry validation must reject invalid or incomplete payroll requests before they become operational debt.
- Mid-workflow status visibility must make it clear who owns the next step in a payroll process.
- Terminal states must be unambiguous so reports and downstream modules interpret payroll outcomes consistently.

# 14. State Machine

Primary states:

- Draft
- Inputs Pending
- Validation In Progress
- Validated
- Processing
- Processed
- Approved
- Closed
- Reopened

Illustrative transition path:

- `Draft -> Inputs Pending`
- `Inputs Pending -> Validation In Progress`
- `Validation In Progress -> Validated`
- `Validated -> Processing`
- `Processing -> Processed`
- `Processed -> Approved`

State management expectations:

- Invalid transitions in payroll must be blocked and clearly explained to the caller or user.
- Reopen, rollback, or correction behavior for payroll must be explicit and audit-controlled.

# 15. Permissions

Typical roles:

- Payroll Admin
- Payroll Processor
- Payroll Approver
- Finance Viewer
- Employee

Role expectations:

- `Payroll Admin`: view or act on payroll data according to configured responsibility and data scope.
- `Payroll Processor`: view or act on payroll data according to configured responsibility and data scope.
- `Payroll Approver`: view or act on payroll data according to configured responsibility and data scope.
- `Finance Viewer`: view or act on payroll data according to configured responsibility and data scope.
- `Employee`: view or act on payroll data according to configured responsibility and data scope.

# 16. Notifications

Notifications should be sent for:

- Submission received
- Approval requested
- Approved or rejected outcome
- Exception or failure detected
- Completion or publish confirmation
- Critical cut-off, expiry, approval delay, or exception events affecting payroll.

Notification expectations:

- Channel, urgency, audience, and reminder behavior for payroll should be configurable but governed.
- Notification content for payroll should expose enough context to act without revealing unnecessary sensitive data.

# 17. Configuration

Configurable items:

- Payroll calendar
- Calculation formulas
- Validation rules
- Payslip templates
- Country statutory settings

Configuration governance:

- Changes to payroll configuration should follow controlled release and approval practices where operational impact is high.
- Tenant-specific configuration for payroll should not break cross-module reporting, integrations, or auditability.

# 18. Edge Cases

- Negative net pay
- Cross-company transfer in same period
- Retro salary revision after close

Handling expectations:

- Edge conditions in payroll should be surfaced explicitly to users, support teams, and logs rather than silently ignored.
- Where auto-recovery is possible for payroll, the system should still preserve traceability of the correction path.

# 19. Dependencies

- People Management
- Workforce Management
- Leave Management
- Compensation and Benefits
- Statutory and Compliance

Dependency expectations:

- Upstream dependencies must provide timely, valid, and scope-consistent inputs to payroll.
- Downstream consumers of payroll should not rely on undocumented side effects or ambiguous status semantics.

# 20. Integrations

- Banking systems
- ERP and finance systems
- Tax and statutory systems
- ESS portal

Integration expectations:

- Integration points for payroll must define ownership of source of truth, sync direction, retry behavior, and reconciliation responsibility.
- Any external dependency affecting payroll should be observable through logs, monitoring, and exception reporting.

# 21. Non-Functional Requirements

- Support enterprise-scale data volumes and concurrent access
- Provide reliable APIs and background processing with retry-safe behavior
- Maintain full auditability for regulated operations
- Support localization, observability, and role-aware performance targets
- Payroll should preserve performance under realistic enterprise volume, approval concurrency, and reporting load.
- Background jobs, imports, or integrations tied to payroll should be restartable and observable without corrupting business state.

# 22. Assumptions

- Workflow approval may be enabled or disabled by tenant policy
- Role and data access rules vary by tenant, geography, and legal requirements
- Integration endpoints may be internal platform services or external systems
- The detailed field dictionary, event catalog, and error catalog for payroll will continue to evolve under the appendix framework without invalidating this module baseline.
