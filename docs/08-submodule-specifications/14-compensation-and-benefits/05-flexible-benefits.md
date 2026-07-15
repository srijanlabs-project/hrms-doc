---
id: HRMS-SUB-14-05
title: Flexible benefits Specification
document: 05-flexible-benefits.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Flexible Benefits governs employee-controlled selection of benefits or tax-optimized components within a defined allowance basket, plan policy, and annual election cycle.

In scope:

- Flex basket design and option catalog
- Eligibility and election windows
- Allocation rules, caps, and validations
- Payroll integration and proof-based reimbursements where relevant
- Annual rollover, lock-in, and exception handling

# 2. Business

Flexible benefits improve employee value perception by allowing personalized choices while helping organizations manage tax, cost, and policy compliance in a structured way.

Business outcomes:

- Increase perceived total rewards value
- Give employees controlled choice without breaking payroll compliance
- Reduce manual flex declarations and year-end reconciliation effort
- Improve transparency of selected benefits and tax impact

# 3. Functional

The system shall support:

- Flex programs by country, legal entity, grade, and employee segment
- Annual or periodic flex election windows and joiner prorated elections
- Component categories such as meal, fuel, telecom, books, wellness, car lease, or country-specific tax items
- Basket amount allocation rules including minimums, maximums, and mutually exclusive options
- Locked and editable periods, carry-forward, and mid-year change events where policy allows
- Payroll integration to create recurring or claim-based deductions and reimbursements
- Proof submission and utilization tracking for components that require expense backing
- Declaration summary, tax treatment preview, and final election acknowledgment

Validation rules:

- Total selected allocation shall equal or remain within basket rules
- Mutually exclusive components shall not be elected together
- Proof-required components shall follow reimbursement policy before final tax treatment
- Closed election windows shall block changes unless approved exception workflow exists

# 4. UX

The user experience shall provide:

- Employee flex-election wizard with basket balance and tax-impact preview
- Plan cards that explain component purpose, limits, and proof requirement
- HR operations view for exceptions, pending proofs, and election completion
- Payroll review view showing elected flex structure and deduction mapping
- Responsive design for employees completing elections from mobile devices

# 5. API

Representative APIs:

- `POST /api/v1/flex/programs`
- `GET /api/v1/flex/eligibility`
- `POST /api/v1/flex/elections`
- `PATCH /api/v1/flex/elections/{electionId}`
- `POST /api/v1/flex/proofs`
- `POST /api/v1/flex/payroll-export`

API requirements:

- Election APIs shall validate basket balance, caps, and exclusivity rules
- Preview APIs shall show current and projected payroll impact
- Payroll export shall preserve versioning when elections change after initial release

# 6. Database

Core entities:

- `flex_program`
- `flex_component`
- `flex_eligibility_rule`
- `flex_election`
- `flex_election_line`
- `flex_proof_submission`
- `flex_payroll_export_batch`

Key data requirements:

- Election records shall store employee, basket value, submission date, and lock status
- Election lines shall store chosen component, allocated amount, utilization rule, and tax treatment flag
- Proof submissions shall capture period, status, and approved amount

# 7. Events

The platform shall publish:

- `flex-program.created`
- `flex-election.started`
- `flex-election.submitted`
- `flex-proof.uploaded`
- `flex-election.locked`
- `flex-payroll-export.completed`

# 8. Reports

Required reports:

- Flex election completion report
- Component popularity and allocation report
- Proof utilization and unclaimed balance report
- Payroll export reconciliation report
- Tax-savings utilization trend report

# 9. Dashboards

Dashboards shall show:

- Program participation by population
- Unused basket value and pending elections
- Component mix distribution
- Proof backlog and reimbursement exposure

# 10. Security

Security controls shall include:

- Role-based access to employee elections and proofs
- Secure storage of tax-related supporting documents
- Restricted edits after lock-in or payroll export
- Masking of sensitive reimbursement attachments where necessary

# 11. Audit

The audit trail shall capture:

- Program configuration changes
- Election edits and final submission
- Proof approval or rejection
- Payroll export and correction actions

# 12. AI

AI capabilities may include:

- Personalized allocation suggestions based on prior utilization
- Alerts for unused basket value or likely proof shortfall
- Summaries of election trends for reward teams

AI guardrails:

- AI shall not provide tax advice beyond organization-approved explanatory content
- Recommendations shall stay within configured policy and eligibility rules

# 13. Test Cases

Minimum test coverage shall include:

- Election exceeding basket cap is blocked
- Mutually exclusive components cannot be chosen together
- Proof rejection prevents tax-favorable reimbursement treatment
- Payroll export reflects latest locked election values
- Joiner prorated basket is calculated correctly

# 14. Workflows

Primary workflow:

1. Flex program is configured and opened.
2. Eligible employees review basket and options.
3. Employees submit elections and acknowledgments.
4. Payroll consumes locked elections.
5. Proof-backed components are monitored and reconciled.

# 15. State Machine

Supported states:

- `draft`
- `election-open`
- `submitted`
- `pending-proof`
- `locked`
- `exported`
- `closed`

# 16. Permissions

Permissions shall include:

- Configure flex programs
- Submit and edit elections
- Approve exceptions and proofs
- Run payroll export
- View program analytics

# 17. Notifications

Notifications shall support:

- Election-window opening and deadline reminders
- Incomplete election alerts
- Proof submission reminders
- Election lock and payroll export confirmations

# 18. Configuration

Administrators shall configure:

- Basket formulas and eligible populations
- Component catalog, caps, and exclusivity rules
- Election calendar and lock dates
- Proof policies and payroll mappings
- Communication templates and help content

# 19. Edge Cases

The design shall address:

- Employee transfers to a country without same flex program
- Election changed after payroll preview but before lock date
- Partial-year employees need prorated basket and caps
- Component becomes legally non-compliant mid-year
- Unused basket must either lapse, carry forward, or convert per policy
