---
id: HRMS-SUB-29-02
title: ABAC Specification
document: 02-abac.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

ABAC extends the authorization model beyond static role grants by applying policy decisions based on user, resource, action, and runtime context attributes.

In scope:

- Attribute taxonomy and attribute sourcing
- Policy authoring, versioning, simulation, and activation
- Runtime policy evaluation and decision trace
- Conflict handling with RBAC and other security controls

# 2. Business

Enterprise HRMS platforms often need more precision than roles alone can provide. Typical examples include limiting HR access by legal entity, manager access to reporting lines only, masking sensitive data by geography, and restricting actions based on workflow state, device posture, or support mode.

Business objectives:

- Reduce role explosion by moving fine-grained access decisions into policy
- Enforce privacy, labor, and regional access constraints consistently
- Support context-aware restrictions for sensitive actions and data access
- Provide explainable access decisions for audit and support

# 3. Functional

The system shall support:

- User attributes such as company, legal entity, location, department, role family, employment scope, and clearance level
- Resource attributes such as owner company, employee population, data sensitivity, workflow status, and region
- Context attributes such as access channel, device trust, network zone, time window, impersonation mode, and delegated access
- Policy evaluation outcomes such as allow, deny, allow-with-mask, and review-required where supported by the consuming service
- Pre-deployment policy simulation against historical or synthetic access scenarios
- Effective-dated policy activation and rollback

Detailed rules:

- Deny must override allow where policy conflict exists unless explicit priority model defines otherwise
- Missing critical attributes should fail closed for sensitive resources
- ABAC evaluation must be composable with RBAC so both coarse entitlement and fine-grained filtering can operate together
- Policy changes must be versioned, reviewable, and deployable without destructive overwrite
- Resource-scoped filtering should support list views, detail views, exports, and APIs consistently

# 4. UX

Primary screens:

- Attribute source catalog
- Policy editor
- Policy simulation console
- Decision trace viewer
- Policy version comparison screen

UX expectations:

- Policy authors need readable business-language expressions, not only low-level rule syntax
- Simulation results should show why access was allowed, denied, or masked
- Debugging views must make it easy for support and audit teams to trace attribute values used during a decision

# 5. API

Representative APIs:

- `POST /api/v1/security/abac/policies`
- `PUT /api/v1/security/abac/policies/{policyId}`
- `POST /api/v1/security/abac/policies/{policyId}/simulate`
- `POST /api/v1/security/abac/evaluate`
- `GET /api/v1/security/abac/decisions/{decisionId}`

API expectations:

- Evaluation APIs must be low-latency and safe for high-frequency runtime use
- Simulation APIs should support bulk scenario testing before activation
- Decision APIs must redact sensitive attribute values where exposure would create risk

# 6. Database

Core entities:

- `abac_policy`
- `abac_policy_version`
- `abac_policy_rule`
- `abac_attribute_mapping`
- `abac_decision_log`
- `abac_simulation_run`

Key fields:

- Policy code, domain, status, priority, effective dates
- Attribute source, transformation rule, trust level, freshness requirement
- Rule expression, action scope, decision outcome, mask behavior
- Decision timestamp, actor, resource, context hash, final result, explanation token
- Simulation initiator, dataset reference, expected and actual outcomes

# 7. Events

Published events:

- `abac.policy_published`
- `abac.policy_retired`
- `abac.decision_denied`
- `abac.decision_masked`
- `abac.attribute_source_failed`

Consumed events:

- `identity.user_attribute_changed`
- `employee.organization_changed`
- `data_classification.updated`
- `delegation.activated`

# 8. Reports

Required reports:

- Denied access analysis report
- Masked-access report
- Policy effectiveness report
- Attribute source freshness report
- Policy change history report

# 9. Dashboards

Operational dashboards:

- Deny volume by policy
- Top policies impacting user experience
- Attribute-source outages or stale-source alerts
- Simulations pending approval

# 10. Security

Security requirements:

- Only highly trusted policy administrators may publish ABAC rules
- Attribute-source integrity must be validated and monitored
- Sensitive decision logs should not expose private attribute values unnecessarily
- Fail-open behavior should be prohibited for high-sensitivity resource types

# 11. Audit

Audit coverage shall include:

- Policy authoring, review, approval, and publication
- Attribute mapping changes
- Decision traces for sensitive allow and deny outcomes
- Policy rollback and emergency disablement
- Simulation evidence before high-impact activation

# 12. AI

AI-assisted opportunities:

- Suggest draft policies from repeated access patterns and governance requirements
- Detect conflicting or redundant policies
- Explain likely root cause when legitimate users are unexpectedly denied

AI guardrails:

- AI may assist drafting and diagnosis but must not self-publish security policy
- Confidence and rationale must be shown for any recommended rule

# 13. Test Cases

Core test scenarios:

- Allow access based on company and legal-entity match
- Deny access when sensitivity exceeds user clearance
- Mask restricted fields while allowing base record access
- Fail closed when mandatory attribute source is stale
- Simulate future policy against historical access set

# 14. Workflows

Primary workflow:

1. Policy admin defines or updates attribute-based rule.
2. System validates attribute references and policy syntax.
3. Simulation is executed on representative scenarios.
4. Policy is approved and activated.
5. Runtime services evaluate requests using active policies and log decisions.

# 15. State Machine

Policy version state model:

- `Draft`
- `Pending Approval`
- `Approved`
- `Active`
- `Superseded`
- `Retired`

Simulation state model:

- `Queued`
- `Running`
- `Completed`
- `Failed`

# 16. Permissions

Representative permissions:

- `abac.policy.create`
- `abac.policy.publish`
- `abac.policy.simulate`
- `abac.decision.view`
- `abac.attribute_mapping.manage`
- `abac.audit.view`

# 17. Notifications

Notification scenarios:

- Policy awaiting approval
- Attribute source failure affecting authorization
- Spike in denied access after policy activation
- Policy superseded or rolled back

# 18. Configuration

Configurable parameters:

- Allowed attribute sources
- Decision conflict model
- Attribute freshness thresholds
- Masking strategies
- Simulation approval workflow

# 19. Edge Cases

Important edge cases:

- Role allows but ABAC denies the action
- Attribute source is temporarily unavailable during payroll close
- User acts on behalf of another user through delegation or proxy mode
- Resource attributes change between list retrieval and detail access
