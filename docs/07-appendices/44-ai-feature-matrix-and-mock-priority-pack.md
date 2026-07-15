---
id: HRMS-APP-44
title: AI Feature Matrix and Mock Priority Pack
document: 44-ai-feature-matrix-and-mock-priority-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides the implementation-facing AI feature matrix for the Enterprise HRMS application.

It exists so product, architecture, engineering, QA, security, implementation, and design teams can answer the same questions for every AI capability:

- which business domain owns the feature
- which personas can use or administer it
- what triggers it
- whether it is advisory, confirm-first, or auto-executing
- which APIs and events must exist
- which screens must show it
- which mockups should be created first

# 2. Usage Rules

- use this matrix as the primary AI scope register before creating new AI backlog items
- do not implement a new AI experience without mapping it to a `screen target` and `human review mode`
- if an AI feature can mutate business data, the matrix row must show the confirm or approval boundary explicitly
- if an AI feature uses restricted employee, payroll, medical, disciplinary, or confidential talent data, the row must be reviewed with security and privacy stakeholders before build
- mockup production should follow the `mock priority` order unless a release wave explicitly overrides it

# 3. AI Feature Matrix

| AI Ref | Capability | Domain Reference | Primary Personas | Trigger | Human Review Mode | Representative APIs | Primary Events | Data Sensitivity | Screen Targets | Mock Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| `AIF-001` | Global search and typed command execution | `26-ai-copilot`, `01-hr-copilot`, `07-natural-language-querying` | employee, manager, HR specialist, AI admin | user types a command or natural-language question | confirm required for create, update, approve, cancel, or export actions | `POST /api/v1/ai/copilot/query`, `POST /api/v1/ai/copilot/commands/interpret`, `POST /api/v1/ai/copilot/commands/execute` | `ai.command.interpreted`, `ai.command.executed`, `ai.command.rejected` | High | `W0-SCR-002`, `EMP-SCR-001`, `MGR-SCR-001` | `P0` |
| `AIF-002` | HR copilot conversational assistance | `26-ai-copilot`, `01-hr-copilot` | employee, manager, HR specialist | chat entry point, embedded action panel, command bar invocation | advisory for lookup, confirm required for action execution | `POST /api/v1/ai/copilot/chat`, `POST /api/v1/ai/copilot/actions/confirm`, `POST /api/v1/ai/copilot/feedback` | `copilot.conversation.started`, `copilot.action.suggested`, `copilot.action.confirmed`, `copilot.escalation.requested` | High | `W0-SCR-002`, `EMP-SCR-001`, `MGR-SCR-001`, `HLP-SCR-001` | `P0` |
| `AIF-003` | Policy assistant | `26-ai-copilot`, `02-policy-assistant` | employee, manager, HR operations | policy question, context help, request blocking rule explanation | advisory only, escalate to human when confidence is low | `POST /api/v1/ai/policy-assistant/query`, `GET /api/v1/ai/policy-assistant/sources`, `POST /api/v1/ai/policy-assistant/escalate` | `policy-assistant.query-answered`, `policy-assistant.low-confidence`, `policy-assistant.escalated` | Medium | `EMP-SCR-001`, `EMP-SCR-006`, `MGR-SCR-001` | `P1` |
| `AIF-004` | Employee self-service agentic assistant | `04-employee-self-service`, `26-ai-copilot` | employee | lifecycle stage change, due task, self-service request, help request | confirm before submission; no bypass of workflow or validation | ESS action APIs plus copilot command APIs | `ess.request.submitted`, `ai.command.executed`, `copilot.escalation.requested` | High | `EMP-SCR-001`, `EMP-SCR-004`, `EMP-SCR-006`, `EMP-SCR-007` | `P0` |
| `AIF-005` | Manager productivity assistant | `05-manager-self-service`, `26-ai-copilot` | manager, delegated manager | overloaded approvals, team alert spike, review cycle, staffing risk | advisory for summaries; confirm required for downstream transactions | manager dashboard APIs plus copilot command APIs | `mss.approval.delegated`, `ai.command.interpreted`, `ai.command.executed` | High | `MGR-SCR-001`, `MGR-SCR-003`, `MGR-SCR-006` | `P0` |
| `AIF-006` | Recruiter AI ranking and resume parsing | `06-recruitment-ats`, `05-screening` | recruiter, hiring manager | new application, resume upload, shortlist queue refresh | recruiter review required before stage progression | recruitment screening APIs, skills inference APIs | `candidate.created`, `skills-graph.inference-completed`, `candidate.shortlist-ready` | High | `REC-SCR-002`, `REC-SCR-003` | `P1` |
| `AIF-007` | Interview summary and scheduling assistant | `06-recruitment-ats`, `06-interview-scheduling`, `07-interview-feedback` | recruiter, interviewer, hiring manager | interview completion, slot conflict, candidate reschedule | human review required for score and final movement | interview scheduling APIs, feedback APIs | `interview.completed`, `interview.summary.generated`, `interview.rescheduled` | High | `REC-SCR-002`, `REC-SCR-003` | `P1` |
| `AIF-008` | Candidate communication assistant | `06-recruitment-ats`, `23-communication-platform`, `01-campaigns` | recruiter, recruiting coordinator | candidate stage change, reminder due, scheduling follow-up | draft or template approval required for sensitive messages | recruitment communication APIs, campaign APIs | `candidate.stage.changed`, `communication.campaign.scheduled`, `communication.message.delivered` | Medium | `REC-SCR-003`, `W0-SCR-007` | `P1` |
| `AIF-009` | HR case playbook assistant | `19-helpdesk-case-management` | service agent, queue manager, HR operations | new case intake, SLA risk, stalled queue item, employee escalation | advisory for triage, confirm for response send, explicit human takeover for sensitive cases | helpdesk APIs, copilot APIs | `case.created`, `case.escalated`, `case.sla-breached`, `copilot.escalation.requested` | High | `HLP-SCR-001` | `P0` |
| `AIF-010` | Payroll anomaly detection and explanation | `09-payroll`, `06-payroll-validation` | payroll processor, payroll approver, auditor | payroll validation stage, variance threshold breach, period compare | no auto-close; payroll team review required before approve or finalize | payroll validation APIs, payroll analytics APIs | `payroll.validation.started`, `payroll.exception.detected`, `payroll.ready-for-approval` | Critical | `PAY-SCR-001`, `PAY-SCR-002` | `P0` |
| `AIF-011` | Attendance anomaly detection and selfie or kiosk confidence review | `07-workforce-management`, `01-attendance` | time admin, HR operations, manager | punch ingestion, geofence mismatch, selfie confidence issue, kiosk exception | review required for suspicious punches and policy exceptions | attendance APIs, biometric APIs, regularization APIs | `attendance.exception.opened`, `biometric.punch.received`, `attendance.regularization.submitted` | High | `WRK-SCR-001`, `EMP-SCR-006`, `MGR-SCR-006` | `P0` |
| `AIF-012` | Attrition prediction | `03-attrition-prediction`, `25-analytics-bi`, `02-attrition-analytics` | leadership, HRBP, manager, analytics admin | scheduled scoring run, threshold breach, strategic review cycle | advisory only; must not auto-trigger employee action | `GET /api/v1/ai/attrition-prediction/scores`, `GET /api/v1/ai/attrition-prediction/monitoring` | `attrition-prediction.score-generated`, `attrition-prediction.threshold-breached` | Critical | `ANL-SCR-002`, `MGR-SCR-001` | `P1` |
| `AIF-013` | Flight-risk prediction | `04-flight-risk-prediction`, `25-analytics-bi` | HRBP, manager, leadership | high-volatility cohort refresh, retention review, threshold breach | advisory only, controlled visibility, no employee-facing exposure | flight-risk APIs, monitoring APIs | `flight-risk.score-generated`, `flight-risk.threshold-breached` | Critical | `ANL-SCR-002`, `MGR-SCR-001` | `P1` |
| `AIF-014` | Skills graph and employee-to-project matching | `05-skills-graph`, `13-talent-management` | talent admin, staffing lead, manager, recruiter | new project demand, skill update, certification completion, staffing request | recommendation review required before assignment or mobility action | `GET /api/v1/ai/skills-graph/employees/{employeeId}`, `POST /api/v1/ai/skills-graph/infer` | `skills-graph.employee-skill-updated`, `skills-graph.inference-completed` | High | `MGR-SCR-001`, `REC-SCR-006`, `ANL-SCR-002` | `P1` |
| `AIF-015` | AI workforce planning and strategic command recommendations | `06-ai-workforce-planning`, `25-analytics-bi` | CHRO, leadership, workforce planner, HRBP | planning cycle, business-plan update, attrition refresh, cost shift | advisory only, planner approval required for downstream action | workforce planning APIs, analytics APIs | `workforce-plan.forecast-generated`, `workforce-plan.recommendation-published` | Critical | `ANL-SCR-002`, `W0-SCR-018` | `P1` |
| `AIF-016` | Event-triggered HR communications automation | `23-communication-platform`, `01-campaigns`, `05-notification-engine` | communications admin, HR operations, payroll ops | onboarding event, payroll notice, training reminder, policy acknowledgment, case status update | approved-template automation allowed; sensitive audience or legal content requires human approval | `POST /api/v1/comms/messages`, `POST /api/v1/comms/campaigns`, campaign launch APIs | `communication.campaign.scheduled`, `communication.message.sent`, `communication.delivery.failed` | High | `W0-SCR-007`, `EMP-SCR-001`, `HLP-SCR-001` | `P1` |
| `AIF-017` | Natural-language workforce analytics | `07-natural-language-querying`, `25-analytics-bi` | leadership, HRBP, manager, analyst | analytics search, dashboard question, ad hoc trend query | advisory; governed export controls still apply | analytics query APIs, NLQ APIs | `analytics.query.executed`, `ai.query.completed` | High | `ANL-SCR-002`, `W0-SCR-002` | `P1` |
| `AIF-018` | AI governance, policy, evaluation, and cost monitoring | `00-foundation-and-platform/10-ai-platform`, `26-ai-copilot` | AI admin, platform architect, security reviewer, auditor | model policy change, evaluation pack run, cost spike, guardrail violation | mandatory admin review and publish control | AI platform policy APIs, evaluation APIs | `ai.policy.updated`, `ai.evaluation.completed`, `ai.guardrail.triggered` | Critical | `W0-SCR-011` | `P0` |

