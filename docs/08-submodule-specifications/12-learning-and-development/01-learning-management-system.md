---
id: HRMS-SUB-12-01
title: Learning management system Specification
document: 01-learning-management-system.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Learning Management System governs the assignment, delivery, tracking, completion, evaluation, and reporting of enterprise learning content, programs, and learning journeys.

In scope:

- Course and program catalog management
- Enrollment and assignment
- Learning delivery and completion tracking
- Assessments, feedback, and learning pathways
- Reporting and integration with talent, compliance, and performance modules

# 2. Business

The LMS is the operational learning backbone of the HRMS platform. It supports mandatory training, upskilling, leadership development, onboarding learning, certification preparation, and continuous development. Without a governed LMS, learning remains fragmented, low-visibility, and hard to connect to capability strategy.

Business objectives:

- Centralize enterprise learning experiences and records
- Improve learning completion, discoverability, and capability tracking
- Connect learning outcomes to talent, compliance, and career growth
- Provide leadership with reliable learning engagement and skills-development visibility

# 3. Functional

The system shall support:

- Course, curriculum, pathway, cohort, and learning-program constructs
- Self-enrollment, manager nomination, mandatory assignment, and automated assignment by rule
- Blended delivery including e-learning, virtual instructor-led, classroom, and external learning records
- Session scheduling, waitlists, attendance, completion, and assessment scoring
- Learning recommendations, role-based catalog views, and skill-linked learning paths
- Feedback, evaluation, post-course surveys, and learning effectiveness signals
- Multi-language content and localized course metadata
- Pre-built onboarding learning packs for new hires with role-, function-, and geography-specific starter pathways

Detailed rules:

- Learning objects should support draft, published, archived, and superseded lifecycle states
- Mandatory assignments must remain distinguishable from optional development learning
- Completion logic should vary by delivery mode, assessment outcome, attendance, or attestation as configured
- External learning imports should support verification before becoming authoritative completion records
- Learning-path completion should reflect dependency order where prerequisites exist

# 4. UX

Primary screens:

- Learning catalog
- My learning dashboard
- Program and pathway view
- Session scheduler and attendance screen
- Learning admin authoring console
- Learning analytics dashboard

UX expectations:

- Learners should easily discover required, recommended, and enrolled learning
- Managers should see team learning progress without digging through multiple reports
- Admins should be able to assemble learning programs and cohorts without technical dependency
- Mobile access should support consumption of relevant course types and completion actions

# 5. API

Representative APIs:

- `POST /api/v1/learning/catalog/courses`
- `POST /api/v1/learning/enrollments`
- `GET /api/v1/learning/learners/{learnerId}/dashboard`
- `POST /api/v1/learning/sessions/{sessionId}/attendance`
- `POST /api/v1/learning/completions`
- `GET /api/v1/learning/programs/{programId}/progress`

# 6. Database

Core entities:

- `learning_course`
- `learning_program`
- `learning_pathway`
- `learning_enrollment`
- `learning_session`
- `learning_completion`
- `learning_assessment_result`

Key fields:

- Course code, type, language, duration, owner, publish status
- Program structure, prerequisite rules, completion model
- Learner ID, assignment source, due date, status, completion percentage
- Session date, facilitator, capacity, waitlist, attendance status
- Assessment score, pass status, feedback score, equivalency marker

# 7. Events

Published events:

- `learning.course_published`
- `learning.assignment_created`
- `learning.enrollment_confirmed`
- `learning.completed`
- `learning.assessment_failed`
- `learning.feedback_submitted`

Consumed events:

- `employee.joined`
- `employee.role_changed`
- `compliance_training.assigned`
- `talent_review.action_created`

# 8. Reports

Required reports:

- Learning completion report
- Enrollment and participation report
- Mandatory vs optional learning report
- Session utilization report
- Learning effectiveness and feedback report

# 9. Dashboards

Operational dashboards:

- Completion status by program
- Learner backlog of required courses
- Session fill-rate and waitlist dashboard
- Learning consumption by function or geography
- Assessment failure hotspots

# 10. Security

Security requirements:

- Course administration, assessment editing, and completion overrides should be permission-controlled
- Assessment content and answer keys require stronger restriction than general course metadata
- Learner progress visibility should follow organizational hierarchy and privacy policy

# 11. Audit

Audit coverage shall include:

- Course publish and archive actions
- Enrollment, withdrawal, and assignment-source changes
- Completion overrides and external import validations
- Assessment score changes
- Attendance and facilitator adjustments

# 12. AI

AI-assisted opportunities:

- Recommend learning based on role, skills, gaps, and aspirations
- Predict learners likely to miss completion deadlines
- Summarize program effectiveness and engagement patterns
- Suggest course tags and skill mappings from content metadata

# 13. Test Cases

Core test scenarios:

- Publish course and enroll learners
- Complete e-learning course with assessment pass
- Assign manager-nominated program with prerequisite path
- Import verified external completion
- Restrict unauthorized override of mandatory completion status

# 14. Workflows

Primary workflow:

1. Learning content is created and published.
2. Learners are assigned or self-enroll.
3. Course or session delivery occurs.
4. Completion, assessment, and feedback are captured.
5. Learning outcomes feed talent, compliance, and analytics consumers.

# 15. State Machine

Learning object state model:

- `Draft`
- `Published`
- `Archived`
- `Superseded`

Enrollment state model:

- `Assigned`
- `Enrolled`
- `In Progress`
- `Completed`
- `Failed`
- `Withdrawn`
- `Expired`

# 16. Permissions

Representative permissions:

- `learning_catalog.manage`
- `learning_assignment.manage`
- `learning_completion.override`
- `learning_assessment.manage`
- `learning_analytics.view`
- `learning_audit.view`

# 17. Notifications

Notification scenarios:

- New learning assigned
- Session reminder
- Completion overdue
- Assessment failed and reassignment required
- Program or pathway completed

# 18. Configuration

Configurable parameters:

- Delivery modes
- Enrollment policies
- Completion rules
- Assessment thresholds
- Reminder cadence
- Equivalency mappings

# 19. Edge Cases

Important edge cases:

- Learner changes role while program is in progress
- Course is superseded while active enrollments still exist
- Same completion arrives from LMS provider and manual import
- Session attendance recorded after course due date has already passed
