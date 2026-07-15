---
id: HRMS-SUB-27-02
title: Webhooks Specification
document: 02-webhooks.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Webhooks governs outbound event notifications delivered by HTTP callbacks to subscribed external systems.

In scope:

- Subscription management
- Delivery, retries, and signatures
- Event filtering and payload contracts
- Consumer diagnostics and replay
- Security and reliability controls

# 2. Business

Webhooks provide near-real-time integration for downstream systems that need HRMS changes without polling. They are especially important for workflow, identity, payroll, and ticketing integrations.

# 3. Functional

The system shall support:

- Webhook subscriptions by event type, tenant, and endpoint
- Signed delivery with timestamp and replay protection
- Retry, backoff, dead-letter, and manual replay
- Event filtering by module, entity, or scope
- Payload versioning and deprecation

Validation rules:

- Endpoint ownership and handshake verification shall be required before activation
- Replayed webhooks shall preserve original event reference and replay metadata
- Sensitive payload content shall follow masking and minimization rules

# 4. UX

The user experience shall provide:

- Webhook registry and status view
- Delivery history with response codes
- Replay and disable controls
- Secret rotation workflow

# 5. API

Representative APIs:

- `POST /api/v1/integration/webhooks/subscriptions`
- `GET /api/v1/integration/webhooks/subscriptions/{subscriptionId}`
- `POST /api/v1/integration/webhooks/replay`
- `POST /api/v1/integration/webhooks/{subscriptionId}/rotate-secret`

# 6. Database

Core entities:

- `webhook_subscription`
- `webhook_delivery_attempt`
- `webhook_secret_version`
- `webhook_dead_letter`

# 7. Events

The platform shall publish:

- `webhook.subscription.created`
- `webhook.delivery.failed`
- `webhook.subscription.disabled`
- `webhook.replay.completed`

# 8. Reports

Required reports:

- Webhook delivery success report
- Failing endpoint report
- Replay activity report
- Secret rotation compliance report

# 9. Dashboards

Dashboards shall show:

- Delivery success rate
- Failing endpoints by consumer
- Retry backlog
- Replay volume trend

# 10. Security

Security controls shall include:

- Secret-based signing
- Endpoint verification
- TLS enforcement
- Endpoint allowlists or network restrictions where required

# 11. Audit

The audit trail shall capture:

- Subscription creation and edits
- Secret rotation
- Disable or replay actions
- Delivery attempts and failures

# 12. AI

AI capabilities may include:

- Failure clustering by consumer pattern
- Replay recommendation after outage
- Consumer troubleshooting summaries

# 13. Test Cases

- Unverified endpoint cannot activate
- Signed payload validates correctly
- Retry and dead-letter logic works after repeated failures
- Replay adds replay metadata
- Secret rotation invalidates old signature path as configured

# 14. Workflows

1. Consumer registers webhook.
2. Endpoint is verified.
3. Events are delivered and monitored.
4. Failures are retried or replayed.

# 15. State Machine

- `draft`
- `verified`
- `active`
- `disabled`
- `failed`
- `retired`

# 16. Permissions

- Create webhook subscription
- Rotate webhook secret
- Replay webhook
- Disable webhook
- View delivery logs

# 17. Notifications

- Endpoint failure alerts
- Secret expiry notices
- Replay completion alerts

# 18. Configuration

- Retry policies
- Signing algorithms
- Delivery timeout
- Payload versioning

# 19. Edge Cases

- Consumer endpoint returns success but fails internally
- Replay after version contract changed
- One tenant has multiple endpoints for same event
- Endpoint certificate expires unexpectedly
