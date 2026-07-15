---
id: HRMS-SUB-29-06
title: Access reviews Specification
document: 06-access-reviews.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Access Reviews governs periodic certification of user access, privileged roles, and sensitive data entitlements across the HRMS platform and connected systems.

In scope:

- Review campaign setup
- Reviewer assignment and certification tasks
- Role, permission, and privileged access review
- Remediation tracking
- Evidence retention for audit and compliance

# 2. Business

Periodic access certification is a key control for preventing privilege creep, orphaned access, and excessive exposure of sensitive HR data. It also provides evidence for internal and external audits.

# 3. Functional

The system shall support:

- Review campaigns by system, role family, department, manager scope, or risk class
- Scope selection for users, roles, sensitive permissions, service accounts, and delegated access
- Reviewer assignment to manager, application owner, security owner, or delegated certifier
- Approve, revoke, delegate, and comment decisions
- Tracking of overdue reviews and remediation completion
- Recertification evidence storage and export

Validation rules:

- Review scope shall be frozen for the campaign snapshot unless rebuilt by administrator
- High-risk access shall require explicit decision and may not be bulk-approved depending on policy
- Revoked access shall generate downstream remediation tasks and confirmation

# 4. UX

The user experience shall provide:

- Reviewer workbench with grouped access items and risk signals
- Bulk actions for low-risk items
- Drill-through to justification, last-used evidence, and owner context
- Campaign-level progress dashboard

# 5. API

Representative APIs:

- `POST /api/v1/governance/access-reviews/campaigns`
- `GET /api/v1/governance/access-reviews/campaigns/{campaignId}`
- `POST /api/v1/governance/access-reviews/items/{itemId}/certify`
- `POST /api/v1/governance/access-reviews/items/{itemId}/revoke`
- `GET /api/v1/governance/access-reviews/evidence`

# 6. Database

Core entities:

- `access_review_campaign`
- `access_review_item`
- `access_review_decision`
- `access_review_reviewer_assignment`
- `access_review_remediation_task`

# 7. Events

The platform shall publish:

- `access-review.campaign.started`
- `access-review.item.certified`
- `access-review.item.revoked`
- `access-review.campaign.overdue`
- `access-review.remediation.completed`

# 8. Reports

Required reports:

- Campaign completion report
- High-risk access certification report
- Revocation remediation report
- Reviewer aging report

# 9. Dashboards

Dashboards shall show:

- Campaign progress
- Outstanding high-risk items
- Revocation completion backlog
- Repeat access-review exceptions

# 10. Security

Security controls shall include:

- Reviewer access limited to their campaign scope
- Strong controls on privileged-role review
- Immutable evidence for completed certifications
- Separation of reviewers from self-certifying sensitive access where prohibited

# 11. Audit

The audit trail shall capture:

- Campaign creation and scope snapshot
- Reviewer decisions
- Remediation outcomes
- Delegation and exception actions

# 12. AI

AI capabilities may include:

- Prioritization of high-risk review items
- Suggested revocation based on inactivity or conflicting entitlements
- Summary narratives for auditors

# 13. Test Cases

- Campaign snapshot remains stable after access changes
- High-risk role requires explicit decision
- Revocation task completes only after downstream confirmation
- Self-certification restriction is enforced
- Overdue campaign escalation triggers correctly

# 14. Workflows

1. Review campaign is created and scoped.
2. Reviewers receive access items.
3. Decisions are recorded and remediations triggered.
4. Campaign closes with evidence preserved.

# 15. State Machine

- `draft`
- `launched`
- `in-review`
- `overdue`
- `remediation`
- `completed`
- `archived`

# 16. Permissions

- Create access-review campaign
- Review assigned access items
- Revoke entitlements
- View certification evidence
- Close campaign

# 17. Notifications

- Campaign launch alerts
- Reviewer reminders
- High-risk overdue alerts
- Remediation completion notices

# 18. Configuration

- Campaign cadence
- Reviewer assignment rules
- High-risk entitlement catalog
- Evidence retention requirements

# 19. Edge Cases

- Reviewer leaves organization mid-campaign
- Access removed before review decision
- One entitlement belongs to multiple certification scopes
- Connected downstream system fails to revoke access on time
