---
id: HRMS-SUB-03-06
title: Delegation Specification
document: 06-delegation.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Delegation governs temporary or scoped transfer of selected authority from one user to another for operational continuity, approvals, reviews, or task completion.

In scope:

- Delegation request and approval
- Scope definition and time limits
- Delegated action execution and traceability
- Conflict checks and exclusions
- Delegation lifecycle, revocation, and auditability

# 2. Business

HRMS processes often depend on manager or role-holder availability. Delegation prevents bottlenecks when approvers are unavailable due to leave, travel, vacancy, or workload, while still preserving accountability and least-privilege control.

Business objectives:

- Maintain process continuity during absences or temporary workload shifts
- Reduce stalled approvals and task queues
- Preserve clear ownership and audit traceability for delegated actions
- Prevent overbroad or risky delegation of sensitive powers

# 3. Functional

The system shall support:

- Delegation by task type, workflow type, role, hierarchy scope, or specific user
- Temporary start and end dates, partial-day windows, and emergency delegation
- Self-requested, manager-requested, admin-assigned, or auto-suggested delegation paths
- Approval requirements for sensitive delegation scopes
- Exclusions for non-delegable powers such as selected payroll, security, or legal actions
- Visibility of acted-as and acted-for identities in delegated transactions

Detailed rules:

- Delegation must never silently convert into permanent access
- Sensitive actions may require dual control even when delegated
- Delegation should respect SoD, organizational scope, and role-compatibility rules
- Expired delegation must revoke immediately from active task-routing and decisioning paths
- Delegated actions should remain attributable to both delegator and delegate

# 4. UX

Primary screens:

- Delegation request form
- Delegation inbox and approval queue
- Active delegation dashboard
- Delegated-task view
- Delegation audit timeline

UX expectations:

- Users should clearly understand what they are delegating and for how long
- Delegates should know when they are acting on behalf of someone else
- Sensitive or non-delegable powers should be visibly explained when blocked

# 5. API

Representative APIs:

- `POST /api/v1/access/delegations`
- `GET /api/v1/access/delegations/{delegationId}`
- `POST /api/v1/access/delegations/{delegationId}/approve`
- `POST /api/v1/access/delegations/{delegationId}/revoke`
- `GET /api/v1/access/users/{userId}/active-delegations`
- `POST /api/v1/access/delegations/validate`

# 6. Database

Core entities:

- `delegation_request`
- `delegation_scope`
- `delegation_approval`
- `delegated_action_log`
- `delegation_exclusion_rule`
- `delegation_revocation_event`

Key fields:

- Delegator, delegate, requested by, start time, end time, status
- Scope type, workflow type, role scope, organization scope, sensitive flag
- Approval status, approver, approval rationale
- Action timestamp, action type, source task, acted-for identity
- Revocation reason, automatic-expiry indicator, conflict result

# 7. Events

Published events:

- `delegation.requested`
- `delegation.approved`
- `delegation.activated`
- `delegation.revoked`
- `delegation.expired`
- `delegation.action_performed`

Consumed events:

- `leave.approved`
- `user.account_disabled`
- `sod.conflict_detected`
- `workflow.task_created`

# 8. Reports

Required reports:

- Active delegation report
- Delegated action report
- Delegation expiry report
- Sensitive delegation approval report
- Delegation conflict and rejection report

# 9. Dashboards

Operational dashboards:

- Approvals pending delegation
- Active delegated authority by function
- Delegations nearing expiry
- Delegated-action volume by workflow type

# 10. Security

Security requirements:

- Delegation must be scoped, time-bound, and non-persistent
- Restricted actions must remain explicitly non-delegable where policy requires
- Delegation should integrate with RBAC, ABAC, and SoD enforcement

# 11. Audit

Audit coverage shall include:

- Delegation creation and approval
- Scope changes
- Revocations and expiries
- All delegated actions performed
- Access to sensitive delegated workflows

# 12. AI

AI-assisted opportunities:

- Suggest likely delegates based on organizational backup patterns
- Predict workflows most at risk without delegation coverage
- Highlight risky delegation combinations before approval

# 13. Test Cases

Core test scenarios:

- Create time-bound delegation for approval workflow
- Block delegation of non-delegable payroll action
- Revoke active delegation and stop routing immediately
- Record delegated action with dual attribution
- Expire delegation automatically at end time

# 14. Workflows

Primary workflow:

1. Delegation request is created.
2. Policy, scope, and conflict checks run.
3. Approval is collected where required.
4. Active delegation influences task routing and action authority.
5. Delegation expires or is revoked and history is retained.

# 15. State Machine

Delegation state model:

- `Requested`
- `Pending Approval`
- `Active`
- `Rejected`
- `Revoked`
- `Expired`

# 16. Permissions

Representative permissions:

- `delegation.request`
- `delegation.approve`
- `delegation.revoke`
- `delegation.view_active`
- `delegation.manage_sensitive`
- `delegation.audit.view`

# 17. Notifications

Notification scenarios:

- Delegation approval required
- Delegation activated
- Delegation nearing expiry
- Delegation revoked
- Delegated action performed on sensitive workflow

# 18. Configuration

Configurable parameters:

- Delegable workflow types
- Sensitive-scope approval rules
- Maximum delegation duration
- Auto-delegation triggers
- Non-delegable action list

# 19. Edge Cases

Important edge cases:

- Delegator goes inactive after delegation approval
- Delegate already has conflicting authority through another path
- Delegation starts while associated workflow task is already assigned
- Overlapping delegations exist for the same workflow type
