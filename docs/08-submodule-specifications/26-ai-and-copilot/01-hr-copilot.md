---
id: HRMS-SUB-26-01
title: HR copilot Specification
document: 01-hr-copilot.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

HR Copilot governs the conversational assistant experience for employees, managers, HR teams, and administrators across HRMS workflows.

In scope:

- Conversational assistance across HR tasks
- Generic typed-command execution for governed HRMS queries and actions
- Context retrieval and action orchestration
- Role-aware response handling
- Human handoff and escalation
- Quality, safety, and adoption controls

# 2. Business

The HR copilot lowers friction in complex HR processes by turning navigation, policy lookup, and transaction initiation into a guided conversational experience.

# 3. Functional

The system shall support:

- User intents such as policy questions, task guidance, request initiation, status tracking, and workflow assistance
- Role-aware answers for employees, managers, and HR operators
- Context grounding from trusted HRMS data and policy sources
- Action suggestions and controlled transactional handoff to workflow or forms
- Conversation continuity, feedback capture, and fallback to human support

Validation rules:

- Copilot shall not execute sensitive actions without explicit user confirmation and authority validation
- Responses shall cite grounded source context where appropriate
- Restricted data shall be filtered by role before response generation

# 4. UX

The user experience shall provide:

- Embedded chat entry points across product surfaces
- Quick actions and suggested prompts
- Clear distinction between informational answers and executable actions
- Conversation history and escalation path to support

# 5. API

Representative APIs:

- `POST /api/v1/ai/copilot/chat`
- `POST /api/v1/ai/copilot/commands/interpret`
- `POST /api/v1/ai/copilot/commands/execute`
- `POST /api/v1/ai/copilot/actions/confirm`
- `GET /api/v1/ai/copilot/conversations/{conversationId}`
- `POST /api/v1/ai/copilot/feedback`

# 6. Database

Core entities:

- `copilot_conversation`
- `copilot_turn`
- `copilot_command_request`
- `copilot_action_suggestion`
- `copilot_feedback`
- `copilot_escalation_case`

# 7. Events

The platform shall publish:

- `copilot.conversation.started`
- `copilot.command.interpreted`
- `copilot.action.suggested`
- `copilot.command.executed`
- `copilot.action.confirmed`
- `copilot.command.rejected`
- `copilot.escalation.requested`

# 8. Reports

Required reports:

- Copilot adoption report
- Intent success report
- Escalation rate report
- User feedback report

# 9. Dashboards

Dashboards shall show:

- Conversation volume
- Top intents
- Satisfaction trend
- Escalation hotspots

# 10. Security

Security controls shall include:

- Role-aware retrieval and response filtering
- Logging controls for sensitive conversations
- Confirmation gates for privileged actions
- Tenant-safe context isolation

# 11. Audit

The audit trail shall capture:

- Suggested and executed actions
- Access to sensitive context
- Escalation and override handling
- Prompt or policy changes affecting responses

# 12. AI

AI capabilities may include:

- Intent classification
- Response generation with grounded citations
- Next-best action recommendation

# 13. Test Cases

- Employee cannot trigger manager-only action
- Copilot returns grounded policy answer
- Sensitive action requires confirmation
- Escalation creates support case correctly
- Restricted field is not exposed in conversation

# 14. Workflows

1. User starts conversation.
2. Copilot interprets intent and retrieves context.
3. Response or action suggestion is generated.
4. User confirms action or escalates.

# 15. State Machine

- `started`
- `active`
- `awaiting-confirmation`
- `escalated`
- `resolved`
- `closed`

# 16. Permissions

- Use copilot
- Execute typed command
- Execute suggested action
- View conversation analytics
- Review escalated conversations
- Configure copilot intents

# 17. Notifications

- Escalation alerts
- Action confirmation messages
- Feedback follow-up requests

# 18. Configuration

- Intent catalog
- Action allowlists
- Escalation routing
- Source grounding rules

# 19. Edge Cases

- Copilot has partial context due to system outage
- User asks mixed-role question on delegated access
- Same conversation spans policy lookup and action execution
- Copilot should refuse answer due to sensitive investigation context
