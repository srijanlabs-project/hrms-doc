---
id: HRMS-APP-31
title: Workflow Object Transition and Callback Pack
document: 31-workflow-object-transition-and-callback-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the workflow runtime depth gap by providing per-object legal transition packs, callback payload rules, and operator-console requirements.

# 2. Object Transition Packs

| Object | Allowed High-Level States | Critical Illegal Transition Guard |
|---|---|---|
| `leave_request` | Draft, Submitted, Approved, Rejected, Cancelled | cannot approve after cancel or after superseding action |
| `requisition` | Draft, Submitted, Approved, Closed, Cancelled | cannot publish job before approved |
| `offer_record` | Draft, Pending Approval, Issued, Accepted, Declined, Expired | cannot accept expired offer |
| `payroll_run` | Created, Inputs Ready, Processing, Processed, Approved, Closed | cannot close with blocking exceptions |
| `config_change` | Draft, Approved, Scheduled, Active, Rolled Back | cannot rollback unpublished change |
| `signature_request` | Draft, Sent, Partially Signed, Completed, Declined, Expired, Cancelled | cannot mutate sealed completed request |
| `support_session` | Requested, Approved, Active, Ended, Revoked | cannot view tenant context before approval |
| `import_batch` | Uploaded, Validated, Blocked, Commit Ready, Committed, Reversed | cannot commit blocked batch |

# 3. Callback Payload Requirements

Every workflow completion callback should include:

- `workflowInstanceId`
- `sourceObjectType`
- `sourceObjectId`
- `decisionOutcome`
- `decisionAt`
- `decisionActor`
- `correlationId`
- `taskDecisionId`

# 4. Stale-Action Response Rule

When a task is stale:

- return state-conflict
- include current object state
- include next allowed action if safe
- audit attempt

# 5. Operator Console Requirements

The workflow operator console must expose:

- stuck instance list
- callback-pending list
- stale-action attempts
- override log
- escalation backlog

