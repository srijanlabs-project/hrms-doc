---
id: HRMS-SUB-27-03
title: Event streaming Specification
document: 03-event-streaming.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Event Streaming governs high-throughput, append-only integration channels used by consumers that subscribe to continuous HRMS event data.

In scope:

- Stream topic design
- Consumer groups and offsets
- Throughput, ordering, and replay
- Retention and schema governance
- Monitoring and operational support

# 2. Business

Event streaming supports scalable downstream processing for analytics, lakehouse ingestion, identity propagation, and enterprise middleware that need continuous data flow.

# 3. Functional

The system shall support:

- Topic families by domain and tenancy
- Consumer groups, offsets, lag tracking, and replay windows
- Schema registry integration and version control
- Delivery ordering guarantees by partition key where defined
- Retention policy and historical replay

Validation rules:

- Stream payloads shall conform to registered schema version
- Partition key rules shall be stable for ordered domains
- Consumer lag beyond threshold shall trigger alerting

# 4. UX

The user experience shall provide:

- Stream catalog
- Consumer lag and health view
- Replay and offset reset tooling for authorized operators
- Schema evolution visibility

# 5. API

Representative APIs:

- `GET /api/v1/integration/streams/catalog`
- `GET /api/v1/integration/streams/consumers`
- `POST /api/v1/integration/streams/replay`
- `POST /api/v1/integration/streams/offset-reset`

# 6. Database

Core entities:

- `stream_definition`
- `stream_schema_version`
- `stream_consumer_group`
- `stream_replay_request`
- `stream_lag_snapshot`

# 7. Events

The platform shall publish:

- `stream.schema-published`
- `stream.consumer-lag.alerted`
- `stream.replay.started`
- `stream.offset-reset.completed`

# 8. Reports

Required reports:

- Consumer lag report
- Schema evolution report
- Replay activity report
- Stream retention report

# 9. Dashboards

Dashboards shall show:

- Lag by consumer group
- Throughput by topic
- Replay and reset actions
- Stream health trend

# 10. Security

Security controls shall include:

- Authenticated stream access
- Tenant and domain isolation
- Restriction on replay and offset reset
- Payload classification controls

# 11. Audit

The audit trail shall capture:

- Stream access grants
- Replay and offset reset actions
- Schema publications
- Consumer-group admin changes

# 12. AI

AI capabilities may include:

- Lag root-cause clustering
- Consumer health prediction
- Schema-change impact summaries

# 13. Test Cases

- Ordered partition preserves entity sequence
- Invalid schema version is rejected
- Replay targets correct offset range
- Lag threshold produces alert
- Tenant isolation prevents unauthorized stream access

# 14. Workflows

1. Stream topic is published.
2. Consumer group subscribes and reads offsets.
3. Lag and health are monitored.
4. Replay or reset is performed when needed.

# 15. State Machine

- `defined`
- `active`
- `lagging`
- `replaying`
- `deprecated`
- `retired`

# 16. Permissions

- View stream catalog
- Manage consumer groups
- Replay stream
- Reset offsets
- Publish schemas

# 17. Notifications

- Lag alerts
- Schema publish notices
- Replay completion messages

# 18. Configuration

- Retention windows
- Partition rules
- Lag thresholds
- Replay policies

# 19. Edge Cases

- Consumer falls behind beyond retention window
- Keying strategy changed after go-live
- Shared consumer group accidentally spans multiple tenants
- Large replay impacts live throughput
