---
id: HRMS-SUB-22-03
title: Emergency response Specification
document: 03-emergency-response.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Emergency Response governs the activation, coordination, communication, tracking, and closure of urgent health, safety, security, or site incidents requiring structured immediate response.

In scope:

- Emergency declaration and activation
- Response team coordination
- Occupant accountability and status tracking
- Communication and escalation workflows
- Post-event closure and readiness review

# 2. Business

Emergency response is a mission-critical operational control. Organizations must be able to coordinate people, actions, communications, and evidence rapidly during fires, medical emergencies, natural disasters, security threats, or site evacuation events.

Business objectives:

- Enable rapid and coordinated emergency response
- Improve occupant safety and situational visibility during active incidents
- Provide auditable response records for review and compliance
- Feed lessons learned into future risk and preparedness improvements

# 3. Functional

The system shall support:

- Emergency activation for fire, medical, evacuation, weather, security, hazardous-material, and custom event types
- Incident commander, response team, and role assignment tracking
- Site, building, floor, zone, and muster-point coverage
- Occupant accountability including safe, injured, missing, evacuated, and unknown statuses
- Multi-channel urgent communication to affected populations
- Resource tracking for emergency equipment, first responders, and external agency contacts
- Post-event debrief, lessons learned, and corrective action capture

Detailed rules:

- Critical emergencies should allow immediate activation before full details are known
- Occupant status updates must preserve time-ordered history during fast-moving events
- Only authorized incident commanders should close or downgrade an active emergency
- Communication must support targeted audience updates as affected zones or risk levels change
- Emergency records should remain linked to any resulting incident, injury, or risk-assessment records
- Drill executions should be clearly segregated from live events while still retaining comparable analytics
- Muster reconciliation should support manual override with accountable operator evidence when automated data is incomplete

# 4. UX

Primary screens:

- Emergency activation console
- Live response command board
- Occupant accountability map
- Broadcast communication panel
- Post-event review dashboard

UX expectations:

- Active emergency screens should prioritize clarity, speed, and minimal interaction overhead
- Incident commanders should see changing occupancy, action status, and communications in one place
- Mobile usage should support field commanders and wardens during live events

# 5. API

Representative APIs:

- `POST /api/v1/ehs/emergencies`
- `GET /api/v1/ehs/emergencies/{emergencyId}`
- `POST /api/v1/ehs/emergencies/{emergencyId}/status`
- `POST /api/v1/ehs/emergencies/{emergencyId}/occupants/{occupantId}/mark`
- `POST /api/v1/ehs/emergencies/{emergencyId}/broadcast`
- `POST /api/v1/ehs/emergencies/{emergencyId}/close`

# 6. Database

Core entities:

- `emergency_event`
- `emergency_response_role`
- `emergency_occupant_status`
- `emergency_broadcast`
- `emergency_resource_log`
- `emergency_post_event_review`

Key fields:

- Emergency ID, type, location scope, severity, activation timestamp, current status
- Incident commander, warden, medic, security lead, external-agency liaison
- Occupant ID, zone, last known status, timestamp, source of update
- Broadcast message, channel, audience scope, delivery status
- Response action, resource allocation, closure reason, lesson learned
- Drill-or-live indicator, evacuation-order timestamp, and all-clear timestamp
- Muster-point occupancy status and external-agency arrival metadata

# 7. Events

Published events:

- `emergency.activated`
- `emergency.broadcast_sent`
- `emergency.occupant_status_updated`
- `emergency.escalated`
- `emergency.closed`
- `emergency.review_created`

Consumed events:

- `incident.reported`
- `site.alarm_triggered`
- `badge.access_swipe_received`
- `weather.alert_received`

# 8. Reports

Required reports:

- Emergency event log
- Occupant accountability report
- Response time report
- Emergency communication report
- Post-event corrective action report
- Drill readiness and performance report
- Unaccounted-occupant reconciliation report

# 9. Dashboards

Operational dashboards:

- Active emergencies
- Unaccounted occupants
- Broadcast delivery status
- Response time metrics
- Drill vs real-event comparison

# 10. Security

Security requirements:

- Only authorized emergency roles may activate or close events
- Occupant location and status data must be restricted to legitimate response roles
- Emergency communications and exports may contain sensitive details and should be controlled

# 11. Audit

Audit coverage shall include:

- Activation and closure actions
- Occupant status changes
- Broadcast messages sent
- Role assignment changes during live event
- Post-event review and corrective action edits

# 12. AI

AI-assisted opportunities:

- Summarize live event status for command-center use
- Predict zones likely needing additional response attention
- Suggest missing follow-up actions from post-event review data

AI guardrails:

- AI recommendations must never suppress operator-entered life-safety alerts
- Live summaries should always surface data freshness and uncertainty indicators

# 13. Test Cases

Core test scenarios:

- Activate emergency and assign command roles
- Track occupant accountability updates
- Broadcast targeted message to affected zone
- Escalate emergency severity
- Close event and generate post-event review
- Run drill mode without contaminating live-event metrics
- Override muster status manually when badge or sensor feed is unavailable

# 14. Workflows

Primary workflow:

1. Emergency is activated.
2. Response roles and communication flows are initiated.
3. Occupant accountability and actions are tracked live.
4. Emergency is stabilized and closed.
5. Post-event review drives improvement actions.

# 15. State Machine

Emergency state model:

- `Activated`
- `Contained`
- `Escalated`
- `Stabilized`
- `Closed`
- `Reviewed`

# 16. Permissions

Representative permissions:

- `emergency.activate`
- `emergency.command.manage`
- `emergency.broadcast`
- `emergency.occupant.update`
- `emergency.close`
- `emergency.audit.view`

# 17. Notifications

Notification scenarios:

- Emergency activated
- Occupant unaccounted for
- Broadcast failed
- Emergency escalated
- Post-event review assigned

# 18. Configuration

Configurable parameters:

- Emergency taxonomy
- Role roster by site
- Broadcast channel hierarchy
- Muster point definitions
- Drill vs live-event mode

# 19. Edge Cases

Important edge cases:

- Network disruption during active emergency
- Occupant appears in multiple zone feeds
- Drill accidentally initiated as live event
- External agency arrives before full internal accountability is complete
