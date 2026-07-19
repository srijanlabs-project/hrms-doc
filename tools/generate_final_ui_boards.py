from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(r"D:\HRMS-doc")
MOCKUPS = ROOT / "docs/10-ui-ux-architecture/mockups"
DESIGNS = ROOT / "docs/10-ui-ux-architecture/screen-ui-designs"

FONT_DIR = Path(r"C:\Windows\Fonts")
REGULAR = FONT_DIR / "segoeui.ttf"
SEMIBOLD = FONT_DIR / "segoeuib.ttf"

COLORS = {
    "canvas": "#F4F7FB", "surface": "#FFFFFF", "ink": "#102A43", "muted": "#627D98",
    "line": "#D9E2EC", "nav": "#063B44", "nav_active": "#0B7479", "blue": "#2563EB",
    "teal": "#0F766E", "green": "#15803D", "orange": "#D97706",
    "red": "#B42318", "soft_blue": "#EFF6FF", "soft_green": "#ECFDF5", "soft_orange": "#FFF7ED",
    "soft_red": "#FEF2F2", "soft_teal": "#ECFEFF",
}

SCREENS = [
    ("batch-03-people-and-recruitment", "PEO-SCR-002", "peo-scr-002-employment-details-workspace", "Employment Details Workspace", "People Record", "blue", "MD-02", "Current employment structure", [("Assignments", "01", "Current"), ("Pending changes", "02", "Needs approval"), ("Future rows", "03", "Effective dated"), ("Payroll impact", "04", "Downstream")], ["Product Manager | EMP001234 | Pune | Active", "Senior Product Manager | EMP001235 | Bengaluru | Pending", "Engineering Manager | EMP001236 | Mumbai | Future dated", "People Partner | EMP001237 | Delhi | History"], ["Current row stays primary", "Future dated changes are distinct", "Payroll and access impact is visible", "Historical rows remain read-only"]),
    ("batch-03-people-and-recruitment", "PEO-SCR-003", "peo-scr-003-identity-and-compliance-panel", "Identity and Compliance Panel", "People Record", "teal", "MD-04", "Identity evidence and controls", [("Verified fields", "18", "96% complete"), ("Open checks", "03", "Needs review"), ("Masked values", "12", "Privacy by default"), ("Expiry alerts", "02", "Due this month")], ["PAN | Verified | Last checked today", "Aadhaar | Masked | Verified 2 days ago", "Bank account | Review required | Evidence missing", "Passport | Expires 24 Sep | Reminder scheduled"], ["Sensitive values are masked by default", "Reveal requires permission and reason", "Verification evidence is retained", "Expiry creates an actionable task"]),
    ("batch-03-people-and-recruitment", "PEO-SCR-004", "peo-scr-004-bank-and-tax-maintenance", "Bank and Tax Maintenance", "People Record", "orange", "MD-03", "Payroll-safe financial details", [("Active accounts", "01", "Primary"), ("Tax regime", "New", "FY 2026-27"), ("Proof status", "Verified", "Bank proof"), ("Change lock", "24h", "Cooling period")], ["Salary account | HDFC Bank | XXXX 4321 | Verified", "Tax regime | New regime | FY 2026-27 | Selected", "PAN | XXXXX1234K | Verified | Locked", "Nominee | 01 record | Review | Optional"], ["Bank changes require OTP and proof", "Sensitive fields stay masked", "Effective date is explicit", "Payroll cutoff warnings appear before submit"]),
    ("batch-03-people-and-recruitment", "PEO-SCR-005", "peo-scr-005-documents-center", "Documents Center", "People Record", "violet", "MD-04", "Employee document repository", [("Required docs", "14", "12 complete"), ("Pending review", "03", "Verification queue"), ("Expiring soon", "02", "Next 30 days"), ("Storage used", "1.8 GB", "Of 5 GB")], ["Offer letter | Signed | 14 Jul 2026", "Address proof | Verified | 12 Jul 2026", "Insurance card | Expiring soon | 24 Jul 2026", "Passport | Verification pending | Uploaded today"], ["File type and size are checked server-side", "Version history is preserved", "Expiry reminders are scheduled", "Signing and acknowledgment stay traceable"]),
    ("batch-03-people-and-recruitment", "PEO-SCR-006", "peo-scr-006-employee-timeline", "Employee Timeline", "People Record", "green", "MD-04", "Chronological employee record", [("Lifecycle events", "26", "Since joining"), ("Open actions", "04", "Across teams"), ("Last change", "2d", "Promotion"), ("Audit coverage", "100%", "Complete")], ["14 Jul 2026 | Promotion approved | Compensation", "08 Jul 2026 | Manager changed | Organization", "01 Jul 2026 | Goal cycle opened | Performance", "15 Jun 2026 | Document acknowledged | Compliance"], ["Events are immutable after posting", "Each event links to its source record", "Pending events are visually separated", "Audit details open in context"]),
    ("batch-03-people-and-recruitment", "PEO-SCR-007", "peo-scr-007-lifecycle-action-wizard", "Lifecycle Action Wizard", "People Record", "blue", "TX-06", "Create a governed lifecycle change", [("Step", "02 / 04", "Employment"), ("Impact checks", "05", "3 passed"), ("Approvers", "03", "Routing ready"), ("Effective date", "01 Aug", "Selected")], ["1. Action type | Promotion | Completed", "2. Employment details | New grade and manager | In progress", "3. Impact review | Payroll, access, reporting | Pending", "4. Approval route | HRBP, Finance, Manager | Locked"], ["Required fields block forward navigation", "Cross-module impact is shown before submit", "Effective dates cannot overlap", "Drafts autosave and remain recoverable"]),
    ("batch-03-people-and-recruitment", "REC-SCR-001", "rec-scr-001-requisition-workbench", "Requisition Workbench", "Recruitment", "orange", "MD-02", "Hiring demand and requisition control", [("Open requisitions", "42", "Across 8 teams"), ("Awaiting approval", "07", "Budget review"), ("Target close", "12", "This month"), ("At risk", "04", "Needs action")], ["REQ-1042 | Senior Backend Engineer | Engineering | Approval", "REQ-1041 | Product Designer | Product | Sourcing", "REQ-1038 | Finance Analyst | Finance | Interviewing", "REQ-1034 | HR Business Partner | People | Offer"], ["Headcount and budget are visible together", "Approval blockers are actionable", "Target close dates surface risk", "Only tenant-approved masters are selectable"]),
    ("batch-03-people-and-recruitment", "REC-SCR-002", "rec-scr-002-candidate-pipeline-board", "Candidate Pipeline Board", "Recruitment", "violet", "TX-01", "Candidate movement through hiring stages", [("Active candidates", "186", "Across open roles"), ("Interviews today", "14", "5 need feedback"), ("Offers pending", "06", "Approval queue"), ("Time to hire", "24d", "Down 3 days")], ["Applied | 68 candidates | Resume review", "Screening | 42 candidates | 8 due today", "Interview | 31 candidates | 5 feedback overdue", "Offer | 06 candidates | Compensation review"], ["Candidate stage changes are auditable", "Duplicate candidates are flagged", "Interview feedback is required before move", "Sensitive candidate data is role-scoped"]),
    ("batch-03-people-and-recruitment", "REC-SCR-003", "rec-scr-003-candidate-profile", "Candidate Profile", "Recruitment", "teal", "MD-04", "Candidate profile and decision context", [("Match score", "86%", "Strong fit"), ("Stage", "Interview", "Round 2"), ("Documents", "05", "4 verified"), ("Risk flags", "01", "Review required")], ["Ananya Kapoor | Senior Product Manager | 8 years", "Skills | Product strategy, analytics, discovery", "Experience | B2B SaaS, fintech, marketplace", "Compensation | Expected 32 LPA | Confidential"], ["Resume parsing shows source evidence", "Ranking never replaces human decision", "Compensation is restricted by permission", "All candidate actions enter the audit timeline"]),
    ("batch-03-people-and-recruitment", "REC-SCR-004", "rec-scr-004-interview-scheduler", "Interview Scheduler", "Recruitment", "blue", "TX-03", "Coordinate interviews without conflicts", [("Interviews today", "14", "5 pending feedback"), ("Panel capacity", "72%", "Healthy"), ("Conflicts", "02", "Need resolution"), ("Time zones", "04", "Global panels")], ["10:00 | Ananya Kapoor | Product panel | Confirmed", "11:30 | Rohan Mehta | Engineering | Panel conflict", "14:00 | Sneha Iyer | Finance | Awaiting candidate", "16:30 | Karan Shah | Design | Feedback overdue"], ["Calendar conflicts are detected before save", "Candidate time zone stays visible", "Panel load is balanced", "Reschedule notifications are tracked"]),
    ("batch-04-payroll-and-workforce", "PAY-SCR-002", "pay-scr-002-payroll-run-details", "Payroll Run Details", "Payroll", "green", "MD-02", "Payroll run control and review", [("Payroll period", "Jun 2026", "Monthly"), ("Employees", "12,458", "In scope"), ("Gross payroll", "Rs 18.4 Cr", "Before deductions"), ("Exceptions", "28", "3 blocking")], ["RUN-2026-06 | Regular payroll | 12,458 workers | In review", "Input lock | Attendance and leave | Complete | 30 Jun", "Validation | Earnings and deductions | 28 exceptions | Open", "Approval | Finance and HR | 2 of 3 complete | Pending"], ["Payroll period is immutable after lock", "Blocking exceptions must be resolved", "Every calculation has source evidence", "Approval and release actions are idempotent"]),
    ("batch-04-payroll-and-workforce", "PAY-SCR-003", "pay-scr-003-validation-queue", "Payroll Validation Queue", "Payroll", "orange", "TX-01", "Resolve payroll exceptions", [("Open exceptions", "28", "Across 6 rules"), ("Blocking", "03", "Cannot release"), ("Auto-fixed", "142", "This run"), ("SLA risk", "04", "Due today")], ["PAY-EX-8421 | Missing bank account | Ananya Kapoor | Blocking", "PAY-EX-8417 | Negative leave balance | Rohan Mehta | Review", "PAY-EX-8409 | Duplicate allowance | Finance | Blocking", "PAY-EX-8392 | Tax mismatch | Priya Nair | Assigned"], ["Exceptions carry rule and source context", "Bulk resolve requires a preview", "Blocking states cannot be bypassed", "Resolution is recorded for audit and replay"]),
    ("batch-04-payroll-and-workforce", "PAY-SCR-004", "pay-scr-004-statutory-workbench", "Statutory Workbench", "Payroll", "violet", "MD-02", "Compliance filing readiness", [("Returns due", "06", "This month"), ("Ready to file", "04", "Evidence complete"), ("Blocked", "02", "Needs correction"), ("Penalties at risk", "01", "Escalate")], ["PF ECR | Jun 2026 | Due 15 Jul | Ready", "ESI return | Jun 2026 | Due 15 Jul | Evidence missing", "PT return | Maharashtra | Due 31 Jul | Ready", "TDS statement | Q1 FY27 | Due 31 Jul | Correction required"], ["Jurisdiction and filing period are explicit", "Evidence is attached before submission", "Blocked filings show the responsible owner", "Submission receipts are retained"]),
    ("batch-04-payroll-and-workforce", "PAY-SCR-005", "pay-scr-005-compliance-calendar", "Compliance Calendar", "Payroll", "teal", "TX-04", "Statutory due dates and ownership", [("Open obligations", "18", "Across entities"), ("Due this week", "05", "2 urgent"), ("Overdue", "02", "Escalated"), ("Owners", "11", "Assigned")], ["15 Jul | PF ECR | Maharashtra | Payroll Ops | Ready", "15 Jul | ESI return | Karnataka | HR Ops | Evidence missing", "20 Jul | PT return | West Bengal | Finance | In review", "31 Jul | TDS statement | All entities | Tax Team | Planned"], ["Due dates follow jurisdiction calendars", "Reminder schedules are configurable", "Overdue obligations escalate automatically", "Calendar changes are versioned"]),
    ("batch-04-payroll-and-workforce", "PAY-SCR-006", "pay-scr-006-retro-and-settlement-workspace", "Retro and Settlement Workspace", "Payroll", "blue", "TX-06", "Retro pay and settlement review", [("Open retro cases", "12", "Across 4 periods"), ("Net impact", "Rs 8.2 L", "Pending approval"), ("Employees", "86", "In scope"), ("High impact", "04", "Needs review")], ["RET-2026-018 | Promotion arrear | 12 employees | Draft", "RET-2026-017 | Leave reversal | 28 employees | Calculated", "RET-2026-014 | Tax correction | 06 employees | Approval", "SET-2026-006 | Exit settlement | 01 employee | Blocked"], ["Retro periods cannot overlap", "Payroll and statutory impact is previewed", "High-value changes require dual approval", "Final settlement is locked after release"]),
    ("batch-04-payroll-and-workforce", "WRK-SCR-001", "wrk-scr-001-attendance-control-center", "Attendance Control Center", "Workforce Operations", "teal", "DB-01", "Daily attendance health", [("Present today", "91%", "12,458 workers"), ("Late arrivals", "486", "Down 8%"), ("Missing punches", "132", "Needs action"), ("Location alerts", "18", "Review")], ["Pune | 2,840 workers | 94% present | 28 exceptions", "Bengaluru | 3,214 workers | 91% present | 42 exceptions", "Mumbai | 2,108 workers | 89% present | 31 exceptions", "Delhi | 1,986 workers | 92% present | 18 exceptions"], ["Today is calculated in tenant time zone", "Duplicate punches are suppressed", "Location and device exceptions stay traceable", "Managers can delegate review during leave"]),
    ("batch-04-payroll-and-workforce", "WRK-SCR-002", "wrk-scr-002-shift-management", "Shift Management", "Workforce Operations", "blue", "MD-02", "Shift rules and coverage", [("Active shifts", "38", "Across locations"), ("Coverage gaps", "06", "Next 7 days"), ("Overtime risk", "14", "Above threshold"), ("Approvals", "09", "Pending")], ["General | 09:00-18:00 | 4,860 workers | Active", "Night | 22:00-07:00 | 1,420 workers | Active", "Flex | 08:00-17:00 | 2,186 workers | Draft", "Weekend | Sat-Sun | 624 workers | Approval"], ["Overlapping shifts are blocked", "Rest periods are checked before publish", "Coverage gaps show affected teams", "Changes create an audit event"]),
    ("batch-04-payroll-and-workforce", "WRK-SCR-003", "wrk-scr-003-rostering-screen", "Rostering Screen", "Workforce Operations", "violet", "TX-03", "Build and publish a fair roster", [("Roster period", "15-21 Jul", "Current week"), ("Assigned", "96%", "12,010 workers"), ("Unfilled", "84", "Needs action"), ("Conflicts", "12", "Review")], ["Mon 15 | General shift | 2,840 assigned | 12 open", "Tue 16 | General shift | 2,812 assigned | 19 open", "Wed 17 | Night shift | 1,404 assigned | 03 open", "Thu 18 | Weekend cover | 592 assigned | 08 open"], ["Rest and skill rules run before publish", "Unfilled slots remain actionable", "Employee preferences are visible", "Published rosters notify affected workers"]),
    ("batch-04-payroll-and-workforce", "WRK-SCR-004", "wrk-scr-004-timesheet-workbench", "Timesheet Workbench", "Workforce Operations", "orange", "MD-02", "Review hours and approvals", [("Submitted", "1,248", "This period"), ("Pending approval", "186", "Across managers"), ("Missing hours", "42", "Needs correction"), ("Overtime", "Rs 4.6 L", "Estimated")], ["Product | 318 sheets | 96% complete | 12 pending", "Engineering | 482 sheets | 92% complete | 64 pending", "Support | 214 sheets | 88% complete | 31 pending", "Operations | 234 sheets | 95% complete | 79 pending"], ["Submitted hours are locked for employees", "Corrections require a reason", "Overtime is calculated from approved hours", "Approvals are concurrency-safe"]),
    ("batch-04-payroll-and-workforce", "WRK-SCR-005", "wrk-scr-005-overtime-and-comp-off-console", "Overtime and Comp-off Console", "Workforce Operations", "red", "TX-01", "Overtime approvals and recovery", [("Open requests", "74", "This period"), ("High risk", "09", "Threshold exceeded"), ("Comp-off balance", "186", "Available"), ("Pending payroll", "23", "Awaiting lock")], ["OT-2481 | Engineering | 12.5 hours | Manager review", "OT-2478 | Operations | 18 hours | High risk", "CO-1042 | Support | 01 day | Available", "OT-2462 | Finance | 08 hours | Payroll pending"], ["Daily and weekly thresholds are enforced", "Comp-off expiry is visible", "High-risk requests need HR review", "Approved hours flow to payroll exactly once"]),
]

