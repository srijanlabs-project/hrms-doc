from __future__ import annotations

import re
from pathlib import Path


DOCS = Path(r"D:/HRMS-doc/docs")
CATALOG = DOCS / "04-submodule-catalog" / "01-submodule-catalog.md"


JOURNEYS = [
    {
        "num": "01",
        "slug": "employee-journey",
        "title": "Employee Journey",
        "actor": "Employee",
        "goals": [
            "Complete personal and employment tasks with minimal HR dependency",
            "Access profile, attendance, leave, payslips, documents, benefits, and requests",
            "Receive clear status visibility and timely notifications",
        ],
        "modules": [
            "People Management",
            "Employee Self Service",
            "Workforce Management",
            "Leave Management",
            "Payroll",
            "Document Management",
            "Travel Management",
            "Expense Management",
            "Helpdesk and Case Management",
        ],
    },
    {
        "num": "02",
        "slug": "manager-journey",
        "title": "Manager Journey",
        "actor": "Manager",
        "goals": [
            "Approve and monitor team actions efficiently",
            "Manage team performance, leave, attendance, and people changes",
            "Use dashboards to make timely people decisions",
        ],
        "modules": [
            "Manager Self Service",
            "People Management",
            "Performance Management",
            "Recruitment and ATS",
            "Workforce Management",
            "Leave Management",
            "Analytics and BI",
        ],
    },
    {
        "num": "03",
        "slug": "recruiter-journey",
        "title": "Recruiter Journey",
        "actor": "Recruiter",
        "goals": [
            "Move candidates efficiently from requisition to hire",
            "Coordinate hiring managers, interviewers, and offer workflows",
            "Track conversion, sourcing performance, and hiring SLAs",
        ],
        "modules": [
            "Recruitment and ATS",
            "Manager Self Service",
            "People Management",
            "Communication Platform",
            "Analytics and BI",
        ],
    },
    {
        "num": "04",
        "slug": "hr-operations-journey",
        "title": "HR Operations Journey",
        "actor": "HR Operations User",
        "goals": [
            "Maintain accurate employee and organization records",
            "Administer lifecycle changes, documents, and workflows",
            "Keep operations compliant, auditable, and timely",
        ],
        "modules": [
            "Organization Management",
            "People Management",
            "Document Management",
            "Employee Self Service",
            "Manager Self Service",
            "Helpdesk and Case Management",
            "Security and Governance",
        ],
    },
    {
        "num": "05",
        "slug": "payroll-admin-journey",
        "title": "Payroll Administrator Journey",
        "actor": "Payroll Administrator",
        "goals": [
            "Run payroll accurately and on time",
            "Resolve data issues before payroll close",
            "Maintain statutory readiness and secure access to compensation data",
        ],
        "modules": [
            "Payroll",
            "People Management",
            "Workforce Management",
            "Leave Management",
            "Statutory and Compliance",
            "Compensation and Benefits",
            "Analytics and BI",
        ],
    },
    {
        "num": "06",
        "slug": "finance-approver-journey",
        "title": "Finance Approver Journey",
        "actor": "Finance Approver",
        "goals": [
            "Approve financially sensitive requests and payouts",
            "Monitor payroll, expense, and travel controls",
            "Ensure budget and reimbursement governance",
        ],
        "modules": [
            "Payroll",
            "Expense Management",
            "Travel Management",
            "Compensation and Benefits",
            "Manager Self Service",
            "Analytics and BI",
        ],
    },
    {
        "num": "07",
        "slug": "compliance-officer-journey",
        "title": "Compliance Officer Journey",
        "actor": "Compliance Officer",
        "goals": [
            "Track regulatory obligations and evidence",
            "Review access, consent, retention, and statutory controls",
            "Support internal and external audits with traceable records",
        ],
        "modules": [
            "Statutory and Compliance",
            "Security and Governance",
            "Document Management",
            "Payroll",
            "Health Safety and Wellness",
            "Analytics and BI",
        ],
    },
    {
        "num": "08",
        "slug": "system-admin-journey",
        "title": "System Administrator Journey",
        "actor": "System Administrator",
        "goals": [
            "Configure tenants, access, workflows, and integrations safely",
            "Keep the platform healthy and observable",
            "Support controlled rollout and change management",
        ],
        "modules": [
            "Foundation and Platform",
            "Identity and Access",
            "Administration",
            "Integration Platform",
            "Security and Governance",
            "DevOps and Operations",
        ],
    },
    {
        "num": "09",
        "slug": "leadership-journey",
        "title": "Leadership Journey",
        "actor": "Leadership User",
        "goals": [
            "Review workforce health, cost, risk, and performance trends",
            "Track talent readiness and attrition risk",
            "Use dashboards and summaries instead of operational screens",
        ],
        "modules": [
            "Analytics and BI",
            "Talent Management",
            "Performance Management",
            "Compensation and Benefits",
            "Employee Experience",
            "AI and Copilot",
        ],
    },
    {
        "num": "10",
        "slug": "support-agent-journey",
        "title": "Support and Service Agent Journey",
        "actor": "Support Agent",
        "goals": [
            "Resolve employee and admin issues quickly",
            "Use case history, knowledge, and diagnostics effectively",
            "Escalate correctly and preserve SLA performance",
        ],
        "modules": [
            "Helpdesk and Case Management",
            "Communication Platform",
            "Identity and Access",
            "People Management",
            "DevOps and Operations",
        ],
    },
]


