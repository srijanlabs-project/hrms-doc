---
id: HRMS-SUB-00-08
title: Event bus Specification
document: 08-event-bus.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Event Bus governs asynchronous communication between services, modules, workflows, analytics, and integrations across the HRMS platform.

In scope:

- Event publishing and subscription
- Topic taxonomy and contracts
- Delivery guarantees and replay
- Observability and error handling
- Governance of event evolution

# 2. Business

The event bus enables platform decoupling, scale, and near-real-time responsiveness. It is essential for connecting employee lifecycle changes to workflows, notifications, analytics, and external systems.

# 3. Functional

The system shall support:

- Topic and event-type definitions with versioning
- At-least-once delivery with idempotency support
- Ordered delivery where required by contract
- Retry, dead-letter, replay, and backfill capabilities
- Consumer registration and subscription management
- Event filtering and routing by tenant, entity, and domain

Validation rules:

- Published events shall conform to schema version and required headers
- Breaking schema changes shall not be introduced without governed version transition
- Replay shall not bypass consumer idempotency requirements

# 4. UX

The user experience shall provide:

- Event catalog viewer
- Subscription management console
- Dead-letter and replay operations view
- Event trace and correlation explorer

# 5. API

Representative APIs:

- `POST /api/v1/platform/events/publish`
- `GET /api/v1/platform/events/catalog`
- `POST /api/v1/platform/events/replay`
- `GET /api/v1/platform/events/dead-letter`

# 6. Database

Core entities:

- `event_definition`
- `event_subscription`
- `event_delivery_log`
- `event_dead_letter_record`
- `event_replay_job`

# 7. Events

The platform shall publish:

- `event-bus.delivery-failed`
- `event-bus.dead-letter.created`
- `event-bus.replay.started`
- `event-bus.schema-published`

# 8. Reports

Required reports:

- Publish volume report
- Delivery failure report
- Consumer lag report
- Replay activity report

# 9. Dashboards

Dashboards shall show:

- Throughput by topic
- Consumer lag and backlog
- Dead-letter volume
- Schema-version adoption

# 10. Security

Security controls shall include:

- Authenticated publishers and subscribers
- Tenant-safe event routing
- Protection against unauthorized replay or subscription
- Payload classification and encryption policies

# 11. Audit

The audit trail shall capture:

- Subscription creation and change
- Replay and dead-letter actions
- Schema publication
- Access to restricted event streams

# 12. AI

AI capabilities may include:

- Detection of anomalous consumer lag
- Suggested replay scope after incident
- Event classification or contract documentation support

# 13. Test Cases

- Invalid event schema is rejected
- Duplicate delivery handled safely by consumer contract
- Dead-letter record created after retry exhaustion
- Replay targets correct topic and time range
- Tenant routing prevents cross-tenant leakage

# 14. Workflows

1. Producer publishes event.
2. Event bus validates and routes it.
3. Consumers process and acknowledge.
4. Failures are retried, dead-lettered, or replayed.

# 15. State Machine

- `published`
- `delivered`
- `retried`
- `dead-lettered`
- `replayed`
- `archived`

# 16. Permissions

- Publish events
- Manage subscriptions
- Replay events
- View dead-letter queue
- Manage event schemas

# 17. Notifications

- Consumer lag alerts
- Delivery failure alerts
- Replay completion notices

# 18. Configuration

- Topic catalog
- Retry policies
- Ordering guarantees
- Retention and replay windows

# 19. Edge Cases

- Consumer outage during payroll-close event burst
- Event schema changes while consumers lag on old version
- One business action emits many dependent events
- Replay causes duplicate downstream side effects without idempotency
