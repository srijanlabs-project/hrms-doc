---
id: HRMS-APP-43
title: Service Runbook Library
document: 43-service-runbook-library.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the support and operations runbook depth gap by defining the concrete L1 to L3 runbook library required for shared services and critical business services.

# 2. Required Runbooks

| Service | L1 Focus | L2 Focus | L3 Focus |
|---|---|---|---|
| Workflow | queue backlog, stuck task reports | callback and stale-state checks | definition bug or routing defect |
| Notification | provider failure, resend checks | retry backlog, template binding | code or provider adapter issue |
| Configuration | read-only impact checks | drift and publish analysis | resolver or schema defect |
| File or Document | upload failure, scan wait | storage class, signed URL, render diagnostics | object-store or render-engine defect |
| Audit | search or export issue | masking, legal hold, integrity diagnostics | ingestion or index defect |
| Integration Hub | connector failure | replay, dead-letter, schema drift | mapping or adapter defect |
| Job Orchestration | queue health | lease, retry, and dead-letter diagnostics | worker logic or orchestration defect |
| Payroll | user-impact triage | run-state and exception analysis | calc engine or contract defect |

# 3. Troubleshooting Tree Rule

Every runbook should progress from:

1. confirm scope and tenant
2. capture correlation IDs
3. verify state and permissions
4. inspect shared-service dependency
5. decide workaround, replay, or escalation

