---
id: HRMS-SUB-14-04
title: Benefits administration Specification
document: 04-benefits-administration.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Benefits Administration governs the setup, eligibility, enrollment, maintenance, and reconciliation of employer-sponsored benefits programs across employee populations.

In scope:

- Benefit plan catalog and plan-year setup
- Eligibility rules and dependent coverage
- Enrollment, change events, and terminations
- Vendor and payroll integration
- Cost-sharing, reconciliation, and evidence management

# 2. Business

Benefits administration is a cross-functional control area connecting HR, employees, payroll, finance, insurers, and third-party administrators. Accuracy here directly affects employee wellbeing, employer cost, and statutory or contractual compliance.

Business outcomes:

- Provide accurate benefit access to eligible employees and dependents
- Reduce enrollment errors and manual vendor coordination
- Ensure payroll deductions and employer costs stay aligned with plan choices
- Support life-event changes with a clear audit trail

# 3. Functional

The system shall support:

- Benefit plans for insurance, retirement, wellness, allowances, reimbursements, and employer-paid programs
- Eligibility rules based on grade, location, legal entity, tenure, worker type, and dependent status
- Open enrollment, joiner enrollment, and life-event enrollment windows
- Dependent management, document validation, and coverage effective dates
- Employee and employer contribution calculation with payroll deduction mapping
- Termination, suspension, leave-impact, and reactivation handling
- Vendor enrollment file generation and status reconciliation
- Waiver capture, plan acknowledgments, and evidence retention

Validation rules:

- Enrollment shall be blocked for ineligible plans unless exception approval exists
- Life-event change shall require qualifying-event evidence where configured
- Overlapping benefit plan elections shall be prevented based on policy
- Payroll-deduction start date shall align with plan effective date rules

# 4. UX

The user experience shall provide:

- Benefits catalog with plan comparison cards, costs, and coverage summary
- Guided enrollment flow with dependent selection and cost preview
- HR administrator view for exceptions, pending proofs, and vendor file status
- Employee self-service history for past and active elections
- Accessibility-friendly design for large plan descriptions and legal documents

# 5. API

Representative APIs:

- `POST /api/v1/benefits/plans`
- `GET /api/v1/benefits/eligibility`
- `POST /api/v1/benefits/enrollments`
- `POST /api/v1/benefits/life-events`
- `POST /api/v1/benefits/vendor-batches`
- `POST /api/v1/benefits/reconciliation`

API requirements:

- Eligibility APIs shall return rule explanation and effective date
- Enrollment APIs shall enforce event window rules and dependent validation
- Vendor-batch APIs shall track outbound file version and response status

# 6. Database

Core entities:

- `benefit_plan`
- `benefit_plan_option`
- `benefit_eligibility_rule`
- `benefit_enrollment`
- `benefit_dependent`
- `benefit_life_event`
- `benefit_vendor_batch`

Key data requirements:

- Enrollment records shall capture selected option, effective dates, employer cost, employee cost, and status
- Dependent records shall retain relationship, coverage eligibility, and verification status
- Vendor batch records shall store transmission status, acknowledgment, and reconciliation outcome

# 7. Events

The platform shall publish:

- `benefit-plan.created`
- `benefit-enrollment.submitted`
- `benefit-enrollment.approved`
- `benefit-life-event.recorded`
- `benefit-vendor-batch.sent`
- `benefit-reconciliation.completed`

# 8. Reports

Required reports:

- Enrollment participation report
- Employer cost and employee deduction report
- Pending dependent verification report
- Vendor reconciliation mismatch report
- Life-event volume and turnaround report

# 9. Dashboards

Dashboards shall show:

- Open enrollment completion %
- Benefits cost exposure by plan and population
- Vendor-file status and failed transmissions
- Pending proof and exception aging

# 10. Security

Security controls shall include:

- Restricted access to dependent personal and health-related data
- Secure document storage for proofs and legal forms
- Vendor integration credentials protected per enterprise standard
- Role-based visibility to plan cost and employee selections

# 11. Audit

The audit trail shall capture:

- Plan setup and option changes
- Eligibility-rule changes
- Enrollment selections and revisions
- Life-event approvals and supporting document decisions
- Vendor transmission and reconciliation actions

# 12. AI

AI capabilities may include:

- Personalized plan recommendations based on family profile and prior selections
- Detection of enrollment anomalies or deduction mismatches
- Summaries of plan adoption and cost trends

AI guardrails:

- AI recommendations shall remain optional and clearly non-advisory for regulated health decisions
- Sensitive health-related inferences shall be tightly controlled

# 13. Test Cases

Minimum test coverage shall include:

- Ineligible employee cannot enroll in restricted plan
- Life-event enrollment opens correct election window
- Payroll deduction mapping starts on correct effective date
- Failed vendor response opens reconciliation case
- Dependent proof rejection prevents coverage activation

# 14. Workflows

Primary workflow:

1. Plans and eligibility are configured.
2. Employees enroll during allowed windows.
3. Proofs and exceptions are reviewed where required.
4. Selections are sent to vendors and payroll.
5. Reconciliation confirms active coverage and cost alignment.

# 15. State Machine

Supported states:

- `draft`
- `open-for-enrollment`
- `submitted`
- `pending-proof`
- `approved`
- `active`
- `suspended`
- `terminated`

# 16. Permissions

Permissions shall include:

- Configure plans and eligibility
- View and manage enrollments
- Approve life-event changes
- Access vendor batches and reconciliation
- View employee and dependent benefit history

# 17. Notifications

Notifications shall support:

- Enrollment window announcements
- Incomplete enrollment reminders
- Pending proof and approval alerts
- Coverage activation and change confirmations
- Vendor transmission failure alerts

# 18. Configuration

Administrators shall configure:

- Plan years and open-enrollment periods
- Eligibility rules and contribution formulas
- Life-event types and document requirements
- Vendor interfaces and payroll mappings
- Waiver and acknowledgment rules

# 19. Edge Cases

The design shall address:

- Employee changes legal entity mid-plan-year
- Dependent ages out during coverage period
- Retroactive life event requires backdated coverage
- Payroll processed before benefit change approval
- Vendor accepts file partially and rejects selected members
