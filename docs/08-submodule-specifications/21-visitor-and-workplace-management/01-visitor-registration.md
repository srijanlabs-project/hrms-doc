---
id: HRMS-SUB-21-01
title: Visitor registration Specification
document: 01-visitor-registration.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Visitor Registration governs the pre-registration, check-in, approval, tracking, and exit of external visitors entering workplace premises, offices, plants, campuses, or secure facilities.

In scope:

- Visitor pre-registration and invitation
- Host approval and arrival management
- Check-in, badge issuance, and access controls
- Watchlist, safety, and compliance checks
- Visitor movement, checkout, and audit history

# 2. Business

Visitor management is a workplace security, safety, and experience function. It helps organizations welcome guests efficiently while controlling access, knowing who is on site, and maintaining defensible records for audits and emergency response.

Business objectives:

- Improve visitor check-in speed while preserving security controls
- Maintain real-time visibility of who is on site and why
- Support site-safety, compliance, and emergency accountability
- Reduce manual front-desk processes and untracked access

# 3. Functional

The system shall support:

- Pre-registration by host, admin, or self-service invitation flow
- Visitor types such as guest, vendor, candidate, consultant, auditor, delivery, and interview panel participant
- Host approval, site approval, and restricted-area approval where needed
- Identity capture through ID upload, manual verification, or badge-scan integration
- NDA, safety briefing, consent, and watchlist acknowledgement steps where applicable
- Badge issuance, temporary access window, and checkout handling
- Visitor status tracking including expected, arrived, checked in, on site, checked out, denied, or expired

Detailed rules:

- Sensitive or restricted sites may require multi-step approval before visitor arrival
- Candidate or interview visitors should integrate with recruitment or meeting context where configured
- Walk-in visitors should follow a reduced but still auditable registration path
- Watchlist, denied-party, or policy-failed visitors must trigger restricted handling and not complete normal check-in
- On-site visitor count should remain available for security and emergency accountability functions
- Badge validity should expire automatically at checkout or end-of-visit window unless extended by authorized role
- Repeat visitors may reuse a profile but should not bypass current identity, consent, or safety checks where policy requires

# 4. UX

Primary screens:

- Visitor pre-registration form
- Front-desk check-in console
- Host approval inbox
- Live on-site visitor board
- Badge and checkout screen

UX expectations:

- Front-desk teams should complete routine check-ins in seconds
- Hosts should clearly see who is arriving, for what purpose, and whether approval is pending
- Visitors should experience a simple workflow with clear identity, consent, and safety steps
- Security views should emphasize denied, overdue, or unescorted visitors

# 5. API

Representative APIs:

- `POST /api/v1/workplace/visitors`
- `GET /api/v1/workplace/visitors/{visitorId}`
- `POST /api/v1/workplace/visitors/{visitorId}/approve`
- `POST /api/v1/workplace/visitors/{visitorId}/check-in`
- `POST /api/v1/workplace/visitors/{visitorId}/checkout`
- `GET /api/v1/workplace/visitors/on-site`

# 6. Database

Core entities:

- `visitor_registration`
- `visitor_host_approval`
- `visitor_identity_check`
- `visitor_badge_issue`
- `visitor_visit_log`
- `visitor_watchlist_match`

Key fields:

- Visitor ID, visitor type, host, site, visit purpose, expected arrival time
- Approval status, approval route, restricted-area flag, escort requirement
- Identity type, document reference, verification status, consent status
- Badge number, access start and end time, checkout time, overstay indicator
- Watchlist match result, denial reason, security-note flag
- Vehicle plate, parking authorization, delivery-item indicator
- Emergency-contact method, visitor language preference, accessibility-note flag

# 7. Events

Published events:

- `visitor.preregistered`
- `visitor.approved`
- `visitor.checked_in`
- `visitor.denied`
- `visitor.checked_out`
- `visitor.overstayed`

Consumed events:

- `meeting.created`
- `candidate.interview_scheduled`
- `emergency.activated`
- `security.watchlist.updated`

# 8. Reports

Required reports:

- Visitor log report
- On-site visitor report
- Denied and flagged visitor report
- Host response time report
- Visitor overstay report
- Repeat-visitor frequency report
- Escort-required compliance report

# 9. Dashboards

Operational dashboards:

- Expected arrivals today
- Currently on-site visitors
- Pending host approvals
- Denied or flagged visitor alerts
- Front-desk throughput and average check-in time

# 10. Security

Security requirements:

- Identity documents and watchlist status must be tightly controlled
- Restricted-area visitors should be visible only to authorized security and host roles
- Badge issuance and denial actions should be separately permissioned

# 11. Audit

Audit coverage shall include:

- Visitor creation and approval
- Check-in and checkout timestamps
- Badge issue and return actions
- Identity verification and denial outcomes
- Watchlist-match review and override actions

# 12. AI

AI-assisted opportunities:

- Predict high-traffic check-in windows for staffing
- Detect repeated suspicious registration patterns
- Extract identity or business-card metadata where policy allows

AI guardrails:

- AI extraction should never finalize identity verification without configured human review
- Suspicious-pattern alerts should be reviewable and should not silently deny access

# 13. Test Cases

Core test scenarios:

- Pre-register visitor and route for host approval
- Check in approved visitor and issue temporary badge
- Deny flagged visitor after watchlist check
- Track overstay beyond approved end time
- Checkout visitor and close site-presence record
- Reuse repeat-visitor profile while enforcing current-day safety acknowledgment
- Auto-expire badge when visitor forgets to check out

# 14. Workflows

Primary workflow:

1. Visitor is pre-registered or arrives as walk-in.
2. Host or site approvals are obtained where required.
3. Front desk verifies identity and completes check-in.
4. Visitor remains tracked while on site.
5. Checkout closes access and updates audit records.

# 15. State Machine

Visitor state model:

- `Pre-Registered`
- `Pending Approval`
- `Approved`
- `Checked In`
- `On Site`
- `Checked Out`
- `Denied`
- `Expired`

# 16. Permissions

Representative permissions:

- `visitor_registration.create`
- `visitor_registration.approve`
- `visitor_registration.check_in`
- `visitor_registration.check_out`
- `visitor_registration.view_sensitive`
- `visitor_registration.audit.view`

# 17. Notifications

Notification scenarios:

- Visitor awaiting host approval
- Visitor arrived and host notified
- Visitor denied or flagged
- Visitor overstayed expected departure
- Emergency requires visitor accountability check

# 18. Configuration

Configurable parameters:

- Visitor types
- Approval rules by site or zone
- Identity requirements
- Badge validity defaults
- Watchlist and denial behavior

# 19. Edge Cases

Important edge cases:

- Visitor arrives without preregistration and host is unavailable
- Same visitor enters multiple times in one day
- Visitor requires escort but host delegate takes over mid-visit
- Emergency activation occurs while visitors are still being checked in