CROSS_CUTTING = [
    {
        "num": "01",
        "slug": "permission-role-model",
        "title": "Permission and Role Model",
        "scope": [
            "Role hierarchy and assignment",
            "Data-scope rules and visibility boundaries",
            "Delegation, maker-checker, and segregation-of-duties controls",
            "Review and audit requirements for privileged access",
        ],
    },
    {
        "num": "02",
        "slug": "workflow-approval-framework",
        "title": "Workflow and Approval Framework",
        "scope": [
            "Workflow definition structure",
            "Approval routing and escalation",
            "SLA rules, reminders, and reassignment",
            "Workflow auditability and exception recovery",
        ],
    },
    {
        "num": "03",
        "slug": "notification-framework",
        "title": "Notification Framework",
        "scope": [
            "Notification taxonomy and trigger model",
            "Templates, localization, and audience targeting",
            "Channel rules for email, SMS, push, and messaging apps",
            "Delivery tracking, retries, and failure handling",
        ],
    },
    {
        "num": "04",
        "slug": "api-integration-standards",
        "title": "API and Integration Standards",
        "scope": [
            "API conventions, versioning, and pagination",
            "Idempotency, retries, and error handling",
            "Webhook and event contract guidance",
            "Integration authentication and observability",
        ],
    },
    {
        "num": "05",
        "slug": "data-model-and-effective-dating",
        "title": "Data Model and Effective-Dating Standards",
        "scope": [
            "Master and transaction entity patterns",
            "Effective dating, status history, and immutability rules",
            "Reference data, business keys, and dynamic fields",
            "Retention, archival, and audit-aware storage conventions",
        ],
    },
    {
        "num": "06",
        "slug": "audit-security-ai-governance",
        "title": "Audit, Security, and AI Governance",
        "scope": [
            "Audit event standards and evidence capture",
            "Security controls, masking, encryption, and consent",
            "AI explainability, guardrails, and human review",
            "Governance checkpoints for high-risk operations",
        ],
    },
    {
        "num": "07",
        "slug": "reporting-dashboard-testing-framework",
        "title": "Reporting, Dashboard, and Testing Framework",
        "scope": [
            "Report and dashboard design expectations",
            "KPI ownership and calculation governance",
            "Functional, regression, performance, security, and accessibility coverage",
            "Traceability from requirement to validation",
        ],
    },
]


