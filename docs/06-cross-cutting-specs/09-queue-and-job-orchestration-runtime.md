---
id: HRMS-XCUT-09
title: Queue and Job Orchestration Runtime
document: 09-queue-and-job-orchestration-runtime.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the shared runtime standard for queues, background jobs, schedulers, retries, dead-letter handling, replay, concurrency control, and observability across the Enterprise HRMS platform.

It exists to stop modules from implementing long-running work, delayed execution, and failure recovery in inconsistent ways.

# 2. Scope

This runtime standard applies to:

- scheduled jobs
- event-driven asynchronous jobs
- user-triggered deferred jobs
- batch and import processing
- notification delivery retries
- webhook and integration retries
- payroll, attendance, leave, and document generation background processing
- dead-letter queues and replay controls

It does not replace workflow state machines or event payload contracts. It provides the durable execution layer used by them.

# 3. Why This Matters

The HRMS platform contains many business actions that cannot safely or efficiently run inline inside a user request:

- payroll processing
- attendance imports and reconciliation
- leave accrual and balance refresh
- bulk onboarding and migration commits
- document generation and digital-signature callbacks
- notification delivery and retries
- webhook dispatch and connector synchronization
- analytics snapshots and search indexing

Without a shared orchestration model, teams typically create hidden cron logic, duplicate retry loops, non-idempotent background code, and support-unfriendly operational behavior.

# 4. Runtime Position

The target architecture should treat `Job Orchestration Service` as a shared deployable platform service.

It is responsible for:

- durable queue management
- schedule registration and execution
- worker leasing and execution lifecycle
- retry and backoff policies
- dead-letter isolation
- replay and requeue controls
- execution telemetry
- tenant-safe execution context

It is not responsible for owning business rules from payroll, leave, people, workflow, or integrations. Domain services still own business logic and business data.

# 5. Design Principles

- every asynchronous job must have a declared owner
- every job must be idempotent or explicitly compensatable
- a failed job must become diagnosable, not invisible
- retry behavior must be policy-driven, not improvised in code
- one tenant's queue pressure must not silently degrade another tenant's high-risk workloads
- background execution must preserve tenant, actor, correlation, and business-date context
- operators must be able to distinguish retryable failure, terminal failure, stale execution, duplicate execution, and replay activity

# 6. Job Classification Model

## 6.1 Job Families

| Job Family | Description | Representative Examples |
|---|---|---|
| `Immediate Async` | user action accepted synchronously, processing deferred | generate offer letter, send notifications, create search projection |
| `Scheduled` | time-based execution | leave accrual, shift generation, payroll calendar checks |
| `Batch` | large multi-record processing | employee import validation, payroll run processing |
| `Event Reaction` | downstream processing from domain event | employee.created -> access setup, notification fan-out |
| `Recovery` | operational correction or replay | re-dispatch webhook, replay failed event, re-run failed payslip render |
| `Maintenance` | platform housekeeping | archive delivery attempts, purge expired OTP records, rotate job metrics partitions |

## 6.2 Criticality Classes

Every job definition shall carry a criticality class:

| Class | Meaning | Examples |
|---|---|---|
| `Critical` | failure may block payroll, access, compliance, or legal obligations | payroll finalization, exit deprovisioning, signature evidence retrieval |
| `High` | failure materially affects operations or trust | leave accrual, attendance sync, onboarding provisioning |
| `Medium` | failure is important but not immediately business-stopping | analytics snapshots, reminder notifications |
| `Low` | failure is informational or non-core | advisory digests, cache rebuilds |

Criticality must influence retry depth, alerting, support escalation, and replay approval rules.

# 7. Ownership Model

## 7.1 Job Definition Ownership

Each job must declare:

- owning service
- owning module
- owning business object or process
- trigger type
- criticality
- tenant scope
- idempotency strategy
- retry policy
- dead-letter policy

## 7.2 Execution Ownership

