---
id: HRMS-SUB-20-03
title: Access control Specification
document: 03-access-control.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Access Control governs the provisioning, modification, review, suspension, and revocation of workplace and system access for contractors and external workforce populations.

In scope:

- Physical and logical access requests
- Access eligibility based on engagement and compliance status
- Vendor, site, and role-based access rules
- Periodic review and termination handling
- Linkage to security, workplace, and identity systems

# 2. Business

External workforce access is a high-risk control area because contractors often need material access to systems or facilities without being permanent employees. Governance must be strong, time-bound, and reviewable.

# 3. Functional

The system shall support:

- Access request initiation based on contractor engagement or site assignment
- Role, site, project, and privilege-specific access profiles
- Preconditions such as NDA completion, compliance validity, training, and sponsor approval
- Start and end dates for every access grant
- Badge, network, application, and shared-resource provisioning hooks
- Suspension, temporary disablement, and emergency revocation
- Periodic recertification and sponsor review

Validation rules:

- Access shall not activate for expired, inactive, or non-compliant contractor records
- High-risk privileges shall require additional approval and tighter review cadence
- Access end date shall not exceed engagement or site authorization end date unless approved

# 4. UX

The user experience shall provide:

- Sponsor and security dashboard for pending contractor access actions
- Contractor profile view with compliance and access readiness status
- Fast revoke or suspend controls for urgent security needs
- Review workbench for periodic recertification

# 5. API

Representative APIs:

- `POST /api/v1/contractors/access-requests`
- `POST /api/v1/contractors/access-grants/{grantId}/activate`
- `POST /api/v1/contractors/access-grants/{grantId}/revoke`
- `GET /api/v1/contractors/{contractorId}/access`
- `POST /api/v1/contractors/access-reviews/{reviewId}/complete`

# 6. Database

Core entities:

- `contractor_access_request`
- `contractor_access_grant`
- `contractor_access_prerequisite`
- `contractor_access_review`
- `contractor_access_revocation_log`

# 7. Events

The platform shall publish:

- `contractor.access-requested`
- `contractor.access-activated`
- `contractor.access-revoked`
- `contractor.access-review-due`
- `contractor.access-prerequisite-failed`

# 8. Reports

Required reports:

- Active contractor-access inventory
- Expiring access report
- Revocation timeliness report
- High-privilege contractor-access report

# 9. Dashboards

Dashboards shall show:

- Pending activation tasks
- Contractors at risk due to expiring compliance or access
- Unreviewed high-privilege grants
- Revocation backlog

# 10. Security

Security controls shall include:

- Strong segregation between sponsor, security, and provisioning roles
- Time-bound least-privilege access profiles
- Immediate revocation tooling for security incidents
- Complete traceability of system and workplace access changes

# 11. Audit

The audit trail shall capture:

- Every access grant and change
- Sponsor approval and review outcomes
- Emergency revoke actions
- Provisioning success or failure from downstream systems

# 12. AI

AI capabilities may include:

- Risk scoring for requested access combinations
- Detection of orphaned access after engagement changes
- Suggested revocation priorities during incident response

# 13. Test Cases

- Inactive contractor cannot receive access
- High-risk privilege requires additional approval
- Engagement end date triggers timely revocation
- Downstream provisioning failure creates exception case
- Periodic review closes only after sponsor action

# 14. Workflows

1. Contractor engagement or site assignment triggers access request.
2. Preconditions and approvals are validated.
3. Access is provisioned and monitored.
4. Periodic review and end-of-engagement revocation occur.

# 15. State Machine

- `requested`
- `pending-approval`
- `pending-provisioning`
- `active`
- `suspended`
- `revoked`
- `expired`

# 16. Permissions

- Request contractor access
- Approve contractor access
- Provision or revoke access
- Review high-privilege access
- View contractor-access audit logs

# 17. Notifications

- Pending prerequisite alerts
- Approval requests
- Access activation confirmations
- Review-due and revocation alerts

# 18. Configuration

- Access profile catalog
- Prerequisite rules
- Review cadence
- Emergency revoke policy

# 19. Edge Cases

- Contractor changes vendor but continues same assignment
- Site access remains active after system access revoked
- Emergency incident requires bulk contractor revocation
- Contractor has multiple concurrent projects with conflicting access levels