APPENDICES = [
    ("01", "glossary-and-terminology", "Glossary and Terminology"),
    ("02", "state-machine-index", "State Machine Index Framework"),
    ("03", "notification-catalog-framework", "Notification Catalog Framework"),
    ("04", "report-dashboard-inventory-framework", "Report and Dashboard Inventory Framework"),
    ("05", "event-catalog-framework", "Event Catalog Framework"),
    ("06", "data-field-dictionary-framework", "Data and Field Dictionary Framework"),
]


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def title_from_heading(raw: str) -> tuple[str, str]:
    match = re.match(r"(\d{2})\.\s+(.*)", raw.strip())
    if not match:
        raise ValueError(f"Unexpected heading format: {raw}")
    return match.group(1), match.group(2).strip()


def parse_l3_catalog() -> list[dict]:
    current = None
    items: list[dict] = []
    for line in CATALOG.read_text(encoding="utf-8").splitlines():
        if line.startswith("## "):
            current = line[3:].strip()
            continue
        match = re.match(r"-\s+(.+?)\s+-\s+`(L[123])`", line.strip())
        if match and current and match.group(2) == "L3":
            num, parent = title_from_heading(current)
            items.append(
                {
                    "parent_num": num,
                    "parent_title": parent,
                    "parent_slug": slugify(parent),
                    "name": match.group(1).strip(),
                    "slug": slugify(match.group(1).strip()),
                }
            )
    return items


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def classification(name: str, parent: str) -> str:
    value = f"{name} {parent}".lower()
    if any(k in value for k in ["workflow", "approval", "engine", "framework", "rules"]):
        return "orchestration"
    if any(k in value for k in ["calendar", "policy", "accrual", "retention", "settings", "localization"]):
        return "configuration"
    if any(k in value for k in ["portal", "dashboard", "copilot", "experience", "survey"]):
        return "experience"
    if any(k in value for k in ["integration", "event", "api", "webhook", "biometric", "bank", "oauth", "sso", "mfa"]):
        return "integration"
    if any(k in value for k in ["payroll", "settlement", "processing", "reconciliation", "compensation", "benefits"]):
        return "processing"
    if any(k in value for k in ["role", "permission", "audit", "security", "consent", "access"]):
        return "control"
    if any(k in value for k in ["report", "analytics", "prediction", "querying", "catalog"]):
        return "insight"
    return "transaction"


def generated_roles(kind: str) -> list[str]:
    base = {
        "orchestration": ["Platform Admin", "Tenant Admin", "Process Owner", "Auditor"],
        "configuration": ["Config Admin", "Tenant Admin", "Implementation Lead", "Auditor"],
        "experience": ["End User", "Manager", "HR Operations", "Support Agent"],
        "integration": ["Integration Admin", "Solution Architect", "Operations Engineer", "Auditor"],
        "processing": ["Operations Admin", "Approver", "Finance or HR Specialist", "Auditor"],
        "control": ["Security Admin", "Compliance Officer", "Auditor", "Tenant Admin"],
        "insight": ["Analytics Admin", "Business Analyst", "Manager", "Executive Viewer"],
        "transaction": ["Employee", "Manager", "Operations Admin", "Auditor"],
    }
    return base[kind]


def generated_states(name: str, kind: str) -> list[str]:
    value = name.lower()
    if "approval" in value or "request" in value or "offer" in value:
        return ["Draft", "Submitted", "Pending Approval", "Approved", "Rejected", "Completed"]
    if kind == "orchestration":
        return ["Draft", "Configured", "Published", "Active", "Suspended", "Retired"]
    if kind == "configuration":
        return ["Draft", "Configured", "Approved", "Active", "Deprecated"]
    if kind == "processing":
        return ["Open", "Validated", "In Progress", "Completed", "Closed", "Reopened"]
    if kind == "control":
        return ["Draft", "Under Review", "Active", "Exception", "Closed"]
    return ["Draft", "Active", "On Hold", "Completed", "Closed"]


