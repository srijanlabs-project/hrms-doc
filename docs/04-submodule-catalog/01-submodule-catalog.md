---
id: HRMS-SUB-001
title: Enterprise HRMS Sub-Module Catalog
document: 01-submodule-catalog.md
version: 1.0
status: Draft
---

# 1. Purpose

This catalog identifies the sub-modules that sit under each top-level Enterprise HRMS capability area. It is used to plan documentation depth and future deep-spec authoring.

# 2. Depth Classification

- `L1` means overview-only context is sufficient in the platform or domain docs.
- `L2` means the parent module specification should cover the sub-module in solid detail.
- `L3` means a dedicated deep specification should be created because the sub-module is complex, business-critical, implementation-heavy, or control-sensitive.

# 3. Sub-Module Inventory

## 00. Foundation and Platform

- Product principles and personas - `L1`
- Feature flag framework - `L2`
- Configuration framework - `L3`
- Metadata framework - `L3`
- Workflow engine - `L3`
- Business rules engine - `L3`
- Notification engine - `L3`
- Document generation engine - `L3`
- Scheduler - `L2`
- Search engine - `L2`
- Audit engine - `L3`
- Event bus - `L3`
- Integration hub - `L3`
- AI platform - `L3`
- Template engine - `L2`
- Number series engine - `L2`
- Localization engine - `L3`

## 01. Organization Management

- Tenant - `L2`
- Company - `L3`
- Holding company and group company - `L2`
- Legal entity - `L3`
- Business unit - `L2`
- Division - `L2`
- Department - `L3`
- Section and team - `L2`
- Branch and office - `L2`
- Region, zone, and territory - `L2`
- Country, state, district, city, and location - `L2`
- Campus, building, floor, and work area - `L2`
- Organization tree - `L3`
- Reporting structure - `L3`
- Cost center hierarchy - `L3`
- Profit center hierarchy - `L2`
- Project hierarchy - `L2`
- Job family - `L2`
- Job function - `L2`
- Grade and band - `L3`
- Designation - `L2`
- Career track - `L2`
- Employment category and worker type - `L3`
- Work calendar - `L3`
- Holiday calendar - `L2`
- Fiscal calendar - `L2`
- Organization policies - `L2`
- Organization branding - `L1`

## 02. People Management

- Employee master - `L3`
- Personal information - `L3`
- Employment information - `L3`
- Contact details and address - `L2`
- National identity - `L3`
- Passport, visa, driving license - `L2`
- Education and experience - `L2`
- Certifications, skills, and languages - `L2`
- Medical information - `L3`
- Family details, dependents, nominees, emergency contacts - `L2`
- Bank accounts - `L3`
- Tax information - `L3`
- Digital signature - `L2`
- Preboarding - `L3`
- Onboarding - `L3`
- Probation and confirmation - `L3`
- Promotion, demotion, transfer - `L3`
- Deputation and secondment - `L2`
- Salary revision - `L3`
- Contract renewal - `L2`
- Exit - `L3`
- Retirement - `L2`
- Alumni - `L1`
- Employee documents - `L3`
- Employee timeline - `L3`

## 03. Identity and Access

- User accounts - `L2`
- Authentication - `L3`
- SSO - `L3`
- MFA - `L3`
- OAuth and federation - `L2`
- Roles - `L3`
- Permissions - `L3`
- Delegation - `L3`
- Proxy login - `L2`
- Session management - `L2`
- Device management - `L2`

## 04. Employee Self Service

- Personal profile - `L2`
- Leave - `L2`
- Attendance - `L2`
- Claims - `L2`
- Payslips - `L2`
- Documents - `L2`
- Requests - `L3`
- Goals - `L1`
- Learning - `L1`
- Benefits - `L2`
- Helpdesk - `L2`
- Assets - `L2`
- Travel - `L2`

## 05. Manager Self Service

- Team dashboard - `L3`
- Team attendance - `L2`
- Team leave - `L2`
- Performance reviews - `L3`
- Hiring approvals - `L3`
- Transfers and promotions - `L3`
- Budget approvals - `L2`
- Team analytics - `L2`

## 06. Recruitment and ATS

