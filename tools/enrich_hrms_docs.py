from __future__ import annotations

import sys
from pathlib import Path


TOOLS = Path(__file__).resolve().parent
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

import generate_hrms_specs as base_specs
import generate_hrms_library_expansion as expansion


DOCS = Path(r"D:/HRMS-doc/docs")
MODULE_BASE = DOCS / "03-module-specifications"
SUBMODULE_BASE = DOCS / "08-submodule-specifications"
JOURNEY_BASE = DOCS / "05-stakeholder-journeys"
XCUT_BASE = DOCS / "06-cross-cutting-specs"
APPENDIX_BASE = DOCS / "07-appendices"


def words_to_sentence(values: list[str]) -> str:
    if not values:
        return ""
    if len(values) == 1:
        return values[0]
    if len(values) == 2:
        return f"{values[0]} and {values[1]}"
    return ", ".join(values[:-1]) + f", and {values[-1]}"


def module_prefix(module: dict) -> str:
    return module["title"].replace(" Specification", "")


def business_scenarios(module: dict) -> list[str]:
    title = module_prefix(module)
    scenarios = [
        f"Administrators configure or maintain {title.lower()} records in line with tenant policy.",
        f"Operational users execute day-to-day {title.lower()} transactions while the system enforces validations and approvals.",
        f"Managers or approvers review exceptions, pending actions, and escalations related to {title.lower()}.",
        f"Leadership, compliance, or analytics users consume consolidated outputs produced by {title.lower()}.",
    ]
    return scenarios


def success_measures(module: dict) -> list[str]:
    title = module_prefix(module)
    return [
        f"Reduction in manual effort and rework for {title.lower()} operations",
        f"Improved data completeness, timeliness, and control adherence for {title.lower()}",
        f"Lower exception volume and faster turnaround for key {title.lower()} transactions",
        f"Higher confidence in downstream reporting, payroll, analytics, or compliance outcomes linked to {title.lower()}",
    ]


def transition_pairs(states: list[str]) -> list[str]:
    pairs = []
    for idx in range(len(states) - 1):
        pairs.append(f"{states[idx]} -> {states[idx + 1]}")
    return pairs[:6]


def role_actions(module: dict) -> list[str]:
    title = module_prefix(module).lower()
    actions = []
    for role in module["roles"]:
        actions.append(f"- `{role}`: view or act on {title} data according to configured responsibility and data scope.")
    return actions


def report_descriptions(module: dict) -> list[str]:
    out = []
    for report in module["reports"]:
        out.append(f"- `{report}`: operational or audit-facing output used to review status, exceptions, trends, or regulatory evidence.")
    return out


def dashboard_descriptions(module: dict) -> list[str]:
    out = []
    for dashboard in module["dashboards"]:
        out.append(f"- `{dashboard}`: summary view intended to surface actionable indicators, pending issues, and movement over time.")
    return out