def generated_screens(name: str, kind: str) -> list[str]:
    base = [f"{name} workspace", f"{name} detail view", f"{name} monitoring screen"]
    if kind in {"orchestration", "configuration"}:
        base.append(f"{name} administration console")
    elif kind == "experience":
        base.append(f"{name} self-service screen")
    elif kind == "processing":
        base.append(f"{name} processing dashboard")
    else:
        base.append(f"{name} audit and diagnostics screen")
    return base


def generated_integrations(name: str, parent: str, kind: str) -> list[str]:
    values = [f"{parent} parent module services", "Notification framework", "Audit and logging services"]
    if kind == "integration":
        values += ["Identity and access controls", "External provider endpoints", "Observability and retry framework"]
    elif kind == "processing":
        values += ["Reporting and analytics", "Workflow and approval services", "Finance or payroll downstream consumers"]
    elif kind == "control":
        values += ["Identity and access controls", "Retention and evidence services", "Reporting and analytics"]
    else:
        values += ["Workflow and approval services", "Reporting and analytics"]
    return values


def generated_edge_cases(name: str, parent: str, kind: str) -> list[str]:
    return [
        f"{name} triggered with incomplete upstream data from {parent}",
        f"Future-dated or retroactive changes affecting {name.lower()} behavior",
        f"Permission conflict during high-impact {name.lower()} action",
        f"Duplicate or replayed transaction affecting {name.lower()} processing",
    ]


def generated_events(slug: str) -> tuple[list[str], list[str]]:
    pub = [f"{slug}.created", f"{slug}.updated", f"{slug}.completed"]
    con = [f"{slug}.validation.requested", "workflow.approval.completed", "notification.delivery.failed"]
    return pub, con


def generated_tables(slug: str) -> list[str]:
    root = slug.replace("-", "_")
    return [
        root,
        f"{root}_rule",
        f"{root}_transaction",
        f"{root}_status_history",
        f"{root}_audit_snapshot",
    ]


