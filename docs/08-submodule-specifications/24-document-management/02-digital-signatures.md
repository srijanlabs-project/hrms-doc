---
id: HRMS-SUB-24-02
title: Digital signatures Specification
document: 02-digital-signatures.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Digital Signatures governs the preparation, routing, execution, verification, and evidence preservation of electronically signed HRMS documents.

In scope:

- Signature request preparation
- Signer routing and authentication
- Signature execution and completion tracking
- Signed-document sealing and evidence capture
- Signature provider integration and audit traceability

# 2. Business

HRMS documents such as offer letters, policies, acknowledgments, contracts, amendments, consent forms, and clearance statements often require legally or operationally recognized signatures. A governed signature process improves speed, reduces paper dependence, and preserves enforceable evidence.

Business objectives:

- Accelerate document execution cycles
- Reduce manual printing and scanning workflows
- Preserve tamper-evident evidence of signer identity and intent
- Support compliance with internal and jurisdictional signature requirements

# 3. Functional

The system shall support:

- Single-signer, multi-signer, sequential, parallel, and counter-signature workflows
- Internal signer, external signer, employee, contractor, manager, and vendor scenarios
- Signature methods such as typed e-sign, click-to-accept, OTP, provider-backed signature, or qualified digital signature where supported
- Draft, sent, viewed, partially signed, completed, declined, and expired lifecycle states
- Reminder, expiry, resend, and cancellation flows
- Provider integration for signature generation, verification, and signed artifact retrieval

Detailed rules:

- Signature workflow must preserve the exact document version presented to each signer
- Completed signed documents should be sealed or marked immutable within repository controls
- Different document types may require different signer authentication strength
- Declined or expired requests should remain traceable without appearing as completed
- Signature evidence must be linked to document, signer, method, timestamp, and IP or device metadata where lawful
- Counter-signature and witness-signature flows should remain distinguishable in both UI and evidence package
- Re-sending a request should not invalidate already completed signatures unless policy explicitly requires full restart

# 4. UX

Primary screens:

- Signature request builder
- Signer routing and authentication setup
- Signature inbox
- Execution status dashboard
- Signed-document evidence view

UX expectations:

- Request creators should understand signer order, status, and authentication strength clearly
- Signers should complete low-friction workflows on mobile and desktop
- HR and legal users should quickly inspect completion status and supporting evidence

# 5. API

Representative APIs:

- `POST /api/v1/documents/signatures/requests`
- `GET /api/v1/documents/signatures/requests/{requestId}`
- `POST /api/v1/documents/signatures/requests/{requestId}/send`
- `POST /api/v1/documents/signatures/requests/{requestId}/cancel`
- `POST /api/v1/documents/signatures/providers/callback`
- `GET /api/v1/documents/signatures/requests/{requestId}/evidence`

# 6. Database

Core entities:

- `signature_request`
- `signature_request_signer`
- `signature_execution_event`
- `signed_document_artifact`
- `signature_provider_transaction`
- `signature_decline_reason`

Key fields:

- Request ID, source document ID, workflow type, status, expiry date
- Signer identity, role, order, authentication method, view timestamp, sign timestamp
- Provider reference, callback status, evidence package location, checksum
- Decline reason, resend count, cancellation reason, reminder count
- Signature field placement template, signing locale, and IP-country evidence
- Reauthentication requirement flag and document-seal status

# 7. Events

Published events:

- `signature.request_created`
- `signature.request_sent`
- `signature.request_viewed`
- `signature.completed`
- `signature.declined`
- `signature.expired`

Consumed events:

- `document.version_created`
- `offer.generated`
- `policy.acknowledgment_required`
- `provider.callback_received`

# 8. Reports

Required reports:

- Signature request status report
- Average signing turnaround report
- Declined and expired request report
- Signed-document evidence report
- Provider performance report
- Authentication-method usage report
- Counter-signature cycle report

# 9. Dashboards

Operational dashboards:

- Requests awaiting signature
- Near-expiry requests
- Completion rate by document type
- Provider callback failures
- Signature turnaround by signer type

# 10. Security

Security requirements:

- Signed documents and evidence must be tamper-evident and access-controlled
- Signer authentication configuration should align with document sensitivity and legal policy
- Provider credentials, callback verification, and webhook security are mandatory

# 11. Audit

Audit coverage shall include:

- Request creation and routing changes
- Signer view and sign events
- Decline, cancel, and resend actions
- Provider transaction and callback history
- Download or export of signed evidence packages

# 12. AI

AI-assisted opportunities:

- Detect incomplete signer routing before send
- Recommend authentication strength based on document type
- Summarize stalled signature workflows and likely blockers

AI guardrails:

- AI recommendations must not weaken signer-authentication requirements below policy baseline
- Signature blockers surfaced by AI should remain explainable and reviewable

# 13. Test Cases

Core test scenarios:

- Send sequential signature request to multiple signers
- Complete request with provider callback confirmation
- Decline request and preserve evidence history
- Expire request and stop further signature actions
- Lock signed document against later content mutation
- Resend request without corrupting earlier completed signer events
- Preserve evidence when signer completes through alternate locale or device context

# 14. Workflows

Primary workflow:

1. Source document is prepared for signature.
2. Signers, order, and authentication method are configured.
3. Signature request is sent and reminders run.
4. Signers complete or decline the request.
5. Completed document and evidence package are stored in repository.

# 15. State Machine

Signature request state model:

- `Draft`
- `Sent`
- `Partially Signed`
- `Completed`
- `Declined`
- `Expired`
- `Cancelled`

# 16. Permissions

Representative permissions:

- `signature_request.create`
- `signature_request.send`
- `signature_request.cancel`
- `signature_request.view_evidence`
- `signature_provider.manage`
- `signature_audit.view`

# 17. Notifications

Notification scenarios:

- Signature request sent
- Reminder to pending signer
- Request declined
- Request completed
- Request nearing expiry

# 18. Configuration

Configurable parameters:

- Signature provider routing
- Authentication methods by document type
- Reminder cadence
- Request expiry rules
- Evidence-retention policy

# 19. Edge Cases

Important edge cases:

- Source document changes after request is sent
- One signer completes while another signer’s identity record changes
- Provider callback arrives late after request has already expired
- External signer lacks enterprise identity but must still sign securely
