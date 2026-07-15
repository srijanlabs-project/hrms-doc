---
id: HRMS-MOD-REC-06
title: Recruitment and ATS Specification
document: 06-recruitment-ats.md
version: 1.1
status: Draft
---

# 1. Business

Recruitment and ATS manages manpower demand, candidate sourcing, evaluation, offer processing, and hire conversion for enterprise talent acquisition.

Business objectives:

- Reduce time-to-hire
- Improve quality of hire
- Standardize requisition and interview workflows
- Build reusable candidate pipelines and talent pools

Primary stakeholders:

- Recruiters
- Hiring managers
- Interview panel members
- Candidates
- HR leadership

Business scenarios:

- Administrators configure or maintain recruitment and ats records in line with tenant policy.
- Operational users execute day-to-day recruitment and ats transactions while the system enforces validations and approvals.
- Managers or approvers review exceptions, pending actions, and escalations related to recruitment and ats.
- Leadership, compliance, or analytics users consume consolidated outputs produced by recruitment and ats.

Success measures:

- Reduction in manual effort and rework for recruitment and ats operations
- Improved data completeness, timeliness, and control adherence for recruitment and ats
- Lower exception volume and faster turnaround for key recruitment and ats transactions
- Higher confidence in downstream reporting, payroll, analytics, or compliance outcomes linked to recruitment and ats

# 2. Functional

The Recruitment and ATS module shall support the full lifecycle of master data, operational transactions, approvals, downstream outputs, and exception handling required for enterprise HRMS deployments.

In-scope capability areas:

- Manpower planning, requisitions, and job posting
- Candidate portal, resume parsing, screening, assessments, and talent pools
- Interview scheduling, feedback, and offer management
- Background verification and candidate-to-employee conversion
- Chatbot-driven candidate communication, AI-based candidate ranking, and automation of high-volume coordination steps

Core functional expectations:

- The system must provide create, view, update, search, filter, status, and history capabilities for recruitment and ats records where applicable.
- The system must validate mandatory data, business rules, cut-off conditions, policy eligibility, and dependency integrity before finalizing recruitment and ats actions.
- The system must support configurable approval, escalation, correction, cancellation, and reopen behaviors for high-impact recruitment and ats transactions where governance requires them.
- The module must expose reliable outputs to downstream modules, reports, dashboards, and integrations that depend on recruitment and ats.

Business rule themes:

- Configuration drives how recruitment and ats behaves across companies, geographies, worker types, and operating models.
- Historical accuracy must be preserved for material recruitment and ats changes through timestamps, status history, effective dates, snapshots, or equivalent patterns.
- Exception handling for recruitment and ats must be explicit and traceable rather than silently corrected.

# 3. UX

User experience should provide:

- Requisition workspace
- Recruiter pipeline board
- Candidate profile
- Interview scheduler
- Offer approval screen

Key screens:

- Requisition workspace
- Recruiter pipeline board
- Candidate profile
- Interview scheduler
- Offer approval screen

UX expectations:

- Users should understand the current status, next available actions, and ownership boundaries for every important recruitment and ats record.
- Critical validations for recruitment and ats should be shown inline and early, not only after full-form submission.
- Approvers and administrators should be able to review context, comments, exceptions, and history without leaving the recruitment and ats workflow.
- Views related to recruitment and ats should support responsive layouts, accessible controls, and keyboard-friendly behavior where web channels are used.

Design details to refine during implementation:

- Empty states, loading states, and permission-denied states for recruitment and ats screens
- Inline help, tooltips, and policy references for complex recruitment and ats actions
- Export, print, or document preview patterns associated with recruitment and ats

# 4. API

Representative APIs:

- `POST /api/v1/recruitment/requisitions`
- `POST /api/v1/recruitment/candidates`
- `POST /api/v1/recruitment/interviews`
- `POST /api/v1/recruitment/candidates/{candidateId}/hire`

API expectations:

- APIs must enforce role and data-scope validation for recruitment and ats operations.
- APIs should expose explicit status, history, approval, and dependency-aware responses for recruitment and ats.
- Critical recruitment and ats APIs should support idempotency, optimistic concurrency, and safe retry behavior.
- List and search APIs for recruitment and ats should support filtering, pagination, sorting, and export-friendly access patterns.

Integration contract expectations:

- Service contracts must make it clear which recruitment and ats actions are synchronous, asynchronous, or event-driven.
- Error payloads must separate validation failures, permission failures, business-rule conflicts, dependency issues, and transient platform errors.
- High-impact mutation APIs for recruitment and ats should include audit-friendly identifiers, timestamps, and actor context in responses or logs.

