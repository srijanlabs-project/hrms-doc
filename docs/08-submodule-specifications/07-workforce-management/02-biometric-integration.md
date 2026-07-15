---
id: HRMS-SUB-07-02
title: Biometric integration Specification
document: 02-biometric-integration.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Biometric Integration is the trusted source-ingestion capability that receives punch events from biometric devices and converts them into governed attendance source records without losing the original raw evidence.

In scope:

- Device onboarding and configuration
- Vendor protocol support through file, API, webhook, agent, or polling models
- Employee-device identity mapping
- Raw punch ingestion and timestamp normalization
- Device heartbeat and health monitoring
- Error handling, replay, deduplication, and auditability

Out of scope:

- Attendance policy interpretation
- Shift planning and roster creation
- Final payroll calculation

# 2. Business

Enterprise HRMS programs depend on reliable attendance source data. A biometric device may capture a valid punch, but business value is realized only when the platform can prove when it arrived, how it was mapped, whether it was duplicated, and what downstream attendance record consumed it.

Business objectives:

- Reduce manual attendance dependency for controlled populations
- Establish source authenticity for payroll, overtime, and compliance
- Support distributed device fleets across offices, stores, factories, hospitals, and project sites
- Minimize disputes by preserving raw source evidence
- Lower support effort through device diagnostics and replay controls

Key business stakeholders:

- HR Operations
- Workforce Administration
- IT Infrastructure and Device Support
- Payroll Operations
- Compliance and Internal Audit

# 3. Functional

The system shall support:

- Multi-vendor biometric device registration with site, location, timezone, and connectivity attributes
- Device grouping by entity, business unit, cost center, location, or network zone
- Ingestion through push API, pull API, file drop, SFTP, middleware agent, or message queue
- Employee mapping through employee code, badge number, vendor user ID, biometric template ID, or approved alias
- Raw punch capture with source timestamp, arrival timestamp, device ID, event type, and quality metadata
- Deduplication based on device event fingerprint and configurable comparison windows
- Late-arriving punch handling without overwriting raw history
- Unmapped punch queue with assisted resolution workflow
- Device health monitoring through heartbeat, sync lag, punch volume anomaly, and connectivity failure signals
- Controlled replay of failed or corrected ingestion batches

Validation rules:

- Device must be active and within valid effective dates to accept production events unless override is permitted
- Each raw punch must preserve vendor payload reference or derived hash for traceability
- Timezone conversion must use device-site timezone and daylight-saving calendar where applicable
- Duplicate suppression must mark duplicates without deleting raw evidence
- Device event arrival after attendance finalization must raise an exception for downstream review

# 4. UX

Primary screens:

- Device registry
- Device diagnostics cockpit
- Raw punch monitor
- Unmapped punch resolution queue
- Ingestion batch history
- Replay and correction console

UX expectations:

- Support teams should see device health, last sync, last punch, and current error state on one screen
- HR users should resolve unmapped punches without needing vendor-specific terminology
- Admin users should be able to trace a final attendance event back to raw source evidence
- Error views should clearly separate device issues, payload issues, mapping issues, and duplicate conditions

# 5. API

Representative APIs:

- `POST /api/v1/wfm/biometric/devices`
- `PUT /api/v1/wfm/biometric/devices/{deviceId}`
- `POST /api/v1/wfm/biometric/punches/ingest`
- `GET /api/v1/wfm/biometric/punches`
- `POST /api/v1/wfm/biometric/punches/{punchId}/map`
- `POST /api/v1/wfm/biometric/batches/{batchId}/replay`
- `GET /api/v1/wfm/biometric/devices/{deviceId}/health`

API design expectations:

- Ingestion endpoints must be idempotent for duplicate source submissions
- Raw payload references should be stored and retrievable for authorized users
- Replay APIs must require reason codes and generate audit records
- Health APIs should expose support diagnostics but redact secrets and credentials

# 6. Database

Core entities:

- `biometric_device`
- `biometric_device_endpoint`
- `biometric_employee_mapping`
- `biometric_raw_punch`
- `biometric_ingestion_batch`
- `biometric_ingestion_error`
- `biometric_device_health_snapshot`

Key fields:

- Device master: device code, vendor, serial number, site, timezone, connectivity mode, status
- Mapping: employee ID, vendor user key, badge ID, effective from, effective to, confidence source
- Raw punch: source event ID, punch timestamp, arrival timestamp, event direction, payload hash, duplicate flag
- Batch: source channel, received count, accepted count, rejected count, replay count, status
- Error: error category, reason code, severity, recovery action, resolver, resolution timestamp