- Manpower planning - `L3`
- Requisitions - `L3`
- Career portal - `L3`
- Internal mobility - `L2`
- Candidate portal - `L3`
- Resume parsing - `L2`
- Talent pool - `L2`
- Screening - `L3`
- Assessments - `L2`
- Interview scheduling - `L3`
- Interview feedback - `L3`
- Offer management - `L3`
- Background verification - `L2`
- Joining handoff - `L2`

## 07. Workforce Management

- Attendance - `L3`
- Biometric integration - `L3`
- GPS attendance - `L2`
- Face recognition - `L2`
- QR attendance - `L2`
- Shift management - `L3`
- Shift rotation - `L2`
- Rostering - `L3`
- Timesheets - `L3`
- Overtime - `L3`
- Comp-off - `L2`
- Flexible hours - `L2`
- Workforce scheduling - `L3`

## 08. Leave Management

- Leave policies - `L3`
- Leave types - `L2`
- Leave accrual - `L3`
- Leave encashment - `L2`
- Carry forward - `L2`
- Sandwich rules - `L2`
- Holiday integration - `L2`
- Leave calendar - `L2`
- Leave approval - `L3`
- Team leave planning - `L2`

## 09. Payroll

- Salary structures - `L3`
- Pay components - `L3`
- Earnings and deductions - `L3`
- Loans and advances - `L2`
- Variable pay - `L2`
- Incentives and bonus - `L2`
- Arrears and retro pay - `L3`
- Payroll processing - `L3`
- Payroll validation - `L3`
- Payslips - `L2`
- Bank advice - `L2`
- Full and final settlement - `L3`

## 10. Statutory and Compliance

- PF - `L3`
- ESIC - `L3`
- Professional tax - `L2`
- TDS - `L3`
- Labour welfare fund - `L2`
- Gratuity - `L2`
- Bonus compliance - `L2`
- Minimum wages - `L2`
- Shops and establishment - `L2`
- Factory compliance - `L2`
- Country-specific compliance - `L3`
- Compliance calendar - `L3`

## 11. Performance Management

- Goal management - `L3`
- OKRs and KPIs - `L2`
- Competencies - `L2`
- Check-ins - `L2`
- 1:1 meetings - `L2`
- Appraisals - `L3`
- 360 feedback - `L3`
- Calibration - `L3`
- Bell curve - `L2`
- Promotions linkage - `L2`
- Performance improvement plans - `L2`

## 12. Learning and Development

- Learning management system - `L3`
- Course catalog - `L2`
- Learning paths - `L2`
- Certifications - `L3`
- Assessments - `L2`
- Skill development - `L2`
- Compliance training - `L3`
- External content integration - `L2`

## 13. Talent Management

- Succession planning - `L3`
- Career planning - `L2`
- Talent reviews - `L3`
- HiPo identification - `L2`
- Talent matrix - `L2`
- Bench strength - `L2`
- Workforce planning linkage - `L2`

## 14. Compensation and Benefits

- Compensation planning - `L3`
- Salary reviews - `L3`
- Merit cycles - `L3`
- Bonus planning - `L2`
- Incentives - `L2`
- ESOPs - `L2`
- Insurance - `L2`
- Benefits administration - `L3`
- Flexible benefits - `L3`

## 15. Employee Experience

- Surveys - `L3`
- Pulse surveys - `L2`
- Recognition - `L3`
- Rewards - `L2`
- Social feed - `L1`
- Communities - `L2`
- Events - `L2`
- Employee communications - `L2`
- Wellness programs - `L2`

## 16. Travel Management

- Travel requests - `L3`
- Trip planning - `L2`
- Itinerary - `L2`
- Booking integration - `L2`
- Travel advances - `L2`
- Travel expense settlement - `L2`

## 17. Expense Management

- Expense claims - `L3`
- Per diem - `L2`
- Receipts - `L2`
- OCR - `L2`
- Approvals - `L2`
- Reimbursements - `L3`
- Corporate card reconciliation - `L2`

## 18. Asset Management

- Asset catalog - `L2`
- Asset assignment - `L3`
- Asset return - `L3`
- Asset maintenance - `L2`
- Asset audits - `L2`
- Software licenses - `L2`

## 19. Helpdesk and Case Management

- HR helpdesk - `L2`
- IT helpdesk - `L2`
- Admin helpdesk - `L2`
- Finance helpdesk - `L2`
- SLA management - `L3`
- Knowledge base - `L2`
- Escalations - `L3`