# 5. Database

Core entities:

- `requisition`
- `candidate`
- `candidate_resume`
- `assessment`
- `interview_schedule`
- `offer`
- `candidate_stage_history`

Data model expectations:

- The recruitment and ats data model should preserve business identifiers, technical identifiers, state metadata, and ownership references.
- Material recruitment and ats changes should be historized through effective dating, status history, snapshots, or immutable result records where appropriate.
- Referential integrity must prevent destructive change when dependent modules still rely on recruitment and ats data.
- Sensitive fields associated with recruitment and ats should support masking, encryption, or restricted access policies where required.

Database design concerns:

- Indexing should support the most common search, dashboard, approval queue, and reporting patterns for recruitment and ats.
- Archival or retention controls for recruitment and ats should not break audit traceability.
- Dynamic or tenant-specific fields for recruitment and ats should be modeled without compromising reporting and validation.

# 6. Events

Published events:

- `recruitment.requisition.created`
- `recruitment.candidate.stage_changed`
- `recruitment.offer.released`
- `recruitment.candidate.hired`

Consumed events:

- `org.position.updated`
- `workflow.approval.completed`

Event design expectations:

- Recruitment and ATS events must carry enough business context for downstream consumers to act without re-querying excessive state whenever practical.
- Event publication must be reliable, duplicate-safe, and compatible with reprocessing where recruitment and ats has regulatory or payroll impact.
- Event consumers that depend on recruitment and ats should handle late-arriving, retried, or out-of-order events gracefully.

# 7. Reports

Standard reports:

- `Open requisitions report`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.
- `Pipeline conversion report`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.
- `Source effectiveness report`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.

Reporting expectations:

- Reports for recruitment and ats should support operational review, historical analysis, and compliance or audit evidence as needed.
- Report filters should generally support company, location, date range, status, employee scope, and approver or owner scope where applicable.

# 8. Dashboards

Dashboards should show:

- `Requisitions by status`: summary view intended to surface actionable indicators, pending issues, and movement over time.
- `Candidate stage volume`: summary view intended to surface actionable indicators, pending issues, and movement over time.
- `Offer acceptance ratio`: summary view intended to surface actionable indicators, pending issues, and movement over time.

Dashboard expectations:

- Dashboards must highlight pending action, SLA risk, trend movement, and exception hotspots for recruitment and ats.
- Executives and managers should see aggregated recruitment and ats indicators, while administrators should have drill-down capability into operational detail.

# 9. Security

Security requirements:

- Enforce role-based access with least-privilege defaults
- Protect sensitive data fields, exports, and administrative actions
- Support scoped access by tenant, company, geography, or team where applicable
- Require strong authentication for privileged operations
- Support approval and override controls for high-impact recruitment and ats actions.
- Restrict export, print, download, or API bulk-read paths for recruitment and ats where the module contains sensitive or payroll-impacting information.
- Support maker-checker, delegation, and segregation-of-duties enforcement where recruitment and ats exposes privileged operations.

# 10. Audit

Audit logs must capture:

- Capture create, update, approve, reject, and close actions
- Store actor, timestamp, source channel, and correlation reference
- Retain before-and-after values for material changes
- Support audit search and evidence export
- Capture module-specific changes, approvals, overrides, and exceptions for recruitment and ats records.
- Preserve sufficient evidence to reconstruct end-to-end recruitment and ats decisions during internal review, customer escalation, or compliance audit.

# 11. AI

AI opportunities:

- Rank candidate-job fit
- Summarize interview feedback
- Detect pipeline bottlenecks
- Generate candidate communication drafts, recruiter follow-up prompts, and interview scheduling suggestions while preserving human review on high-impact steps

AI guardrails:

- AI output related to recruitment and ats must be permission-aware and scoped to authorized data.
- AI suggestions should remain explainable, reviewable, and non-final for high-risk recruitment and ats decisions unless explicitly governed otherwise.

# 12. Test Cases

Representative test cases:

- Verify create, update, and view operations with valid data
- Verify permission boundaries for privileged and non-privileged roles
- Verify workflow transitions, approvals, and rejections
- Verify integration and event behavior for success and failure paths
- Verify reporting outputs and audit traceability
- Verify positive, negative, boundary, and recovery paths for the most critical recruitment and ats workflows.
- Verify that recruitment and ats behaves correctly across role scopes, company scopes, and tenant configuration variations.

# 13. Workflows

