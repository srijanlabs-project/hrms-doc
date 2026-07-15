---
id: HRMS-SUB-00-03
title: Workflow engine Specification
document: 03-workflow-engine.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Workflow Engine is the shared orchestration layer used across the HRMS platform to drive approvals, task routing, escalations, reminders, and controlled state progression. It is one of the most critical platform services because almost every regulated or business-sensitive module depends on it.

In scope:

- Workflow definition and versioning
- Rule-based routing
- Task assignment and approval execution
- Escalation and SLA handling
- Parallel and sequential approvals
- Workflow auditability
- Workflow APIs and events

# 2. Business Context

Without a strong workflow engine, enterprise HRMS processes become inconsistent, hard to audit, and difficult to scale across companies and geographies.

Business outcomes:

- Standardize approval behavior across modules
- Reduce manual email and offline follow-up for decisions
- Ensure policy-compliant routing and escalation
- Improve turnaround visibility and audit traceability

# 3. Actors and Responsibilities

Primary roles:

- Platform Admin
- Tenant Admin
- Process Owner
- Approver
- Auditor

Responsibilities:

- Platform Admin manages shared workflow capabilities and runtime controls
- Tenant Admin configures tenant-specific workflow definitions within allowed guardrails
- Process Owner defines business rules and approval semantics
- Approver completes assigned workflow tasks
- Auditor reviews workflow evidence and control adherence

# 4. Functional Behavior

The engine shall support:

- Workflow templates and reusable definitions
- Draft, review, publish, retire, and replace lifecycle for workflow definitions
- Module-aware routing triggered by events or API calls
- Sequential approval chains
- Parallel approval groups
- Conditional branching based on policy and data
- Escalation on timeout or inactivity
- Reminder notifications
- Delegation-aware task routing
- Reassignment where policy allows
- Manual override with audit trail in restricted scenarios

Detailed requirements:

- A workflow definition must identify trigger source, input payload expectations, stages, approver resolution logic, SLA rules, reminder behavior, escalation rules, and terminal outcomes
- The engine must support both human tasks and system tasks
- Workflow stages must support approve, reject, send-back, skip, auto-close, and auto-escalate behavior where configured
- The engine must allow versioned publication so that in-flight transactions continue on prior logic while new transactions use the new version

# 5. Data and Field Design

Core entities:

- `workflow_definition`
- `workflow_definition_version`
- `workflow_stage`
- `workflow_stage_rule`
- `workflow_instance`
- `workflow_instance_stage`
- `workflow_task`
- `workflow_action_log`
- `workflow_sla_rule`
- `workflow_escalation_log`

Important field groups:

- Workflow identifier, name, module binding, and version
- Trigger event or API binding
- Context data mapping
- Approver resolution rules
- Stage sequence and dependencies
- SLA target and escalation chain
- Current instance status and timestamps
- Action history, comments, and attachments

Data expectations:

- Definition and runtime data must be separated cleanly
- Published definitions must be immutable except through version replacement
- Every workflow instance must be reconstructable from definition version, input context, and action history

# 6. UX and Interaction Model

Administrative UI should provide:

- Workflow definition list
- Visual stage designer or structured stage editor
- Rule and approver mapping editor
- Version compare view
- Publish and retire controls
- Runtime monitor for in-flight instances

End-user and approver UI should provide:

- Task inbox
- Task detail with business context
- Approve, reject, send-back, and comment actions
- Escalation and due-date visibility
- Delegation indicator where applicable

# 7. API and Service Contracts

Representative APIs:

- `POST /api/v1/platform/workflows/definitions`
- `PUT /api/v1/platform/workflows/definitions/{definitionId}`
- `POST /api/v1/platform/workflows/definitions/{definitionId}/publish`
- `POST /api/v1/platform/workflows/instances`
- `GET /api/v1/platform/workflows/instances/{instanceId}`
- `POST /api/v1/platform/workflows/tasks/{taskId}/actions`

API expectations:

- Definition APIs must validate structural correctness before publish
- Runtime APIs must reject instances triggered with incomplete or invalid context
- Task action APIs must enforce actor, scope, and state validation
- Runtime retrieval APIs must provide both business context and workflow status context

# 8. Workflow and Business Rules

Rules to support:

- Approver resolution by reporting line, role, organization unit, static user, dynamic rule, or threshold
- Approval thresholds by amount, risk, worker type, or transaction category
- Auto-approval or skip logic where explicitly allowed
- Reminder cadence and escalation timing
- Reassignment and delegation rules
- Cancellation and reopen controls

Typical execution flow:

1. Module triggers workflow using a definition key and business payload.
2. Engine resolves the active published version.
3. Engine validates context and creates workflow instance.
4. Engine assigns first stage tasks.
5. Approvers act or engine escalates based on rules.
6. Final decision is published back to source module and audit trail is sealed.

# 9. State Machine

Definition states:

- Draft
- Ready for Review
- Published
- Superseded
- Retired

Instance states:

- Created
- In Progress
- Waiting on Approver
- Escalated
- Approved
- Rejected
- Sent Back
- Cancelled
- Closed

# 10. Events and Notifications

Published events:

- `workflow.definition.published`
- `workflow.instance.created`
- `workflow.task.assigned`
- `workflow.task.completed`
- `workflow.instance.approved`
- `workflow.instance.rejected`
- `workflow.instance.escalated`

Consumed events:

- Module-specific trigger events
- `security.delegation.updated`
- `notification.delivery.failed`

Notifications:

- Task assignment
- Reminder before SLA breach
- Escalation to next approver
- Approval or rejection outcome
- Workflow cancellation or send-back

# 11. Reports and Dashboards

Reports:

- Workflow definition inventory
- In-flight workflow report
- SLA breach report
- Escalation report
- Approval turnaround report

Dashboards:

- Tasks pending by role and module
- SLA risk by workflow
- Escalation volume trend
- Approval turnaround trend

# 12. Security, Permissions, and Audit

Security requirements:

- Only authorized administrators may create or publish definitions
- Runtime tasks must only be visible to assigned or delegated users
- Manual override actions must require elevated permissions and strict logging

Audit requirements:

- Definition changes and version publications
- Every runtime action on every task
- Actor, timestamp, comments, before state, after state
- Escalations, reassignment, delegation usage, and override paths

# 13. Configuration

Configurable items:

- Workflow definitions by module and transaction type
- Approver resolution methods
- SLA timers
- Reminder cadence
- Escalation hierarchy
- Allowed actions by stage
- Cancellation and reopen policy

# 14. Edge Cases and Exception Handling

- Approver no longer active at task assignment time
- Reporting manager missing
- Threshold rule produces no approver
- Definition changed while instance is active
- Duplicate trigger for same business transaction
- Notification failure after task assignment
- Escalation chain loops back to same user

# 15. Test Scenarios

- Publish valid workflow definition
- Reject invalid stage graph during publish
- Trigger workflow with correct approver resolution
- Process sequential and parallel approvals
- Breach SLA and verify escalation
- Delegate task and verify audit trace
- Cancel workflow and ensure source module state is updated correctly

# 16. Dependencies and Integrations

Dependencies:

- Permission and role model
- Notification framework
- Audit engine
- Business rules engine
- Identity and access services

Integrations:

- All transaction modules that require approval
- Manager hierarchy services
- Notification channels
- Reporting and analytics

# 17. Assumptions

- Source modules pass sufficient business context into the workflow engine
- Workflow definition ownership is clearly assigned per module or transaction family
- Very high-risk overrides are rare and tightly governed