## 20. Contractor and External Workforce

- Contractor master - `L3`
- Vendor employees - `L2`
- Agency management - `L2`
- Contracts - `L2`
- Compliance - `L3`
- Access control - `L3`

## 21. Visitor and Workplace Management

- Visitor registration - `L3`
- Gate pass - `L2`
- Meeting management - `L2`
- Desk booking - `L2`
- Room booking - `L2`
- Parking - `L1`
- Cafeteria - `L1`
- Shuttle management - `L2`

## 22. Health Safety and Wellness

- Incident reporting - `L3`
- Safety audits - `L2`
- Risk assessments - `L3`
- PPE management - `L2`
- Occupational health - `L2`
- Medical checkups - `L2`
- Vaccination - `L2`
- Emergency response - `L3`

## 23. Communication Platform

- Email - `L2`
- SMS - `L2`
- Push notifications - `L2`
- WhatsApp - `L2`
- Announcements - `L2`
- News - `L1`
- Bulletin board - `L1`
- Campaigns - `L3`

## 24. Document Management

- Document repository - `L3`
- Versioning - `L2`
- Templates - `L2`
- Digital signatures - `L3`
- OCR - `L2`
- Retention policies - `L3`

## 25. Analytics and BI

- Operational dashboards - `L2`
- Executive dashboards - `L2`
- Workforce analytics - `L3`
- Diversity analytics - `L2`
- Attrition analytics - `L3`
- Recruitment analytics - `L2`
- Payroll analytics - `L2`
- Predictive analytics - `L3`
- Custom reports - `L3`
- Data export - `L2`

## 26. AI and Copilot

- HR copilot - `L3`
- Employee copilot - `L2`
- Manager copilot - `L2`
- Recruiter copilot - `L2`
- Payroll copilot - `L2`
- Policy assistant - `L3`
- Organization insights - `L2`
- Attrition prediction - `L3`
- Flight risk prediction - `L3`
- Skills graph - `L3`
- AI resume matching - `L2`
- AI interview summaries - `L2`
- AI workforce planning - `L3`
- Natural language querying - `L3`

## 27. Integration Platform

- REST APIs - `L3`
- GraphQL optional layer - `L1`
- Webhooks - `L3`
- Event streaming - `L3`
- ERP integration - `L3`
- CRM integration - `L1`
- Finance systems integration - `L3`
- Identity provider integration - `L3`
- Payroll banks integration - `L2`
- Biometric devices integration - `L3`

## 28. Administration

- Dynamic forms - `L3`
- Dynamic fields - `L3`
- Dynamic masters - `L3`
- Templates - `L2`
- Number series - `L2`
- Branding - `L2`
- Localization - `L3`
- System settings - `L3`
- Tenant management - `L3`

## 29. Security and Governance

- RBAC - `L3`
- ABAC - `L3`
- Data masking - `L3`
- Encryption - `L2`
- Audit logs - `L3`
- Consent management - `L2`
- Data retention - `L3`
- Access reviews - `L3`
- Segregation of duties - `L3`
- Compliance monitoring - `L2`

## 30. DevOps and Operations

- Monitoring - `L2`
- Health checks - `L2`
- Logging - `L2`
- Background jobs - `L2`
- Backup - `L3`
- Restore - `L3`
- Disaster recovery - `L3`
- Release management - `L2`
- Feature toggles - `L2`

## 31. Implementation and Migration

- Bulk import - `L3`
- Bulk export - `L2`
- Data migration - `L3`
- Validation - `L3`
- Cutover - `L3`
- Rollback - `L3`
- Go-live checklist - `L2`

## 32. Testing and Quality

- Test data management - `L2`
- Regression testing - `L2`
- Performance testing - `L2`
- Security testing - `L2`
- Accessibility testing - `L2`
- UAT support - `L2`

# 4. Priority Deep-Spec Candidates

The first `L3` candidates that should become dedicated deep specification documents are:

- Workflow engine
- Notification engine
- Audit engine
- Organization tree and company model
- Employee lifecycle
- Attendance capture and rostering
- Leave accrual
- Payroll processing and full-and-final settlement
- Country-specific compliance
- Goal and appraisal cycle
- Compensation planning
- Expense claims
- RBAC and permission model
- Integration framework
- Dynamic forms and dynamic fields
