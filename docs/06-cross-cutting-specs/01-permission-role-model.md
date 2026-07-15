---
id: HRMS-XCUT-01
title: Permission and Role Model
document: 01-permission-role-model.md
version: 2.0
status: Draft
---

# 1. Purpose

This document defines the enterprise-wide permission and role model for the HRMS platform. It is the canonical reference for how users receive access, what data they can see, what actions they can perform, how delegation works, and how high-risk functions are controlled.

# 2. Objectives

- Enforce least-privilege access by default
- Separate business responsibility from technical access rights
- Support enterprise data scoping across tenant, company, geography, and team boundaries
- Enable configurable role composition without breaking auditability
- Prevent segregation-of-duties conflicts in high-risk areas such as payroll, compensation, identity, and security administration

# 3. Core Concepts

## 3.1 Identity

An identity represents a single authenticated user or system actor.

Identity types:

- Employee identity
- Manager identity
- HR operations identity
- Payroll identity
- Finance approver identity
- System administrator identity
- Auditor identity
- Service or integration identity

## 3.2 Role

A role is a business-friendly access bundle assigned to an identity. Roles must be named consistently and mapped to specific responsibilities.

Examples:

- Employee
- Reporting Manager
- HR Operations Executive
- HR Administrator
- Recruiter
- Payroll Processor
- Payroll Approver
- Finance Approver
- Security Administrator
- Auditor

## 3.3 Permission

A permission is the smallest actionable capability granted by the platform.

Permission examples:

- `employee.profile.view.self`
- `employee.profile.edit.hr`
- `payroll.run.process`
- `attendance.regularization.approve`
- `security.role.assign`
- `report.payroll.export`

## 3.4 Data Scope

Permissions are not sufficient on their own. Every significant access path must also enforce data scope.

Typical scopes:

- Tenant
- Company
- Legal entity
- Business unit
- Location
- Department
- Team
- Position hierarchy
- Employee self
- Direct reports
- Indirect reports

# 4. Access Model

The HRMS permission model shall use four layers:

1. Identity authentication
2. Role assignment
3. Permission evaluation
4. Data-scope filtering

All four layers must succeed before access is granted.

## 4.1 Grant Types

Supported grant types:

- Direct role assignment
- Role assignment by job or user category
- Temporary delegated access
- Emergency access with enhanced logging
- Service-account scoped access for integrations

## 4.2 Deny Rules

Explicit deny rules must override grants in sensitive situations, especially for:

- Conflict-of-interest cases
- Legal-hold or investigation scenarios
- Suspended user states
- Segregation-of-duties violations

# 5. Role Design Standard

Roles should be designed using the following pattern:

- Business-readable role name
- Clear purpose statement
- Allowed modules
- Allowed actions
- Allowed scopes
- Restricted actions
- Approval requirement for assignment
- Review frequency

## 5.1 Role Categories

- Self-service roles
- Operational roles
- Approval roles
- Administrative roles
- Compliance and audit roles
- Technical and integration roles

## 5.2 Role Naming Guidance

Use stable role names such as:

- `EMPLOYEE`
- `MANAGER_L1`
- `HR_OPERATIONS`
- `PAYROLL_PROCESSOR`
- `PAYROLL_APPROVER`
- `SECURITY_ADMIN`
- `AUDITOR_READONLY`

Avoid vague names such as:

- `admin`
- `superuser`
- `operator`

# 6. Permission Taxonomy

Each permission should be modeled with these dimensions:

- Module
- Resource
- Action
- Scope type
- Risk level
- Audit sensitivity

## 6.1 Action Types

- View
- Search
- Create
- Edit
- Delete-like retire or deactivate
- Approve
- Reject
- Override
- Export
- Configure
- Assign role
- Reopen

## 6.2 Risk Levels

- `Low` - low operational impact
- `Medium` - business-impacting
- `High` - payroll, financial, compliance, or identity impact
- `Critical` - security, privileged admin, or irreversible control impact

# 7. Data Scope Model

## 7.1 Scope Evaluation Order

When a user performs an action, the system should evaluate:

1. Is the user authenticated?
2. Does the user hold a role with the needed permission?
3. Is the requested data within authorized scope?
4. Is there any explicit deny or SoD conflict?
5. Is there any extra approval or step-up authentication required?

