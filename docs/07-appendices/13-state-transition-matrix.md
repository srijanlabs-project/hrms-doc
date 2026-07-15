---
id: HRMS-APP-13
title: State Transition Matrix
document: 13-state-transition-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a populated state-transition matrix for high-value business and platform objects across the Enterprise HRMS platform. It is intended to be used directly by product, backend engineering, frontend engineering, QA, integration, and support teams.

# 2. Scope Note

This `v1` matrix covers the most cross-module-sensitive lifecycle objects:

- tenant
- employee master
- contractor master
- requisition
- leave request
- exit case
- payroll run
- workflow definition
- workflow instance
- signature request

Important note:

- where the source specifications explicitly define only the state list and not every legal transition edge, this appendix marks the transition basis as `Inferred from workflow plus state model`
- those inferred transitions should be validated during detailed service-contract or state-machine implementation design

# 3. State Transition Matrix

| Transition Ref | Object Ref | Business Object | Owning Module | From State | Trigger or Command | To State | Basis | Blocking Conditions or Guards | Key Side Effects |
|---|---|---|---|---|---|---|---|---|---|
| `STM-001` | `OBJ-TENANT` | Tenant | Administration / Tenant Management | `draft` | create and start provisioning | `provisioning` | Inferred from workflow plus state model | tenant code and domain must be unique | baseline setup begins |
| `STM-002` | `OBJ-TENANT` | Tenant | Administration / Tenant Management | `provisioning` | complete baseline config and activate | `active` | Inferred from workflow plus state model | modules, org-admin access, and required controls must be ready | tenant becomes usable |
| `STM-003` | `OBJ-TENANT` | Tenant | Administration / Tenant Management | `active` | suspend tenant | `suspended` | Inferred from workflow plus state model | privileged authorization required | access and integrations may be restricted |
| `STM-004` | `OBJ-TENANT` | Tenant | Administration / Tenant Management | `suspended` | reactivate tenant | `active` | Inferred from workflow plus state model | suspension cause must be resolved | service restored |
| `STM-005` | `OBJ-TENANT` | Tenant | Administration / Tenant Management | `active` | archive tenant | `archived` | Inferred from workflow plus state model | retention and legal-hold review required | tenant exits active operations |
| `STM-006` | `OBJ-TENANT` | Tenant | Administration / Tenant Management | `archived` | start decommission | `decommissioning` | Inferred from workflow plus state model | export, retention, and hold checks must pass | final teardown workflow starts |
| `STM-007` | `OBJ-TENANT` | Tenant | Administration / Tenant Management | `decommissioning` | complete decommission | `deleted` | Inferred from workflow plus state model | irreversible deletion controls must pass | terminal state |
| `STM-008` | `OBJ-EMPLOYEE` | Employee Master | People Management | `Draft` | create employee shell record | `Pre-Active` | Inferred from workflow plus state model | mandatory fields not yet complete | onboarding or completion steps continue |
| `STM-009` | `OBJ-EMPLOYEE` | Employee Master | People Management | `Pre-Active` | complete mandatory identity and assignment setup | `Active` | Inferred from workflow plus state model | source validations must pass | downstream modules consume authoritative record |
| `STM-010` | `OBJ-EMPLOYEE` | Employee Master | People Management | `Active` | suspend employee operationally | `Suspended` | Inferred from workflow plus state model | authorized HR action required | may affect access and payroll handling |
| `STM-011` | `OBJ-EMPLOYEE` | Employee Master | People Management | `Suspended` | reinstate employee | `Active` | Inferred from workflow plus state model | suspension reason resolved | operations resume |
| `STM-012` | `OBJ-EMPLOYEE` | Employee Master | People Management | `Active` | complete separation | `Separated` | Inferred from workflow plus state model | exit workflow and final approvals complete | offboarding downstream actions finalize |
| `STM-013` | `OBJ-EMPLOYEE` | Employee Master | People Management | `Separated` | archive record | `Archived` | Inferred from workflow plus state model | retention rules applied | historical-only access posture |
| `STM-014` | `OBJ-CONTRACTOR` | Contractor Master | Contractor and External Workforce | `Draft` | submit contractor for approval | `Pending Approval` | Inferred from workflow plus state model | sponsor, vendor, and assignment context required | approval and validation path begins |
| `STM-015` | `OBJ-CONTRACTOR` | Contractor Master | Contractor and External Workforce | `Pending Approval` | approve and validate engagement | `Active` | Inferred from workflow plus state model | compliance and assignment prerequisites must pass | access, asset, and training chains may start |
| `STM-016` | `OBJ-CONTRACTOR` | Contractor Master | Contractor and External Workforce | `Active` | suspend contractor | `Suspended` | Inferred from workflow plus state model | privileged action required | downstream access review may trigger |
| `STM-017` | `OBJ-CONTRACTOR` | Contractor Master | Contractor and External Workforce | `Suspended` | reinstate contractor | `Active` | Inferred from workflow plus state model | reason resolved and engagement still valid | downstream services may reactivate |
| `STM-018` | `OBJ-CONTRACTOR` | Contractor Master | Contractor and External Workforce | `Active` | engagement reaches expiry | `Expired` | Inferred from workflow plus state model | end date reached without extension | downstream renewal or closure action required |
| `STM-019` | `OBJ-CONTRACTOR` | Contractor Master | Contractor and External Workforce | `Active` | offboard contractor | `Offboarded` | Inferred from workflow plus state model | offboarding approval path complete | access and asset closure expected |
| `STM-020` | `OBJ-CONTRACTOR` | Contractor Master | Contractor and External Workforce | `Expired` | archive inactive contractor | `Archived` | Inferred from workflow plus state model | retention rules applied | historical-only record |
| `STM-021` | `OBJ-REQUISITION` | Requisition | Recruitment and ATS | `Draft` | submit requisition | `Submitted` | Inferred from workflow plus state model | org, budget, and mandatory fields required | approval path starts |
| `STM-022` | `OBJ-REQUISITION` | Requisition | Recruitment and ATS | `Submitted` | approve requisition | `Approved` | Inferred from workflow plus state model | authority matrix and checks must pass | ready for publishing |
| `STM-023` | `OBJ-REQUISITION` | Requisition | Recruitment and ATS | `Approved` | publish requisition | `Published` | Inferred from workflow plus state model | posting and sourcing prerequisites must pass | candidate pipeline can begin |
| `STM-024` | `OBJ-REQUISITION` | Requisition | Recruitment and ATS | `Submitted` | place on hold | `On Hold` | Inferred from workflow plus state model | pause reason required | pipeline progress pauses |
| `STM-025` | `OBJ-REQUISITION` | Requisition | Recruitment and ATS | `Published` | close requisition | `Closed` | Inferred from workflow plus state model | hire count met or business close decision | sourcing ends |
| `STM-026` | `OBJ-REQUISITION` | Requisition | Recruitment and ATS | `Draft` | cancel requisition | `Cancelled` | Inferred from workflow plus state model | authorized cancel reason required | no further pipeline activity |
| `STM-027` | `OBJ-REQUISITION` | Requisition | Recruitment and ATS | `On Hold` | reopen requisition | `Reopened` | Inferred from workflow plus state model | hold reason cleared | must return to actionable flow |
| `STM-028` | `OBJ-LEAVE` | Leave Request | Leave Management | `Draft` | submit request | `Submitted` | Inferred from workflow plus state model | policy, balance, overlap, and required attachments checked | request intake recorded |
| `STM-029` | `OBJ-LEAVE` | Leave Request | Leave Management | `Submitted` | route to approval chain | `Pending Approval` | Inferred from workflow plus state model | validation must pass | approval tasks created |
| `STM-030` | `OBJ-LEAVE` | Leave Request | Leave Management | `Pending Approval` | approver sends back | `Sent Back` | Inferred from workflow plus state model | approver rationale required | requester must revise |
| `STM-031` | `OBJ-LEAVE` | Leave Request | Leave Management | `Sent Back` | requester resubmits | `Submitted` | Inferred from workflow plus state model | corrected request required | validation reruns |
| `STM-032` | `OBJ-LEAVE` | Leave Request | Leave Management | `Pending Approval` | approve leave | `Approved` | Inferred from workflow plus state model | all approval steps complete | ledger, calendar, and downstream updates |
| `STM-033` | `OBJ-LEAVE` | Leave Request | Leave Management | `Pending Approval` | reject leave | `Rejected` | Inferred from workflow plus state model | approver rationale required | no balance consumption |
| `STM-034` | `OBJ-LEAVE` | Leave Request | Leave Management | `Draft` | cancel request | `Cancelled` | Inferred from workflow plus state model | requester or admin authority required | request ends before approval |
| `STM-035` | `OBJ-LEAVE` | Leave Request | Leave Management | `Approved` | cancel approved dates partially | `Partially Cancelled` | Inferred from workflow plus state model | cancellation policy and cutoffs apply | partial ledger reversal |
| `STM-036` | `OBJ-EXIT` | Exit Case | People Management / Exit | `Initiated` | review and accept case for processing | `Under Review` | Inferred from workflow plus state model | initiating information must be complete | exit governance starts |
| `STM-037` | `OBJ-EXIT` | Exit Case | People Management / Exit | `Under Review` | notice period starts | `Notice Active` | Inferred from workflow plus state model | approvals and notice rules must pass | notice tracking begins |
| `STM-038` | `OBJ-EXIT` | Exit Case | People Management / Exit | `Notice Active` | start clearance | `Clearance In Progress` | Inferred from workflow plus state model | exit date and workflow readiness confirmed | clearance tasks launched |
| `STM-039` | `OBJ-EXIT` | Exit Case | People Management / Exit | `Clearance In Progress` | complete blocking clearances | `Ready to Close` | Inferred from workflow plus state model | payroll, asset, access, and documentation blocks cleared | case eligible for closure |
| `STM-040` | `OBJ-EXIT` | Exit Case | People Management / Exit | `Ready to Close` | close exit case | `Closed` | Inferred from workflow plus state model | final settlement and mandatory confirmations complete | terminal business closure |
| `STM-041` | `OBJ-EXIT` | Exit Case | People Management / Exit | `Under Review` | rescind exit | `Rescinded` | Inferred from workflow plus state model | authorized rescind decision required | downstream exit tasks unwind as needed |
| `STM-042` | `OBJ-EXIT` | Exit Case | People Management / Exit | `Initiated` | cancel invalid or duplicate case | `Cancelled` | Inferred from workflow plus state model | case must not be materially progressed | case terminated |
| `STM-043` | `OBJ-PAYRUN` | Payroll Run | Payroll / Payroll Processing | `Created` | load and validate pay inputs | `Inputs Ready` | Inferred from state model | required inputs and period context must exist | run becomes processable |
| `STM-044` | `OBJ-PAYRUN` | Payroll Run | Payroll / Payroll Processing | `Inputs Ready` | start payroll processing | `Processing` | Inferred from state model | period lock and prerequisites required | engine calculates results |
| `STM-045` | `OBJ-PAYRUN` | Payroll Run | Payroll / Payroll Processing | `Processing` | processing completes with blocking issues | `Processed with Exceptions` | Inferred from state model | exceptions detected | review and rework path starts |
| `STM-046` | `OBJ-PAYRUN` | Payroll Run | Payroll / Payroll Processing | `Processing` | processing completes cleanly | `Processed` | Inferred from state model | no unresolved critical exceptions | ready for approval path |
| `STM-047` | `OBJ-PAYRUN` | Payroll Run | Payroll / Payroll Processing | `Processed with Exceptions` | resolve or waive exceptions and submit | `Approval Pending` | Inferred from state model | waiver authority or successful revalidation required | approval workflow starts |
| `STM-048` | `OBJ-PAYRUN` | Payroll Run | Payroll / Payroll Processing | `Processed` | submit for approval | `Approval Pending` | Inferred from state model | run must be review-complete | approval workflow starts |
| `STM-049` | `OBJ-PAYRUN` | Payroll Run | Payroll / Payroll Processing | `Approval Pending` | approve payroll run | `Approved` | Inferred from state model | approver authority required | outputs can be finalized |
| `STM-050` | `OBJ-PAYRUN` | Payroll Run | Payroll / Payroll Processing | `Approved` | prepare closure outputs | `Close Ready` | Inferred from state model | post-approval artifacts ready | ready for period close |
| `STM-051` | `OBJ-PAYRUN` | Payroll Run | Payroll / Payroll Processing | `Close Ready` | close payroll run | `Closed` | Inferred from state model | final checks pass | terminal payroll period state |
| `STM-052` | `OBJ-WFDEF` | Workflow Definition | Foundation and Platform / Workflow Engine | `Draft` | submit for review | `Ready for Review` | Inferred from state model | definition validation must pass | review phase begins |
| `STM-053` | `OBJ-WFDEF` | Workflow Definition | Foundation and Platform / Workflow Engine | `Ready for Review` | publish definition | `Published` | Inferred from state model | approval and governance checks pass | runtime version becomes active |
| `STM-054` | `OBJ-WFDEF` | Workflow Definition | Foundation and Platform / Workflow Engine | `Published` | publish newer version | `Superseded` | Inferred from state model | replacement version published | old version retained for history |
| `STM-055` | `OBJ-WFDEF` | Workflow Definition | Foundation and Platform / Workflow Engine | `Published` | retire definition | `Retired` | Inferred from state model | no active dependency conflict or governed override | no new instances should start |
| `STM-056` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `Created` | start workflow execution | `In Progress` | Inferred from state model | initial route and metadata must be valid | tasks or routing begin |
| `STM-057` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `In Progress` | assign approval step | `Waiting on Approver` | Inferred from state model | approver and route must resolve | task becomes actionable |
| `STM-058` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `Waiting on Approver` | SLA breach or escalation policy fires | `Escalated` | Inferred from state model | escalation thresholds reached | assignee or chain may change |
| `STM-059` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `Escalated` | escalated approver continues review | `Waiting on Approver` | Inferred from state model | escalation handling complete | task remains pending decision |
| `STM-060` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `Waiting on Approver` | approve task | `Approved` | Inferred from state model | all decision conditions met | business callback may execute |
| `STM-061` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `Waiting on Approver` | reject task | `Rejected` | Inferred from state model | rejection rationale required | business callback may execute |
| `STM-062` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `Waiting on Approver` | send back for revision | `Sent Back` | Inferred from state model | send-back rationale required | requester must correct input |
| `STM-063` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `In Progress` | cancel workflow | `Cancelled` | Inferred from state model | cancel authority and business rule must allow | no further actions proceed |
| `STM-064` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `Approved` | finalize workflow | `Closed` | Inferred from state model | downstream callback success or governed closure path | terminal workflow state |
| `STM-065` | `OBJ-WFINST` | Workflow Instance | Foundation and Platform / Workflow Engine | `Rejected` | finalize workflow | `Closed` | Inferred from state model | rejection handling complete | terminal workflow state |
| `STM-066` | `OBJ-WFSIGN` | Signature Request | Document Management / Digital Signatures | `Draft` | send signature request | `Sent` | Inferred from workflow plus state model | signers, order, and auth setup must be valid | signer notifications sent |
| `STM-067` | `OBJ-WFSIGN` | Signature Request | Document Management / Digital Signatures | `Sent` | one or more but not all signers complete | `Partially Signed` | Inferred from workflow plus state model | multi-signer flow | evidence accumulates |
| `STM-068` | `OBJ-WFSIGN` | Signature Request | Document Management / Digital Signatures | `Partially Signed` | all required signers complete | `Completed` | Inferred from workflow plus state model | all signatures and validations complete | final signed artifact stored |
| `STM-069` | `OBJ-WFSIGN` | Signature Request | Document Management / Digital Signatures | `Sent` | signer declines | `Declined` | Inferred from workflow plus state model | valid decline action | request fails with evidence |
| `STM-070` | `OBJ-WFSIGN` | Signature Request | Document Management / Digital Signatures | `Sent` | deadline passes | `Expired` | Inferred from workflow plus state model | request not fully signed before expiry | may require resend or restart |
| `STM-071` | `OBJ-WFSIGN` | Signature Request | Document Management / Digital Signatures | `Draft` | cancel request | `Cancelled` | Inferred from workflow plus state model | authorized initiator required | no signer action proceeds |

# 4. Engineering Rules

- every state-bearing object should eventually have a dedicated `Object Ref` and validated legal transition map
- backend services should enforce illegal-transition protection and return explicit transition errors
- UI state actions must derive from allowed transitions, not only from screen placement
- high-risk transitions should emit audit events and, where relevant, domain events
- inferred transitions in this `v1` appendix should be confirmed when detailed service state machines are implemented

# 5. Immediate Follow-On Use

This matrix should be used to drive:

- backend state-machine implementation
- UI action enablement rules
- workflow callback logic
- authorization tests for state-dependent actions
- negative QA scenarios for invalid transitions