- Job Orchestration Service owns dispatch, leasing, status tracking, retries, and dead-letter movement.
- Domain services own the business handler that performs the work.
- Audit Service owns durable audit evidence for privileged replay, manual skip, and operator interventions.

## 7.3 Forbidden Ownership Patterns

- no shared "misc cron" bucket with undocumented module logic
- no domain service writing directly into another service's retry queues without contract
- no in-memory retry loops as the only recovery mechanism for important jobs

# 8. Canonical Job Lifecycle

## 8.1 Job States

Recommended state model:

- `Created`
- `Queued`
- `Leased`
- `Running`
- `Succeeded`
- `Retry Pending`
- `Blocked`
- `Dead-Lettered`
- `Cancelled`
- `Expired`
- `Replayed`

## 8.2 State Rules

- `Queued` means ready for worker acquisition.
- `Leased` means a worker claimed execution rights for a bounded period.
- `Running` means handler execution started.
- `Retry Pending` means a retryable failure occurred and next attempt is scheduled.
- `Blocked` means operator or dependent-system intervention is required before retry.
- `Dead-Lettered` means policy or retry limit was exhausted.
- `Replayed` should preserve linkage to the original failed or historical execution record.

# 9. Queue Model

## 9.1 Queue Partitioning

Queue routing should support partitioning by:

- priority
- job family
- tenant or tenant cohort
- domain service
- regulated or high-risk workload class

Recommended baseline queues:

- `critical-commands`
- `payroll-batch`
- `integration-delivery`
- `notification-delivery`
- `document-render`
- `import-processing`
- `maintenance-low`

## 9.2 Priority Model

Suggested execution priorities:

- `P1` life-and-compliance critical
- `P2` high business urgency
- `P3` normal operational
- `P4` deferred or low-priority maintenance

Priority inheritance rules:

- exit deprovisioning, payroll close, and statutory jobs should not compete with low-priority digest or archive jobs in the same worker pool
- replayed jobs should not automatically bypass live critical queues unless explicitly approved

## 9.3 Tenant Fairness

The platform should support:

- per-tenant concurrency ceilings
- reserved capacity for critical platform jobs
- queue depth alerts by tenant and queue
- controls to prevent one tenant's mass import or replay from starving others

# 10. Worker Model

## 10.1 Worker Responsibilities

Workers should:

- lease jobs
- hydrate tenant and security context
- execute idempotent business handlers
- emit structured progress and failure telemetry
- renew lease only when work is genuinely progressing
- release success, retry, or dead-letter outcome explicitly

## 10.2 Lease Model

Every leased job should carry:

- `lease_expires_at`
- `leased_by_worker_id`
- `attempt_no`
- `heartbeat_at`

Rules:

- if a worker dies or stops heartbeating, the job may be re-queued after lease expiry
- stale lease recovery must avoid double execution where handlers are not naturally idempotent
- handlers for high-risk operations should use object version checks, command tokens, or result hashes to protect against duplicate work after lease loss

## 10.3 Worker Pools

Recommended worker pools:

- CPU-heavy
- IO-heavy
- external-connector
- notification-delivery
- document-render
- payroll-batch

This prevents slow document rendering or flaky external endpoints from degrading payroll or workflow-critical jobs.

# 11. Scheduling Model

## 11.1 Schedule Types

The orchestration layer should support:

- one-time delayed jobs
- recurring cron-like schedules
- business-calendar-driven schedules
- event-time offset schedules
- dependency-chained schedules

## 11.2 Business-Time Scheduling

Where business rules depend on tenant or legal-entity time:

- schedule interpretation must use explicit `business_timezone`
- "today" must resolve using tenant, legal-entity, or location policy, not server-local time
- monthly, payroll, and leave jobs must define leap-day and month-end behavior explicitly

Examples:

- leave accrual on tenant-local month end
- payroll reminders at legal-entity-specific cutoff times
- probation confirmation checks at business-day start, not UTC midnight