def module_markdown(module: dict) -> str:
    title = module_prefix(module)
    title_lower = title.lower()
    lines = [
        "---",
        f"id: HRMS-MOD-{module['code']}-{module['num']}",
        f"title: {module['title']}",
        f"document: {module['num']}-{module['slug']}.md",
        "version: 1.1",
        "status: Draft",
        "---",
        "",
        "# 1. Business",
        "",
        module["business"],
        "",
        "Business objectives:",
        "",
    ]
    lines += [f"- {x}" for x in module["objectives"]]
    lines += ["", "Primary stakeholders:", ""]
    lines += [f"- {x}" for x in module["stakeholders"]]
    lines += ["", "Business scenarios:", ""]
    lines += [f"- {x}" for x in business_scenarios(module)]
    lines += ["", "Success measures:", ""]
    lines += [f"- {x}" for x in success_measures(module)]

    lines += [
        "",
        "# 2. Functional",
        "",
        f"The {title} module shall support the full lifecycle of master data, operational transactions, approvals, downstream outputs, and exception handling required for enterprise HRMS deployments.",
        "",
        "In-scope capability areas:",
        "",
    ]
    lines += [f"- {x}" for x in module["functional"]]
    lines += [
        "",
        "Core functional expectations:",
        "",
        f"- The system must provide create, view, update, search, filter, status, and history capabilities for {title_lower} records where applicable.",
        f"- The system must validate mandatory data, business rules, cut-off conditions, policy eligibility, and dependency integrity before finalizing {title_lower} actions.",
        f"- The system must support configurable approval, escalation, correction, cancellation, and reopen behaviors for high-impact {title_lower} transactions where governance requires them.",
        f"- The module must expose reliable outputs to downstream modules, reports, dashboards, and integrations that depend on {title_lower}.",
        "",
        "Business rule themes:",
        "",
        f"- Configuration drives how {title_lower} behaves across companies, geographies, worker types, and operating models.",
        f"- Historical accuracy must be preserved for material {title_lower} changes through timestamps, status history, effective dates, snapshots, or equivalent patterns.",
        f"- Exception handling for {title_lower} must be explicit and traceable rather than silently corrected.",
    ]

    lines += [
        "",
        "# 3. UX",
        "",
        "User experience should provide:",
        "",
    ]
    lines += [f"- {x}" for x in module["screens"]]
    lines += [
        "",
        "Key screens:",
        "",
    ]
    lines += [f"- {x}" for x in module["screens"]]
    lines += [
        "",
        "UX expectations:",
        "",
        f"- Users should understand the current status, next available actions, and ownership boundaries for every important {title_lower} record.",
        f"- Critical validations for {title_lower} should be shown inline and early, not only after full-form submission.",
        f"- Approvers and administrators should be able to review context, comments, exceptions, and history without leaving the {title_lower} workflow.",
        f"- Views related to {title_lower} should support responsive layouts, accessible controls, and keyboard-friendly behavior where web channels are used.",
        "",
        "Design details to refine during implementation:",
        "",
        f"- Empty states, loading states, and permission-denied states for {title_lower} screens",
        f"- Inline help, tooltips, and policy references for complex {title_lower} actions",
        f"- Export, print, or document preview patterns associated with {title_lower}",
    ]

    lines += [
        "",
        "# 4. API",
        "",
        "Representative APIs:",
        "",
    ]
    lines += [f"- `{x}`" for x in module["apis"]]
    lines += [
        "",
        "API expectations:",
        "",
        f"- APIs must enforce role and data-scope validation for {title_lower} operations.",
        f"- APIs should expose explicit status, history, approval, and dependency-aware responses for {title_lower}.",
        f"- Critical {title_lower} APIs should support idempotency, optimistic concurrency, and safe retry behavior.",
        f"- List and search APIs for {title_lower} should support filtering, pagination, sorting, and export-friendly access patterns.",
        "",
        "Integration contract expectations:",
        "",
        f"- Service contracts must make it clear which {title_lower} actions are synchronous, asynchronous, or event-driven.",
        f"- Error payloads must separate validation failures, permission failures, business-rule conflicts, dependency issues, and transient platform errors.",
        f"- High-impact mutation APIs for {title_lower} should include audit-friendly identifiers, timestamps, and actor context in responses or logs.",
    ]

    lines += [
        "",
        "# 5. Database",
        "",
        "Core entities:",
        "",
    ]
    lines += [f"- `{x}`" for x in module["tables"]]
    lines += [
        "",
        "Data model expectations:",
        "",
        f"- The {title_lower} data model should preserve business identifiers, technical identifiers, state metadata, and ownership references.",
        f"- Material {title_lower} changes should be historized through effective dating, status history, snapshots, or immutable result records where appropriate.",
        f"- Referential integrity must prevent destructive change when dependent modules still rely on {title_lower} data.",
        f"- Sensitive fields associated with {title_lower} should support masking, encryption, or restricted access policies where required.",
        "",
        "Database design concerns:",
        "",
        f"- Indexing should support the most common search, dashboard, approval queue, and reporting patterns for {title_lower}.",
        f"- Archival or retention controls for {title_lower} should not break audit traceability.",
        f"- Dynamic or tenant-specific fields for {title_lower} should be modeled without compromising reporting and validation.",
    ]

    lines += [
        "",
        "# 6. Events",
        "",
        "Published events:",
        "",
    ]
    lines += [f"- `{x}`" for x in module["pub"]]
    lines += ["", "Consumed events:", ""]
    lines += [f"- `{x}`" for x in module["con"]]
    lines += [
        "",
        "Event design expectations:",
        "",
        f"- {title} events must carry enough business context for downstream consumers to act without re-querying excessive state whenever practical.",
        f"- Event publication must be reliable, duplicate-safe, and compatible with reprocessing where {title_lower} has regulatory or payroll impact.",
        f"- Event consumers that depend on {title_lower} should handle late-arriving, retried, or out-of-order events gracefully.",
    ]

    lines += [
        "",
        "# 7. Reports",
        "",
        "Standard reports:",
        "",
    ]
    lines += report_descriptions(module)
    lines += [
        "",
        "Reporting expectations:",
        "",
        f"- Reports for {title_lower} should support operational review, historical analysis, and compliance or audit evidence as needed.",
        f"- Report filters should generally support company, location, date range, status, employee scope, and approver or owner scope where applicable.",
    ]

    lines += [
        "",
        "# 8. Dashboards",
        "",
        "Dashboards should show:",
        "",
    ]
    lines += dashboard_descriptions(module)
    lines += [
        "",
        "Dashboard expectations:",
        "",
        f"- Dashboards must highlight pending action, SLA risk, trend movement, and exception hotspots for {title_lower}.",
        f"- Executives and managers should see aggregated {title_lower} indicators, while administrators should have drill-down capability into operational detail.",
    ]

    lines += [
        "",
        "# 9. Security",
        "",
        "Security requirements:",
        "",
    ]
    lines += [f"- {x}" for x in base_specs.COMMON_SECURITY]
    lines += [
        f"- Support approval and override controls for high-impact {title_lower} actions.",
        f"- Restrict export, print, download, or API bulk-read paths for {title_lower} where the module contains sensitive or payroll-impacting information.",
        f"- Support maker-checker, delegation, and segregation-of-duties enforcement where {title_lower} exposes privileged operations.",
    ]

    lines += [
        "",
        "# 10. Audit",
        "",
        "Audit logs must capture:",
        "",
    ]
    lines += [f"- {x}" for x in base_specs.COMMON_AUDIT]
    lines += [
        f"- Capture module-specific changes, approvals, overrides, and exceptions for {title_lower} records.",
        f"- Preserve sufficient evidence to reconstruct end-to-end {title_lower} decisions during internal review, customer escalation, or compliance audit.",
    ]

    lines += [
        "",
        "# 11. AI",
        "",
        "AI opportunities:",
        "",
    ]
    lines += [f"- {x}" for x in module["ai"]]
    lines += [
        "",
        "AI guardrails:",
        "",
        f"- AI output related to {title_lower} must be permission-aware and scoped to authorized data.",
        f"- AI suggestions should remain explainable, reviewable, and non-final for high-risk {title_lower} decisions unless explicitly governed otherwise.",
    ]

    lines += [
        "",
        "# 12. Test Cases",
        "",
        "Representative test cases:",
        "",
    ]
    lines += [f"- {x}" for x in base_specs.COMMON_TESTS]
    lines += [
        f"- Verify positive, negative, boundary, and recovery paths for the most critical {title_lower} workflows.",
        f"- Verify that {title_lower} behaves correctly across role scopes, company scopes, and tenant configuration variations.",
    ]

    lines += [
        "",
        "# 13. Workflows",
        "",
        "Key workflows:",
        "",
    ]
    lines += [f"- {x}" for x in module["workflows"]]
    lines += [
        "",
        "Typical workflow:",
        "",
        "1. A user or system initiates a transaction based on configured rules.",
        "2. The system validates data, permissions, and policy conditions.",
        "3. Approval, notification, and integration steps run where required.",
        "4. Final outcomes are recorded, audited, and exposed to downstream consumers.",
        "",
        "Workflow checkpoints:",
        "",
        f"- Entry validation must reject invalid or incomplete {title_lower} requests before they become operational debt.",
        f"- Mid-workflow status visibility must make it clear who owns the next step in a {title_lower} process.",
        f"- Terminal states must be unambiguous so reports and downstream modules interpret {title_lower} outcomes consistently.",
    ]

    lines += [
        "",
        "# 14. State Machine",
        "",
        "Primary states:",
        "",
    ]
    lines += [f"- {x}" for x in module["states"]]
    lines += [
        "",
        "Illustrative transition path:",
        "",
    ]
    lines += [f"- `{pair}`" for pair in transition_pairs(module["states"])]
    lines += [
        "",
        "State management expectations:",
        "",
        f"- Invalid transitions in {title_lower} must be blocked and clearly explained to the caller or user.",
        f"- Reopen, rollback, or correction behavior for {title_lower} must be explicit and audit-controlled.",
    ]

    lines += [
        "",
        "# 15. Permissions",
        "",
        "Typical roles:",
        "",
    ]
    lines += [f"- {x}" for x in module["roles"]]
    lines += ["", "Role expectations:", ""]
    lines += role_actions(module)

    lines += [
        "",
        "# 16. Notifications",
        "",
        "Notifications should be sent for:",
        "",
    ]
    lines += [f"- {x}" for x in base_specs.COMMON_NOTIFICATIONS]
    lines += [
        f"- Critical cut-off, expiry, approval delay, or exception events affecting {title_lower}.",
        "",
        "Notification expectations:",
        "",
        f"- Channel, urgency, audience, and reminder behavior for {title_lower} should be configurable but governed.",
        f"- Notification content for {title_lower} should expose enough context to act without revealing unnecessary sensitive data.",
    ]

    lines += [
        "",
        "# 17. Configuration",
        "",
        "Configurable items:",
        "",
    ]
    lines += [f"- {x}" for x in module["config"]]
    lines += [
        "",
        "Configuration governance:",
        "",
        f"- Changes to {title_lower} configuration should follow controlled release and approval practices where operational impact is high.",
        f"- Tenant-specific configuration for {title_lower} should not break cross-module reporting, integrations, or auditability.",
    ]

    lines += [
        "",
        "# 18. Edge Cases",
        "",
    ]
    lines += [f"- {x}" for x in module["edge"]]
    lines += [
        "",
        "Handling expectations:",
        "",
        f"- Edge conditions in {title_lower} should be surfaced explicitly to users, support teams, and logs rather than silently ignored.",
        f"- Where auto-recovery is possible for {title_lower}, the system should still preserve traceability of the correction path.",
    ]

    lines += [
        "",
        "# 19. Dependencies",
        "",
    ]
    lines += [f"- {x}" for x in module["deps"]]
    lines += [
        "",
        "Dependency expectations:",
        "",
        f"- Upstream dependencies must provide timely, valid, and scope-consistent inputs to {title_lower}.",
        f"- Downstream consumers of {title_lower} should not rely on undocumented side effects or ambiguous status semantics.",
    ]

    lines += [
        "",
        "# 20. Integrations",
        "",
    ]
    lines += [f"- {x}" for x in module["ints"]]
    lines += [
        "",
        "Integration expectations:",
        "",
        f"- Integration points for {title_lower} must define ownership of source of truth, sync direction, retry behavior, and reconciliation responsibility.",
        f"- Any external dependency affecting {title_lower} should be observable through logs, monitoring, and exception reporting.",
    ]

    lines += [
        "",
        "# 21. Non-Functional Requirements",
        "",
    ]
    lines += [f"- {x}" for x in base_specs.COMMON_NFR]
    lines += [
        f"- {title} should preserve performance under realistic enterprise volume, approval concurrency, and reporting load.",
        f"- Background jobs, imports, or integrations tied to {title_lower} should be restartable and observable without corrupting business state.",
    ]

    lines += [
        "",
        "# 22. Assumptions",
        "",
    ]
    lines += [f"- {x}" for x in base_specs.COMMON_ASSUMPTIONS]
    lines += [
        f"- The detailed field dictionary, event catalog, and error catalog for {title_lower} will continue to evolve under the appendix framework without invalidating this module baseline.",
        "",
    ]
    return "\n".join(lines)


