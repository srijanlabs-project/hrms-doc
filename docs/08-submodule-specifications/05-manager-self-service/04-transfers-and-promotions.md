---
id: HRMS-SUB-05-04
title: Transfers and promotions Specification
document: 04-transfers-and-promotions.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Transfers and Promotions governs the manager self-service initiation and tracking experience for employee movement proposals affecting role, location, team, or level.

In scope:

- Manager-initiated promotion and transfer proposals
- Justification, recommendation, and supporting evidence
- Approval and HR review routing
- Visibility into downstream employment and compensation actions
- Tracking of proposal status to completion

# 2. Business

Managers are often the first initiators of internal mobility. A dedicated workspace ensures proposals are structured, policy-aware, and routed with the right information for HR and compensation review.

# 3. Functional

The system shall support:

- Initiation of promotion, lateral move, team transfer, location change, and temporary assignment proposals
- Entry of business justification, effective date, target role, manager, and grade or pay impact indicators
- Upload of supporting evidence such as role fit, vacancy linkage, or succession rationale
- Routing to HRBP, compensation, and approving leaders
- Tracking of status, pending tasks, and effective date readiness
- Linkage to official employment-movement transaction upon approval

Validation rules:

- Manager can propose changes only for authorized reporting population
- Proposed moves shall validate against open position or policy rules where configured
- Promotion proposals implying salary change shall route to compensation review

# 4. UX

The user experience shall provide:

- Proposal wizard with current and proposed role context
- Policy hints for level movement and target eligibility
- Status tracker from draft to effective
- Team list view of open mobility proposals

# 5. API

Representative APIs:

- `POST /api/v1/mss/transfers-promotions`
- `GET /api/v1/mss/transfers-promotions`
- `PATCH /api/v1/mss/transfers-promotions/{proposalId}`
- `POST /api/v1/mss/transfers-promotions/{proposalId}/submit`
- `GET /api/v1/mss/transfers-promotions/{proposalId}/status`

# 6. Database

Core entities:

- `manager_mobility_proposal`
- `manager_mobility_justification`
- `manager_mobility_attachment`
- `manager_mobility_status_log`

# 7. Events

The platform shall publish:

- `mss.mobility-proposal.created`
- `mss.mobility-proposal.submitted`
- `mss.mobility-proposal.approved`
- `mss.mobility-proposal.rejected`
- `mss.mobility-proposal.effective`

# 8. Reports

Required reports:

- Internal mobility proposal report
- Promotion versus transfer trend report
- Proposal turnaround report
- Manager initiation adoption report

# 9. Dashboards

Dashboards shall show:

- Open mobility proposals
- Approvals pending by stage
- Effective-date readiness
- Internal movement conversion rate

# 10. Security

Security controls shall include:

- Manager scope-based initiation rights
- Restricted view of compensation-related sections
- Confidential handling of succession or corrective-demotion rationale
- Controlled visibility before official approval

# 11. Audit

The audit trail shall capture:

- Proposal creation and edits
- Justification changes
- Supporting-document actions
- Approval or rejection path

# 12. AI

AI capabilities may include:

- Drafting help for movement justifications
- Policy-fit checks on proposed move
- Suggested downstream dependencies to review

# 13. Test Cases

- Manager cannot initiate proposal for out-of-scope employee
- Promotion requiring compensation review routes correctly
- Draft proposal resumes with saved values
- Approved proposal creates linked movement case
- Target-role policy conflict is surfaced

# 14. Workflows

1. Manager creates mobility proposal.
2. System validates scope and policy.
3. Proposal routes for HR and leadership review.
4. Approved proposal becomes formal movement case.
5. Manager tracks effective completion.

# 15. State Machine

- `draft`
- `submitted`
- `under-review`
- `approved`
- `rejected`
- `converted`
- `closed`

# 16. Permissions

- Initiate mobility proposal
- Edit draft proposal
- View proposal status
- Attach supporting evidence
- Withdraw own proposal

# 17. Notifications

- Submission confirmation
- Review-stage updates
- Approval or rejection outcome
- Effective-date completion notice

# 18. Configuration

- Allowed proposal types
- Manager initiation scope
- Required justification fields
- Approval routing and compensation hooks

# 19. Edge Cases

- Employee already has pending transfer
- Manager proposes move into role that is frozen
- Employee exits before proposal is finalized
- Temporary assignment later converted to permanent transfer
