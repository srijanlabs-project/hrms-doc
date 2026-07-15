---
id: HRMS-XCUT-12
title: Workflow and Approval Runtime Deepening
document: 12-workflow-approval-runtime-deepening.md
version: 1.0
status: Draft
---

# 1. Purpose

This document deepens the workflow and approval model into an implementation-facing runtime standard covering transition legality, escalation timers, parallel approvals, stale actions, delegation, overrides, and callback behavior.

# 2. Scope

This standard applies to:

- approval workflows
- acknowledgment workflows
- review and certification workflows
- exception and override workflows
- workflow tasks created by leave, payroll, people, documents, security, and administration modules

# 3. Canonical Workflow Model

Every workflow instance should declare:

- source module and object reference
- workflow definition version
- current state
- active tasks
- decision policy
- SLA policy
- escalation policy
- stale-action rules
- override policy

# 4. Transition Legality Rules

- every transition must declare allowed source states and target states
- forward transitions, rollback transitions, cancellation transitions, and forced-override transitions must be distinguishable
- no task completion may mutate object state if the task is already closed, superseded, delegated away, or stale

# 5. SLA and Escalation Rules

## 5.1 Timer Types

Support:

- first-response SLA
- decision SLA
- reminder cadence
- escalation threshold
- expiry threshold

## 5.2 Escalation Actions

Escalation may:

- remind current approver
- route to delegate
- route to manager-of-approver
- route to fallback queue
- raise operator alert
- block downstream release until resolved

# 6. Approval Topologies

Support these patterns explicitly:

- single approver
- sequential approvals
- parallel all-must-approve
- parallel any-one-approves
- matrix route based on amount, role, location, or legal entity
- mixed route with conditional branch

Parallel approval rules:

- branch quorum must be defined
- conflicting branch outcomes must define tie-break policy
- canceling one branch must not implicitly close all branches unless route policy says so

# 7. Delegation and Reassignment

- active delegation must be validated at action time, not only at task-creation time
- reassignment history must preserve original assignee
- non-delegable actions must hard-block even if broader delegation exists
- delegation expiry must immediately stop new decisions under that delegation

# 8. Stale-Action Handling

A task becomes stale when:

- source object state advanced through another path
- task was superseded by reassignment or delegation change
- workflow instance was canceled or closed
- object version changed beyond allowed stale-read tolerance

Response posture:

- reject stale actions with explicit state-conflict response
- return current active task or next step if safe
- always audit stale-action attempt

# 9. Override and Break-Glass Rules

- override actions require explicit permission
- override requires reason code and evidence or comment where policy demands
- override should identify whether it is operational, compliance, emergency, or data-correction based
- high-risk overrides should trigger follow-up audit review

# 10. Callback and Source Object Rules

- workflow completion must publish deterministic callback to source domain
- callback handlers must be idempotent
- if callback fails, workflow must surface callback-pending or retry-safe status rather than silently assuming source object updated

# 11. Runtime APIs

Representative APIs:

- `POST /api/v1/workflows/instances`
- `GET /api/v1/workflows/instances/{instanceId}`
- `POST /api/v1/workflows/tasks/{taskId}/complete`
- `POST /api/v1/workflows/tasks/{taskId}/reassign`
- `POST /api/v1/workflows/tasks/{taskId}/override`
- `POST /api/v1/workflows/instances/{instanceId}/cancel`

# 12. Test Expectations

- sequential approval path
- parallel branch quorum
- stale task rejection
- delegation activation and expiry
- SLA reminder and escalation
- callback retry after source-domain failure

