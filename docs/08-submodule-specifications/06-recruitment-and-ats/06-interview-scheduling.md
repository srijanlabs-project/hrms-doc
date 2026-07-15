---
id: HRMS-SUB-06-06
title: Interview Scheduling Specification
document: 06-interview-scheduling.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Interview Scheduling governs how shortlisted candidates are matched to interview panels, slots, locations, virtual rooms, and hiring timelines with minimal coordination friction and full traceability.

In scope:

- Interview round design and stage sequencing
- Panel availability and slot booking
- Candidate availability collection
- Calendar and virtual meeting integration
- Reschedule, cancel, no-show, and completion handling

# 2. Business

Interview scheduling is where recruitment often loses speed and candidate experience. A strong scheduling layer reduces manual back-and-forth, prevents double booking, and gives hiring teams clear ownership of interview commitments.

Business outcomes:

- Reduce scheduling cycle time from shortlist to first interview
- Improve panel utilization and accountability
- Prevent missed interviews, duplicate invites, and coordination gaps
- Preserve a professional candidate experience across time zones and formats

# 3. Functional

The system shall support:

- Configurable interview plans by requisition and stage
- Sequential, parallel, and panel-based interview patterns
- Interviewer calendars synced from enterprise calendar providers
- Candidate self-availability collection links where enabled
- Virtual, onsite, hybrid, or telephonic interview formats
- Auto-suggestion of feasible slots based on panel, location, timezone, and SLA
- Reschedule, cancel, replace interviewer, and add observer actions
- Buffer-time rules between interviews and travel-time considerations for onsite rounds
- Interview kit attachments such as resumes, scorecards, case studies, and NDAs
- Interview completion verification and no-show capture

Validation rules:

- Only candidates in `ready-for-interview` or later eligible states can be scheduled
- An interviewer cannot be double booked for overlapping slots
- Mandatory panel composition rules shall be enforced where configured
- Rescheduling after candidate confirmation shall trigger communication and audit logging

# 4. UX

The user experience shall provide:

- Scheduler console with calendar grid, candidate pipeline, and panel availability
- Drag-and-drop slot assignment with conflict warnings
- Candidate timezone-aware communication preview
- Interview cards showing stage, format, panel, and preparation checklist
- Hiring-manager view that highlights pending interviews and overdue feedback
- Mobile-friendly interviewer actions for accept, decline, and join meeting

# 5. API

Representative APIs:

- `POST /api/v1/recruitment/interviews`
- `PATCH /api/v1/recruitment/interviews/{interviewId}`
- `GET /api/v1/recruitment/interview-slots`
- `POST /api/v1/recruitment/interviews/{interviewId}/reschedule`
- `POST /api/v1/recruitment/interviews/{interviewId}/cancel`
- `POST /api/v1/recruitment/interviews/{interviewId}/complete`

API requirements:

- Calendar integration APIs shall handle retries and duplicate event suppression
- Interview creation shall validate stage eligibility, panel policy, and slot conflict in one transaction
- Communication payloads shall include locale and timezone metadata

# 6. Database

Core entities:

- `interview_plan`
- `interview_round`
- `interview_schedule`
- `interview_panel_member`
- `interview_slot`
- `candidate_availability`
- `calendar_sync_log`

Key data requirements:

- Interview schedules shall store timezone, mode, venue or meeting link, interviewer list, and status history
- Panel member records shall capture role such as primary interviewer, observer, coordinator, or approver
- Calendar sync logs shall store provider event identifiers and error details

# 7. Events

The platform shall publish:

- `candidate.interview.requested`
- `candidate.interview.scheduled`
- `candidate.interview.rescheduled`
- `candidate.interview.cancelled`
- `candidate.interview.completed`
- `candidate.interviewer.no-show`

# 8. Reports

Required reports:

- Time from shortlist to scheduled interview
- Interview reschedule and cancellation trend
- Interviewer utilization and no-show report
- Stage-wise scheduling SLA report
- Candidate dropout after scheduling report

# 9. Dashboards

Dashboards shall show:

- Today and upcoming interviews
- Scheduling backlog and unresolved conflicts
- Time-to-schedule by recruiter and business unit
- Virtual vs onsite mix and failure incidents

# 10. Security

Security controls shall include:

- Restricted meeting-link visibility to authorized participants
- Interview kit access based on stage role
- Calendar token storage with enterprise encryption standards
- Prevention of candidate access to interviewer-only notes

# 11. Audit

The audit trail shall capture:

- Schedule creation and all subsequent modifications
- Calendar sync attempts and failures
- Panel substitutions and reason codes
- Candidate confirmation, decline, no-show, or late arrival flags

# 12. AI

AI capabilities may include:

- Best-slot recommendations balancing speed, panel load, and candidate preference
- Detection of scheduling bottlenecks or likely no-show risk
- Suggested backup interviewers based on role and competency mapping

AI guardrails:

- Final scheduling ownership remains with authorized human users
- AI recommendations shall expose availability and policy rationale

# 13. Test Cases

Minimum test coverage shall include:

- Scheduling a candidate into an already occupied interviewer slot fails cleanly
- Reschedule updates calendar events and notification recipients correctly
- Candidate timezone conversion displays correctly in email and portal
- Mandatory panel composition is enforced for critical stages
- No-show marking prevents automatic stage completion

# 14. Workflows

Primary workflow:

1. Candidate becomes interview-ready.
2. System proposes eligible slots and panel combinations.
3. Scheduler confirms slot and sends invitations.
4. Candidate and panel receive reminders and preparation materials.
5. Interview completes and feedback stage opens.

# 15. State Machine

Supported states:

- `pending-scheduling`
- `slot-proposed`
- `scheduled`
- `confirmed`
- `reschedule-requested`
- `cancelled`
- `completed`
- `no-show`

# 16. Permissions

Permissions shall include:

- Design interview plans
- Schedule and reschedule interviews
- Manage panel members
- View candidate contact details
- Mark complete or no-show
- Access calendar integration settings

# 17. Notifications

Notifications shall support:

- Candidate invitations, reminders, reschedule updates, and cancellations
- Interviewer invites with accept or decline actions
- Recruiter alerts for conflicts, overdue confirmations, and no-shows
- Hiring-manager summaries of scheduled and pending rounds

# 18. Configuration

Administrators shall configure:

- Interview stage templates and mandatory panel rules
- Default durations and buffer windows
- Reminder schedule and communication templates
- Calendar providers, virtual meeting providers, and venue types
- Business-hours and blackout periods by location

# 19. Edge Cases

The design shall address:

- Cross-timezone interviews spanning daylight-saving changes
- Panel interviewer exits the company after being scheduled
- Virtual meeting link generation failure near interview start
- Candidate requests accommodation requiring different slot lengths or formats
- Bulk reschedule due to office closure or interviewer emergency