def field_groups(item: dict, kind: str) -> list[str]:
    name = item["name"]
    common = [
        "Identifiers and business codes",
        "Status, timestamps, and effective-date controls",
        "Actor, approver, and ownership references",
        "Audit, comments, and exception context",
    ]
    specific = {
        "processing": ["Input scope and calculation parameters", "Result summary and exception outcomes"],
        "configuration": ["Policy values, thresholds, and defaults", "Versioning and publish metadata"],
        "orchestration": ["Workflow routing rules", "SLA and escalation metadata"],
        "integration": ["External references, correlation IDs, and delivery metadata", "Retry and replay markers"],
        "control": ["Risk flags, evidence references, and policy linkages", "Access scope or consent markers"],
        "experience": ["User-facing display fields", "Task and notification context"],
        "insight": ["Metric dimensions and aggregations", "Calculation lineage and snapshot metadata"],
        "transaction": ["Business inputs", "Approval and completion metadata"],
    }
    return common + specific.get(kind, []) + [f"Module-specific attributes required for {name.lower()}"]


def submodule_markdown(item: dict, seq: int) -> str:
    name = item["name"]
    parent = item["parent_title"]
    kind = expansion.classification(name, parent)
    pub, con = expansion.generated_events(item["slug"])
    states = expansion.generated_states(name, kind)
    roles = expansion.generated_roles(kind)
    screens = expansion.generated_screens(name, kind)
    tables = expansion.generated_tables(item["slug"])
    integrations = expansion.generated_integrations(name, parent, kind)
    edge_cases = expansion.generated_edge_cases(name, parent, kind)
    api_base = f"/api/v1/{item['parent_slug']}/{item['slug']}"
    fields = field_groups(item, kind)

    lines = [
        "---",
        f"id: HRMS-SUB-{item['parent_num']}-{seq:02d}",
        f"title: {name} Specification",
        f"document: {seq:02d}-{item['slug']}.md",
        "version: 1.1",
        "status: Draft",
        "---",
        "",
        "# 1. Purpose and Scope",
        "",
        f"{name} is a critical sub-module within {parent}. This specification defines the business intent, operating model, system behavior, control requirements, data expectations, and implementation cues needed to build {name.lower()} with enterprise-grade rigor.",
        "",
        "In scope:",
        "",
        f"- End-to-end lifecycle of {name.lower()} within {parent.lower()}",
        f"- Screen behavior, validations, state management, and approval treatment for {name.lower()}",
        f"- API, data, event, audit, report, notification, and QA expectations for {name.lower()}",
        "",
        "# 2. Business Context",
        "",
        f"{name} exists to make {parent.lower()} reliable at a finer level of operational detail. If {name.lower()} is underspecified, the parent module may still look complete on paper while failing in day-to-day enterprise execution.",
        "",
        "Business outcomes:",
        "",
        f"- Standardize how {name.lower()} is handled across tenants, companies, and operating scenarios",
        f"- Reduce manual interpretation, workaround behavior, and hidden policy exceptions around {name.lower()}",
        f"- Improve auditability, downstream consistency, and supportability for {name.lower()}",
        "",
        "# 3. Actors and Responsibilities",
        "",
        "Primary roles:",
        "",
    ]
    lines += [f"- {role}" for role in roles]
    lines += [
        "",
        "Responsibility expectations:",
        "",
        f"- Business users own the policy intent of {name.lower()}",
        f"- Designers own the clarity of user flows, states, and validations for {name.lower()}",
        f"- Engineers own the service, data, event, and reliability design for {name.lower()}",
        f"- QA owns the validation of positive, negative, boundary, and regression scenarios for {name.lower()}",
        "",
        "# 4. Functional Behavior",
        "",
        "The system shall support:",
        "",
        f"- Creation, maintenance, review, and controlled completion of {name.lower()} records",
        f"- Policy validation, data completeness checks, and dependency checks before committing {name.lower()} changes",
        f"- Workflow-driven handling of approvals, escalations, cancellations, or corrections where required",
        f"- Operational visibility into status, backlog, errors, and ownership for {name.lower()}",
        "",
        "Detailed functional considerations:",
        "",
        f"- Who can initiate {name.lower()} and under what business conditions",
        f"- Which data elements are mandatory, derived, optional, or locked in different {name.lower()} states",
        f"- Which dependent modules must be consulted before {name.lower()} can move forward",
        f"- Which outputs from {name.lower()} become inputs into reporting, payroll, compliance, analytics, or workflow services",
        "",
        "# 5. Data and Field Design",
        "",
        "Typical field groups:",
        "",
    ]
    lines += [f"- {field}" for field in fields]
    lines += [
        "",
        "Core entities:",
        "",
    ]
    lines += [f"- `{table}`" for table in tables]
    lines += [
        "",
        "Data expectations:",
        "",
        f"- Every significant {name.lower()} change should be traceable through status and history records.",
        f"- Effective dating, retroactivity, and correction behavior for {name.lower()} must be explicit if the parent module supports historical accuracy.",
        f"- Sensitive values associated with {name.lower()} must inherit the correct masking, encryption, retention, and export controls.",
        "",
        "# 6. UX and Interaction Model",
        "",
        "Primary screens or views:",
        "",
    ]
    lines += [f"- {screen}" for screen in screens]
    lines += [
        "",
        "Interaction expectations:",
        "",
        f"- Users must understand current {name.lower()} status, blocking issues, and next actions without opening multiple screens.",
        f"- Validation messages for {name.lower()} should be precise enough to support correction without support-team escalation where possible.",
        f"- Approvers should see comments, prior changes, dependency warnings, and relevant attachments or references before deciding on {name.lower()}.",
        "",
        "# 7. API and Service Contracts",
        "",
        "Representative APIs:",
        "",
        f"- `POST {api_base}`",
        f"- `GET {api_base}/{{id}}`",
        f"- `PUT {api_base}/{{id}}`",
        f"- `POST {api_base}/{{id}}/actions`",
        f"- `GET {api_base}/{{id}}/history`",
        "",
        "API expectations:",
        "",
        f"- APIs must enforce permission and data-scope checks for {name.lower()}.",
        f"- APIs should clearly distinguish validation, business-rule, dependency, and technical failures for {name.lower()}.",
        f"- Bulk or background processing APIs related to {name.lower()} should be idempotent, monitorable, and restart-safe.",
        "",
        "# 8. Workflow and Business Rules",
        "",
        "Rules and decision points to govern:",
        "",
        f"- Entry conditions and eligibility for {name.lower()}",
        f"- Approval routing, escalation, and reassignment rules for {name.lower()}",
        f"- Cut-off, retroactivity, reopen, or correction behavior for {name.lower()}",
        f"- Exception resolution and override controls for {name.lower()}",
        "",
        "Typical workflow:",
        "",
        "1. Initiator creates or triggers the sub-module action.",
        "2. System validates policy, data, status, and dependencies.",
        "3. Approval, notification, or integration steps run if required.",
        "4. Final outcome is recorded, audited, and published to consumers.",
        "",
        "# 9. State Machine",
        "",
        "Primary states:",
        "",
    ]
    lines += [f"- {state}" for state in states]
    lines += [
        "",
        "State expectations:",
        "",
        f"- Every state transition for {name.lower()} must be explicit and explainable.",
        f"- Invalid transitions and race conditions affecting {name.lower()} must be blocked and logged.",
        f"- Reopen or rollback behavior for {name.lower()} should be controlled and auditable.",
        "",
        "# 10. Events and Notifications",
        "",
        "Published events:",
        "",
    ]
    lines += [f"- `{event}`" for event in pub]
    lines += ["", "Consumed events:", ""]
    lines += [f"- `{event}`" for event in con]
    lines += [
        "",
        "Notifications should be sent for:",
        "",
        f"- Creation or submission of {name.lower()}",
        f"- Approval, rejection, escalation, or completion of {name.lower()}",
        f"- Exceptions, expiry, dependency failure, or cut-off risk affecting {name.lower()}",
        "",
        "# 11. Reports and Dashboards",
        "",
        "Required visibility:",
        "",
        f"- Operational queue and aging for {name.lower()}",
        f"- Exception and failure trend reporting for {name.lower()}",
        f"- Throughput, status distribution, and turnaround metrics for {name.lower()}",
        "",
        "# 12. Security, Permissions, and Audit",
        "",
        "Security and control requirements:",
        "",
        f"- Restrict create, edit, approve, override, and export actions for {name.lower()} by role and data scope.",
        f"- Apply maker-checker, segregation-of-duties, or dual-control rules where {name.lower()} affects compliance, payroll, access, or legal outcomes.",
        f"- Mask or protect sensitive values tied to {name.lower()} in UI, API, export, and report channels.",
        "",
        "Audit requirements:",
        "",
        f"- Capture before-and-after values for material changes in {name.lower()}.",
        f"- Capture actor identity, timestamps, comments, source channel, and correlation references for {name.lower()} decisions.",
        f"- Retain evidence needed to reconstruct the lifecycle of {name.lower()} during audit or support review.",
        "",
        "# 13. Configuration",
        "",
        "Configurable items:",
        "",
        f"- Policy rules and enablement switches for {name.lower()}",
        f"- Approval, SLA, reminder, escalation, and retry settings affecting {name.lower()}",
        f"- Validation thresholds, cut-off settings, and exception tolerance for {name.lower()}",
        "",
        "# 14. Edge Cases and Exception Handling",
        "",
    ]
    lines += [f"- {edge}" for edge in edge_cases]
    lines += [
        "",
        "Handling expectations:",
        "",
        f"- The system should never silently bypass critical {name.lower()} exceptions.",
        f"- Auto-recovery, if supported, must still leave a complete trace of what happened to {name.lower()}.",
        "",
        "# 15. Test Scenarios",
        "",
        "Representative test scenarios:",
        "",
        f"- Happy-path creation and completion of {name.lower()}",
        f"- Validation failure due to missing or invalid business data for {name.lower()}",
        f"- Permission failure for unauthorized access to {name.lower()}",
        f"- Approval, rejection, escalation, and reopen scenarios for {name.lower()}",
        f"- Event, notification, audit, and integration verification for {name.lower()} transitions",
        "",
        "# 16. Dependencies and Integrations",
        "",
        "Dependencies:",
        "",
        f"- Parent module: {parent}",
        "- Permission and role model",
        "- Workflow and approval framework",
        "- Notification framework",
        "- Audit and logging services",
        "",
        "Integrations:",
        "",
    ]
    lines += [f"- {integration}" for integration in integrations]
    lines += [
        "",
        "# 17. Assumptions",
        "",
        f"- {name} may vary by tenant, geography, policy, and worker type without changing the core control model described here.",
        f"- Downstream consumers of {name.lower()} will rely on governed APIs, events, reports, or snapshots rather than undocumented side effects.",
        f"- Detailed field dictionaries and API payload schemas for {name.lower()} can continue to evolve in appendices without invalidating this sub-module baseline.",
        "",
    ]
    return "\n".join(lines)


