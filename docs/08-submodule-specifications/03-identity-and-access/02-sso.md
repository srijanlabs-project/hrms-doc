---
id: HRMS-SUB-03-02
title: SSO Specification
document: 02-sso.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Single Sign-On governs federated identity access between the HRMS platform and enterprise identity providers so users can authenticate through approved corporate identity services.

In scope:

- Identity-provider integration
- Federation protocols and assertions
- JIT provisioning and mapping behavior
- SSO session initiation and logout
- Federation health, failover, and auditability

# 2. Business

SSO reduces password sprawl, simplifies user access, and centralizes security control in enterprise identity systems. In HRMS, it also improves onboarding and offboarding responsiveness because access follows corporate identity state more closely.

Business objectives:

- Centralize enterprise user authentication
- Improve user experience through corporate sign-in continuity
- Strengthen access governance and reduce password-related risk
- Support timely access enablement and disablement aligned to identity lifecycle

# 3. Functional

The system shall support:

- SAML, OIDC, and enterprise federation patterns as approved
- Multiple identity providers by tenant, domain, region, or population where required
- Identity mapping by immutable IDs, email, employee code, or approved attribute combinations
- SP-initiated and IdP-initiated login flows where allowed
- Single logout, session termination propagation, and fallback handling
- Just-in-time user creation or mapping when allowed by policy

Detailed rules:

- Federation mapping should prefer immutable identifiers over mutable email where possible
- JIT provisioning must respect role-assignment and onboarding rules rather than over-provisioning access
- Assertion validation must include issuer, audience, signature, timestamp, and replay protections
- Fail-open SSO behavior should be prohibited for privileged populations unless explicit emergency policy exists

# 4. UX

Primary screens:

- Identity provider configuration
- Domain routing and login discovery
- SSO login entry
- Federation troubleshooting console
- User mapping diagnostics

UX expectations:

- Users should be routed to the correct provider with minimal friction
- Admins should be able to test claims and mappings without affecting production users
- Error states should be clear enough for support teams while avoiding security oversharing

# 5. API

Representative APIs:

- `POST /api/v1/auth/sso/providers`
- `PUT /api/v1/auth/sso/providers/{providerId}`
- `POST /api/v1/auth/sso/test-assertion`
- `GET /api/v1/auth/sso/providers/{providerId}/health`
- `POST /api/v1/auth/sso/logout`

# 6. Database

Core entities:

- `sso_provider`
- `sso_domain_route`
- `sso_user_mapping`
- `sso_assertion_event`
- `sso_jit_provisioning_rule`
- `sso_health_snapshot`

Key fields:

- Provider name, protocol, issuer, audience, certificate reference, active status
- Domain or population route, fallback policy, login hint behavior
- User mapping source attribute, target user ID, last assertion timestamp
- Assertion ID, validation outcome, replay-detection flag, error code
- JIT policy, creation scope, default access policy, health-check status

# 7. Events

Published events:

- `sso.provider_activated`
- `sso.login_succeeded`
- `sso.login_failed`
- `sso.assertion_rejected`
- `sso.jit_user_created`

Consumed events:

- `identity.user_created`
- `identity.user_disabled`
- `auth.logout_requested`
- `certificate.rotated`

# 8. Reports

Required reports:

- SSO success and failure report
- Provider health report
- User-mapping mismatch report
- JIT provisioning report
- Assertion replay or validation failure report

# 9. Dashboards

Operational dashboards:

- SSO login volume by provider
- Failed federation trends
- Provider latency and health status
- JIT provisioning activity

# 10. Security

Security requirements:

- Federation secrets, certificates, and signing keys must be protected and rotatable
- Assertion replay prevention, strict audience validation, and strong certificate controls are mandatory
- JIT provisioning must not bypass access-governance requirements

# 11. Audit

Audit coverage shall include:

- Provider creation and configuration changes
- Certificate rotation
- User-mapping changes
- JIT provisioning outcomes
- SSO login failure diagnostics for authorized security users

# 12. AI

AI-assisted opportunities:

- Detect mapping anomalies across providers
- Summarize common SSO failure causes
- Recommend configuration hardening based on assertion error trends

# 13. Test Cases

Core test scenarios:

- Successful SP-initiated login
- Reject invalid assertion due to audience mismatch
- Create user through approved JIT path
- Route correct domain to provider
- Handle provider certificate rotation

# 14. Workflows

Primary workflow:

1. User starts login.
2. Domain or policy routes user to identity provider.
3. Provider returns signed assertion or token.
4. HRMS validates, maps, and authenticates user.
5. Session is created and audited.

# 15. State Machine

Provider state model:

- `Draft`
- `Testing`
- `Active`
- `Degraded`
- `Disabled`
- `Retired`

# 16. Permissions

Representative permissions:

- `sso_provider.manage`
- `sso_mapping.view`
- `sso_mapping.manage`
- `sso_health.view`
- `sso_audit.view`

# 17. Notifications

Notification scenarios:

- Provider health degraded
- Certificate rotation due
- Assertion validation failure spike
- JIT provisioning error

# 18. Configuration

Configurable parameters:

- Provider protocol
- Domain-routing logic
- JIT provisioning rules
- Logout propagation behavior
- Assertion validation tolerances

# 19. Edge Cases

Important edge cases:

- Same user exists in multiple identity providers
- Provider sends changed email but stable immutable ID
- IdP is available but returns stale group or attribute claims
- Emergency failover to alternate provider is required