def submodule_markdown(item: dict, seq: int) -> str:
    name = item["name"]
    parent = item["parent_title"]
    kind = classification(name, parent)
    pub, con = generated_events(item["slug"])
    states = generated_states(name, kind)
    roles = generated_roles(kind)
    screens = generated_screens(name, kind)
    tables = generated_tables(item["slug"])
    integrations = generated_integrations(name, parent, kind)
    edge_cases = generated_edge_cases(name, parent, kind)
    api_base = f"/api/v1/{item['parent_slug']}/{item['slug']}"

    lines = [
        "---",
        f"id: HRMS-SUB-{item['parent_num']}-{seq:02d}",
        f"title: {name} Specification",
        f"document: {seq:02d}-{item['slug']}.md",
        "version: 1.0",
        "status: Draft",
        "---",
        "",
        "# 1. Purpose and Scope",
        "",
        f"{name} is a critical sub-module within {parent}. This specification defines the business intent, system behavior, controls, data expectations, and engineering concerns needed to implement {name.lower()} in an enterprise-grade HRMS environment.",
        "",
        "Scope includes:",
        "",
        f"- Core business behavior for {name.lower()}",
        f"- User and admin interactions linked to {name.lower()}",
        f"- Workflow, state, notification, and audit treatment for {name.lower()}",
        f"- API, data, event, integration, reporting, and QA expectations for {name.lower()}",
        "",
        "# 2. Business Context",
        "",
        f"{name} exists to ensure that {parent.lower()} operations can be executed consistently, securely, and with full traceability. In a real enterprise setting, this sub-module must support multiple actors, configurable policies, exception handling, and reliable downstream consumption.",
        "",
        "Business outcomes:",
        "",
        f"- Standardize how {name.lower()} is executed across companies and geographies",
        f"- Reduce manual intervention and ambiguity around {name.lower()}",
        f"- Improve compliance, operational control, and auditability for {name.lower()}",
        f"- Provide structured outputs that can be consumed by adjacent modules and analytics",
        "",
        "# 3. Stakeholders and Actors",
        "",
        "Primary roles:",
        "",
    ]
    lines += [f"- {role}" for role in roles]
    lines += [
        "",
        "Stakeholder expectations:",
        "",
        f"- Business and HR teams need clear rules and ownership for {name.lower()}",
        f"- Designers need explicit flows, state changes, validations, and edge cases for {name.lower()}",
        f"- Engineers need stable APIs, data contracts, and event expectations for {name.lower()}",
        f"- QA teams need deterministic scenarios, negative tests, and permission-aware behavior for {name.lower()}",
        "",
        "# 4. Functional Requirements",
        "",
        f"The system shall support the end-to-end lifecycle of {name.lower()} within the context of {parent}.",
        "",
        "Detailed requirements:",
        "",
        f"- Create, view, update, and govern {name.lower()} records according to tenant policy",
        f"- Validate business rules, mandatory fields, dependencies, and cut-off conditions relevant to {name.lower()}",
        f"- Route approvals, notifications, and escalations for high-impact {name.lower()} actions when configured",
        f"- Maintain status history, effective dates, and audit evidence for {name.lower()} transactions",
        f"- Surface exceptions, conflicts, and dependency issues before finalizing {name.lower()} outcomes",
        "",
        "# 5. Business Rules and Validation Logic",
        "",
        "Rules to define and document during implementation:",
        "",
        f"- Eligibility conditions for who can create or act on {name.lower()}",
        f"- Validation rules for mandatory data, date logic, and dependency integrity in {name.lower()}",
        f"- Approval thresholds, reviewer selection, and escalation conditions for {name.lower()}",
        f"- Effective-dating, cut-off, and retroactivity rules affecting {name.lower()} behavior",
        f"- Duplicate detection, replay prevention, and conflict resolution for {name.lower()}",
        "",
        "# 6. UX and Interaction Design",
        "",
        "User experience should provide:",
        "",
    ]
    lines += [f"- {screen}" for screen in screens]
    lines += [
        "",
        "UX design expectations:",
        "",
        f"- Clear status visibility and actionability for {name.lower()} records",
        f"- Contextual validations and inline guidance during {name.lower()} actions",
        f"- Filterable history, comments, and approval context where {name.lower()} is workflow-driven",
        f"- Accessible and mobile-aware behavior where end-user interaction with {name.lower()} is required",
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
        f"- APIs must enforce permission and data-scope checks for {name.lower()}",
        f"- APIs must support validation-first and commit flows where {name.lower()} has high business impact",
        f"- APIs should expose status, approval, and audit-aware responses for {name.lower()}",
        f"- Error responses must distinguish validation failures, dependency conflicts, permission failures, and transient service issues",
        "",
        "# 8. Data Model",
        "",
        "Core entities:",
        "",
    ]
    lines += [f"- `{table}`" for table in tables]
    lines += [
        "",
        "Data considerations:",
        "",
        f"- {name} should preserve both business identifiers and technical identifiers where applicable",
        f"- Status changes, approver actions, and material edits to {name.lower()} must be historized",
        f"- Referential integrity must prevent destructive changes when downstream records depend on {name.lower()}",
        f"- Sensitive fields linked to {name.lower()} must support masking, encryption, or restricted access where required",
        "",
        "# 9. Events",
        "",
        "Published events:",
        "",
    ]
    lines += [f"- `{event}`" for event in pub]
    lines += ["", "Consumed events:", ""]
    lines += [f"- `{event}`" for event in con]
    lines += [
        "",
        "Event expectations:",
        "",
        f"- Event payloads must include identifiers, status, timestamps, actor context, and business scope for {name.lower()}",
        f"- Consumers of {name.lower()} events must be able to handle retries and duplicate delivery safely",
        "",
        "# 10. Reports and Dashboards",
        "",
        "Reports:",
        "",
        f"- {name} activity report",
        f"- {name} exception report",
        f"- {name} aging or backlog report",
        "",
        "Dashboards:",
        "",
        f"- Open {name.lower()} items by status",
        f"- SLA or turnaround visibility for {name.lower()}",
        f"- Volume, trend, and exception indicators for {name.lower()}",
        "",
        "# 11. Security, Permissions, and Audit",
        "",
        "Security requirements:",
        "",
        f"- Restrict create, edit, approve, override, and export actions for {name.lower()} by role and scope",
        f"- Apply maker-checker or dual control where {name.lower()} affects compliance, payroll, access, or legal outcomes",
        f"- Protect sensitive values and administrative actions associated with {name.lower()}",
        "",
        "Audit requirements:",
        "",
        f"- Capture before-and-after values for material changes in {name.lower()}",
        f"- Capture actor identity, timestamp, channel, decision comments, and correlation references for {name.lower()}",
        f"- Retain approval and rejection history for {name.lower()} and expose evidence for audit reviews",
        "",
        "# 12. Notifications",
        "",
        "Notifications should be sent for:",
        "",
        f"- {name} submission or creation",
        f"- Approval requested for {name}",
        f"- {name} approved, rejected, escalated, or completed",
        f"- Exception, expiry, cut-off, or dependency issue affecting {name.lower()}",
        "",
        "# 13. Configuration",
        "",
        "Configurable items:",
        "",
        f"- Enablement rules and defaults for {name.lower()}",
        f"- Approval routing, SLA, reminder, and escalation rules for {name.lower()}",
        f"- Validation thresholds, cut-offs, and policy mappings relevant to {name.lower()}",
        f"- Reporting and notification switches affecting {name.lower()}",
        "",
        "# 14. Workflow",
        "",
        "Typical workflow:",
        "",
        "1. A user or system initiates a transaction based on configured rules.",
        f"2. The system validates data, permissions, and dependency integrity for {name.lower()}.",
        f"3. Approval, notification, and integration steps run where configured for {name.lower()}.",
        f"4. Final outcomes are recorded, audited, and exposed to downstream consumers of {name.lower()}.",
        "",
        "# 15. State Machine",
        "",
        "Primary states:",
        "",
    ]
    lines += [f"- {state}" for state in states]
    lines += [
        "",
        "State transition expectations:",
        "",
        f"- State changes in {name.lower()} must be explicit, auditable, and permission-aware",
        f"- Reopen, rollback, or correction paths for {name.lower()} must be policy-controlled",
        "",
        "# 16. Edge Cases and Exception Handling",
        "",
    ]
    lines += [f"- {edge}" for edge in edge_cases]
    lines += [
        "",
        "# 17. Test Scenarios",
        "",
        "Representative test scenarios:",
        "",
        f"- Create and process a valid {name.lower()} transaction end-to-end",
        f"- Reject invalid or incomplete data for {name.lower()} with clear validation messages",
        f"- Verify role-based access boundaries for viewing, editing, approving, and exporting {name.lower()}",
        f"- Verify notifications, events, and audit logs triggered by {name.lower()} state changes",
        f"- Verify negative paths and recovery behavior for failed {name.lower()} dependencies",
        "",
        "# 18. Dependencies and Integrations",
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
        "# 19. Assumptions",
        "",
        f"- {name} may behave differently by tenant, geography, and worker type",
        f"- Cross-module dependencies affecting {name.lower()} will be available through governed APIs or events",
        f"- Final field-level design for {name.lower()} will be refined during detailed UI and data modeling without breaking this functional baseline",
        "",
    ]
    return "\n".join(lines)