## 7.2 Common Scope Patterns

- Self-only access
- Team-only access
- Organization node access
- Company-wide access
- Region-based access
- Cross-company enterprise access

## 7.3 Scope Inheritance

Managers and HR roles may inherit scope from:

- Reporting hierarchy
- Organization hierarchy
- Company assignment
- Policy configuration

Scope inheritance must be deterministic and auditable.

# 8. Delegation Model

Delegation allows one user to temporarily act on behalf of another within controlled boundaries.

Delegation rules:

- Delegation must be time-bound
- Delegation must be scope-bound
- Delegation must be role-bound
- Sensitive actions may be excluded from delegation
- Delegation must be fully audited

Examples of delegable actions:

- Leave approvals
- Attendance approvals
- Routine team actions

Examples of non-delegable or tightly restricted actions:

- Payroll close approval
- Security role assignment
- SoD override
- Critical compensation approval

# 9. Maker-Checker and Segregation of Duties

## 9.1 Maker-Checker

High-risk transactions should be split into:

- Maker
- Reviewer or approver

The same user must not both initiate and approve the same critical action where policy forbids it.

## 9.2 SoD Risk Areas

High-risk combinations include:

- Payroll processing + payroll approval
- User provisioning + role assignment
- Compensation recommendation + compensation approval
- Vendor payment initiation + payment confirmation
- Security policy edit + security audit closure

The platform must detect and block or flag these combinations based on configured rules.

# 10. Module-Level Expectations

## 10.1 Employee and Manager Flows

- Employees should primarily see self data
- Managers should see team-scoped data only
- Skip-level access must be explicitly configured

## 10.2 HR and Payroll Flows

- HR operations may edit employee records within authorized company and location scope
- Payroll users must be restricted from unrelated HR configuration unless explicitly granted
- Compensation and payroll visibility must be more restrictive than general HR visibility

## 10.3 Admin and Security Flows

- Security administrators should not automatically get payroll or employee-medical access
- Technical admins must not bypass audit and approval controls by default

# 11. Audit Requirements

The following must be auditable:

- Role assignments
- Permission changes
- Delegation creation and expiry
- Access denial decisions
- High-risk access grants
- Emergency access usage
- Scope changes
- SoD violations and overrides

Audit records must capture:

- Actor
- Target user
- Permission or role affected
- Scope
- Before and after state
- Timestamp
- Source channel
- Approval reference where relevant

# 12. API and Service Expectations

Representative APIs:

- `POST /api/v1/security/roles`
- `POST /api/v1/security/role-assignments`
- `POST /api/v1/security/delegations`
- `POST /api/v1/security/access-check`
- `GET /api/v1/security/access-audit`

Service behavior expectations:

- Access checks must be deterministic
- Batch access checks should support bulk screens efficiently
- Cached permission models must respect revocation timing requirements
- Sensitive access changes should trigger cache invalidation or equivalent refresh control

# 13. UX Expectations

Administrative UI should provide:

- Role catalog management
- Permission matrix review
- Data-scope assignment views
- Delegation management
- SoD conflict warnings
- Assignment history

End-user UI should provide:

- Clear permission-denied states
- Transparent delegation indicators when acting on behalf of another user
- Minimal exposure of technical permission terminology

# 14. Test Strategy

Mandatory test coverage:

- Positive access scenarios
- Negative access scenarios
- Cross-scope leakage prevention
- Delegation start, expiry, and revocation
- SoD conflict detection
- Maker-checker enforcement
- Audit completeness
- Permission changes during active sessions

# 15. Implementation Guidance

Engineering guidelines:

- Do not hardcode role names in business logic where configuration is intended
- Keep permission checks centralized and reusable
- Separate UI visibility checks from API authorization checks
- Never rely on client-side role enforcement for sensitive actions
- Log denied access for high-risk areas

QA guidelines:

- Build a reusable role-and-scope test matrix
- Validate the same action across multiple actor types
- Validate both data visibility and actionability

# 16. Open Expansion Items

This document should next be extended with:

- Full permission catalog
- Role-to-permission matrix
- Scope matrix by module
- SoD rules inventory
- Delegation exclusions list
