---
id: HRMS-SUB-05-02
title: Performance reviews Specification
document: 02-performance-reviews.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Performance Reviews governs the manager self-service experience for completing team-member review tasks across goal, appraisal, feedback, and calibration processes.

In scope:

- Manager review task list
- Employee performance context aggregation
- Review submission, return, and completion
- Team-level cycle monitoring
- Manager commentary and evidence workflows

# 2. Business

Managers are the primary execution layer of the performance process. Their workspace must be efficient, evidence-backed, and clear enough to maintain timeliness and consistency across large teams.

# 3. Functional

The system shall support:

- Team review queue with cycle, status, due date, and employee segmentation
- Access to employee goals, check-ins, self-review, prior ratings, and 360 summaries where allowed
- Entry of ratings, comments, development actions, and promotion recommendations
- Return of incomplete self-review or draft feedback
- Team progress tracking and escalation visibility
- Bulk nudges for pending employee submissions where enabled

Validation rules:

- Manager review must respect cycle phase and mandatory section completion
- Managers shall not edit locked rating scales or completed employee self-sections unless policy allows
- Delegated review authority shall be clearly separated from original manager ownership

# 4. UX

The user experience shall provide:

- Review queue with employee readiness indicators
- Side-by-side evidence and review-entry layout
- Autosave drafts and clear submit status
- Manager heatmap of pending, overdue, and completed team reviews

# 5. API

Representative APIs:

- `GET /api/v1/mss/performance-reviews`
- `GET /api/v1/mss/performance-reviews/{reviewId}`
- `PATCH /api/v1/mss/performance-reviews/{reviewId}`
- `POST /api/v1/mss/performance-reviews/{reviewId}/submit`
- `POST /api/v1/mss/performance-reviews/{reviewId}/return`

# 6. Database

Core entities:

- `manager_performance_review_view`
- `manager_review_draft`
- `manager_review_queue_snapshot`
- `manager_review_comment`

# 7. Events

The platform shall publish:

- `mss.performance-review.opened`
- `mss.performance-review.submitted`
- `mss.performance-review.returned`
- `mss.performance-review.overdue`

# 8. Reports

Required reports:

- Manager review completion report
- Overdue review report
- Review return frequency report
- Team rating trend summary

# 9. Dashboards

Dashboards shall show:

- Team review completion %
- Overdue performance reviews
- Employees blocked by manager action
- Review distribution by manager

# 10. Security

Security controls shall include:

- Visibility limited to authorized review population
- Confidential reviewer comments shielded where required
- Calibration-protected fields hidden until release stage

# 11. Audit

The audit trail shall capture:

- Manager draft and final submissions
- Returned reviews and rationale
- Delegated review activity
- Access to prior performance records

# 12. AI

AI capabilities may include:

- Draft summary help from goals and feedback
- Completeness checks for low-evidence reviews
- Suggested development themes

# 13. Test Cases

- Manager cannot submit with missing mandatory sections
- Delegated reviewer sees only assigned population
- Draft autosave restores correctly
- Return action sends employee back to correct stage
- Prior-cycle visibility follows configuration

# 14. Workflows

1. Manager opens review queue.
2. Manager reviews evidence and enters evaluation.
3. Review is submitted or returned.
4. Cycle status updates for downstream calibration or closure.

# 15. State Machine

- `pending-manager`
- `draft`
- `returned`
- `submitted`
- `overdue`
- `closed`

# 16. Permissions

- View team reviews
- Edit manager review
- Return self-review
- Submit manager review
- View prior-cycle history

# 17. Notifications

- Review assignment alerts
- Due-date reminders
- Return-to-employee notifications
- Overdue escalation alerts

# 18. Configuration

- Queue filters
- Evidence visibility rules
- Review return policy
- Reminder cadence

# 19. Edge Cases

- Employee changes manager mid-cycle
- Manager on leave needs delegated review support
- Review enters calibration before all manager notes finalized
- Employee exits during manager review phase