def write_journeys() -> None:
    root = DOCS / "05-stakeholder-journeys"
    ensure_dir(root)
    readme = [
        "# Stakeholder Journeys",
        "",
        "This section contains role-based journey documents that explain how major personas move through the Enterprise HRMS application end to end.",
        "",
        "Documents:",
        "",
    ]
    for journey in JOURNEYS:
        readme.append(f"- `{journey['num']}-{journey['slug']}.md`")
        content = [
            "---",
            f"id: HRMS-JNY-{journey['num']}",
            f"title: {journey['title']}",
            f"document: {journey['num']}-{journey['slug']}.md",
            "version: 1.0",
            "status: Draft",
            "---",
            "",
            "# 1. Persona Context",
            "",
            f"This journey document describes how the `{journey['actor']}` experiences and uses the Enterprise HRMS application across multiple modules.",
            "",
            "Primary goals:",
            "",
        ]
        content += [f"- {goal}" for goal in journey["goals"]]
        content += [
            "",
            "# 2. Primary Module Touchpoints",
            "",
        ]
        content += [f"- {module}" for module in journey["modules"]]
        content += [
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
            "# 4. Experience Expectations",
            "",
            f"- The {journey['actor'].lower()} should see only relevant tasks, approvals, and data",
            f"- The {journey['actor'].lower()} should be guided by clear statuses, deadlines, and notifications",
            f"- The {journey['actor'].lower()} should be able to recover from validation errors and interrupted flows",
            "",
            "# 5. Risks and Failure Points",
            "",
            f"- Missing permissions or scope may block {journey['actor'].lower()} actions",
            f"- Unclear state or approval ownership may delay {journey['actor'].lower()} workflows",
            f"- Cross-module inconsistency may confuse {journey['actor'].lower()} and reduce adoption",
            "",
            "# 6. Reporting and Monitoring",
            "",
            f"- Dashboards for {journey['actor'].lower()} should show pending actions, status visibility, and trend indicators",
            f"- Audit and support teams should be able to reconstruct the {journey['actor'].lower()} journey when issues occur",
            "",
            "# 7. Design and Engineering Implications",
            "",
            "- UX should optimize for role-specific entry points and minimal cognitive load",
            "- APIs and permissions should be aligned to role-specific actions and data boundaries",
            "- QA should verify the journey across module boundaries, not only within isolated features",
            "",
        ]
        (root / f"{journey['num']}-{journey['slug']}.md").write_text("\n".join(content), encoding="utf-8")
    (root / "README.md").write_text("\n".join(readme) + "\n", encoding="utf-8")