## 11.3 Missed Schedule Recovery

If a scheduler outage occurs:

- missed runs must be detectable
- replay or catch-up policy must be explicit per job definition
- duplicate catch-up execution must be prevented for non-repeatable periods such as payroll close checks

# 12. Retry and Backoff Rules

## 12.1 Retry Categories

Failures should be classified as:

- `Transient Platform`
- `Transient External`
- `Validation or Contract`
- `Business State Conflict`
- `Authorization or Security`
- `Data Integrity`
- `Unknown`

## 12.2 Retry Policy Baseline

Suggested baseline:

- retry transient failures with exponential backoff plus jitter
- stop retrying contract and data-integrity failures until corrected
- treat duplicate-submit or idempotency conflicts as non-retryable unless requeue logic is explicitly safe
- allow queue-specific max-attempt overrides by criticality

## 12.3 Backoff Guidance

Recommended default progression:

- attempt 1 immediate or near-immediate retry for transient transport issues if safe
- attempt 2 after short delay
- attempt 3 and beyond with increasing delay and jitter
- long-tail retries for external systems should cap to protect queue pressure

Actual numeric values should be provider-configurable and queue-specific.

# 13. Idempotency and Concurrency

## 13.1 Mandatory Idempotency Inputs

Every high-risk job should capture one or more of:

- originating `idempotency_key`
- `action_idempotency_token`
- source event ID
- target object version
- payload hash
- business-period key

## 13.2 Recommended Idempotency Strategies

| Strategy | Use Cases | Example |
|---|---|---|
| `Command token` | user-triggered actions | approve leave, verify OTP, commit import |
| `Event dedupe` | event reaction jobs | employee.created fan-out |
| `Period key` | schedule jobs | monthly leave accrual for tenant plus policy plus period |
| `Payload hash` | document render, outbound integration | same exact render or dispatch body |
| `Object version guard` | state-transition jobs | workflow task completion, payroll close action |

## 13.3 Double-Execution Protection

Background handlers must be resilient to:

- user double-click on submit or approve
- retry after network timeout
- worker crash after side effect but before acknowledgment
- replay after operator correction
- same business event arriving through more than one channel

# 14. Dead-Letter and Blocked-Job Handling

## 14.1 Dead-Letter Entry Requirements

Dead-letter records must preserve:

- original job ID
- job definition key
- tenant ID
- correlation ID
- business object references
- last error code and category
- attempt count
- first and last failure timestamps
- payload or payload reference
- operator notes and replay decisions if any

## 14.2 Blocked vs Dead-Letter

- `Blocked` means execution may continue after correction or dependency resolution.
- `Dead-Lettered` means automated retries are exhausted or prohibited.

Examples of `Blocked`:

- payroll run waiting for attendance finalization
- webhook endpoint suspended pending secret rotation
- import commit paused for manual reconciliation

Examples of `Dead-Lettered`:

- contract-breaking payload repeatedly rejected
- repeated external provider rejection with permanent reason
- non-idempotent replay request rejected for safety

## 14.3 Replay Controls

Replay should require:

- reason code
- operator identity
- target scope
- dedupe safety confirmation
- impact preview where possible

Critical jobs such as payroll close artifacts, exit deprovisioning, and compliance exports may require dual control for replay.

# 15. Data Model Baseline

Recommended orchestration tables:

- `job_definition`
- `job_schedule`
- `job_run`
- `job_attempt`
- `job_dependency_link`
- `job_dead_letter`
- `job_replay_request`
- `job_worker_lease`
- `job_metric_snapshot`

Required field groups:

- job key and version
- queue and priority
- tenant and timezone context
- correlation and causation lineage
- source event or command reference
- payload hash or payload reference
- next visible time
- attempt counters
- final disposition
- operator replay metadata

This baseline should be implemented consistently with the database and ERD appendix.

