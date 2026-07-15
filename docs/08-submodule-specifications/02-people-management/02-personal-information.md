---
id: HRMS-SUB-02-02
title: Personal information Specification
document: 02-personal-information.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Personal Information governs the capture, validation, maintenance, approval, and controlled use of employee biographical and contact data.

In scope:

- Core personal profile data
- Contact details and emergency contacts
- Demographic attributes and preferences
- Self-service updates and HR corrections
- Downstream consumption by payroll, benefits, security, and compliance processes

# 2. Business

Personal information is the enterprise employee identity profile beyond the employment contract. It supports communication, benefits servicing, workforce analytics, travel, emergency response, and statutory reporting.

Business outcomes:

- Maintain a trusted source of employee personal profile data
- Enable employees to keep data current through governed self-service
- Reduce operational delays caused by inaccurate contact or family details
- Support local compliance and employee-service needs without overexposing sensitive data

# 3. Functional

The system shall support:

- Name fields including legal name, preferred name, phonetic name, and prior names where required
- Personal details such as date of birth, gender, marital status, nationality, and blood group where allowed by jurisdiction
- Contact channels including personal email, phone, alternate phone, and residential and mailing address
- Emergency contact capture with relationship, priority order, and reachability notes
- Locale preferences such as language, timezone, and communication preference
- Effective-dated updates for selected fields where history matters
- Employee self-service update requests with approval for sensitive fields
- HR correction workflows for administrative mistakes and compliance remediation
- Document attachments supporting change requests when policy requires

Validation rules:

- Mandatory fields shall vary by country, population, and lifecycle stage
- Personal email and phone formats shall be validated using configurable local rules
- Certain profile fields shall be immutable after hire unless corrected through authorized workflow
- Duplicate emergency-contact combinations shall be prevented where configured
- Primary mobile number creation or update shall require successful OTP verification before activation
- Date of birth shall be a valid past date and shall satisfy configured worker-age policy bands
- Join-date, marriage-date, and dependent-date validations shall apply cross-field plausibility and jurisdiction-aware legal-age rules
- Leap-day dates such as `29-Feb` shall be stored accurately and follow documented non-leap-year fallback rules for age or anniversary calculations
- Name fields shall normalize whitespace, allow legitimate real-name punctuation, and reject control characters or obvious junk patterns
- Country-specific postal code, phone, and address validations shall run using selected country context

# 4. UX

The user experience shall provide:

- Employee profile view with clear separation of editable and controlled fields
- Guided edit forms with inline validation and contextual policy help
- Mobile-friendly self-service for common updates such as address and phone changes
- HR operations view showing current record, pending requests, and field history
- Accessibility support for screen readers, large text, and keyboard navigation

# 5. API

Representative APIs:

- `GET /api/v1/people/employees/{employeeId}/personal-information`
- `PATCH /api/v1/people/employees/{employeeId}/personal-information`
- `POST /api/v1/people/employees/{employeeId}/personal-information/change-requests`
- `GET /api/v1/people/employees/{employeeId}/emergency-contacts`
- `POST /api/v1/people/employees/{employeeId}/emergency-contacts`

API requirements:

- APIs shall distinguish direct HR update from employee-requested change
- Sensitive fields shall return masked values based on role
- Change-request endpoints shall support evidence attachments and workflow references

# 6. Database

Core entities:

- `employee_personal_profile`
- `employee_contact_detail`
- `employee_emergency_contact`
- `personal_information_change_request`
- `employee_demographic_history`

Key data requirements:

- Personal profile shall store effective dates for history-enabled attributes
- Contact details shall support multiple types with verification status
- Change requests shall store requested value, current value, approver outcome, and reason

# 7. Events

The platform shall publish:

- `employee.personal-information.updated`
- `employee.personal-information.change-requested`
- `employee.personal-information.change-approved`
- `employee.emergency-contact.updated`

# 8. Reports

Required reports:

- Missing personal-data completeness report
- Emergency-contact coverage report
- Personal-information change audit report
- Invalid contact-detail exception report

# 9. Dashboards

Dashboards shall show:

- Profile completeness by population
- Outstanding change requests
- High-risk missing emergency-contact cases
- Data-quality trend by location or business unit

# 10. Security

Security controls shall include:

- Field-level access restrictions for sensitive demographics
- Masking of personal contact details in non-privileged views
- Secure storage and transport for attachments and profile updates
- Self-service restrictions preventing edit of protected fields without approval

# 11. Audit

The audit trail shall capture:

- Every field-level change with before and after values
- Change-request submission, approval, rejection, and withdrawal
- Masked-field views where required by policy
- Data corrections performed by HR or shared services

# 12. AI

AI capabilities may include:

- Data-quality anomaly detection for unlikely or incomplete values
- Smart suggestions for address normalization and duplicate contact cleanup
- Employee assistance for explaining why a field is required

AI guardrails:

- AI shall not infer protected demographic values
- AI suggestions shall require explicit user confirmation before saving

# 13. Test Cases

Minimum test coverage shall include:

- Employee submits address change requiring approval
- Restricted demographic field is hidden from unauthorized role
- Emergency-contact validation blocks incomplete priority assignment
- Effective-dated personal change preserves historical values
- Invalid local phone format returns precise validation error

# 14. Workflows

Primary workflow:

1. Employee or HR opens personal-information update.
2. System validates field rules and approval requirements.
3. Change is auto-applied or routed for approval.
4. Downstream subscribers receive approved update event.
5. Audit and history records are preserved.

# 15. State Machine

Supported states:

- `draft`
- `submitted`
- `under-review`
- `approved`
- `rejected`
- `applied`
- `withdrawn`

# 16. Permissions

Permissions shall include:

- View personal profile
- Edit own personal data
- Edit employee personal data
- Approve sensitive changes
- View masked or full values
- Export personal profile data

# 17. Notifications

Notifications shall support:

- Change-request submission confirmations
- Approver action alerts
- Employee update completion or rejection notices
- Data-completeness nudges for missing profile fields

# 18. Configuration

Administrators shall configure:

- Country-specific mandatory fields
- Field editability by role and lifecycle stage
- Approval routing for sensitive changes
- Contact validation formats and verification rules
- OTP policy for mobile-number verification
- Legal-age and plausibility thresholds for personal, marriage, and dependent-date rules
- Leap-year fallback behavior for anniversary and age calculations where required

# 19. Edge Cases

The design shall address:

- Employee has no personal email or phone at time of hire
- Same residential and mailing address stored intentionally
- Backdated correction of date of birth or legal name
- Jurisdiction prohibits storing selected demographic fields
- Employee under protection order needs masked address handling