def write_cross_cutting() -> None:
    root = DOCS / "06-cross-cutting-specs"
    ensure_dir(root)
    readme = [
        "# Cross-Cutting Specifications",
        "",
        "This section centralizes the shared standards that apply across multiple Enterprise HRMS modules and sub-modules.",
        "",
        "Documents:",
        "",
    ]
    for item in CROSS_CUTTING:
        readme.append(f"- `{item['num']}-{item['slug']}.md`")
        content = [
            "---",
            f"id: HRMS-XCUT-{item['num']}",
            f"title: {item['title']}",
            f"document: {item['num']}-{item['slug']}.md",
            "version: 1.0",
            "status: Draft",
            "---",
            "",
            "# 1. Purpose",
            "",
            f"This document defines the shared enterprise standard for `{item['title']}` across the Enterprise HRMS platform.",
            "",
            "# 2. Scope",
            "",
        ]
        content += [f"- {scope}" for scope in item["scope"]]
        content += [
            "",
            "# 3. Design Principles",
            "",
            "- Centralize reusable behavior instead of duplicating it in module-specific documents",
            "- Preserve tenant configurability without weakening governance",
            "- Make standards explicit enough for product, design, engineering, and QA teams to use consistently",
            "",
            "# 4. Mandatory Controls",
            "",
            "- Define ownership of the standard",
            "- Define where configuration is allowed and where it is prohibited",
            "- Define auditability expectations and operational evidence",
            "- Define failure and recovery behavior",
            "",
            "# 5. Implementation Guidance",
            "",
            "- Each module must reference this standard where the behavior applies",
            "- Exceptions to the standard must be explicitly approved and documented",
            "- Engineering and QA artifacts should trace back to the relevant sections of this standard",
            "",
            "# 6. Validation Expectations",
            "",
            "- Unit, integration, and end-to-end tests should cover the standard where it affects runtime behavior",
            "- Security and audit reviews should verify the standard for high-risk areas",
            "- Documentation updates to this standard should trigger downstream review of dependent modules",
            "",
        ]
        (root / f"{item['num']}-{item['slug']}.md").write_text("\n".join(content), encoding="utf-8")
    (root / "README.md").write_text("\n".join(readme) + "\n", encoding="utf-8")


