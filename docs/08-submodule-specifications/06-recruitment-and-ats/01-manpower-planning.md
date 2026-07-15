---
id: HRMS-SUB-06-01
title: Manpower planning Specification
document: 01-manpower-planning.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Manpower Planning governs how workforce demand is proposed, justified, reviewed, approved, and converted into hiring or internal mobility demand.

In scope:

- Headcount demand capture
- Budget and vacancy justification
- New vs replacement demand handling
- Approval workflow and scenario planning
- Handoff to requisitions and hiring plans

# 2. Business

Manpower planning connects business strategy, financial capacity, and talent acquisition execution. Without a governed demand-planning layer, organizations create unbudgeted hiring, duplicate requisitions, and weak accountability for workforce growth.

Business objectives:

- Align hiring demand with budget and business plans
- Distinguish new headcount, backfill, contingent, and project-driven demand
- Improve transparency of hiring pipeline before requisitions are raised
- Support leadership review of staffing gaps and growth scenarios

# 3. Functional

The system shall support:

- Demand requests for permanent, temporary, contractor, campus, or project workforce
- New position, replacement, seasonal, strategic initiative, and capacity-driven demand types
- Demand sizing by role, location, department, legal entity, cost center, and period
- Budget reference, planned compensation range, and expected start date
- Multi-level approval routing by function, finance, HR, and leadership
- Scenario comparison such as full approval, partial approval, deferment, or rejection
- Conversion of approved demand into requisitions or internal mobility campaigns

Detailed rules:

- Replacement demand should link to vacancy, planned exit, or expansion justification
- Approved demand must remain distinct from actual filled headcount until hiring closes
- Budget validation may be blocking, warning, or deferred depending on planning cycle maturity
- One demand item may create one or many requisitions only through governed split logic

# 4. UX

Primary screens:

- Manpower demand workspace
- Demand request form
- Budget and justification view
- Approval board
- Planning scenario dashboard

UX expectations:

- Business leaders should understand demand status, approval blockers, and budget exposure quickly
- HR should compare open demand against current vacancies and ongoing recruitment
- Finance should see cost impact without needing recruiting detail overload

# 5. API

Representative APIs:

- `POST /api/v1/recruitment/manpower-plans`
- `GET /api/v1/recruitment/manpower-plans/{planId}`
- `POST /api/v1/recruitment/manpower-plans/{planId}/approve`
- `POST /api/v1/recruitment/manpower-plans/{planId}/convert-to-requisition`
- `GET /api/v1/recruitment/manpower-plans/scenarios`

# 6. Database

Core entities:

- `manpower_plan`
- `manpower_plan_line`
- `manpower_plan_approval`
- `manpower_plan_budget_reference`
- `manpower_plan_conversion_event`

Key fields:

- Plan code, planning cycle, owner, status
- Role, quantity, location, worker type, start date, demand type
- Budget amount, budget owner, approved quantity, deferred quantity
- Conversion target, requisition link, split quantity, conversion status

# 7. Events

Published events:

- `manpower_plan.created`
- `manpower_plan.submitted`
- `manpower_plan.approved`
- `manpower_plan.rejected`
- `manpower_plan.converted`

Consumed events:

- `budget.cycle_opened`
- `position.vacant`
- `employee.exit_initiated`
- `requisition.closed`

# 8. Reports

Required reports:

- Demand pipeline report
- Budget vs approved demand report
- Replacement vs new headcount report
- Demand-to-requisition conversion report
- Deferred demand report

# 9. Dashboards

Operational dashboards:

- Open demand by function and entity
- Budget exposure by planning cycle
- Approval backlog
- Demand aging and conversion velocity

# 10. Security

Security requirements:

- Demand creation and approval should follow budget and organizational scope controls
- Planned compensation and strategic hiring data may require restricted visibility
- Cross-business demand visibility should be limited for confidential workforce plans

# 11. Audit

Audit coverage shall include:

- Demand creation and edits
- Approval and rejection decisions
- Budget-reference changes
- Conversion into requisitions
- Scenario and quantity adjustments

# 12. AI

AI-assisted opportunities:

- Forecast likely demand based on attrition, growth, and seasonality
- Flag duplicate or overlapping demand requests
- Recommend demand priority based on vacancy risk and business criticality

# 13. Test Cases

- Create new headcount plan
- Create backfill plan linked to vacancy
- Approve partial quantity
- Convert approved demand into requisition
- Prevent duplicate conversion beyond approved quantity

# 14. Workflows

1. Business creates workforce demand.
2. Finance, HR, and leadership review justification.
3. Demand is approved, deferred, or rejected.
4. Approved demand converts to requisition or internal mobility action.

# 15. State Machine

- `Draft`
- `Submitted`
- `Under Review`
- `Approved`
- `Partially Approved`
- `Rejected`
- `Converted`
- `Closed`

# 16. Permissions

- `manpower_plan.create`
- `manpower_plan.approve`
- `manpower_plan.convert`
- `manpower_plan.view_budget`
- `manpower_plan.audit.view`

# 17. Notifications

- Demand submitted for approval
- Budget conflict detected
- Demand approved or rejected
- Approved demand not converted within SLA

# 18. Configuration

- Planning cycles
- Approval matrix
- Budget validation mode
- Demand type taxonomy
- Conversion rules

# 19. Edge Cases

- One demand line split across locations after approval
- Backfill approved before incumbent formally exits
- Budget changes after demand approval but before requisition conversion
- Confidential leadership hire excluded from broad dashboards