Data design principles:

- Raw punch records are append-only
- Corrected mappings create new linkage history instead of destructive overwrite
- Device credentials must be encrypted at rest
- High-volume punch tables should support partitioning by date and company

# 7. Events

Published events:

- `biometric.device.registered`
- `biometric.device.status_changed`
- `biometric.punch.received`
- `biometric.punch.mapped`
- `biometric.punch.unmapped`
- `biometric.batch.failed`
- `biometric.batch.replayed`

Consumed events:

- `employee.identifier.changed`
- `employee.status.changed`
- `location.timezone.updated`
- `attendance.period.finalized`

Event expectations:

- Events must include tenant, company, employee context where available, and source correlation ID
- Downstream consumers must be able to distinguish raw source ingestion from interpreted attendance outcomes

# 8. Reports

Required reports:

- Device-wise punch volume report
- Unmapped punch aging report
- Failed batch report
- Employee-device mapping mismatch report
- Late punch arrival report

# 9. Dashboards

Operational dashboards:

- Device uptime percentage by site
- Devices not reporting within threshold
- Punch ingestion success rate
- Open unmapped punch count
- Replay queue backlog

# 10. Security

Security requirements:

- Device credential secrets must be stored using enterprise secret-management standards
- Support users must not see full authentication tokens after initial creation
- Raw biometric integrations must comply with regional biometric/privacy regulations
- Only authorized roles may replay batches, remap punches, or disable a device

# 11. Audit

Audit coverage shall include:

- Device creation, update, activation, and deactivation
- Mapping creation and change history
- Replay requests and execution outcomes
- Manual punch-to-employee mapping actions
- Health-status overrides and support notes

# 12. AI

AI-assisted opportunities:

- Predict likely employee matches for unmapped punches
- Detect abnormal device patterns such as silent failure, low volume, or clock drift
- Recommend whether a batch issue is vendor-side, network-side, or mapping-side
- Summarize support incidents for HR and IT coordination

AI guardrails:

- AI may recommend but not auto-approve destructive mapping changes
- Confidence score and rationale must be shown for every recommendation

# 13. Test Cases

Core test scenarios:

- Ingest valid punch from active device
- Reject or quarantine event from inactive device based on policy
- Detect duplicate punch submitted twice
- Resolve unmapped punch and verify downstream linkage
- Replay failed batch after mapping correction
- Handle cross-timezone device correctly
- Surface late-arriving punch after attendance freeze

# 14. Workflows

Primary workflow:

1. Support team registers device and endpoint details.
2. Employee identity mapping becomes effective.
3. Device sends punch data to ingestion channel.
4. Platform validates, normalizes, and stores raw punch.
5. Punch is mapped or routed to unmapped queue.
6. Attendance service consumes eligible source records.
7. Exceptions and health issues are monitored and corrected.

# 15. State Machine

Device state model:

- `Draft`
- `Configured`
- `Active`
- `Degraded`
- `Inactive`
- `Retired`

Punch state model:

- `Received`
- `Validated`
- `Mapped`
- `Unmapped`
- `Rejected`
- `Consumed`

Batch state model:

- `Received`
- `Processing`
- `Partially Failed`
- `Failed`
- `Completed`
- `Replayed`

# 16. Permissions

Representative permissions:

- `biometric.device.create`
- `biometric.device.manage`
- `biometric.device.view_health`
- `biometric.punch.view_raw`
- `biometric.punch.map`
- `biometric.batch.replay`
- `biometric.audit.view`

# 17. Notifications

Notification scenarios:

- Device not reporting within threshold
- Batch failure requiring support action
- Unmapped punch backlog crossing SLA
- Device clock drift or abnormal punch volume detected
- Replay completed with failures remaining

Channels:

- In-app alerts
- Email for support operations
- Optional webhook to enterprise monitoring tools

# 18. Configuration

Configurable parameters:

- Vendor adapter and connectivity mode
- Duplicate detection window
- Allowed clock skew
- Punch-event type mappings
- Health-check frequency
- Unmapped punch SLA thresholds
- Replay permissions and retention windows

# 19. Edge Cases

Important edge cases:

- Same employee mapped to overlapping vendor IDs across locations
- Device stores punches offline and uploads them in bulk after several days
- Device clock is incorrect while payload format is otherwise valid
- Employee code changes after punches were captured but before mapping
- Partial batch success creates risk of business duplicate on replay
- Site changes timezone or DST rule mid-period
