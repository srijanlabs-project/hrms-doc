---
id: HRMS-APP-16
title: Message Catalog By Event
document: 16-message-catalog-by-event.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a seeded message catalog for event-driven notifications, alerts, and operator communications across the Enterprise HRMS platform.

# 2. Answer To The Design Question

Yes, the platform should maintain a message catalog for different events.

It is needed because:

- one event may produce different messages by audience and channel
- wording, severity, and merge fields should be governed centrally
- localization and privacy-safe phrasing should not be duplicated inside workflows or code
- QA and support need stable template keys to validate communication behavior

# 3. Message Catalog

| Message Ref | Event Ref | Event Name | Audience | Channel | Template Key | Message Intent | Required Merge Fields | Sensitivity | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `MSG-001` | `EVT-001` | `tenant.created` | platform ops | in-app plus email | `tenant_created_ops_v1` | confirm provisioning request was registered | tenant name, tenant code, region, requester | Internal | provider-only message |
| `MSG-002` | `EVT-002` | `tenant.activated` | org admin | email plus in-app | `tenant_activated_org_v1` | inform customer admin that tenant is active | tenant name, activation date, login URL, support contact | Confidential | customer-facing welcome variant |
| `MSG-003` | `EVT-003` | `tenant.suspended` | org admin plus platform ops | email plus in-app | `tenant_suspended_v1` | communicate suspension and required next step | tenant name, effective timestamp, reason summary, support route | High | wording should avoid exposing internal-only details |
| `MSG-004` | `EVT-004` | `employee.created` | HR admin | in-app | `employee_created_hr_v1` | confirm workforce master record creation | employee id, employee name, legal entity | Confidential | internal operational confirmation |
| `MSG-005` | `EVT-007` | `employee.exit-initiated` | manager plus HR plus employee as allowed | email plus in-app | `employee_exit_initiated_v1` | start coordinated offboarding communication | employee name, separation date, task link, case id | Restricted | audience-specific redaction may be required |
| `MSG-006` | `EVT-010` | `contractor.activated` | sponsor manager plus workforce admin | email plus in-app | `contractor_activated_v1` | confirm contractor is active for downstream processes | contractor name, sponsor, assignment, expiry date | Confidential | vendor-facing variant may differ |
| `MSG-007` | `EVT-012` | `requisition.submitted` | approver | in-app plus email | `requisition_submitted_approver_v1` | prompt approval action | requisition id, role title, department, due date, action link | Confidential | action-oriented template |
| `MSG-008` | `EVT-013` | `requisition.approved` | recruiter plus hiring manager | in-app plus email | `requisition_approved_v1` | confirm requisition approval and next steps | requisition id, role title, publish action link | Confidential | may trigger follow-on publish reminder |
| `MSG-009` | `EVT-014` | `offer.accepted` | recruiter plus onboarding team | in-app plus email | `offer_accepted_v1` | trigger onboarding readiness | candidate name, requisition id, joining date, next action link | Confidential | source for onboarding kickoff messaging |
| `MSG-010` | `EVT-015` | `leave.request-submitted` | manager | in-app plus push | `leave_submitted_manager_v1` | request leave approval | employee name, leave dates, leave type, action link | Confidential | mobile-friendly concise variant recommended |
| `MSG-011` | `EVT-016` | `leave.request-approved` | employee | in-app plus email | `leave_approved_employee_v1` | inform employee of final leave decision | leave dates, leave type, approver name | Confidential | rejection variant should use separate key if tone differs materially |
| `MSG-012` | `EVT-018` | `payroll.run-validated` | payroll admin | in-app | `payroll_validated_v1` | show validation outcome and exception count | payroll run id, payroll period, exception count, action link | Restricted | operator-facing only |
| `MSG-013` | `EVT-019` | `payroll.run-finalized` | payroll admin plus finance | email plus in-app | `payroll_finalized_v1` | confirm payroll run finalization | payroll run id, period, legal entity, completion timestamp | Restricted | no employee pay data in generic template |
| `MSG-014` | `EVT-020` | `document.generated` | initiating user | in-app | `document_generated_v1` | confirm document generation success | document type, subject name, document link | Confidential | may branch by document category |
| `MSG-015` | `EVT-021` | `document.signed` | initiator plus signer owner | in-app plus email | `document_signed_v1` | confirm signature completion | document type, subject, completed timestamp, evidence link | Restricted | legal evidence access rules apply |
| `MSG-016` | `EVT-022` | `workflow.task-created` | assignee | in-app plus email | `workflow_task_created_v1` | create action request for workflow task | task title, due date, source object, action link | Internal | reusable backbone workflow template |
| `MSG-017` | `EVT-024` | `notification.dispatch-failed` | platform ops | in-app plus email | `notification_dispatch_failed_ops_v1` | flag communications delivery problem | template key, channel, failure reason summary, retry status | Internal | operator-only |
| `MSG-018` | `EVT-025` | `event-bus.dead-letter.created` | platform ops plus support | in-app plus email | `event_dead_letter_created_v1` | alert failed event delivery requiring investigation | topic, event ref, correlation id, dead-letter id | Internal | should link to replay console |
| `MSG-019` | `EVT-027` | `support.session-started` | org admin plus security monitoring | in-app plus email | `support_session_started_v1` | make privileged support access visible | support actor, reason, tenant, start time, ticket id | Restricted | trust-critical communication |
| `MSG-020` | `EVT-028` | `support.session-ended` | org admin plus security monitoring | in-app plus email | `support_session_ended_v1` | close the visibility loop on support access | support actor, tenant, start time, end time, ticket id | Restricted | include audit link where permitted |

# 4. Message Design Rules

- template keys should be stable and versionable
- channels may share business intent but should not be forced to share exact wording
- restricted or privacy-sensitive contexts should avoid unnecessary data in email or push content
- localization should occur at template level, not by ad hoc code branching

# 5. Immediate Follow-On Use

This catalog should feed:

- notification template implementation
- workflow and event-message mapping
- localization planning
- QA template validation