# Violet was never part of the approved Staffsy palette; use info blue for data accents.
SCREENS = [tuple("blue" if value == "violet" else value for value in screen) for screen in SCREENS]

def font(size, bold=False):
    return ImageFont.truetype(str(SEMIBOLD if bold else REGULAR), size)

def text(draw, xy, value, size=12, color=None, bold=False, anchor=None):
    draw.text(xy, str(value), font=font(size, bold), fill=color or COLORS["ink"], anchor=anchor)

def box(draw, xy, fill=COLORS["surface"], outline=COLORS["line"], radius=12, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def wrap(value, max_chars):
    words = str(value).split()
    lines, line = [], ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if len(candidate) > max_chars and line:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines

def draw_logo(draw, x, y, mobile=False):
    text(draw, (x, y), "Staffsy", 22 if not mobile else 18, "#07616A", True)
    draw.ellipse((x - 15, y + 5, x - 5, y + 15), fill="#F08C2E")

def draw_chip(draw, x, y, value, fill, color=COLORS["ink"]):
    width = max(58, len(value) * 7 + 22)
    box(draw, (x, y, x + width, y + 24), fill, fill, 12)
    text(draw, (x + width / 2, y + 12), value, 9, color, True, "mm")
    return width

def draw_nav_icon(draw, x, y, kind, color):
    """Small outline-first navigation glyphs matching the documented icon language."""
    if kind == "overview":
        for dx, dy in [(0, 0), (8, 0), (0, 8), (8, 8)]:
            draw.rounded_rectangle((x + dx, y + dy, x + dx + 5, y + dy + 5), radius=1, outline=color, width=1)
    elif kind == "people":
        draw.ellipse((x + 5, y, x + 11, y + 6), outline=color, width=1)
        draw.arc((x + 2, y + 6, x + 14, y + 15), 180, 360, fill=color, width=1)
    elif kind == "queue":
        draw.line((x + 1, y + 3, x + 14, y + 3), fill=color, width=1)
        draw.line((x + 1, y + 8, x + 11, y + 8), fill=color, width=1)
        draw.line((x + 1, y + 13, x + 8, y + 13), fill=color, width=1)
        draw.line((x + 11, y + 10, x + 13, y + 12), fill=color, width=1)
        draw.line((x + 13, y + 12, x + 16, y + 8), fill=color, width=1)
    elif kind == "reports":
        draw.line((x + 2, y + 14, x + 2, y + 5), fill=color, width=1)
        draw.line((x + 7, y + 14, x + 7, y + 2), fill=color, width=1)
        draw.line((x + 12, y + 14, x + 12, y + 8), fill=color, width=1)
        draw.line((x + 1, y + 15, x + 14, y + 15), fill=color, width=1)
    elif kind == "audit":
        draw.ellipse((x + 2, y + 2, x + 14, y + 14), outline=color, width=1)
        draw.line((x + 8, y + 5, x + 8, y + 9), fill=color, width=1)
        draw.ellipse((x + 7, y + 11, x + 9, y + 13), fill=color)
    elif kind == "saved":
        draw.line((x + 3, y + 2, x + 13, y + 2), fill=color, width=1)
        draw.line((x + 3, y + 2, x + 3, y + 14), fill=color, width=1)
        draw.line((x + 13, y + 2, x + 13, y + 14), fill=color, width=1)
        draw.line((x + 3, y + 14, x + 8, y + 11), fill=color, width=1)
        draw.line((x + 13, y + 14, x + 8, y + 11), fill=color, width=1)
    elif kind == "settings":
        draw.ellipse((x + 4, y + 4, x + 12, y + 12), outline=color, width=1)
        for dx, dy in [(8, 0), (8, 16), (0, 8), (16, 8)]:
            draw.line((x + dx, y + dy, x + 8, y + 8), fill=color, width=1)
    else:
        draw.ellipse((x + 2, y + 2, x + 14, y + 14), outline=color, width=1)
        text(draw, (x + 8, y + 8), "?", 9, color, True, "mm")

def status_style(value):
    lower = value.lower()
    if any(word in lower for word in ["blocked", "risk", "conflict", "missing", "overdue"]):
        return COLORS["soft_red"], COLORS["red"]
    if any(word in lower for word in ["pending", "review", "draft", "approval", "in progress", "awaiting"]):
        return COLORS["soft_orange"], "#9A3412"
    if any(word in lower for word in ["future", "planned", "scheduled"]):
        return COLORS["soft_blue"], COLORS["blue"]
    return COLORS["soft_green"], "#166534"

def draw_sidebar(draw, screen, x, y, w, h):
    box(draw, (x, y, x + w, y + h), COLORS["nav"], COLORS["nav"], 16)
    text(draw, (x + 18, y + 28), "Staffsy", 18, "#FFFFFF", True)
    draw.line((x + 16, y + 52, x + w - 16, y + 52), fill="#2C6067", width=1)
    text(draw, (x + 18, y + 78), screen[4].upper(), 9, "#9DD9D3", True)
    items = [("Overview", "overview"), ("People" if screen[4] == "People Record" else screen[4], "people"), ("Work queue", "queue"), ("Reports", "reports"), ("Audit & logs", "audit")]
    for index, item in enumerate(items):
        top = y + 96 + index * 42
        fill = COLORS["nav_active"] if index == 0 else "#0A4650"
        box(draw, (x + 10, top, x + w - 10, top + 32), fill, fill, 8)
        icon_color = "#FFFFFF" if index == 0 else "#D7EEF0"
        draw_nav_icon(draw, x + 20, top + 8, item[1], icon_color)
        text(draw, (x + 44, top + 16), item[0], 11, icon_color, index == 0, "lm")
    text(draw, (x + 18, y + 330), "WORKSPACE", 9, "#9DD9D3", True)
    for index, item in enumerate([("Saved views", "saved"), ("Configuration", "settings"), ("Help center", "help")]):
        yy = y + 348 + index * 34
        draw_nav_icon(draw, x + 20, yy - 7, item[1], "#D7EEF0")
        text(draw, (x + 44, yy), item[0], 11, "#D7EEF0")
    draw.line((x + 16, y + h - 68, x + w - 16, y + h - 68), fill="#2C6067", width=1)
    text(draw, (x + 18, y + h - 45), "Rahul Sharma", 11, "#FFFFFF", True)
    text(draw, (x + 18, y + h - 28), f"{screen[4]} Lead", 9, "#9DD9D3")

def draw_table(draw, x, y, w, h, screen, mobile=False):
    box(draw, (x, y, x + w, y + h))
    text(draw, (x + 16, y + 22), screen[7], 14 if not mobile else 12, COLORS["ink"], True)
    text(draw, (x + 16, y + 42), "Single source of truth with clear ownership and status.", 9 if not mobile else 8, COLORS["muted"])
    text(draw, (x + w - 62, y + 26), "View all", 9, COLORS["teal"], True)
    table_top = y + 64
    draw.line((x + 14, table_top, x + w - 14, table_top), fill=COLORS["line"], width=1)
    text(draw, (x + 16, table_top + 15), "Record", 9, COLORS["muted"], True)
    if not mobile:
        text(draw, (x + w * .54, table_top + 15), "Context", 9, COLORS["muted"], True)
        text(draw, (x + w - 88, table_top + 15), "Status", 9, COLORS["muted"], True)
    row_y = table_top + 36
    for row in screen[9]:
        parts = [part.strip() for part in row.split("|")]
        status = parts[-1]
        record = parts[0]
        context = " | ".join(parts[1:-1])
        text(draw, (x + 16, row_y), record, 9 if not mobile else 8, COLORS["ink"], True)
        if not mobile:
            text(draw, (x + w * .54, row_y), context[:45], 9, COLORS["muted"])
            fill, color = status_style(status)
            draw_chip(draw, x + w - 102, row_y - 10, status[:16], fill, color)
        else:
            text(draw, (x + 16, row_y + 14), context[:34], 8, COLORS["muted"])
        draw.line((x + 14, row_y + (29 if mobile else 24), x + w - 14, row_y + (29 if mobile else 24)), fill="#EDF2F7", width=1)
        row_y += 44 if mobile else 40

def draw_detail(draw, x, y, w, h, screen, mobile=False):
    box(draw, (x, y, x + w, y + h), "#FBFDFF")
    text(draw, (x + 16, y + 22), "Selected record", 14 if not mobile else 12, COLORS["ink"], True)
    text(draw, (x + w - 75, y + 25), "Open history", 9, COLORS["teal"], True)
    draw.ellipse((x + 16, y + 43, x + 51, y + 78), fill="#D9F1ED")
    text(draw, (x + 33.5, y + 60), "AS", 10, COLORS["teal"], True, "mm")
    text(draw, (x + 61, y + 52), "Ananya Kapoor", 11, COLORS["ink"], True)
    text(draw, (x + 61, y + 68), "EMP001234 | Selected record", 8, COLORS["muted"])
    rows = [("Owner", "People Operations"), ("Last action", "Updated today"), ("Next action", "Review and route"), ("Control state", "Governed")]
    row_y = y + 100
    for label, value in rows:
        text(draw, (x + 16, row_y), label, 9, COLORS["muted"])
        if label == "Control state":
            draw_chip(draw, x + w - 85, row_y - 10, value, COLORS["soft_blue"], COLORS["blue"])
        else:
            text(draw, (x + w - 16, row_y), value, 9, COLORS["ink"], True, "ra")
        draw.line((x + 16, row_y + 17, x + w - 16, row_y + 17), fill="#EDF2F7", width=1)
        row_y += 27
    if not mobile:
        box(draw, (x + 16, y + h - 51, x + 116, y + h - 17), COLORS["teal"], COLORS["teal"], 8)
        text(draw, (x + 66, y + h - 34), "Review record", 9, "#FFFFFF", True, "mm")
        box(draw, (x + 125, y + h - 51, x + 207, y + h - 17), COLORS["surface"], COLORS["line"], 8)
        text(draw, (x + 166, y + h - 34), "View audit", 9, COLORS["ink"], True, "mm")

def draw_rail(draw, x, y, w, h, screen):
    box(draw, (x, y, x + w, y + h))
    text(draw, (x + 14, y + 23), "Design annotations", 13, COLORS["ink"], True)
    top = y + 49
    for index, note in enumerate(screen[10]):
        draw.ellipse((x + 14, top, x + 34, top + 20), fill=COLORS["teal"])
        text(draw, (x + 24, top + 10), str(index + 1), 9, "#FFFFFF", True, "mm")
        for line_index, line in enumerate(wrap(note, 27)[:3]):
            text(draw, (x + 44, top + 3 + line_index * 13), line, 9, COLORS["ink"] if line_index == 0 else COLORS["muted"], line_index == 0)
        top += 55
    spec_y = y + 306
    text(draw, (x + 14, spec_y), "Layout specifications", 13, COLORS["ink"], True)
    specs = [("Template", screen[6]), ("Breakpoint", "1440 px"), ("Density", "Operational"), ("State", "Default + actionable")]
    for index, (label, value) in enumerate(specs):
        yy = spec_y + 28 + index * 27
        text(draw, (x + 14, yy), label, 9, COLORS["muted"])
        text(draw, (x + w - 14, yy), value, 9, COLORS["ink"], True, "ra")
        draw.line((x + 14, yy + 13, x + w - 14, yy + 13), fill="#EDF2F7", width=1)
    key_y = spec_y + 160
    text(draw, (x + 14, key_y), "Key principles", 13, COLORS["ink"], True)
    for index, note in enumerate(["Make the next action visible.", "Keep risk and ownership explicit.", "Reduce density, not meaning, on mobile."]):
        yy = key_y + 28 + index * 35
        draw.ellipse((x + 14, yy, x + 28, yy + 14), fill="#E5F8F2")
        text(draw, (x + 21, yy + 7), "", 8, COLORS["teal"], True, "mm")
        text(draw, (x + 38, yy + 1), note, 9, COLORS["muted"])

def draw_board(screen, mobile=False):
    width, height = (390, 844) if mobile else (1440, 1280)
    image = Image.new("RGB", (width, height), COLORS["canvas"])
    draw = ImageDraw.Draw(image)
    accent = COLORS[screen[5]]
    if mobile:
        draw.rectangle((0, 0, width, 58), fill=COLORS["surface"])
        draw_logo(draw, 33, 21, True)
        draw.line((0, 57, width, 57), fill=COLORS["line"], width=1)
        text(draw, (346, 28), "12", 9, COLORS["red"], True, "mm")
        margin = 14
        y = 72
        text(draw, (margin, y), screen[1], 9, COLORS["muted"], True)
        text(draw, (margin, y + 18), screen[3], 19, COLORS["ink"], True)
        text(draw, (margin, y + 43), "Operational workspace with clear next actions.", 9, COLORS["muted"])
        box(draw, (margin, y + 62, 178, y + 96), COLORS["teal"], COLORS["teal"], 8)
        text(draw, (103, y + 79), "Primary action", 10, "#FFFFFF", True, "mm")
        box(draw, (186, y + 62, 376, y + 96), COLORS["surface"], COLORS["line"], 8)
        text(draw, (281, y + 79), "More actions", 10, COLORS["ink"], True, "mm")
        y += 110
        box(draw, (margin, y, width - margin, y + 48), COLORS["soft_orange"], "#FFD9AA", 10)
        text(draw, (margin + 11, y + 16), "Today's focus: clear blockers and keep owners informed.", 8, "#8A4B11", True)
        text(draw, (margin + 11, y + 32), "Updated 10 min ago", 8, "#9A3412")
        y += 58
        box(draw, (margin, y, width - margin, y + 39), COLORS["surface"], COLORS["line"], 9)
        text(draw, (margin + 11, y + 20), "Search records, people, policies...", 9, COLORS["muted"], False, "lm")
        y += 50
        kpi_w = (width - 2 * margin - 8) / 2
        for index, kpi in enumerate(screen[8]):
            x = margin + (index % 2) * (kpi_w + 8)
            yy = y + (index // 2) * 70
            box(draw, (x, yy, x + kpi_w, yy + 61))
            text(draw, (x + 10, yy + 15), kpi[0], 8, COLORS["muted"])
            text(draw, (x + 10, yy + 37), kpi[1], 18, COLORS["ink"], True)
            text(draw, (x + kpi_w - 8, yy + 15), kpi[2][:14], 7, accent, True, "ra")
        y += 150
        draw_table(draw, margin, y, width - 2 * margin, 190, screen, True)
        y += 200
        draw_detail(draw, margin, y, width - 2 * margin, 145, screen, True)
        draw.rectangle((0, 790, width, 844), fill=COLORS["surface"])
        draw.line((0, 790, width, 790), fill=COLORS["line"], width=1)
        for index, label in enumerate(["Home", "Tasks", "Search", "More"]):
            x = 49 + index * 98
            draw.ellipse((x - 3, 803, x + 3, 809), fill=accent if index == 0 else COLORS["line"])
            text(draw, (x, 824), label, 8, accent if index == 0 else COLORS["muted"], index == 0, "mm")
        return image
    draw.rectangle((0, 0, width, 76), fill=COLORS["surface"])
    draw_logo(draw, 32, 26)
    draw.line((164, 19, 164, 57), fill=COLORS["line"], width=1)
    text(draw, (188, 22), f"{screen[1]}  {screen[3]}", 20, COLORS["ink"], True)
    text(draw, (188, 49), f"{screen[4]}  |  Enterprise HRMS  |  Staffsy Design System v1.0", 10, COLORS["muted"])
    draw_chip(draw, 1120, 25, "Human centered", COLORS["soft_teal"], COLORS["teal"])
    draw_chip(draw, 1240, 25, "AI ready", COLORS["soft_orange"], "#AA530C")
    draw_chip(draw, 1324, 25, "FINAL", COLORS["soft_green"], COLORS["green"])
    top = 92
    draw_sidebar(draw, screen, 16, top, 208, 1110)
    main_x, main_w = 240, 900
    rail_x, rail_w = 1156, 268
    text(draw, (main_x, top + 14), f"Staffsy / {screen[4]} / {screen[3]}", 10, COLORS["muted"])
    text(draw, (main_x, top + 42), screen[3], 25, COLORS["ink"], True)
    text(draw, (main_x, top + 75), f"A governed workspace for {screen[7].lower()}.", 10, COLORS["muted"])
    box(draw, (main_x + 700, top + 25, main_x + 820, top + 63), COLORS["teal"], COLORS["teal"], 8)
    text(draw, (main_x + 760, top + 44), "Primary action", 10, "#FFFFFF", True, "mm")
    box(draw, (main_x + 828, top + 25, main_x + 900, top + 63), COLORS["surface"], COLORS["line"], 8)
    text(draw, (main_x + 864, top + 44), "...", 14, COLORS["ink"], True, "mm")
    notice_y = top + 103
    box(draw, (main_x, notice_y, main_x + main_w, notice_y + 42), COLORS["soft_orange"], "#FFD9AA", 10)
    text(draw, (main_x + 14, notice_y + 16), "Today's focus:", 10, "#B45309", True)
    text(draw, (main_x + 91, notice_y + 16), "Review assigned work, clear blockers, and keep downstream teams informed.", 10, "#8A4B11")
    text(draw, (main_x + main_w - 85, notice_y + 16), "10 min ago", 9, "#9A3412", False, "lm")
    filter_y = notice_y + 54
    box(draw, (main_x, filter_y, main_x + main_w, filter_y + 48), COLORS["surface"], COLORS["line"], 10)
    box(draw, (main_x + 12, filter_y + 9, main_x + 382, filter_y + 39), "#F8FAFC", COLORS["line"], 8)
    text(draw, (main_x + 24, filter_y + 24), "Search records, people, policies, or commands...", 9, COLORS["muted"], False, "lm")
    for index, label in enumerate(["All entities", "Last 30 days", "Filters"]):
        draw_chip(draw, main_x + 400 + index * 113, filter_y + 12, label, COLORS["surface"], COLORS["ink"])
    kpi_y = filter_y + 60
    kpi_w = (main_w - 30) / 4
    for index, kpi in enumerate(screen[8]):
        x = main_x + index * (kpi_w + 10)
        box(draw, (x, kpi_y, x + kpi_w, kpi_y + 98))
        text(draw, (x + 13, kpi_y + 20), kpi[0], 9, COLORS["muted"])
        draw.ellipse((x + kpi_w - 25, kpi_y + 15, x + kpi_w - 16, kpi_y + 24), fill=accent)
        text(draw, (x + 13, kpi_y + 57), kpi[1], 22, COLORS["ink"], True)
        text(draw, (x + 13, kpi_y + 78), kpi[2], 9, COLORS["muted"])
    content_y = kpi_y + 110
    draw_table(draw, main_x, content_y, 548, 350, screen)
    draw_detail(draw, main_x + 560, content_y, 340, 350, screen)
    bottom_y = content_y + 362
    for index, title in enumerate(["Action queue", "Downstream impact", "Recent activity"]):
        x = main_x + index * 303
        box(draw, (x, bottom_y, x + 290, bottom_y + 196))
        text(draw, (x + 14, bottom_y + 23), title, 12, COLORS["ink"], True)
        text(draw, (x + 250, bottom_y + 23), "View all", 9, COLORS["teal"], True)
        rows = [("Items requiring review", "12"), ("Approvals due today", "06"), ("Recently completed", "28")]
        for row_index, (label, value) in enumerate(rows):
            yy = bottom_y + 60 + row_index * 38
            text(draw, (x + 14, yy), label, 9, COLORS["ink"])
            text(draw, (x + 272, yy), value, 9, COLORS["teal"], True, "ra")
            draw.line((x + 14, yy + 15, x + 276, yy + 15), fill="#EDF2F7", width=1)
    draw_rail(draw, rail_x, top, rail_w, 1110, screen)
    draw.rectangle((0, 1228, width, 1280), fill=COLORS["surface"])
    draw.line((0, 1228, width, 1228), fill=COLORS["line"], width=1)
    text(draw, (28, 1254), f"Staffsy Design System v1.0  |  {screen[1]}  |  Source mockup-backed", 10, COLORS["muted"], False, "lm")
    text(draw, (720, 1254), "Consistent. Scalable. Built for the future of work.", 10, COLORS["muted"], False, "mm")
    text(draw, (1412, 1254), "Desktop 1440 x 1280", 10, COLORS["muted"], False, "rm")
    return image

def main():
    # Keep the historical command stable while routing regeneration to the
    # canonical presentation-board renderer used by Batch 01/02.
    from rebuild_final_ui_boards import main as rebuild_main
    rebuild_main()

if __name__ == "__main__":
    main()
