---
id: HRMS-SUB-29-07
title: Segregation of duties Specification
document: 07-segregation-of-duties.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Segregation of Duties defines the preventive and detective controls that identify, block, mitigate, or govern incompatible access and activity combinations within the HRMS platform.

In scope:

- Conflict rule definition at role, permission, and action level
- Real-time preventive checks during access changes
- Detective scans on existing access landscape
- Temporary override governance
- Review, remediation, and audit evidence

# 2. Business

SoD is a foundational governance control for enterprise HRMS because the same system can hold high-risk powers across people data, payroll, security, finance-impacting changes, and compliance outputs. Without enforced separation, organizations face fraud, unapproved pay changes, data manipulation, and audit failure.

Business objectives:

- Prevent concentration of incompatible powers in one user or team
- Support internal-control frameworks and audit readiness
- Reduce fraud, collusion, and unreviewed override risk
- Make risk exceptions explicit, temporary, and reviewable

Key risk domains:

- Payroll processing and payroll approval
- Employee banking or compensation maintenance and payroll execution
- Security-role assignment and access certification
- Master data maintenance and statutory submission approval

# 3. Functional

The system shall support:

- SoD rules based on role combinations, permission combinations, transaction combinations, or contextual combinations
- Preventive evaluation during role assignment, permission grant, delegation, proxy activation, and emergency access
- Detective scans of existing users, service accounts, shared accounts, and privileged identities
- Risk scoring and conflict categorization by severity and domain
- Approved override with expiry, compensating control, and reviewer assignment
- Remediation workflow through role removal, permission split, or process redesign

Detailed rules:

- Preventive controls should block critical conflicts by default unless override policy exists
- Detective controls must continue to flag inherited or legacy conflicts until remediated or explicitly accepted
- Time-bound assignments must still trigger SoD evaluation
- A conflict may arise through multiple low-risk roles whose combined access becomes high risk
- SoD evaluation should consider organizational scope where the risk model requires it

Illustrative conflict families:

- Create payroll run plus approve payroll run
- Edit employee bank details plus release payroll payment file
- Assign privileged role plus certify own access
- Change compensation structure plus approve compensation revision
- Modify statutory setup plus approve statutory filing output

# 4. UX

Primary screens:

- SoD rule catalog
- Conflict review queue
- Access-change check result view
- Override approval panel
- Remediation workbench

UX expectations:

- Security admins should see exactly which permissions and roles create the conflict
- Business approvers should understand the business risk in non-technical language
- Review screens should distinguish active, accepted, expiring, and remediated conflicts clearly

# 5. API

Representative APIs:

- `POST /api/v1/security/sod/rules`
- `POST /api/v1/security/sod/check-access-change`
- `GET /api/v1/security/sod/conflicts`
- `POST /api/v1/security/sod/conflicts/{conflictId}/override`
- `POST /api/v1/security/sod/conflicts/{conflictId}/remediate`

API expectations:

- Access-change check APIs must support bulk evaluation during provisioning
- Conflict payloads must expose rule, risk domain, severity, affected permissions, and proposed remediation
- Override APIs must require justification, expiry, and approver context

# 6. Database

Core entities:

- `sod_rule`
- `sod_rule_condition`
- `sod_conflict`
- `sod_override`
- `sod_review_record`
- `sod_remediation_action`

Key fields:

- Rule code, risk family, severity, preventive flag, detective flag
- Condition type, permission reference, role reference, context filter
- User ID, conflicting access set, detected timestamp, status
- Override approver, expiry date, compensating control, review frequency
- Remediation owner, target date, closure evidence

# 7. Events

Published events:

- `sod.rule_published`
- `sod.conflict_detected`
- `sod.conflict_blocked`
- `sod.override_approved`
- `sod.override_expired`
- `sod.conflict_remediated`

Consumed events:

- `access.role_assigned`
- `access.permission_granted`
- `proxy.access_activated`
- `identity.user_disabled`

# 8. Reports

Required reports:

- Open SoD conflicts report
- High-severity conflict report
- Override aging report
- Conflict trend by risk domain report
- Remediation SLA report

# 9. Dashboards

Operational dashboards:

- Critical open conflicts
- Conflicts introduced this period
- Overrides nearing expiry
- Remediation backlog by owner
- Top risky roles by conflict count

# 10. Security

Security requirements:

- SoD rules themselves are security-sensitive configuration and require restricted administration
- Override approval should follow dual-control principles for critical conflicts
- Emergency or break-glass access must be included in SoD monitoring

# 11. Audit

Audit coverage shall include:

- Rule creation, revision, activation, and deactivation
- Conflict detection with access snapshot
- Override approver, reason, and expiry
- Remediation evidence and closure
- Periodic detective-scan execution history

# 12. AI

AI-assisted opportunities:

- Cluster related conflicts into likely root-cause role design problems
- Recommend least-disruptive remediation path
- Identify roles that repeatedly create avoidable SoD risk

AI guardrails:

- AI may recommend remediation but must not auto-approve risk exceptions
- Human reviewers must confirm business impact before access removal

# 13. Test Cases

Core test scenarios:

- Block conflicting payroll access combination at assignment time
- Detect inherited conflict from two separately assigned roles
- Approve temporary override with expiry and verify tracking
- Reopen conflict after override expiry if access remains
- Clear conflict after remediation and access recertification

# 14. Workflows

Primary workflow:

1. User access change is proposed.
2. Preventive SoD check evaluates the target access set.
3. Conflict is blocked or routed to governed override path.
4. Detective reviews continue to monitor active conflicts.
5. Remediation removes the conflict or expires the override.

# 15. State Machine

Conflict state model:

- `Detected`
- `Blocked`
- `Under Review`
- `Override Approved`
- `Remediation In Progress`
- `Remediated`
- `Closed`

# 16. Permissions

Representative permissions:

- `sod.rule.manage`
- `sod.conflict.view`
- `sod.conflict.override`
- `sod.conflict.remediate`
- `sod.review.certify`
- `sod.audit.view`

# 17. Notifications

Notification scenarios:

- Critical conflict detected
- Override approval requested
- Override nearing expiry
- Remediation overdue
- New conflict introduced by bulk role assignment

# 18. Configuration

Configurable parameters:

- Rule severity model
- Preventive vs detective enforcement mode
- Override duration limits
- Review cadence
- Context dimensions included in SoD evaluation

# 19. Edge Cases

Important edge cases:

- Conflict introduced through delegated proxy access rather than direct role assignment
- Temporary project role creates critical SoD issue during payroll close
- Two conflicting permissions are held in different legal entities with different risk treatment
- Override expires while user is on leave and remediation is incomplete
