---
id: HRMS-SUB-06-04
title: Candidate portal Specification
document: 04-candidate-portal.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Candidate Portal governs the authenticated experience where external applicants manage profiles, applications, interviews, documents, offers, and communication history.

In scope:

- Candidate account and profile management
- Application tracking
- Document and task completion
- Interview and offer visibility
- Communication and consent management

# 2. Business

The candidate portal is the continuity layer between application entry and hire conversion. It improves transparency, reduces manual recruiter follow-up, and creates a consistent digital experience for candidates across stages.

# 3. Functional

The system shall support:

- Candidate account creation, sign-in, recovery, and profile maintenance
- Resume, profile, skills, education, work history, and preferences capture
- Application status visibility across roles
- Interview schedules, preparation notes, and task completion
- Document upload, consent tracking, and profile updates
- Offer letter view, response, and acceptance workflow where allowed

Detailed rules:

- Candidate should manage one reusable profile across multiple applications where supported
- Status visibility should be intentionally designed and not leak internal recruiter workflow states
- Candidate-uploaded documents must be validated, versioned, and scoped appropriately
- Offer response visibility should synchronize with internal offer-management workflow

# 4. UX

Primary screens:

- Candidate dashboard
- Profile editor
- My applications view
- Interview and task center
- Offer response page

# 5. API

- `POST /api/v1/candidate-portal/accounts`
- `GET /api/v1/candidate-portal/profile`
- `PUT /api/v1/candidate-portal/profile`
- `GET /api/v1/candidate-portal/applications`
- `POST /api/v1/candidate-portal/documents`
- `POST /api/v1/candidate-portal/offers/{offerId}/respond`

# 6. Database

Core entities:

- `candidate_account`
- `candidate_profile`
- `candidate_application_view`
- `candidate_portal_document`
- `candidate_offer_response`
- `candidate_consent_record`

Key fields:

- Candidate ID, account status, locale, communication preferences
- Profile completeness, resume reference, skill tags, preferred locations
- Application stage, display status, recruiter contact visibility
- Document type, upload status, verification result
- Offer response, response date, comment, acceptance method

# 7. Events

- `candidate_portal.account_created`
- `candidate_portal.profile_updated`
- `candidate_portal.document_uploaded`
- `candidate_portal.offer_responded`
- `candidate_portal.application_viewed`

# 8. Reports

- Candidate portal adoption report
- Profile completion report
- Application self-service usage report
- Offer-response turnaround report

# 9. Dashboards

- Candidate portal activity
- Profile completeness funnel
- Candidate task completion
- Offer acceptance latency

# 10. Security

- Candidate identities, documents, and offers require strong access and privacy controls
- Portal session, consent, and document-download events should be auditable
- Candidate data retention and deletion rights must be supported

# 11. Audit

- Account creation and sign-ins
- Profile edits
- Document uploads and replacements
- Offer responses
- Consent changes

# 12. AI

- Suggest profile improvements to candidates
- Detect incomplete application risk
- Summarize candidate portal issues for recruiting operations

# 13. Test Cases

- Create candidate account and profile
- View multiple applications
- Upload required document
- Accept or decline offer through portal
- Hide internal-only stage names from candidate

# 14. Workflows

1. Candidate creates or reuses account.
2. Candidate updates profile and submits applications.
3. Candidate tracks progress and completes tasks.
4. Candidate views and responds to offer where enabled.

# 15. State Machine

- `Active`
- `Locked`
- `Profile Incomplete`
- `Application Active`
- `Offer Pending`
- `Closed`

# 16. Permissions

- `candidate_portal.profile.manage`
- `candidate_portal.documents.manage`
- `candidate_portal.offer.respond`
- `candidate_portal.audit.view`

# 17. Notifications

- Application status updated
- Interview scheduled
- Missing document reminder
- Offer response pending

# 18. Configuration

- Displayed status mapping
- Profile fields
- Offer response options
- Consent text by locale
- Candidate self-service limits

# 19. Edge Cases

- Candidate applies with one email, then signs in with federated identity
- Candidate withdraws one application but keeps others active
- Offer expires while candidate is reviewing portal content
- Candidate edits profile after screening already started
