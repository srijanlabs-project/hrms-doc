---
id: HRMS-APP-35
title: Job Orchestration Implementation Pack
document: 35-job-orchestration-implementation-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the job-runtime depth gap by defining concrete orchestration APIs, queue configuration catalog, physical entities, and operator runbook surfaces.

# 2. Concrete API Families

- `POST /api/v1/platform/jobs/definitions`
- `POST /api/v1/platform/jobs/enqueue`
- `GET /api/v1/platform/jobs/runs/{jobRunId}`
- `POST /api/v1/platform/jobs/runs/{jobRunId}/retry`
- `POST /api/v1/platform/jobs/runs/{jobRunId}/cancel`
- `POST /api/v1/platform/jobs/dead-letter/{deadLetterId}/replay`

# 3. Queue Configuration Catalog

Required queue keys:

- queue name
- criticality
- worker pool
- max concurrency
- retry profile
- dead-letter threshold
- visibility timeout

Baseline queues:

- `critical-commands`
- `payroll-batch`
- `integration-delivery`
- `notification-delivery`
- `document-render`
- `import-processing`
- `maintenance-low`

# 4. Physical Entities

- `job_definition`
- `job_schedule`
- `job_run`
- `job_attempt`
- `job_dead_letter`
- `job_replay_request`

# 5. Operator Surfaces

- queue health dashboard
- dead-letter replay console
- stuck-job and lease view
- schedule monitor