# 16. API and Operator Controls

Representative runtime APIs:

- `POST /api/v1/platform/jobs/definitions`
- `POST /api/v1/platform/jobs/enqueue`
- `GET /api/v1/platform/jobs/runs/{jobRunId}`
- `POST /api/v1/platform/jobs/runs/{jobRunId}/retry`
- `POST /api/v1/platform/jobs/runs/{jobRunId}/cancel`
- `POST /api/v1/platform/jobs/dead-letter/{deadLetterId}/replay`
- `GET /api/v1/platform/jobs/queues/health`

Rules:

- replay, skip, force-complete, and cancel actions must be privileged and audited
- operator APIs should show retryability, dedupe risk, and dependent object state before action
- tenant-visible operators should only see jobs within their scope unless provider support access is governed and active

# 17. Observability Standards

## 17.1 Required Telemetry

Every job execution should emit:

- job definition key
- job run ID
- queue name
- tenant ID
- priority
- attempt number
- worker ID
- correlation ID
- source event or command
- start and finish timestamps
- latency
- outcome category

## 17.2 Required Dashboards

The platform should provide:

- queue depth by queue and tenant
- lease age and stuck-job risk
- retry backlog
- dead-letter volume
- success and failure rate by job definition
- external dependency failure clusters

## 17.3 Alerts

Alerts should exist for:

- critical queue backlog
- lease heartbeat expiry
- dead-letter spike
- repeated handler failure by same job key
- tenant starvation or queue saturation
- replay storm or manual retry surge

# 18. Security and Privacy Controls

- job payloads must respect privacy classification and field masking rules
- secrets, tokens, or connector credentials must not be stored in raw job payloads
- privileged support replay actions must remain customer-visible where policy requires
- payload inspection screens should redact restricted data based on role
- background jobs triggered by an exited employee or disabled identity must preserve historical actor lineage without granting current access

# 19. SaaS and Tenant Isolation Rules

- every tenant-scoped job must carry `tenant_id`
- platform jobs and provider jobs must be distinguishable from tenant jobs
- platform admin consoles may view queue health, DLQs, and runtime incidents, but should not expose customer HR transaction details beyond authorized support scope
- Org Admin and HR personas may see only the jobs relevant to their tenant and permission domain

# 20. Module Patterns

## 20.1 People and Lifecycle

Use jobs for:

- onboarding downstream provisioning
- document generation
- search projection refresh
- bank-change verification follow-up

## 20.2 Leave and Attendance

Use jobs for:

- accrual posting
- balance recomputation
- roster generation
- attendance import processing

## 20.3 Payroll

Use jobs for:

- payroll input freeze support tasks
- payroll calculation batches
- payslip rendering
- bank file generation

## 20.4 Integrations and Notifications

Use jobs for:

- outbound webhook delivery
- notification fan-out and fallback
- connector retries
- dead-letter re-dispatch

# 21. Anti-Patterns to Avoid

- using request-thread retries as a substitute for durable jobs
- embedding business logic in generic queue consumers with no module ownership
- unbounded retries with no backoff or dead-letter state
- scheduling by server-local time for tenant-sensitive processes
- sharing one worker pool for critical payroll and low-value maintenance tasks
- silently dropping jobs after process restart
- replaying non-idempotent jobs without safety checks

# 22. Test Expectations

Every high-risk job family should have tests for:

- successful first execution
- duplicate execution safety
- lease expiry recovery
- retry on transient failure
- non-retry on terminal contract failure
- dead-letter creation after policy exhaustion
- replay after root-cause correction
- tenant isolation in queue inspection and operator actions
- business-time scheduling around leap day, month end, and timezone boundaries

# 23. Immediate Follow-On Work

This standard should next drive:

- job orchestration service OpenAPI contracts
- per-queue configuration keys and operational defaults
- detailed ERD and DDL for job tables
- operator console screen definitions
- job runbook and incident playbooks
