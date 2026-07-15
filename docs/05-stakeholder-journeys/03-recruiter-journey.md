---
id: HRMS-JNY-03
title: Recruiter Journey
document: 03-recruiter-journey.md
version: 1.1
status: Draft
---

# 1. Persona Context

This journey document describes how the `Recruiter` experiences and uses the Enterprise HRMS application across multiple modules. The journey is especially shaped by Recruitment and ATS, Manager Self Service, People Management, and Communication Platform and related downstream interactions.

Primary goals:

- Move candidates efficiently from requisition to hire
- Coordinate hiring managers, interviewers, and offer workflows
- Track conversion, sourcing performance, and hiring SLAs

# 2. Primary Module Touchpoints

- Recruitment and ATS
- Manager Self Service
- People Management
- Communication Platform
- Analytics and BI

# 3. Journey Stages

Typical stages:

- Entry and authentication
- Task discovery and navigation
- Transaction execution or review
- Approval, exception, or collaboration handling
- Completion, evidence, and follow-up

Stage expectations:

- The recruiter should have a clear starting point that surfaces only relevant pending actions.
- The recruiter should understand status, ownership, cut-offs, and next steps during every major transaction.
- The recruiter should be able to resume interrupted work without losing history or confidence.

# 4. Experience Expectations

- The recruiter should see only relevant tasks, approvals, and data.
- The recruiter should be guided by clear statuses, deadlines, and notifications.
- The recruiter should be able to recover from validation errors and interrupted flows.
- The recruiter should not need to understand internal module boundaries to complete normal work successfully.

# 5. Risks and Failure Points

- Missing permissions or scope may block recruiter actions.
- Unclear state or approval ownership may delay recruiter workflows.
- Cross-module inconsistency may confuse recruiter and reduce adoption.
- Notification failure, stale dashboards, or late integrations may erode trust in the recruiter experience.

# 6. Reporting and Monitoring

- Dashboards for recruiter should show pending actions, status visibility, and trend indicators.
- Audit and support teams should be able to reconstruct the recruiter journey when issues occur.
- Product teams should measure adoption, abandonment, turnaround time, and satisfaction for the recruiter journey.

# 7. Design and Engineering Implications

- UX should optimize for role-specific entry points and minimal cognitive load.
- APIs and permissions should be aligned to role-specific actions and data boundaries.
- QA should verify the journey across module boundaries, not only within isolated features.
- Support tooling should be able to trace which system state, notification, or dependency interrupted the journey.