def journey_markdown(journey: dict) -> str:
    actor = journey["actor"]
    actor_lower = actor.lower()
    modules_sentence = words_to_sentence(journey["modules"][:4])
    lines = [
        "---",
        f"id: HRMS-JNY-{journey['num']}",
        f"title: {journey['title']}",
        f"document: {journey['num']}-{journey['slug']}.md",
        "version: 1.1",
        "status: Draft",
        "---",
        "",
        "# 1. Persona Context",
        "",
        f"This journey document describes how the `{actor}` experiences and uses the Enterprise HRMS application across multiple modules. The journey is especially shaped by {modules_sentence} and related downstream interactions.",
        "",
        "Primary goals:",
        "",
    ]
    lines += [f"- {goal}" for goal in journey["goals"]]
    lines += [
        "",
        "# 2. Primary Module Touchpoints",
        "",
    ]
    lines += [f"- {module}" for module in journey["modules"]]
    lines += [
        "",
        "# 3. Journey Stages",
        "",
        "Typical stages:",
        "",
        "- Entry and authentication",
        "- Task discovery and navigation",
        "- Transaction execution or review",
        "- Approval, exception, or collaboration handling",
        "- Completion, evidence, and follow-up",
        "",
        "Stage expectations:",
        "",
        f"- The {actor_lower} should have a clear starting point that surfaces only relevant pending actions.",
        f"- The {actor_lower} should understand status, ownership, cut-offs, and next steps during every major transaction.",
        f"- The {actor_lower} should be able to resume interrupted work without losing history or confidence.",
        "",
        "# 4. Experience Expectations",
        "",
        f"- The {actor_lower} should see only relevant tasks, approvals, and data.",
        f"- The {actor_lower} should be guided by clear statuses, deadlines, and notifications.",
        f"- The {actor_lower} should be able to recover from validation errors and interrupted flows.",
        f"- The {actor_lower} should not need to understand internal module boundaries to complete normal work successfully.",
        "",
        "# 5. Risks and Failure Points",
        "",
        f"- Missing permissions or scope may block {actor_lower} actions.",
        f"- Unclear state or approval ownership may delay {actor_lower} workflows.",
        f"- Cross-module inconsistency may confuse {actor_lower} and reduce adoption.",
        f"- Notification failure, stale dashboards, or late integrations may erode trust in the {actor_lower} experience.",
        "",
        "# 6. Reporting and Monitoring",
        "",
        f"- Dashboards for {actor_lower} should show pending actions, status visibility, and trend indicators.",
        f"- Audit and support teams should be able to reconstruct the {actor_lower} journey when issues occur.",
        f"- Product teams should measure adoption, abandonment, turnaround time, and satisfaction for the {actor_lower} journey.",
        "",
        "# 7. Design and Engineering Implications",
        "",
        "- UX should optimize for role-specific entry points and minimal cognitive load.",
        "- APIs and permissions should be aligned to role-specific actions and data boundaries.",
        "- QA should verify the journey across module boundaries, not only within isolated features.",
        "- Support tooling should be able to trace which system state, notification, or dependency interrupted the journey.",
        "",
    ]
    return "\n".join(lines)


