---
id: HRMS-SUB-06-08
title: Offer management Specification
document: 08-offer-management.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Offer Management governs the preparation, approval, issuance, negotiation, acceptance, and closure of employment offers for selected candidates.

In scope:

- Compensation proposal assembly
- Offer approval workflow
- Offer letter generation and versioning
- Candidate negotiation and response handling
- Handoff to preboarding, employee master creation, and payroll readiness

# 2. Business

Offer management is the commercial and legal closure point of recruitment. Errors here directly affect candidate conversion, employer credibility, internal equity, and downstream onboarding accuracy.

Business outcomes:

- Improve offer acceptance rates with faster and better-governed proposals
- Ensure compensation and terms comply with policy and approval controls
- Avoid manual errors between recruitment, HR operations, and payroll setup
- Maintain traceable negotiation history and approved exceptions

# 3. Functional

The system shall support:

- Offer creation from selected candidate and requisition context
- Salary components, bonus, stock, benefits, relocation, joining bonus, and conditional clauses
- Comparison against budget, internal equity bands, and compensation policy
- Multi-level approvals based on compensation threshold, grade, geography, and exception type
- Offer letter templates by country, worker type, language, and brand
- Digital issue, expiry tracking, candidate acceptance, decline, and counteroffer handling
- Withdrawal, revoke, reissue, and amendment controls
- Pre-joining document checklist and background verification dependencies
- Auto-conversion into preboarding or employee record after acceptance

Validation rules:

- Offer cannot be issued without approved compensation and mandatory approvals complete
- Candidate status must be `selected` or approved equivalent before offer creation
- Expired offers shall not be accepted without revalidation or extension
- Changes to compensation after approval shall force re-approval according to policy

# 4. UX

The user experience shall provide:

- Offer workspace with candidate profile, selected package, budget variance, and approvals
- Side-by-side comparison with current employee peers or policy range where permitted
- Offer letter preview with clause-level placeholders and legal notes
- Candidate portal view for reading, downloading, accepting, declining, or asking questions
- Recruiter console showing open offers, risk indicators, and expiring responses

# 5. API

Representative APIs:

- `POST /api/v1/recruitment/offers`
- `PATCH /api/v1/recruitment/offers/{offerId}`
- `POST /api/v1/recruitment/offers/{offerId}/submit-for-approval`
- `POST /api/v1/recruitment/offers/{offerId}/issue`
- `POST /api/v1/recruitment/offers/{offerId}/candidate-response`
- `POST /api/v1/recruitment/offers/{offerId}/convert-to-preboarding`

API requirements:

- Offer APIs shall validate compensation policy and template completeness
- Candidate response endpoints shall support secure token or authenticated portal channels
- Document-generation services shall preserve rendered artifacts and template versions

# 6. Database

Core entities:

- `offer`
- `offer_component`
- `offer_approval`
- `offer_document`
- `offer_negotiation_event`
- `offer_response`
- `preboarding_conversion_log`

Key data requirements:

- Offer records shall store salary structure, validity dates, location, join date, and policy exception flags
- Approval records shall store approver role, sequence, outcome, and rationale
- Negotiation events shall capture proposal version, candidate ask, recruiter notes, and decision

# 7. Events

The platform shall publish:

- `offer.created`
- `offer.submitted-for-approval`
- `offer.approved`
- `offer.issued`
- `offer.candidate-accepted`
- `offer.candidate-declined`
- `offer.expired`
- `offer.converted-to-preboarding`

# 8. Reports

Required reports:

- Offer acceptance ratio by role, location, recruiter, and source
- Offer turnaround and approval delay report
- Compensation exception and budget variance report
- Decline reason analysis
- Reissue and negotiation trend report

# 9. Dashboards

Dashboards shall show:

- Open offers by aging and expiry risk
- Acceptance funnel and expected joining pipeline
- Budget variance across active offers
- Decline reasons and compensation competitiveness indicators

# 10. Security

Security controls shall include:

- Strict access to compensation details, letter artifacts, and bank or identity attachments
- E-signature and candidate response flows protected by secure tokens and expiry
- Segregation between recruiter, HRBP, compensation, and legal roles
- Watermarking or download controls for confidential executive offers where required

# 11. Audit

The audit trail shall capture:

- Every approval, compensation change, and clause update
- Offer issue, view, download, and candidate response timestamps
- Extensions, withdrawals, and reissues
- Conversion to preboarding and employee creation outcomes

# 12. AI

AI capabilities may include:

- Predicted offer acceptance risk based on market, compensation, and process factors
- Suggested negotiation strategy and approval routing
- Detection of clause mismatch or missing legal language

AI guardrails:

- AI shall not auto-send offers or auto-negotiate without human approval
- Compensation recommendations shall expose the factors used and respect policy boundaries

# 13. Test Cases

Minimum test coverage shall include:

- Offer blocked when compensation exceeds approver authority without escalation
- Candidate cannot accept an expired offer
- Reissued offer preserves previous version history
- Accepted offer creates preboarding record with correct compensation data
- Withdrawal after issue revokes portal access and logs notifications

# 14. Workflows

Primary workflow:

1. Candidate is selected for hire.
2. Recruiter or HR prepares compensation proposal.
3. Approval chain reviews package and exceptions.
4. Approved offer letter is issued to candidate.
5. Candidate accepts, declines, or negotiates.
6. Accepted offer converts to preboarding and downstream setup.

# 15. State Machine

Supported states:

- `draft`
- `pending-approval`
- `approved`
- `issued`
- `negotiation`
- `accepted`
- `declined`
- `expired`
- `withdrawn`
- `converted`

# 16. Permissions

Permissions shall include:

- Create draft offers
- Edit compensation components
- Approve or reject offers
- Issue and reissue offer letters
- Withdraw or extend offers
- View negotiation history and convert accepted offers

# 17. Notifications

Notifications shall support:

- Approver tasks and escalation reminders
- Candidate offer issuance and expiry reminders
- Recruiter alerts for counteroffers, declines, and pending acceptance
- Preboarding and payroll teams notified after accepted conversion

# 18. Configuration

Administrators shall configure:

- Offer templates by geography and worker type
- Approval matrices and policy thresholds
- Compensation components and default structures
- Expiry periods, reminder cadence, and response channels
- Clause libraries and exception types

# 19. Edge Cases

The design shall address:

- Candidate accepts while approval was later revoked due to detected policy issue
- Multiple concurrent offers to the same candidate across entities
- Executive or international hire requiring custom clauses and long approvals
- Candidate requests different joining date after acceptance
- Offer acceptance received through email while portal is temporarily unavailable