Key workflows:

- Manpower approval
- Interview and evaluation workflow
- Offer approval and hire conversion

Typical workflow:

1. A user or system initiates a transaction based on configured rules.
2. The system validates data, permissions, and policy conditions.
3. Approval, notification, and integration steps run where required.
4. Final outcomes are recorded, audited, and exposed to downstream consumers.

Workflow checkpoints:

- Entry validation must reject invalid or incomplete recruitment and ats requests before they become operational debt.
- Mid-workflow status visibility must make it clear who owns the next step in a recruitment and ats process.
- Terminal states must be unambiguous so reports and downstream modules interpret recruitment and ats outcomes consistently.

# 14. State Machine

Primary states:

- Applied
- Screened
- Shortlisted
- Interviewing
- Selected
- Offered
- Accepted
- Rejected
- Hired
- Withdrawn

Illustrative transition path:

- `Applied -> Screened`
- `Screened -> Shortlisted`
- `Shortlisted -> Interviewing`
- `Interviewing -> Selected`
- `Selected -> Offered`
- `Offered -> Accepted`

State management expectations:

- Invalid transitions in recruitment and ats must be blocked and clearly explained to the caller or user.
- Reopen, rollback, or correction behavior for recruitment and ats must be explicit and audit-controlled.

# 15. Permissions

Typical roles:

- Recruiter
- Hiring Manager
- Interviewer
- HR Admin
- Candidate

Role expectations:

- `Recruiter`: view or act on recruitment and ats data according to configured responsibility and data scope.
- `Hiring Manager`: view or act on recruitment and ats data according to configured responsibility and data scope.
- `Interviewer`: view or act on recruitment and ats data according to configured responsibility and data scope.
- `HR Admin`: view or act on recruitment and ats data according to configured responsibility and data scope.
- `Candidate`: view or act on recruitment and ats data according to configured responsibility and data scope.

# 16. Notifications

Notifications should be sent for:

- Submission received
- Approval requested
- Approved or rejected outcome
- Exception or failure detected
- Completion or publish confirmation
- Critical cut-off, expiry, approval delay, or exception events affecting recruitment and ats.

Notification expectations:

- Channel, urgency, audience, and reminder behavior for recruitment and ats should be configurable but governed.
- Notification content for recruitment and ats should expose enough context to act without revealing unnecessary sensitive data.

# 17. Configuration

Configurable items:

- Candidate stages
- Offer thresholds
- Source channels
- Duplicate matching rules

Configuration governance:

- Changes to recruitment and ats configuration should follow controlled release and approval practices where operational impact is high.
- Tenant-specific configuration for recruitment and ats should not break cross-module reporting, integrations, or auditability.

# 18. Edge Cases

- Same candidate in multiple requisitions
- Requisition closes during interviews
- Offer revised after acceptance

Handling expectations:

- Edge conditions in recruitment and ats should be surfaced explicitly to users, support teams, and logs rather than silently ignored.
- Where auto-recovery is possible for recruitment and ats, the system should still preserve traceability of the correction path.

# 19. Dependencies

- Organization Management
- People Management
- Document Management
- Analytics and BI

Dependency expectations:

- Upstream dependencies must provide timely, valid, and scope-consistent inputs to recruitment and ats.
- Downstream consumers of recruitment and ats should not rely on undocumented side effects or ambiguous status semantics.

# 20. Integrations

- Job boards
- Background verification providers
- Calendar platforms
- Assessment tools
- Conversational messaging channels for candidate communication

Integration expectations:

- Integration points for recruitment and ats must define ownership of source of truth, sync direction, retry behavior, and reconciliation responsibility.
- Any external dependency affecting recruitment and ats should be observable through logs, monitoring, and exception reporting.

# 21. Non-Functional Requirements

- Support enterprise-scale data volumes and concurrent access
- Provide reliable APIs and background processing with retry-safe behavior
- Maintain full auditability for regulated operations
- Support localization, observability, and role-aware performance targets
- Recruitment and ATS should preserve performance under realistic enterprise volume, approval concurrency, and reporting load.
- Background jobs, imports, or integrations tied to recruitment and ats should be restartable and observable without corrupting business state.

# 22. Assumptions

- Workflow approval may be enabled or disabled by tenant policy
- Role and data access rules vary by tenant, geography, and legal requirements
- Integration endpoints may be internal platform services or external systems
- The detailed field dictionary, event catalog, and error catalog for recruitment and ats will continue to evolve under the appendix framework without invalidating this module baseline.