def write_appendices() -> None:
    root = DOCS / "07-appendices"
    ensure_dir(root)
    readme = [
        "# Appendices",
        "",
        "This section contains framework appendices and supporting reference structures for the Enterprise HRMS documentation library.",
        "",
        "Documents:",
        "",
    ]
    for num, slug, title in APPENDICES:
        readme.append(f"- `{num}-{slug}.md`")
        content = [
            "---",
            f"id: HRMS-APP-{num}",
            f"title: {title}",
            f"document: {num}-{slug}.md",
            "version: 1.0",
            "status: Draft",
            "---",
            "",
            "# 1. Purpose",
            "",
            f"This appendix provides the framework for `{title}` within the Enterprise HRMS documentation library.",
            "",
            "# 2. Intended Use",
            "",
            "- Support cross-document consistency and traceability",
            "- Provide a single place to collect repeated enterprise reference information",
            "- Help business, design, engineering, QA, and implementation teams navigate shared concepts",
            "",
            "# 3. Structure Guidance",
            "",
            "- Maintain stable identifiers where the appendix becomes system-critical",
            "- Group entries by module and sub-module where practical",
            "- Preserve revision history for any appendix that affects implementation or compliance",
            "",
            "# 4. Population Strategy",
            "",
            "- Start with the highest-risk and highest-volume areas",
            "- Expand iteratively as module and sub-module specs mature",
            "- Avoid duplicating information that already has a canonical source elsewhere in the library",
            "",
        ]
        (root / f"{num}-{slug}.md").write_text("\n".join(content), encoding="utf-8")
    (root / "README.md").write_text("\n".join(readme) + "\n", encoding="utf-8")


def write_submodule_specs() -> None:
    root = DOCS / "08-submodule-specifications"
    ensure_dir(root)
    items = parse_l3_catalog()
    by_parent: dict[tuple[str, str, str], list[dict]] = {}
    for item in items:
        key = (item["parent_num"], item["parent_title"], item["parent_slug"])
        by_parent.setdefault(key, []).append(item)

    top_readme = [
        "# Deep Sub-Module Specifications",
        "",
        "This section contains dedicated deep specifications for the high-complexity `L3` sub-modules identified in the Enterprise HRMS sub-module catalog.",
        "",
        "Parent module folders:",
        "",
    ]

    for (num, parent_title, parent_slug), group in sorted(by_parent.items()):
        folder = root / f"{num}-{parent_slug}"
        ensure_dir(folder)
        top_readme.append(f"- `{num}-{parent_slug}`")
        parent_readme = [
            f"# {parent_title} Deep Specifications",
            "",
            f"This folder contains dedicated deep specifications for the `L3` sub-modules under `{parent_title}`.",
            "",
            "Documents:",
            "",
        ]
        for seq, item in enumerate(group, start=1):
            filename = f"{seq:02d}-{item['slug']}.md"
            parent_readme.append(f"- `{filename}`")
            (folder / filename).write_text(submodule_markdown(item, seq), encoding="utf-8")
        (folder / "README.md").write_text("\n".join(parent_readme) + "\n", encoding="utf-8")
    (root / "README.md").write_text("\n".join(top_readme) + "\n", encoding="utf-8")


def main() -> None:
    write_journeys()
    write_cross_cutting()
    write_appendices()
    write_submodule_specs()
    print("Generated stakeholder journeys, cross-cutting specs, appendices, and deep sub-module specs.")


if __name__ == "__main__":
    main()