def xcut_markdown(item: dict) -> str:
    lines = [
        "---",
        f"id: HRMS-XCUT-{item['num']}",
        f"title: {item['title']}",
        f"document: {item['num']}-{item['slug']}.md",
        "version: 1.1",
        "status: Draft",
        "---",
        "",
        "# 1. Purpose",
        "",
        f"This document defines the shared enterprise standard for `{item['title']}` across the Enterprise HRMS platform. It exists so that teams do not reinterpret the same foundational concern differently from module to module.",
        "",
        "# 2. Scope",
        "",
    ]
    lines += [f"- {scope}" for scope in item["scope"]]
    lines += [
        "",
        "# 3. Design Principles",
        "",
        "- Centralize reusable behavior instead of duplicating it in module-specific documents.",
        "- Preserve tenant configurability without weakening governance or traceability.",
        "- Make standards explicit enough for product, design, engineering, QA, implementation, and audit teams to use consistently.",
        "- Treat exceptions to the standard as deliberate governance decisions, not accidental drift.",
        "",
        "# 4. Mandatory Controls",
        "",
        "- Define ownership of the standard.",
        "- Define where configuration is allowed and where it is prohibited.",
        "- Define auditability expectations and operational evidence.",
        "- Define failure, exception, fallback, and recovery behavior.",
        "- Define how the standard should be tested and monitored.",
        "",
        "# 5. Implementation Guidance",
        "",
        "- Each module must reference this standard where the behavior applies.",
        "- Exceptions to the standard must be explicitly approved and documented.",
        "- Engineering and QA artifacts should trace back to the relevant sections of this standard.",
        "- Implementation teams should know which configuration steps are mandatory before go-live.",
        "",
        "# 6. Governance and Review",
        "",
        "- Updates to this standard should trigger review of dependent modules and sub-modules.",
        "- Material updates should be versioned and announced to design, engineering, QA, implementation, and support stakeholders.",
        "- High-risk parts of the standard should be included in periodic control reviews.",
        "",
        "# 7. Validation Expectations",
        "",
        "- Unit, integration, and end-to-end tests should cover the standard where it affects runtime behavior.",
        "- Security and audit reviews should verify the standard for high-risk areas.",
        "- Documentation updates to this standard should trigger downstream review of dependent modules.",
        "",
    ]
    return "\n".join(lines)


