---
id: HRMS-SUB-02-13
title: Exit Specification
document: 13-exit.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Exit governs the controlled employee separation lifecycle across resignation, retirement, contract completion, employer-initiated separation, and other approved termination types.

In scope:

- Exit initiation, classification, and approval
- Notice period and final-date governance
- Multi-function clearance and recovery coordination
- Exit interview, analytics, and records handling
- Downstream handoff to payroll, access, assets, benefits, and compliance processes

# 2. Business

An enterprise exit process must balance employee experience, legal defensibility, asset and access recovery, payroll closure, and management continuity. Poorly controlled exits create operational leakage, unresolved recoveries, access risk, delayed final settlement, and inaccurate attrition intelligence.

Business objectives:

- Standardize separation handling across entities, countries, and exit types
- Ensure dependent functions complete required controls before closure
- Preserve clear and defensible decision, timeline, and reason records
- Generate reliable attrition, regretted-loss, and workforce-risk analytics

Key stakeholders:

- Employee and Reporting Manager
- HR Operations and Employee Relations
- Payroll and Finance
- IT, Security, and Facilities
- Compliance and Legal

# 3. Functional

The system shall support:

- Employee-initiated and employer-initiated exit cases
- Notice calculation, waiver, buyout, offset, and recovery handling
- Final working day, separation date, and payroll-cutoff coordination
- Handover, successor planning, and knowledge-transfer tasks
- Multi-department clearance tasks across HR, payroll, IT, admin, finance, security, and business teams
- Exit interview and standardized exit-reason capture
- Rescinded resignation, retraction, and exceptional rehire-before-close scenarios where policy permits

Detailed rules:

- Final separation status must not be applied until mandatory tasks are complete or an approved waiver exists
- Final working day and separation date may differ and must remain explicit across all downstream systems
- Different exit reasons should trigger different approval paths, document requirements, and confidentiality levels
- Employer-initiated separation, disciplinary exits, or sensitive cases should support restricted visibility and special handling
- Exit date changes after downstream processing starts must trigger recalculation or resynchronization workflows

# 4. UX

Primary screens:

- Exit case summary
- Notice and date management
- Clearance checklist board
- Handover and recovery tracker
- Exit interview form
- Separation closure console

UX expectations:

- Employees should see only tasks, dates, and documents relevant to them
- Managers should have clear visibility into handover, successor, and team continuity actions
- HR should see blockers, overdue tasks, and final-settlement dependencies in one place
- Restricted cases should preserve confidentiality without breaking operational control

# 5. API

Representative APIs:

- `POST /api/v1/people/exits`
- `GET /api/v1/people/exits/{caseId}`
- `POST /api/v1/people/exits/{caseId}/approve`
- `POST /api/v1/people/exits/{caseId}/clearance-tasks`
- `POST /api/v1/people/exits/{caseId}/rescind`
- `POST /api/v1/people/exits/{caseId}/close`
- `POST /api/v1/people/exits/{caseId}/change-dates`

API expectations:

- Date-change APIs must validate notice policy and downstream-impact flags
- Restricted-case APIs should enforce fine-grained visibility and audit requirements
- Closure APIs must verify mandatory dependency completion or approved waivers

# 6. Database

Core entities:

- `exit_case`
- `exit_notice_detail`
- `exit_clearance_task`
- `exit_handover_item`
- `exit_interview`
- `exit_decision`
- `exit_document`
- `exit_waiver`

Key fields:

- Employee ID, exit type, initiation source, reason code, confidentiality class, case status
- Notice start, notice end, waiver amount, buyout amount, approver
- Final working day, separation date, payroll cutoff impact, settlement linkage
- Clearance owner, department, due date, blocker flag, completion evidence
- Interview status, regretted-loss flag, rehire eligibility, retention rationale

Data design expectations:

- Case history must preserve every date change and reason change
- Clearance evidence should support attachment, note, and checklist completion metadata
- Restricted cases should support stronger field-level masking and access segmentation

# 7. Events

Published events:

- `exit.initiated`
- `exit.notice_changed`
- `exit.clearance_blocked`
- `exit.clearance_completed`
- `exit.rescinded`
- `exit.closed`
- `exit.date_changed`

Consumed events:

- `payroll.fnf_completed`
- `asset.recovery_completed`
- `identity.access_revoked`
- `benefits.coverage_closed`
- `knowledge_transfer.accepted`

# 8. Reports

Required reports:

- Attrition report
- Notice period compliance report
- Clearance aging report
- Exit reason analysis report
- Pending separation risk report
- Regretted attrition and rehire-eligibility report

# 9. Dashboards

Operational dashboards:

- Exits by stage and type
- Pending clearances by function
- Final-working-day calendar
- High-risk unresolved exits
- Attrition trends by business unit, level, and geography
- Restricted-case monitoring summary

# 10. Security

Security requirements:

- Sensitive, disciplinary, or legally sensitive exits may require restricted-case visibility
- Manager access should be reduced or removed when confidentiality criteria apply
- Exit documents, interview notes, and waiver rationale must follow retention and privacy rules
- Admin overrides on dates or closure should require explicit justification and heightened audit

# 11. Audit

Audit coverage shall include:

- Exit initiation and approval
- Changes to notice, final dates, or reason codes
- Clearance waivers and override decisions
- Rescinded resignation or reopened case actions
- Final closure, downstream publication, and restricted-access viewing

# 12. AI

AI-assisted opportunities:

- Summarize exit themes from structured and free-text feedback
- Predict cases likely to miss target separation or settlement timeline
- Recommend missing clearance tasks based on role, asset profile, and past patterns

AI guardrails:

- AI must not expose restricted-case detail to unauthorized roles
- Sensitive legal or disciplinary cases should not be auto-summarized into broad audience dashboards

# 13. Test Cases

Core test scenarios:

- Standard resignation flow with multi-function clearances
- Immediate termination with restricted visibility
- Rescind resignation before closure and reverse dependent tasks
- Block case closure until mandatory clearances complete
- Change final working day and verify downstream settlement and access effects
- Record exit interview and attrition analytics correctly

# 14. Workflows

Primary workflow:

1. Exit case is initiated and classified.
2. Notice terms, dates, and approvals are established.
3. Clearance, handover, and recovery tasks are assigned.
4. Payroll, access, asset, and benefits dependencies are completed.
5. Exit is closed and final employee status is updated.

# 15. State Machine

Case state model:

- `Initiated`
- `Under Review`
- `Notice Active`
- `Clearance In Progress`
- `Ready to Close`
- `Closed`
- `Rescinded`
- `Cancelled`

# 16. Permissions

Representative permissions:

- `exit.case.create`
- `exit.case.approve`
- `exit.notice.override`
- `exit.clearance.manage`
- `exit.close`
- `exit.restricted.view`
- `exit.audit.view`

# 17. Notifications

Notification scenarios:

- Exit initiated
- Clearance task assigned or overdue
- Final working day or separation date changed
- Resignation rescinded
- Exit ready for closure
- Restricted-case action requires approval

# 18. Configuration

Configurable parameters:

- Exit type taxonomy
- Notice calculation rules
- Clearance templates by role, department, or country
- Restricted-case criteria
- Closure blocking rules
- Rehire-eligibility and regretted-loss classifications

# 19. Edge Cases

Important edge cases:

- Employee stops attending before formal exit completion
- Separation date crosses payroll cutoff after settlement processing starts
- Employee is rehired before exit case formally closes
- Asset is returned damaged and requires financial recovery decision
- Sensitive case requires legal hold on selected records