# 4. AI Mock Creation Order

Use the matrix above to drive mock production in this order.

## 4.1 Wave AI-M0

These screens unblock the largest number of AI use cases:

| Sequence | Screen Ref | Why It Comes First | AI Features Unblocked |
|---|---|---|---|
| `1` | `W0-SCR-011` | provider-side governance, model policy, evaluation, cost, and guardrail control | `AIF-018` |
| `2` | `EMP-SCR-001` | employee-visible assistant entry, widgets, reminders, and command bar | `AIF-001`, `AIF-002`, `AIF-003`, `AIF-004`, `AIF-016` |
| `3` | `MGR-SCR-001` | manager productivity, team risk, guided actions, and growth support | `AIF-001`, `AIF-002`, `AIF-005`, `AIF-012`, `AIF-013`, `AIF-014` |
| `4` | `WRK-SCR-001` | attendance anomalies, selfie and kiosk confidence, regularization review | `AIF-011` |
| `5` | `PAY-SCR-001` | payroll exception cockpit and anomaly triage | `AIF-010` |
| `6` | `HLP-SCR-001` | HR case playbook and escalation assistant | `AIF-009`, `AIF-016` |

## 4.2 Wave AI-M1

These screens deepen AI across recruiting, communications, and analytics:

| Sequence | Screen Ref | Why It Comes Next | AI Features Unblocked |
|---|---|---|---|
| `7` | `REC-SCR-002` | pipeline-level AI ranking and recruiter prioritization | `AIF-006`, `AIF-007` |
| `8` | `REC-SCR-003` | candidate-level evidence, summaries, and communication actions | `AIF-006`, `AIF-007`, `AIF-008` |
| `9` | `ANL-SCR-002` | strategic command and NLQ-driven analytics | `AIF-012`, `AIF-013`, `AIF-014`, `AIF-015`, `AIF-017` |
| `10` | `W0-SCR-007` | campaign automation and governed HR communication rules | `AIF-008`, `AIF-016` |

# 5. Engineering and Design Notes

- every `P0` AI mock should show the `human review boundary` visually, not only in notes
- any AI-assisted mutation must visibly distinguish `suggested`, `ready to confirm`, `executed`, and `escalated to human`
- any AI risk score screen must show `why the score exists`, `when it was last refreshed`, and `who is allowed to see it`
- any employee-facing AI screen must keep policy references, support escalation, and opt-out or visibility boundaries explicit
- any platform AI screen must show policy version, model or prompt version, evaluation status, and active incident count in the first screenful