def appendix_markdown(num: str, slug: str, title: str) -> str:
    lines = [
        "---",
        f"id: HRMS-APP-{num}",
        f"title: {title}",
        f"document: {num}-{slug}.md",
        "version: 1.1",
        "status: Draft",
        "---",
        "",
        "# 1. Purpose",
        "",
        f"This appendix provides the framework for `{title}` within the Enterprise HRMS documentation library.",
        "",
        "# 2. Intended Use",
        "",
        "- Support cross-document consistency and traceability.",
        "- Provide a single place to collect repeated enterprise reference information.",
        "- Help business, design, engineering, QA, implementation, and support teams navigate shared concepts quickly.",
        "",
        "# 3. Structure Guidance",
        "",
        "- Maintain stable identifiers where the appendix becomes system-critical.",
        "- Group entries by module and sub-module where practical.",
        "- Preserve revision history for any appendix that affects implementation or compliance.",
        "- Distinguish canonical values from implementation-specific examples or local overrides.",
        "",
        "# 4. Population Strategy",
        "",
        "- Start with the highest-risk and highest-volume areas.",
        "- Expand iteratively as module and sub-module specs mature.",
        "- Avoid duplicating information that already has a canonical source elsewhere in the library.",
        "",
        "# 5. Suggested Columns or Sections",
        "",
        "- Stable identifier",
        "- Module and sub-module ownership",
        "- Business description",
        "- Technical representation",
        "- State, lifecycle, or applicability notes",
        "- Security, audit, or reporting implications",
        "",
    ]
    return "\n".join(lines)


