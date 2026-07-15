---
id: HRMS-SUB-31-04
title: Cutover Specification
document: 04-cutover.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Cutover governs the controlled transition from legacy or existing processes into live HRMS production operations.

# 2. Business

Cutover is the highest-risk operational moment in implementation. It coordinates data freeze, final migration, validation, business readiness, and go-live decision making.

# 3. Functional

The system shall support:

- Cutover plan with task sequencing, owners, dependencies, and checkpoints
- Freeze management for legacy and target systems
- Final migration, reconciliation, smoke testing, and go-live approvals
- Parallel-run and fallback checkpoints where applicable
- Command-center monitoring and issue escalation

Validation rules:

- Go-live checkpoint shall require all mandatory predecessors complete
- Critical unresolved issue shall block cutover progression
- Time-sensitive payroll or statutory windows shall be embedded in cutover sequencing

# 4. UX

The user experience shall provide:

- Cutover command-center dashboard
- Timeline and dependency visualization
- Owner task board with real-time status
- Executive readiness summary

# 5. API

Representative APIs:

- `POST /api/v1/implementation/cutover-plans`
- `PATCH /api/v1/implementation/cutover-tasks/{taskId}`
- `POST /api/v1/implementation/cutover/go-live-check`
- `GET /api/v1/implementation/cutover/status`

# 6. Database

Core entities:

- `cutover_plan`
- `cutover_task`
- `cutover_dependency`
- `cutover_checkpoint`
- `cutover_issue`

# 7. Events

The platform shall publish:

- `cutover.started`
- `cutover.checkpoint-completed`
- `cutover.issue-raised`
- `cutover.go-live-approved`

# 8. Reports

Required reports:

- Cutover readiness report
- Task completion report
- Issue escalation report
- Freeze window report

# 9. Dashboards

Dashboards shall show:

- Critical path completion
- Open blockers
- Time-to-next checkpoint
- Go-live readiness status

# 10. Security

Security controls shall include:

- Restricted authority for go-live decisions
- Controlled visibility to sensitive migration and payroll tasks
- Strong logging during command-center operations

# 11. Audit

The audit trail shall capture:

- Task completion and updates
- Freeze and unfreeze actions
- Checkpoint approvals
- Go-live decision and rationale

# 12. AI

AI capabilities may include:

- Critical path risk prediction
- Issue summarization
- Recommended sequencing adjustments

# 13. Test Cases

- Blocked dependency prevents downstream task completion
- Critical issue blocks go-live checkpoint
- Freeze status updates correctly across workstreams
- Executive summary reflects live task state
- Final reconciliation checkpoint cannot be skipped

# 14. Workflows

1. Cutover plan is finalized.
2. Freeze and final-load activities execute.
3. Readiness checkpoints and smoke tests complete.
4. Go-live approval is granted or deferred.

# 15. State Machine

- `planned`
- `ready`
- `in-progress`
- `checkpoint-blocked`
- `approved`
- `completed`
- `rolled-back`

# 16. Permissions

- Manage cutover plan
- Update task status
- Approve checkpoints
- Approve go-live
- View command-center dashboard

# 17. Notifications

- Critical blocker alerts
- Checkpoint completion notices
- Go-live decision messages

# 18. Configuration

- Cutover templates
- Checkpoint gates
- Escalation matrix
- Freeze policies

# 19. Edge Cases

- Payroll close overlaps cutover weekend
- One critical integration not ready at final checkpoint
- Final-load data differs from approved trial assumptions
- Leadership requests delayed go-live after technical readiness
