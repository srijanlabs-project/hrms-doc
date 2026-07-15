---
id: HRMS-SUB-03-03
title: MFA Specification
document: 03-mfa.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Multi-Factor Authentication governs the use of additional identity proof beyond primary credentials to protect HRMS access, step-up sensitive actions, and reduce account-compromise risk.

In scope:

- MFA factor enrollment and management
- Challenge orchestration at login and step-up points
- Recovery and fallback behavior
- Exemption, grace, and device-trust handling
- MFA telemetry and control governance

# 2. Business

MFA is a critical protection for HRMS because the platform contains highly sensitive employee and payroll data. It reduces risk from stolen passwords, phishing, and session hijacking, especially for administrators, payroll users, and remote access.

Business objectives:

- Strengthen access security for privileged and high-risk users
- Reduce successful account compromise
- Support adaptive or contextual security based on risk
- Provide resilient recovery without creating weak bypasses

# 3. Functional

The system shall support:

- MFA factors such as authenticator app, OTP, hardware token, email or SMS where policy allows, push challenge, and device-bound factors
- Enrollment, verification, replacement, and revocation of factors
- MFA at primary login, step-up actions, and reauthentication checkpoints
- Trusted device or remembered device behavior where allowed
- Grace period, temporary bypass, and break-glass workflows with strict controls
- Adaptive triggering based on risk, geography, device, or role

Detailed rules:

- High-risk populations should require MFA and not rely on optional enrollment
- Weaker channels such as SMS or email should be policy-limited and risk-scoped
- Recovery and factor reset should require stronger proofing than ordinary login
- MFA bypasses must be time-bound, narrowly scoped, and fully auditable

# 4. UX

Primary screens:

- MFA enrollment wizard
- Factor management page
- Challenge verification screen
- Recovery and reset flow
- Trusted-device management page

UX expectations:

- Enrollment should be understandable for non-technical users
- Challenge flows should be fast and consistent across web and mobile use
- Users should clearly know which factors are active and how to recover access safely

# 5. API

Representative APIs:

- `POST /api/v1/auth/mfa/enroll`
- `POST /api/v1/auth/mfa/verify`
- `POST /api/v1/auth/mfa/challenge`
- `POST /api/v1/auth/mfa/reset-request`
- `POST /api/v1/auth/mfa/bypass`
- `GET /api/v1/auth/mfa/factors`

# 6. Database

Core entities:

- `mfa_factor`
- `mfa_challenge`
- `mfa_reset_request`
- `mfa_bypass_grant`
- `trusted_device`
- `mfa_policy_assignment`

Key fields:

- User ID, factor type, enrollment status, last verified timestamp
- Challenge type, issued at, expiry, verification status, attempt count
- Reset requester, proofing result, approver, completion timestamp
- Bypass reason, scope, start time, end time, approver
- Device hash, trust expiry, risk level, last used timestamp

# 7. Events

Published events:

- `mfa.factor_enrolled`
- `mfa.challenge_issued`
- `mfa.challenge_failed`
- `mfa.challenge_succeeded`
- `mfa.bypass_granted`
- `mfa.factor_reset`

Consumed events:

- `auth.login_succeeded`
- `auth.reauthentication_required`
- `identity.user_disabled`
- `device.risk_detected`

# 8. Reports

Required reports:

- MFA enrollment coverage report
- MFA failure report
- Bypass and reset report
- Trusted-device report
- Privileged-user MFA compliance report

# 9. Dashboards

Operational dashboards:

- MFA adoption by population
- Failed challenge spikes
- Temporary bypasses active
- High-risk users without enrolled factors

# 10. Security

Security requirements:

- Factor secrets and seed material must be protected with strong encryption and minimal exposure
- Recovery, reset, and bypass workflows should require elevated controls and monitoring
- MFA policy enforcement for privileged access should not be user-optional

# 11. Audit

Audit coverage shall include:

- Factor enrollment and deletion
- Challenge outcomes
- Reset requests and approvals
- Bypass grants and expiry
- Trusted-device creation and revocation

# 12. AI

AI-assisted opportunities:

- Detect MFA fatigue or suspicious challenge patterns
- Recommend stronger factors for high-risk users
- Summarize populations with rising bypass dependence

# 13. Test Cases

Core test scenarios:

- Enroll authenticator factor successfully
- Require MFA at login for privileged role
- Trigger step-up on sensitive action
- Reset factor through approved recovery process
- Deny expired bypass grant

# 14. Workflows

Primary workflow:

1. User enrolls factor or receives required factor setup.
2. Login or action triggers MFA challenge.
3. User verifies factor and gains access.
4. Recovery or reset path is used only under governed conditions.
5. Telemetry feeds security monitoring and control reporting.

# 15. State Machine

Factor state model:

- `Pending Enrollment`
- `Active`
- `Suspended`
- `Reset Requested`
- `Revoked`

# 16. Permissions

Representative permissions:

- `mfa.policy.manage`
- `mfa.factor.reset`
- `mfa.bypass.grant`
- `mfa.telemetry.view`
- `mfa.audit.view`

# 17. Notifications

Notification scenarios:

- MFA enrolled
- Challenge failed repeatedly
- Factor reset requested
- Temporary bypass granted or expiring
- Trusted device added

# 18. Configuration

Configurable parameters:

- Allowed factor types
- Enrollment grace periods
- Step-up triggers
- Trusted-device duration
- Bypass approval model

# 19. Edge Cases

Important edge cases:

- User loses primary device during payroll close
- Multiple devices enrolled with differing trust states
- Push fatigue attack generates repeated challenge prompts
- User changes phone number while relying on OTP-based factor