def write_modules() -> None:
    for module in base_specs.MODULES:
        path = MODULE_BASE / f"{module['num']}-{module['slug']}.md"
        path.write_text(module_markdown(module), encoding="utf-8")


def write_submodules() -> None:
    items = expansion.parse_l3_catalog()
    grouped: dict[tuple[str, str, str], list[dict]] = {}
    for item in items:
        key = (item["parent_num"], item["parent_title"], item["parent_slug"])
        grouped.setdefault(key, []).append(item)

    for (num, parent_title, parent_slug), group in grouped.items():
        folder = SUBMODULE_BASE / f"{num}-{parent_slug}"
        for idx, item in enumerate(group, start=1):
            path = folder / f"{idx:02d}-{item['slug']}.md"
            path.write_text(submodule_markdown(item, idx), encoding="utf-8")


def write_journeys() -> None:
    for journey in expansion.JOURNEYS:
        path = JOURNEY_BASE / f"{journey['num']}-{journey['slug']}.md"
        path.write_text(journey_markdown(journey), encoding="utf-8")


def write_cross_cutting() -> None:
    for item in expansion.CROSS_CUTTING:
        path = XCUT_BASE / f"{item['num']}-{item['slug']}.md"
        path.write_text(xcut_markdown(item), encoding="utf-8")


def write_appendices() -> None:
    for num, slug, title in expansion.APPENDICES:
        path = APPENDIX_BASE / f"{num}-{slug}.md"
        path.write_text(appendix_markdown(num, slug, title), encoding="utf-8")


def main() -> None:
    write_modules()
    write_submodules()
    write_journeys()
    write_cross_cutting()
    write_appendices()
    print("Enriched parent modules, deep sub-modules, journeys, cross-cutting specs, and appendices.")


if __name__ == "__main__":
    main()
