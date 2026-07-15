from pathlib import Path
from html import escape

out = Path(__file__).parent

COLORS = {
    "bg": "#F4F7FB",
    "shell": "#10324A",
    "panel": "#FFFFFF",
    "border": "#D9E2EC",
    "text": "#102A43",
    "muted": "#486581",
    "teal": "#0F766E",
    "amber": "#D97706",
    "red": "#B42318",
    "blue": "#2563EB",
    "green": "#15803D",
    "slate": "#7B8794",
    "soft": "#EAF2F8",
    "soft2": "#F8FAFC",
}


def svg_header(w, h):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" fill="none">
  <defs>
    <style>
      .title {{ font: 700 28px 'Segoe UI', Arial, sans-serif; fill: {COLORS["text"]}; }}
      .h2 {{ font: 600 18px 'Segoe UI', Arial, sans-serif; fill: {COLORS["text"]}; }}
      .h2inv {{ font: 600 18px 'Segoe UI', Arial, sans-serif; fill: white; }}
      .h3 {{ font: 600 15px 'Segoe UI', Arial, sans-serif; fill: {COLORS["text"]}; }}
      .metric {{ font: 700 24px 'Segoe UI', Arial, sans-serif; fill: {COLORS["text"]}; }}
      .body {{ font: 500 13px 'Segoe UI', Arial, sans-serif; fill: {COLORS["text"]}; }}
      .small {{ font: 500 12px 'Segoe UI', Arial, sans-serif; fill: {COLORS["muted"]}; }}
      .tiny {{ font: 500 11px 'Segoe UI', Arial, sans-serif; fill: {COLORS["muted"]}; }}
      .inverse {{ font: 600 12px 'Segoe UI', Arial, sans-serif; fill: white; }}
      .annoTitle {{ font: 700 14px 'Segoe UI', Arial, sans-serif; fill: {COLORS["text"]}; }}
      .annoText {{ font: 500 12px 'Segoe UI', Arial, sans-serif; fill: {COLORS["muted"]}; }}
    </style>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="8" flood-color="#102A43" flood-opacity="0.08"/>
    </filter>
  </defs>
"""


def end_svg():
    return "</svg>\n"


def rect(x, y, w, h, fill, stroke=None, rx=14, shadow=False):
    extra = f' stroke="{stroke}" stroke-width="1"' if stroke else ""
    filt = ' filter="url(#shadow)"' if shadow else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{extra}{filt}/>'


def text(x, y, cls, value, anchor="start"):
    safe = escape(value)
    return f'<text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}">{safe}</text>'


def chip(x, y, w, label, fill, tcls="small"):
    cls = "inverse" if fill in (
        COLORS["shell"],
        COLORS["blue"],
        COLORS["red"],
        COLORS["teal"],
        COLORS["green"],
        COLORS["amber"],
    ) else tcls
    return rect(x, y, w, 28, fill, None, 14) + text(x + w / 2, y + 18, cls, label, "middle")


def line(x1, y1, x2, y2, color, width=1, dash=None):
    dash_attr = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"{dash_attr}/>'


def card(x, y, w, h, title_text, subtitle=None):
    s = rect(x, y, w, h, COLORS["panel"], COLORS["border"], 14, True)
    s += text(x + 16, y + 24, "h3", title_text)
    if subtitle:
        s += text(x + 16, y + 42, "small", subtitle)
    return s


def metric_card(x, y, w, title_text, value, color):
    s = rect(x, y, w, 92, COLORS["panel"], COLORS["border"], 14, True)
    s += rect(x + 12, y + 12, 44, 44, color, None, 12)
    s += text(x + 68, y + 30, "small", title_text)
    s += text(x + 68, y + 60, "metric", value)
    return s


def bullet_list(x, y, items, gap=20):
    s = ""
    cy = y
    for item in items:
        s += f'<circle cx="{x}" cy="{cy-4}" r="3" fill="{COLORS["blue"]}"/>'
        s += text(x + 12, cy, "body", item)
        cy += gap
    return s


def table(x, y, w, h, headers, rows, col_fracs):
    s = rect(x, y, w, h, COLORS["panel"], COLORS["border"], 14, True)
    s += rect(x, y, w, 42, "#F8FAFC", None, 14)
    cx = x
    positions = []
    for frac in col_fracs:
        positions.append(cx)
        cx += w * frac
    for i, head in enumerate(headers):
        s += text(positions[i] + 12, y + 26, "small", head)
    for i in range(1, len(headers)):
        s += line(positions[i], y + 10, positions[i], y + h - 12, COLORS["border"])
    row_y = y + 54
    row_h = 42
    for ridx, row in enumerate(rows):
        if row_y + row_h > y + h - 8:
            break
        if ridx % 2 == 0:
            s += rect(x + 1, row_y - 18, w - 2, row_h, "#FBFDFF", None, 8)
        for i, val in enumerate(row):
            s += text(positions[i] + 12, row_y + 4, "body", str(val))
        s += line(x + 8, row_y + 16, x + w - 8, row_y + 16, COLORS["border"])
        row_y += row_h
    return s


def annotation_panel(x, y, w, h, title_text, items):
    s = rect(x, y, w, h, "#F8FBFF", COLORS["border"], 18)
    s += text(x + 18, y + 28, "h2", title_text)
    cy = y + 56
    for num, label, detail in items:
        s += f'<circle cx="{x+24}" cy="{cy-4}" r="12" fill="{COLORS["blue"]}"/>'
        s += text(x + 24, cy, "inverse", str(num), "middle")
        s += text(x + 46, cy - 2, "annoTitle", label)
        s += text(x + 46, cy + 16, "annoText", detail)
        cy += 52
    return s


def callout(cx, cy, num, color=None):
    fill = color or COLORS["blue"]
    return f'<circle cx="{cx}" cy="{cy}" r="14" fill="{fill}" stroke="white" stroke-width="3"/><text x="{cx}" y="{cy+5}" class="inverse" text-anchor="middle">{num}</text>'


def desktop_shell(screen_title, header_right, sidebar_label="Control Plane", nav_items=None):
    nav_items = nav_items or ["Home", "Tasks", "Tenants", "Configurations", "Metadata", "Security"]
    s = svg_header(1440, 1280)
    s += rect(0, 0, 1440, 1280, COLORS["bg"], None, 0)
    s += rect(24, 24, 248, 1232, COLORS["shell"], None, 24, True)
    s += text(52, 72, "inverse", sidebar_label)
    s += rect(48, 92, 200, 36, "rgba(255,255,255,0.1)", None, 12)
    s += text(62, 116, "inverse", "Enterprise HRMS")
    ny = 168
    for i, item in enumerate(nav_items):
        fill = "rgba(255,255,255,0.12)" if i == 0 else "rgba(255,255,255,0.04)"
        s += rect(40, ny - 24, 216, 40, fill, None, 12)
        s += text(60, ny, "inverse", item)
        ny += 52
    s += rect(296, 24, 1120, 64, COLORS["panel"], COLORS["border"], 20, True)
    s += rect(320, 40, 360, 32, COLORS["soft2"], COLORS["border"], 16)
    s += text(338, 61, "small", "Search, commands, records, audits...")
    s += chip(1060, 40, 86, header_right, COLORS["soft"])
    s += chip(1160, 40, 88, "Alerts 12", "#FDEAD7")
    s += chip(1262, 40, 94, "Tasks 08", "#E3F2FD")
    s += rect(1368, 36, 32, 40, "#DCE7F3", None, 16)
    s += text(310, 128, "title", screen_title)
    return s


def mobile_shell(title_text, badge="Live"):
    s = svg_header(390, 844)
    s += rect(0, 0, 390, 844, COLORS["bg"], None, 0)
    s += rect(0, 0, 390, 92, COLORS["shell"], None, 0)
    s += text(20, 36, "inverse", "Enterprise HRMS")
    s += rect(302, 18, 68, 28, "rgba(255,255,255,0.12)", None, 14)
    s += text(336, 36, "inverse", badge, "middle")
    s += text(20, 76, "h2inv", title_text)
    return s


def button(x, y, w, label, fill, stroke=None):
    cls = "inverse" if fill in (
        COLORS["shell"],
        COLORS["blue"],
        COLORS["red"],
        COLORS["teal"],
        COLORS["green"],
        COLORS["amber"],
    ) else "body"
    return rect(x, y, w, 40 if w > 100 else 36, fill, stroke, 14 if w > 100 else 12) + text(
        x + w / 2, y + (26 if w > 100 else 24), cls, label, "middle"
    )


def render_standard_desktop(spec):
    s = desktop_shell(spec["title"], spec["badge"], spec.get("shell", "Control Plane"), spec.get("nav"))
    x = 296
    for idx, c in enumerate(spec["chips"]):
        s += chip(x, 152, c["w"], c["label"], c["fill"])
        if idx == 0:
            s += callout(x + 16, 166, 1)
        x += c["w"] + 12
    ax = 808
    for idx, action in enumerate(spec["actions"]):
        s += button(ax, 146, action["w"], action["label"], action["fill"], action.get("stroke"))
        if idx == 0:
            s += callout(ax + 12, 146, 2)
        ax += action["w"] + 12
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", spec["search"])
    sx = 856
    for c in spec["search_chips"]:
        s += chip(sx, 226, c["w"], c["label"], c["fill"])
        sx += c["w"] + 10
    s += callout(320, 216, 3)
    for idx, (xv, m) in enumerate(zip([296, 518, 740, 962, 1184], spec["metrics"])):
        s += metric_card(xv, 302, 198, m["title"], m["value"], m["color"])
        if idx == 0:
            s += callout(xv + 24, 316, 4)
    s += card(296, 422, 332, 270, spec["upper_left"]["title"], spec["upper_left"]["subtitle"])
    s += bullet_list(314, 484, spec["upper_left"]["bullets"])
    s += callout(314, 438, 5)
    s += card(648, 422, 510, 270, spec["upper_right"]["title"], spec["upper_right"]["subtitle"])
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", spec["upper_right"]["note_title"])
    s += text(684, 522, "body", spec["upper_right"]["note_body"])
    s += text(684, 544, "small", spec["upper_right"]["note_footer"])
    bx = 666
    for action in spec["upper_right"]["note_actions"]:
        s += button(bx, 574, action["w"], action["label"], action["fill"], action.get("stroke"))
        bx += action["w"] + 14
    s += callout(666, 438, 6)
    s += card(296, 712, 332, 220, spec["lower_left"]["title"], spec["lower_left"]["subtitle"])
    s += bullet_list(314, 774, spec["lower_left"]["bullets"])
    s += card(648, 712, 510, 220, spec["lower_right"]["title"], spec["lower_right"]["subtitle"])
    s += bullet_list(666, 774, spec["lower_right"]["bullets"])
    s += callout(666, 728, 7)
    s += card(296, 952, 862, 98, spec["footer"]["title"], spec["footer"]["subtitle"])
    fx = 320
    for c in spec["footer"]["chips"]:
        s += chip(fx, 990, c["w"], c["label"], c["fill"])
        fx += c["w"] + 12
    s += callout(320, 966, 8)
    annotations = []
    for idx, a in enumerate(spec["annotations"], start=1):
        annotations.append((idx, a["label"], a["detail"]))
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", annotations)
    save(f'{spec["slug"]}-desktop.svg', s)


def render_standard_mobile(spec):
    s = mobile_shell(spec["mobile_title"], spec["mobile_badge"])
    x = 16
    for idx, c in enumerate(spec["mobile_chips"]):
        s += chip(x, 108, c["w"], c["label"], c["fill"])
        if idx == 0:
            s += callout(28, 122, 1)
        x += c["w"] + 8
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", spec["mobile_search"])
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, spec["mobile_cards"][0]["title"], spec["mobile_cards"][0]["subtitle"])
    s += bullet_list(34, 284, spec["mobile_cards"][0]["bullets"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, spec["mobile_cards"][1]["title"], spec["mobile_cards"][1]["subtitle"])
    s += bullet_list(34, 456, spec["mobile_cards"][1]["bullets"])
    if spec["mobile_cards"][1].get("actions"):
        ax = 30
        for action in spec["mobile_cards"][1]["actions"]:
            s += button(ax, 526, action["w"], action["label"], action["fill"], action.get("stroke"))
            ax += action["w"] + 14
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, spec["mobile_cards"][2]["title"], spec["mobile_cards"][2]["subtitle"])
    s += bullet_list(34, 652, spec["mobile_cards"][2]["bullets"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [(1, spec["mobile_note"]["label"], spec["mobile_note"]["detail"])])
    save(f'{spec["slug"]}-mobile.svg', s)


def save(name, content):
    (out / name).write_text(content + end_svg(), encoding="utf-8")


def generate():
    s = desktop_shell("Platform Admin Home", "PROD")
    s += callout(60, 170, 1)
    s += callout(1110, 56, 2)
    s += callout(530, 164, 3)
    for x, title_text, val, color in [
        (296, "Platform health", "98%", COLORS["green"]),
        (518, "Tenant impact", "24", COLORS["amber"]),
        (740, "Failed jobs", "05", COLORS["red"]),
        (962, "Privacy exceptions", "03", COLORS["blue"]),
        (1184, "Review SLA", "7h", COLORS["teal"]),
    ]:
        s += metric_card(x, 152, 198, title_text, val, color)
    s += callout(322, 196, 4)
    s += card(296, 272, 332, 268, "Action queue", "Urgent provider-side work needing decisions")
    s += bullet_list(314, 334, ["Tenant provisioning approval", "Privacy exception review", "Support-session approval", "Failed config publish"])
    s += callout(324, 292, 5)
    s += card(648, 272, 510, 268, "Platform health grid", "Shared service readiness and evidence signals")
    for idx, label in enumerate(["Identity", "Notification", "Audit", "Event Bus", "Backup", "Integrations"]):
        cx = 664 + (idx % 3) * 158
        cy = 324 + (idx // 3) * 104
        s += rect(cx, cy, 142, 86, COLORS["soft2"], COLORS["border"], 12)
        s += text(cx + 14, cy + 24, "h3", label)
        s += text(cx + 14, cy + 48, "small", "Healthy with drill-down path")
    s += callout(670, 292, 6)
    s += card(296, 560, 332, 250, "Admin shortcuts", "Command paths into governed control-plane tools")
    s += bullet_list(314, 622, ["Config catalog", "Metadata explorer", "Workflow admin", "Policy and access admin", "Tenant management"])
    s += card(648, 560, 510, 250, "Risk and exceptions", "Signals that outrank convenience actions")
    s += bullet_list(666, 622, ["Privileged access review overdue", "Data retention warning in EU region", "Backup verification exception", "Access-review campaign breach"])
    s += callout(650, 582, 7, COLORS["red"])
    s += card(296, 830, 862, 220, "Recent activity timeline", "Tenant lifecycle, failed job, support, and rollback chronology")
    s += line(340, 904, 1068, 904, COLORS["border"], 3)
    for x, lab in [(364, "Tenant provisioned"), (560, "Sync failed"), (756, "Support review"), (952, "Rollback closed")]:
        s += f'<circle cx="{x}" cy="904" r="8" fill="{COLORS["blue"]}"/>'
        s += text(x - 30, 932, "small", lab)
    s += callout(320, 850, 8)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Governed shell", "Provider-only shell keeps global navigation visually separate from tenant workspaces."),
        (2, "Persistent command access", "Search, alert, and task chips stay visible for fast operational jumps."),
        (3, "Header context", "Environment and screen identity remain visible to avoid production mistakes."),
        (4, "Signal strip above fold", "Critical metrics appear before detail panels and are designed for drill-down."),
        (5, "Action-first queue", "Urgent approvals sit left for immediate triage before deeper health analysis."),
        (6, "Service health grid", "Shared platform services show a common card pattern and status summary."),
        (7, "Risk emphasis", "Security and privacy warnings are visually stronger than shortcuts or reports."),
        (8, "Chronology panel", "Timeline preserves incident sequencing for ops, support, and audit teams."),
    ])
    save("w0-scr-001-platform-admin-home-desktop.svg", s)

    s = mobile_shell("Platform Admin Home", "PROD")
    s += rect(16, 108, 358, 88, COLORS["panel"], COLORS["border"], 16, True)
    s += text(30, 134, "small", "Top signals")
    s += text(30, 166, "metric", "98%")
    s += text(102, 166, "body", "Platform health")
    s += chip(250, 122, 106, "Impact 24", "#FEF3C7")
    s += chip(250, 156, 106, "Jobs 05", "#FEE2E2")
    s += callout(28, 114, 1)
    s += card(16, 212, 358, 154, "Urgent queue", "Approval and exception work surfaced first on mobile")
    s += bullet_list(34, 276, ["Provisioning approval", "Privacy review", "Failed publish"])
    s += callout(30, 228, 2)
    s += card(16, 382, 358, 154, "Health cards", "Critical platform services condensed into stacked cards")
    for i, lab in enumerate(["Identity", "Audit", "Backup", "Integrations"]):
        col = i % 2
        row = i // 2
        x = 30 + col * 170
        y = 430 + row * 88
        s += rect(x, y, 154, 74, COLORS["soft2"], COLORS["border"], 12)
        s += text(x + 12, y + 24, "h3", lab)
        s += text(x + 12, y + 48, "small", "Healthy")
    s += callout(30, 398, 3)
    s += card(16, 550, 358, 128, "Risks and shortcuts", "Governance signals remain above secondary actions")
    s += bullet_list(34, 608, ["Privileged access review", "Retention warning", "Open metadata explorer"])
    s += callout(30, 566, 4, COLORS["red"])
    s += annotation_panel(16, 694, 358, 132, "Mobile notes", [
        (1, "Signal compression", "Top metrics collapse into a single summary card instead of a wide strip."),
        (2, "Queue before analytics", "Urgent control-plane tasks stay ahead of lower-priority summary content."),
    ])
    save("w0-scr-001-platform-admin-home-mobile.svg", s)

    s = desktop_shell("Global Search and Command Entry", "Scope", "Control Plane", ["Home", "Search", "Tasks", "Configs", "Metadata", "Help"])
    s += rect(296, 152, 862, 84, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 176, 632, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 199, "body", "Find settings, forms, tenants, audits, jobs...")
    s += chip(968, 176, 82, "All", COLORS["blue"])
    s += chip(1060, 176, 98, "Provider", COLORS["soft"])
    s += callout(320, 162, 1)
    s += card(296, 256, 862, 56, "Recent and quick commands", None)
    s += chip(320, 274, 136, "metadata explorer", "#E3F2FD")
    s += chip(468, 274, 116, "tenant alpha", "#EDF2F7")
    s += chip(596, 274, 158, "failed workflow job", "#FEF3C7")
    s += chip(766, 274, 128, "open task inbox", "#DCFCE7")
    s += callout(320, 268, 2)
    s += rect(296, 332, 862, 48, COLORS["panel"], COLORS["border"], 14, True)
    for idx, tab in enumerate(["All", "Records", "Admin Artifacts", "Reports", "Tasks", "Help"]):
        fill = COLORS["shell"] if idx == 0 else COLORS["soft2"]
        s += chip(314 + idx * 138, 342, 122, tab, fill)
    s += callout(314, 344, 3)
    s += card(296, 396, 520, 654, "Results list", "Grouped results with metadata and sensitivity cues")
    for idx, grp in enumerate(["Admin Artifacts", "Tasks", "Records", "Reports"]):
        y = 442 + idx * 138
        s += text(316, y, "h3", grp)
        for j in range(2):
            ry = y + 18 + j * 42
            s += rect(316, ry, 480, 34, "#FBFDFF", COLORS["border"], 10)
            label = grp[:-1] if grp.endswith("s") else grp
            s += text(332, ry + 22, "body", f"{label} result {j+1}")
            s += text(640, ry + 22, "small", "role-safe metadata")
    s += callout(320, 416, 4)
    s += card(834, 396, 324, 654, "Preview panel", "Selected result preview and fast actions")
    s += text(852, 446, "h3", "Configuration Catalog")
    s += bullet_list(852, 484, ["Summary and object path", "Quick actions", "Related items", "Owner and last update", "Permission notes"])
    s += rect(852, 620, 120, 36, COLORS["shell"], None, 12)
    s += text(912, 644, "inverse", "Open result", "middle")
    s += callout(850, 416, 5)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Unified command bar", "Search and command execution share one dominant entry point."),
        (2, "Memory aids", "Recent searches and saved commands reduce repeat navigation effort."),
        (3, "Result typing", "Tabs keep mixed-result sets understandable for admins and reviewers."),
        (4, "Grouped records", "Results differentiate objects with metadata rather than name alone."),
        (5, "Safe preview", "Preview allows confident navigation without exposing hidden details."),
        (6, "Role-aware search", "Scope chip and sensitivity patterns reinforce permission boundaries."),
    ])
    s += callout(1010, 178, 6)
    save("w0-scr-002-global-search-desktop.svg", s)

    s = mobile_shell("Search and Command")
    s += rect(16, 108, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 144, "body", "Find settings, forms, tasks, audits...")
    s += callout(28, 122, 1)
    s += chip(16, 182, 58, "All", COLORS["blue"])
    s += chip(82, 182, 76, "Records", COLORS["soft"])
    s += chip(166, 182, 90, "Admin", COLORS["soft"])
    s += chip(264, 182, 66, "Tasks", COLORS["soft"])
    s += callout(28, 196, 2)
    s += card(16, 224, 358, 108, "Recent", "Fast-return search memory for admins on small screens")
    s += chip(30, 272, 126, "metadata explorer", "#E3F2FD")
    s += chip(166, 272, 102, "tenant alpha", "#EDF2F7")
    s += callout(30, 240, 3)
    s += card(16, 348, 358, 258, "Results", "Full-screen scroll list replaces desktop split view")
    for i, lab in enumerate(["Configuration Catalog", "Access review pending", "Tenant Alpha", "Policy report"]):
        y = 392 + i * 50
        s += rect(30, y, 330, 40, "#FBFDFF", COLORS["border"], 12)
        s += text(44, y + 24, "body", lab)
        s += text(270, y + 24, "small", "tap for preview")
    s += callout(30, 364, 4)
    s += card(16, 624, 358, 110, "Selection sheet", "Preview becomes a sheet after result tap")
    s += bullet_list(34, 678, ["Summary", "Quick action", "Related items"])
    s += callout(30, 640, 5)
    s += annotation_panel(16, 748, 358, 78, "Mobile notes", [
        (1, "Overlay pattern", "Search becomes a focused full-screen mobile action instead of a persistent desktop utility."),
    ])
    save("w0-scr-002-global-search-mobile.svg", s)

    s = desktop_shell("Tasks and Approvals", "Inbox", "Control Plane", ["Home", "Inbox", "Tenants", "Security", "Implementation", "Reports"])
    s += chip(296, 152, 118, "My urgent 12", COLORS["red"])
    s += chip(426, 152, 108, "Overdue 04", COLORS["amber"])
    s += chip(546, 152, 104, "Security 03", COLORS["blue"])
    s += chip(662, 152, 146, "Implementation 07", COLORS["soft"])
    s += callout(312, 166, 1)
    s += rect(296, 206, 862, 48, COLORS["panel"], COLORS["border"], 14, True)
    for idx, f in enumerate(["Type", "Priority", "Due date", "Domain", "Status", "Sort: Urgency"]):
        s += chip(314 + idx * 136, 216, 118, f, COLORS["soft2"])
    s += callout(314, 220, 2)
    s += table(296, 270, 540, 780, ["ID", "Title", "Domain", "Due", "Status", "Action"], [
        ["T-1001", "Approve support session", "Security", "Today", "Overdue", "Open"],
        ["T-1002", "Publish config changes", "Config", "Today", "Urgent", "Open"],
        ["T-1003", "Review quota exception", "Tenant", "Fri", "Pending", "Open"],
        ["T-1004", "Validate import mapping", "Implementation", "Mon", "Queued", "Open"],
        ["T-1005", "Close DR evidence gap", "Ops", "Tue", "Pending", "Open"],
        ["T-1006", "Approve policy update", "Admin", "Tue", "Pending", "Open"],
    ], [0.12, 0.34, 0.16, 0.12, 0.14, 0.12])
    s += callout(314, 286, 3)
    s += card(856, 270, 302, 780, "Task detail panel", "Process tasks without leaving context")
    s += text(874, 320, "h3", "Approve support session")
    s += bullet_list(874, 360, ["Summary and rationale", "Linked tenant and requester", "Comments thread", "Decision actions", "Open source object"])
    s += rect(874, 620, 122, 36, COLORS["green"], None, 12)
    s += text(935, 644, "inverse", "Approve", "middle")
    s += rect(1008, 620, 122, 36, "#FEE2E2", None, 12)
    s += text(1069, 644, "body", "Reject", "middle")
    s += rect(874, 672, 256, 120, "#FBFDFF", COLORS["border"], 12)
    s += text(890, 700, "small", "Comment draft")
    s += callout(874, 286, 4)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Urgency chips", "Top presets help users pivot between workload contexts quickly."),
        (2, "Filter discipline", "High-density queue screens still expose clear filter and sort controls."),
        (3, "List-first processing", "Table lets reviewers triage multiple tasks before opening one."),
        (4, "In-context decisions", "Approval actions remain beside history, comments, and source metadata."),
        (5, "Bulk-safe design", "Queue density supports future low-risk bulk actions without redesign."),
    ])
    s += callout(1110, 620, 5)
    save("w0-scr-003-task-inbox-desktop.svg", s)

    s = mobile_shell("Tasks and Approvals")
    s += chip(16, 108, 106, "Urgent 12", COLORS["red"])
    s += chip(130, 108, 96, "Overdue 04", COLORS["amber"])
    s += chip(234, 108, 96, "Security 03", COLORS["blue"])
    s += callout(28, 122, 1)
    s += rect(16, 156, 358, 48, COLORS["panel"], COLORS["border"], 14, True)
    s += text(30, 186, "small", "Filters  Priority  Due date  Domain  Status")
    s += callout(28, 170, 2)
    s += card(16, 220, 358, 280, "Queue", "List-first mobile triage with tap-through detail")
    for i, lab in enumerate(["Approve support session", "Publish config changes", "Review quota exception", "Validate import mapping"]):
        y = 266 + i * 52
        s += rect(30, y, 330, 42, "#FBFDFF", COLORS["border"], 12)
        s += text(44, y + 24, "body", lab)
        s += text(292, y + 24, "small", "Open")
    s += callout(30, 236, 3)
    s += card(16, 516, 358, 190, "Selected task", "Detail content and comments stack vertically")
    s += bullet_list(34, 570, ["Summary", "Context", "Comments", "Linked record"])
    s += rect(16, 724, 358, 72, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(30, 740, 156, 40, COLORS["green"], None, 14)
    s += text(108, 766, "inverse", "Approve", "middle")
    s += rect(204, 740, 156, 40, "#FEE2E2", None, 14)
    s += text(282, 766, "body", "Reject", "middle")
    s += callout(30, 530, 4)
    save("w0-scr-003-task-inbox-mobile.svg", s)

    s = desktop_shell("Configuration Catalog", "Tenant A", "Admin Console", ["Home", "Catalog", "Configurations", "Metadata", "Workflow", "Help"])
    s += chip(296, 152, 112, "Scope Tenant-A", COLORS["blue"])
    s += chip(420, 152, 98, "Env PROD", COLORS["soft"])
    s += chip(530, 152, 146, "Pending approvals 3", "#FEF3C7")
    s += rect(994, 146, 164, 40, COLORS["teal"], None, 14)
    s += text(1076, 172, "inverse", "Propose change", "middle")
    s += callout(1008, 146, 1)
    s += card(296, 206, 224, 630, "Catalog panel", "Search, categories, risk, and scope filters")
    s += rect(314, 248, 188, 34, COLORS["soft2"], COLORS["border"], 12)
    s += text(328, 270, "small", "Search config key")
    s += bullet_list(314, 322, ["Workflow settings", "Identity", "Branding", "Integrations", "Notifications"])
    s += callout(316, 220, 2)
    s += table(540, 206, 380, 630, ["Key", "Label", "Risk", "Updated"], [
        ["wf.approval.max", "Approval max level", "High", "Today"],
        ["idp.session.ttl", "Session timeout", "High", "Yesterday"],
        ["brand.primary", "Primary color", "Low", "Mon"],
        ["notif.retry.count", "Retry count", "Medium", "Tue"],
        ["audit.export.retention", "Export retention", "High", "Wed"],
    ], [0.26, 0.36, 0.16, 0.22])
    s += callout(556, 220, 3)
    s += card(940, 206, 218, 630, "Effective detail", "Value lineage and validation stay beside the table")
    s += bullet_list(958, 268, ["Current effective value", "Scope lineage stack", "Validation rules", "Dependencies", "Editable by"])
    s += callout(954, 220, 4)
    s += card(296, 856, 862, 194, "Change proposal drawer", "Targeted override proposal without leaving current context")
    s += rect(314, 904, 152, 42, "#FBFDFF", COLORS["border"], 12)
    s += rect(482, 904, 136, 42, "#FBFDFF", COLORS["border"], 12)
    s += rect(634, 904, 170, 42, "#FBFDFF", COLORS["border"], 12)
    s += rect(820, 904, 320, 42, "#FBFDFF", COLORS["border"], 12)
    s += text(324, 930, "small", "Value")
    s += text(492, 930, "small", "Scope")
    s += text(644, 930, "small", "Effective date")
    s += text(830, 930, "small", "Impact notes")
    s += callout(314, 870, 5)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Governed edit action", "The change action is elevated but remains approval-aware and scope-bound."),
        (2, "Browse discipline", "Search and category tree keep the catalog navigable at scale."),
        (3, "Dense but legible table", "Key metadata stays visible for scanning before opening detail."),
        (4, "Lineage-first detail", "Why a value is effective is treated as a first-class design concern."),
        (5, "Inline proposal flow", "Override proposal stays connected to the selected configuration record."),
    ])
    save("w0-scr-004-config-console-desktop.svg", s)

    s = mobile_shell("Configuration Catalog", "Tenant")
    s += rect(16, 108, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 144, "body", "Search config key, label, or category")
    s += callout(28, 122, 1)
    s += chip(16, 182, 90, "Workflow", COLORS["blue"])
    s += chip(114, 182, 86, "Identity", COLORS["soft"])
    s += chip(208, 182, 82, "High risk", "#FEE2E2")
    s += callout(28, 196, 2)
    s += card(16, 224, 358, 202, "Selected config", "Mobile opens one config at a time with stacked lineage details")
    s += bullet_list(34, 278, ["Approval max level", "Current effective value: 4", "Inherited from tenant override", "Validation and dependencies"])
    s += callout(30, 240, 3)
    s += card(16, 442, 358, 170, "Change proposal flow", "Proposal becomes a guided full-screen stepper on mobile")
    s += bullet_list(34, 496, ["Enter value", "Pick scope", "Effective date", "Impact note"])
    s += rect(30, 564, 330, 34, COLORS["teal"], None, 12)
    s += text(195, 586, "inverse", "Continue proposal", "middle")
    s += callout(30, 458, 4)
    s += annotation_panel(16, 628, 358, 198, "Mobile notes", [
        (1, "Search-first entry", "Users locate a single key first instead of working across three desktop panels."),
        (2, "Step flow conversion", "Proposal and compare actions become guided steps to protect accuracy on small screens."),
        (3, "Provider-safe boundary", "Read-only provider-owned values should remain visible but clearly non-editable."),
    ])
    save("w0-scr-004-config-console-mobile.svg", s)

    s = desktop_shell("Metadata Explorer", "v2.6", "Admin Console", ["Home", "Catalog", "Metadata", "Forms", "APIs", "Help"])
    s += rect(994, 146, 98, 40, "#EFF6FF", None, 14)
    s += text(1043, 172, "body", "Compare", "middle")
    s += rect(1104, 146, 54, 40, "#DCFCE7", None, 14)
    s += text(1131, 172, "body", "Export", "middle")
    s += callout(1008, 146, 1)
    s += card(296, 206, 224, 336, "Entity tree", "Domain-grouped entity navigation with status filters")
    s += bullet_list(314, 262, ["Employee", "Payroll", "Workflow", "Document", "Security"])
    s += callout(316, 220, 2)
    s += card(540, 206, 336, 336, "Entity summary", "Ownership, classification, usage, and API exposure")
    s += bullet_list(558, 262, ["Owner service", "Classification summary", "Usage count", "API exposure"])
    s += callout(556, 220, 3)
    s += card(896, 206, 262, 336, "Dependency map", "Forms, APIs, reports, integrations, and rules")
    s += bullet_list(914, 262, ["Forms", "APIs", "Reports", "Integrations", "Rules"])
    s += callout(912, 220, 4)
    s += table(296, 562, 862, 488, ["Key", "Label", "Type", "Required", "Class", "Used in", "Notes"], [
        ["employeeCode", "Employee Code", "String", "Yes", "Internal", "API, Form", "Unique"],
        ["dateOfBirth", "Date of Birth", "Date", "Yes", "Sensitive", "API, Report", "Age rule"],
        ["panNumber", "PAN", "String", "No", "Restricted", "Payroll", "Regex"],
        ["managerId", "Manager", "Lookup", "Yes", "Internal", "Workflow", "No self ref"],
        ["mobileNumber", "Mobile", "String", "Yes", "Sensitive", "ESS", "OTP"],
        ["uan", "UAN", "String", "No", "Restricted", "Payroll", "12 digits"],
    ], [0.16, 0.18, 0.12, 0.12, 0.12, 0.18, 0.12])
    s += callout(314, 578, 5)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Utility actions", "Compare and export stay near the page title because they affect the entire entity context."),
        (2, "Navigation tree", "Domain and entity selection remains the first action path for advanced users."),
        (3, "Summary block", "Key ownership and classification details are visible before scrolling the field table."),
        (4, "Impact awareness", "Dependency visibility prevents unsafe metadata changes and supports implementation planning."),
        (5, "Field plane", "The table is the deepest data layer and is intentionally desktop-primary."),
        (6, "Restricted data handling", "Sensitive fields need classification and masking indicators in-line."),
    ])
    s += callout(744, 578, 6, COLORS["red"])
    save("w0-scr-005-metadata-explorer-desktop.svg", s)

    s = mobile_shell("Metadata Explorer", "v2.6")
    s += card(16, 108, 358, 126, "Selected entity", "Mobile supports quick metadata lookup, not full authoring")
    s += bullet_list(34, 162, ["Employee entity", "Owner service", "Classification summary"])
    s += callout(30, 124, 1)
    s += card(16, 248, 358, 188, "Field summary", "Fields shown as drill-down cards instead of a dense desktop table")
    for i, lab in enumerate(["employeeCode", "dateOfBirth", "panNumber"]):
        y = 298 + i * 42
        s += rect(30, y, 330, 32, "#FBFDFF", COLORS["border"], 10)
        s += text(42, y + 22, "body", lab)
        s += text(280, y + 22, "small", "View detail")
    s += callout(30, 264, 2)
    s += card(16, 452, 358, 156, "Dependencies", "Impact and downstream usage collapse into expandable sections")
    s += bullet_list(34, 506, ["Forms", "APIs", "Reports", "Rules"])
    s += callout(30, 468, 3)
    s += annotation_panel(16, 624, 358, 202, "Mobile notes", [
        (1, "Lookup orientation", "Mobile is intentionally optimized for lookup and review, not heavy metadata administration."),
        (2, "Table deconstruction", "Dense field tables break into card drill-downs to preserve readability."),
        (3, "Desktop-preferred depth", "Deep comparison and export still primarily belong to desktop usage."),
    ])
    save("w0-scr-005-metadata-explorer-mobile.svg", s)

    s = desktop_shell("Organization Admin Home", "Active", "Tenant Plane", ["Admin Home", "People", "Access and Roles", "Workflows", "Branding", "Integrations"])
    s += callout(60, 170, 1)
    s += chip(296, 152, 124, "Tenant Acme India", COLORS["soft"])
    s += chip(432, 152, 118, "Health Stable", "#DCFCE7")
    s += chip(562, 152, 150, "Last publish 10:42", "#E3F2FD")
    s += rect(812, 146, 146, 40, COLORS["blue"], None, 14)
    s += text(885, 172, "inverse", "Review setup gaps", "middle")
    s += rect(970, 146, 160, 40, COLORS["teal"], None, 14)
    s += text(1050, 172, "inverse", "Open access and roles", "middle")
    s += callout(820, 146, 2)
    for x, title_text, val, color in [
        (296, "SSO readiness", "Ready", COLORS["green"]),
        (518, "Admin approvals", "07", COLORS["amber"]),
        (740, "Publish failures", "02", COLORS["red"]),
        (962, "Quota warnings", "01", COLORS["blue"]),
        (1184, "Compliance", "04", COLORS["amber"]),
    ]:
        s += metric_card(x, 214, 198, title_text, val, color)
    s += callout(320, 228, 3)
    s += card(296, 334, 350, 264, "Setup progress and open actions", "Incomplete setup items, expiring connectors, and publish tasks")
    s += bullet_list(314, 396, ["Mandatory setup item incomplete", "SSO certificate expires in 12 days", "Workflow publish task awaiting review", "Connector sync failed yesterday"])
    s += callout(314, 350, 4)
    s += card(666, 334, 492, 264, "Tenant configuration health", "Act-now health cards for org-owned admin domains")
    for idx, label in enumerate(["Org structure", "Access", "Workflow", "Forms", "Branding", "Integrations"]):
        cx = 684 + (idx % 3) * 152
        cy = 386 + (idx // 3) * 104
        s += rect(cx, cy, 136, 86, COLORS["soft2"], COLORS["border"], 12)
        s += text(cx + 12, cy + 24, "h3", label)
        s += text(cx + 12, cy + 48, "small", "Needs attention")
    s += callout(684, 350, 5)
    s += card(296, 618, 350, 210, "Usage and adoption", "Adoption sits below setup and governance urgency")
    s += bullet_list(314, 680, ["Active users and login trend", "Module enablement", "Storage and quota"])
    s += card(666, 618, 492, 210, "Governance and trust", "Sensitive reviews and audit-related tenant events")
    s += bullet_list(684, 680, ["Recent access changes", "Privacy-sensitive export review", "Retention reminder", "Support-session visibility"])
    s += callout(684, 634, 6, COLORS["red"])
    s += card(296, 848, 862, 202, "Recent admin activity timeline", "Config publishes, role changes, sync outcomes, and escalations")
    s += line(340, 930, 1068, 930, COLORS["border"], 3)
    for x, lab in [(364, "Role change"), (560, "Brand publish"), (756, "Import complete"), (952, "Connector alert")]:
        s += f'<circle cx="{x}" cy="930" r="8" fill="{COLORS["blue"]}"/>'
        s += text(x - 26, 958, "small", lab)
    s += callout(320, 864, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Tenant plane shell", "This shell is clearly customer-scoped and excludes provider control-plane actions."),
        (2, "Action strip", "Primary admin actions focus on setup, access, and tenant-safe settings."),
        (3, "Signal hierarchy", "Urgent tenant readiness and compliance metrics appear before analytics."),
        (4, "Setup-first guidance", "Incomplete implementation and expiring connectors receive early visual priority."),
        (5, "Health grid", "Configuration domains are framed as actionable cards, not generic status blocks."),
        (6, "Trust emphasis", "Governance and privacy reviews outrank adoption metrics in the reading order."),
        (7, "Admin chronology", "Recent tenant-admin actions support troubleshooting and audit review."),
    ])
    save("w0-scr-018-org-admin-home-desktop.svg", s)

    s = mobile_shell("Organization Admin Home", "Active")
    s += rect(16, 108, 358, 96, COLORS["panel"], COLORS["border"], 16, True)
    s += text(30, 136, "small", "Tenant Acme India")
    s += text(30, 170, "metric", "Stable")
    s += text(114, 170, "body", "tenant health")
    s += chip(248, 122, 110, "Publish 10:42", "#E3F2FD")
    s += callout(28, 122, 1)
    s += card(16, 220, 358, 156, "Critical signals", "SSO, approvals, publish failures, quota, and compliance")
    s += chip(30, 268, 94, "SSO Ready", "#DCFCE7")
    s += chip(132, 268, 88, "Approvals 7", "#FEF3C7")
    s += chip(228, 268, 98, "Failures 2", "#FEE2E2")
    s += chip(30, 308, 92, "Quota 1", "#DBEAFE")
    s += chip(130, 308, 116, "Compliance 4", "#FEF3C7")
    s += callout(30, 236, 2)
    s += card(16, 392, 358, 176, "Act now", "Setup gaps and governance alerts move above lower-priority insight")
    s += bullet_list(34, 446, ["Review setup gap", "Open access and roles", "Connector certificate expiring", "Privacy-sensitive export review"])
    s += callout(30, 408, 3)
    s += card(16, 584, 358, 138, "Configuration health", "Desktop grid converts into a scannable vertical list")
    s += bullet_list(34, 638, ["Org structure", "Access", "Workflow", "Branding"])
    s += callout(30, 600, 4)
    s += annotation_panel(16, 738, 358, 88, "Mobile notes", [
        (1, "Boundary kept visible", "Tenant identity and health remain anchored at the top to avoid cross-scope confusion."),
    ])
    save("w0-scr-018-org-admin-home-mobile.svg", s)

    s = desktop_shell("Workflow Administration", "PROD", "Control Plane", ["Home", "Workflow", "Tasks", "Configs", "Audit", "Help"])
    s += chip(296, 152, 112, "Publish queue 3", "#FEF3C7")
    s += chip(420, 152, 108, "Drafts 12", "#E3F2FD")
    s += rect(1000, 146, 158, 40, COLORS["teal"], None, 14)
    s += text(1079, 172, "inverse", "Create template", "middle")
    s += callout(1014, 146, 1)
    s += card(296, 206, 252, 636, "Workflow catalog", "Search, filter, and select workflow templates")
    s += rect(314, 248, 216, 34, COLORS["soft2"], COLORS["border"], 12)
    s += text(328, 270, "small", "Search workflow")
    s += bullet_list(314, 322, ["Hiring approval", "Leave approval", "Exit clearance", "Policy publish", "Document review"])
    s += callout(316, 220, 2)
    s += card(568, 206, 402, 636, "Route preview and version summary", "Live route, draft state, SLA, and escalation path")
    s += chip(586, 248, 108, "Published v6", "#DCFCE7")
    s += chip(704, 248, 88, "Draft v7", "#DBEAFE")
    for i, lab in enumerate(["Submit", "Manager", "HR Review", "Security", "Close"]):
        x = 586 + i * 72
        s += rect(x, 324, 60, 60, COLORS["soft2"], COLORS["border"], 12)
        s += text(x + 30, 350, "small", str(i + 1), "middle")
        s += text(x + 30, 372, "tiny", lab, "middle")
        if i < 4:
            s += line(x + 60, 354, x + 72, 354, COLORS["blue"], 3)
    s += bullet_list(586, 452, ["Escalates after 24h", "Delegation allowed at step 2", "Security step only for high-risk cases"])
    s += callout(586, 220, 3)
    s += card(990, 206, 168, 636, "Execution health", "Stuck items, failures, and active instances")
    s += metric_card(1002, 246, 144, "Active", "128", COLORS["green"])
    s += metric_card(1002, 348, 144, "Stuck", "06", COLORS["red"])
    s += metric_card(1002, 450, 144, "Failed", "03", COLORS["amber"])
    s += bullet_list(1008, 582, ["Approval SLA breach", "Missing approver mapping", "Invalid transition attempt"])
    s += callout(1006, 220, 4)
    s += card(296, 860, 862, 190, "Version history and change actions", "Compare, publish, schedule, and rollback-aware controls")
    s += bullet_list(314, 916, ["v7 Draft saved today", "v6 Published 2 days ago", "Compare changes", "Schedule publish", "Rollback candidate available"])
    s += callout(314, 876, 5)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Governed creation", "New workflow creation is visible but framed inside a publish-controlled admin workspace."),
        (2, "Catalog-first selection", "Admins pick templates quickly before entering route detail or change review."),
        (3, "Route clarity", "Draft and published versions are shown together so route edits stay understandable."),
        (4, "Health and stuck items", "Execution problems stay visible beside design detail rather than in a separate monitor."),
        (5, "Version actions", "Publish, compare, and rollback remain tied to clear version history evidence."),
    ])
    save("w0-scr-006-workflow-admin-desktop.svg", s)

    s = mobile_shell("Workflow Administration", "PROD")
    s += chip(16, 108, 104, "Drafts 12", "#DBEAFE")
    s += chip(128, 108, 120, "Stuck items 6", "#FEE2E2")
    s += callout(28, 122, 1)
    s += card(16, 154, 358, 176, "Workflow list", "Selection-first mobile workflow administration")
    s += bullet_list(34, 210, ["Hiring approval", "Leave approval", "Exit clearance", "Document review"])
    s += callout(30, 170, 2)
    s += card(16, 346, 358, 196, "Selected route", "Published and draft route summary in stacked form")
    s += bullet_list(34, 404, ["Published v6 and Draft v7", "Submit -> Manager -> HR -> Security", "Escalates after 24h", "Delegation allowed"])
    s += callout(30, 362, 3)
    s += card(16, 558, 358, 148, "Execution health", "Stuck and failed transitions remain visible on mobile")
    s += bullet_list(34, 612, ["Active 128", "Stuck 6", "Failed 3"])
    s += callout(30, 574, 4)
    s += annotation_panel(16, 722, 358, 104, "Mobile notes", [
        (1, "List first", "Mobile prioritizes choosing a workflow, then understanding route and health in stacked cards."),
        (2, "Reduced version depth", "Deep compare and rollback remain desktop-oriented actions even though the status is visible here."),
    ])
    save("w0-scr-006-workflow-admin-mobile.svg", s)

    s = desktop_shell("Notification Console", "PROD", "Control Plane", ["Home", "Notifications", "Workflow", "Localization", "Audit", "Help"])
    s += chip(296, 152, 96, "Drafts 5", "#DBEAFE")
    s += chip(404, 152, 116, "SMS warning", "#FEF3C7")
    s += rect(1012, 146, 146, 40, COLORS["teal"], None, 14)
    s += text(1085, 172, "inverse", "Publish draft", "middle")
    s += callout(1024, 146, 1)
    s += card(296, 206, 248, 636, "Template catalog", "Search and filter by event and channel")
    s += rect(314, 248, 212, 34, COLORS["soft2"], COLORS["border"], 12)
    s += text(328, 270, "small", "Search template")
    s += bullet_list(314, 322, ["Offer issued", "Password reset", "Workflow escalated", "Payslip ready", "Document signed"])
    s += callout(316, 220, 2)
    s += card(564, 206, 402, 636, "Editor and preview", "Edit once and compare across channels")
    s += chip(582, 248, 76, "Email", COLORS["blue"])
    s += chip(668, 248, 72, "SMS", COLORS["soft"])
    s += chip(750, 248, 72, "Push", COLORS["soft"])
    s += chip(832, 248, 108, "WhatsApp", COLORS["soft"])
    s += rect(582, 304, 366, 184, "#FBFDFF", COLORS["border"], 12)
    s += text(598, 330, "small", "Subject")
    s += text(598, 356, "body", "Your offer letter is ready")
    s += text(598, 392, "small", "Body preview")
    s += bullet_list(598, 430, ["Hi {employee_name}", "Your offer for {designation} is attached", "Please review before {expiry_date}"])
    s += rect(582, 516, 366, 146, COLORS["soft2"], COLORS["border"], 12)
    s += text(598, 542, "small", "Merge helper")
    s += chip(598, 558, 108, "{employee}", "#E3F2FD")
    s += chip(716, 558, 102, "{expiry}", "#E3F2FD")
    s += chip(828, 558, 108, "{company}", "#E3F2FD")
    s += callout(582, 220, 3)
    s += card(986, 206, 172, 636, "Delivery diagnostics", "Channel health and failure reasons")
    s += metric_card(998, 246, 148, "Success", "97%", COLORS["green"])
    s += metric_card(998, 348, 148, "Retries", "12", COLORS["amber"])
    s += bullet_list(1004, 478, ["SMS provider timeout", "WhatsApp policy lock", "Missing locale fallback"])
    s += callout(998, 220, 4)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Publish control", "Publishing is explicit and separated from casual editing to reduce accidental changes."),
        (2, "Template discovery", "Category and event-based selection remain quick even in a large template library."),
        (3, "Channel-aware preview", "Preview stays close to editing so content and output constraints can be checked together."),
        (4, "Diagnostics nearby", "Delivery failures are visible beside the template instead of in a disconnected report."),
    ])
    save("w0-scr-007-notification-console-desktop.svg", s)

    s = mobile_shell("Notification Console", "PROD")
    s += chip(16, 108, 90, "Drafts 5", "#DBEAFE")
    s += chip(114, 108, 118, "SMS warning", "#FEF3C7")
    s += callout(28, 122, 1)
    s += card(16, 154, 358, 172, "Template list", "Pick template first, then edit and preview")
    s += bullet_list(34, 212, ["Offer issued", "Password reset", "Payslip ready", "Document signed"])
    s += callout(30, 170, 2)
    s += card(16, 342, 358, 212, "Editor and preview", "Channel tabs remain lightweight on mobile")
    s += chip(30, 386, 70, "Email", COLORS["blue"])
    s += chip(108, 386, 64, "SMS", COLORS["soft"])
    s += chip(180, 386, 70, "Push", COLORS["soft"])
    s += bullet_list(34, 444, ["Subject and preview", "Merge helper", "Publish draft"])
    s += callout(30, 358, 3)
    s += card(16, 570, 358, 136, "Diagnostics", "Condensed channel health and failure summary")
    s += bullet_list(34, 624, ["Success 97%", "Retries 12", "SMS provider timeout"])
    s += callout(30, 586, 4)
    s += annotation_panel(16, 722, 358, 104, "Mobile notes", [
        (1, "Stacked editing", "Mobile uses compact channel switching and stacked preview instead of desktop side panels."),
        (2, "Condensed diagnostics", "Operational send failures remain visible but secondary to template editing."),
    ])
    save("w0-scr-007-notification-console-mobile.svg", s)

    s = desktop_shell("Audit Explorer", "Last 7d", "Control Plane", ["Home", "Audit", "Security", "Support", "Exports", "Help"])
    s += rect(1026, 146, 132, 40, COLORS["shell"], None, 14)
    s += text(1092, 172, "inverse", "Request export", "middle")
    s += callout(1038, 146, 1)
    s += card(296, 206, 220, 650, "Filter rail", "Scope the investigation precisely")
    s += bullet_list(314, 262, ["Actor", "Entity", "Action", "Sensitivity", "Date range", "Support session"])
    s += callout(316, 220, 2)
    s += table(536, 206, 420, 650, ["Time", "Actor", "Entity", "Action"], [
        ["10:42", "j.smith", "Employee 224", "Update"],
        ["10:38", "support.bot", "Export", "Request"],
        ["10:11", "r.verma", "Role", "Assign"],
        ["09:58", "m.gupta", "Workflow", "Publish"],
        ["09:32", "a.khan", "Leave", "Approve"],
        ["09:05", "sys.job", "Connector", "Retry"],
    ], [0.18, 0.24, 0.30, 0.28])
    s += callout(552, 220, 3)
    s += card(976, 206, 182, 650, "Detail and diff", "Selected event, masking state, and correlated evidence")
    s += bullet_list(994, 262, ["Event summary", "Before vs after", "Masked fields", "Correlation ID", "Linked support session"])
    s += callout(990, 220, 4)
    s += card(296, 874, 862, 176, "Entity timeline", "Chronology across related events and evidence actions")
    s += line(340, 948, 1068, 948, COLORS["border"], 3)
    for x, lab in [(364, "Create"), (560, "Update"), (756, "Export"), (952, "Review")]:
        s += f'<circle cx="{x}" cy="948" r="8" fill="{COLORS["blue"]}"/>'
        s += text(x - 18, 976, "small", lab)
    s += callout(314, 890, 5)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Export under governance", "Evidence export is available but does not overpower the investigation flow."),
        (2, "Filter precision", "Investigations start with actor, entity, sensitivity, and support context filtering."),
        (3, "Dense event grid", "Analysts can scan many events before opening one in detail."),
        (4, "Masked diff logic", "Selected-event detail keeps masking and value changes inseparable."),
        (5, "Chronology support", "Entity timeline supports sequence reconstruction after the immediate event review."),
    ])
    save("w0-scr-008-audit-explorer-desktop.svg", s)

    s = mobile_shell("Audit Explorer", "7 Days")
    s += rect(16, 108, 358, 52, COLORS["panel"], COLORS["border"], 16, True)
    s += text(34, 140, "small", "Actor  Entity  Action  Sensitivity  Date")
    s += callout(28, 122, 1)
    s += card(16, 176, 358, 240, "Event list", "Investigation starts from a stacked event feed on mobile")
    for i, lab in enumerate(["Employee updated", "Export requested", "Role assigned", "Workflow published"]):
        y = 222 + i * 48
        s += rect(30, y, 330, 38, "#FBFDFF", COLORS["border"], 12)
        s += text(44, y + 24, "body", lab)
        s += text(270, y + 24, "small", "Open detail")
    s += callout(30, 192, 2)
    s += card(16, 432, 358, 176, "Selected event detail", "Summary, diff, masking, and correlation stacked vertically")
    s += bullet_list(34, 486, ["Event summary", "Before and after values", "Masked fields", "Correlation ID"])
    s += callout(30, 448, 3)
    s += card(16, 624, 358, 104, "Timeline", "Related chronology remains visible as a compact sequence")
    s += bullet_list(34, 676, ["Create", "Update", "Export"])
    s += callout(30, 640, 4)
    s += annotation_panel(16, 744, 358, 82, "Mobile notes", [
        (1, "Card-based investigation", "Mobile replaces the split view with event cards and a selected-event detail state."),
    ])
    save("w0-scr-008-audit-explorer-mobile.svg", s)

    s = desktop_shell("Runtime Monitor", "PROD", "Control Plane", ["Home", "Runtime", "Integrations", "Incidents", "Replay", "Help"])
    s += chip(296, 152, 110, "Incidents 2", "#FEE2E2")
    s += chip(418, 152, 124, "Replay queue 3", "#FEF3C7")
    s += callout(312, 166, 1)
    for x, title_text, val, color in [
        (296, "Throughput", "1.2M", COLORS["green"]),
        (518, "Failures", "128", COLORS["red"]),
        (740, "Consumer lag", "32s", COLORS["amber"]),
        (962, "DLQ", "41", COLORS["blue"]),
    ]:
        s += metric_card(x, 206, 198, title_text, val, color)
    s += callout(322, 222, 2)
    s += table(296, 318, 520, 732, ["Topic", "Status", "Thru", "Lag", "Last fail"], [
        ["employee.changed", "Healthy", "420k", "2s", "-"],
        ["workflow.updated", "Lagging", "180k", "32s", "09:55"],
        ["notif.sent", "Degraded", "210k", "12s", "10:14"],
        ["doc.generated", "Failed", "24k", "91s", "10:22"],
        ["payroll.closed", "Healthy", "7k", "1s", "-"],
    ], [0.28, 0.18, 0.16, 0.16, 0.22])
    s += callout(314, 334, 3)
    s += card(836, 318, 322, 732, "Failure drill-down and recovery", "Investigate route failure and launch safe replay actions")
    s += bullet_list(854, 374, ["Selected route: doc.generated", "Failure sample and retry path", "Replay eligibility", "Pause consumer", "Incident handoff"])
    s += rect(854, 560, 126, 38, COLORS["blue"], None, 12)
    s += text(917, 584, "inverse", "Replay safe", "middle")
    s += rect(992, 560, 138, 38, "#FDEAD7", None, 12)
    s += text(1061, 584, "body", "Pause consumer", "middle")
    s += callout(854, 334, 4)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Incident summary", "High-level operational flags stay visible at the top for fast triage."),
        (2, "Signal strip", "Core runtime metrics are scan-friendly before deeper route analysis begins."),
        (3, "Topic grid", "Operators can compare route health across the runtime in one dense surface."),
        (4, "Recovery actions", "Failure diagnosis and replay-safe actions stay together to reduce context switching."),
    ])
    save("w0-scr-009-runtime-monitor-desktop.svg", s)

    s = mobile_shell("Runtime Monitor", "PROD")
    s += chip(16, 108, 100, "Incidents 2", "#FEE2E2")
    s += chip(124, 108, 112, "Replay 3", "#FEF3C7")
    s += callout(28, 122, 1)
    s += card(16, 154, 358, 150, "Top signals", "Throughput, failures, lag, and dead-letter counts lead on mobile")
    s += bullet_list(34, 210, ["Throughput 1.2M", "Failures 128", "Consumer lag 32s", "DLQ 41"])
    s += callout(30, 170, 2)
    s += card(16, 320, 358, 210, "Route health", "Routes convert into stacked health cards")
    for i, lab in enumerate(["employee.changed healthy", "workflow.updated lagging", "doc.generated failed"]):
        y = 368 + i * 48
        s += rect(30, y, 330, 38, "#FBFDFF", COLORS["border"], 12)
        s += text(44, y + 24, "body", lab)
    s += callout(30, 336, 3)
    s += card(16, 546, 358, 160, "Recovery actions", "Replay and incident actions are grouped in one mobile action zone")
    s += bullet_list(34, 600, ["Failure sample", "Replay safe", "Pause consumer", "Incident handoff"])
    s += callout(30, 562, 4)
    s += annotation_panel(16, 722, 358, 104, "Mobile notes", [
        (1, "Operational compression", "Mobile reduces the dense monitor into signals, route cards, and a compact action zone."),
        (2, "Safe-action framing", "Recovery actions remain visible but clearly separated from passive monitoring."),
    ])
    save("w0-scr-009-runtime-monitor-mobile.svg", s)

    s = desktop_shell("Document Template Builder", "Draft", "Control Plane", ["Home", "Templates", "Documents", "Localization", "Jobs", "Help"])
    s += chip(296, 152, 108, "Draft v4", "#DBEAFE")
    s += chip(416, 152, 112, "Jobs failed 3", "#FEE2E2")
    s += rect(944, 146, 94, 40, COLORS["blue"], None, 14)
    s += text(991, 172, "inverse", "Preview", "middle")
    s += rect(1050, 146, 108, 40, COLORS["teal"], None, 14)
    s += text(1104, 172, "inverse", "Publish", "middle")
    s += callout(956, 146, 1)
    s += card(296, 206, 220, 650, "Template library", "Find, filter, and select governed templates")
    s += rect(314, 248, 184, 34, COLORS["soft2"], COLORS["border"], 12)
    s += text(328, 270, "small", "Search template")
    s += bullet_list(314, 322, ["Offer letter", "Appointment letter", "Payslip", "Warning notice", "Policy acknowledgment"])
    s += callout(316, 220, 2)
    s += card(536, 206, 420, 650, "Builder canvas and merge preview", "Edit content, inspect placeholders, and preview output")
    s += rect(554, 248, 384, 320, "#FBFDFF", COLORS["border"], 12)
    s += text(572, 278, "small", "Canvas")
    s += bullet_list(572, 326, ["Header and branding block", "Recipient details", "Compensation section", "Terms and signature block"])
    s += rect(554, 588, 384, 120, "#FFF7ED", COLORS["border"], 12)
    s += text(572, 616, "h3", "Unresolved placeholders")
    s += bullet_list(572, 652, ["{joining_date} missing", "{comp_band} missing"])
    s += callout(554, 220, 3)
    s += card(976, 206, 182, 650, "Generation monitor", "Track render jobs, failures, and retries")
    s += metric_card(988, 246, 158, "Success", "94%", COLORS["green"])
    s += metric_card(988, 348, 158, "Failures", "03", COLORS["red"])
    s += bullet_list(994, 478, ["Offer letter render failed", "Payslip merge timeout", "Retry queued"])
    s += callout(990, 220, 4)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Preview and publish", "Both actions remain near the page title but draft state is still explicit."),
        (2, "Library selection", "Template discovery stays separate from editing to protect version governance."),
        (3, "Canvas with warnings", "Builder and unresolved placeholder alerts stay in the same visual flow."),
        (4, "Job monitor", "Render-job failures remain adjacent to the template so issue resolution is faster."),
    ])
    save("w0-scr-010-document-builder-desktop.svg", s)

    s = mobile_shell("Document Template Builder", "Draft")
    s += chip(16, 108, 98, "Draft v4", "#DBEAFE")
    s += chip(122, 108, 112, "Failures 3", "#FEE2E2")
    s += callout(28, 122, 1)
    s += card(16, 154, 358, 166, "Template library", "Select a template before entering the builder flow")
    s += bullet_list(34, 212, ["Offer letter", "Appointment letter", "Payslip", "Policy acknowledgment"])
    s += callout(30, 170, 2)
    s += card(16, 336, 358, 222, "Canvas and preview", "Builder content is represented as structured sections on mobile")
    s += bullet_list(34, 394, ["Header section", "Recipient details", "Terms section", "Preview merged output"])
    s += rect(30, 494, 330, 48, "#FFF7ED", COLORS["border"], 12)
    s += text(46, 522, "small", "Unresolved placeholders: joining_date, comp_band")
    s += callout(30, 352, 3)
    s += card(16, 574, 358, 132, "Generation monitor", "Recent failures and retry status shown as compact cards")
    s += bullet_list(34, 628, ["Success 94%", "Failures 3", "Retry queued"])
    s += callout(30, 590, 4)
    s += annotation_panel(16, 722, 358, 104, "Mobile notes", [
        (1, "Section-based builder", "Mobile presents the template as structured sections rather than a full desktop canvas."),
        (2, "Warning visibility", "Placeholder errors remain highly visible even in the compact flow."),
    ])
    save("w0-scr-010-document-builder-mobile.svg", s)

    s = desktop_shell("AI Platform Policy and Evaluation Console", "AI GOV", "Control Plane", ["Home", "AI Governance", "Evaluations", "Policies", "Audit", "Help"])
    s += chip(296, 152, 122, "Guardrail alerts 4", "#FEE2E2")
    s += chip(430, 152, 132, "Cost spike review", "#FEF3C7")
    s += chip(574, 152, 138, "Prompt approvals 3", "#DBEAFE")
    s += rect(1012, 146, 146, 40, COLORS["teal"], None, 14)
    s += text(1085, 172, "inverse", "Publish policy", "middle")
    s += callout(1024, 146, 1)
    s += card(296, 206, 248, 636, "Policy catalog", "Model routes, prompt packs, data rules, and region controls")
    s += rect(314, 248, 212, 34, COLORS["soft2"], COLORS["border"], 12)
    s += text(328, 270, "small", "Search policy or prompt")
    s += bullet_list(314, 322, ["Data masking policy", "Prompt bundle approvals", "Restricted-region block", "Sensitive export guardrail", "Command execution policy"])
    s += callout(316, 220, 2)
    s += card(564, 206, 420, 636, "Evaluation and policy detail", "Side-by-side view of active policy, scores, and release state")
    s += chip(582, 248, 110, "Policy v12", "#DCFCE7")
    s += chip(702, 248, 126, "Draft v13", "#DBEAFE")
    s += chip(838, 248, 128, "Eval pass 92%", "#E3F2FD")
    s += rect(582, 304, 384, 168, "#FBFDFF", COLORS["border"], 12)
    s += text(598, 330, "small", "Active policy summary")
    s += bullet_list(598, 366, ["Restricted payroll fields blocked", "Command execution confirm-first", "Low-confidence replies escalate to human", "Tenant region override pending review"])
    s += rect(582, 490, 184, 122, COLORS["panel"], COLORS["border"], 12, True)
    s += text(598, 516, "small", "Evaluation pack")
    s += text(598, 548, "metric", "184")
    s += text(668, 548, "body", "scenarios")
    s += text(598, 574, "small", "Bias, safety, and action-confirmation coverage")
    s += rect(782, 490, 184, 122, COLORS["panel"], COLORS["border"], 12, True)
    s += text(798, 516, "small", "Model route")
    s += text(798, 548, "metric", "3")
    s += text(852, 548, "body", "active lanes")
    s += text(798, 574, "small", "general, restricted, and analytics routing")
    s += callout(582, 220, 3)
    s += card(1004, 206, 154, 636, "Live incidents", "Current violations, cost spikes, and blocked executions")
    s += metric_card(1014, 246, 134, "Alerts", "04", COLORS["red"])
    s += metric_card(1014, 348, 134, "Cost delta", "+18%", COLORS["amber"])
    s += metric_card(1014, 450, 134, "Escalations", "06", COLORS["blue"])
    s += bullet_list(1016, 582, ["Payroll command blocked", "PII leak test failed", "Region rule mismatch", "Prompt publish awaiting review"])
    s += callout(1018, 220, 4)
    s += card(296, 860, 862, 190, "Compare, approve, and publish", "Draft-versus-live change review with explicit evidence before release")
    s += rect(314, 904, 142, 42, "#FBFDFF", COLORS["border"], 12)
    s += rect(472, 904, 146, 42, "#FBFDFF", COLORS["border"], 12)
    s += rect(634, 904, 176, 42, "#FBFDFF", COLORS["border"], 12)
    s += rect(826, 904, 314, 42, "#FBFDFF", COLORS["border"], 12)
    s += text(326, 930, "small", "Policy diff")
    s += text(484, 930, "small", "Risk score")
    s += text(646, 930, "small", "Approval chain")
    s += text(838, 930, "small", "Release note and rollback note")
    s += callout(314, 876, 5)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Publish behind governance", "Policy publishing is visible, but always framed as a controlled release action."),
        (2, "Catalog-first administration", "Admins locate policy families and prompt packs quickly before deeper review."),
        (3, "Evaluation beside policy", "Policy state and evaluation evidence stay together to avoid blind promotion."),
        (4, "Incident visibility", "Violations and cost spikes remain in the same workspace as policy actions."),
        (5, "Compare before release", "Draft and live policy comparison is treated as a first-class release ritual."),
    ])
    save("w0-scr-011-ai-policy-console-desktop.svg", s)

    s = mobile_shell("AI Policy Console", "AI GOV")
    s += chip(16, 108, 110, "Alerts 4", "#FEE2E2")
    s += chip(134, 108, 120, "Cost +18%", "#FEF3C7")
    s += chip(262, 108, 112, "Draft v13", "#DBEAFE")
    s += callout(28, 122, 1)
    s += card(16, 154, 358, 176, "Policy selection", "Mobile leads with policy family selection and release context")
    s += bullet_list(34, 212, ["Data masking policy", "Prompt approvals", "Sensitive export guardrail", "Command execution policy"])
    s += callout(30, 170, 2)
    s += card(16, 346, 358, 206, "Evaluation summary", "Live policy, score, and release state stack into one review surface")
    s += bullet_list(34, 404, ["Policy v12 live and Draft v13 pending", "Eval pass 92%", "184 scenarios covered", "Human escalation enabled"])
    s += callout(30, 362, 3)
    s += card(16, 568, 358, 138, "Incident and approval stack", "Violations and approvals sit above publish action")
    s += bullet_list(34, 622, ["Payroll command blocked", "PII leak test failed", "Publish review pending"])
    s += callout(30, 584, 4)
    s += annotation_panel(16, 722, 358, 104, "Mobile notes", [
        (1, "Governance first", "Mobile keeps alerts, draft state, and approval context ahead of lower-priority detail."),
        (2, "No blind publish", "Release actions remain downstream of evaluation and incident visibility."),
    ])
    save("w0-scr-011-ai-policy-console-mobile.svg", s)

    s = desktop_shell("Employee Home", "Self", "My Workspace", ["Home", "Profile", "Requests", "Leave and Attendance", "Pay and Tax", "Learning"])
    s += chip(296, 152, 118, "Actions due 4", COLORS["red"])
    s += chip(426, 152, 110, "Payday Fri", "#DCFCE7")
    s += chip(548, 152, 144, "Announcements 3", "#E3F2FD")
    s += rect(808, 146, 174, 40, COLORS["blue"], None, 14)
    s += text(895, 172, "inverse", "Ask HR assistant", "middle")
    s += rect(994, 146, 164, 40, COLORS["teal"], None, 14)
    s += text(1076, 172, "inverse", "Start request", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search, ask, or type a command like show my leave balance")
    s += chip(856, 226, 102, "Ask", COLORS["soft"])
    s += chip(968, 226, 94, "Command", COLORS["soft"])
    s += chip(1072, 226, 68, "Go", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Pending actions", "04", COLORS["red"]),
        (518, "Requests open", "03", COLORS["amber"]),
        (740, "Leave balance", "12.5", COLORS["blue"]),
        (962, "Learning due", "02", COLORS["teal"]),
        (1184, "Payslips", "Ready", COLORS["green"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "My actions", "The employee starts from due work, not from navigation complexity")
    s += bullet_list(314, 484, ["Acknowledge policy update", "Upload tax proof", "Submit missing punch regularization", "Complete onboarding learning module"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI assistant and quick tasks", "Context-aware help, next-step recommendations, and safe task launch")
    s += rect(666, 470, 474, 84, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI recommendation")
    s += text(684, 522, "body", "Your attendance shows one unresolved missing punch from Tuesday.")
    s += text(684, 544, "small", "Suggested next step: open regularization and prefill available punch context.")
    s += rect(666, 572, 146, 36, COLORS["blue"], None, 12)
    s += text(739, 596, "inverse", "Review suggestion", "middle")
    s += rect(826, 572, 120, 36, "#EEF2FF", None, 12)
    s += text(886, 596, "body", "Ask why", "middle")
    s += rect(960, 572, 180, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1050, 596, "small", "Command history and policy links")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Requests and documents", "Recent requests, document tasks, and payslip availability")
    s += bullet_list(314, 774, ["Leave request pending manager approval", "Expense claim draft saved", "June payslip published", "Document acknowledgment due today"])
    s += card(648, 712, 510, 220, "Leave, pay, learning, and announcements", "The dashboard balances action, information, and employee growth")
    s += bullet_list(666, 774, ["Leave balance and holiday note", "Tax declaration window status", "Learning bundle progress 2 of 5", "Announcement: hybrid policy update"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Personalized widgets", "Widget layout, visibility, and ordering should adapt to employee preference and lifecycle stage")
    s += chip(320, 990, 122, "Requests", "#E3F2FD")
    s += chip(454, 990, 118, "Leave", "#EEF2FF")
    s += chip(584, 990, 114, "Payslips", "#DCFCE7")
    s += chip(710, 990, 118, "Learning", "#FEF3C7")
    s += chip(840, 990, 152, "Announcements", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Action and assistance together", "Employees can launch a request or ask the assistant from the same first-view action strip."),
        (2, "Unified command entry", "Search, ask, and command behavior share one bar to reduce navigation friction."),
        (3, "Signal strip", "Core personal metrics stay visible above the fold for quick self-service orientation."),
        (4, "Action-first left rail", "Due items are visually stronger than passive information blocks."),
        (5, "Explainable AI panel", "Recommendations include next step, rationale path, and controlled launch action."),
        (6, "Balanced information layout", "Requests, leave, pay, learning, and announcements share one coherent employee landing page."),
        (7, "Personalization visible", "Widget layout reflects dashboard personalization as a first-class experience feature."),
    ])
    save("emp-scr-001-employee-home-desktop.svg", s)

    s = mobile_shell("Employee Home", "Self")
    s += chip(16, 108, 98, "Due 4", "#FEE2E2")
    s += chip(122, 108, 96, "Payday", "#DCFCE7")
    s += chip(226, 108, 120, "Leave 12.5", "#DBEAFE")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search, ask, or type a command")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 146, "My actions", "Critical employee tasks appear before passive content")
    s += bullet_list(34, 284, ["Acknowledge policy update", "Upload tax proof", "Regularize missing punch"])
    s += callout(30, 244, 3)
    s += card(16, 390, 358, 176, "AI assistant", "Recommendations and safe actions stack into one mobile card")
    s += bullet_list(34, 446, ["Missing punch found for Tuesday", "Suggested action: open regularization", "Ask why this was suggested", "Escalate to helpdesk if needed"])
    s += rect(30, 510, 154, 36, COLORS["blue"], None, 12)
    s += text(107, 534, "inverse", "Open suggestion", "middle")
    s += rect(198, 510, 162, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(279, 534, "body", "Ask policy assistant", "middle")
    s += callout(30, 406, 4)
    s += card(16, 582, 358, 154, "Widgets and updates", "Requests, leave, pay, learning, and announcements collapse into stacked tiles")
    s += bullet_list(34, 638, ["Request pending", "Payslip ready", "Learning 2 of 5 complete", "Hybrid policy announcement"])
    s += callout(30, 598, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Command-first mobile", "The assistant entry stays near the top because it reduces taps across many employee tasks."),
    ])
    save("emp-scr-001-employee-home-mobile.svg", s)

    s = desktop_shell("Team Dashboard", "Manager", "Team Command Center", ["Dashboard", "People", "Approvals", "Attendance", "Performance", "Hiring"])
    s += chip(296, 152, 128, "Approvals 11", "#FEE2E2")
    s += chip(436, 152, 146, "Absence spike", "#FEF3C7")
    s += chip(594, 152, 150, "Review cycle live", "#EDE9FE")
    s += rect(808, 146, 178, 40, COLORS["blue"], None, 14)
    s += text(897, 172, "inverse", "Ask manager copilot", "middle")
    s += rect(998, 146, 160, 40, COLORS["teal"], None, 14)
    s += text(1078, 172, "inverse", "Open approvals", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search, ask, or type a command like show team leave risks")
    s += chip(856, 226, 98, "Ask", COLORS["soft"])
    s += chip(964, 226, 110, "Command", COLORS["soft"])
    s += chip(1084, 226, 56, "Go", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Pending approvals", "11", COLORS["red"]),
        (518, "Team present", "86%", COLORS["green"]),
        (740, "Leave today", "07", COLORS["amber"]),
        (962, "Reviews due", "05", COLORS["blue"]),
        (1184, "Risk watch", "03", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Priority approvals", "Managers need the queue, SLA, and policy context before secondary analytics")
    s += bullet_list(314, 484, ["Leave request: Priya Shah - awaiting action today", "Promotion request: Anil Kumar - budget note attached", "Travel approval: Meera Jain - finance concurrence needed", "Expense exception: overtime meal claim returned for review"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "Manager copilot and guided actions", "AI summarizes risk, suggests follow-up, and never bypasses decision control")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI recommendation")
    s += text(684, 522, "body", "Three consecutive absences in support pod B may affect shift coverage tomorrow.")
    s += text(684, 544, "small", "Suggested next step: review attendance exceptions, notify backup roster, and check pending leave overlap.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review actions", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Escalate to HRBP", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Team health snapshot", "Team availability, attendance, and engagement indicators stay close to action")
    s += bullet_list(314, 774, ["Support pod B absence spike above threshold", "Two team members on probation ending this month", "One low-survey sentiment trend needs follow-up", "Delegated approver active for West region"])
    s += card(648, 712, 510, 220, "Growth, hiring, and skills watch", "The manager landing page must support both daily approvals and talent decisions")
    s += bullet_list(666, 774, ["Five reviews due this week", "Two internal mobility matches suggested by skills graph", "One requisition blocked by interview feedback delay", "Leadership pipeline depth marked medium for engineering pod"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Personalized manager widgets", "Managers can tailor cards for roster, hiring, reviews, workload, and risk signals by operating context")
    s += chip(320, 990, 116, "Approvals", "#FEE2E2")
    s += chip(448, 990, 124, "Attendance", "#DCFCE7")
    s += chip(584, 990, 110, "Reviews", "#DBEAFE")
    s += chip(706, 990, 98, "Hiring", "#FEF3C7")
    s += chip(816, 990, 144, "Skills match", "#EDE9FE")
    s += chip(972, 990, 106, "Risks", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Manager-first actions", "The hero strip balances AI help with direct access to the approvals queue."),
        (2, "Typed command execution", "Managers can search, ask, or trigger guided commands from one governed entry point."),
        (3, "Actionable team signals", "Metrics reflect team operations, not employee self-service indicators."),
        (4, "Queue before dashboards", "Pending decisions are stronger than passive charts because the role is operational."),
        (5, "Explainable risk guidance", "Copilot recommendations show the reason, next steps, and human escalation path."),
        (6, "Daily plus strategic scope", "Growth, hiring, risk, and availability sit together because manager work spans both horizons."),
        (7, "Personalization for org context", "Different managers can surface pods, shifts, or review-heavy widgets based on their teams."),
    ])
    save("mgr-scr-001-team-dashboard-desktop.svg", s)

    s = mobile_shell("Team Dashboard", "Manager")
    s += chip(16, 108, 116, "Approvals 11", "#FEE2E2")
    s += chip(140, 108, 122, "Absence spike", "#FEF3C7")
    s += chip(270, 108, 104, "Reviews 5", "#DBEAFE")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search, ask, or type a manager command")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 146, "Priority approvals", "Approvals remain the first operational surface on mobile")
    s += bullet_list(34, 284, ["Leave request due today", "Promotion request with budget note", "Travel approval needs finance concurrence"])
    s += callout(30, 244, 3)
    s += card(16, 390, 358, 182, "Manager copilot", "Risk summary and guided actions stay compact but explicit")
    s += bullet_list(34, 446, ["Absence spike may affect tomorrow shift coverage", "Suggested step: open attendance exceptions", "Ask why this recommendation appeared", "Escalate to HRBP when needed"])
    s += rect(30, 516, 146, 36, COLORS["blue"], None, 12)
    s += text(103, 540, "inverse", "Review actions", "middle")
    s += rect(190, 516, 170, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(275, 540, "body", "Open approvals queue", "middle")
    s += callout(30, 406, 4)
    s += card(16, 588, 358, 148, "Team health and growth", "Attendance, reviews, skills, and hiring collapse into one summary stack")
    s += bullet_list(34, 644, ["Two probation endings this month", "Two skills-based mobility matches", "One requisition blocked", "Low sentiment trend flagged"])
    s += callout(30, 604, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Queue-led mobile", "Small screens prioritize the approvals queue and team exception handling before broader insight detail."),
    ])
    save("mgr-scr-001-team-dashboard-mobile.svg", s)

    s = desktop_shell("Attendance Control Center", "Workforce", "Attendance and Exception Review", ["Attendance", "Exceptions", "Regularizations", "Shifts", "Devices", "Exports"])
    s += chip(296, 152, 138, "Exceptions 24", "#FEE2E2")
    s += chip(446, 152, 158, "Selfie review 07", "#FEF3C7")
    s += chip(616, 152, 168, "Devices degraded 02", "#EDE9FE")
    s += rect(808, 146, 180, 40, COLORS["blue"], None, 14)
    s += text(898, 172, "inverse", "Review anomalies", "middle")
    s += rect(1000, 146, 158, 40, COLORS["teal"], None, 14)
    s += text(1079, 172, "inverse", "Open regularizations", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search employee, day, device, or anomaly like geofence mismatch")
    s += chip(856, 226, 110, "Filters", COLORS["soft"])
    s += chip(976, 226, 126, "Confidence", COLORS["soft"])
    s += chip(1112, 226, 28, ">", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Present today", "1,248", COLORS["green"]),
        (518, "Open exceptions", "24", COLORS["red"]),
        (740, "Regularizations", "18", COLORS["amber"]),
        (962, "Geo mismatches", "05", COLORS["blue"]),
        (1184, "Spoof risk", "03", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Exception queue", "Attendance operations begin with unresolved exceptions, not raw punch volume")
    s += bullet_list(314, 484, ["Riya Sen - missing out punch - shift B", "Manoj Das - mobile check-in outside geofence", "Kiosk lane 3 - duplicate punch burst detected", "Nikita Rao - cross-midnight shift unresolved"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI confidence and capture review", "Selfie, kiosk, GPS, QR, and biometric anomalies need an explainable review surface")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "Confidence review")
    s += text(684, 522, "body", "Selfie check-in confidence fell below threshold for employee 10492 at Pune plant gate 2.")
    s += text(684, 544, "small", "Suggested next step: compare prior captures, confirm geofence, then route for manual verification.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review evidence", "middle")
    s += rect(834, 574, 136, 36, "#EEF2FF", None, 12)
    s += text(902, 598, "body", "Ask why", "middle")
    s += rect(984, 574, 156, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1062, 598, "small", "Manual verify", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Capture mode coverage", "Operations must see how attendance arrived before deciding whether an exception is genuine")
    s += bullet_list(314, 774, ["Biometric 61%", "Mobile GPS 18%", "QR 9%", "AI selfie and kiosk 8%", "Manual correction 4%"])
    s += card(648, 712, 510, 220, "Regularization and finalization readiness", "Regularizations, payroll-lock windows, and device health belong in the same operational screen")
    s += bullet_list(666, 774, ["18 regularizations pending manager or admin action", "Payroll period closes in 2 days with 6 unresolved records", "Device HUB-03 offline since 09:42", "Auto-finalization blocked for plant east unit"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned filters and operating widgets", "Attendance teams can pin shift, location, source mode, payroll period, and anomaly type views")
    s += chip(320, 990, 92, "Shift B", "#DCFCE7")
    s += chip(424, 990, 118, "Pune plant", "#DBEAFE")
    s += chip(554, 990, 132, "Geo mismatch", "#FEE2E2")
    s += chip(698, 990, 122, "Kiosk review", "#FEF3C7")
    s += chip(832, 990, 110, "July P2", "#EDE9FE")
    s += chip(954, 990, 142, "Needs payroll", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Operations-first hero", "The top strip directs users to anomaly review and regularization closure before passive exploration."),
        (2, "Issue-driven search", "Search and filters are centered on exception handling, not just attendance lookup."),
        (3, "Decision metrics", "The signal row balances attendance volume, exception load, and fraud or confidence indicators."),
        (4, "Queue-led workflow", "The left primary card keeps unresolved cases as the visual anchor for time operations."),
        (5, "Explainable AI review", "AI-assisted confidence review exposes reason, evidence path, and manual override route."),
        (6, "Exception plus close readiness", "Regularization backlog and payroll finalization risk remain side-by-side."),
        (7, "Shift and source context", "Pinned widgets help ops teams stay inside the exact plant, source, and period lens they manage."),
    ])
    save("wrk-scr-001-attendance-control-center-desktop.svg", s)

    s = mobile_shell("Attendance Control", "Workforce")
    s += chip(16, 108, 118, "Exceptions 24", "#FEE2E2")
    s += chip(142, 108, 114, "Selfie 7", "#FEF3C7")
    s += chip(264, 108, 110, "Device 2", "#EDE9FE")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search day, employee, device, or anomaly")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Exception queue", "Unresolved cases remain the first mobile view for attendance admins")
    s += bullet_list(34, 284, ["Missing out punch", "Geofence mismatch", "Duplicate kiosk burst", "Cross-midnight unresolved"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI confidence review", "Low-confidence selfie or kiosk records stay explainable and reviewable")
    s += bullet_list(34, 456, ["Confidence below threshold at gate 2", "Compare prior captures", "Confirm geofence before manual verify", "Route to approver if suspicious"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review evidence", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open regularizations", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Readiness summary", "Capture mix, device health, and payroll lock risk condense into one stack")
    s += bullet_list(34, 652, ["Biometric 61%", "18 regularizations pending", "Period closes in 2 days", "HUB-03 offline"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Exception-driven mobile", "Small screens focus on case closure, evidence review, and finalization risk over secondary charts."),
    ])
    save("wrk-scr-001-attendance-control-center-mobile.svg", s)

    s = desktop_shell("Payroll Control Center", "Payroll", "Run Validation and Release", ["Runs", "Validation", "Exceptions", "Employees", "Bank Advice", "Close"])
    s += chip(296, 152, 126, "Run open", "#DCFCE7")
    s += chip(434, 152, 132, "Blockers 09", "#FEE2E2")
    s += chip(578, 152, 162, "Variance alert 04", "#FEF3C7")
    s += rect(808, 146, 174, 40, COLORS["blue"], None, 14)
    s += text(895, 172, "inverse", "Review blockers", "middle")
    s += rect(994, 146, 164, 40, COLORS["teal"], None, 14)
    s += text(1076, 172, "inverse", "Open sign-off", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search payroll run, employee, rule code, variance, or exception")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 118, "Severity", COLORS["soft"])
    s += chip(1092, 226, 48, "Run", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Employees ready", "4,182", COLORS["green"]),
        (518, "Blocking issues", "09", COLORS["red"]),
        (740, "Warnings", "27", COLORS["amber"]),
        (962, "Waivers", "06", COLORS["blue"]),
        (1184, "Close risk", "High", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Validation and exception queue", "Payroll operations need clustered blockers and ownership, not a flat log stream")
    s += bullet_list(314, 484, ["Bank account missing - 3 employees - HR ops owner", "Negative net pay variance > threshold - 2 employees", "Attendance finalization changed after pass - rerun required", "Loan recovery over-cap - finance review pending"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI anomaly triage", "AI may explain patterns and suggest likely source teams but must never auto-waive or auto-approve")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI explanation")
    s += text(684, 522, "body", "Net pay spike cluster likely links to overtime import correction in plant east and retro allowance release.")
    s += text(684, 544, "small", "Suggested next step: compare prior period, inspect source import batch, and confirm approval note before rerun.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review evidence", "middle")
    s += rect(834, 574, 134, 36, "#EEF2FF", None, 12)
    s += text(901, 598, "body", "Ask why", "middle")
    s += rect(982, 574, 158, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1061, 598, "small", "Assign owner", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Run and control totals", "Run status must stay tied to totals, readiness, and downstream release dependencies")
    s += bullet_list(314, 774, ["Gross pay within 0.8% of forecast", "Net pay control total pending 2 blocked cohorts", "Bank advice not generated", "Statutory file package draft ready"])
    s += card(648, 712, 510, 220, "Waiver and sign-off readiness", "Warnings, waivers, rerun lineage, and sign-off evidence belong on the same screen")
    s += bullet_list(666, 774, ["6 warnings already waived with approver rationale", "2 blockers reopened after source correction", "Rerun lineage available for July M2", "Dual-control sign-off still required before close"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned payroll views", "Payroll teams can lock views by entity, payroll group, country, severity, or approval stage")
    s += chip(320, 990, 110, "India M2", "#DCFCE7")
    s += chip(442, 990, 132, "Plant East", "#DBEAFE")
    s += chip(586, 990, 118, "Blocking", "#FEE2E2")
    s += chip(716, 990, 126, "Variance", "#FEF3C7")
    s += chip(854, 990, 120, "Waivers", "#EDE9FE")
    s += chip(986, 990, 114, "Close risk", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Run-led action strip", "The first actions point to blockers and sign-off because payroll decisions are stage-sensitive."),
        (2, "Governed payroll search", "Search centers on run, rule, employee, and variance context rather than generic navigation."),
        (3, "Control metrics", "The signal row blends processing volume, blocker count, waiver activity, and release risk."),
        (4, "Operational clustering", "Exceptions are framed as grouped work items with owners and business impact."),
        (5, "Explainable anomaly AI", "AI offers cause hypotheses and next steps but does not replace waiver or approval control."),
        (6, "Sign-off in context", "Waivers, reruns, and close readiness remain adjacent so processors and approvers share one truth."),
        (7, "Entity-focused filters", "Pinned views support the way payroll teams actually divide work by run, entity, and severity."),
    ])
    save("pay-scr-001-payroll-control-center-desktop.svg", s)

    s = mobile_shell("Payroll Control", "Payroll")
    s += chip(16, 108, 104, "Run open", "#DCFCE7")
    s += chip(128, 108, 106, "Blockers 9", "#FEE2E2")
    s += chip(242, 108, 132, "Variance 4", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search run, employee, rule, or variance")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Validation queue", "Blockers and clustered failures remain the first mobile priority")
    s += bullet_list(34, 284, ["Missing bank details", "Negative net pay cluster", "Late attendance change", "Loan recovery over-cap"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI anomaly triage", "Anomaly explanation stays advisory and evidence-led on mobile too")
    s += bullet_list(34, 456, ["Net pay spike tied to overtime correction", "Compare prior period and source batch", "Confirm approval note before rerun", "Assign to HR ops or finance owner"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review evidence", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open sign-off", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Readiness summary", "Warnings, waivers, and close gating compress into one decision stack")
    s += bullet_list(34, 652, ["27 warnings", "6 waivers", "2 blockers reopened", "Dual-control sign-off pending"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Approval-safe mobile", "Mobile keeps blockers, evidence, and sign-off boundaries in view before any close action."),
    ])
    save("pay-scr-001-payroll-control-center-mobile.svg", s)

    s = desktop_shell("Case Management Workbench", "Support", "Agent Console", ["Cases", "Queues", "Playbooks", "Knowledge", "SLA", "Escalations"])
    s += chip(296, 152, 124, "Open cases 42", "#DBEAFE")
    s += chip(432, 152, 128, "SLA risk 08", "#FEE2E2")
    s += chip(572, 152, 148, "Escalations 05", "#FEF3C7")
    s += rect(808, 146, 176, 40, COLORS["blue"], None, 14)
    s += text(896, 172, "inverse", "Review playbook", "middle")
    s += rect(996, 146, 162, 40, COLORS["teal"], None, 14)
    s += text(1077, 172, "inverse", "Open escalations", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search case, employee, category, SLA, or escalation signal")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 108, "Queues", COLORS["soft"])
    s += chip(1082, 226, 58, "Case", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Assigned today", "18", COLORS["green"]),
        (518, "SLA risk", "08", COLORS["red"]),
        (740, "Awaiting user", "11", COLORS["amber"]),
        (962, "AI triage", "13", COLORS["blue"]),
        (1184, "Escalated", "05", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Priority case queue", "Agents need queue ownership, SLA, and confidentiality cues before deep case detail")
    s += bullet_list(314, 484, ["Payroll payslip dispute - SLA 2h - escalated", "Access restoration request - awaiting identity evidence", "Medical leave document case - confidential", "Laptop return clearance mismatch - cross-team dependency"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI playbook and response guidance", "AI suggests triage and playbook actions but sensitive responses still require human review")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI playbook suggestion")
    s += text(684, 522, "body", "Payslip dispute matches prior arrears discrepancy pattern for the same payroll group and should start with payroll-variance playbook.")
    s += text(684, 544, "small", "Suggested next step: collect period evidence, attach run reference, and escalate to payroll if mismatch remains.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review guidance", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Escalate to human", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Knowledge and resolution aids", "Suggested articles, macros, and prior-case matches stay adjacent to the queue")
    s += bullet_list(314, 774, ["3 matched knowledge articles", "2 reusable response macros", "1 duplicate case candidate", "Prior satisfaction trend low for this category"])
    s += card(648, 712, 510, 220, "SLA and escalation monitor", "Decision clocks, queue aging, and confidential handling must sit in the same workbench")
    s += bullet_list(666, 774, ["5 cases breaching first-response target today", "2 finance cases pending cross-functional approval", "1 confidential case requires masked-summary mode", "After-hours callback queue opens at 18:00"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned service views", "Agents can pin queue views by function, SLA window, sensitivity, and escalation path")
    s += chip(320, 990, 88, "HR", "#DCFCE7")
    s += chip(420, 990, 88, "IT", "#DBEAFE")
    s += chip(520, 990, 110, "Finance", "#FEF3C7")
    s += chip(642, 990, 130, "Confidential", "#FEE2E2")
    s += chip(784, 990, 118, "Escalated", "#EDE9FE")
    s += chip(914, 990, 154, "First response SLA", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Agent-first action strip", "The hero row prioritizes playbook review and escalations because this role operates under SLA pressure."),
        (2, "Case-centric search", "Search and filter behavior is tuned for case triage rather than generic employee lookup."),
        (3, "Support signal row", "Assigned load, SLA risk, AI triage, and escalations are visible in the first screenful."),
        (4, "Queue before detail", "The queue remains visually dominant so agents orient around work ownership first."),
        (5, "Review boundary visible", "AI guidance is explainable and still separated from sensitive human response actions."),
        (6, "SLA plus confidentiality", "Escalation clocks and confidential-case handling are treated as first-class support controls."),
        (7, "Operational segmentation", "Pinned queue views reflect how service teams actually divide functional support work."),
    ])
    save("hlp-scr-001-case-management-workbench-desktop.svg", s)

    s = mobile_shell("Case Workbench", "Support")
    s += chip(16, 108, 112, "Open 42", "#DBEAFE")
    s += chip(136, 108, 104, "SLA 8", "#FEE2E2")
    s += chip(248, 108, 126, "Escalated 5", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search case, employee, category, or SLA")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Priority case queue", "Queue, breach risk, and confidentiality stay first on mobile")
    s += bullet_list(34, 284, ["Payslip dispute escalated", "Access restore awaiting proof", "Confidential medical case", "Asset clearance dependency"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI playbook guidance", "Guided triage remains advisory and explainable")
    s += bullet_list(34, 456, ["Pattern matches payroll variance dispute", "Attach run evidence before escalation", "Ask why this playbook was suggested", "Route to human for sensitive reply"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review guidance", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open escalations", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "SLA summary", "Breaches, confidential cases, and callbacks compress into one decision stack")
    s += bullet_list(34, 652, ["5 first-response breaches", "2 finance cases pending", "1 confidential case masked", "After-hours callback queue at 18:00"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Breach-safe mobile", "Mobile preserves queue urgency and review boundaries before any automated or escalated action."),
    ])
    save("hlp-scr-001-case-management-workbench-mobile.svg", s)

    s = desktop_shell("Candidate Pipeline Board", "Recruit", "Recruiter Workbench", ["Pipeline", "Candidates", "Assessments", "Interviews", "Offers", "Talent Pool"])
    s += chip(296, 152, 128, "New 64", "#DBEAFE")
    s += chip(436, 152, 146, "AI ranked 21", "#DCFCE7")
    s += chip(594, 152, 142, "Stage block 06", "#FEE2E2")
    s += rect(808, 146, 180, 40, COLORS["blue"], None, 14)
    s += text(898, 172, "inverse", "Review shortlist", "middle")
    s += rect(1000, 146, 158, 40, COLORS["teal"], None, 14)
    s += text(1079, 172, "inverse", "Open interviews", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search requisition, candidate, skill, source, or ranking signal")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 120, "Priority", COLORS["soft"])
    s += chip(1094, 226, 46, "Fit", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Candidates", "64", COLORS["green"]),
        (518, "Shortlist ready", "21", COLORS["blue"]),
        (740, "Assessment due", "09", COLORS["amber"]),
        (962, "Duplicates", "04", COLORS["red"]),
        (1184, "Hiring SLA", "6d", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Pipeline lanes", "Recruiters need stage movement, blockers, and volume by lane before opening individual profiles")
    s += bullet_list(314, 484, ["New applicants 18", "Under review 14", "Assessment pending 9", "Ready for interview 12", "On hold or blocked 6"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI ranking and screening signals", "AI highlights likely fit, interview readiness, and review order without auto-moving candidates")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI shortlist insight")
    s += text(684, 522, "body", "Three Java backend candidates score high due to notice-period fit, skill match, and prior assessment performance.")
    s += text(684, 544, "small", "Suggested next step: compare top profiles, confirm knockout rules, and push recruiter-reviewed candidates to interview.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review ranking", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open compare", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Screening blockers and duplicates", "Duplicate, knockout, and missing-artifact signals should stay near the pipeline board")
    s += bullet_list(314, 774, ["4 duplicate cases awaiting merge", "2 internal applicants need policy override", "3 candidates missing mandatory questionnaire", "1 source feed callback delayed"])
    s += card(648, 712, 510, 220, "Interviews and recruiter actions", "Interview readiness, summaries, and bulk recruiter actions live in the same operating surface")
    s += bullet_list(666, 774, ["12 candidates ready for interview scheduling", "5 interview summaries generated", "Bulk shortlist for requisition ENG-214 pending review", "Candidate communication draft queue has 7 items"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned recruiting views", "Recruiters can pin requisition, source, skill cluster, stage, and SLA-focused candidate views")
    s += chip(320, 990, 122, "ENG-214", "#DCFCE7")
    s += chip(454, 990, 114, "Referrals", "#DBEAFE")
    s += chip(580, 990, 120, "Java fit", "#FEF3C7")
    s += chip(712, 990, 136, "Ready interview", "#EDE9FE")
    s += chip(860, 990, 118, "Duplicate", "#FEE2E2")
    s += chip(990, 990, 118, "SLA watch", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Recruiter-first action strip", "The top actions bias toward shortlist review and interview progression rather than passive analytics."),
        (2, "Search by hiring context", "Search is tuned to requisition, skill, source, and ranking signal rather than generic candidate names only."),
        (3, "Pipeline metrics first", "The signal row reflects recruiter throughput, shortlist readiness, duplicates, and SLA risk."),
        (4, "Board before profile", "The recruiter first sees stage flow and blocked volume before opening a single candidate."),
        (5, "Explainable ranking", "AI fit guidance remains transparent and separated from actual stage movement decisions."),
        (6, "Screening plus interview continuity", "Readiness, summaries, and recruiter actions stay in one workbench to reduce navigation churn."),
        (7, "Requisition-centered filtering", "Pinned views reflect how recruiting teams organize work by requisition, source, and skill cluster."),
    ])
    save("rec-scr-002-candidate-pipeline-board-desktop.svg", s)

    s = mobile_shell("Candidate Pipeline", "Recruit")
    s += chip(16, 108, 88, "New 64", "#DBEAFE")
    s += chip(112, 108, 112, "Ranked 21", "#DCFCE7")
    s += chip(232, 108, 142, "Blocked 6", "#FEE2E2")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search requisition, skill, source, or candidate")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Pipeline and priorities", "Mobile keeps stage flow and recruiter priorities ahead of deep profile review")
    s += bullet_list(34, 284, ["New applicants 18", "Assessment pending 9", "Ready for interview 12", "Blocked or on hold 6"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI shortlist guidance", "Ranking signals remain reviewable and non-automatic on mobile too")
    s += bullet_list(34, 456, ["Top Java profiles match notice-period and skill needs", "Confirm knockout rules before advance", "Ask why a candidate ranked high", "Open compare before shortlist"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review ranking", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open interviews", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Screening summary", "Duplicates, questionnaires, and shortlist-readiness collapse into one stack")
    s += bullet_list(34, 652, ["4 duplicate cases", "3 questionnaires missing", "12 interview-ready", "7 comms drafts pending"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Recruiter-speed mobile", "Mobile preserves rapid shortlist review while still exposing ranking rationale and stage blockers."),
    ])
    save("rec-scr-002-candidate-pipeline-board-mobile.svg", s)

    s = desktop_shell("Candidate Profile", "Recruit", "Candidate Review", ["Profile", "Resume", "Screening", "Interviews", "BGV", "Communication"])
    s += chip(296, 152, 122, "Fit score 82", "#DCFCE7")
    s += chip(430, 152, 138, "BGV pending", "#FEF3C7")
    s += chip(580, 152, 156, "Sensitive notes", "#FEE2E2")
    s += rect(808, 146, 176, 40, COLORS["blue"], None, 14)
    s += text(896, 172, "inverse", "Review profile", "middle")
    s += rect(996, 146, 162, 40, COLORS["teal"], None, 14)
    s += text(1077, 172, "inverse", "Draft message", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search resume section, note, interview summary, or candidate artifact")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 118, "Evidence", COLORS["soft"])
    s += chip(1092, 226, 48, "Open", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Stage", "Interview", COLORS["green"]),
        (518, "Assessments", "02", COLORS["blue"]),
        (740, "Interviews", "03", COLORS["amber"]),
        (962, "Duplicates", "01", COLORS["red"]),
        (1184, "Comms drafts", "04", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Candidate summary", "Core profile, source, and screening status stay visible before deeper evidence review")
    s += bullet_list(314, 484, ["Nisha Verma - Java Backend Engineer", "Notice period 30 days and location Pune", "Referral source with high prior conversion", "Questionnaire complete and assessment score above cut-off"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI evidence and communication assistance", "AI can summarize fit, interviews, and draft outreach but recruiters retain progression control")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI candidate summary")
    s += text(684, 522, "body", "Candidate fits requisition due to strong API experience, immediate project-domain overlap, and acceptable compensation expectation.")
    s += text(684, 544, "small", "Suggested next step: confirm duplicate warning, review panel feedback summary, and send interview-confirmation draft.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review summary", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open draft", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Risk and evidence panels", "Duplicate checks, BGV state, and sensitive notes must remain explicit and permission-aware")
    s += bullet_list(314, 774, ["1 possible duplicate via phone and resume similarity", "BGV vendor callback pending for previous employment", "Sensitive recruiter note masked for non-privileged viewers", "Offer range fit within approved band"])
    s += card(648, 712, 510, 220, "Interview and activity timeline", "Feedback summaries, schedule state, and communication artifacts stay in one profile flow")
    s += bullet_list(666, 774, ["Tech panel summary generated yesterday", "Manager interview scheduled for Friday 11:30", "Candidate asked relocation question via portal", "4 recruiter message drafts awaiting review"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned profile lenses", "Recruiters can switch among fit, duplicate, BGV, interview, and communication evidence views")
    s += chip(320, 990, 102, "Fit view", "#DCFCE7")
    s += chip(434, 990, 116, "Resume", "#DBEAFE")
    s += chip(562, 990, 104, "BGV", "#FEF3C7")
    s += chip(678, 990, 122, "Duplicate", "#FEE2E2")
    s += chip(812, 990, 118, "Interview", "#EDE9FE")
    s += chip(942, 990, 154, "Communication", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Action plus outreach", "The top strip balances candidate review with governed communication drafting."),
        (2, "Artifact search", "Search is tuned for resume, notes, summaries, and evidence rather than just candidate identity."),
        (3, "Profile state row", "Stage, assessments, interviews, duplicates, and drafts stay visible above the fold."),
        (4, "Profile before activity", "The left summary card grounds recruiters in objective candidate context first."),
        (5, "Explainable AI assist", "AI fit and communication support remains transparent and separate from final recruiter decisions."),
        (6, "Evidence continuity", "Risk, timeline, summaries, and communication artifacts are kept in one review surface."),
        (7, "Permission-aware lenses", "Profile views reflect how recruiters pivot between screening, BGV, and communication evidence."),
    ])
    save("rec-scr-003-candidate-profile-desktop.svg", s)

    s = mobile_shell("Candidate Profile", "Recruit")
    s += chip(16, 108, 96, "Fit 82", "#DCFCE7")
    s += chip(120, 108, 108, "BGV wait", "#FEF3C7")
    s += chip(236, 108, 138, "Sensitive note", "#FEE2E2")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search resume, summary, note, or artifact")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Candidate summary", "Profile context and stage come before deeper evidence on mobile")
    s += bullet_list(34, 284, ["Java backend fit", "30-day notice period", "Referral source", "Assessment above cut-off"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI summary and outreach", "AI can summarize and draft, but recruiters still decide movement and messaging")
    s += bullet_list(34, 456, ["Strong API and domain overlap", "Confirm duplicate warning", "Review panel summary", "Open interview-confirmation draft"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review summary", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open draft", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Evidence summary", "Duplicate, BGV, and interview state compress into one review stack")
    s += bullet_list(34, 652, ["1 duplicate candidate signal", "BGV callback pending", "Sensitive note masked by role", "Manager interview Friday"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Evidence-safe mobile", "Mobile keeps candidate fit, duplicate risk, and communication review in one controlled flow."),
    ])
    save("rec-scr-003-candidate-profile-mobile.svg", s)

    s = desktop_shell("Workforce Analytics", "Analytics", "Strategic Command", ["Overview", "Segments", "Attrition", "Flight Risk", "Skills", "NLQ"])
    s += chip(296, 152, 126, "Headcount +2%", "#DCFCE7")
    s += chip(434, 152, 148, "Attrition risk", "#FEE2E2")
    s += chip(594, 152, 166, "Saved view CFO", "#DBEAFE")
    s += rect(808, 146, 186, 40, COLORS["blue"], None, 14)
    s += text(901, 172, "inverse", "Ask workforce AI", "middle")
    s += rect(1006, 146, 152, 40, COLORS["teal"], None, 14)
    s += text(1082, 172, "inverse", "Open compare", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Ask: show attrition risk for engineering managers in India over last 4 quarters")
    s += chip(856, 226, 116, "Interpretation", COLORS["soft"])
    s += chip(982, 226, 116, "Clarify", COLORS["soft"])
    s += chip(1108, 226, 32, "AI", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Headcount", "18.4k", COLORS["green"]),
        (518, "Attrition", "12.1%", COLORS["red"]),
        (740, "Flight risk", "246", COLORS["amber"]),
        (962, "HiPo coverage", "71%", COLORS["blue"]),
        (1184, "Workforce cost", "+6.4%", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Segment and trend explorer", "Leaders and HRBPs need governed comparison, drill-down, and saved views before raw tables")
    s += bullet_list(314, 484, ["Engineering versus sales comparison", "India versus GCC attrition split", "Manager layer efficiency trend", "Voluntary exits rising in first-year cohort"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI interpretation and recommendations", "NLQ, prediction explanation, and strategic recommendation must stay transparent and governed")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI answer summary")
    s += text(684, 522, "body", "Engineering attrition rose mainly in early-tenure managers in India, with compensation compression and span-of-control volatility as top linked factors.")
    s += text(684, 544, "small", "Suggested next step: compare pay-band cohorts, review bench depth, and open retention plan candidates with HRBP visibility.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review answer", "middle")
    s += rect(834, 574, 132, 36, "#EEF2FF", None, 12)
    s += text(900, 598, "body", "Ask why", "middle")
    s += rect(980, 574, 160, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1060, 598, "small", "Open cohort", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Definitions and privacy controls", "Metric lineage, refresh state, and cohort suppression must remain visible on insight screens")
    s += bullet_list(314, 774, ["Attrition denominator uses rolling average headcount", "Last refresh completed 07:10 IST", "Small cohorts below 5 are suppressed", "Saved view shared with CHRO and HRBPs"])
    s += card(648, 712, 510, 220, "Risk and workforce planning signals", "Attrition, flight risk, skills gaps, and cost recommendations belong in one strategic workspace")
    s += bullet_list(666, 774, ["246 employees in elevated flight-risk pool", "Critical skill gap emerging in data engineering", "Bench depth below policy in 2 leadership roles", "Workforce plan recommends 14 hires and 6 internal moves"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned analytics views", "Analysts and leaders can pin time grain, dimension set, saved comparison, and model lenses")
    s += chip(320, 990, 114, "Q rolling", "#DCFCE7")
    s += chip(446, 990, 120, "India", "#DBEAFE")
    s += chip(578, 990, 132, "Engineering", "#FEF3C7")
    s += chip(722, 990, 136, "Attrition risk", "#FEE2E2")
    s += chip(870, 990, 120, "Bench depth", "#EDE9FE")
    s += chip(1002, 990, 106, "NLQ view", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Commanded analytics", "The top actions support AI questioning and segment comparison rather than fixed-chart consumption only."),
        (2, "NLQ in the workspace", "Natural-language querying is embedded directly into the analytics surface with governed interpretation cues."),
        (3, "Strategic KPI strip", "The first-row metrics blend composition, risk, talent depth, and cost signals."),
        (4, "Compare before drill", "The left panel emphasizes segment comparison and trend reading before deep population drill-down."),
        (5, "Explainable recommendations", "AI outputs always show rationale and next steps instead of opaque scoring alone."),
        (6, "Lineage plus actionability", "Definitions, suppression, refresh state, and planning signals sit together to keep trust high."),
        (7, "Saved-view operating model", "Pinned views reflect how executives and analysts repeatedly revisit governed scenarios."),
    ])
    save("anl-scr-002-workforce-analytics-desktop.svg", s)

    s = mobile_shell("Workforce Analytics", "Analytics")
    s += chip(16, 108, 106, "HC 18.4k", "#DCFCE7")
    s += chip(130, 108, 112, "Attrition", "#FEE2E2")
    s += chip(250, 108, 124, "Risk 246", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Ask a workforce question or open saved view")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Trend and segment summary", "Leadership mobile view starts with governed comparisons, not raw tables")
    s += bullet_list(34, 284, ["Engineering attrition rising", "India versus GCC split", "Span-of-control variation", "First-year exits up"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI answer and next steps", "NLQ answer, explanation, and next recommended views remain compact but governed")
    s += bullet_list(34, 456, ["Early-tenure managers drive attrition rise", "Compensation compression linked", "Open pay-band compare", "Ask why this cohort was highlighted"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review answer", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open cohort", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Trust and planning summary", "Definitions, refresh state, suppression, and workforce-plan signal collapse into one stack")
    s += bullet_list(34, 652, ["Last refresh 07:10 IST", "Cohorts under 5 suppressed", "Bench depth low in 2 roles", "14 hires recommended"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Governed mobile insights", "Mobile preserves NLQ trust cues and privacy boundaries before deeper cohort drill-down."),
    ])
    save("anl-scr-002-workforce-analytics-mobile.svg", s)

    s = desktop_shell("Interview Scheduler", "Recruit", "Scheduling Console", ["Scheduler", "Candidates", "Panels", "Calendars", "Conflicts", "Feedback"])
    s += chip(296, 152, 132, "Today 18", "#DBEAFE")
    s += chip(440, 152, 152, "Conflicts 04", "#FEE2E2")
    s += chip(604, 152, 164, "Reschedules 06", "#FEF3C7")
    s += rect(808, 146, 180, 40, COLORS["blue"], None, 14)
    s += text(898, 172, "inverse", "Review slots", "middle")
    s += rect(1000, 146, 158, 40, COLORS["teal"], None, 14)
    s += text(1079, 172, "inverse", "Send invites", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search candidate, panel member, slot, timezone, or meeting room")
    s += chip(856, 226, 102, "Filters", COLORS["soft"])
    s += chip(968, 226, 116, "Calendar", COLORS["soft"])
    s += chip(1094, 226, 46, "Book", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Upcoming", "18", COLORS["green"]),
        (518, "Backlog", "07", COLORS["amber"]),
        (740, "Conflicts", "04", COLORS["red"]),
        (962, "No-shows", "02", COLORS["blue"]),
        (1184, "SLA", "1.8d", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Scheduling queue", "Recruiters need interview-ready candidates and unresolved slot issues before calendar detail")
    s += bullet_list(314, 484, ["12 candidates ready for scheduling", "3 candidate timezone confirmations pending", "2 panel-composition violations", "1 onsite room double booking detected"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI slot recommendation", "AI can recommend feasible slots and backup panels while human schedulers keep final control")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "Best-slot suggestion")
    s += text(684, 522, "body", "Friday 11:30 IST fits candidate availability, hiring-manager calendar, and mandatory panel mix with no room conflict.")
    s += text(684, 544, "small", "Suggested next step: confirm candidate timezone, attach interview kit, and send bilingual invite.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review slot", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Backup panel", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Calendar and panel state", "Panel availability, room readiness, and confirmations stay close to the queue")
    s += bullet_list(314, 774, ["Panel A fully confirmed", "1 interviewer decline awaiting replacement", "Virtual room links generated for 9 rounds", "Onsite room capacity warning for Monday"])
    s += card(648, 712, 510, 220, "Reschedule and interview risk", "Reschedule trends, cancellations, and overdue feedback belong in the scheduler console")
    s += bullet_list(666, 774, ["6 reschedules this week", "2 no-show incidents need review", "4 overdue feedback submissions", "Candidate drop risk high for 1 senior architect round"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned scheduling views", "Recruiters can pin requisition, location, format, timezone, and conflict-focused views")
    s += chip(320, 990, 122, "ENG-214", "#DCFCE7")
    s += chip(454, 990, 116, "Virtual", "#DBEAFE")
    s += chip(582, 990, 120, "IST to CET", "#FEF3C7")
    s += chip(714, 990, 122, "Conflict", "#FEE2E2")
    s += chip(848, 990, 124, "Feedback", "#EDE9FE")
    s += chip(984, 990, 124, "SLA watch", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Scheduler-first actions", "The hero strip prioritizes slot review and invite action because speed and confirmation matter most here."),
        (2, "Calendar-aware search", "Search is tuned to candidate, panel, slot, and timezone artifacts rather than generic pipeline browsing."),
        (3, "Time-to-schedule signals", "The KPI strip blends volume, conflict, no-show, and SLA indicators."),
        (4, "Queue before grid", "The left card keeps scheduling backlog and slot blockers primary before detailed calendar interaction."),
        (5, "Explainable slot AI", "AI recommendations expose availability and policy rationale before booking decisions."),
        (6, "Risk beside schedule", "Reschedule, no-show, and overdue-feedback risk stay inside the same operating surface."),
        (7, "Timezone and format lenses", "Pinned views reflect how recruiting teams organize high-volume scheduling work."),
    ])
    save("rec-scr-004-interview-scheduler-desktop.svg", s)

    s = mobile_shell("Interview Scheduler", "Recruit")
    s += chip(16, 108, 96, "Today 18", "#DBEAFE")
    s += chip(120, 108, 110, "Conflict 4", "#FEE2E2")
    s += chip(238, 108, 136, "Reschedule 6", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search candidate, panel, slot, or timezone")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Scheduling queue", "Mobile starts with interview-ready candidates and conflicts")
    s += bullet_list(34, 284, ["12 interview-ready", "3 timezone confirms pending", "2 panel-rule violations", "1 room clash"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI slot recommendation", "Slot suggestions stay reviewable and policy-aware on mobile")
    s += bullet_list(34, 456, ["Friday 11:30 IST is best fit", "Candidate timezone confirmed", "Attach interview kit", "Send bilingual invite"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review slot", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Send invite", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Risk summary", "Reschedules, no-shows, and overdue feedback compress into one mobile stack")
    s += bullet_list(34, 652, ["6 reschedules", "2 no-shows", "4 overdue feedbacks", "1 drop-risk round"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Coordination-safe mobile", "Mobile preserves slot rationale, conflict visibility, and final human scheduling control."),
    ])
    save("rec-scr-004-interview-scheduler-mobile.svg", s)

    s = desktop_shell("Shift Management", "Workforce", "Shift and Rotation Control", ["Shifts", "Rotations", "Assignments", "Break Rules", "Overrides", "History"])
    s += chip(296, 152, 132, "Active 148", "#DBEAFE")
    s += chip(440, 152, 144, "Overrides 12", "#FEF3C7")
    s += chip(596, 152, 164, "No shift 09", "#FEE2E2")
    s += rect(808, 146, 176, 40, COLORS["blue"], None, 14)
    s += text(896, 172, "inverse", "Review version", "middle")
    s += rect(996, 146, 162, 40, COLORS["teal"], None, 14)
    s += text(1077, 172, "inverse", "Open rotation", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search shift, location, rotation pattern, assignment, or override reason")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 108, "Views", COLORS["soft"])
    s += chip(1082, 226, 58, "Shift", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Shift defs", "148", COLORS["green"]),
        (518, "Drafts", "06", COLORS["amber"]),
        (740, "Overrides", "12", COLORS["blue"]),
        (962, "No assignment", "09", COLORS["red"]),
        (1184, "Overnight", "34", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Shift catalog and warnings", "Admins need assignment gaps, version state, and conflict risk before editing rules")
    s += bullet_list(314, 484, ["Night shift v3 awaiting publish review", "9 employees missing effective shift assignment", "2 overlap conflicts on temporary overrides", "Alternate Saturday template used by 4 entities"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "Visual timeline and AI cleanup cues", "Timeline clarity and anomaly cleanup recommendations make shift rules easier to govern")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI cleanup suggestion")
    s += text(684, 522, "body", "Three local day-shift variants differ only by grace-out rule and can likely be consolidated into one governed template.")
    s += text(684, 544, "small", "Suggested next step: compare rule timelines, validate payroll impact, and publish a merged version after simulation.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review diff", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open simulation", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Rotation and assignment state", "Rotations, precedence, and gaps remain close to the shift-definition layer")
    s += bullet_list(314, 774, ["5 rotating templates active", "Roster precedence overrides default shift in plant east", "3 temporary overrides expire this week", "Cross-midnight anchor changed in one draft"])
    s += card(648, 712, 510, 220, "Operational impact and audit", "Shift versioning, recalculation impact, and audit lineage belong in one control screen")
    s += bullet_list(666, 774, ["Attendance recalculation needed for 27 records", "Payroll-sensitive break-rule change pending approval", "History view shows 4 superseded versions", "Union-specific assignment scope widened last month"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned shift lenses", "Workforce admins can pin location, worker type, overnight, override, and rotation-specific views")
    s += chip(320, 990, 114, "Plant east", "#DCFCE7")
    s += chip(446, 990, 128, "Overnight", "#DBEAFE")
    s += chip(586, 990, 110, "Union", "#FEF3C7")
    s += chip(708, 990, 122, "Override", "#FEE2E2")
    s += chip(842, 990, 118, "Rotation", "#EDE9FE")
    s += chip(972, 990, 136, "History view", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Version-aware actions", "The top actions focus on version review and rotation control because this is governed master data."),
        (2, "Search by operational artifact", "Search follows shift, rotation, assignment, and override concepts rather than pure employee lookup."),
        (3, "Governance KPI row", "The metric strip highlights draft, gap, override, and overnight workload signals."),
        (4, "Catalog before editor", "The left panel keeps version and assignment risk visible before deep rule editing."),
        (5, "Explainable cleanup AI", "AI consolidation suggestions show rationale and point to simulation rather than blind merge."),
        (6, "Impact beside history", "Operational recalculation and audit lineage stay in the same screen as version control."),
        (7, "Assignment-context lenses", "Pinned views match how workforce teams manage shifts across plants and worker groups."),
    ])
    save("wrk-scr-002-shift-management-desktop.svg", s)

    s = mobile_shell("Shift Management", "Workforce")
    s += chip(16, 108, 94, "Active 148", "#DBEAFE")
    s += chip(118, 108, 110, "Override 12", "#FEF3C7")
    s += chip(236, 108, 138, "No shift 9", "#FEE2E2")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search shift, rotation, or override reason")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Catalog and warnings", "Mobile starts with drafts, gaps, and conflict warnings")
    s += bullet_list(34, 284, ["Night shift v3 pending", "9 missing assignments", "2 override conflicts", "Alt Saturday used in 4 entities"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI cleanup guidance", "Shift cleanup suggestions remain explainable and simulation-led")
    s += bullet_list(34, 456, ["3 variants can likely merge", "Compare grace-out rule timeline", "Validate payroll impact", "Open simulation before publish"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review diff", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open rotation", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Impact summary", "Overrides, recalculation, and history collapse into one mobile stack")
    s += bullet_list(34, 652, ["3 overrides expire soon", "27 records need recalc", "4 superseded versions", "Union scope widened"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Governed master-data mobile", "Mobile preserves version risk and simulation-first discipline before any shift publish action."),
    ])
    save("wrk-scr-002-shift-management-mobile.svg", s)

    s = desktop_shell("Leave Policy Workspace", "Leave", "Policy and Simulation", ["Policies", "Applicability", "Rules", "Simulation", "Assignments", "History"])
    s += chip(296, 152, 126, "Published 32", "#DBEAFE")
    s += chip(434, 152, 154, "Conflicts 05", "#FEE2E2")
    s += chip(600, 152, 166, "Simulations 08", "#FEF3C7")
    s += rect(808, 146, 186, 40, COLORS["blue"], None, 14)
    s += text(901, 172, "inverse", "Review policy", "middle")
    s += rect(1006, 146, 152, 40, COLORS["teal"], None, 14)
    s += text(1082, 172, "inverse", "Run simulation", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search policy, leave type, applicability rule, blackout period, or explanation")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 124, "Preview", COLORS["soft"])
    s += chip(1098, 226, 42, "Rule", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Policies", "32", COLORS["green"]),
        (518, "Drafts", "07", COLORS["amber"]),
        (740, "Conflicts", "05", COLORS["red"]),
        (962, "Future dated", "11", COLORS["blue"]),
        (1184, "Impacted", "2.4k", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Policy inventory and collision risk", "Leave admins need overlap, future-dated change, and rule risk before publication")
    s += bullet_list(314, 484, ["Annual leave v5 pending approval", "5 applicability collisions by location and grade", "11 future-dated revisions in next 60 days", "Policy explanation stale for 2 published versions"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI explanation and rule review", "AI can draft explanations and flag conflict patterns, but policy owners remain the approvers")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI explanation preview")
    s += text(684, 522, "body", "Employees in grade M1 at Pune receive 18 annual leave days, with 6-day carry-forward cap and blackout restrictions in quarter close weeks.")
    s += text(684, 544, "small", "Suggested next step: compare with prior version, validate sandwich rule, and publish only after simulation clears.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review preview", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open compare", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Applicability and simulation state", "Assignments, sample populations, and explanation preview stay near the policy rules")
    s += bullet_list(314, 774, ["Simulation run for 420 employees awaiting review", "2 blackout-period conflicts detected", "Carry-forward cap changed for union cohort", "Employee-facing preview updated in 3 languages"])
    s += card(648, 712, 510, 220, "Governance and downstream impact", "Payroll, attendance, and dispute risk should remain visible in policy operations")
    s += bullet_list(666, 774, ["Loss-of-pay interaction changed in one draft", "Sandwich-rule update impacts 640 employees", "Payroll sign-off required for encashment rule change", "Documentation exceptions trending high for sick leave"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned policy lenses", "Leave teams can pin entity, leave type, lifecycle condition, simulation, and conflict-focused views")
    s += chip(320, 990, 108, "Annual", "#DCFCE7")
    s += chip(440, 990, 114, "Pune", "#DBEAFE")
    s += chip(566, 990, 122, "Probation", "#FEF3C7")
    s += chip(700, 990, 118, "Conflict", "#FEE2E2")
    s += chip(830, 990, 126, "Simulation", "#EDE9FE")
    s += chip(968, 990, 140, "Payroll impact", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Policy-first action strip", "Top actions bias toward review and simulation because publish control is the riskiest step."),
        (2, "Rule-oriented search", "Search follows policy artifacts such as leave types, restrictions, and explanations."),
        (3, "Governance KPI row", "Published, draft, conflict, and impacted-population signals sit above the fold."),
        (4, "Inventory before editor", "The left card keeps policy collision and future-date risk visible before rule editing."),
        (5, "Explainable policy AI", "AI support focuses on readable explanation and conflict cues, not auto-publication."),
        (6, "Downstream-aware governance", "Attendance, payroll, and dispute effects remain visible in the same workspace."),
        (7, "Applicability lenses", "Pinned views reflect how leave teams govern policies across entities and employee groups."),
    ])
    save("lev-scr-001-leave-policy-workspace-desktop.svg", s)

    s = mobile_shell("Leave Policy", "Leave")
    s += chip(16, 108, 106, "Published 32", "#DBEAFE")
    s += chip(130, 108, 104, "Conflict 5", "#FEE2E2")
    s += chip(242, 108, 132, "Sim run 8", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search policy, rule, restriction, or explanation")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Inventory and risk", "Mobile starts with collision and future-dated policy risk")
    s += bullet_list(34, 284, ["Annual leave v5 pending", "5 applicability collisions", "11 future-dated revisions", "2 stale explanations"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI explanation preview", "Explanation drafts stay reviewable and simulation-led on mobile")
    s += bullet_list(34, 456, ["18 annual leave days for M1 Pune", "6-day carry-forward cap", "Validate sandwich rule", "Publish only after simulation"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review preview", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Run simulation", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Impact summary", "Simulation, payroll impact, and documentation exceptions collapse into one stack")
    s += bullet_list(34, 652, ["420 employees in sim", "640 impacted by sandwich change", "Payroll sign-off pending", "Sick-leave docs exceptions high"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Safe policy mobile", "Mobile preserves review and simulation discipline before any leave-policy publish action."),
    ])
    save("lev-scr-001-leave-policy-workspace-mobile.svg", s)

    s = desktop_shell("Attrition Analytics", "Analytics", "Retention Intelligence", ["Attrition", "Cohorts", "Managers", "Reasons", "Definitions", "Actions"])
    s += chip(296, 152, 128, "Attrition 12.1%", "#FEE2E2")
    s += chip(436, 152, 152, "Regrettable 3.4%", "#FEF3C7")
    s += chip(600, 152, 166, "Threshold breach", "#DBEAFE")
    s += rect(808, 146, 182, 40, COLORS["blue"], None, 14)
    s += text(899, 172, "inverse", "Review cohorts", "middle")
    s += rect(1002, 146, 156, 40, COLORS["teal"], None, 14)
    s += text(1080, 172, "inverse", "Open actions", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search manager, location, exit reason, cohort, or retention theme")
    s += chip(856, 226, 102, "Filters", COLORS["soft"])
    s += chip(968, 226, 122, "Definitions", COLORS["soft"])
    s += chip(1100, 226, 40, "Risk", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Overall", "12.1%", COLORS["red"]),
        (518, "Regrettable", "3.4%", COLORS["amber"]),
        (740, "High-risk mgrs", "07", COLORS["blue"]),
        (962, "First-year", "18%", COLORS["green"]),
        (1184, "Suppressed", "11", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Trend and cohort hotspots", "Leaders need hot managers, cohorts, and exit-pattern shifts before detailed reasons")
    s += bullet_list(314, 484, ["Engineering first-year attrition rising", "2 managers crossed threshold this month", "India regrettable attrition above target", "Tenure 0-12 month cohort widening gap"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI trend explanation and retention focus", "AI can explain patterns and suggest focus areas, but action plans remain owned by HR leadership")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI trend explanation")
    s += text(684, 522, "body", "Recent regrettable attrition is concentrated in early-tenure engineers under fast-growing managers with compensation compression and promotion delay signals.")
    s += text(684, 544, "small", "Suggested next step: compare pay bands, inspect manager span, and open retention focus cohort with privacy-safe suppression.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review cohort", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open action plan", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Definitions and privacy state", "Formula version, suppression, and sensitive commentary controls must remain visible")
    s += bullet_list(314, 774, ["Rolling-average denominator version 4", "Small cohorts below 5 suppressed", "Manager-level exit comments restricted", "Last refresh completed 07:20 IST"])
    s += card(648, 712, 510, 220, "Retention action and related signals", "Attrition outputs should connect to focus actions and adjacent workforce drivers")
    s += bullet_list(666, 774, ["7 managers in watchlist", "2 critical-role loss clusters", "Compensation correlation flagged in one cohort", "Suggested retention review for 36 employees"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned attrition lenses", "Leaders and HRBPs can pin period, region, tenure, regrettable-loss, and manager-risk views")
    s += chip(320, 990, 120, "Rolling 12", "#DCFCE7")
    s += chip(452, 990, 108, "India", "#DBEAFE")
    s += chip(572, 990, 120, "0-12 mo", "#FEF3C7")
    s += chip(704, 990, 136, "Regrettable", "#FEE2E2")
    s += chip(852, 990, 134, "Mgr risk", "#EDE9FE")
    s += chip(998, 990, 110, "Privacy", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Retention-first actions", "Top actions bias toward cohort review and action planning because this screen is for decision support."),
        (2, "Hotspot-oriented search", "Search is tuned to managers, cohorts, reasons, and retention themes rather than raw employee lookup."),
        (3, "Outcome KPI row", "The first-row metrics blend overall, regrettable, first-year, and privacy-suppression signals."),
        (4, "Trend before detail", "The left panel keeps hotspot cohorts and threshold shifts primary before deeper reason analysis."),
        (5, "Explainable attrition AI", "AI trend explanation remains rationale-led and connected to concrete next analytical steps."),
        (6, "Definitions beside action", "Formula version, refresh, suppression, and action cues remain in the same workspace."),
        (7, "Leadership lenses", "Pinned views reflect how HRBPs and leaders repeatedly revisit attrition scenarios."),
    ])
    save("anl-scr-003-attrition-analytics-desktop.svg", s)

    s = mobile_shell("Attrition Analytics", "Analytics")
    s += chip(16, 108, 112, "Attrition 12%", "#FEE2E2")
    s += chip(136, 108, 126, "Regrettable", "#FEF3C7")
    s += chip(270, 108, 104, "Mgr 7", "#DBEAFE")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search cohort, manager, reason, or theme")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Cohort hotspots", "Mobile starts with hot segments and threshold shifts")
    s += bullet_list(34, 284, ["Engineering first-year rise", "2 managers crossed threshold", "India regret loss high", "0-12 month gap widening"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI trend explanation", "AI explanation stays rationale-led and action-safe on mobile")
    s += bullet_list(34, 456, ["Early-tenure engineers drive rise", "Comp compression linked", "Inspect manager span", "Open retention focus cohort"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review cohort", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open actions", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Trust and action summary", "Definitions, suppression, and retention actions compress into one mobile stack")
    s += bullet_list(34, 652, ["Denominator v4", "Cohorts <5 suppressed", "7 managers watched", "36 employees in focus cohort"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Privacy-safe mobile retention", "Mobile preserves cohort trust cues and suppression boundaries before deeper drill-down."),
    ])
    save("anl-scr-003-attrition-analytics-mobile.svg", s)

    s = desktop_shell("Offer Workspace", "Recruit", "Offer and Compensation Approval", ["Offers", "Candidates", "Compensation", "Approvals", "Letters", "History"])
    s += chip(296, 152, 126, "Ready 12", "#DBEAFE")
    s += chip(434, 152, 158, "Negotiation 03", "#FEF3C7")
    s += chip(604, 152, 144, "Expiring 05", "#FEE2E2")
    s += rect(808, 146, 182, 40, COLORS["blue"], None, 14)
    s += text(899, 172, "inverse", "Review package", "middle")
    s += rect(1002, 146, 156, 40, COLORS["teal"], None, 14)
    s += text(1080, 172, "inverse", "Send offer", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search candidate, requisition, offer id, approval stage, or expiry risk")
    s += chip(856, 226, 98, "Compare", COLORS["soft"])
    s += chip(964, 226, 112, "Policy", COLORS["soft"])
    s += chip(1086, 226, 54, "Send", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Draft offers", "12", COLORS["green"]),
        (518, "Approvals", "07", COLORS["amber"]),
        (740, "Variance", "03", COLORS["red"]),
        (962, "Expiring", "05", COLORS["blue"]),
        (1184, "Accept risk", "02", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Candidate and package summary", "Recruiters and HR need package, peer range, and approval blockers before dispatch")
    s += bullet_list(314, 484, ["Candidate Priya Menon for ENG-214", "CTC 18.4L is 6% above peer median", "Comp approval pending finance review", "Offer expires in 2 days with BGV still in progress"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI negotiation and clause review", "AI can suggest negotiation posture and clause mismatches, but never auto-send the offer")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI offer guidance")
    s += text(684, 522, "body", "Acceptance likelihood is moderate because notice buyout is missing and compensation is above band midpoint without relocation support.")
    s += text(684, 544, "small", "Suggested next step: compare peer package, add joining-bonus rationale, and route clause exception to compensation approver.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review compare", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open clause diff", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Letter preview and expiry control", "Letter generation, approval evidence, and expiry handling stay close to the package")
    s += bullet_list(314, 774, ["Offer letter preview generated in 2 languages", "Expiry reminder scheduled for tomorrow 11:00 IST", "Candidate portal access ready after send", "Reissue required if compensation changes after sign-off"])
    s += card(648, 712, 510, 220, "Approvals, response, and reissue state", "Negotiation, approval lineage, and response tracking belong in the same workspace")
    s += bullet_list(666, 774, ["Finance approver raised one variance comment", "Hiring manager approved revised title", "1 candidate requested revised DOJ", "3 sent offers awaiting candidate response"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned offer lenses", "Recruiters can pin requisition, grade, negotiation, expiry, and risk-oriented offer views")
    s += chip(320, 990, 114, "ENG-214", "#DCFCE7")
    s += chip(446, 990, 108, "L5 band", "#DBEAFE")
    s += chip(566, 990, 136, "Negotiation", "#FEF3C7")
    s += chip(714, 990, 118, "Expiry risk", "#FEE2E2")
    s += chip(844, 990, 116, "BGV hold", "#EDE9FE")
    s += chip(972, 990, 136, "Join bonus", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Decision-first hero strip", "Top actions focus on package review and controlled send because dispatch is the irreversible step."),
        (2, "Offer-aware search", "Search follows candidate, requisition, offer, approval, and expiry concepts rather than generic ATS browsing."),
        (3, "Commercial risk KPI row", "The KPI strip blends draft volume, approval state, variance, expiry, and acceptance-risk signals."),
        (4, "Package before letter", "Users see package variance and blockers before diving into generated letter detail."),
        (5, "Explainable negotiation AI", "AI guidance is transparent and recommendation-only, with clear human ownership of send decisions."),
        (6, "Response beside approval", "Negotiation, approvals, and candidate response remain in one workbench to reduce context switching."),
        (7, "Offer-specific pinned views", "Pinned lenses reflect how recruiting and HR ops triage expiring, risky, and exceptional offers."),
    ])
    save("rec-scr-005-offer-workspace-desktop.svg", s)

    s = mobile_shell("Offer Workspace", "Recruit")
    s += chip(16, 108, 88, "Ready 12", "#DBEAFE")
    s += chip(112, 108, 126, "Negotiate 3", "#FEF3C7")
    s += chip(246, 108, 128, "Expire 5", "#FEE2E2")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search candidate, offer, approval, or expiry")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Package and blocker summary", "Mobile starts with package variance and approval blockers before send")
    s += bullet_list(34, 284, ["Priya Menon for ENG-214", "CTC 6% above peer median", "Finance review pending", "Offer expires in 2 days"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI negotiation guidance", "Negotiation cues remain explainable and send-safe on mobile")
    s += bullet_list(34, 456, ["Notice buyout missing", "Package above band midpoint", "Add joining-bonus rationale", "Open clause exception before send"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review compare", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Send offer", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Approval and response stack", "Expiry, response, and reissue state collapse into one mobile summary")
    s += bullet_list(34, 652, ["Letter preview in 2 languages", "1 revised DOJ request", "3 sent offers awaiting response", "Reissue needed after package edit"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Controlled mobile dispatch", "Mobile preserves package risk, approval evidence, and human send control before any offer is released."),
    ])
    save("rec-scr-005-offer-workspace-mobile.svg", s)

    s = desktop_shell("Rostering Screen", "Workforce", "Coverage and Publish Planner", ["Roster", "Coverage", "Swaps", "Publish", "Fairness", "History"])
    s += chip(296, 152, 126, "Published 24", "#DBEAFE")
    s += chip(434, 152, 154, "Understaffed 06", "#FEE2E2")
    s += chip(600, 152, 142, "Swap req 11", "#FEF3C7")
    s += rect(808, 146, 182, 40, COLORS["blue"], None, 14)
    s += text(899, 172, "inverse", "Review coverage", "middle")
    s += rect(1002, 146, 156, 40, COLORS["teal"], None, 14)
    s += text(1080, 172, "inverse", "Publish roster", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search location, team, week, shift lane, employee, or coverage issue")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 116, "Calendar", COLORS["soft"])
    s += chip(1090, 226, 50, "Week", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Locations", "24", COLORS["green"]),
        (518, "Gaps", "06", COLORS["red"]),
        (740, "OT risk", "14", COLORS["amber"]),
        (962, "Swaps", "11", COLORS["blue"]),
        (1184, "Drafts", "03", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Coverage calendar and gap queue", "Schedulers need weekly gaps, holiday risk, and draft publication state before editing lanes")
    s += bullet_list(314, 484, ["Plant east Monday evening shift short by 3", "Weekend holiday coverage missing for warehouse south", "3 draft roster versions pending review", "Fairness threshold breached in support night lane"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI coverage and fairness guidance", "AI can suggest gap fixes and fair rotation alternatives, but publish authority remains human")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI roster suggestion")
    s += text(684, 522, "body", "Move two cross-trained associates from lane B to lane A and open one voluntary overtime slot to close the Monday shortfall without exceeding fairness threshold.")
    s += text(684, 544, "small", "Suggested next step: preview overtime impact, verify skill eligibility, and publish only after supervisor sign-off.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Preview change", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open fairness", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Swap inbox and team constraints", "Swap requests, delegation rules, and supervisor overrides stay near the roster grid")
    s += bullet_list(314, 774, ["11 swap requests awaiting decision", "2 swaps blocked by skill mismatch", "Supervisor delegation active in west depot", "Union overtime cap reached for 4 workers"])
    s += card(648, 712, 510, 220, "Publish controls and audit impact", "Republish risk, notification effect, and audit lineage belong in the same workspace")
    s += bullet_list(666, 774, ["Republish will notify 126 employees", "14 overtime-sensitive assignments flagged", "Last publish completed 08:10 IST", "2 teams still pending supervisor review"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned roster lenses", "Workforce teams can pin site, week, holiday, understaffing, and fairness-oriented roster views")
    s += chip(320, 990, 108, "Plant east", "#DCFCE7")
    s += chip(440, 990, 110, "Week 29", "#DBEAFE")
    s += chip(562, 990, 122, "Holiday", "#FEF3C7")
    s += chip(696, 990, 136, "Understaffed", "#FEE2E2")
    s += chip(844, 990, 118, "Fairness", "#EDE9FE")
    s += chip(974, 990, 134, "Overtime", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Publish-last action design", "The hero strip keeps publish visible but downstream of coverage review because roster release affects many employees."),
        (2, "Planner-aware search", "Search is tuned to site, lane, week, worker, and issue artifacts rather than generic people search."),
        (3, "Coverage KPI row", "The KPI strip highlights gaps, overtime, swaps, and draft state before detailed roster edits."),
        (4, "Gap queue before grid complexity", "Users see the highest-risk shortage and fairness issues before deeper lane management."),
        (5, "Explainable roster AI", "AI suggestions expose staffing logic and fairness rationale before any schedule change is applied."),
        (6, "Publish impact nearby", "Notification blast radius and supervisor review state remain in the same publish workspace."),
        (7, "Operational lenses", "Pinned views reflect how roster teams repeatedly navigate by site, week, and staffing risk."),
    ])
    save("wrk-scr-003-rostering-screen-desktop.svg", s)

    s = mobile_shell("Rostering Screen", "Workforce")
    s += chip(16, 108, 108, "Publish 24", "#DBEAFE")
    s += chip(132, 108, 116, "Gap 6", "#FEE2E2")
    s += chip(256, 108, 118, "Swaps 11", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search site, week, worker, or coverage issue")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Coverage and shortage summary", "Mobile starts with weekly shortage and draft publish risk")
    s += bullet_list(34, 284, ["Plant east evening short by 3", "Holiday coverage missing", "3 draft rosters pending", "Night-lane fairness breached"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI coverage guidance", "Coverage fixes stay explainable and supervisor-controlled on mobile")
    s += bullet_list(34, 456, ["Move 2 cross-trained associates", "Open 1 overtime slot", "Verify skill eligibility", "Publish after sign-off"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Preview change", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open swaps", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Publish and swap stack", "Swap inbox, overtime, and publish impact compress into one mobile summary")
    s += bullet_list(34, 652, ["11 swap requests", "4 OT cap hits", "126 employees notified on publish", "2 teams pending review"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Coverage-first mobile roster", "Mobile preserves shortage, fairness, and publish-impact cues before roster release actions."),
    ])
    save("wrk-scr-003-rostering-screen-mobile.svg", s)

    s = desktop_shell("Leave Approval Queue", "Leave", "Approvals, Coverage, and Delegation", ["Inbox", "Team Calendar", "Delegation", "Escalations", "Policy", "History"])
    s += chip(296, 152, 126, "Pending 38", "#DBEAFE")
    s += chip(434, 152, 144, "Escalated 04", "#FEE2E2")
    s += chip(590, 152, 150, "Conflict 06", "#FEF3C7")
    s += rect(808, 146, 182, 40, COLORS["blue"], None, 14)
    s += text(899, 172, "inverse", "Review queue", "middle")
    s += rect(1002, 146, 156, 40, COLORS["teal"], None, 14)
    s += text(1080, 172, "inverse", "Delegate backup", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search employee, leave type, team, balance exception, or escalation")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 110, "Coverage", COLORS["soft"])
    s += chip(1084, 226, 56, "Queue", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Pending", "38", COLORS["green"]),
        (518, "Escalated", "04", COLORS["red"]),
        (740, "Conflicts", "06", COLORS["amber"]),
        (962, "Bal holds", "03", COLORS["blue"]),
        (1184, "SLA", "7h", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Approval inbox and blockers", "Managers need pending requests, blackout risk, and balance exceptions before approval")
    s += bullet_list(314, 484, ["38 requests pending across 7 teams", "4 escalated items breached approval SLA", "3 requests blocked by insufficient balance", "2 quarter-close blackout exceptions need HR review"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI coverage explanation and action cues", "AI can summarize coverage impact and policy context, but approve or reject remains human-owned")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI team-impact summary")
    s += text(684, 522, "body", "Approving Ankit Sharma's leave on Friday will leave support pod B below minimum coverage unless delegate Meera shifts one backup associate.")
    s += text(684, 544, "small", "Suggested next step: inspect team calendar, assign delegate approver for weekend, and revalidate leave balance at final approval.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Open calendar", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Revalidate balance", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Delegation and backup state", "Delegation, out-of-office approvers, and backup routing stay near the queue")
    s += bullet_list(314, 774, ["Weekend delegate active for 2 managers", "1 backup approver missing in sales north", "Escalation route switches to HR after 24h", "Coverage substitute identified for 5 requests"])
    s += card(648, 712, 510, 220, "Validation, notifications, and audit", "Final approval checks and employee communication belong in the same operating surface")
    s += bullet_list(666, 774, ["Final approval rechecks balance and employment state", "7 notification drafts queued after decision", "2 approved leaves need roster sync", "Masked medical leave note visible only to HR"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned leave lenses", "Approvers can pin team, leave type, escalation, blackout, and coverage-oriented queue views")
    s += chip(320, 990, 104, "Pod B", "#DCFCE7")
    s += chip(436, 990, 116, "Sick leave", "#DBEAFE")
    s += chip(564, 990, 118, "Escalated", "#FEF3C7")
    s += chip(694, 990, 120, "Blackout", "#FEE2E2")
    s += chip(826, 990, 118, "Delegate", "#EDE9FE")
    s += chip(956, 990, 152, "Coverage risk", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Queue before decision", "The top actions focus on queue and delegation because approvals depend on coverage context first."),
        (2, "Team-aware search", "Search is tuned to employee, leave type, team, balance, and escalation objects rather than static leave history."),
        (3, "Approval risk KPI row", "The KPI strip highlights escalations, conflicts, balance holds, and SLA pressure above the fold."),
        (4, "Inbox before calendar depth", "The left card keeps the queue and blocker signals primary before wider team-calendar navigation."),
        (5, "Explainable approval AI", "AI support summarizes coverage impact and policy logic without making the decision for the approver."),
        (6, "Validation beside notification", "Approval checks, downstream sync, and employee communication stay in the same workspace."),
        (7, "Queue triage lenses", "Pinned views match how managers and HR approvers revisit leave decisions by team and exception type."),
    ])
    save("lev-scr-002-leave-approval-queue-desktop.svg", s)

    s = mobile_shell("Leave Approval Queue", "Leave")
    s += chip(16, 108, 102, "Pending 38", "#DBEAFE")
    s += chip(126, 108, 116, "Escalate 4", "#FEE2E2")
    s += chip(250, 108, 124, "Conflict 6", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search employee, team, leave type, or exception")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Inbox and blocker summary", "Mobile starts with escalations, balance holds, and blackout exceptions")
    s += bullet_list(34, 284, ["38 pending requests", "4 SLA escalations", "3 insufficient-balance holds", "2 blackout exceptions"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI coverage guidance", "Coverage explanation stays reviewable and human-approved on mobile")
    s += bullet_list(34, 456, ["Pod B will drop below minimum", "Shift backup associate before approve", "Assign weekend delegate", "Revalidate balance on final submit"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Open calendar", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Delegate", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Decision and notification stack", "Delegation, notifications, and roster sync compress into one mobile summary")
    s += bullet_list(34, 652, ["Weekend delegates active", "7 decision notifications queued", "2 approvals need roster sync", "Medical notes remain masked"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Coverage-safe approval mobile", "Mobile preserves escalation, delegation, and final validation cues before a leave decision is confirmed."),
    ])
    save("lev-scr-002-leave-approval-queue-mobile.svg", s)

    s = desktop_shell("Payroll Run Details", "Payroll", "Run Validation and Close", ["Runs", "Inputs", "Exceptions", "Employees", "Approvals", "Close"])
    s += chip(296, 152, 132, "Employees 2.4k", "#DBEAFE")
    s += chip(440, 152, 138, "Blockers 19", "#FEE2E2")
    s += chip(590, 152, 132, "Recalc 42", "#FEF3C7")
    s += rect(808, 146, 182, 40, COLORS["blue"], None, 14)
    s += text(899, 172, "inverse", "Resolve blockers", "middle")
    s += rect(1002, 146, 156, 40, COLORS["teal"], None, 14)
    s += text(1080, 172, "inverse", "Approve run", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search employee, exception, input source, pay component, or recalculation issue")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 118, "Variance", COLORS["soft"])
    s += chip(1092, 226, 48, "Run", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Inputs", "96%", COLORS["green"]),
        (518, "Blockers", "19", COLORS["red"]),
        (740, "Warnings", "42", COLORS["amber"]),
        (962, "Net delta", "1.8%", COLORS["blue"]),
        (1184, "Bank", "Ready", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Input readiness and exception queue", "Payroll ops need source completeness and blocking exceptions before employee drill-down")
    s += bullet_list(314, 484, ["Attendance feed complete for 96% employees", "19 blocking exceptions across 11 employees", "42 warnings relate to arrears and rounding", "Bank advice can generate only after blocker count is zero"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI anomaly and variance explanation", "AI can highlight unusual pay changes and reconciliation signals, but cannot auto-close the run")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI payroll anomaly note")
    s += text(684, 522, "body", "Net pay spike is concentrated in 3 employees due to loss-of-pay reversal arrears and one late incentive import that was not present in the prior run.")
    s += text(684, 544, "small", "Suggested next step: inspect impacted employees, confirm approval evidence for reversals, and rerun validation before close.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Open variance", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open impacted emp", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Employee drill-down and recalculation state", "Employee-level fixes, recalculation impact, and source lineage stay near the run queue")
    s += bullet_list(314, 774, ["11 employees need detailed exception review", "42 rows require recompute after input correction", "1 settlement employee pending finance sign-off", "Prior-run compare available for all blocker cases"])
    s += card(648, 712, 510, 220, "Approval, close checklist, and downstream outputs", "Approval evidence, close readiness, and payout outputs belong in the same run cockpit")
    s += bullet_list(666, 774, ["Approver chain requires payroll lead then finance", "Bank advice and payslip jobs stay locked while blockers remain", "GL export variance within threshold after warning-only items", "Run audit snapshot captured before close"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned payroll lenses", "Payroll teams can pin company, month, exception, arrear, and payout-focused run views")
    s += chip(320, 990, 112, "Jul 2026", "#DCFCE7")
    s += chip(444, 990, 110, "India", "#DBEAFE")
    s += chip(566, 990, 118, "Blockers", "#FEF3C7")
    s += chip(696, 990, 108, "Arrears", "#FEE2E2")
    s += chip(816, 990, 112, "Bank file", "#EDE9FE")
    s += chip(940, 990, 168, "LOP reversal", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Close-gated hero strip", "Top actions focus on blocker resolution and controlled approval because payroll close is irreversible."),
        (2, "Run-aware search", "Search is tuned to employee, source, exception, component, and recalculation artifacts."),
        (3, "Blocking-first KPI row", "The KPI strip keeps blockers, warnings, and delta signals visible before any approval action."),
        (4, "Readiness before drill-down", "The left card keeps input completeness and queue severity primary before deeper employee inspection."),
        (5, "Explainable payroll AI", "AI anomalies are rationale-led and explicitly stop short of approving or closing the run."),
        (6, "Outputs gated by readiness", "Bank advice, payslips, and GL downstream outputs stay visibly dependent on blocker clearance."),
        (7, "Run triage lenses", "Pinned views match how payroll teams revisit runs by month, country, exception, and payout artifact."),
    ])
    save("pay-scr-002-payroll-run-details-desktop.svg", s)

    s = mobile_shell("Payroll Run Details", "Payroll")
    s += chip(16, 108, 110, "Emp 2.4k", "#DBEAFE")
    s += chip(134, 108, 112, "Blocker 19", "#FEE2E2")
    s += chip(254, 108, 120, "Recalc 42", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search employee, exception, source, or variance")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Readiness and blocker summary", "Mobile starts with input completeness and blocking exceptions")
    s += bullet_list(34, 284, ["Attendance feed at 96%", "19 blocking exceptions", "42 warning rows", "Bank advice waits for zero blockers"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI anomaly guidance", "Variance explanation stays reviewable and close-safe on mobile")
    s += bullet_list(34, 456, ["LOP reversal arrears causing spike", "Late incentive import detected", "Inspect impacted employees", "Rerun validation before close"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Open variance", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Approve run", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Close and output stack", "Recalc, approvals, and payout outputs compress into one mobile summary")
    s += bullet_list(34, 652, ["11 employees in drill-down", "Finance sign-off pending", "Payslips locked till blockers clear", "Audit snapshot ready"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Close-safe payroll mobile", "Mobile preserves blocker severity, anomaly explanation, and gated output signals before payroll approval."),
    ])
    save("pay-scr-002-payroll-run-details-mobile.svg", s)

    batch_specs = [
        {
            "title": "Localization Diagnostics",
            "badge": "PROD",
            "shell": "Control Plane",
            "nav": ["Localization", "Runtime", "Bundles", "Fallback", "Analytics", "Help"],
            "chips": [{"label": "Locales 18", "w": 104, "fill": "#DBEAFE"}, {"label": "Fallback 3", "w": 112, "fill": "#FEF3C7"}, {"label": "Pending 1", "w": 108, "fill": "#FEE2E2"}],
            "actions": [{"label": "Run probe", "w": 164, "fill": COLORS["blue"]}, {"label": "Publish bundle", "w": 156, "fill": COLORS["teal"]}],
            "search": "Search locale, module, bundle key, preview surface, or missing-resource incident",
            "search_chips": [{"label": "Matrix", "w": 92, "fill": COLORS["soft"]}, {"label": "Fallback", "w": 110, "fill": COLORS["soft"]}, {"label": "Probe", "w": 58, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Complete", "value": "94.6%", "color": COLORS["green"]}, {"title": "Fallback 24h", "value": "312", "color": COLORS["amber"]}, {"title": "Cache hit", "value": "97%", "color": COLORS["blue"]}, {"title": "Missing", "value": "21", "color": COLORS["red"]}, {"title": "Locales", "value": "18", "color": COLORS["teal"]}],
            "upper_left": {"title": "Locale health and module matrix", "subtitle": "Runtime bundle truth and missing-resource signals outrank editing convenience", "bullets": ["Payments module missing 12 labels in fr-FR", "Policy portal uses fallback in 3 locales", "2 bundles still stale after last publish", "Unsafe markup flag raised in one email template"]},
            "upper_right": {"title": "Fallback path and live preview", "subtitle": "Fallback chain, format preview, and cache state stay in one diagnostic surface", "note_title": "Runtime preview", "note_body": "The Spanish payslip subject is serving the default English bundle because the country override is missing and cache invalidation did not complete.", "note_footer": "Next step: compare locale bundle, flush stale cache, and publish only after mandatory-locale checks pass.", "note_actions": [{"label": "Compare locale", "w": 154, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open blockers", "w": 148, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Publish readiness and blocker log", "subtitle": "Mandatory locales, cache rules, and impacted modules remain visible before release", "bullets": ["1 publish pending translator sign-off", "2 mandatory locales missing on onboarding journey", "Cache invalidation blocked in one edge region", "4 modules will consume the changed namespace"]},
            "lower_right": {"title": "Incidents and terminology review", "subtitle": "Operational incidents and advisory AI suggestions stay secondary to runtime blockers", "bullets": ["3 missing-resource incidents opened today", "2 inconsistent terms detected across leave labels", "Reviewer comments pending on one medical-policy bundle", "AI terminology suggestions available for 6 keys"]},
            "footer": {"title": "Pinned localization lenses", "subtitle": "Localization admins can pin locale, module, surface, incident, and fallback-focused diagnostic views", "chips": [{"label": "fr-FR", "w": 96, "fill": "#DCFCE7"}, {"label": "Payroll", "w": 104, "fill": "#DBEAFE"}, {"label": "Email", "w": 96, "fill": "#FEF3C7"}, {"label": "Fallback", "w": 116, "fill": "#FEE2E2"}, {"label": "Cache", "w": 96, "fill": "#EDE9FE"}, {"label": "Preview", "w": 110, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Runtime-first diagnostics", "detail": "This screen prioritizes runtime defects and fallback behavior before bulk translation editing."}, {"label": "Fallback always visible", "detail": "Fallback chain clarity prevents teams from confusing safe defaults with complete localization."}, {"label": "Preview beside health", "detail": "Date, currency, and copy preview sit next to defects because many localization issues are formatting issues."}, {"label": "Publish is gated", "detail": "Draft-ready and runtime-safe are treated as separate states to avoid premature release."}, {"label": "Cache is explicit", "detail": "Stale bundles are surfaced because localization incidents often come from invalidation failures."}, {"label": "Ownership in context", "detail": "Locale owner and reviewer context help resolve issues without switching to another admin surface."}, {"label": "AI is advisory", "detail": "Suggestions improve terminology consistency but never replace human publish control."}],
            "slug": "w0-scr-012-localization-diagnostics",
            "mobile_title": "Localization Diagnostics",
            "mobile_badge": "PROD",
            "mobile_chips": [{"label": "Locales 18", "w": 96, "fill": "#DBEAFE"}, {"label": "Fallback 3", "w": 118, "fill": "#FEF3C7"}, {"label": "Missing 21", "w": 124, "fill": "#FEE2E2"}],
            "mobile_search": "Search locale, module, bundle key, or fallback issue",
            "mobile_cards": [
                {"title": "Runtime matrix summary", "subtitle": "Mobile starts with locale and module defect hotspots", "bullets": ["fr-FR payroll missing 12 labels", "3 locales serving fallback copy", "2 bundles stale after publish", "1 unsafe markup warning"]},
                {"title": "Fallback preview", "subtitle": "Fallback explanation stays reviewable and publish-safe on mobile", "bullets": ["Spanish payslip using default bundle", "Country override missing", "Compare locale diff", "Flush cache before publish"], "actions": [{"label": "Compare locale", "w": 150, "fill": COLORS["blue"]}, {"label": "Open blockers", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Readiness and incidents", "subtitle": "Publish blockers, incidents, and terminology cues compress into one stack", "bullets": ["1 publish pending", "2 mandatory locales missing", "3 incidents today", "6 AI suggestions"]},
            ],
            "mobile_note": {"label": "Runtime-safe mobile", "detail": "Mobile preserves fallback, cache, and publish-risk cues before localization release actions."},
        },
        {
            "title": "Dynamic Form Designer",
            "badge": "Draft",
            "shell": "Control Plane",
            "nav": ["Forms", "Designer", "Preview", "Bindings", "Versions", "Help"],
            "chips": [{"label": "Fields 42", "w": 102, "fill": "#DBEAFE"}, {"label": "Rules 6", "w": 94, "fill": "#FEF3C7"}, {"label": "Preview clean", "w": 126, "fill": "#DCFCE7"}],
            "actions": [{"label": "Validate logic", "w": 176, "fill": COLORS["blue"]}, {"label": "Publish draft", "w": 150, "fill": COLORS["teal"]}],
            "search": "Search section, field, binding, rule, or preview state",
            "search_chips": [{"label": "Canvas", "w": 96, "fill": COLORS["soft"]}, {"label": "Rules", "w": 90, "fill": COLORS["soft"]}, {"label": "Preview", "w": 84, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Sections", "value": "08", "color": COLORS["green"]}, {"title": "Rules", "value": "06", "color": COLORS["amber"]}, {"title": "Errors", "value": "02", "color": COLORS["red"]}, {"title": "Bindings", "value": "11", "color": COLORS["blue"]}, {"title": "Consumers", "value": "04", "color": COLORS["teal"]}],
            "upper_left": {"title": "Outline and canvas builder", "subtitle": "Section structure and layout remain the primary authoring mental model", "bullets": ["Personal details section uses 2-column layout", "Repeater block configured for dependents", "Instruction copy added before tax declarations", "1 deprecated component still present in draft"]},
            "upper_right": {"title": "Rule and preview workspace", "subtitle": "Conditional logic, workflow binding, and preview remain visible during design", "note_title": "Rule insight", "note_body": "Manager comments field becomes mandatory only when a performance rating falls below threshold and the final workflow step requires manager sign-off.", "note_footer": "Next step: validate circular logic, preview mobile layout, and publish only after dependency checks pass.", "note_actions": [{"label": "Review rule", "w": 150, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open preview", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Selected component editor", "subtitle": "Field properties, defaults, and validation stay scoped to the selected component", "bullets": ["API binding set to employee_profile.legal_name", "Width changed to half column on desktop", "Default value cleared for compliance", "Validation mode set to strict text pattern"]},
            "lower_right": {"title": "Conflict and dependency inspector", "subtitle": "Circular rules, localization gaps, and downstream consumers remain visible before publish", "bullets": ["2 circular-rule risks detected", "1 field missing localized help text", "Workflow binding affects onboarding task set", "Document generation depends on 3 mapped fields"]},
            "footer": {"title": "Pinned form-design lenses", "subtitle": "Designers can pin section, device, binding, rule, and publish-risk views while iterating", "chips": [{"label": "Onboarding", "w": 114, "fill": "#DCFCE7"}, {"label": "Mobile", "w": 100, "fill": "#DBEAFE"}, {"label": "Rules", "w": 96, "fill": "#FEF3C7"}, {"label": "Conflict", "w": 112, "fill": "#FEE2E2"}, {"label": "Preview", "w": 106, "fill": "#EDE9FE"}, {"label": "Publish", "w": 106, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Section-first authoring", "detail": "Authors design forms around structure and flow before they fine-tune single components."}, {"label": "Rules stay nearby", "detail": "Conditional logic is visible in the main frame so layout and behavior are authored together."}, {"label": "Scoped editing", "detail": "Right-side editing reduces accidental global edits and clarifies which component is active."}, {"label": "Embedded preview", "detail": "Preview is part of the same workspace because layout decisions need immediate visual feedback."}, {"label": "Operational bindings", "detail": "Forms are treated as workflow artifacts, not isolated front-end surfaces."}, {"label": "Conflict clarity", "detail": "Circular logic and deprecated-field use are surfaced as publish-blocking risks."}, {"label": "AI never publishes", "detail": "AI may propose sections or rules, but live version control stays human governed."}],
            "slug": "w0-scr-013-dynamic-form-designer",
            "mobile_title": "Dynamic Form Designer",
            "mobile_badge": "Draft",
            "mobile_chips": [{"label": "Fields 42", "w": 92, "fill": "#DBEAFE"}, {"label": "Rules 6", "w": 90, "fill": "#FEF3C7"}, {"label": "Errors 2", "w": 96, "fill": "#FEE2E2"}],
            "mobile_search": "Search section, field, rule, or binding",
            "mobile_cards": [
                {"title": "Section cards and canvas summary", "subtitle": "Mobile starts with structure, not dense freeform editing", "bullets": ["8 sections in current form", "Dependents uses repeater block", "1 deprecated component remains", "2-column desktop layout defined"]},
                {"title": "Rule and preview summary", "subtitle": "Logic and preview cues stay explainable on mobile", "bullets": ["Manager comments conditionally required", "Validate circular logic", "Preview one device at a time", "Publish after dependency checks"], "actions": [{"label": "Review rule", "w": 150, "fill": COLORS["blue"]}, {"label": "Open preview", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Dependencies and conflicts", "subtitle": "Localization, workflow, and publish-risk cues compress into one stack", "bullets": ["2 circular-rule risks", "1 help text missing", "Workflow impact present", "3 mapped doc fields"]},
            ],
            "mobile_note": {"label": "Design-safe mobile", "detail": "Mobile supports review and focused edits while dense canvas authoring remains desktop-first."},
        },
        {
            "title": "Dynamic Field Catalog",
            "badge": "Schema Gov",
            "shell": "Control Plane",
            "nav": ["Fields", "Catalog", "Entities", "Usage", "Preview", "Help"],
            "chips": [{"label": "Active 186", "w": 106, "fill": "#DBEAFE"}, {"label": "Draft 9", "w": 90, "fill": "#FEF3C7"}, {"label": "Breaking 4", "w": 112, "fill": "#FEE2E2"}],
            "actions": [{"label": "Create field", "w": 156, "fill": COLORS["blue"]}, {"label": "Compare usage", "w": 162, "fill": COLORS["teal"]}],
            "search": "Search entity, field key, type, validation, API flag, or downstream usage",
            "search_chips": [{"label": "Catalog", "w": 94, "fill": COLORS["soft"]}, {"label": "Usage", "w": 90, "fill": COLORS["soft"]}, {"label": "Edit", "w": 48, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Entities", "value": "05", "color": COLORS["green"]}, {"title": "No validate", "value": "07", "color": COLORS["amber"]}, {"title": "Null risk", "value": "12", "color": COLORS["red"]}, {"title": "API exposed", "value": "38", "color": COLORS["blue"]}, {"title": "Translations", "value": "12", "color": COLORS["teal"]}],
            "upper_left": {"title": "Entity catalog and field inventory", "subtitle": "Grid-first governance helps admins compare many schema decisions at once", "bullets": ["Employee entity has 64 active custom fields", "7 fields missing validation rules", "4 draft fields expose breaking-type risk", "12 fields still missing translated labels"]},
            "upper_right": {"title": "Field editor and runtime preview", "subtitle": "Editing stays tied to safety signals, usage, and contextual preview", "note_title": "Breaking-change warning", "note_body": "Changing employee_grade from master-ref to text would invalidate form bindings, API contracts, and reporting filters across three modules.", "note_footer": "Next step: compare usage, define migration path, and publish only after downstream impact is accepted.", "note_actions": [{"label": "Review usage", "w": 150, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open preview", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Usage and downstream impact", "subtitle": "Forms, reports, search, and integrations reveal whether a field change is safe", "bullets": ["3 forms consume employee_grade", "2 payroll reports filter on this field", "Search index refresh needed after publish", "Masking inheritance active on 1 sensitive field"]},
            "lower_right": {"title": "Validation and activation guardrails", "subtitle": "Validation gaps and activation risks remain visible before schema changes go live", "bullets": ["Historical-data impact affects 24k rows", "Required flag change will alter import rules", "1 API client still relies on legacy key", "Activation blocked until translation set is complete"]},
            "footer": {"title": "Pinned field-governance lenses", "subtitle": "Platform admins can pin entity, type, API, validation, and breaking-change views", "chips": [{"label": "Employee", "w": 110, "fill": "#DCFCE7"}, {"label": "Reference", "w": 112, "fill": "#DBEAFE"}, {"label": "API", "w": 82, "fill": "#FEF3C7"}, {"label": "Breaking", "w": 116, "fill": "#FEE2E2"}, {"label": "Preview", "w": 102, "fill": "#EDE9FE"}, {"label": "Usage", "w": 96, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Grid before form", "detail": "Schema governance depends on comparing many fields before opening one editor."}, {"label": "Exposure visible early", "detail": "API, masking, and search flags are treated as risk signals, not hidden metadata."}, {"label": "Usage beside edit", "detail": "Downstream consumers stay adjacent so unsafe field changes are visible immediately."}, {"label": "Key and type emphasis", "detail": "The hardest-to-change attributes are surfaced early in the edit flow."}, {"label": "Preview in context", "detail": "Runtime preview shows whether configuration decisions actually make sense to end users."}, {"label": "Breaking vs invalid", "detail": "The design distinguishes immediate validation errors from future migration risk."}, {"label": "AI suggests, admins decide", "detail": "AI can spot redundancy or validation gaps, but activation remains a governed action."}],
            "slug": "w0-scr-014-dynamic-field-catalog",
            "mobile_title": "Dynamic Field Catalog",
            "mobile_badge": "Schema",
            "mobile_chips": [{"label": "Active 186", "w": 98, "fill": "#DBEAFE"}, {"label": "Draft 9", "w": 88, "fill": "#FEF3C7"}, {"label": "Break 4", "w": 92, "fill": "#FEE2E2"}],
            "mobile_search": "Search entity, field, type, or downstream usage",
            "mobile_cards": [
                {"title": "Entity and field summary", "subtitle": "Mobile starts with field counts, validation gaps, and draft risk", "bullets": ["Employee has 64 active custom fields", "7 fields lack validation", "4 breaking-change drafts", "12 labels untranslated"]},
                {"title": "Field warning and preview", "subtitle": "Breaking-change reasoning stays visible on mobile", "bullets": ["Type shift would break forms and APIs", "Compare downstream usage", "Define migration path", "Preview before activation"], "actions": [{"label": "Review usage", "w": 150, "fill": COLORS["blue"]}, {"label": "Open preview", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Activation guardrails", "subtitle": "Usage, API, and translation blockers compress into one stack", "bullets": ["3 forms depend on field", "Search reindex needed", "1 client uses legacy key", "Activation blocked pending labels"]},
            ],
            "mobile_note": {"label": "Schema-safe mobile", "detail": "Mobile keeps review and targeted edits possible while dense cross-field comparison remains desktop-first."},
        },
        {
            "title": "Dynamic Master Console",
            "badge": "Reference Data",
            "shell": "Control Plane",
            "nav": ["Masters", "Catalog", "Tree", "Imports", "Exports", "Help"],
            "chips": [{"label": "Sets 74", "w": 92, "fill": "#DBEAFE"}, {"label": "Pending 11", "w": 110, "fill": "#FEF3C7"}, {"label": "Blockers 3", "w": 108, "fill": "#FEE2E2"}],
            "actions": [{"label": "Import values", "w": 164, "fill": COLORS["blue"]}, {"label": "Publish changes", "w": 162, "fill": COLORS["teal"]}],
            "search": "Search master set, code, hierarchy, replacement path, or import batch",
            "search_chips": [{"label": "Tree", "w": 78, "fill": COLORS["soft"]}, {"label": "Import", "w": 88, "fill": COLORS["soft"]}, {"label": "Publish", "w": 72, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Sets", "value": "74", "color": COLORS["green"]}, {"title": "Value changes", "value": "11", "color": COLORS["amber"]}, {"title": "Retire blocks", "value": "03", "color": COLORS["red"]}, {"title": "Imports", "value": "02", "color": COLORS["blue"]}, {"title": "Locales", "value": "16", "color": COLORS["teal"]}],
            "upper_left": {"title": "Master catalog and value tree", "subtitle": "Flat tables and governed hierarchies coexist because reference data has both forms", "bullets": ["Location master uses 4-level hierarchy", "11 pending label or code changes", "3 values blocked from retirement due to active use", "2 imports still validating locale labels"]},
            "upper_right": {"title": "Editor, replacement path, and export view", "subtitle": "Replacement safety and external consumption remain visible while maintaining values", "note_title": "Retirement risk", "note_body": "Retiring grade_band_G5 without replacement would break compensation forms, payroll rules, and two active workflow conditions.", "note_footer": "Next step: assign replacement path, preview export impact, and publish only when blockers resolve.", "note_actions": [{"label": "Review path", "w": 146, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open export", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Usage and import lineage", "subtitle": "Imports, workflow consumers, and hierarchy usage remain near the selected value", "bullets": ["4 forms use current location values", "2 reports flatten this hierarchy", "Import batch 84 has 6 row conflicts", "Workflow conditions reference 3 selected codes"]},
            "lower_right": {"title": "Locale labels and quality cues", "subtitle": "Translation completeness and duplicate detection support governed reference data maintenance", "bullets": ["1 locale label missing in Arabic", "Duplicate candidate pair detected in department list", "External export preview changed for 2 values", "AI anomaly review suggested on one import cluster"]},
            "footer": {"title": "Pinned master-data lenses", "subtitle": "Admins can pin hierarchy, import, export, locale, and retirement-risk views for faster governance work", "chips": [{"label": "Location", "w": 104, "fill": "#DCFCE7"}, {"label": "Tree", "w": 82, "fill": "#DBEAFE"}, {"label": "Import", "w": 92, "fill": "#FEF3C7"}, {"label": "Retire", "w": 96, "fill": "#FEE2E2"}, {"label": "Locale", "w": 92, "fill": "#EDE9FE"}, {"label": "Export", "w": 96, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Table and tree together", "detail": "Reference-data maintenance needs both flat and hierarchical views in one console."}, {"label": "Usage is central", "detail": "Retiring or replacing values can break many modules, so downstream use stays visible."}, {"label": "Import stays nearby", "detail": "High-volume maintenance is governed without forcing users into a separate workflow."}, {"label": "Replacement is explicit", "detail": "In-use retirement needs a clear path, not just a delete warning."}, {"label": "Locale labels matter", "detail": "Master-data translation gaps are surfaced before they leak into runtime forms."}, {"label": "Exports are operational", "detail": "External systems often need flattened output, so export impact is shown in context."}, {"label": "AI helps quality only", "detail": "Anomaly detection can assist, but authoritative value changes remain human controlled."}],
            "slug": "w0-scr-015-dynamic-master-console",
            "mobile_title": "Dynamic Master Console",
            "mobile_badge": "Masters",
            "mobile_chips": [{"label": "Sets 74", "w": 86, "fill": "#DBEAFE"}, {"label": "Pending 11", "w": 106, "fill": "#FEF3C7"}, {"label": "Blocks 3", "w": 100, "fill": "#FEE2E2"}],
            "mobile_search": "Search set, value, hierarchy, or import batch",
            "mobile_cards": [
                {"title": "Catalog and hierarchy summary", "subtitle": "Mobile starts with pending value and retirement risk", "bullets": ["4-level location hierarchy active", "11 pending changes", "3 retire blockers", "2 imports validating labels"]},
                {"title": "Replacement and export risk", "subtitle": "Replacement-path reasoning stays reviewable on mobile", "bullets": ["Grade band change would break forms", "Assign replacement path", "Preview export impact", "Publish after blockers clear"], "actions": [{"label": "Review path", "w": 146, "fill": COLORS["blue"]}, {"label": "Open export", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Import and locale quality", "subtitle": "Import conflicts, locale labels, and duplicate cues compress into one stack", "bullets": ["6 row conflicts in batch 84", "1 locale missing Arabic label", "2 reports flatten hierarchy", "Duplicate pair detected"]},
            ],
            "mobile_note": {"label": "Master-safe mobile", "detail": "Mobile preserves replacement and import risk cues while dense hierarchy maintenance stays desktop-led."},
        },
        {
            "title": "Localization Bundle Manager",
            "badge": "PROD",
            "shell": "Control Plane",
            "nav": ["Localization", "Bundles", "Compare", "Preview", "Publish", "Help"],
            "chips": [{"label": "Drafts 12", "w": 102, "fill": "#DBEAFE"}, {"label": "Missing 48", "w": 102, "fill": "#FEF3C7"}, {"label": "Queue 3", "w": 88, "fill": "#FEE2E2"}],
            "actions": [{"label": "Review bundle", "w": 164, "fill": COLORS["blue"]}, {"label": "Publish", "w": 138, "fill": COLORS["teal"]}],
            "search": "Search locale, namespace, string key, bundle diff, or publish blocker",
            "search_chips": [{"label": "Strings", "w": 92, "fill": COLORS["soft"]}, {"label": "Preview", "w": 98, "fill": COLORS["soft"]}, {"label": "Compare", "w": 86, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Locales", "value": "18", "color": COLORS["green"]}, {"title": "Complete", "value": "94.6%", "color": COLORS["amber"]}, {"title": "Fallback 24h", "value": "312", "color": COLORS["red"]}, {"title": "Blocked", "value": "02", "color": COLORS["blue"]}, {"title": "Queue", "value": "03", "color": COLORS["teal"]}],
            "upper_left": {"title": "Locale catalog and translation grid", "subtitle": "Controlled editing remains the core surface of this admin console", "bullets": ["12 draft bundles still open", "48 strings missing in mandatory locales", "Namespace filters active across payroll and documents", "1 bundle diff awaiting final reviewer"]},
            "upper_right": {"title": "Preview, compare, and fallback trace", "subtitle": "Surface-specific preview and fallback diagnostics stay adjacent to edited content", "note_title": "Preview insight", "note_body": "A missing notification string in de-DE is falling back to en-IN for document delivery while the web bundle remains complete.", "note_footer": "Next step: compare locale, preview notification output, and publish only after unsafe-markup checks clear.", "note_actions": [{"label": "Compare locale", "w": 154, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open readiness", "w": 148, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Publish readiness", "subtitle": "Mandatory-locale coverage, unsafe markup, and cache notes remain visible before release", "bullets": ["2 blocked publishes due to missing mandatory strings", "Unsafe markup flagged in one email token", "Cache invalidation notice attached to payroll module", "4 modules impacted by the selected namespace"]},
            "lower_right": {"title": "Terminology and incidents", "subtitle": "Quality suggestions and live incidents remain available without overwhelming the edit surface", "bullets": ["Recent missing-resource incidents linked to two bundles", "3 terminology inconsistencies detected", "Reviewer comments pending on 1 locale", "AI translation suggestions queued for 6 strings"]},
            "footer": {"title": "Pinned bundle-management lenses", "subtitle": "Localization owners can pin locale, namespace, surface, quality, and publish-focused views", "chips": [{"label": "de-DE", "w": 96, "fill": "#DCFCE7"}, {"label": "Documents", "w": 116, "fill": "#DBEAFE"}, {"label": "Missing", "w": 104, "fill": "#FEF3C7"}, {"label": "Fallback", "w": 114, "fill": "#FEE2E2"}, {"label": "Preview", "w": 102, "fill": "#EDE9FE"}, {"label": "Publish", "w": 100, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Editing leads", "detail": "The translation grid stays primary because this console is about governed content maintenance."}, {"label": "Readiness over polish", "detail": "Publish blockers outrank terminology improvements so release risk is obvious."}, {"label": "Multi-surface preview", "detail": "Web, mobile, email, and document variants are shown separately to catch contextual defects."}, {"label": "Fallback must be visible", "detail": "Fallback behavior is explicit rather than silent so admins can reason about runtime outcomes."}, {"label": "Missing counts are operational", "detail": "Missing-resource counts are hero-level because they are the clearest runtime risk signal."}, {"label": "AI is subordinate", "detail": "AI translation help stays advisory-only to preserve publisher accountability."}, {"label": "Mobile trims comparison", "detail": "Small screens support review and quick correction, not dense side-by-side bundle management."}],
            "slug": "w0-scr-016-localization-bundle-manager",
            "mobile_title": "Localization Bundle Manager",
            "mobile_badge": "PROD",
            "mobile_chips": [{"label": "Draft 12", "w": 92, "fill": "#DBEAFE"}, {"label": "Missing 48", "w": 112, "fill": "#FEF3C7"}, {"label": "Queue 3", "w": 88, "fill": "#FEE2E2"}],
            "mobile_search": "Search locale, namespace, string, or publish blocker",
            "mobile_cards": [
                {"title": "Bundle and missing-string summary", "subtitle": "Mobile starts with draft, missing, and namespace state", "bullets": ["12 draft bundles", "48 missing mandatory strings", "1 reviewer diff pending", "Payroll and docs affected"]},
                {"title": "Preview and fallback trace", "subtitle": "Preview and fallback remain explainable on mobile", "bullets": ["de-DE notification falls back to en-IN", "Preview document output", "Compare locale delta", "Clear readiness blockers"], "actions": [{"label": "Compare locale", "w": 150, "fill": COLORS["blue"]}, {"label": "Open readiness", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Readiness and incidents", "subtitle": "Publish blockers, incidents, and AI suggestions compress into one stack", "bullets": ["2 blocked publishes", "1 unsafe markup flag", "3 terminology issues", "6 AI suggestions"]},
            ],
            "mobile_note": {"label": "Bundle-safe mobile", "detail": "Mobile keeps publish blockers and fallback context visible before localization release actions."},
        },
        {
            "title": "System Settings Console",
            "badge": "SETTINGS",
            "shell": "Control Plane",
            "nav": ["Settings", "Scopes", "History", "Approval", "Rollback", "Help"],
            "chips": [{"label": "Approvals 3", "w": 112, "fill": "#DBEAFE"}, {"label": "High risk 9", "w": 110, "fill": "#FEF3C7"}, {"label": "Rollback 24h", "w": 126, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open change request", "w": 188, "fill": COLORS["blue"]}, {"label": "Rollback", "w": 138, "fill": COLORS["teal"]}],
            "search": "Search setting key, owner, scope, risk class, environment drift, or change request",
            "search_chips": [{"label": "Compare", "w": 94, "fill": COLORS["soft"]}, {"label": "History", "w": 92, "fill": COLORS["soft"]}, {"label": "Edit", "w": 46, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Active", "value": "2148", "color": COLORS["green"]}, {"title": "Changed 7d", "value": "14", "color": COLORS["amber"]}, {"title": "Drift", "value": "05", "color": COLORS["red"]}, {"title": "Validation", "value": "03", "color": COLORS["blue"]}, {"title": "Critical", "value": "09", "color": COLORS["teal"]}],
            "upper_left": {"title": "Settings domains and key inventory", "subtitle": "Definition-first tables help operators judge risk before touching values", "bullets": ["9 high-risk keys in payroll and identity domains", "3 pending approvals block immediate activation", "Environment drift detected in 5 settings", "14 critical changes landed in the last 7 days"]},
            "upper_right": {"title": "Change composer and lineage compare", "subtitle": "Proposed value, scope lineage, and downstream impact stay in one governed edit surface", "note_title": "Change insight", "note_body": "Turning on payroll_auto_close at tenant scope would override the provider default and trigger close workflow changes for two active entities.", "note_footer": "Next step: compare scopes, validate dependencies, and submit approval before scheduling activation.", "note_actions": [{"label": "Compare scopes", "w": 154, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open history", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Resolution and rollback history", "subtitle": "Rollback candidates and prior versions stay visible during governed setting changes", "bullets": ["24-hour rollback window active for 7 keys", "Prior version snapshots stored for all critical settings", "1 failed validation still unresolved", "Scope lineage differs between provider and tenant"]},
            "lower_right": {"title": "Runtime risk and incident notes", "subtitle": "Downstream service impact, cache behavior, and audit duties remain explicit", "bullets": ["Cache TTL refresh required on publish", "Workflow service affected by selected key", "Audit comment mandatory for critical updates", "Linked incident open for one drifted value"]},
            "footer": {"title": "Pinned settings-governance lenses", "subtitle": "Platform admins can pin domain, risk, scope, rollback, and drift-focused settings views", "chips": [{"label": "Payroll", "w": 102, "fill": "#DCFCE7"}, {"label": "Tenant", "w": 96, "fill": "#DBEAFE"}, {"label": "High risk", "w": 112, "fill": "#FEF3C7"}, {"label": "Drift", "w": 92, "fill": "#FEE2E2"}, {"label": "Rollback", "w": 110, "fill": "#EDE9FE"}, {"label": "History", "w": 100, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Definition before value", "detail": "Risk class, scope, and owner matter before operators decide whether to edit a setting."}, {"label": "Compare and compose together", "detail": "Safe configuration depends on proposed value and effective lineage being visible together."}, {"label": "Rollback is first-class", "detail": "Operational rollback is surfaced early because configuration mistakes can be production incidents."}, {"label": "Validation is visible", "detail": "Validation failures sit in the KPI row because they directly govern publish safety."}, {"label": "Scope compare is explicit", "detail": "Override behavior is treated as a first-class action to reduce enterprise misconfiguration."}, {"label": "Runtime notes stay nearby", "detail": "Cache and downstream service impact are visible without cluttering the edit flow."}, {"label": "Mobile stays capable", "detail": "Urgent review and rollback can happen away from desk, but dense compare views collapse into drill-down."}],
            "slug": "w0-scr-017-system-settings-console",
            "mobile_title": "System Settings Console",
            "mobile_badge": "SET",
            "mobile_chips": [{"label": "Approvals 3", "w": 104, "fill": "#DBEAFE"}, {"label": "Risk 9", "w": 84, "fill": "#FEF3C7"}, {"label": "Drift 5", "w": 88, "fill": "#FEE2E2"}],
            "mobile_search": "Search key, scope, risk, or change request",
            "mobile_cards": [
                {"title": "Key inventory and drift summary", "subtitle": "Mobile starts with approvals, high-risk keys, and drift", "bullets": ["9 high-risk keys", "3 pending approvals", "5 drift alerts", "14 critical changes in 7 days"]},
                {"title": "Change and lineage summary", "subtitle": "Scope override reasoning stays visible on mobile", "bullets": ["Tenant override impacts 2 entities", "Compare scopes before activation", "Validate dependencies", "Submit approval before scheduling"], "actions": [{"label": "Compare scopes", "w": 150, "fill": COLORS["blue"]}, {"label": "Open history", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Rollback and runtime notes", "subtitle": "Rollback windows, cache, and audit cues compress into one stack", "bullets": ["24h rollback for 7 keys", "1 failed validation unresolved", "Cache refresh required", "Audit comment mandatory"]},
            ],
            "mobile_note": {"label": "Config-safe mobile", "detail": "Mobile preserves review, approval, and rollback cues before platform settings are changed."},
        },
        {
            "title": "Access Governance Dashboard",
            "badge": "SECURITY",
            "shell": "Control Plane",
            "nav": ["Governance", "Campaigns", "Privileged", "SoD", "Remediation", "Help"],
            "chips": [{"label": "Campaign risk", "w": 128, "fill": "#DBEAFE"}, {"label": "SoD 6", "w": 86, "fill": "#FEF3C7"}, {"label": "Privileged 4", "w": 116, "fill": "#FEE2E2"}],
            "actions": [{"label": "Review campaign", "w": 176, "fill": COLORS["blue"]}, {"label": "Launch remediation", "w": 170, "fill": COLORS["teal"]}],
            "search": "Search campaign, role family, privileged grant, reviewer, system, or audit alert",
            "search_chips": [{"label": "High risk", "w": 102, "fill": COLORS["soft"]}, {"label": "Privileged", "w": 110, "fill": COLORS["soft"]}, {"label": "Review", "w": 66, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Campaigns", "value": "11", "color": COLORS["green"]}, {"title": "High risk", "value": "146", "color": COLORS["amber"]}, {"title": "Overdue", "value": "23", "color": COLORS["red"]}, {"title": "Stale priv", "value": "17", "color": COLORS["blue"]}, {"title": "Alerts", "value": "04", "color": COLORS["teal"]}],
            "upper_left": {"title": "Campaign overview and risk posture", "subtitle": "High-risk governance work outranks summary analytics on this dashboard", "bullets": ["11 active campaigns across 5 systems", "146 high-risk items still pending review", "23 revocations now overdue", "17 privileged grants look dormant"]},
            "upper_right": {"title": "High-risk queue and evidence context", "subtitle": "Privileged access review, justification, and alert context stay in one work surface", "note_title": "Governance alert", "note_body": "A dormant payroll admin grant still retains export and reveal privileges even though the user has not accessed the system for 46 days.", "note_footer": "Next step: inspect last-used evidence, open remediation, and certify or revoke with audit context attached.", "note_actions": [{"label": "Open high risk", "w": 150, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open evidence", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "SoD and campaign remediation", "subtitle": "Conflict discovery and downstream closure remain tied together", "bullets": ["6 SoD breaches remain open", "2 remediations awaiting connector confirmation", "Exception approvals active in one campaign", "Repeat violation cluster detected in finance"]},
            "lower_right": {"title": "Reviewer context and export readiness", "subtitle": "Justification, delegation, and audit evidence remain visible beside action cues", "bullets": ["Delegated reviewer active in 3 campaigns", "Immutable evidence ready for export", "Self-certification exception flagged on 2 items", "One privileged alert escalated to compliance"]},
            "footer": {"title": "Pinned access-governance lenses", "subtitle": "Security teams can pin risk class, privileged state, system, campaign, and remediation views", "chips": [{"label": "Privileged", "w": 112, "fill": "#DCFCE7"}, {"label": "Dormant", "w": 102, "fill": "#DBEAFE"}, {"label": "SoD", "w": 80, "fill": "#FEF3C7"}, {"label": "Overdue", "w": 100, "fill": "#FEE2E2"}, {"label": "Evidence", "w": 104, "fill": "#EDE9FE"}, {"label": "Remediate", "w": 116, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Risk before summary", "detail": "High-risk and overdue items outrank aggregate completion because exposure drives the next decision."}, {"label": "Progress needs overlays", "detail": "Campaign completion is shown with risk context because completion alone can be misleading."}, {"label": "Conflict and closure together", "detail": "SoD findings and remediation remain adjacent because detection without closure is incomplete control."}, {"label": "Evidence beside action", "detail": "Justification and last-used proof stay visible so reviewers never act blind."}, {"label": "Bulk is constrained", "detail": "High-risk rows resist convenience actions to reinforce certification policy boundaries."}, {"label": "Dormant privilege is elevated", "detail": "Stale privileged access is a KPI because it is one of the most actionable governance signals."}, {"label": "Mobile stays actionable", "detail": "Mobile keeps review and escalation possible while dense heatmaps compress into simpler prioritization."}],
            "slug": "w0-scr-019-access-governance-dashboard",
            "mobile_title": "Access Governance",
            "mobile_badge": "SEC",
            "mobile_chips": [{"label": "Risk 146", "w": 92, "fill": "#DBEAFE"}, {"label": "SoD 6", "w": 84, "fill": "#FEF3C7"}, {"label": "Overdue 23", "w": 108, "fill": "#FEE2E2"}],
            "mobile_search": "Search campaign, role, reviewer, or alert",
            "mobile_cards": [
                {"title": "Campaign and risk summary", "subtitle": "Mobile starts with privileged and overdue access work", "bullets": ["11 active campaigns", "146 high-risk items", "23 overdue revocations", "17 dormant privileged grants"]},
                {"title": "High-risk review cue", "subtitle": "Evidence and action remain explainable on mobile", "bullets": ["Dormant payroll admin grant flagged", "Inspect last-used evidence", "Open remediation", "Certify or revoke with context"], "actions": [{"label": "Open high risk", "w": 150, "fill": COLORS["blue"]}, {"label": "Open evidence", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Conflict and remediation stack", "subtitle": "SoD, delegation, and export-readiness cues compress into one stack", "bullets": ["6 SoD breaches open", "2 connector confirmations pending", "2 self-cert exceptions", "1 escalated privileged alert"]},
            ],
            "mobile_note": {"label": "Governance-ready mobile", "detail": "Mobile preserves high-risk triage and evidence-led review before security actions are taken."},
        },
        {
            "title": "Role and Policy Matrix Workspace",
            "badge": "RBAC",
            "shell": "Control Plane",
            "nav": ["Roles", "Policies", "Scope", "Conflicts", "Compare", "Help"],
            "chips": [{"label": "Drafts 5", "w": 94, "fill": "#DBEAFE"}, {"label": "Conflicts 12", "w": 116, "fill": "#FEF3C7"}, {"label": "Roles 84", "w": 90, "fill": "#FEE2E2"}],
            "actions": [{"label": "Run conflict check", "w": 182, "fill": COLORS["blue"]}, {"label": "Publish draft", "w": 150, "fill": COLORS["teal"]}],
            "search": "Search role family, permission group, deny rule, scope boundary, or compare version",
            "search_chips": [{"label": "Matrix", "w": 92, "fill": COLORS["soft"]}, {"label": "Scope", "w": 88, "fill": COLORS["soft"]}, {"label": "Compare", "w": 86, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Roles", "value": "84", "color": COLORS["green"]}, {"title": "Mapped perms", "value": "1236", "color": COLORS["amber"]}, {"title": "SoD", "value": "12", "color": COLORS["red"]}, {"title": "Sensitive gaps", "value": "07", "color": COLORS["blue"]}, {"title": "Drafts", "value": "05", "color": COLORS["teal"]}],
            "upper_left": {"title": "Role families and permission matrix", "subtitle": "Dense comparison remains necessary for safe access-model design", "bullets": ["84 roles grouped across 7 families", "1,236 permission mappings under review", "12 SoD conflicts remain unresolved", "7 sensitive permissions lack a clean owner"]},
            "upper_right": {"title": "Policy inspector and version compare", "subtitle": "Scope, deny rules, and draft-vs-live differences stay beside the matrix", "note_title": "Conflict insight", "note_body": "The recruiter_manager draft role adds export access that conflicts with an existing deny rule for candidate-sensitive attachments in delegated sessions.", "note_footer": "Next step: compare draft to live, resolve hidden privilege overlap, and publish only after conflict checks pass.", "note_actions": [{"label": "Review compare", "w": 150, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open warnings", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Affected users and automation impact", "subtitle": "Downstream user counts and automation dependencies reveal the blast radius of policy edits", "bullets": ["246 users mapped to selected role family", "2 automations consume the draft permission set", "1 support-session exclusion needs review", "Delegated access expiry overlaps one policy rule"]},
            "lower_right": {"title": "Governance warnings and review cadence", "subtitle": "Persistent warnings prevent silent privilege drift during design", "bullets": ["Certification due on one privileged role", "Deprecated permission still used in 2 roles", "Hidden overlap found in export + reveal combination", "Publish blocked until SoD issues resolve"]},
            "footer": {"title": "Pinned role-governance lenses", "subtitle": "Security admins can pin role family, scope, compare, SoD, and sensitive-permission views", "chips": [{"label": "Recruiter", "w": 106, "fill": "#DCFCE7"}, {"label": "Tenant scope", "w": 118, "fill": "#DBEAFE"}, {"label": "Compare", "w": 96, "fill": "#FEF3C7"}, {"label": "SoD", "w": 80, "fill": "#FEE2E2"}, {"label": "Sensitive", "w": 102, "fill": "#EDE9FE"}, {"label": "Publish", "w": 96, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Family-first readability", "detail": "Permission families make the matrix understandable to both security and business stakeholders."}, {"label": "Scope beside matrix", "detail": "Access design is incomplete without boundary and deny-rule context."}, {"label": "Warnings persist", "detail": "SoD and hidden-privilege issues remain visible throughout design, not only at publish."}, {"label": "Compare is dedicated", "detail": "Draft-versus-live differences are a core governance ritual, not an incidental feature."}, {"label": "Sensitive gaps are KPIs", "detail": "Unassigned sensitive permissions expose design debt and future privilege leakage risk."}, {"label": "Mobile is reduced", "detail": "Safe role architecture needs dense comparison that small screens cannot support reliably."}, {"label": "Publish follows review", "detail": "Conflict checking is visually upstream of release to reinforce governance order."}],
            "slug": "w0-scr-020-role-and-policy-matrix-workspace",
            "mobile_title": "Role and Policy Matrix",
            "mobile_badge": "RBAC",
            "mobile_chips": [{"label": "Drafts 5", "w": 88, "fill": "#DBEAFE"}, {"label": "SoD 12", "w": 92, "fill": "#FEF3C7"}, {"label": "Roles 84", "w": 88, "fill": "#FEE2E2"}],
            "mobile_search": "Search role family, permission group, or compare state",
            "mobile_cards": [
                {"title": "Role and conflict summary", "subtitle": "Mobile starts with role counts and unresolved governance risk", "bullets": ["84 roles across 7 families", "1,236 permission mappings", "12 SoD conflicts", "7 sensitive gaps"]},
                {"title": "Compare and policy warning", "subtitle": "Draft-vs-live and scope conflict reasoning stay reviewable on mobile", "bullets": ["Export access conflicts with deny rule", "Compare draft to live", "Resolve hidden privilege overlap", "Publish after checks pass"], "actions": [{"label": "Review compare", "w": 150, "fill": COLORS["blue"]}, {"label": "Open warnings", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Impact and review stack", "subtitle": "Affected users, automation, and cadence cues compress into one stack", "bullets": ["246 users affected", "2 automations depend on draft", "1 support-session exclusion", "Publish blocked pending SoD fix"]},
            ],
            "mobile_note": {"label": "Policy-safe mobile", "detail": "Mobile preserves review and targeted edits while full matrix design remains desktop-first."},
        },
        {
            "title": "Data Masking Policy Console",
            "badge": "Privacy",
            "shell": "Control Plane",
            "nav": ["Security", "Policies", "Reveal", "Exports", "Audit", "Help"],
            "chips": [{"label": "Policies 184", "w": 116, "fill": "#DBEAFE"}, {"label": "Reveal 12", "w": 102, "fill": "#FEF3C7"}, {"label": "Exposure 5", "w": 104, "fill": "#FEE2E2"}],
            "actions": [{"label": "Preview masking", "w": 174, "fill": COLORS["blue"]}, {"label": "Review reveal queue", "w": 184, "fill": COLORS["teal"]}],
            "search": "Search field class, policy, reveal rule, export scope, or masking incident",
            "search_chips": [{"label": "Preview", "w": 94, "fill": COLORS["soft"]}, {"label": "Reveal", "w": 92, "fill": COLORS["soft"]}, {"label": "Policy", "w": 62, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Coverage", "value": "184", "color": COLORS["green"]}, {"title": "Reveal pending", "value": "12", "color": COLORS["amber"]}, {"title": "Masked exports", "value": "41", "color": COLORS["red"]}, {"title": "Incidents", "value": "05", "color": COLORS["blue"]}, {"title": "Drift", "value": "03", "color": COLORS["teal"]}],
            "upper_left": {"title": "Policy summary and channel coverage", "subtitle": "UI, API, and export exposure are governed together, not separately", "bullets": ["Payroll PII policy covers 18 sensitive fields", "3 export-only exceptions still active", "1 medical-data reveal policy expires tomorrow", "2 policies drift from approved baseline"]},
            "upper_right": {"title": "Masked preview studio", "subtitle": "Before-and-after previews remain adjacent to policy definitions", "note_title": "Masking preview", "note_body": "Aadhaar, passport, and bank account values are partially masked in UI and fully tokenized in export, but one derived label still reveals last-four values.", "note_footer": "Next step: run derived-field leak check, review reveal path, and publish only after export preview is safe.", "note_actions": [{"label": "Open preview", "w": 150, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Review reveal", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Reveal request queue", "subtitle": "Just-in-time reveal remains tightly coupled to masking policy decisions", "bullets": ["12 reveal approvals pending", "3 requests target payroll exports", "Approver scope expires on 1 reveal path", "2 requests require legal comment"]},
            "lower_right": {"title": "Downstream impact and audit", "subtitle": "Reports, APIs, and exports affected by masking changes stay visible before publish", "bullets": ["5 reports touched by the selected rule", "3 API endpoints inherit current mask", "One enforcement incident opened yesterday", "Audit export ready with policy diff"]},
            "footer": {"title": "Pinned masking-policy lenses", "subtitle": "Privacy teams can pin field class, channel, reveal, incident, and export-focused views", "chips": [{"label": "Payroll PII", "w": 116, "fill": "#DCFCE7"}, {"label": "API", "w": 76, "fill": "#DBEAFE"}, {"label": "Reveal", "w": 92, "fill": "#FEF3C7"}, {"label": "Incident", "w": 100, "fill": "#FEE2E2"}, {"label": "Export", "w": 92, "fill": "#EDE9FE"}, {"label": "Derived", "w": 94, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Decision-first privacy", "detail": "Masking mistakes are governance failures, so review and preview outrank general admin actions."}, {"label": "Preview sits beside policy", "detail": "Admins can validate UI, API, and export outcomes without leaving the policy screen."}, {"label": "Channel-specific exposure", "detail": "A field can behave differently by channel, so each path is shown separately."}, {"label": "Reveal is nearby", "detail": "Reveal approvals are part of masking operations, not a detached helpdesk flow."}, {"label": "Derived leaks are explicit", "detail": "Computed labels can leak masked values, so leak checks get dedicated space."}, {"label": "Impact is a peer surface", "detail": "Reports and APIs are visible because masking edits can silently expose or break downstream consumers."}, {"label": "Mobile is review-first", "detail": "Small screens support triage and approval while heavy matrix authoring stays desktop-led."}],
            "slug": "w0-scr-021-data-masking-policy-console",
            "mobile_title": "Data Masking Policy",
            "mobile_badge": "Privacy",
            "mobile_chips": [{"label": "Policies", "w": 86, "fill": "#DBEAFE"}, {"label": "Reveal 12", "w": 100, "fill": "#FEF3C7"}, {"label": "Risk 5", "w": 80, "fill": "#FEE2E2"}],
            "mobile_search": "Search policy, field class, channel, or reveal request",
            "mobile_cards": [
                {"title": "Policy and exposure summary", "subtitle": "Mobile starts with coverage, reveal load, and drift", "bullets": ["184 active policies", "3 export exceptions", "1 reveal policy expiring", "2 baseline drifts"]},
                {"title": "Masked preview and leak cue", "subtitle": "Preview and reveal remain explainable on mobile", "bullets": ["UI and export masks differ", "Derived label still leaks last-four", "Run leak check", "Publish after safe preview"], "actions": [{"label": "Open preview", "w": 150, "fill": COLORS["blue"]}, {"label": "Review reveal", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Reveal and impact stack", "subtitle": "Reveal approvals, reports, and incidents compress into one stack", "bullets": ["12 reveals pending", "5 reports touched", "3 API endpoints inherit mask", "1 enforcement incident"]},
            ],
            "mobile_note": {"label": "Privacy-safe mobile", "detail": "Mobile preserves masking preview and reveal control before sensitive data rules are changed."},
        },
        {
            "title": "Retention and Legal-Hold Control Center",
            "badge": "Governance",
            "shell": "Control Plane",
            "nav": ["Retention", "Legal Hold", "Archive", "Purge Jobs", "Evidence", "Help"],
            "chips": [{"label": "Holds 27", "w": 92, "fill": "#DBEAFE"}, {"label": "Purge 18.4k", "w": 122, "fill": "#FEF3C7"}, {"label": "Blocked 42", "w": 108, "fill": "#FEE2E2"}],
            "actions": [{"label": "Run simulation", "w": 162, "fill": COLORS["blue"]}, {"label": "Apply legal hold", "w": 168, "fill": COLORS["teal"]}],
            "search": "Search policy, jurisdiction, hold case, purge job, archived batch, or retention class",
            "search_chips": [{"label": "Policies", "w": 98, "fill": COLORS["soft"]}, {"label": "Jobs", "w": 78, "fill": COLORS["soft"]}, {"label": "Hold", "w": 54, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Eligible", "value": "18.4k", "color": COLORS["green"]}, {"title": "Holds", "value": "27", "color": COLORS["amber"]}, {"title": "Archive q", "value": "410", "color": COLORS["red"]}, {"title": "Failed jobs", "value": "03", "color": COLORS["blue"]}, {"title": "Storage", "value": "9.2TB", "color": COLORS["teal"]}],
            "upper_left": {"title": "Retention policy inventory and simulation", "subtitle": "Policy design and disposal impact are reviewed in one cockpit", "bullets": ["EU personnel files follow anonymize-first rule", "18.4k records are now purge eligible", "410 records need archive before purge", "Country override warning raised for 2 cohorts"]},
            "upper_right": {"title": "Legal-hold workspace and evidence", "subtitle": "Hold management and proof-of-disposal stay visible beside eligibility math", "note_title": "Hold block insight", "note_body": "42 purge-eligible records remain blocked because a disciplinary case hold overlaps the payroll retention window in one legal entity.", "note_footer": "Next step: inspect hold scope, run simulation, and release or retain only after legal review completes.", "note_actions": [{"label": "Open hold", "w": 146, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Run simulation", "w": 148, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Execution monitor", "subtitle": "Scheduled jobs, failures, and blocked records remain visible before any disposal run", "bullets": ["3 failed retention jobs need retry", "2 archive jobs await storage verification", "Blocked-by-hold records separated from technical failures", "Purge schedule paused for one jurisdiction"]},
            "lower_right": {"title": "Evidence and exception ledger", "subtitle": "Proof of disposal and anomaly notes remain first-class outputs", "bullets": ["Proof-of-disposal bundle ready for 6 completed jobs", "Anonymization evidence stored for 3 batches", "1 policy exception awaits compliance sign-off", "Storage trend spike detected in archive tier"]},
            "footer": {"title": "Pinned retention-governance lenses", "subtitle": "Governance teams can pin hold, purge, archive, jurisdiction, and evidence-oriented views", "chips": [{"label": "Exited emp", "w": 108, "fill": "#DCFCE7"}, {"label": "Payroll docs", "w": 118, "fill": "#DBEAFE"}, {"label": "Hold", "w": 78, "fill": "#FEF3C7"}, {"label": "Purge", "w": 84, "fill": "#FEE2E2"}, {"label": "Evidence", "w": 102, "fill": "#EDE9FE"}, {"label": "EU", "w": 62, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Hold outranks purge", "detail": "Legal block conditions override housekeeping and are surfaced before throughput signals."}, {"label": "Simulation before execution", "detail": "Impact preview gets prime space so admins inspect consequences before archive or purge."}, {"label": "Policy and jobs together", "detail": "Rule design and scheduler behavior coexist because retention failures come from both."}, {"label": "Evidence is visible", "detail": "Destruction and anonymization proof is kept on-screen because audit readiness is a first-class output."}, {"label": "Jurisdiction warnings nearby", "detail": "Country overrides appear where record counts are reviewed so constraints are obvious early."}, {"label": "Blocked-by-hold is distinct", "detail": "Legal blockers are visually separated from ordinary technical failures and retries."}, {"label": "Mobile supervises safely", "detail": "Small screens support monitoring and hold actions while bulk execution stays desktop-governed."}],
            "slug": "w0-scr-022-retention-and-legal-hold-control-center",
            "mobile_title": "Retention and Legal Hold",
            "mobile_badge": "Gov",
            "mobile_chips": [{"label": "Holds 27", "w": 92, "fill": "#DBEAFE"}, {"label": "Purge", "w": 80, "fill": "#FEF3C7"}, {"label": "Block 42", "w": 96, "fill": "#FEE2E2"}],
            "mobile_search": "Search policy, hold, purge job, or evidence batch",
            "mobile_cards": [
                {"title": "Policy and eligibility summary", "subtitle": "Mobile starts with hold, purge, and archive status", "bullets": ["18.4k records eligible", "410 need archive first", "2 country warnings", "27 active holds"]},
                {"title": "Hold and simulation cue", "subtitle": "Hold-block reasoning stays visible on mobile", "bullets": ["42 records blocked by legal hold", "Inspect hold scope", "Run simulation first", "Release only after legal review"], "actions": [{"label": "Open hold", "w": 146, "fill": COLORS["blue"]}, {"label": "Run simulation", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Jobs and evidence stack", "subtitle": "Failed jobs, proof bundles, and exceptions compress into one stack", "bullets": ["3 failed jobs", "6 disposal bundles ready", "3 anonymization batches", "1 compliance exception"]},
            ],
            "mobile_note": {"label": "Retention-safe mobile", "detail": "Mobile keeps hold, simulation, and evidence cues visible before disposal actions are taken."},
        },
        {
            "title": "Access Review Campaign Workspace",
            "badge": "Review",
            "shell": "Control Plane",
            "nav": ["Campaigns", "Queue", "High Risk", "Remediation", "Evidence", "Help"],
            "chips": [{"label": "Items 3.2k", "w": 108, "fill": "#DBEAFE"}, {"label": "High risk 148", "w": 122, "fill": "#FEF3C7"}, {"label": "Overdue 19", "w": 110, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open high-risk queue", "w": 188, "fill": COLORS["blue"]}, {"label": "Bulk low-risk", "w": 154, "fill": COLORS["teal"]}],
            "search": "Search reviewer, system, role family, delegated access, risk class, or remediation task",
            "search_chips": [{"label": "Queue", "w": 78, "fill": COLORS["soft"]}, {"label": "Evidence", "w": 96, "fill": COLORS["soft"]}, {"label": "Decide", "w": 62, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Complete", "value": "61%", "color": COLORS["green"]}, {"title": "High risk", "value": "148", "color": COLORS["amber"]}, {"title": "Revokes", "value": "37", "color": COLORS["red"]}, {"title": "SLA", "value": "19", "color": COLORS["blue"]}, {"title": "Self cert", "value": "04", "color": COLORS["teal"]}],
            "upper_left": {"title": "Campaign scope and review queue", "subtitle": "Certification throughput starts from actionable review items, not campaign metadata", "bullets": ["3.2k access items in scope", "148 high-risk rows need explicit review", "19 reviewer SLAs are overdue", "Delegated access active across 3 systems"]},
            "upper_right": {"title": "Decision panel and evidence", "subtitle": "Certify, revoke, delegate, and comment stay adjacent to proof and owner context", "note_title": "Review insight", "note_body": "A privileged finance export role was last used 61 days ago and the current reviewer cannot self-certify because the grant was requested within the same cost center.", "note_footer": "Next step: inspect evidence, certify or revoke explicitly, and track downstream revocation to completion.", "note_actions": [{"label": "Open item", "w": 146, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Track revoke", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Bulk low-risk lane", "subtitle": "Policy-safe bulk certification is separated from high-risk decision work", "bullets": ["Low-risk group contains 412 items", "High-risk items explicitly excluded", "Reviewer comment optional on safe bulk certify", "One dormant-service-account cluster needs manual review"]},
            "lower_right": {"title": "Remediation tracker", "subtitle": "Access revocation is not complete until downstream connectors confirm closure", "bullets": ["37 revokes pending remediation", "2 connectors still unconfirmed", "Certification snapshot frozen for audit", "1 reviewer-item self-cert conflict flagged"]},
            "footer": {"title": "Pinned access-review lenses", "subtitle": "Reviewers can pin privileged, dormant, delegated, orphaned, and payroll-sensitive access views", "chips": [{"label": "Privileged", "w": 112, "fill": "#DCFCE7"}, {"label": "Dormant", "w": 102, "fill": "#DBEAFE"}, {"label": "Delegated", "w": 112, "fill": "#FEF3C7"}, {"label": "Orphaned", "w": 106, "fill": "#FEE2E2"}, {"label": "Payroll", "w": 96, "fill": "#EDE9FE"}, {"label": "Evidence", "w": 100, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Queue-first workbench", "detail": "This screen starts from decision work, not campaign metadata, because certification throughput matters most."}, {"label": "High risk resists bulk", "detail": "Bulk actions are visually separated to reinforce policy limits on convenience behavior."}, {"label": "Evidence beside actions", "detail": "Justification, owner context, and last-used proof stay visible while reviewers decide."}, {"label": "Remediation completes the loop", "detail": "Revoked access is tracked until downstream systems confirm closure."}, {"label": "Frozen scope is visible", "detail": "Reviewers can see they are certifying against a stable campaign snapshot."}, {"label": "Self-cert conflicts are explicit", "detail": "Prohibited reviewer-item combinations are surfaced as design rules, not buried in logs."}, {"label": "Mobile remains complete", "detail": "Mobile supports full certify or revoke flows because campaign progress can stall without it."}],
            "slug": "w0-scr-023-access-review-campaign-workspace",
            "mobile_title": "Access Review Campaign",
            "mobile_badge": "Review",
            "mobile_chips": [{"label": "Items 3.2k", "w": 98, "fill": "#DBEAFE"}, {"label": "Risk 148", "w": 98, "fill": "#FEF3C7"}, {"label": "SLA 19", "w": 88, "fill": "#FEE2E2"}],
            "mobile_search": "Search reviewer, role, risk, or remediation state",
            "mobile_cards": [
                {"title": "Queue and reviewer summary", "subtitle": "Mobile starts with high-risk queue and aging reviewers", "bullets": ["3.2k items in scope", "148 high-risk items", "19 overdue reviewers", "3 delegated systems"]},
                {"title": "Decision and evidence cue", "subtitle": "Evidence-led review stays actionable on mobile", "bullets": ["Privileged role idle for 61 days", "Reviewer cannot self-certify", "Inspect proof before action", "Track revoke to closure"], "actions": [{"label": "Open item", "w": 146, "fill": COLORS["blue"]}, {"label": "Track revoke", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Bulk and remediation stack", "subtitle": "Low-risk bulk paths and downstream closure cues compress into one stack", "bullets": ["412 low-risk items", "37 revokes pending", "2 connector confirmations pending", "1 self-cert conflict"]},
            ],
            "mobile_note": {"label": "Decision-complete mobile", "detail": "Mobile keeps reviewers able to certify or revoke with evidence instead of falling back to summary-only views."},
        },
        {
            "title": "Backup and Restore Operations Dashboard",
            "badge": "Ops",
            "shell": "Control Plane",
            "nav": ["Backups", "Restore", "Catalog", "Verification", "Storage", "Help"],
            "chips": [{"label": "Failed 3", "w": 92, "fill": "#DBEAFE"}, {"label": "Restore 2", "w": 96, "fill": "#FEF3C7"}, {"label": "RPO 1", "w": 82, "fill": "#FEE2E2"}],
            "actions": [{"label": "Verify integrity", "w": 168, "fill": COLORS["blue"]}, {"label": "Open restore planner", "w": 188, "fill": COLORS["teal"]}],
            "search": "Search backup job, restore point, environment, tenant scope, or verification incident",
            "search_chips": [{"label": "Catalog", "w": 90, "fill": COLORS["soft"]}, {"label": "Verify", "w": 84, "fill": COLORS["soft"]}, {"label": "Restore", "w": 72, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Last good", "value": "07:10", "color": COLORS["green"]}, {"title": "Success", "value": "99.2%", "color": COLORS["amber"]}, {"title": "Verify fail", "value": "03", "color": COLORS["red"]}, {"title": "RPO", "value": "01", "color": COLORS["blue"]}, {"title": "Immutable", "value": "92%", "color": COLORS["teal"]}],
            "upper_left": {"title": "Backup coverage and job monitor", "subtitle": "Recoverability matters more than raw completion counts", "bullets": ["Last good backup captured at 07:10 UTC", "3 jobs failed integrity verification", "Documents and DB both covered in current window", "Tenant segregation verified for 2 multi-tenant snapshots"]},
            "upper_right": {"title": "Restore-point catalog and planner", "subtitle": "Catalog search and approval-aware restore planning stay in one ops surface", "note_title": "Restore insight", "note_body": "The most recent payroll-close snapshot is recoverable, but the cross-region document artifact for that point still needs integrity confirmation before full restore approval.", "note_footer": "Next step: verify artifact chain, select recovery point, and proceed only after blast-radius approval clears.", "note_actions": [{"label": "Open catalog", "w": 146, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Plan restore", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Verification and anomaly panel", "subtitle": "Completion and trust are separated so operators can judge backup usability", "bullets": ["3 checksum failures open", "1 encryption warning under review", "Chain health degraded for one archive set", "AI anomaly cue suggests unusual size delta"]},
            "lower_right": {"title": "Restore workflow and approval", "subtitle": "Requester, approver, and blast radius remain visible before recovery actions execute", "bullets": ["2 restore requests currently open", "Approval required for payroll-close scope", "Test restore succeeded in sandbox yesterday", "Recovery checklist attached to selected point"]},
            "footer": {"title": "Pinned resilience lenses", "subtitle": "Ops teams can pin payroll-close, cross-region, immutable, failed-verify, and tenant-restore views", "chips": [{"label": "Payroll close", "w": 122, "fill": "#DCFCE7"}, {"label": "Cross-region", "w": 124, "fill": "#DBEAFE"}, {"label": "Immutable", "w": 108, "fill": "#FEF3C7"}, {"label": "Verify fail", "w": 112, "fill": "#FEE2E2"}, {"label": "Tenant", "w": 88, "fill": "#EDE9FE"}, {"label": "Restore", "w": 94, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Recovery beats counts", "detail": "Last good backup and RPO matter more than raw job completion volume."}, {"label": "Backup and restore together", "detail": "Operational confidence comes from linking captured backups to usable restore points."}, {"label": "Catalog is actionable", "detail": "Finding the correct recovery point is treated as a primary operator task."}, {"label": "Verification is separate", "detail": "A completed backup is not assumed to be trusted without integrity evidence."}, {"label": "Approval-aware restore", "detail": "Restore planning includes requester, approver, and blast radius because restore can be risky."}, {"label": "Scope boundaries stay visible", "detail": "Tenant and environment separation reduce wrong-scope recovery mistakes."}, {"label": "Mobile supervises incidents", "detail": "Small screens support triage and safe actions while complex restore design remains desktop-led."}],
            "slug": "w0-scr-024-backup-and-restore-operations-dashboard",
            "mobile_title": "Backup and Restore Ops",
            "mobile_badge": "Ops",
            "mobile_chips": [{"label": "Last good", "w": 92, "fill": "#DBEAFE"}, {"label": "Verify 3", "w": 90, "fill": "#FEF3C7"}, {"label": "RPO 1", "w": 80, "fill": "#FEE2E2"}],
            "mobile_search": "Search backup job, restore point, or verification issue",
            "mobile_cards": [
                {"title": "Coverage and verification summary", "subtitle": "Mobile starts with last good backup and trust signals", "bullets": ["Last good backup at 07:10", "3 verification failures", "DB and docs covered", "Tenant segregation confirmed"]},
                {"title": "Restore planning cue", "subtitle": "Catalog and approval reasoning stay visible on mobile", "bullets": ["Payroll-close point recoverable", "Cross-region doc artifact pending", "Verify chain before restore", "Approve blast radius first"], "actions": [{"label": "Open catalog", "w": 146, "fill": COLORS["blue"]}, {"label": "Plan restore", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Approval and anomaly stack", "subtitle": "Requests, approvals, and anomaly cues compress into one stack", "bullets": ["2 restore requests open", "Approval needed for payroll", "Sandbox restore passed", "AI anomaly size delta"]},
            ],
            "mobile_note": {"label": "Recovery-safe mobile", "detail": "Mobile preserves trust, approval, and restore-point cues before recovery operations are executed."},
        },
        {
            "title": "Disaster Recovery Readiness",
            "badge": "DR",
            "shell": "Control Plane",
            "nav": ["Readiness", "Dependencies", "Drills", "Owners", "Summary", "Help"],
            "chips": [{"label": "Posture 92%", "w": 114, "fill": "#DBEAFE"}, {"label": "RTO 3", "w": 84, "fill": "#FEF3C7"}, {"label": "Drill 14d", "w": 102, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open breached service", "w": 194, "fill": COLORS["blue"]}, {"label": "Launch DR rehearsal", "w": 184, "fill": COLORS["teal"]}],
            "search": "Search service tier, region, dependency, drill evidence, or remediation owner",
            "search_chips": [{"label": "Map", "w": 66, "fill": COLORS["soft"]}, {"label": "RTO/RPO", "w": 92, "fill": COLORS["soft"]}, {"label": "Drill", "w": 54, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Tier-1", "value": "22", "color": COLORS["green"]}, {"title": "RPO ok", "value": "91%", "color": COLORS["amber"]}, {"title": "Failed tests", "value": "03", "color": COLORS["red"]}, {"title": "Failover", "value": "18m", "color": COLORS["blue"]}, {"title": "Deps risk", "value": "07", "color": COLORS["teal"]}],
            "upper_left": {"title": "Readiness queue and issue log", "subtitle": "DR is judged by readiness gaps and owner action, not by backup counts alone", "bullets": ["3 services breached target RTO", "7 critical dependencies still at risk", "Issue log grouped by severity and owner", "One board-level summary request pending refresh"]},
            "upper_right": {"title": "Dependency map and drill evidence", "subtitle": "Service dependencies, drill results, and posture remain in one resilience surface", "note_title": "Readiness insight", "note_body": "The payroll notification stack can fail over within target, but one document-storage dependency still pushes full business recovery beyond the committed RTO.", "note_footer": "Next step: inspect dependency owners, review drill evidence, and raise remediation before the next executive checkpoint.", "note_actions": [{"label": "Open dependency", "w": 150, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "View summary", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "RTO and RPO posture matrix", "subtitle": "Recovery-time and recovery-point posture are evaluated together for each critical capability", "bullets": ["22 tier-1 services covered", "3 failed DR tests remain open", "Average simulated failover time is 18 minutes", "2 capability rows still need cross-region validation"]},
            "lower_right": {"title": "Owners, exercises, and board summary", "subtitle": "Leadership and ops share the same evidence base, but with different reading depth", "bullets": ["Next scheduled DR exercise in 6 days", "2 owners overdue on remediation", "Executive summary ready for board pack", "One failed drill elevated above standard trend view"]},
            "footer": {"title": "Pinned DR-readiness lenses", "subtitle": "Ops and leadership can pin region, tier, drill, dependency, and board-summary views", "chips": [{"label": "Tier-1", "w": 82, "fill": "#DCFCE7"}, {"label": "Cross-region", "w": 122, "fill": "#DBEAFE"}, {"label": "Drill fail", "w": 104, "fill": "#FEF3C7"}, {"label": "Dependency", "w": 112, "fill": "#FEE2E2"}, {"label": "Owner", "w": 84, "fill": "#EDE9FE"}, {"label": "Board", "w": 80, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Posture before counts", "detail": "The screen leads with readiness gaps because DR is judged by recoverability, not activity volume."}, {"label": "Dependencies in main plane", "detail": "Downstream service breakage is visible early so operators can understand true recovery impact."}, {"label": "RTO and RPO together", "detail": "Leadership and ops both need timing and data-loss posture in one shared view."}, {"label": "Drill evidence is first-class", "detail": "Untested recovery is not trusted recovery, so exercises stay visible above the fold."}, {"label": "Owner-oriented issue log", "detail": "Remediation assignment is part of the readiness surface, not a separate operational task."}, {"label": "Failed drill state escalates", "detail": "Failed-test variants outrank the default order to keep remediation urgent."}, {"label": "Executive mode simplifies", "detail": "Board-summary variants reduce density without changing the underlying shell."}],
            "slug": "w0-scr-025-disaster-recovery-readiness-console",
            "mobile_title": "DR Readiness",
            "mobile_badge": "DR",
            "mobile_chips": [{"label": "Posture 92", "w": 98, "fill": "#DBEAFE"}, {"label": "RTO 3", "w": 82, "fill": "#FEF3C7"}, {"label": "Deps 7", "w": 84, "fill": "#FEE2E2"}],
            "mobile_search": "Search service, dependency, drill, or remediation owner",
            "mobile_cards": [
                {"title": "Readiness and breach summary", "subtitle": "Mobile starts with posture, RTO breach, and owner action", "bullets": ["3 services breached target RTO", "7 dependencies at risk", "Issue log grouped by severity", "Board summary request pending"]},
                {"title": "Dependency and drill cue", "subtitle": "Dependency impact and drill evidence stay visible on mobile", "bullets": ["Doc storage extends recovery time", "Inspect dependency owner", "Review drill evidence", "Raise remediation before checkpoint"], "actions": [{"label": "Open dependency", "w": 150, "fill": COLORS["blue"]}, {"label": "View summary", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Posture and owner stack", "subtitle": "Matrix, owners, and exercise cadence compress into one stack", "bullets": ["22 tier-1 services covered", "3 failed tests open", "Exercise in 6 days", "2 owners overdue"]},
            ],
            "mobile_note": {"label": "Readiness-safe mobile", "detail": "Mobile keeps posture, dependency, and evidence cues visible before DR decisions are escalated."},
        },
        {
            "title": "Bulk Import Wizard",
            "badge": "IMPORT",
            "shell": "Control Plane",
            "nav": ["Import", "Template", "Validate", "Preview", "Commit", "Help"],
            "chips": [{"label": "Rows 24,860", "w": 118, "fill": "#DBEAFE"}, {"label": "Errors 182", "w": 106, "fill": "#FEF3C7"}, {"label": "Preview", "w": 88, "fill": "#FEE2E2"}],
            "actions": [{"label": "Validate import", "w": 170, "fill": COLORS["blue"]}, {"label": "Commit import", "w": 158, "fill": COLORS["teal"]}],
            "search": "Search row, source key, error cluster, duplicate group, or import batch",
            "search_chips": [{"label": "Template", "w": 94, "fill": COLORS["soft"]}, {"label": "Rows", "w": 70, "fill": COLORS["soft"]}, {"label": "Commit", "w": 66, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Uploaded", "value": "24860", "color": COLORS["green"]}, {"title": "Valid", "value": "24510", "color": COLORS["amber"]}, {"title": "Errors", "value": "182", "color": COLORS["red"]}, {"title": "Warnings", "value": "96", "color": COLORS["blue"]}, {"title": "Dupes", "value": "27", "color": COLORS["teal"]}],
            "upper_left": {"title": "Step rail and staging summary", "subtitle": "Resumable import flow needs clear progress and template rules", "bullets": ["Template headers validated before upload", "Rows staged successfully in preview area", "27 duplicate clusters detected", "Import draft can be resumed across sessions"]},
            "upper_right": {"title": "Row-level validation and correction", "subtitle": "Error clusters and preview state become the primary surface once staging completes", "note_title": "Import preview insight", "note_body": "Most blocking rows fail because employee_code duplicates an active tenant record while date_of_birth also violates plausibility rules in the same cluster.", "note_footer": "Next step: open row cluster, correct source values, and commit only after duplicate-resolution policy is satisfied.", "note_actions": [{"label": "Open rows", "w": 142, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open policy", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Error clusters and duplicate policy", "subtitle": "Correction patterns and duplicate handling stay visible before commit", "bullets": ["182 blocking rows grouped into 11 clusters", "Tenant-scoped uniqueness rules active", "Masked columns remain protected in preview", "Top cluster affects employee master import"]},
            "lower_right": {"title": "Commit summary and blast radius", "subtitle": "Validation success is distinct from business approval to write data", "bullets": ["24,510 rows are commit-ready", "Commit touches employee, bank, and PF entities", "Warnings remain allowed under current policy", "One final approval needed before write"]},
            "footer": {"title": "Pinned import-governance lenses", "subtitle": "Implementation teams can pin row, cluster, entity, duplicate, and commit-focused import views", "chips": [{"label": "Employee", "w": 108, "fill": "#DCFCE7"}, {"label": "Duplicate", "w": 110, "fill": "#DBEAFE"}, {"label": "Errors", "w": 92, "fill": "#FEF3C7"}, {"label": "Preview", "w": 98, "fill": "#FEE2E2"}, {"label": "Commit", "w": 94, "fill": "#EDE9FE"}, {"label": "Policy", "w": 90, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Progress is explicit", "detail": "Imports span sessions, so the step model stays visible throughout the wizard."}, {"label": "Template rules come early", "detail": "Most avoidable failures happen before validation, so header and format guidance stays near the top."}, {"label": "Preview promotes rows", "detail": "Once staging succeeds, row-level review becomes the primary operational plane."}, {"label": "Errors reshape layout", "detail": "Error-heavy states expand clustering and correction instead of hiding failures in tabs."}, {"label": "Commit is governed", "detail": "Commit authority is distinct from validation success because writing data is a business decision."}, {"label": "Masking persists in preview", "detail": "Broad implementation access still respects sensitive-column masking during import review."}, {"label": "Blast radius is clear", "detail": "The summary always shows which objects and counts will be written before commit."}],
            "slug": "w0-scr-026-bulk-import-wizard-and-validation-workbench",
            "mobile_title": "Bulk Import Wizard",
            "mobile_badge": "Import",
            "mobile_chips": [{"label": "Rows", "w": 72, "fill": "#DBEAFE"}, {"label": "Errors 182", "w": 108, "fill": "#FEF3C7"}, {"label": "Dupes 27", "w": 96, "fill": "#FEE2E2"}],
            "mobile_search": "Search row, source key, cluster, or batch",
            "mobile_cards": [
                {"title": "Staging and progress summary", "subtitle": "Mobile starts with resumable import status and cluster counts", "bullets": ["Rows staged for preview", "27 duplicate clusters", "Draft resumable across sessions", "Template headers already validated"]},
                {"title": "Error cluster cue", "subtitle": "Duplicate and plausibility failures stay explainable on mobile", "bullets": ["Employee code duplicates active record", "DOB plausibility also fails", "Correct source cluster first", "Commit after policy clears"], "actions": [{"label": "Open rows", "w": 142, "fill": COLORS["blue"]}, {"label": "Open policy", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Commit and entity stack", "subtitle": "Commit-ready count, warnings, and entity blast radius compress into one stack", "bullets": ["24,510 rows commit-ready", "Employee, bank, and PF touched", "Warnings allowed by policy", "One final approval needed"]},
            ],
            "mobile_note": {"label": "Commit-safe mobile", "detail": "Mobile keeps cluster review and blast-radius cues visible before enterprise data loads are committed."},
        },
        {
            "title": "Migration Mapping and Reconciliation",
            "badge": "MIGRATE",
            "shell": "Control Plane",
            "nav": ["Mapping", "Objects", "Trial Load", "Mismatch", "Signoff", "Help"],
            "chips": [{"label": "Wave 2", "w": 84, "fill": "#DBEAFE"}, {"label": "Mismatch 46", "w": 112, "fill": "#FEF3C7"}, {"label": "Trial load", "w": 104, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open mismatch cluster", "w": 194, "fill": COLORS["blue"]}, {"label": "Run trial load", "w": 160, "fill": COLORS["teal"]}],
            "search": "Search object, source field, target field, mismatch type, defect, or signoff state",
            "search_chips": [{"label": "Objects", "w": 88, "fill": COLORS["soft"]}, {"label": "Trial", "w": 70, "fill": COLORS["soft"]}, {"label": "Map", "w": 52, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Objects", "value": "18", "color": COLORS["green"]}, {"title": "Mapped", "value": "92%", "color": COLORS["amber"]}, {"title": "Mismatches", "value": "46", "color": COLORS["red"]}, {"title": "Trial pass", "value": "88%", "color": COLORS["blue"]}, {"title": "Signoff", "value": "03", "color": COLORS["teal"]}],
            "upper_left": {"title": "Object readiness and mapping inventory", "subtitle": "Migration teams think in waves and objects before they think in rows", "bullets": ["18 objects in current migration wave", "Mapping coverage reached 92%", "4 objects still blocked on historical cut-off decisions", "One object changed after prior trial-load pass"]},
            "upper_right": {"title": "Trial load and reconciliation workbench", "subtitle": "Mapping logic and reconciliation stay in one surface so mismatches remain traceable", "note_title": "Mismatch insight", "note_body": "Cost center values reconcile at the count level, but target-side trimmed codes cause 14 value mismatches because the source mapping rule preserves leading zeros.", "note_footer": "Next step: inspect source lineage, adjust mapping rule, and rerun trial load before business signoff.", "note_actions": [{"label": "Open cluster", "w": 146, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Edit mapping", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Scope decisions and defect queue", "subtitle": "Historical cut-off, object scope, and defect ownership remain visible before signoff", "bullets": ["3 cut-off decisions still pending", "46 mismatches grouped into 9 clusters", "Defect links opened for 2 transformation rules", "Restricted sample data remains masked"]},
            "lower_right": {"title": "Signoff and rerun lineage", "subtitle": "Technically clean migration still requires business acceptance and trial-history visibility", "bullets": ["1 business signoff blocked by open mismatch", "Previous trial snapshot retained for compare", "Rerun lineage visible by object", "One technically clean object still awaits acceptance"]},
            "footer": {"title": "Pinned migration lenses", "subtitle": "Migration teams can pin wave, object, mismatch, cut-off, and signoff-focused reconciliation views", "chips": [{"label": "Wave 2", "w": 84, "fill": "#DCFCE7"}, {"label": "Cost center", "w": 114, "fill": "#DBEAFE"}, {"label": "Mismatch", "w": 106, "fill": "#FEF3C7"}, {"label": "Cut-off", "w": 98, "fill": "#FEE2E2"}, {"label": "Trial", "w": 84, "fill": "#EDE9FE"}, {"label": "Signoff", "w": 96, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Objects before rows", "detail": "Migration readiness starts with object waves and scope, not isolated row detail."}, {"label": "Mapping with reconciliation", "detail": "Users can trace a mismatch back to its rule without context switching."}, {"label": "Trial load is proof", "detail": "Mapping completeness matters less than validated rehearsal results."}, {"label": "Mismatch state expands", "detail": "Mismatch-heavy variants prioritize reconciliation and suppress lower-value detail."}, {"label": "Rerun lineage matters", "detail": "Users need change-over-change visibility when trial loads are rerun."}, {"label": "Signoff can still block", "detail": "Technical cleanliness does not replace business acceptance and is shown as a separate gate."}, {"label": "Masked samples persist", "detail": "Migration debugging still respects privacy boundaries in non-production views."}],
            "slug": "w0-scr-027-migration-mapping-and-reconciliation-workspace",
            "mobile_title": "Migration Mapping",
            "mobile_badge": "Wave 2",
            "mobile_chips": [{"label": "Obj 18", "w": 78, "fill": "#DBEAFE"}, {"label": "Mismatch 46", "w": 110, "fill": "#FEF3C7"}, {"label": "Trial 88", "w": 90, "fill": "#FEE2E2"}],
            "mobile_search": "Search object, mismatch, rule, or signoff state",
            "mobile_cards": [
                {"title": "Object and wave summary", "subtitle": "Mobile starts with object readiness and open cut-off decisions", "bullets": ["18 objects in wave", "92% mapping coverage", "3 cut-off decisions pending", "1 object changed after prior pass"]},
                {"title": "Mismatch and rule cue", "subtitle": "Rule-to-mismatch tracing stays reviewable on mobile", "bullets": ["Leading zeros causing 14 mismatches", "Inspect source lineage", "Edit mapping rule", "Rerun before signoff"], "actions": [{"label": "Open cluster", "w": 146, "fill": COLORS["blue"]}, {"label": "Edit mapping", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Signoff and lineage stack", "subtitle": "Defects, reruns, and acceptance cues compress into one stack", "bullets": ["46 mismatches in 9 clusters", "2 defects linked", "Previous snapshot retained", "1 signoff still blocked"]},
            ],
            "mobile_note": {"label": "Migration-safe mobile", "detail": "Mobile keeps mismatch, cut-off, and signoff cues visible before mapping decisions are finalized."},
        },
        {
            "title": "Validation Command Center",
            "badge": "READY",
            "shell": "Control Plane",
            "nav": ["Validation", "Blockers", "Evidence", "Signoff", "Revalidate", "Help"],
            "chips": [{"label": "Ready 81%", "w": 98, "fill": "#DBEAFE"}, {"label": "Blockers 12", "w": 108, "fill": "#FEF3C7"}, {"label": "Signoff 5/8", "w": 106, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open blocker board", "w": 182, "fill": COLORS["blue"]}, {"label": "Request signoff", "w": 162, "fill": COLORS["teal"]}],
            "search": "Search workstream, blocker, evidence item, waiver, signoff route, or revalidation run",
            "search_chips": [{"label": "Checklist", "w": 98, "fill": COLORS["soft"]}, {"label": "Evidence", "w": 96, "fill": COLORS["soft"]}, {"label": "Ready", "w": 58, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Steps", "value": "126", "color": COLORS["green"]}, {"title": "Passed", "value": "102", "color": COLORS["amber"]}, {"title": "Failed", "value": "07", "color": COLORS["red"]}, {"title": "Blocked", "value": "12", "color": COLORS["blue"]}, {"title": "Signed", "value": "05/08", "color": COLORS["teal"]}],
            "upper_left": {"title": "Checklist board and blocker queue", "subtitle": "Go-live readiness is a governance surface, not a simple status dashboard", "bullets": ["Validation grouped by data, payroll, security, process, and reports", "12 blockers still open across 4 workstreams", "2 passed items still lack evidence", "5 of 8 signoff routes are complete"]},
            "upper_right": {"title": "Evidence and revalidation workspace", "subtitle": "Evidence completeness and rerun context remain visible before signoff decisions", "note_title": "Readiness insight", "note_body": "Payroll validation appears green at the scenario level, but two passed checks still lack signed evidence after a late import correction invalidated the previous attachment set.", "note_footer": "Next step: attach fresh evidence, revalidate the affected workstream, and request signoff only after blocker debt is cleared.", "note_actions": [{"label": "Open evidence", "w": 150, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Revalidate", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Waiver and exit-criteria tracker", "subtitle": "Passed counts do not replace auditable exit criteria and approved exceptions", "bullets": ["2 waiver decisions remain pending", "Go-live exit criteria not met for security workstream", "One blocker escalated to business owner", "Late config change invalidated prior evidence"]},
            "lower_right": {"title": "Signoff routing and closure summary", "subtitle": "Signoff debt and closure chronology remain explicit for implementation leadership", "bullets": ["3 signoff routes still open", "Business owner awaiting refreshed proof", "Closure summary auto-generates when complete", "Revalidation backlog contains 4 items"]},
            "footer": {"title": "Pinned readiness lenses", "subtitle": "QA and implementation teams can pin workstream, blocker, evidence, waiver, and signoff views", "chips": [{"label": "Payroll", "w": 92, "fill": "#DCFCE7"}, {"label": "Security", "w": 96, "fill": "#DBEAFE"}, {"label": "Blockers", "w": 102, "fill": "#FEF3C7"}, {"label": "Evidence", "w": 100, "fill": "#FEE2E2"}, {"label": "Waiver", "w": 90, "fill": "#EDE9FE"}, {"label": "Signoff", "w": 94, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Blockers lead decisions", "detail": "Go-live is governed by open blockers and signoff debt, so those cues surface immediately."}, {"label": "Workstreams beat modules", "detail": "Validation execution is cross-functional, so checklist grouping follows workstreams."}, {"label": "Evidence is separate", "detail": "A passed step without proof is not treated as auditable readiness."}, {"label": "Blocker state reorders", "detail": "Open-blocker variants elevate the blocker board above general readiness visuals."}, {"label": "Missing proof degrades signoff", "detail": "Evidence gaps visibly lower readiness even when pass counts look healthy."}, {"label": "Closure mode is different", "detail": "Completed signoff variants shift from action-heavy layouts to chronology and summary."}, {"label": "Revalidation stays explicit", "detail": "Late changes can invalidate prior passes, so rerun intent remains visible."}],
            "slug": "w0-scr-028-validation-command-center",
            "mobile_title": "Validation Command Center",
            "mobile_badge": "Ready",
            "mobile_chips": [{"label": "Ready 81", "w": 92, "fill": "#DBEAFE"}, {"label": "Blocks 12", "w": 96, "fill": "#FEF3C7"}, {"label": "Sign 5/8", "w": 96, "fill": "#FEE2E2"}],
            "mobile_search": "Search workstream, blocker, evidence, or signoff",
            "mobile_cards": [
                {"title": "Checklist and blocker summary", "subtitle": "Mobile starts with workstreams, blockers, and signoff debt", "bullets": ["12 blockers across 4 workstreams", "2 passed items lack evidence", "5 of 8 signoffs complete", "Validation grouped cross-functionally"]},
                {"title": "Evidence and revalidation cue", "subtitle": "Proof gaps and rerun triggers stay visible on mobile", "bullets": ["2 passed checks missing proof", "Late import invalidated evidence", "Attach fresh evidence", "Revalidate before signoff"], "actions": [{"label": "Open evidence", "w": 150, "fill": COLORS["blue"]}, {"label": "Revalidate", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Waiver and signoff stack", "subtitle": "Waivers, exit criteria, and route debt compress into one stack", "bullets": ["2 waiver decisions pending", "3 signoff routes open", "1 blocker escalated", "4 items in revalidation backlog"]},
            ],
            "mobile_note": {"label": "Go-live-safe mobile", "detail": "Mobile preserves blocker, evidence, and signoff cues before implementation teams progress go-live."},
        },
        {
            "title": "Cutover Command Center",
            "badge": "CUTOVER",
            "shell": "Control Plane",
            "nav": ["Cutover", "Timeline", "Dependencies", "Checkpoints", "Rollback", "Help"],
            "chips": [{"label": "Freeze active", "w": 114, "fill": "#DBEAFE"}, {"label": "Hold 2", "w": 84, "fill": "#FEF3C7"}, {"label": "Rollback ready", "w": 122, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open checkpoint", "w": 170, "fill": COLORS["blue"]}, {"label": "Generate status brief", "w": 188, "fill": COLORS["teal"]}],
            "search": "Search task, owner, dependency, checkpoint, freeze step, or rollback trigger",
            "search_chips": [{"label": "Timeline", "w": 94, "fill": COLORS["soft"]}, {"label": "Graph", "w": 76, "fill": COLORS["soft"]}, {"label": "Live", "w": 46, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Tasks", "value": "84", "color": COLORS["green"]}, {"title": "Complete", "value": "61", "color": COLORS["amber"]}, {"title": "Blocked", "value": "06", "color": COLORS["red"]}, {"title": "Checkpoints", "value": "05/07", "color": COLORS["blue"]}, {"title": "Deps", "value": "12", "color": COLORS["teal"]}],
            "upper_left": {"title": "Timeline and active sequencing", "subtitle": "Cutover teams need one synchronized source of truth under time pressure", "bullets": ["Freeze is active across implementation environments", "84 cutover tasks tracked in current runbook", "6 tasks blocked on upstream confirmation", "Checkpoint hold active on one payroll validation gate"]},
            "upper_right": {"title": "Dependency graph and checkpoint control", "subtitle": "Owners, dependencies, and checkpoint decisions stay linked to current execution state", "note_title": "Cutover insight", "note_body": "The final employee delta load is ready, but the payroll checkpoint cannot advance until the downstream payslip job and signoff evidence both return green.", "note_footer": "Next step: inspect dependency owners, clear the checkpoint hold, and keep rollback trigger visibility available throughout the freeze.", "note_actions": [{"label": "Open graph", "w": 142, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open checkpoint", "w": 150, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Owner status and communications", "subtitle": "Program leads need synchronized execution and clear accountability by workstream", "bullets": ["Ops, migration, QA, and business owners all visible", "2 communications drafts pending checkpoint release", "One environment still in pre-freeze state", "Critical-path lane highlighted for exec review"]},
            "lower_right": {"title": "Rollback readiness and chronology", "subtitle": "Rollback triggers stay visible without overpowering the mission-control flow", "bullets": ["Rollback path verified against current freeze stage", "2 checkpoint holds still open", "Event chronology retained for audit replay", "Status brief can be exported for leadership"]},
            "footer": {"title": "Pinned cutover lenses", "subtitle": "Program teams can pin critical path, freeze, owner, checkpoint, and rollback-oriented cutover views", "chips": [{"label": "Critical path", "w": 118, "fill": "#DCFCE7"}, {"label": "Freeze", "w": 88, "fill": "#DBEAFE"}, {"label": "Checkpoint", "w": 112, "fill": "#FEF3C7"}, {"label": "Blocked", "w": 92, "fill": "#FEE2E2"}, {"label": "Rollback", "w": 106, "fill": "#EDE9FE"}, {"label": "Exec", "w": 74, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Time pressure changes hierarchy", "detail": "The design favors sequencing, blockers, and checkpoint control over broad analytics."}, {"label": "Dependencies stay visible", "detail": "Cutover risk often hides in task relationships, so the graph remains in the main plane."}, {"label": "Checkpoint is operational", "detail": "Checkpoint decisions are shown as active gates, not passive milestone labels."}, {"label": "Owner clarity matters", "detail": "Program managers need immediate accountability without opening separate reports."}, {"label": "Rollback is nearby", "detail": "Rollback readiness stays visible so recovery is always considered during live cutover."}, {"label": "Freeze is explicit", "detail": "Freeze state is shown prominently because many actions depend on it."}, {"label": "Mobile summarizes safely", "detail": "Small screens support supervision and escalation while dense dependency work remains desktop-led."}],
            "slug": "w0-scr-029-cutover-command-center",
            "mobile_title": "Cutover Command Center",
            "mobile_badge": "Live",
            "mobile_chips": [{"label": "Freeze", "w": 74, "fill": "#DBEAFE"}, {"label": "Hold 2", "w": 82, "fill": "#FEF3C7"}, {"label": "Block 6", "w": 84, "fill": "#FEE2E2"}],
            "mobile_search": "Search task, owner, checkpoint, or dependency",
            "mobile_cards": [
                {"title": "Timeline and checkpoint summary", "subtitle": "Mobile starts with freeze, blocked tasks, and checkpoint state", "bullets": ["84 cutover tasks tracked", "6 blocked tasks", "5 of 7 checkpoints passed", "Freeze active across environments"]},
                {"title": "Dependency and checkpoint cue", "subtitle": "Dependency reasoning stays visible on mobile", "bullets": ["Payroll checkpoint still held", "Delta load ready", "Clear downstream green state", "Keep rollback visible"], "actions": [{"label": "Open graph", "w": 142, "fill": COLORS["blue"]}, {"label": "Open checkpoint", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Owner and rollback stack", "subtitle": "Owner status, comms, and rollback cues compress into one stack", "bullets": ["2 comms drafts pending", "1 env pre-freeze", "Rollback path verified", "Status brief export ready"]},
            ],
            "mobile_note": {"label": "Mission-safe mobile", "detail": "Mobile preserves checkpoint and rollback cues before cutover decisions are escalated or advanced."},
        },
        {
            "title": "Rollback Runbook and Trigger Workspace",
            "badge": "ROLLBACK",
            "shell": "Control Plane",
            "nav": ["Rollback", "Triggers", "Steps", "Restore", "Reconcile", "Help"],
            "chips": [{"label": "Triggers armed", "w": 118, "fill": "#DBEAFE"}, {"label": "Irreversible 2", "w": 122, "fill": "#FEF3C7"}, {"label": "Approve 1", "w": 92, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open trigger matrix", "w": 182, "fill": COLORS["blue"]}, {"label": "Review restore path", "w": 182, "fill": COLORS["teal"]}],
            "search": "Search trigger, runbook step, restore point, irreversible action, or reconciliation task",
            "search_chips": [{"label": "Triggers", "w": 92, "fill": COLORS["soft"]}, {"label": "Steps", "w": 76, "fill": COLORS["soft"]}, {"label": "Restore", "w": 72, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Triggers", "value": "09", "color": COLORS["green"]}, {"title": "Steps", "value": "31", "color": COLORS["amber"]}, {"title": "Irrev", "value": "02", "color": COLORS["red"]}, {"title": "Points", "value": "06", "color": COLORS["blue"]}, {"title": "Recon", "value": "04", "color": COLORS["teal"]}],
            "upper_left": {"title": "Trigger matrix and decision thresholds", "subtitle": "Rollback decisions must be explicit, auditable, and grounded in clear triggers", "bullets": ["9 rollback triggers currently armed", "2 irreversible steps already reached", "One executive approval still pending", "Trigger thresholds differ by workstream"]},
            "upper_right": {"title": "Step tracker and restore path", "subtitle": "Runbook sequencing and restore readiness remain visible before any rollback executes", "note_title": "Rollback insight", "note_body": "The employee import can be reversed, but one payroll-close step crossed an irreversible boundary, so rollback now requires a restore-and-reconcile path rather than a simple command reversal.", "note_footer": "Next step: inspect restore points, confirm executive approval, and track reconciliation obligations before triggering rollback.", "note_actions": [{"label": "Open trigger", "w": 142, "fill": COLORS["blue"]}, {"label": "Ask why", "w": 124, "fill": "#EEF2FF"}, {"label": "Open restore", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Irreversible-step warnings", "subtitle": "Point-of-no-return cues outrank convenience summaries once rollback becomes real", "bullets": ["2 steps crossed irreversible boundary", "Current stage linked to restore point RP-06", "Approval required before trigger execution", "Operator acknowledgment still pending"]},
            "lower_right": {"title": "Reconciliation and final status", "subtitle": "Rollback is only complete after reconciliation and final-status evidence are captured", "bullets": ["4 reconciliation tasks remain if triggered", "Final status panel tracks completion chronology", "Restore validation required after execution", "Audit note prepared for executive review"]},
            "footer": {"title": "Pinned rollback lenses", "subtitle": "Ops and program leads can pin trigger, restore, irreversible-step, and reconciliation-oriented rollback views", "chips": [{"label": "Trigger", "w": 90, "fill": "#DCFCE7"}, {"label": "Restore", "w": 92, "fill": "#DBEAFE"}, {"label": "Irreversible", "w": 120, "fill": "#FEF3C7"}, {"label": "Approval", "w": 98, "fill": "#FEE2E2"}, {"label": "Recon", "w": 84, "fill": "#EDE9FE"}, {"label": "Final", "w": 72, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Triggers govern rollback", "detail": "Rollback begins with explicit decision thresholds, not with technical buttons."}, {"label": "Restore path stays nearby", "detail": "Once irreversible steps exist, restore planning becomes part of rollback, not a separate concern."}, {"label": "Irreversible warnings escalate", "detail": "Point-of-no-return cues outrank lower-value summary content when risk increases."}, {"label": "Approval is visible", "detail": "Executive authorization remains explicit because rollback can itself be a major business event."}, {"label": "Reconciliation completes rollback", "detail": "Execution is not treated as done until downstream data and process reconciliation finishes."}, {"label": "Chronology matters", "detail": "Final-status and step history remain visible for later audit and recovery review."}, {"label": "Mobile stays reduced", "detail": "Small screens support trigger review and escalation while dense runbook control stays desktop-oriented."}],
            "slug": "w0-scr-030-rollback-runbook-and-trigger-workspace",
            "mobile_title": "Rollback Workspace",
            "mobile_badge": "RB",
            "mobile_chips": [{"label": "Triggers 9", "w": 92, "fill": "#DBEAFE"}, {"label": "Irrev 2", "w": 88, "fill": "#FEF3C7"}, {"label": "Recon 4", "w": 90, "fill": "#FEE2E2"}],
            "mobile_search": "Search trigger, step, restore point, or recon task",
            "mobile_cards": [
                {"title": "Trigger and approval summary", "subtitle": "Mobile starts with rollback triggers and irreversible risk", "bullets": ["9 triggers armed", "2 irreversible steps crossed", "1 approval pending", "Thresholds differ by workstream"]},
                {"title": "Restore-path cue", "subtitle": "Restore and recon reasoning stay visible on mobile", "bullets": ["Payroll-close crossed irreversible boundary", "Use restore-and-reconcile path", "Inspect restore point RP-06", "Confirm executive approval"], "actions": [{"label": "Open trigger", "w": 142, "fill": COLORS["blue"]}, {"label": "Open restore", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Irreversible and recon stack", "subtitle": "Warnings, acknowledgments, and final-status cues compress into one stack", "bullets": ["2 irreversible warnings", "Operator ack pending", "4 recon tasks remain", "Audit note prepared"]},
            ],
            "mobile_note": {"label": "Rollback-safe mobile", "detail": "Mobile preserves trigger and irreversible-step cues before rollback decisions are escalated or approved."},
        },
        {
            "title": "Notifications Center",
            "badge": "Inbox",
            "shell": "Shared Workspace",
            "nav": ["Notifications", "Tasks", "Approvals", "Cases", "Announcements", "Help"],
            "chips": [{"label": "Unread 18", "w": 96, "fill": "#DBEAFE"}, {"label": "Actionable 7", "w": 108, "fill": "#FEF3C7"}, {"label": "Archived 42", "w": 106, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open actionable", "w": 170, "fill": COLORS["blue"]}, {"label": "Mark all read", "w": 154, "fill": COLORS["teal"]}],
            "search": "Search notification, sender, module, case, approval, or announcement",
            "search_chips": [{"label": "Unread", "w": 84, "fill": COLORS["soft"]}, {"label": "Actionable", "w": 102, "fill": COLORS["soft"]}, {"label": "Inbox", "w": 58, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Unread", "value": "18", "color": COLORS["green"]}, {"title": "Actionable", "value": "07", "color": COLORS["amber"]}, {"title": "Mentions", "value": "04", "color": COLORS["red"]}, {"title": "Approvals", "value": "03", "color": COLORS["blue"]}, {"title": "Cases", "value": "02", "color": COLORS["teal"]}],
            "upper_left": {"title": "Notification inbox and filters", "subtitle": "Actionable notifications outrank passive announcements in the default reading order", "bullets": ["7 items require action today", "3 approval notifications still pending", "Unread-only filter active on current view", "Cross-module notifications grouped by source"]},
            "upper_right": {"title": "Selected notification detail", "subtitle": "Context, origin, and next action remain visible without leaving the center", "note_title": "Actionable item", "note_body": "A leave approval reminder references a team-coverage warning and links directly to the approval queue while preserving the original timestamp and sender context.", "note_footer": "Next step: open the linked action, complete or snooze it, and archive only after the dependent task is resolved.", "note_actions": [{"label": "Open action", "w": 142, "fill": COLORS["blue"]}, {"label": "Snooze", "w": 112, "fill": "#EEF2FF"}, {"label": "Archive", "w": 112, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Preferences and channel summary", "subtitle": "Users can understand which events reached them and through which channels", "bullets": ["Email + in-app enabled for approvals", "Push disabled for low-priority announcements", "WhatsApp active for payroll-release notices", "Digest schedule runs at 18:00 local time"]},
            "lower_right": {"title": "Archive and chronology", "subtitle": "Archive state and read history remain visible for later follow-up", "bullets": ["42 items moved to archive this month", "Mentions remain pinned for 7 days", "One notification auto-closed after task completion", "Chronology retains sender, channel, and read state"]},
            "footer": {"title": "Pinned notification lenses", "subtitle": "Users can pin unread, actionable, approval, case, announcement, and archive-oriented views", "chips": [{"label": "Unread", "w": 84, "fill": "#DCFCE7"}, {"label": "Actionable", "w": 102, "fill": "#DBEAFE"}, {"label": "Approvals", "w": 104, "fill": "#FEF3C7"}, {"label": "Cases", "w": 80, "fill": "#FEE2E2"}, {"label": "Mentions", "w": 96, "fill": "#EDE9FE"}, {"label": "Archive", "w": 92, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Action before awareness", "detail": "The inbox defaults to items needing action so users can clear important work first."}, {"label": "Context stays with the alert", "detail": "Linked actions preserve sender and source context instead of forcing blind navigation."}, {"label": "Channel transparency", "detail": "Preference and channel summaries help users understand how the system reached them."}, {"label": "Archive is operational", "detail": "Archived items still preserve chronology because they often matter for audit or follow-up."}, {"label": "Unread-only is a mode", "detail": "Unread and actionable states are treated as operational variants, not just filters."}, {"label": "Global but role-safe", "detail": "The center is shared across modules but still assumes access-safe source links."}, {"label": "Mobile remains full", "detail": "Notifications must be actionable from small screens, so mobile keeps the full core flow."}],
            "slug": "glb-scr-001-notifications-center",
            "mobile_title": "Notifications Center",
            "mobile_badge": "Inbox",
            "mobile_chips": [{"label": "Unread 18", "w": 92, "fill": "#DBEAFE"}, {"label": "Action 7", "w": 88, "fill": "#FEF3C7"}, {"label": "Cases 2", "w": 82, "fill": "#FEE2E2"}],
            "mobile_search": "Search notification, module, or linked action",
            "mobile_cards": [
                {"title": "Inbox and action summary", "subtitle": "Mobile starts with unread and actionable items", "bullets": ["7 items require action", "3 approvals pending", "Unread-only filter active", "Grouped by source module"]},
                {"title": "Selected notification cue", "subtitle": "Context and next action remain visible on mobile", "bullets": ["Leave approval reminder with coverage note", "Open linked queue directly", "Snooze if needed", "Archive only after completion"], "actions": [{"label": "Open action", "w": 142, "fill": COLORS["blue"]}, {"label": "Archive", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Preference and archive stack", "subtitle": "Channels, digests, and chronology compress into one stack", "bullets": ["Email + in-app enabled", "Push off for low priority", "42 items archived this month", "Read chronology preserved"]},
            ],
            "mobile_note": {"label": "Action-ready mobile", "detail": "Mobile keeps inbox context and linked actions available so users can clear work immediately."},
        },
        {
            "title": "Help and Support Center",
            "badge": "Support",
            "shell": "Shared Workspace",
            "nav": ["Help", "Search", "Cases", "Live Support", "Knowledge", "Status"],
            "chips": [{"label": "Cases 3", "w": 82, "fill": "#DBEAFE"}, {"label": "Live on", "w": 86, "fill": "#FEF3C7"}, {"label": "KB top", "w": 84, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open live support", "w": 176, "fill": COLORS["blue"]}, {"label": "Create case", "w": 144, "fill": COLORS["teal"]}],
            "search": "Search article, process, payroll question, leave help, case, or live-support topic",
            "search_chips": [{"label": "Knowledge", "w": 102, "fill": COLORS["soft"]}, {"label": "Cases", "w": 78, "fill": COLORS["soft"]}, {"label": "Help", "w": 50, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Articles", "value": "1240", "color": COLORS["green"]}, {"title": "Open cases", "value": "03", "color": COLORS["amber"]}, {"title": "Avg reply", "value": "2.1h", "color": COLORS["red"]}, {"title": "Live agents", "value": "07", "color": COLORS["blue"]}, {"title": "CSAT", "value": "4.6", "color": COLORS["teal"]}],
            "upper_left": {"title": "Knowledge search and top topics", "subtitle": "Self-service help and case creation coexist in one support hub", "bullets": ["Payroll, leave, and onboarding are top search topics", "Search-no-result state can route to case creation", "Status cards show service availability", "Contextual article suggestions update by persona"]},
            "upper_right": {"title": "Case and live-support workspace", "subtitle": "Live support and case status remain available without losing knowledge context", "note_title": "Support insight", "note_body": "The user asked about payslip anomalies; relevant knowledge exists, but live support is recommended because the issue also matches an open payroll case with updated agent notes.", "note_footer": "Next step: open the case thread, review linked article, or escalate to live support based on issue sensitivity.", "note_actions": [{"label": "Open case", "w": 136, "fill": COLORS["blue"]}, {"label": "Ask bot", "w": 112, "fill": "#EEF2FF"}, {"label": "Live support", "w": 136, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Case history and status", "subtitle": "Users can see what is already open before creating duplicate requests", "bullets": ["3 open support cases across HR and payroll", "One case awaiting user attachment", "Latest support note added 40 minutes ago", "Escalation path visible on delayed cases"]},
            "lower_right": {"title": "AI and support routing", "subtitle": "AI help stays assistive while human escalation remains clear for complex issues", "bullets": ["AI can summarize articles and steps", "Sensitive payroll issues route to humans", "Live support online now in IST hours", "Case-created confirmation returns to this hub"]},
            "footer": {"title": "Pinned support lenses", "subtitle": "Employees and managers can pin topic, case, live-support, article, and escalation-focused help views", "chips": [{"label": "Payroll", "w": 90, "fill": "#DCFCE7"}, {"label": "Leave", "w": 78, "fill": "#DBEAFE"}, {"label": "Live", "w": 66, "fill": "#FEF3C7"}, {"label": "Cases", "w": 80, "fill": "#FEE2E2"}, {"label": "AI", "w": 54, "fill": "#EDE9FE"}, {"label": "Escalate", "w": 96, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Self-service and human support together", "detail": "The hub starts with knowledge but never hides the case or live-support paths."}, {"label": "Search failure still helps", "detail": "No-result states convert into guided case creation instead of dead ends."}, {"label": "Case context is preserved", "detail": "Users can see existing case history before opening duplicates."}, {"label": "AI stays assistive", "detail": "AI can summarize and route, but sensitive issues still escalate clearly to humans."}, {"label": "Status is part of trust", "detail": "Service availability and reply expectations help users choose between self-service and escalation."}, {"label": "Shared global screen", "detail": "The hub connects multiple modules while remaining safe for user-specific context."}, {"label": "Mobile remains full", "detail": "Support requests often happen away from desk, so mobile keeps search, case, and live-support flows."}],
            "slug": "glb-scr-002-help-and-support-center",
            "mobile_title": "Help and Support",
            "mobile_badge": "Help",
            "mobile_chips": [{"label": "Cases 3", "w": 80, "fill": "#DBEAFE"}, {"label": "Live on", "w": 84, "fill": "#FEF3C7"}, {"label": "AI", "w": 54, "fill": "#FEE2E2"}],
            "mobile_search": "Search article, case, payroll issue, or support topic",
            "mobile_cards": [
                {"title": "Knowledge and topic summary", "subtitle": "Mobile starts with top topics and contextual search", "bullets": ["Payroll and leave top topics", "Status cards show service health", "No-result can create case", "Persona-based article suggestions"]},
                {"title": "Case and live-support cue", "subtitle": "Open cases and live help stay close on mobile", "bullets": ["Payslip issue matches open case", "Review linked article first", "Escalate if sensitive", "Live support online now"], "actions": [{"label": "Open case", "w": 136, "fill": COLORS["blue"]}, {"label": "Live support", "w": 166, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "History and AI routing stack", "subtitle": "Case status, reply expectations, and AI routing compress into one stack", "bullets": ["3 open cases visible", "1 awaits user attachment", "Latest note 40m ago", "AI routes sensitive issues to humans"]},
            ],
            "mobile_note": {"label": "Support-complete mobile", "detail": "Mobile preserves knowledge, case history, and live-support access so users can resolve issues without delay."},
        },
    ]

    for spec in batch_specs:
        render_standard_desktop(spec)
        render_standard_mobile(spec)

    batch_specs_2 = [
        {
            "title": "Profile and Delegation Switch",
            "badge": "Delegate 1",
            "shell": "Shared Workspace",
            "nav": ["Profile", "Delegation", "Security", "Sessions", "Devices", "Preferences"],
            "chips": [{"label": "Role stack 2", "w": 100, "fill": "#DBEAFE"}, {"label": "MFA on", "w": 82, "fill": "#DCFCE7"}, {"label": "Support off", "w": 102, "fill": "#FEF3C7"}],
            "actions": [{"label": "Switch role", "w": 150, "fill": COLORS["blue"]}, {"label": "Create delegation", "w": 176, "fill": COLORS["teal"]}],
            "search": "Search role, delegate, session, device, or privacy setting",
            "search_chips": [{"label": "Delegations", "w": 110, "fill": COLORS["soft"]}, {"label": "Sessions", "w": 96, "fill": COLORS["soft"]}, {"label": "Devices", "w": 82, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Active roles", "value": "02", "color": COLORS["green"]}, {"title": "Delegations", "value": "01", "color": COLORS["amber"]}, {"title": "Pending", "value": "01", "color": COLORS["red"]}, {"title": "Sessions", "value": "03", "color": COLORS["blue"]}, {"title": "Devices", "value": "02", "color": COLORS["teal"]}],
            "upper_left": {"title": "Identity and role summary", "subtitle": "Current actor, role stack, tenant context, and acted-for identity stay above the fold", "bullets": ["Employee plus Org Admin role stack active", "Tenant context visible in session header", "Acting-for identity state always explicit", "Profile and privacy posture shown together"]},
            "upper_right": {"title": "Security and access controls", "subtitle": "Delegation, MFA, and session safety remain explainable in one global profile surface", "note_title": "Delegation trust cue", "note_body": "Support-session state appears as an audited notice while role switch, delegation scope, and session controls remain self-service actions only.", "note_footer": "Next step: switch role, review delegation scope, or revoke a risky session without leaving the shared shell.", "note_actions": [{"label": "Open MFA", "w": 132, "fill": COLORS["blue"]}, {"label": "End session", "w": 132, "fill": "#EEF2FF"}, {"label": "Access history", "w": 144, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Delegation coverage", "subtitle": "Time-bound delegations show scope, approver state, and non-delegable exclusions", "bullets": ["Leave approvals delegated till 19 Jul", "Payroll and legal actions excluded", "Dual attribution enabled for audit", "Pending approval visible on queued delegation"]},
            "lower_right": {"title": "Sessions and privacy activity", "subtitle": "Trusted devices, revoked sessions, and recent security events stay visible in one place", "bullets": ["Chrome on Windows active now", "Trusted iPhone expires in 14 days", "One session revoked yesterday", "Privacy notice acknowledgment recorded"]},
            "footer": {"title": "Pinned profile lenses", "subtitle": "Users can pin role, delegation, session, device, and audit-oriented views for repeat access", "chips": [{"label": "My profile", "w": 104, "fill": "#DCFCE7"}, {"label": "Acting as", "w": 100, "fill": "#DBEAFE"}, {"label": "Delegations", "w": 108, "fill": "#FEF3C7"}, {"label": "Sessions", "w": 94, "fill": "#FEE2E2"}, {"label": "Devices", "w": 86, "fill": "#EDE9FE"}, {"label": "Audit", "w": 72, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Shared but role-safe", "detail": "The screen serves employee and Org Admin personas without leaking provider controls."}, {"label": "Active role stays visible", "detail": "Delegation only works when acted-for identity is permanently obvious."}, {"label": "Security is self-service", "detail": "This surface supports session and MFA management, not business processing."}, {"label": "Support state is distinct", "detail": "Support-session presence must look like a notice, not a normal user mode."}, {"label": "Masking remains visible", "detail": "Restricted settings should show guarded treatment instead of disappearing silently."}, {"label": "Trust signals stay close", "detail": "Session and device evidence needs to sit beside delegation actions."}, {"label": "Mobile stays practical", "detail": "Small screens prioritize switching role, delegation state, and revoke-session actions."}],
            "slug": "glb-scr-003-profile-and-delegation-switch",
            "mobile_title": "Profile Switch",
            "mobile_badge": "Delegate 1",
            "mobile_chips": [{"label": "MFA on", "w": 78, "fill": "#DCFCE7"}, {"label": "Sessions 3", "w": 94, "fill": "#DBEAFE"}, {"label": "Devices 2", "w": 92, "fill": "#FEF3C7"}],
            "mobile_search": "Search delegation, device, or session",
            "mobile_cards": [
                {"title": "Role summary", "subtitle": "Mobile starts with who you are acting as and what role stack is active", "bullets": ["Employee plus Org Admin", "Tenant context visible", "Acting identity explicit", "Support state shown if active"]},
                {"title": "Delegation status", "subtitle": "Scope and exclusions stay reviewable on small screens", "bullets": ["1 active delegation", "1 approval pending", "Payroll excluded", "Dual attribution enabled"], "actions": [{"label": "Switch role", "w": 136, "fill": COLORS["blue"]}, {"label": "Review scope", "w": 156, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Session safety stack", "subtitle": "Device and privacy cues compress into one mobile summary", "bullets": ["3 active sessions", "Trusted iPhone present", "One session revoked yesterday", "Privacy notice acknowledged"]},
            ],
            "mobile_note": {"label": "Trust-first mobile", "detail": "Mobile preserves delegation clarity, session safety, and masked-state treatment before deeper settings."},
        },
        {
            "title": "My Profile",
            "badge": "84% Complete",
            "shell": "My Workspace",
            "nav": ["Summary", "Employment", "Contacts", "Family", "Skills", "Timeline"],
            "chips": [{"label": "Editable", "w": 84, "fill": "#DCFCE7"}, {"label": "HR-managed", "w": 106, "fill": "#DBEAFE"}, {"label": "Locked 6", "w": 88, "fill": "#FEF3C7"}],
            "actions": [{"label": "Edit profile", "w": 146, "fill": COLORS["blue"]}, {"label": "Request locked change", "w": 188, "fill": COLORS["teal"]}],
            "search": "Search profile field, section, policy note, or change history",
            "search_chips": [{"label": "Summary", "w": 92, "fill": COLORS["soft"]}, {"label": "Contacts", "w": 94, "fill": COLORS["soft"]}, {"label": "History", "w": 84, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Complete", "value": "84%", "color": COLORS["green"]}, {"title": "Pending", "value": "01", "color": COLORS["amber"]}, {"title": "Locked", "value": "06", "color": COLORS["red"]}, {"title": "Dependents", "value": "03", "color": COLORS["blue"]}, {"title": "Contacts", "value": "02", "color": COLORS["teal"]}],
            "upper_left": {"title": "Personal and employment snapshot", "subtitle": "Employee-owned data and read-only employment context stay blended for quick orientation", "bullets": ["Role, department, manager, and location visible", "Current assignment and status shown first", "Employee-owned sections clearly labeled", "Read-only employment context stays nearby"]},
            "upper_right": {"title": "Edit workspace and governance", "subtitle": "Locked fields, change rules, and governed request paths remain visible while self-service stays simple", "note_title": "Read-only guidance", "note_body": "Bank, tax, identity, and payroll-governing fields do not edit inline here and instead branch into governed change-request flows.", "note_footer": "Next step: update contact or family data, or launch a controlled request for a locked field.", "note_actions": [{"label": "Edit contacts", "w": 144, "fill": COLORS["blue"]}, {"label": "Update family", "w": 144, "fill": "#EEF2FF"}, {"label": "Locked change", "w": 140, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Completeness and people details", "subtitle": "Missing profile items and people-readiness cues drive action before deep browsing", "bullets": ["Secondary phone still missing", "Nominee share totals valid at 100%", "Passport expires in 8 months", "One certification renewal due soon"]},
            "lower_right": {"title": "Change history and reasons", "subtitle": "Every major change explains when it landed, who changed it, and why a field may now be locked", "bullets": ["Address updated yesterday", "Manager name sourced from HR ops", "Grade change effective next cycle", "Audit trail available from this summary"]},
            "footer": {"title": "Pinned profile lenses", "subtitle": "Employees can pin profile, family, skill, and timeline views to support repeat self-service visits", "chips": [{"label": "Summary", "w": 86, "fill": "#DCFCE7"}, {"label": "Contact", "w": 84, "fill": "#DBEAFE"}, {"label": "Family", "w": 80, "fill": "#FEF3C7"}, {"label": "Skills", "w": 74, "fill": "#FEE2E2"}, {"label": "Timeline", "w": 86, "fill": "#EDE9FE"}, {"label": "Policy", "w": 74, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Owned vs managed", "detail": "Employee-owned and HR-managed fields need clear visual separation."}, {"label": "Completeness drives action", "detail": "Missing data should prompt work without forcing full-form scanning."}, {"label": "Lock reasons are plain", "detail": "Read-only states need clear human explanations beside the field group."}, {"label": "Effective dating matters", "detail": "Pending future changes belong in the same flow as current values."}, {"label": "Sensitive data branches out", "detail": "Identity and payroll fields should route into governed workflows, not ad hoc edits."}, {"label": "Confirmation is immediate", "detail": "Successful self-service updates should feel saved and auditable right away."}, {"label": "Mobile focuses on quick wins", "detail": "Contact and family updates should be the easiest things to complete on small screens."}],
            "slug": "emp-scr-002-my-profile",
            "mobile_title": "My Profile",
            "mobile_badge": "84% Complete",
            "mobile_chips": [{"label": "Editable", "w": 78, "fill": "#DCFCE7"}, {"label": "Pending 1", "w": 92, "fill": "#DBEAFE"}, {"label": "Locked 6", "w": 88, "fill": "#FEF3C7"}],
            "mobile_search": "Search field or history",
            "mobile_cards": [
                {"title": "Summary", "subtitle": "Mobile opens with current assignment and owned sections", "bullets": ["Role, department, and manager visible", "Location and status shown first", "Owned sections clear", "Read-only context nearby"]},
                {"title": "Complete profile", "subtitle": "Missing data stays prominent without opening every section", "bullets": ["Missing secondary phone", "Nominee share valid", "Passport expiry noted", "Certification renewal due"], "actions": [{"label": "Edit profile", "w": 136, "fill": COLORS["blue"]}, {"label": "Locked request", "w": 154, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Recent changes", "subtitle": "History and future changes compress into one stack", "bullets": ["Address saved yesterday", "Org change pending", "Audit trail available", "Manager sourced by HR ops"]},
            ],
            "mobile_note": {"label": "Simple but governed", "detail": "Mobile keeps lock explanations visible and routes sensitive edits into controlled requests."},
        },
        {
            "title": "My Documents",
            "badge": "Expiring 2",
            "shell": "My Workspace",
            "nav": ["Overview", "Required", "Letters", "Verification", "History", "Access"],
            "chips": [{"label": "Verified 18", "w": 98, "fill": "#DCFCE7"}, {"label": "Pending 2", "w": 92, "fill": "#DBEAFE"}, {"label": "Rejected 1", "w": 96, "fill": "#FEF3C7"}],
            "actions": [{"label": "Upload document", "w": 168, "fill": COLORS["blue"]}, {"label": "Replace version", "w": 156, "fill": COLORS["teal"]}],
            "search": "Search document name, category, status, case link, or expiry",
            "search_chips": [{"label": "Required", "w": 88, "fill": COLORS["soft"]}, {"label": "Pending", "w": 82, "fill": COLORS["soft"]}, {"label": "Expiring", "w": 84, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Verified", "value": "18", "color": COLORS["green"]}, {"title": "Pending", "value": "02", "color": COLORS["amber"]}, {"title": "Expiring", "value": "02", "color": COLORS["red"]}, {"title": "Rejected", "value": "01", "color": COLORS["blue"]}, {"title": "Letters", "value": "04", "color": COLORS["teal"]}],
            "upper_left": {"title": "Document center by category", "subtitle": "Identity, employment, education, and tax artifacts stay grouped by requirement and state", "bullets": ["PAN verified already", "Address proof awaits review", "Employment letter ready", "Older education certificate superseded"]},
            "upper_right": {"title": "Secure upload and access policy", "subtitle": "Upload, watermark, and restricted-download behavior stay explainable in one self-service panel", "note_title": "Access policy", "note_body": "Restricted categories can preview with watermark only, while downloads may be blocked by policy, legal hold, or verification state.", "note_footer": "Next step: upload a missing or clearer file, inspect rejection reason, or replace an expiring version.", "note_actions": [{"label": "Upload file", "w": 132, "fill": COLORS["blue"]}, {"label": "Replace", "w": 108, "fill": "#EEF2FF"}, {"label": "Why rejected", "w": 130, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Missing and expiring requirements", "subtitle": "Compliance gaps and rejection guidance remain visible for fast correction", "bullets": ["Passport expires in 62 days", "One rejected bank proof needs clearer scan", "Joining checklist complete except NDA renewal", "Expiry reminders enabled for critical categories"]},
            "lower_right": {"title": "Version and case-linked activity", "subtitle": "Employees can trace verification, replacement lineage, and linked business cases without admin controls", "bullets": ["Tax proof linked to declaration case", "Relieving letter v2 replaced v1", "HR verified ID yesterday", "Retention policy enforced but abstracted"]},
            "footer": {"title": "Pinned document lenses", "subtitle": "Users can pin required, pending, expiring, and employment-letter views for repeat follow-up", "chips": [{"label": "Required", "w": 86, "fill": "#DCFCE7"}, {"label": "Verified", "w": 90, "fill": "#DBEAFE"}, {"label": "Pending", "w": 82, "fill": "#FEF3C7"}, {"label": "Expiring", "w": 84, "fill": "#FEE2E2"}, {"label": "Letters", "w": 78, "fill": "#EDE9FE"}, {"label": "History", "w": 78, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Category-first organization", "detail": "Users should hunt by lifecycle category, not raw file list."}, {"label": "Requirement and status together", "detail": "Trust comes from seeing why a file exists and what state it is in."}, {"label": "Replace, don't overwrite", "detail": "Version-safe upload matters for evidence and history."}, {"label": "Reason-coded failures", "detail": "Rejected documents should explain what needs to change right where the employee is looking."}, {"label": "Restricted access is explicit", "detail": "Watermark or blocked download states should never feel silent or broken."}, {"label": "Case context stays linked", "detail": "Documents tied to business flows need visible context without leaking admin internals."}, {"label": "Mobile upload matters", "detail": "Reupload and camera capture need to remain first-class on small screens."}],
            "slug": "emp-scr-003-my-documents",
            "mobile_title": "My Documents",
            "mobile_badge": "Expiring 2",
            "mobile_chips": [{"label": "Verified 18", "w": 92, "fill": "#DCFCE7"}, {"label": "Pending 2", "w": 90, "fill": "#DBEAFE"}, {"label": "Rejected 1", "w": 94, "fill": "#FEF3C7"}],
            "mobile_search": "Search document or status",
            "mobile_cards": [
                {"title": "Required now", "subtitle": "Mobile begins with expiring and missing document work", "bullets": ["Passport expiry in 62 days", "Bank proof resubmit needed", "NDA renewal still open", "Pending review items shown first"]},
                {"title": "Upload queue", "subtitle": "Upload and resubmission stay one tap away", "bullets": ["2 files pending review", "OCR metadata suggested", "Replace-version path available", "File-quality feedback shown"], "actions": [{"label": "Upload", "w": 122, "fill": COLORS["blue"]}, {"label": "Replace", "w": 122, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Recent documents", "subtitle": "Verification and letters compress into one simple stack", "bullets": ["Employment letter ready", "PAN verified", "Tax proof linked", "Latest HR verification visible"]},
            ],
            "mobile_note": {"label": "Capture-friendly mobile", "detail": "Mobile keeps upload, resubmit, and restricted-download messaging visible and actionable."},
        },
        {
            "title": "My Requests",
            "badge": "SLA Risk 1",
            "shell": "My Workspace",
            "nav": ["All requests", "Drafts", "In progress", "Closed", "Templates", "Help"],
            "chips": [{"label": "Open 5", "w": 74, "fill": "#DBEAFE"}, {"label": "Drafts 2", "w": 86, "fill": "#FEF3C7"}, {"label": "Returned 1", "w": 92, "fill": "#FEE2E2"}],
            "actions": [{"label": "Start request", "w": 150, "fill": COLORS["blue"]}, {"label": "Resume draft", "w": 144, "fill": COLORS["teal"]}],
            "search": "Search request ID, type, status, owner group, or attachment",
            "search_chips": [{"label": "Open", "w": 70, "fill": COLORS["soft"]}, {"label": "Drafts", "w": 82, "fill": COLORS["soft"]}, {"label": "Returned", "w": 90, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Open", "value": "05", "color": COLORS["green"]}, {"title": "Drafts", "value": "02", "color": COLORS["amber"]}, {"title": "Pending", "value": "01", "color": COLORS["red"]}, {"title": "SLA risk", "value": "01", "color": COLORS["blue"]}, {"title": "Closed", "value": "12", "color": COLORS["teal"]}],
            "upper_left": {"title": "Open request queue", "subtitle": "A single employee-facing queue spans HR, payroll, workplace, and support requests", "bullets": ["Address change under review", "Employment letter request in progress", "Tax declaration draft saved", "IT access case awaits attachment"]},
            "upper_right": {"title": "SLA and routing transparency", "subtitle": "Current owner group, ETA, and request path stay visible without exposing internal notes", "note_title": "Routing cue", "note_body": "Employees can see owner group and SLA guidance, while restricted linked-case detail and internal handling notes remain hidden.", "note_footer": "Next step: resume a draft, withdraw an eligible request, or open the status timeline for a live case.", "note_actions": [{"label": "New request", "w": 128, "fill": COLORS["blue"]}, {"label": "Withdraw", "w": 112, "fill": "#EEF2FF"}, {"label": "View timeline", "w": 136, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Draft and returned actions", "subtitle": "The most important work is what the employee still needs to complete", "bullets": ["Bank-change request returned for proof", "Travel draft incomplete", "Reimbursement template suggested", "Overdue attachment highlighted"]},
            "lower_right": {"title": "Timeline and outcomes", "subtitle": "Status movement, visible comments, and closure evidence stay together in one record view", "bullets": ["Manager approval finished yesterday", "Payroll owner updated ETA", "Help case escalated to L2", "Closure summary downloadable where allowed"]},
            "footer": {"title": "Pinned request lenses", "subtitle": "Employees can pin draft, returned, payroll-impact, and help-oriented views for repeat use", "chips": [{"label": "Drafts", "w": 76, "fill": "#DCFCE7"}, {"label": "Returned", "w": 84, "fill": "#DBEAFE"}, {"label": "Pending", "w": 76, "fill": "#FEF3C7"}, {"label": "Payroll", "w": 78, "fill": "#FEE2E2"}, {"label": "Closed", "w": 72, "fill": "#EDE9FE"}, {"label": "Help", "w": 62, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "One center replaces fragments", "detail": "Requests should not be scattered across forms, inboxes, and email trails."}, {"label": "Scope stays self-only", "detail": "Employees should only see their own cases unless explicit delegation is active."}, {"label": "SLA builds trust", "detail": "Owner group and timing need to be visible without leaking restricted internals."}, {"label": "Drafts outrank history", "detail": "Returned and incomplete work deserves more emphasis than passive closure lists."}, {"label": "Payroll warnings are early", "detail": "Cutoff and dependency cues should appear before submission, not only after delay."}, {"label": "Duplicates are prevented", "detail": "The screen should help users avoid raising the same issue twice."}, {"label": "Mobile favors resumption", "detail": "Fast status checks and one-thumb draft continuation matter on small screens."}],
            "slug": "emp-scr-004-my-requests",
            "mobile_title": "My Requests",
            "mobile_badge": "At Risk 1",
            "mobile_chips": [{"label": "Open 5", "w": 72, "fill": "#DBEAFE"}, {"label": "Drafts 2", "w": 84, "fill": "#FEF3C7"}, {"label": "Returned 1", "w": 92, "fill": "#FEE2E2"}],
            "mobile_search": "Search request or ID",
            "mobile_cards": [
                {"title": "Act now", "subtitle": "Returned and incomplete work stays first on mobile", "bullets": ["Returned bank change", "Travel draft incomplete", "Attachment still missing", "Payroll warning shown if relevant"]},
                {"title": "Open requests", "subtitle": "SLA, owner, and decision state remain visible in compact form", "bullets": ["Owner group shown", "ETA visible", "Pending approval called out", "Withdraw shown if eligible"], "actions": [{"label": "Resume draft", "w": 136, "fill": COLORS["blue"]}, {"label": "Timeline", "w": 120, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Start new", "subtitle": "Common templates and help entry stay easy to reach", "bullets": ["Common templates surfaced", "Payroll-impact warning", "Help case path available", "Duplicate prevention enabled"]},
            ],
            "mobile_note": {"label": "SLA-aware mobile", "detail": "Mobile keeps current work and routing transparency ahead of passive request history."},
        },
        {
            "title": "My Pay and Tax",
            "badge": "Pay",
            "shell": "My Workspace",
            "nav": ["Home", "Pay and Tax", "Payslips", "Tax Declarations", "Year-End Docs", "Help"],
            "chips": [{"label": "Payslip live", "w": 94, "fill": "#DCFCE7"}, {"label": "FY window open", "w": 112, "fill": "#FEF3C7"}, {"label": "Masked IDs", "w": 96, "fill": "#DBEAFE"}],
            "actions": [{"label": "View latest payslip", "w": 178, "fill": COLORS["blue"]}, {"label": "Start tax declaration", "w": 190, "fill": COLORS["teal"]}],
            "search": "Search payslip month, deduction, tax proof, reimbursement, or payroll help topic",
            "search_chips": [{"label": "Payslips", "w": 92, "fill": COLORS["soft"]}, {"label": "Tax", "w": 56, "fill": COLORS["soft"]}, {"label": "Secure view", "w": 98, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Payslips", "value": "12", "color": COLORS["green"]}, {"title": "YTD earn", "value": "524k", "color": COLORS["amber"]}, {"title": "YTD deduct", "value": "91k", "color": COLORS["red"]}, {"title": "Proofs", "value": "02", "color": COLORS["blue"]}, {"title": "Claims", "value": "01", "color": COLORS["teal"]}],
            "upper_left": {"title": "Payslip timeline and earnings snapshot", "subtitle": "Month-wise payroll outputs stay easy to compare without exposing payroll-admin controls", "bullets": ["Last 12 published periods listed", "Current month stays pinned first", "Off-cycle or arrears tags shown inline", "PDF and print-safe actions attach to the active period"]},
            "upper_right": {"title": "Sensitive tax view and secure actions", "subtitle": "Tax declarations, masked identifiers, and payroll support stay together in a governed panel", "note_title": "Secure reveal control", "note_body": "Bank references, tax identifiers, and year-end personal tax documents require step-up verification and full audit logging before reveal.", "note_footer": "Next step: open the latest payslip, start a declaration, or route a correction into payroll support.", "note_actions": [{"label": "Open PDF", "w": 126, "fill": COLORS["blue"]}, {"label": "Reveal masked", "w": 146, "fill": "#EEF2FF"}, {"label": "Ask policy", "w": 122, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Tax declaration and proof tracker", "subtitle": "Declaration progress is deadline-aware and stays readable by category", "bullets": ["Draft, submitted, verified, and returned items grouped", "Reviewer feedback visible without leaving the page", "Cutoff date tied to payroll lock behavior", "Current estimate compared with prior-year carry-forward"]},
            "lower_right": {"title": "Reimbursements, bank profile, and year-end docs", "subtitle": "Financial-service outcomes remain self-only and traceable", "bullets": ["Reimbursement status shown end to end", "Primary bank reference stays masked", "Year-end tax documents listed with history", "Pending verification warns of next payroll impact"]},
            "footer": {"title": "Pinned pay lenses", "subtitle": "Employees can pin current-period, tax-proof, and year-end views for regular use", "chips": [{"label": "Current period", "w": 110, "fill": "#DCFCE7"}, {"label": "YTD", "w": 58, "fill": "#DBEAFE"}, {"label": "Tax proofs", "w": 96, "fill": "#FEF3C7"}, {"label": "Claims", "w": 70, "fill": "#FEE2E2"}, {"label": "Year-end", "w": 86, "fill": "#EDE9FE"}, {"label": "Masked", "w": 80, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Self-only finance view", "detail": "This page is for finalized outputs, not payroll administration."}, {"label": "Publication state is explicit", "detail": "Users should know whether a payslip is unpublished, held, or ready."}, {"label": "Sensitive IDs stay masked", "detail": "Reveal actions need clear step-up behavior and audit expectation."}, {"label": "Tax windows matter", "detail": "Declaration cutoffs should be visible before users assume they can still edit."}, {"label": "Reimbursements are outcomes", "detail": "Employees can track payment state without entering back-office bank release flows."}, {"label": "Year-end docs deserve space", "detail": "Seasonal tax traffic makes annual forms a first-class workflow, not a buried download."}, {"label": "Help is nearby", "detail": "Pay anomalies should route into support rather than invite manual workaround."}],
            "slug": "emp-scr-005-my-payslips-and-tax-views",
            "mobile_title": "My Pay and Tax",
            "mobile_badge": "Pay",
            "mobile_chips": [{"label": "Payslips 12", "w": 92, "fill": "#DCFCE7"}, {"label": "Proofs 2", "w": 82, "fill": "#FEF3C7"}, {"label": "Masked", "w": 74, "fill": "#DBEAFE"}],
            "mobile_search": "Search payslip month, proof, reimbursement, or payroll topic",
            "mobile_cards": [
                {"title": "Payslip and YTD summary", "subtitle": "Mobile starts with the latest period and year-to-date tax context", "bullets": ["Latest period pinned first", "YTD earnings and deductions shown", "Off-cycle tags stay visible", "PDF action attached to active period"]},
                {"title": "Tax declaration cue", "subtitle": "Time-bound tax work remains actionable on small screens", "bullets": ["Open items grouped by deduction category", "Returned proofs show reviewer comments", "Cutoff warning shown before payroll lock", "Masked identifiers require secure reveal"], "actions": [{"label": "Start declaration", "w": 150, "fill": COLORS["blue"]}, {"label": "View PDF", "w": 122, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Reimbursements and year-end stack", "subtitle": "Payment outcomes and tax docs compress into one governed summary", "bullets": ["Reimbursement stage visible", "Bank reference masked", "Year-end forms listed", "Corrections route to support"]},
            ],
            "mobile_note": {"label": "Secure pay mobile", "detail": "Mobile preserves self-only payroll visibility and guarded identifier reveal without exposing processing controls."},
        },
        {
            "title": "My Leave and Attendance",
            "badge": "Time",
            "shell": "My Workspace",
            "nav": ["Home", "Leave and Attendance", "Leave", "Attendance", "Regularization", "Holiday Calendar"],
            "chips": [{"label": "Balance low", "w": 98, "fill": "#FEF3C7"}, {"label": "Missing punch", "w": 108, "fill": "#FEE2E2"}, {"label": "Holiday overlay", "w": 118, "fill": "#DBEAFE"}],
            "actions": [{"label": "Apply leave", "w": 138, "fill": COLORS["blue"]}, {"label": "Regularize attendance", "w": 194, "fill": COLORS["teal"]}],
            "search": "Search leave type, attendance day, holiday, regularization case, comp-off, or shift note",
            "search_chips": [{"label": "Leave", "w": 68, "fill": COLORS["soft"]}, {"label": "Attendance", "w": 104, "fill": COLORS["soft"]}, {"label": "Calendar", "w": 84, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Annual", "value": "12.5d", "color": COLORS["green"]}, {"title": "Sick", "value": "4.0d", "color": COLORS["amber"]}, {"title": "Present", "value": "18", "color": COLORS["blue"]}, {"title": "Missing", "value": "01", "color": COLORS["red"]}, {"title": "Comp-off", "value": "0.5d", "color": COLORS["teal"]}],
            "upper_left": {"title": "Leave balance and calendar planner", "subtitle": "Balance visibility and policy-aware timing stay together before submission", "bullets": ["Balances shown by leave type", "Approved and pending leave overlay on the calendar", "Holiday and blackout dates visible", "Half-day and notice rules nearby"]},
            "upper_right": {"title": "Attendance exceptions and corrective actions", "subtitle": "Missing punches and regularization remain explainable and deadline-aware", "note_title": "Exception handling", "note_body": "A missing punch or source mismatch must be regularized with evidence before payroll cutoff and still follows policy and manager approval.", "note_footer": "Next step: open a regularization, apply leave instead, or inspect policy guidance for the day in question.", "note_actions": [{"label": "Open regularization", "w": 166, "fill": COLORS["blue"]}, {"label": "Apply leave", "w": 126, "fill": "#EEF2FF"}, {"label": "Ask policy", "w": 118, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Daily attendance log and shift detail", "subtitle": "Employees need a readable day ledger before deciding whether to correct, claim, or wait", "bullets": ["In, out, hours, shift, and status per day", "Late, early-out, missing, holiday, and weekly-off states clear", "Source channel visible without admin diagnostics", "Payroll-locked days stay read-only with explanation"]},
            "lower_right": {"title": "Comp-off, overtime, and approval trail", "subtitle": "Leave and time outcomes connect to approved attendance logic, not shortcuts", "bullets": ["Qualified overtime can convert to comp-off", "Leave requests track submitted to cancelled states", "Holiday or rest-day work highlighted", "Returned requests preserve comments and escalation path"]},
            "footer": {"title": "Pinned time lenses", "subtitle": "Employees can pin balance, punch, calendar, comp-off, and holiday views for daily use", "chips": [{"label": "Balance", "w": 74, "fill": "#DCFCE7"}, {"label": "Missing punch", "w": 112, "fill": "#DBEAFE"}, {"label": "Calendar", "w": 84, "fill": "#FEF3C7"}, {"label": "Comp-off", "w": 88, "fill": "#FEE2E2"}, {"label": "Holiday", "w": 78, "fill": "#EDE9FE"}, {"label": "Policy", "w": 68, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Policy before submit", "detail": "Leave entry should show rules before rejection ever happens."}, {"label": "Exception trust matters", "detail": "Source reasoning helps employees trust attendance correction flows."}, {"label": "Locked days stay visible", "detail": "Payroll-finalized dates should remain readable but uneditable."}, {"label": "Calendars reduce rework", "detail": "Holiday and blackout overlays reduce avoidable submissions."}, {"label": "Comp-off is governed", "detail": "Earned time should derive from policy-qualified work, not ad hoc entries."}, {"label": "Approval lineage matters", "detail": "Returned or pending cases need visible history for repeat visits."}, {"label": "Mobile favors correction", "detail": "Missing-punch handling is urgent and should stay prominent on small screens."}],
            "slug": "emp-scr-006-my-leave-and-attendance",
            "mobile_title": "Leave and Attendance",
            "mobile_badge": "Time",
            "mobile_chips": [{"label": "Leave 12.5d", "w": 98, "fill": "#DCFCE7"}, {"label": "Missing 1", "w": 88, "fill": "#FEE2E2"}, {"label": "Holiday 2", "w": 88, "fill": "#DBEAFE"}],
            "mobile_search": "Search leave, attendance day, regularization, holiday, or comp-off",
            "mobile_cards": [
                {"title": "Balance and calendar summary", "subtitle": "Mobile opens with balances, upcoming leave, and holiday context", "bullets": ["Available days by leave type", "Upcoming approved leave visible", "Holiday overlay shown", "Notice and blackout warnings stay visible"]},
                {"title": "Missing punch action cue", "subtitle": "Exception handling stays one tap away", "bullets": ["Missing day called out first", "Evidence entry follows regularization flow", "Payroll cutoff warning shown", "Approval still follows policy"], "actions": [{"label": "Regularize", "w": 138, "fill": COLORS["blue"]}, {"label": "Ask policy", "w": 126, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Attendance and comp-off stack", "subtitle": "Day ledger, leave status, and qualified overtime compress into one stack", "bullets": ["Daily in and out summary", "Pending leave approvals", "Comp-off shown separately", "Locked days explained clearly"]},
            ],
            "mobile_note": {"label": "Exception-first mobile", "detail": "Mobile keeps correction, leave submission, and payroll-lock cues ahead of lower-value history."},
        },
        {
            "title": "My Goals and Learning",
            "badge": "Growth",
            "shell": "My Workspace",
            "nav": ["Home", "Goals and Learning", "Goals", "Check-Ins", "Learning", "Certifications"],
            "chips": [{"label": "Review due", "w": 92, "fill": "#FEF3C7"}, {"label": "Learning overdue", "w": 124, "fill": "#FEE2E2"}, {"label": "Cycle active", "w": 98, "fill": "#DBEAFE"}],
            "actions": [{"label": "Record check-in", "w": 166, "fill": COLORS["blue"]}, {"label": "Browse learning", "w": 158, "fill": COLORS["teal"]}],
            "search": "Search goal, KPI, milestone, course, certification, or development path",
            "search_chips": [{"label": "Goals", "w": 68, "fill": COLORS["soft"]}, {"label": "Learning", "w": 84, "fill": COLORS["soft"]}, {"label": "Skills", "w": 64, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Goals", "value": "06", "color": COLORS["green"]}, {"title": "Complete", "value": "68%", "color": COLORS["amber"]}, {"title": "Due", "value": "02", "color": COLORS["red"]}, {"title": "Courses", "value": "03", "color": COLORS["blue"]}, {"title": "Cert exp", "value": "01", "color": COLORS["teal"]}],
            "upper_left": {"title": "Goal plan and milestone board", "subtitle": "Performance goals need structure, weights, and timing before they need narrative", "bullets": ["OKR, KPI, and development goals in one plan", "Milestones and blockers visible per goal", "Draft, approved, frozen, and reopened states distinct", "Evidence and prior check-ins stay close to each row"]},
            "upper_right": {"title": "Review cue and next step", "subtitle": "The employee sees what is due now without exposing confidential manager context", "note_title": "Mid-cycle guidance", "note_body": "A due check-in or returned frozen goal should explain exactly what can still change, what needs manager review, and what is now read-only.", "note_footer": "Next step: record a check-in, open a learning path, or use AI help while approvals and ratings stay human-governed.", "note_actions": [{"label": "Record check-in", "w": 160, "fill": COLORS["blue"]}, {"label": "Open learning", "w": 144, "fill": "#EEF2FF"}, {"label": "Ask assistant", "w": 136, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Learning path and certification queue", "subtitle": "Mandatory and developmental learning share one progress surface with different urgency", "bullets": ["Mandatory learning separated from optional growth", "Due dates and completion percentage stay visible", "External assessments remain in the same sequence", "Overdue compliance sits above suggested content"]},
            "lower_right": {"title": "Skills, evidence, and alignment", "subtitle": "Development visibility should help action without leaking peer or confidential goal data", "bullets": ["Role-skill gaps and badges shown", "Shared-goal contribution visible safely", "Manager-visible comments summarized only where allowed", "Frozen goals and evidence completeness highlighted"]},
            "footer": {"title": "Pinned growth lenses", "subtitle": "Employees can pin cycle, learning, certification, and frozen-goal views for repeat growth rituals", "chips": [{"label": "Current cycle", "w": 104, "fill": "#DCFCE7"}, {"label": "Check-ins", "w": 86, "fill": "#DBEAFE"}, {"label": "Learning", "w": 82, "fill": "#FEF3C7"}, {"label": "Certifications", "w": 106, "fill": "#FEE2E2"}, {"label": "Skills", "w": 68, "fill": "#EDE9FE"}, {"label": "Frozen", "w": 72, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Goals and learning belong together", "detail": "Employees manage delivery and growth in the same rhythm."}, {"label": "State clarity matters", "detail": "Draft, approved, frozen, and reopened behaviors need obvious visual separation."}, {"label": "Restricted content stays hidden", "detail": "Manager-only or cross-team goal data should not leak into self-service."}, {"label": "Check-ins lead action", "detail": "Due conversations should not be buried beneath passive progress indicators."}, {"label": "Urgency is differentiated", "detail": "Overdue compliance learning is not the same as optional development browsing."}, {"label": "AI is advisory", "detail": "Suggestions should remain explainable and never override governed performance actions."}, {"label": "Mobile favors momentum", "detail": "Progress updates and reminders are more valuable than dense planning on a phone."}],
            "slug": "emp-scr-007-my-goals-and-learning",
            "mobile_title": "Goals and Learning",
            "mobile_badge": "Growth",
            "mobile_chips": [{"label": "Goals 6", "w": 74, "fill": "#DBEAFE"}, {"label": "Due 2", "w": 66, "fill": "#FEF3C7"}, {"label": "Learn 3", "w": 74, "fill": "#FEE2E2"}],
            "mobile_search": "Search goals, KPI, course, certification, or skill",
            "mobile_cards": [
                {"title": "Goal summary and cycle state", "subtitle": "Mobile starts with weighted progress and what is still editable", "bullets": ["Active goals and completion trend", "Frozen versus draft state visible", "Milestones and blockers compact", "Evidence one tap away"]},
                {"title": "Review and check-in cue", "subtitle": "Due work is framed as the next action", "bullets": ["Check-ins due first", "Returned goals explain revision needs", "AI suggests clearer wording", "Final approvals remain manager-controlled"], "actions": [{"label": "Record check-in", "w": 150, "fill": COLORS["blue"]}, {"label": "Open learning", "w": 150, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Learning and certification stack", "subtitle": "Courses, mandatory items, and renewals compress into one queue", "bullets": ["Mandatory and optional separated", "Certification renewals highlighted", "Recommended courses tied to skills", "Overdue learning remains visible"]},
            ],
            "mobile_note": {"label": "Guided-growth mobile", "detail": "Mobile keeps due work, governed goal states, and mandatory learning urgency in front."},
        },
        {
            "title": "My Benefits and Claims",
            "badge": "Benefits",
            "shell": "My Workspace",
            "nav": ["Home", "Benefits and Claims", "Plans", "Enrollment", "Claims", "Dependents"],
            "chips": [{"label": "Window open", "w": 98, "fill": "#DCFCE7"}, {"label": "Claim returned", "w": 112, "fill": "#FEF3C7"}, {"label": "Policy lock", "w": 92, "fill": "#DBEAFE"}],
            "actions": [{"label": "Update enrollment", "w": 176, "fill": COLORS["blue"]}, {"label": "Submit claim", "w": 146, "fill": COLORS["teal"]}],
            "search": "Search plan, claim, dependent, insurer contact, reimbursement, or policy document",
            "search_chips": [{"label": "Benefits", "w": 84, "fill": COLORS["soft"]}, {"label": "Claims", "w": 74, "fill": COLORS["soft"]}, {"label": "Coverage", "w": 86, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Plans", "value": "04", "color": COLORS["green"]}, {"title": "Claims", "value": "02", "color": COLORS["amber"]}, {"title": "Reimburse", "value": "01", "color": COLORS["blue"]}, {"title": "Dependents", "value": "03", "color": COLORS["red"]}, {"title": "Window", "value": "7d", "color": COLORS["teal"]}],
            "upper_left": {"title": "Coverage and plan summary", "subtitle": "Eligibility, effective dates, and employee cost should be understandable before any change is requested", "bullets": ["Medical, insurance, wellness, and retirement plans grouped", "Employer and employee contribution preview shown", "Waived plans explain eligibility", "Provider docs and contacts stay attached"]},
            "upper_right": {"title": "Enrollment and claim guidance", "subtitle": "Windowed plan changes and claim correction paths stay visible in one workspace", "note_title": "Governed benefits action", "note_body": "Outside open enrollment, plan changes lock unless a life event or exception route applies, while returned claims show correction guidance without unnecessary medical detail.", "note_footer": "Next step: update enrollment, open a returned claim, or ask the benefits assistant while adjudication and payroll deduction processing stay back-office.", "note_actions": [{"label": "Update enrollment", "w": 164, "fill": COLORS["blue"]}, {"label": "Open claim", "w": 122, "fill": "#EEF2FF"}, {"label": "Ask assistant", "w": 134, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Claims and reimbursement tracker", "subtitle": "Employees should understand status, next step, and settlement path without calling support", "bullets": ["Submitted to reversed claim states visible", "Insurer or TPA reference shown inline", "Bank-paid and payroll-paid reimbursements distinguished", "Missing evidence and deadlines highlighted"]},
            "lower_right": {"title": "Dependents, nominees, and policy docs", "subtitle": "Family-linked data stays governed, verified, and privacy-safe", "bullets": ["Dependent verification status visible", "Add or edit routes through governed self-service", "Nominee details distinct from claims", "Policy documents and contacts easy to reopen"]},
            "footer": {"title": "Pinned benefits lenses", "subtitle": "Employees can pin enrollment, claims, dependent, and coverage views for recurring use", "chips": [{"label": "Enrollment", "w": 94, "fill": "#DCFCE7"}, {"label": "Claims", "w": 72, "fill": "#DBEAFE"}, {"label": "Dependents", "w": 98, "fill": "#FEF3C7"}, {"label": "Reimburse", "w": 92, "fill": "#FEE2E2"}, {"label": "Policy docs", "w": 100, "fill": "#EDE9FE"}, {"label": "Coverage", "w": 82, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Eligibility-driven self-service", "detail": "Lock rules should be obvious before employees attempt changes."}, {"label": "Medical detail stays minimal", "detail": "Claim status should be actionable without oversharing sensitive health information."}, {"label": "Enrollment windows are core states", "detail": "Open, locked, and life-event conditions belong in the main interaction flow."}, {"label": "Payroll edits stay elsewhere", "detail": "Deduction previews are allowed here, but payroll changes are not."}, {"label": "Returned claims need loops", "detail": "Employees need clear correction paths for common claim failures."}, {"label": "Dependents stay governed", "detail": "Family data should remain tied to verification and evidence expectations."}, {"label": "Mobile favors urgent follow-up", "detail": "Small screens should make claims and enrollment status easy to act on fast."}],
            "slug": "emp-scr-008-my-benefits-and-claims",
            "mobile_title": "Benefits and Claims",
            "mobile_badge": "Benefits",
            "mobile_chips": [{"label": "Plans 4", "w": 74, "fill": "#DBEAFE"}, {"label": "Claims 2", "w": 78, "fill": "#FEF3C7"}, {"label": "Window 7d", "w": 90, "fill": "#DCFCE7"}],
            "mobile_search": "Search plan, claim, dependent, reimbursement, or policy doc",
            "mobile_cards": [
                {"title": "Plan and coverage summary", "subtitle": "Mobile starts with what is active, waived, and time-bound", "bullets": ["Active plans and dates first", "Employee contribution preview", "Waived or locked plans explained", "Provider docs remain attached"]},
                {"title": "Enrollment and returned-claim cue", "subtitle": "Open-window actions and correction paths stay one tap away", "bullets": ["Deadline shown prominently", "Life-event rule explained", "Returned claim shows missing-doc guidance", "Back-office adjudication stays status-only"], "actions": [{"label": "Update enrollment", "w": 156, "fill": COLORS["blue"]}, {"label": "Open claim", "w": 126, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Dependents and reimbursement stack", "subtitle": "Family coverage and payment outcomes compress into one governed summary", "bullets": ["Dependent verification by plan", "Pending reimbursement shown by settlement path", "Nominee detail stays separate", "Policy docs easy to reopen"]},
            ],
            "mobile_note": {"label": "Privacy-safe benefits mobile", "detail": "Mobile preserves eligibility locks, claim status, and dependent governance without oversharing medical or financial detail."},
        },
        {
            "title": "Team People List",
            "badge": "Scoped",
            "shell": "Team Command Center",
            "nav": ["Dashboard", "People", "Approvals", "Attendance", "Performance", "Hiring"],
            "chips": [{"label": "My team", "w": 82, "fill": "#DCFCE7"}, {"label": "Direct + indirect", "w": 128, "fill": "#DBEAFE"}, {"label": "Delegation-aware", "w": 126, "fill": "#FEF3C7"}],
            "actions": [{"label": "Open profile", "w": 142, "fill": COLORS["blue"]}, {"label": "Start check-in", "w": 152, "fill": COLORS["teal"]}],
            "search": "Search employee, team, location, skill, job title, or employee ID",
            "search_chips": [{"label": "Directs", "w": 72, "fill": COLORS["soft"]}, {"label": "Probation", "w": 84, "fill": COLORS["soft"]}, {"label": "Missing data", "w": 104, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Team size", "value": "24", "color": COLORS["green"]}, {"title": "Directs", "value": "08", "color": COLORS["amber"]}, {"title": "Probation", "value": "02", "color": COLORS["red"]}, {"title": "Joiners 30d", "value": "03", "color": COLORS["blue"]}, {"title": "Data gaps", "value": "04", "color": COLORS["teal"]}],
            "upper_left": {"title": "Roster and filter stack", "subtitle": "Managers need a fast list-first team surface before drilling into profiles", "bullets": ["Direct and indirect reports grouped separately", "Title, location, tenure, and chain shown per row", "Sensitive pay and medical data absent from roster", "Delegated-team rows carry a scope badge"]},
            "upper_right": {"title": "Selected employee summary", "subtitle": "Profile launch, status context, and next manager actions stay in one review pane", "note_title": "Scope-safe profile cue", "note_body": "The selected employee card shows role, attendance trend, leave status, goals, and pending requests while restricted fields remain masked by policy.", "note_footer": "Next step: open the employee profile, start a check-in, or review open actions without losing filter context.", "note_actions": [{"label": "Open profile", "w": 136, "fill": COLORS["blue"]}, {"label": "Timeline", "w": 110, "fill": "#EEF2FF"}, {"label": "Start check-in", "w": 140, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Team composition and workload lenses", "subtitle": "The people list doubles as an operational roster for workload, readiness, and coverage checks", "bullets": ["Segment by location, shift, employment type, and critical skill", "Probation endings and reporting-line changes highlighted", "Leave overlap and attendance exceptions flagged", "Quick pivot into org and reporting structure context"]},
            "lower_right": {"title": "Follow-ups and people risks", "subtitle": "Roster work stays actionable when pending manager tasks and people issues are visible", "bullets": ["3 missing acknowledgments need follow-up", "2 employees are mobility-ready", "1 reporting-line change pending effective date", "Low-sentiment signal shown only as safe manager alert"]},
            "footer": {"title": "Pinned team lenses", "subtitle": "Managers can pin direct-report, probation, skill, and data-quality views for repeat reviews", "chips": [{"label": "Directs", "w": 72, "fill": "#DCFCE7"}, {"label": "Probation", "w": 82, "fill": "#DBEAFE"}, {"label": "Joiners", "w": 72, "fill": "#FEF3C7"}, {"label": "Critical skills", "w": 108, "fill": "#FEE2E2"}, {"label": "Remote", "w": 68, "fill": "#EDE9FE"}, {"label": "Data gaps", "w": 84, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "List-first manager flow", "detail": "Managers usually enter through people lookup, so the roster outranks deep profile detail."}, {"label": "Permission-safe summary", "detail": "Only operationally useful fields should appear in the list."}, {"label": "Delegation clarity", "detail": "Delegated-team visibility must be unmistakable to prevent out-of-scope action."}, {"label": "Fast profile launch", "detail": "The right pane should help decide whether a full profile view is necessary."}, {"label": "Operational filters win", "detail": "Manager questions differ from master-data maintenance categories."}, {"label": "No compensation leakage", "detail": "The roster must never become a backdoor into pay or grievance data."}, {"label": "Reusable people lens", "detail": "Pinned filters should support recurring team-review rituals."}],
            "slug": "mgr-scr-002-team-people-list",
            "mobile_title": "Team People",
            "mobile_badge": "Scope",
            "mobile_chips": [{"label": "Directs", "w": 68, "fill": "#DCFCE7"}, {"label": "Probation", "w": 82, "fill": "#DBEAFE"}, {"label": "Gaps", "w": 56, "fill": "#FEF3C7"}],
            "mobile_search": "Search team members or filters",
            "mobile_cards": [
                {"title": "Roster summary", "subtitle": "Mobile starts with team size and urgent people-state cues", "bullets": ["24 members in scope", "2 probation endings", "3 new joiners in 30 days", "4 records missing updates"]},
                {"title": "Selected employee cue", "subtitle": "The chosen person card keeps the next step obvious on smaller screens", "bullets": ["Role, location, and tenure visible", "Open requests and review status summarized", "Restricted fields stay masked", "Profile launch preserves filters"], "actions": [{"label": "Open profile", "w": 136, "fill": COLORS["blue"]}, {"label": "Check-in", "w": 118, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Team risk stack", "subtitle": "Coverage, data quality, and org changes collapse into one mobile summary", "bullets": ["1 reporting-line change pending", "Leave overlap flagged in one pod", "2 mobility-ready employees", "3 follow-ups on documents"]},
            ],
            "mobile_note": {"label": "Roster-first mobile", "detail": "Mobile prioritizes team lookup and next action over deep profile density."},
        },
        {
            "title": "Manager Approvals",
            "badge": "Queue",
            "shell": "Team Command Center",
            "nav": ["Dashboard", "People", "Approvals", "Attendance", "Performance", "Hiring"],
            "chips": [{"label": "Action required", "w": 112, "fill": "#FEE2E2"}, {"label": "Cross-module", "w": 112, "fill": "#DBEAFE"}, {"label": "Delegation-enabled", "w": 130, "fill": "#FEF3C7"}],
            "actions": [{"label": "Open highest priority", "w": 190, "fill": COLORS["blue"]}, {"label": "Bulk approve safe", "w": 172, "fill": COLORS["teal"]}],
            "search": "Search request, employee, module, reason, or workflow ID",
            "search_chips": [{"label": "Leave", "w": 62, "fill": COLORS["soft"]}, {"label": "Expense", "w": 76, "fill": COLORS["soft"]}, {"label": "SLA breach", "w": 92, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Pending", "value": "18", "color": COLORS["green"]}, {"title": "Due today", "value": "06", "color": COLORS["amber"]}, {"title": "Overdue", "value": "04", "color": COLORS["red"]}, {"title": "Delegated", "value": "02", "color": COLORS["blue"]}, {"title": "Returned", "value": "03", "color": COLORS["teal"]}],
            "upper_left": {"title": "Approval inbox and triage", "subtitle": "Managers need urgency, SLA, and module context before detail review", "bullets": ["Overdue first sort is default", "Rows show employee, module, type, and aging", "Bulk select appears only for safe approval types", "Returned items stay visible with latest correction note"]},
            "upper_right": {"title": "Selected approval detail", "subtitle": "Decision context, comments, and action controls stay in one pane", "note_title": "Decision guardrail", "note_body": "The detail panel shows policy summary, employee impact, attachments, and prior comments while return and reject require rationale.", "note_footer": "Next step: approve, return for correction, delegate with expiry, or open source workflow if deeper evidence is needed.", "note_actions": [{"label": "Approve", "w": 108, "fill": COLORS["blue"]}, {"label": "Return", "w": 108, "fill": "#EEF2FF"}, {"label": "Delegate", "w": 122, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Policy and impact checks", "subtitle": "Approvals should be explainable, not blind, so cutoff rules and team impact stay visible", "bullets": ["Leave shows coverage and blackout warnings", "Expense shows amount and policy variance", "Attendance corrections show punch source", "Travel shows trip dates and policy class"]},
            "lower_right": {"title": "Delegation, history, and audit cues", "subtitle": "Managers need to understand who touched a task and whether escalation risk is growing", "bullets": ["2 items delegated during absence", "1 item breached reminder threshold", "History shows actor, timestamp, and channel", "Audit chronology available without leaving queue"]},
            "footer": {"title": "Pinned approval lenses", "subtitle": "Managers can pin overdue, module, and delegation views for repeat approval sweeps", "chips": [{"label": "Today", "w": 58, "fill": "#DCFCE7"}, {"label": "SLA risk", "w": 80, "fill": "#DBEAFE"}, {"label": "Leave", "w": 60, "fill": "#FEF3C7"}, {"label": "Expense", "w": 72, "fill": "#FEE2E2"}, {"label": "Travel", "w": 66, "fill": "#EDE9FE"}, {"label": "Delegated", "w": 86, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Queue before detail", "detail": "Approval work is deadline-driven, so the queue must dominate initial hierarchy."}, {"label": "Cross-module consistency", "detail": "Different approval types should still feel unified."}, {"label": "Safe bulk actions", "detail": "Bulk approval belongs only to low-risk items."}, {"label": "Rationale is explicit", "detail": "Return and reject paths need visible comment requirements."}, {"label": "Delegation stays clear", "detail": "Delegated ownership and expiry must be obvious."}, {"label": "SLA-led prioritization", "detail": "Aging signals matter more than passive summary widgets."}, {"label": "Traceable decisions", "detail": "Every action should preserve a clean audit trail."}],
            "slug": "mgr-scr-003-manager-approvals",
            "mobile_title": "Approvals",
            "mobile_badge": "Queue",
            "mobile_chips": [{"label": "Due today", "w": 86, "fill": "#FEF3C7"}, {"label": "Overdue", "w": 76, "fill": "#FEE2E2"}, {"label": "Delegated", "w": 86, "fill": "#DBEAFE"}],
            "mobile_search": "Search approvals or workflow IDs",
            "mobile_cards": [
                {"title": "Queue summary", "subtitle": "Mobile starts with pending volume and breach risk", "bullets": ["18 approvals pending", "6 due today", "4 overdue", "2 delegated still open"]},
                {"title": "Selected approval cue", "subtitle": "The active request keeps policy and next step concise", "bullets": ["Employee and module shown first", "Cutoff or blackout warning visible", "Return path requires rationale", "Source detail link available"], "actions": [{"label": "Approve", "w": 108, "fill": COLORS["blue"]}, {"label": "Return", "w": 108, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "History and delegation stack", "subtitle": "Audit and handoff cues compress into one lower card", "bullets": ["Delegation expiry shown", "Latest comment preserved", "Escalation reminders visible", "Decision history readable"]},
            ],
            "mobile_note": {"label": "Decision-first mobile", "detail": "Mobile keeps the queue and immediate actions ahead of secondary history."},
        },
        {
            "title": "Performance Review Workspace",
            "badge": "Cycle",
            "shell": "Team Command Center",
            "nav": ["Dashboard", "People", "Approvals", "Attendance", "Performance", "Hiring"],
            "chips": [{"label": "Current cycle", "w": 102, "fill": "#DBEAFE"}, {"label": "Self-review pending", "w": 134, "fill": "#FEF3C7"}, {"label": "Calibration-aware", "w": 126, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open due reviews", "w": 170, "fill": COLORS["blue"]}, {"label": "Finalize ready", "w": 148, "fill": COLORS["teal"]}],
            "search": "Search employee, cycle, rating, goal, competency, or review step",
            "search_chips": [{"label": "Due this week", "w": 102, "fill": COLORS["soft"]}, {"label": "Calibration", "w": 90, "fill": COLORS["soft"]}, {"label": "Finalize", "w": 78, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Due", "value": "14", "color": COLORS["green"]}, {"title": "Self-pend", "value": "05", "color": COLORS["amber"]}, {"title": "Calibration", "value": "03", "color": COLORS["red"]}, {"title": "1:1 gaps", "value": "04", "color": COLORS["blue"]}, {"title": "Ready", "value": "07", "color": COLORS["teal"]}],
            "upper_left": {"title": "Review queue and cycle progress", "subtitle": "Managers need a clear task list by employee and review step before opening any form", "bullets": ["Queue groups items by due date and cycle state", "Self-review missing state more prominent than passive progress", "Promotion-watch visible only where policy allows", "Completed reviews remain accessible with submitted timestamps"]},
            "upper_right": {"title": "Selected review context", "subtitle": "Goals, evidence, prior rating, and narrative stay visible in one working pane", "note_title": "Explainable rating support", "note_body": "AI may summarize check-ins, goals, and feedback themes, but the manager still chooses the rating and confirms policy-sensitive statements.", "note_footer": "Next step: open the full review, inspect prior-cycle context, or send a reminder when self-review is still missing.", "note_actions": [{"label": "Open review", "w": 132, "fill": COLORS["blue"]}, {"label": "Ask copilot", "w": 126, "fill": "#EEF2FF"}, {"label": "Prior cycle", "w": 128, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Evidence and development context", "subtitle": "A performance decision should feel evidence-backed rather than form-driven", "bullets": ["Goal completion, check-ins, and 1:1 notes shown together", "Learning and certifications surface as optional evidence", "Peer feedback summarized where visible", "Comment prompts encourage strengths and gaps"]},
            "lower_right": {"title": "Calibration and talent signals", "subtitle": "Cycle execution and future-talent decisions coexist without turning the page into succession admin", "bullets": ["3 reviews held for calibration discussion", "2 employees on promotion watch", "Team-level skew warning visible", "Finalization blocked when comments or evidence are missing"]},
            "footer": {"title": "Pinned performance lenses", "subtitle": "Managers can pin cycle, self-review, calibration, and finalization views for repeat review sweeps", "chips": [{"label": "Current cycle", "w": 104, "fill": "#DCFCE7"}, {"label": "Self-review", "w": 94, "fill": "#DBEAFE"}, {"label": "Calibration", "w": 94, "fill": "#FEF3C7"}, {"label": "Promotion", "w": 84, "fill": "#FEE2E2"}, {"label": "1:1 gaps", "w": 84, "fill": "#EDE9FE"}, {"label": "Finalize", "w": 76, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Task-led review flow", "detail": "Managers should enter from an actionable queue, not a passive dashboard."}, {"label": "Evidence beside narrative", "detail": "Goals, feedback, and comments need to sit together to reduce unsupported ratings."}, {"label": "AI is assistive only", "detail": "Copilot helps draft but never becomes the final reviewer."}, {"label": "Cycle states are distinct", "detail": "Self-review pending, calibration hold, and finalized states need obvious separation."}, {"label": "Promotion sensitivity", "detail": "Talent-readiness cues stay visible without exposing governed compensation or succession detail."}, {"label": "Finalize with confidence", "detail": "Missing evidence and comment blockers should surface before submit."}, {"label": "Repeatable rituals", "detail": "Pinned lenses should support weekly review sweeps and finalization passes."}],
            "slug": "mgr-scr-004-performance-review-workspace",
            "mobile_title": "Review Workspace",
            "mobile_badge": "Cycle",
            "mobile_chips": [{"label": "Due", "w": 48, "fill": "#FEF3C7"}, {"label": "Calibration", "w": 92, "fill": "#DBEAFE"}, {"label": "Finalize", "w": 78, "fill": "#DCFCE7"}],
            "mobile_search": "Search reviews, ratings, or employees",
            "mobile_cards": [
                {"title": "Cycle summary", "subtitle": "Mobile starts with due reviews and blocker counts", "bullets": ["14 reviews due", "5 self-reviews still pending", "3 calibration holds", "7 ready to finalize"]},
                {"title": "Selected review cue", "subtitle": "The chosen employee card keeps the review decision grounded", "bullets": ["Goals and competency summary visible", "Prior-cycle context one tap away", "AI draft stays editable", "Reminder option shown when self-review missing"], "actions": [{"label": "Open review", "w": 132, "fill": COLORS["blue"]}, {"label": "Reminder", "w": 122, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Evidence and calibration stack", "subtitle": "Evidence, 1:1 gaps, and rating holds compress into one lower summary", "bullets": ["4 employees missing recent 1:1 notes", "Calibration hold reason visible", "Promotion-watch shown where allowed", "Finalize blocked until required comments exist"]},
            ],
            "mobile_note": {"label": "Cycle-triage mobile", "detail": "Mobile favors review continuation and due work over dense form editing."},
        },
        {
            "title": "Hiring Approval Workspace",
            "badge": "Hiring",
            "shell": "Team Command Center",
            "nav": ["Dashboard", "People", "Approvals", "Attendance", "Performance", "Hiring"],
            "chips": [{"label": "Authority", "w": 74, "fill": "#DBEAFE"}, {"label": "Confidential-aware", "w": 128, "fill": "#FEF3C7"}, {"label": "Offer expiry", "w": 102, "fill": "#FEE2E2"}],
            "actions": [{"label": "Open urgent requisition", "w": 196, "fill": COLORS["blue"]}, {"label": "Approve ready", "w": 142, "fill": COLORS["teal"]}],
            "search": "Search requisition, candidate, position, cost center, or approval ID",
            "search_chips": [{"label": "Requisition", "w": 98, "fill": COLORS["soft"]}, {"label": "Budget block", "w": 102, "fill": COLORS["soft"]}, {"label": "Expiry", "w": 62, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Pending", "value": "09", "color": COLORS["green"]}, {"title": "SLA risk", "value": "02", "color": COLORS["amber"]}, {"title": "Budget", "value": "01", "color": COLORS["red"]}, {"title": "Confid", "value": "02", "color": COLORS["blue"]}, {"title": "Expiring", "value": "03", "color": COLORS["teal"]}],
            "upper_left": {"title": "Hiring queue and criticality stack", "subtitle": "Managers need urgency, stage, and approval type before opening candidate detail", "bullets": ["Manpower, requisition, interview, and offer approvals unified", "Critical roles and expiring offers float above low-risk stages", "Confidential items remain visible as work objects", "Budget-blocked tasks outrank standard overdue items"]},
            "upper_right": {"title": "Selected hiring decision", "subtitle": "Business case, candidate fit, and approval controls stay together to reduce offline loops", "note_title": "Confidential hiring cue", "note_body": "For confidential requisitions, role need, approval stage, and budget summary show first while candidate identity and compensation detail unlock only when policy permits.", "note_footer": "Next step: approve, return with rationale, or open requisition or candidate context when more evidence is allowed.", "note_actions": [{"label": "Approve", "w": 108, "fill": COLORS["blue"]}, {"label": "Return", "w": 108, "fill": "#EEF2FF"}, {"label": "Open candidate", "w": 144, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Business case and budget context", "subtitle": "The workspace explains why the hire matters, not only that a workflow item exists", "bullets": ["Headcount justification and vacancy source shown", "Budget delta and cost center within manager authority", "Interview recommendation summaries visible", "Internal mobility candidates flagged safely"]},
            "lower_right": {"title": "Decision trail and downstream dependencies", "subtitle": "Managers need confidence about what their approval will trigger next", "bullets": ["1 offer blocked by compensation variance comment", "3 offers nearing expiry", "History shows recruiter, finance, and prior manager touches", "Post-approval routing to offer or onboarding is explicit"]},
            "footer": {"title": "Pinned hiring lenses", "subtitle": "Managers can pin critical-role, budget, expiry, and internal-mobility views for repeat approvals", "chips": [{"label": "Critical roles", "w": 112, "fill": "#DCFCE7"}, {"label": "Budget", "w": 70, "fill": "#DBEAFE"}, {"label": "Offer expiry", "w": 98, "fill": "#FEF3C7"}, {"label": "Confidential", "w": 100, "fill": "#FEE2E2"}, {"label": "Delegate", "w": 74, "fill": "#EDE9FE"}, {"label": "Mobility", "w": 74, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Hiring urgency first", "detail": "Expiring offers and critical requisitions should outrank lower-risk approval work."}, {"label": "Confidential by design", "detail": "Sensitive reqs need support without exposing unauthorized candidate detail."}, {"label": "Decision with business context", "detail": "Managers should see role need, budget, and fit cues beside action controls."}, {"label": "Return needs rationale", "detail": "Reject and request-change paths should preserve structured reasoning."}, {"label": "Authority-aware visibility", "detail": "Budget and compensation detail should only appear within the manager's scope."}, {"label": "Downstream awareness", "detail": "Approvers need to know whether the decision advances requisition, offer, or onboarding."}, {"label": "Repeatable hiring filters", "detail": "Pinned views help managers revisit critical and expiring items quickly."}],
            "slug": "mgr-scr-005-hiring-approval-workspace",
            "mobile_title": "Hiring Approvals",
            "mobile_badge": "Hiring",
            "mobile_chips": [{"label": "Urgent", "w": 60, "fill": "#FEF3C7"}, {"label": "Budget", "w": 68, "fill": "#FEE2E2"}, {"label": "Expiry", "w": 60, "fill": "#DBEAFE"}],
            "mobile_search": "Search requisitions, offers, or candidates",
            "mobile_cards": [
                {"title": "Hiring queue summary", "subtitle": "Mobile starts with urgent approvals and blocker counts", "bullets": ["9 approvals pending", "2 items at SLA risk", "1 budget-blocked request", "3 offers nearing expiry"]},
                {"title": "Selected decision cue", "subtitle": "The current approval keeps role need and next step compact", "bullets": ["Role and stage visible first", "Confidential detail remains masked", "Budget variance note shown", "Return requires rationale"], "actions": [{"label": "Approve", "w": 108, "fill": COLORS["blue"]}, {"label": "Return", "w": 108, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Budget and dependency stack", "subtitle": "Business case and downstream routing compress into one lower card", "bullets": ["Compensation variance comment pending", "Internal mobility option available", "Offer expiry dates visible", "Post-approval path explicit"]},
            ],
            "mobile_note": {"label": "Urgent hiring mobile", "detail": "Mobile emphasizes urgent decisions and confidentiality-safe review over full recruiting detail."},
        },
        {
            "title": "Team Leave and Attendance Overview",
            "badge": "Manager",
            "shell": "Team Command Center",
            "nav": ["Dashboard", "People", "Approvals", "Attendance", "Leave", "Mobility"],
            "chips": [{"label": "Under-staffed", "w": 102, "fill": "#FEE2E2"}, {"label": "Late trend", "w": 90, "fill": "#FEF3C7"}, {"label": "Holiday conflict", "w": 116, "fill": "#DBEAFE"}],
            "actions": [{"label": "Review exceptions", "w": 168, "fill": COLORS["blue"]}, {"label": "Open leave calendar", "w": 182, "fill": COLORS["teal"]}],
            "search": "Search employee, shift, leave type, missing punch, or attendance exception",
            "search_chips": [{"label": "Today", "w": 58, "fill": COLORS["soft"]}, {"label": "My directs", "w": 90, "fill": COLORS["soft"]}, {"label": "Exceptions", "w": 98, "fill": COLORS["shell"]}],
            "metrics": [{"title": "On leave", "value": "09", "color": COLORS["green"]}, {"title": "Missing", "value": "06", "color": COLORS["amber"]}, {"title": "Late 7d", "value": "18", "color": COLORS["red"]}, {"title": "Gaps", "value": "03", "color": COLORS["blue"]}, {"title": "Regularize", "value": "11", "color": COLORS["teal"]}],
            "upper_left": {"title": "Daily coverage board", "subtitle": "Team availability by shift, location, and backup depth stays first in the reading order", "bullets": ["Morning shift short by 1 in support", "2 approved leaves overlap in payroll ops", "3 remote punches need review", "Backup coverage available for one pod"]},
            "upper_right": {"title": "Leave conflict and holiday overlay", "subtitle": "Calendar-first planning prevents approval decisions that create team risk", "note_title": "Coverage warning", "note_body": "If minimum staffing is breached, approval may still be possible but must capture alternate coverage or deferment rationale.", "note_footer": "Next step: open the team calendar, compare backup roster, or inspect the exception queue before approving leave.", "note_actions": [{"label": "Open calendar", "w": 146, "fill": COLORS["blue"]}, {"label": "Backup roster", "w": 146, "fill": "#EEF2FF"}, {"label": "Exception queue", "w": 152, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Attendance exception queue", "subtitle": "Late marks, missing punches, and device mismatches remain queue-led rather than analytical", "bullets": ["6 missing punch cases opened today", "2 kiosk punches flagged low confidence", "3 regularizations exceed SLA", "1 geofence exception needs HR ops escalation"]},
            "lower_right": {"title": "Trend and action summary", "subtitle": "Managers read trends only after daily queue risk is understood", "bullets": ["Late marks up 22% week over week", "Absence spike in customer support pod", "Night-shift adherence stable after roster swap", "Policy reminder suggested before recurring Monday leave approval"]},
            "footer": {"title": "Pinned coverage lenses", "subtitle": "Managers can pin daily coverage, holiday, and regularization views for repeat operations", "chips": [{"label": "Today", "w": 56, "fill": "#DCFCE7"}, {"label": "This week", "w": 84, "fill": "#DBEAFE"}, {"label": "Night shift", "w": 96, "fill": "#FEF3C7"}, {"label": "Coverage risk", "w": 112, "fill": "#FEE2E2"}, {"label": "Regularization", "w": 118, "fill": "#EDE9FE"}, {"label": "Holiday", "w": 72, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Coverage before charts", "detail": "The first decision is whether work can still be covered."}, {"label": "Leave and attendance together", "detail": "Approval without attendance context creates avoidable team risk."}, {"label": "Queue before analytics", "detail": "Exception handling outranks passive trend reading."}, {"label": "Calendar conflict is explicit", "detail": "Holiday, blackout, and overlap signals need visible treatment before approval."}, {"label": "Role-safe drill-through", "detail": "Managers see only team-scoped detail and escalate sensitive punch disputes."}, {"label": "Delegation is nearby", "detail": "Coverage delegation belongs beside staffing risk, not hidden elsewhere."}, {"label": "Mobile stays actionable", "detail": "Daily manager work often happens away from desk, so small screens still need real decision support."}],
            "slug": "mgr-scr-006-team-leave-and-attendance-overview",
            "mobile_title": "Team Leave and Attendance",
            "mobile_badge": "Manager",
            "mobile_chips": [{"label": "Leave 09", "w": 74, "fill": "#DBEAFE"}, {"label": "Late 18", "w": 76, "fill": "#FEF3C7"}, {"label": "Gaps 03", "w": 78, "fill": "#FEE2E2"}],
            "mobile_search": "Search employee, leave, punch, or coverage issue",
            "mobile_cards": [
                {"title": "Coverage and exceptions", "subtitle": "Daily risk stays first on mobile", "bullets": ["Morning shift short by 1", "6 missing punches open", "2 overlapping leaves in support", "1 blackout request needs note"], "actions": [{"label": "Review exceptions", "w": 156, "fill": COLORS["blue"]}, {"label": "Open calendar", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Leave conflict stack", "subtitle": "Holiday and overlap cues stay reviewable", "bullets": ["Optional holiday impacts 4 requests", "Coverage floor breached in finance", "Backup roster exists", "One defer-or-approve decision due today"]},
                {"title": "Trend and regularization stack", "subtitle": "Operational follow-up compresses into one summary", "bullets": ["Late marks up 22%", "3 regularizations exceed SLA", "1 geofence case needs HR ops", "Night-shift adherence stable"]},
            ],
            "mobile_note": {"label": "Coverage-ready mobile", "detail": "Mobile preserves exception handling, leave conflict review, and coverage decisions rather than collapsing into summary-only status."},
        },
        {
            "title": "Mobility Proposal Workspace",
            "badge": "Manager",
            "shell": "Team Command Center",
            "nav": ["Dashboard", "People", "Approvals", "Attendance", "Hiring", "Mobility"],
            "chips": [{"label": "Draft 9", "w": 74, "fill": "#DBEAFE"}, {"label": "Budget impact", "w": 110, "fill": "#FEF3C7"}, {"label": "Blockers 2", "w": 96, "fill": "#FEE2E2"}],
            "actions": [{"label": "Create proposal", "w": 162, "fill": COLORS["blue"]}, {"label": "Submit for approval", "w": 188, "fill": COLORS["teal"]}],
            "search": "Search employee, proposal id, target role, approver, or effective date",
            "search_chips": [{"label": "Promotion", "w": 88, "fill": COLORS["soft"]}, {"label": "Transfer", "w": 78, "fill": COLORS["soft"]}, {"label": "Awaiting approval", "w": 128, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Drafts", "value": "09", "color": COLORS["green"]}, {"title": "Under app", "value": "05", "color": COLORS["amber"]}, {"title": "Effective", "value": "04", "color": COLORS["red"]}, {"title": "Budget ex", "value": "03", "color": COLORS["blue"]}, {"title": "Pos block", "value": "02", "color": COLORS["teal"]}],
            "upper_left": {"title": "Current vs proposed assignment", "subtitle": "Desktop keeps side-by-side structure, manager, grade, and location comparison in one plane", "bullets": ["Senior Analyst proposed to Lead Analyst", "Manager change visible in compare", "L4 to L5 triggers compensation review", "Effective date requested for 01 Aug with overlap plan"]},
            "upper_right": {"title": "Impact and approval route", "subtitle": "Route, budget, and vacancy readiness must be understood before submit", "note_title": "Route and budget cue", "note_body": "If the target position is unavailable or budget is exceeded, submit remains possible only with exception rationale and a broader approval route.", "note_footer": "Next step: review route, inspect position availability, or hold the proposal till downstream dependencies clear.", "note_actions": [{"label": "Review route", "w": 132, "fill": COLORS["blue"]}, {"label": "Open vacancy", "w": 134, "fill": "#EEF2FF"}, {"label": "Dependency list", "w": 144, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Readiness and dependency checks", "subtitle": "Proposal quality depends on prerequisites outside the movement form itself", "bullets": ["Destination cost center validated", "Payroll cutoff warning if date slips", "Employee acknowledgment required", "Access reprovisioning task auto-creates after approval"]},
            "lower_right": {"title": "Timeline, evidence, and related cases", "subtitle": "Mobility sits beside promotion, compensation, and workforce-planning history", "bullets": ["1 prior transfer completed last year", "Performance rating supports promotion path", "Succession note marks employee as ready-now", "Linked salary revision case still draft"]},
            "footer": {"title": "Pinned mobility lenses", "subtitle": "Managers can pin compare, budget, vacancy, and HRBP-dependent views for repeat proposal work", "chips": [{"label": "Engineering", "w": 92, "fill": "#DCFCE7"}, {"label": "Cross-city", "w": 92, "fill": "#DBEAFE"}, {"label": "L4-L5", "w": 72, "fill": "#FEF3C7"}, {"label": "Budget risk", "w": 98, "fill": "#FEE2E2"}, {"label": "Vacancy", "w": 76, "fill": "#EDE9FE"}, {"label": "Needs HRBP", "w": 96, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Compare is the main work", "detail": "Managers need source and target assignment visible together."}, {"label": "Impact before submit", "detail": "Budget, payroll, and provisioning consequences should appear upstream of routing."}, {"label": "Route is never hidden", "detail": "Approval ownership and exception expansion must remain visible."}, {"label": "Position readiness is explicit", "detail": "Mobility cannot assume target vacancy or position validity."}, {"label": "Compensation dependency stays close", "detail": "Grade-changing moves must show salary implications nearby."}, {"label": "History supports fairness", "detail": "Prior moves and performance context help explain why the proposal exists."}, {"label": "Mobile is review-first", "detail": "Small screens support route and blocker handling while dense compare stays desktop-first."}],
            "slug": "mgr-scr-007-mobility-proposal-workspace",
            "mobile_title": "Mobility Proposal",
            "mobile_badge": "Manager",
            "mobile_chips": [{"label": "Draft 09", "w": 76, "fill": "#DBEAFE"}, {"label": "Route 05", "w": 72, "fill": "#FEF3C7"}, {"label": "Block 02", "w": 76, "fill": "#FEE2E2"}],
            "mobile_search": "Search employee, proposal, role, or blocker",
            "mobile_cards": [
                {"title": "Proposal snapshot", "subtitle": "Current and target state compress into one stack", "bullets": ["Senior Analyst to Lead Analyst", "L4 to L5 grade change", "01 Aug effective date requested", "Target vacancy linked"], "actions": [{"label": "Review draft", "w": 138, "fill": COLORS["blue"]}, {"label": "Submit", "w": 108, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Impact and route warning", "subtitle": "Budget and approval logic stay visible on mobile", "bullets": ["Compensation approval required", "Finance step added for budget exception", "Payroll cutoff risk if date shifts", "Employee acknowledgment pending"]},
                {"title": "Dependency and evidence stack", "subtitle": "Prerequisites replace dense compare views", "bullets": ["Destination cost center validated", "Access reprovisioning auto-creates", "Prior transfer history available", "Salary revision still draft"]},
            ],
            "mobile_note": {"label": "Route-safe mobile", "detail": "Mobile preserves proposal review, route clarity, and blocker handling while full side-by-side comparison remains desktop-led."},
        },
        {
            "title": "Employee Master Workbench",
            "badge": "HR Ops",
            "shell": "People Operations Hub",
            "nav": ["Workbench", "Lifecycle", "Onboarding", "Documents", "Exceptions", "Audit"],
            "chips": [{"label": "Duplicates 14", "w": 104, "fill": "#FEE2E2"}, {"label": "Bulk batch", "w": 92, "fill": "#DBEAFE"}, {"label": "Masked IDs", "w": 92, "fill": "#FEF3C7"}],
            "actions": [{"label": "Create employee", "w": 160, "fill": COLORS["blue"]}, {"label": "Review duplicates", "w": 174, "fill": COLORS["teal"]}],
            "search": "Search employee, person id, manager, legal entity, or duplicate clue",
            "search_chips": [{"label": "Active", "w": 62, "fill": COLORS["soft"]}, {"label": "Joiners", "w": 68, "fill": COLORS["soft"]}, {"label": "Masked", "w": 66, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Workers", "value": "24.8k", "color": COLORS["green"]}, {"title": "Dupes", "value": "14", "color": COLORS["amber"]}, {"title": "Sensitive", "value": "07", "color": COLORS["red"]}, {"title": "Org 7d", "value": "31", "color": COLORS["blue"]}, {"title": "Sync ex", "value": "05", "color": COLORS["teal"]}],
            "upper_left": {"title": "Employee master grid", "subtitle": "Dense roster scanning, source ownership, and status review start the workbench", "bullets": ["284 records in current filter", "3 future-dated manager changes scheduled", "2 import-created workers need review", "1 active worker still mapped to inactive manager"]},
            "upper_right": {"title": "Selected employee profile and mask state", "subtitle": "Authoritative, editable, derived, and synchronized attributes stay distinguishable", "note_title": "Governed reveal", "note_body": "Reveal and edit actions must respect field ownership, masking policy, and effective-dated history rather than acting like destructive overwrite.", "note_footer": "Next step: open the full profile, reveal authorized fields, or resolve duplicate and source conflicts first.", "note_actions": [{"label": "Open profile", "w": 132, "fill": COLORS["blue"]}, {"label": "Reveal fields", "w": 136, "fill": "#EEF2FF"}, {"label": "View lineage", "w": 124, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Duplicate and bulk update queue", "subtitle": "Identity hygiene and controlled high-volume changes belong in the same console", "bullets": ["14 likely duplicate matches need adjudication", "Bulk batch limited to cost center and manager remap", "2 records blocked by protected-field differences", "Rehire candidate matched to prior history"]},
            "lower_right": {"title": "Downstream impact and audit timeline", "subtitle": "Employee-master actions are safe only when consumers and history remain visible", "bullets": ["Leave, attendance, and payroll consumers will receive events", "Timeline shows create, import, correction, and manager-change lineage", "1 sensitive-field approval blocks final save", "Cross-system person id mismatch flagged"]},
            "footer": {"title": "Pinned master-data lenses", "subtitle": "HR operations can pin duplicate, manager-change, import-batch, and masked-ID views for repeat maintenance", "chips": [{"label": "New joiners", "w": 92, "fill": "#DCFCE7"}, {"label": "Duplicate risk", "w": 104, "fill": "#DBEAFE"}, {"label": "Manager changes", "w": 122, "fill": "#FEF3C7"}, {"label": "Payroll impact", "w": 112, "fill": "#FEE2E2"}, {"label": "Masked IDs", "w": 98, "fill": "#EDE9FE"}, {"label": "Import batch", "w": 104, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Source-of-truth workbench", "detail": "HR ops starts from roster density, not isolated record detail."}, {"label": "Field-state clarity", "detail": "Authoritative, editable, derived, and synchronized values must look different."}, {"label": "Mask by default", "detail": "Sensitive IDs stay hidden until reveal is authorized."}, {"label": "Duplicates surface early", "detail": "Identity conflict handling should appear before record creation and bulk updates."}, {"label": "History over overwrite", "detail": "Effective-dated lineage matters wherever payroll or approval outcomes change."}, {"label": "Bulk edit stays governed", "detail": "High-volume changes need scope and protected-field warnings nearby."}, {"label": "Mobile is triage-first", "detail": "Small screens support review and follow-up while dense grids remain desktop-only."}],
            "slug": "hro-scr-001-employee-master-workbench",
            "mobile_title": "Employee Master",
            "mobile_badge": "HR Ops",
            "mobile_chips": [{"label": "24.8k", "w": 58, "fill": "#DBEAFE"}, {"label": "Dupes 14", "w": 82, "fill": "#FEE2E2"}, {"label": "Mask 07", "w": 78, "fill": "#FEF3C7"}],
            "mobile_search": "Search employee, id, manager, or duplicate clue",
            "mobile_cards": [
                {"title": "Priority records", "subtitle": "Triage replaces dense grid scanning on mobile", "bullets": ["2 import-created workers need review", "1 inactive-manager mapping found", "3 future-dated manager changes", "7 sensitive changes pending"], "actions": [{"label": "Open queue", "w": 126, "fill": COLORS["blue"]}, {"label": "Review dupes", "w": 136, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Selected employee snapshot", "subtitle": "Profile state stays readable without full desktop density", "bullets": ["Active assignment with 2 history changes", "National ID masked by default", "Payroll-owned fields locked", "Current change impacts approvals and leave"]},
                {"title": "Duplicate and audit stack", "subtitle": "Identity hygiene and lineage remain visible on reduced mobile", "bullets": ["14 duplicate matches pending", "Rehire matched to prior history", "1 sensitive-field approval blocks save", "Cross-system person mismatch flagged"]},
            ],
            "mobile_note": {"label": "Triage-safe mobile", "detail": "Mobile preserves duplicate handling, mask-state review, and follow-up without pretending to support dense master-grid work."},
        },
        {
            "title": "Lifecycle Change Workbench",
            "badge": "HR Ops",
            "shell": "People Operations Hub",
            "nav": ["Workbench", "Lifecycle", "Onboarding", "Documents", "Exceptions", "Audit"],
            "chips": [{"label": "Effective soon", "w": 102, "fill": "#DBEAFE"}, {"label": "Approval 11", "w": 96, "fill": "#FEF3C7"}, {"label": "Blocked 4", "w": 84, "fill": "#FEE2E2"}],
            "actions": [{"label": "Create lifecycle case", "w": 188, "fill": COLORS["blue"]}, {"label": "Run pre-effective checks", "w": 214, "fill": COLORS["teal"]}],
            "search": "Search employee, lifecycle case, effective date, approver, or blocker",
            "search_chips": [{"label": "This week", "w": 82, "fill": COLORS["soft"]}, {"label": "Promotion", "w": 84, "fill": COLORS["soft"]}, {"label": "Payroll impact", "w": 108, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Cases", "value": "32", "color": COLORS["green"]}, {"title": "Pending", "value": "11", "color": COLORS["amber"]}, {"title": "Week", "value": "08", "color": COLORS["red"]}, {"title": "Blocked", "value": "04", "color": COLORS["blue"]}, {"title": "Payroll ok", "value": "19", "color": COLORS["teal"]}],
            "upper_left": {"title": "Lifecycle case queue", "subtitle": "Queue unifies confirmation, promotion, transfer, and salary-linked cases", "bullets": ["3 probation confirmations due in 7 days", "4 movement cases await approver action", "2 salary revisions approved but unpublished", "1 intercompany transfer lacks destination prerequisites"]},
            "upper_right": {"title": "Selected case impact and route", "subtitle": "Effective date, route, and downstream consequences belong in one decision panel", "note_title": "Dependency cue", "note_body": "Blocked dependencies should show whether the case waits on approval, destination setup, payroll timing, or employee acknowledgment.", "note_footer": "Next step: review route, open dependency checklist, or hold the case until timing and evidence align.", "note_actions": [{"label": "Review route", "w": 132, "fill": COLORS["blue"]}, {"label": "Checklist", "w": 116, "fill": "#EEF2FF"}, {"label": "Timeline", "w": 112, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Effective-date calendar and checks", "subtitle": "Timing control is a first-class lifecycle concern, not a footer detail", "bullets": ["8 actions become effective this week", "2 cases need employee acknowledgment", "1 probation extension missing evidence", "Retro salary outcome requires payroll review flag"]},
            "lower_right": {"title": "Downstream completion and communication", "subtitle": "A lifecycle action is only done when all consumers finish", "bullets": ["3 access reprovisioning tasks still open", "2 compensation letters ready for release", "1 payroll publish failure needs rerun", "Employee communication draft prepared"]},
            "footer": {"title": "Pinned lifecycle lenses", "subtitle": "HR operations can pin confirmation, transfer, salary, and blocked-case views for daily management", "chips": [{"label": "This week", "w": 78, "fill": "#DCFCE7"}, {"label": "Confirmation", "w": 102, "fill": "#DBEAFE"}, {"label": "Transfer", "w": 78, "fill": "#FEF3C7"}, {"label": "Salary revision", "w": 112, "fill": "#FEE2E2"}, {"label": "Cross-entity", "w": 102, "fill": "#EDE9FE"}, {"label": "Blocked", "w": 68, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Queue-first operations", "detail": "HR operations begins from action queues, not static reporting."}, {"label": "Effective date is control", "detail": "Timing governs payroll, access, benefits, and routing."}, {"label": "Route and blockers together", "detail": "Approval debt and dependency debt are separate and both matter."}, {"label": "Downstream completion matters", "detail": "Approved cases still track payroll, provisioning, and communication."}, {"label": "Maker-checker remains obvious", "detail": "Initiator, approver, and executor may all be different actors."}, {"label": "Lifecycle types share a frame", "detail": "Confirmation, movement, and salary-linked actions coexist in daily HR ops."}, {"label": "Mobile is review-first", "detail": "Small screens keep triage and blocker escalation possible while orchestration stays desktop-heavy."}],
            "slug": "hro-scr-002-lifecycle-change-workbench",
            "mobile_title": "Lifecycle Change",
            "mobile_badge": "HR Ops",
            "mobile_chips": [{"label": "Cases 32", "w": 78, "fill": "#DBEAFE"}, {"label": "Pending 11", "w": 92, "fill": "#FEF3C7"}, {"label": "Block 04", "w": 82, "fill": "#FEE2E2"}],
            "mobile_search": "Search case, employee, date, or blocker",
            "mobile_cards": [
                {"title": "Priority lifecycle cases", "subtitle": "Urgent effective-date work stays first on mobile", "bullets": ["3 confirmations due within 7 days", "4 movement approvals pending", "2 approved salary revisions unpublished", "1 cross-entity transfer blocked"], "actions": [{"label": "Open queue", "w": 126, "fill": COLORS["blue"]}, {"label": "Run checks", "w": 122, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Selected case impact", "subtitle": "Route and payroll timing stay readable on reduced mobile", "bullets": ["Promotion plus location transfer", "HRBP, comp, and finance approvals", "Payroll cutoff risk after 25 Jul", "Provisioning task auto-creates"]},
                {"title": "Dependency and downstream stack", "subtitle": "Completion signals replace dense desktop orchestration", "bullets": ["2 employee acknowledgments pending", "1 probation evidence gap", "3 access tasks still open", "1 payroll publish rerun needed"]},
            ],
            "mobile_note": {"label": "Workflow-safe mobile", "detail": "Mobile preserves case review, effective-date awareness, and blocker escalation while dense orchestration stays desktop-led."},
        },
        {
            "title": "Onboarding and Preboarding Console",
            "badge": "Joiners",
            "shell": "People Operations Hub",
            "nav": ["HR Home", "People Ops", "Joiners", "Documents", "Exceptions", "Reports"],
            "chips": [{"label": "Preboarding", "w": 96, "fill": "#DBEAFE"}, {"label": "Blocked", "w": 74, "fill": "#FEE2E2"}, {"label": "Ready", "w": 62, "fill": "#DCFCE7"}],
            "actions": [{"label": "Create joiner case", "w": 176, "fill": COLORS["blue"]}, {"label": "Promote ready case", "w": 182, "fill": COLORS["teal"]}],
            "search": "Search joiner, requisition, offer, joining date, location, or blocker within authorized scope",
            "search_chips": [{"label": "Due in 7 days", "w": 110, "fill": COLORS["soft"]}, {"label": "Docs pending", "w": 104, "fill": COLORS["soft"]}, {"label": "Activate", "w": 72, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Due 7d", "value": "18", "color": COLORS["green"]}, {"title": "At risk", "value": "06", "color": COLORS["amber"]}, {"title": "Docs", "value": "11", "color": COLORS["red"]}, {"title": "Prov block", "value": "05", "color": COLORS["blue"]}, {"title": "Ready", "value": "07", "color": COLORS["teal"]}],
            "upper_left": {"title": "Joiner readiness board", "subtitle": "Date-driven queue grouped by stage, risk, and upcoming join date", "bullets": ["Preboarding and onboarding share one rail", "Upcoming joiners clustered by date and location", "At-risk cases surface missing blockers first", "Deferred, withdrawn, and no-show states remain visible"]},
            "upper_right": {"title": "Activation gate and blocker triage", "subtitle": "Mandatory tasks, documents, and dependent teams must clear before activation", "note_title": "Need-to-know masking", "note_body": "Offer and compensation detail stays masked for non-authorized roles while overrides and join-date changes remain auditable.", "note_footer": "Next step: open blockers, reassign an owner, promote a ready case, or activate only after gates clear.", "note_actions": [{"label": "Open blockers", "w": 146, "fill": COLORS["blue"]}, {"label": "Reassign", "w": 122, "fill": "#EEF2FF"}, {"label": "Activate", "w": 112, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Checklist and owner backlog", "subtitle": "Operational load across HR, manager, payroll, IT, security, and facilities", "bullets": ["Task backlog grouped by owner group", "Overdue items highlighted above informational tasks", "Rejected documents return with reason codes", "Manager-unassigned cases visible as blockers"]},
            "lower_right": {"title": "Document and provisioning dependency tracker", "subtitle": "Readiness depends on linked evidence and downstream requests, not task counts alone", "bullets": ["Identity, tax, bank, and contract evidence linked", "Provisioning tickets show pending to done", "Background verification can block or warn", "Every case keeps source-offer linkage and history"]},
            "footer": {"title": "Pinned joiner lenses", "subtitle": "HR operations can pin due-date, blocked, document, and provisioning views for repeat onboarding work", "chips": [{"label": "Today", "w": 56, "fill": "#DCFCE7"}, {"label": "7 Days", "w": 70, "fill": "#DBEAFE"}, {"label": "Blocked", "w": 72, "fill": "#FEF3C7"}, {"label": "Documents", "w": 92, "fill": "#FEE2E2"}, {"label": "Provisioning", "w": 98, "fill": "#EDE9FE"}, {"label": "Ready", "w": 60, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Date-first triage", "detail": "HR operations should read by upcoming join date before browsing cases."}, {"label": "Preboard to onboard continuity", "detail": "One console prevents handoff gaps between accepted offer and active employee."}, {"label": "Blockers outrank volume", "detail": "Risk and prerequisites matter more than total task count."}, {"label": "Need-to-know masking", "detail": "Offer and compensation context should remain limited to authorized roles."}, {"label": "Activation is gated", "detail": "Ready-looking cases still cannot activate until mandatory steps clear."}, {"label": "Tenant-only business plane", "detail": "The shell must stay inside customer HR operations, not provider admin."}, {"label": "Mobile favors urgency", "detail": "Small screens should surface due-today, blocked, and reminder actions first."}],
            "slug": "hro-scr-003-onboarding-preboarding-console",
            "mobile_title": "Joiner Console",
            "mobile_badge": "Joiners",
            "mobile_chips": [{"label": "Due 7d", "w": 70, "fill": "#DBEAFE"}, {"label": "Blocked", "w": 72, "fill": "#FEE2E2"}, {"label": "Ready", "w": 60, "fill": "#DCFCE7"}],
            "mobile_search": "Search joiner, date, location, or blocker",
            "mobile_cards": [
                {"title": "Readiness summary", "subtitle": "Mobile starts with due, risk, and activation readiness", "bullets": ["Due in 7 days", "At-risk cases", "Ready to activate", "Join-date changes visible"]},
                {"title": "Priority blocker list", "subtitle": "Blockers and owner gaps remain one tap away", "bullets": ["Missing docs", "Payroll cut-off risk", "Provisioning hold", "Manager not assigned"], "actions": [{"label": "Open blockers", "w": 146, "fill": COLORS["blue"]}, {"label": "Send reminder", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Today actions", "subtitle": "Urgent owner actions compress into one stack", "bullets": ["Reassign owner", "Promote ready case", "Send reminder", "Open source-offer history"]},
            ],
            "mobile_note": {"label": "Urgent-first mobile", "detail": "Mobile keeps triage and nudges fast while dense dependency review stays desktop-led."},
        },
        {
            "title": "Employee Document Verification Queue",
            "badge": "Verify",
            "shell": "People Operations Hub",
            "nav": ["HR Home", "People Ops", "Documents", "Verification Queue", "Retention", "Reports"],
            "chips": [{"label": "Pending", "w": 70, "fill": "#FEF3C7"}, {"label": "Restricted", "w": 86, "fill": "#DBEAFE"}, {"label": "OCR flags", "w": 82, "fill": "#FEE2E2"}],
            "actions": [{"label": "Verify document", "w": 168, "fill": COLORS["blue"]}, {"label": "Request reupload", "w": 172, "fill": COLORS["teal"]}],
            "search": "Search employee, document type, case, expiry, verifier, or integrity issue within authorized scope",
            "search_chips": [{"label": "Pending", "w": 70, "fill": COLORS["soft"]}, {"label": "Expiring", "w": 82, "fill": COLORS["soft"]}, {"label": "Restricted", "w": 88, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Pending", "value": "26", "color": COLORS["green"]}, {"title": "Rejected", "value": "05", "color": COLORS["amber"]}, {"title": "Exp 30d", "value": "08", "color": COLORS["red"]}, {"title": "Restricted", "value": "11", "color": COLORS["blue"]}, {"title": "Quality", "value": "07", "color": COLORS["teal"]}],
            "upper_left": {"title": "Verification queue and category mix", "subtitle": "Review workload grouped by process, type, owner, and urgency", "bullets": ["Pending items split by onboarding, profile change, payroll, and exit", "Identity, tax, bank, contract, and compliance filters separated", "Expired mandatory documents stay above routine review", "Restricted rows keep access-state indicators visible"]},
            "upper_right": {"title": "Preview, metadata, and decision rail", "subtitle": "Reviewers need the file, extracted metadata, and decision controls in one surface", "note_title": "Restricted preview", "note_body": "Restricted categories may use watermark-only preview or block raw download, and every verify, reject, and replace action is audited.", "note_footer": "Next step: verify, reject with reason, request reupload, or inspect version history without leaving the queue.", "note_actions": [{"label": "Verify", "w": 102, "fill": COLORS["blue"]}, {"label": "Reject", "w": 98, "fill": "#EEF2FF"}, {"label": "Version history", "w": 148, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Risk, retention, and workload signals", "subtitle": "Queue health depends on verification speed and governed storage handling", "bullets": ["Expired mandatory documents raise alerts", "Unreadable scans and OCR mismatch cluster separately", "Near-purge and legal-hold states remain visible", "Workload segmented by verifier and process"]},
            "lower_right": {"title": "Version lineage and case context", "subtitle": "Replacement, supersession, and process linkage must stay traceable", "bullets": ["Replacement preserves immutable prior versions", "Case links connect to onboarding and change workflows", "Checksum and storage-reference changes visible to auditors", "Timeline entry opens from the same review surface"]},
            "footer": {"title": "Pinned verification lenses", "subtitle": "HR operations can pin pending, restricted, OCR-flag, and retention views for repeat review work", "chips": [{"label": "Pending", "w": 70, "fill": "#DCFCE7"}, {"label": "Rejected", "w": 76, "fill": "#DBEAFE"}, {"label": "Expiring", "w": 82, "fill": "#FEF3C7"}, {"label": "Restricted", "w": 88, "fill": "#FEE2E2"}, {"label": "OCR flag", "w": 82, "fill": "#EDE9FE"}, {"label": "Retention", "w": 82, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Queue before repository", "detail": "This screen is for operational verification, not broad file browsing."}, {"label": "Preview beside decision", "detail": "Reviewers should compare content and action in one place."}, {"label": "Restricted download behavior", "detail": "Sensitive categories need clear watermark or blocked-download states."}, {"label": "Version lineage is immutable", "detail": "Replacement should never erase prior evidence."}, {"label": "Integrity signals stay visible", "detail": "Malware, checksum, and unreadable-file warnings belong in the main plane."}, {"label": "Reason-coded rejection", "detail": "Structured rejection reasons improve reupload quality."}, {"label": "Mobile compresses preview", "detail": "Small screens should support decisions and summary metadata, not full viewers."}],
            "slug": "hro-scr-004-employee-document-verification-queue",
            "mobile_title": "Doc Verify Queue",
            "mobile_badge": "Verify",
            "mobile_chips": [{"label": "Pending", "w": 66, "fill": "#FEF3C7"}, {"label": "Expiring", "w": 80, "fill": "#DBEAFE"}, {"label": "Restricted", "w": 86, "fill": "#FEE2E2"}],
            "mobile_search": "Search employee, doc type, case, or expiry",
            "mobile_cards": [
                {"title": "Queue summary", "subtitle": "Mobile starts with pending, rejected, and expiring work", "bullets": ["Pending verify count", "Rejected today count", "Expiring soon list", "Restricted items visible"]},
                {"title": "Selected document", "subtitle": "Preview snapshot and decision actions stay compact", "bullets": ["Preview snapshot", "Category and case link", "Verify or reject path", "Version history accessible"], "actions": [{"label": "Verify", "w": 102, "fill": COLORS["blue"]}, {"label": "Reject", "w": 102, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Risk watch", "subtitle": "Restricted docs and quality signals compress into one stack", "bullets": ["Restricted docs", "Unreadable scans", "Retention alerts", "Integrity flags"]},
            ],
            "mobile_note": {"label": "Decision-first mobile", "detail": "Mobile supports quick verify or reject workflows while deeper inspection remains on desktop."},
        },
        {
            "title": "Data Correction and Exception Queue",
            "badge": "Exceptions",
            "shell": "People Operations Hub",
            "nav": ["HR Home", "People Ops", "Exceptions", "People Data", "Approvals", "Reports"],
            "chips": [{"label": "Needs review", "w": 94, "fill": "#FEF3C7"}, {"label": "Payroll-aware", "w": 102, "fill": "#FEE2E2"}, {"label": "Masked compare", "w": 112, "fill": "#DBEAFE"}],
            "actions": [{"label": "Open exception", "w": 152, "fill": COLORS["blue"]}, {"label": "Route for approval", "w": 180, "fill": COLORS["teal"]}],
            "search": "Search employee, field, exception code, source system, case, or payroll impact within authorized scope",
            "search_chips": [{"label": "Pending approval", "w": 116, "fill": COLORS["soft"]}, {"label": "Backdated", "w": 88, "fill": COLORS["soft"]}, {"label": "Payroll impact", "w": 106, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Open", "value": "22", "color": COLORS["green"]}, {"title": "Payroll", "value": "07", "color": COLORS["amber"]}, {"title": "Backdated", "value": "05", "color": COLORS["red"]}, {"title": "Overdue", "value": "04", "color": COLORS["blue"]}, {"title": "Dup risk", "value": "06", "color": COLORS["teal"]}],
            "upper_left": {"title": "Exception queue and category stack", "subtitle": "One queue for personal, employment, master-data, and source-sync issues", "bullets": ["Rows grouped by exception code and severity", "Personal-data errors distinct from employment conflicts", "Duplicate-candidate and invalid-contact clusters separated", "Integration-origin exceptions show source and retry state"]},
            "upper_right": {"title": "Before-after compare and action rail", "subtitle": "Current, proposed, and policy state must be visible before any correction decision", "note_title": "Masked compare", "note_body": "Masked values remain masked unless reveal is authorized, while backdated and payroll-impacting updates require explicit approval and audit lineage.", "note_footer": "Next step: open evidence, route approval, send back, or escalate payroll impact before any correction is applied.", "note_actions": [{"label": "Open evidence", "w": 144, "fill": COLORS["blue"]}, {"label": "Approve route", "w": 144, "fill": "#EEF2FF"}, {"label": "Escalate payroll", "w": 156, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Root-cause and trend panel", "subtitle": "Operations teams need to spot recurring quality problems, not only clear single records", "bullets": ["Invalid contact patterns trend by unit", "Manager-assignment anomalies grouped separately", "Duplicate-record clusters show likely source channel", "Import or integration spikes easy to isolate"]},
            "lower_right": {"title": "Downstream impact and history", "subtitle": "Correction safety depends on knowing payroll, reporting, and timeline effects before apply", "bullets": ["Payroll and reporting impact badges sit above chronology", "Future-dated conflicts and overlaps remain visible", "Audit log captures field-level changes and masked views", "Employee timeline and linked cases one click away"]},
            "footer": {"title": "Pinned exception lenses", "subtitle": "HR operations can pin payroll, backdated, personal-data, and duplicate-risk views for repeat exception handling", "chips": [{"label": "Payroll impact", "w": 108, "fill": "#DCFCE7"}, {"label": "Backdated", "w": 88, "fill": "#DBEAFE"}, {"label": "Personal data", "w": 104, "fill": "#FEF3C7"}, {"label": "Employment", "w": 92, "fill": "#FEE2E2"}, {"label": "Duplicate risk", "w": 108, "fill": "#EDE9FE"}, {"label": "Awaiting evidence", "w": 128, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Queue not overwrite", "detail": "Sensitive corrections should route through governed exception handling."}, {"label": "Evidence stays attached", "detail": "Attachments and reasons need to stay beside the decision."}, {"label": "Masked compare is mandatory", "detail": "Comparison views must preserve masking and reveal rules."}, {"label": "Effective dates matter", "detail": "Backdated and future-dated changes need conflict cues before approval."}, {"label": "Downstream impact is explicit", "detail": "Payroll, reporting, and timeline effects should appear before commit."}, {"label": "Disabled actions explain why", "detail": "Policy or privacy blocks should be explained, not silently hidden."}, {"label": "Mobile is approval-first", "detail": "Small screens should focus on triage, evidence review, and escalation."}],
            "slug": "hro-scr-005-data-correction-and-exception-queue",
            "mobile_title": "Correction Queue",
            "mobile_badge": "Exceptions",
            "mobile_chips": [{"label": "Open", "w": 54, "fill": "#DBEAFE"}, {"label": "Payroll", "w": 68, "fill": "#FEE2E2"}, {"label": "Backdated", "w": 82, "fill": "#FEF3C7"}],
            "mobile_search": "Search employee, field, case, or impact",
            "mobile_cards": [
                {"title": "Priority exceptions", "subtitle": "Mobile starts with open, payroll-impact, and overdue approval work", "bullets": ["Open exceptions", "Payroll impact", "Overdue approvals", "Backdated cases visible"]},
                {"title": "Selected case", "subtitle": "Before-after summary and evidence stay compact", "bullets": ["Before-after summary", "Evidence attached", "Approval state visible", "Policy explains unavailable actions"], "actions": [{"label": "Open evidence", "w": 142, "fill": COLORS["blue"]}, {"label": "Escalate", "w": 118, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Impact watch", "subtitle": "Downstream risk and root-cause trend compress into one stack", "bullets": ["Backdated changes", "Duplicate risk", "Integration conflict", "Timeline impact visible"]},
            ],
            "mobile_note": {"label": "Escalation-safe mobile", "detail": "Mobile supports safe triage and approval routing while dense field comparison remains desktop-led."},
        },
        {
            "title": "Employee Profile Summary",
            "badge": "Profile",
            "shell": "People Home",
            "nav": ["People Home", "Employees", "Profile", "Documents", "Timeline", "Cases"],
            "chips": [{"label": "Active record", "w": 92, "fill": "#DCFCE7"}, {"label": "Masked default", "w": 110, "fill": "#DBEAFE"}, {"label": "Pending changes", "w": 112, "fill": "#FEF3C7"}],
            "actions": [{"label": "Open timeline", "w": 146, "fill": COLORS["blue"]}, {"label": "Start change request", "w": 186, "fill": COLORS["teal"]}],
            "search": "Search employee ID, name, manager, entity, or case ID within authorized scope",
            "search_chips": [{"label": "Active", "w": 60, "fill": COLORS["soft"]}, {"label": "Future-dated", "w": 104, "fill": COLORS["soft"]}, {"label": "Restricted", "w": 84, "fill": COLORS["shell"]}],
            "metrics": [{"title": "Complete", "value": "92%", "color": COLORS["green"]}, {"title": "Open req", "value": "03", "color": COLORS["amber"]}, {"title": "Docs ok", "value": "14/16", "color": COLORS["red"]}, {"title": "Future", "value": "02", "color": COLORS["blue"]}, {"title": "Restricted", "value": "04", "color": COLORS["teal"]}],
            "upper_left": {"title": "Identity and employment snapshot", "subtitle": "Single-screen summary of who the employee is, where they sit, and which state applies now", "bullets": ["Employee code, preferred name, and status lead", "Legal entity, department, manager, and location visible", "Service dates and assignment markers shown", "Sensitive identifiers masked unless reveal is allowed"]},
            "upper_right": {"title": "Governance, actions, and record health", "subtitle": "Quick actions belong next to trust signals, not hidden below the fold", "note_title": "Governed reveal and export", "note_body": "Reveal, export, and sensitive-field access must remain purpose-aware and auditable, while provider-only tools never appear in the tenant shell.", "note_footer": "Next step: open the timeline, start a correction, open the document center, or request a masked reveal within policy.", "note_actions": [{"label": "Open timeline", "w": 142, "fill": COLORS["blue"]}, {"label": "Start correction", "w": 152, "fill": "#EEF2FF"}, {"label": "Reveal request", "w": 146, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
            "lower_left": {"title": "Completeness and open work", "subtitle": "Operations teams need missing-data and exception signals before browsing every section", "bullets": ["Missing emergency contact highlighted", "Pending personal-data and employment changes grouped", "Expiring mandatory documents visible in summary", "Future-dated changes and approval dependencies easy to spot"]},
            "lower_right": {"title": "Recent activity, documents, and linked cases", "subtitle": "Summary page connects profile state to evidence and chronology", "bullets": ["Recent timeline events show hire, transfer, verification, and approval changes", "Latest document statuses open in context", "Linked onboarding, correction, or exit cases accessible", "Chronology respects event-level visibility rules"]},
            "footer": {"title": "Pinned profile-summary lenses", "subtitle": "HR and managers can pin summary, employment, documents, and timeline views for repeat record reviews", "chips": [{"label": "Summary", "w": 82, "fill": "#DCFCE7"}, {"label": "Personal", "w": 78, "fill": "#DBEAFE"}, {"label": "Employment", "w": 94, "fill": "#FEF3C7"}, {"label": "Documents", "w": 92, "fill": "#FEE2E2"}, {"label": "Timeline", "w": 84, "fill": "#EDE9FE"}, {"label": "Requests", "w": 78, "fill": "#F8FAFC"}]},
            "annotations": [{"label": "Summary before sections", "detail": "The page should establish a trusted current state before deeper profile drill-down."}, {"label": "Masked-by-default PII", "detail": "Identity and contact attributes need visible masking behavior, not silent omission."}, {"label": "Completeness drives action", "detail": "Missing data and pending requests should be more prominent than passive browsing."}, {"label": "Timeline keeps continuity", "detail": "Users need fast drill-through from current state into history."}, {"label": "Role-safe related data", "detail": "Manager, documents, and case links must respect org scope and event visibility."}, {"label": "Governed reveal and export", "detail": "Sensitive access should show approval or audit expectations inline."}, {"label": "Mobile prioritizes health", "detail": "Small screens should surface identity, health, and next actions before dense detail."}],
            "slug": "peo-scr-001-employee-profile-summary",
            "mobile_title": "Employee Profile",
            "mobile_badge": "Profile",
            "mobile_chips": [{"label": "Complete", "w": 70, "fill": "#DCFCE7"}, {"label": "Pending", "w": 66, "fill": "#FEF3C7"}, {"label": "Restricted", "w": 84, "fill": "#DBEAFE"}],
            "mobile_search": "Search employee, manager, or case",
            "mobile_cards": [
                {"title": "Profile snapshot", "subtitle": "Mobile starts with trusted current-state identity and assignment", "bullets": ["Status and worker type", "Manager and location", "Current assignment", "Masked identifiers guarded"]},
                {"title": "Record health", "subtitle": "Missing data and pending work stay easy to spot", "bullets": ["Completeness score", "Pending changes", "Missing critical data", "Future-dated actions visible"], "actions": [{"label": "Open timeline", "w": 136, "fill": COLORS["blue"]}, {"label": "Start change", "w": 136, "fill": "#F8FAFC", "stroke": COLORS["border"]}]},
                {"title": "Next actions", "subtitle": "Documents and linked cases compress into a clean mobile stack", "bullets": ["Open documents", "Linked cases available", "Recent activity visible", "Reveal request governed"]},
            ],
            "mobile_note": {"label": "Health-first mobile", "detail": "Mobile condenses profile detail into snapshot, health, and action stacks without exposing extra sensitive data."},
        },
    ]

    for spec in batch_specs_2:
        render_standard_desktop(spec)
        render_standard_mobile(spec)

    s = desktop_shell("Requisition Workbench", "Recruit", "Demand and Approval Workbench", ["Requisitions", "Approvals", "Posting", "Pipeline", "Aging", "History"])
    s += chip(296, 152, 120, "Open 46", "#DBEAFE")
    s += chip(428, 152, 152, "Approvals 09", "#FEF3C7")
    s += chip(592, 152, 146, "On hold 04", "#FEE2E2")
    s += rect(808, 146, 188, 40, COLORS["blue"], None, 14)
    s += text(902, 172, "inverse", "Review requisition", "middle")
    s += rect(1008, 146, 150, 40, COLORS["teal"], None, 14)
    s += text(1083, 172, "inverse", "Open posting", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search requisition, manager, skill, budget band, approval stage, or aging risk")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 118, "Approval", COLORS["soft"])
    s += chip(1092, 226, 48, "Open", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Open reqs", "46", COLORS["green"]),
        (518, "Awaiting app", "09", COLORS["amber"]),
        (740, "Aging 15d+", "07", COLORS["red"]),
        (962, "Confidential", "05", COLORS["blue"]),
        (1184, "Fill diff", "11", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Demand queue and approval backlog", "Recruiting teams need approval, aging, and posting-readiness context before pipeline browsing")
    s += bullet_list(314, 484, ["9 requisitions awaiting finance or hiring-head approval", "7 requisitions crossed aging threshold without publish", "4 roles paused due to budget freeze", "2 confidential roles have restricted recruiter visibility"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI sourcing and fill-difficulty guidance", "AI can suggest posting strategy and fill difficulty, but publishing remains controlled by recruiting and approvers")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI requisition guidance")
    s += text(684, 522, "body", "The senior data engineer requisition is likely to be hard to fill because location flexibility is low and notice-period requirement is tighter than current market supply.")
    s += text(684, 544, "small", "Suggested next step: widen sourcing mix, compare compensation range, and publish externally after approval chain clears.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review strategy", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open approval path", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Posting readiness and amendment state", "Posting checklist, amendment flow, and demand counters stay near the requisition queue")
    s += bullet_list(314, 774, ["3 requisitions missing JD or interview plan", "1 approved range amendment pending finance sign-off", "Hire counter reached limit for 2 requisitions", "Internal posting first rule active for 5 roles"])
    s += card(648, 712, 510, 220, "Pipeline linkage and history", "Pipeline summary, recruiter assignment, and audit lineage belong in the same hiring-demand workspace")
    s += bullet_list(666, 774, ["12 candidates already linked to ENG-214", "Recruiter reassignment requested for 3 reqs", "Reopened requisition after failed offer yesterday", "Timeline shows publish, hold, and reopen actions"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned requisition lenses", "Recruiters can pin function, urgency, approval, confidentiality, and sourcing-oriented requisition views")
    s += chip(320, 990, 122, "Engineering", "#DCFCE7")
    s += chip(454, 990, 116, "Urgent", "#DBEAFE")
    s += chip(582, 990, 122, "Approval", "#FEF3C7")
    s += chip(716, 990, 138, "Confidential", "#FEE2E2")
    s += chip(866, 990, 116, "External", "#EDE9FE")
    s += chip(994, 990, 114, "Aging", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Demand-first hero strip", "The top actions prioritize requisition review and posting because the core decision is whether demand can safely move into market."),
        (2, "Approval-aware search", "Search follows requisition, manager, stage, and budget concepts rather than later-stage candidate artifacts."),
        (3, "Backlog KPI row", "The KPI strip highlights approval, aging, confidentiality, and fill-difficulty signals before users enter detail."),
        (4, "Queue before pipeline", "The left card keeps demand backlog and approval blockers primary before candidate pipeline curiosity takes over."),
        (5, "Explainable sourcing AI", "AI guidance stays recommendation-led and connects directly to sourcing and approval decisions."),
        (6, "Posting and history together", "Amendments, posting readiness, and reopen history stay in one workbench because they affect the same requisition lifecycle."),
        (7, "Demand triage lenses", "Pinned views reflect how recruiting operations repeatedly slice work by urgency, confidentiality, and approval state."),
    ])
    save("rec-scr-001-requisition-workbench-desktop.svg", s)

    s = mobile_shell("Requisition Workbench", "Recruit")
    s += chip(16, 108, 90, "Open 46", "#DBEAFE")
    s += chip(114, 108, 122, "Approve 9", "#FEF3C7")
    s += chip(244, 108, 130, "Hold 4", "#FEE2E2")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search requisition, manager, stage, or aging")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Demand and approval summary", "Mobile starts with approvals, aging, and hold reasons before posting")
    s += bullet_list(34, 284, ["9 awaiting approval", "7 aging beyond threshold", "4 budget-hold roles", "2 confidential roles restricted"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI sourcing guidance", "Sourcing suggestions stay explainable and publish-safe on mobile")
    s += bullet_list(34, 456, ["Hard-to-fill due to low location flexibility", "Notice period too tight", "Widen sourcing mix", "Publish after chain clears"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review strategy", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open posting", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Posting and pipeline stack", "Checklist, amendments, and linked candidates compress into one mobile summary")
    s += bullet_list(34, 652, ["3 missing JD/interview plan", "1 range amendment pending", "12 linked candidates", "1 requisition reopened"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Demand-safe mobile recruiting", "Mobile preserves approval, aging, and posting-readiness cues before external market actions are taken."),
    ])
    save("rec-scr-001-requisition-workbench-mobile.svg", s)

    s = desktop_shell("Payroll Validation Queue", "Payroll", "Exception and Waiver Workbench", ["Validation", "Exceptions", "Clusters", "Waivers", "Reconciliation", "Audit"])
    s += chip(296, 152, 126, "Open 148", "#DBEAFE")
    s += chip(434, 152, 150, "Blocking 19", "#FEE2E2")
    s += chip(596, 152, 152, "Waivers 06", "#FEF3C7")
    s += rect(808, 146, 182, 40, COLORS["blue"], None, 14)
    s += text(899, 172, "inverse", "Review cluster", "middle")
    s += rect(1002, 146, 156, 40, COLORS["teal"], None, 14)
    s += text(1080, 172, "inverse", "Request waiver", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search rule, employee, cluster, evidence token, owner team, or severity")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 118, "Severity", COLORS["soft"])
    s += chip(1092, 226, 48, "Open", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Open", "148", COLORS["green"]),
        (518, "Blocking", "19", COLORS["red"]),
        (740, "Warnings", "64", COLORS["amber"]),
        (962, "Clusters", "11", COLORS["blue"]),
        (1184, "Reruns", "03", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Prioritized exception queue", "Payroll users need owned clusters and blocking items, not a flat list of rule failures")
    s += bullet_list(314, 484, ["19 blocking results across 11 employees", "Top root cause cluster is missing tax regime data", "6 waiver requests pending approver action", "3 prior passes were invalidated by late source correction"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI triage and root-cause grouping", "AI can cluster related exceptions and suggest likely owner teams, but cannot auto-waive or auto-approve")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI triage note")
    s += text(684, 522, "body", "Twelve open warning rows likely share one upstream attendance import issue and should be assigned to workforce ops instead of payroll processors.")
    s += text(684, 544, "small", "Suggested next step: open cluster evidence, assign ownership, and rerun validation after source correction lands.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Open cluster", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Assign owner", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Waiver and evidence panel", "Waiver rationale, evidence, and scope must remain tightly coupled to the exception set")
    s += bullet_list(314, 774, ["Waiver requires approver, reason, and expiry", "Evidence snapshot tied to frozen run token", "Masked bank detail hidden for non-authorized viewers", "2 warnings already resolved after evidence update"])
    s += card(648, 712, 510, 220, "Rerun, invalidation, and reconciliation", "Late changes, rerun lineage, and control totals belong in the same validation workbench")
    s += bullet_list(666, 774, ["Late bank update invalidated one prior pass", "Control-total delta now within 0.4%", "Rerun lineage visible against parent result set", "1 payroll group still above variance threshold"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned validation lenses", "Payroll teams can pin severity, owner, source system, waiver, and rerun-oriented exception views")
    s += chip(320, 990, 110, "Blocking", "#DCFCE7")
    s += chip(442, 990, 118, "Workforce", "#DBEAFE")
    s += chip(572, 990, 120, "Waiver", "#FEF3C7")
    s += chip(704, 990, 126, "Tax data", "#FEE2E2")
    s += chip(842, 990, 110, "Rerun", "#EDE9FE")
    s += chip(964, 990, 144, "Control total", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Exception-first hero strip", "Top actions center on cluster review and waiver handling because validation is a governance gate, not a passive report."),
        (2, "Evidence-aware search", "Search follows rule, cluster, owner, evidence, and severity artifacts rather than only employee identity."),
        (3, "Severity KPI row", "The first-row metrics keep blocking and rerun risk visible before users attempt closure-oriented actions."),
        (4, "Queue over noise", "The left card compresses many raw failures into owned clusters so the interface stays operationally actionable."),
        (5, "Explainable triage AI", "AI is used to guide assignment and grouping while staying away from waiver or approval authority."),
        (6, "Rerun lineage nearby", "Invalidation, reconciliation, and rerun context remain adjacent because they change the meaning of every open result."),
        (7, "Operations lenses", "Pinned views mirror how payroll processors revisit issues by owner team, source, and severity pattern."),
    ])
    save("pay-scr-003-validation-queue-desktop.svg", s)

    s = mobile_shell("Payroll Validation Queue", "Payroll")
    s += chip(16, 108, 90, "Open 148", "#DBEAFE")
    s += chip(114, 108, 124, "Block 19", "#FEE2E2")
    s += chip(246, 108, 128, "Waiver 6", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search rule, employee, cluster, or severity")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Exception and cluster summary", "Mobile starts with blockers, clusters, and invalidated-pass context")
    s += bullet_list(34, 284, ["19 blocking results", "11 exception clusters", "6 waiver requests pending", "3 invalidated prior passes"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI triage guidance", "Triage cues stay explainable and waiver-safe on mobile")
    s += bullet_list(34, 456, ["12 warnings share attendance issue", "Assign to workforce ops", "Open evidence cluster", "Rerun after correction"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Open cluster", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Request waiver", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Waiver and rerun stack", "Evidence, rerun lineage, and control-total state compress into one mobile summary")
    s += bullet_list(34, 652, ["Waiver needs approver and expiry", "Frozen snapshot token retained", "0.4% control delta", "1 group above threshold"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Governed mobile triage", "Mobile preserves severity, evidence, and rerun cues before any waiver or sign-off action is attempted."),
    ])
    save("pay-scr-003-validation-queue-mobile.svg", s)

    s = desktop_shell("Team Leave Planning", "Leave", "Calendar and Capacity Planning", ["Calendar", "Capacity", "Blackouts", "Festive Season", "Alternates", "History"])
    s += chip(296, 152, 126, "Team out 18", "#DBEAFE")
    s += chip(434, 152, 156, "Risk days 07", "#FEE2E2")
    s += chip(602, 152, 156, "Festive rush", "#FEF3C7")
    s += rect(808, 146, 182, 40, COLORS["blue"], None, 14)
    s += text(899, 172, "inverse", "Review calendar", "middle")
    s += rect(1002, 146, 156, 40, COLORS["teal"], None, 14)
    s += text(1080, 172, "inverse", "Open alternates", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search team, month, location, blackout, critical skill, or capacity risk")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 118, "Calendar", COLORS["soft"])
    s += chip(1092, 226, 48, "Plan", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Absences", "18", COLORS["green"]),
        (518, "Risk days", "07", COLORS["red"]),
        (740, "Blackouts", "03", COLORS["amber"]),
        (962, "Alternates", "12", COLORS["blue"]),
        (1184, "Critical roles", "05", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Calendar hotspots and capacity risk", "Managers need overlap, festive-season concentration, and blackout pressure before approving more leave")
    s += bullet_list(314, 484, ["7 days next month fall below support threshold", "Diwali week has 11 overlapping requests", "3 project blackout windows active", "2 critical-role absences collide in finance close week"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI capacity and alternate suggestion", "AI can summarize absence concentration and suggest substitutes, but planners keep final staffing decisions")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI planning note")
    s += text(684, 522, "body", "Approve two of the Diwali week requests now, defer one to waitlist, and assign trained alternate coverage from pod C to maintain SLA.")
    s += text(684, 544, "small", "Suggested next step: inspect the team heatmap, check blackout policy, and notify alternates before confirming the schedule.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Open heatmap", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "See alternates", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Blackout and coverage panel", "Blackout policy, delegate coverage, and team calendar context stay near the planning grid")
    s += bullet_list(314, 774, ["Project freeze from 18-22 Aug blocks optional leave", "Backup coverage mapped for 12 requests", "2 alternates need skill refresh before assignment", "Weekend staffing floor breached in one pod"])
    s += card(648, 712, 510, 220, "Approval feed and downstream effects", "Planning should stay linked to approval backlog and attendance or roster outcomes")
    s += bullet_list(666, 774, ["4 pending approvals affect risk week", "Approved leave syncs to roster and attendance views", "1 public holiday change altered prior safe day", "Managers can open approval queue from each hotspot"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned leave-planning lenses", "Managers can pin team, season, blackout, critical-skill, and alternate-coverage planning views")
    s += chip(320, 990, 110, "Pod B", "#DCFCE7")
    s += chip(442, 990, 118, "Diwali", "#DBEAFE")
    s += chip(572, 990, 122, "Blackout", "#FEF3C7")
    s += chip(706, 990, 128, "Critical role", "#FEE2E2")
    s += chip(846, 990, 122, "Alternate", "#EDE9FE")
    s += chip(980, 990, 128, "Heatmap", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Planning-first hero strip", "Top actions focus on calendar review and alternate coverage because this screen supports anticipation, not transaction entry."),
        (2, "Capacity-aware search", "Search follows team, season, blackout, and skill-risk concepts rather than individual leave records alone."),
        (3, "Heatmap KPI row", "The KPI strip highlights risk days, blackout windows, alternates, and critical-role pressure above the fold."),
        (4, "Calendar before approval depth", "The left card keeps overlap and capacity hotspots primary before users jump into approval details."),
        (5, "Explainable planning AI", "AI guidance proposes alternates and pacing decisions while leaving approvals and staffing decisions with managers."),
        (6, "Planning tied to operations", "Approval backlog and roster or attendance effects remain visible so the calendar does not become an isolated planning toy."),
        (7, "Manager planning lenses", "Pinned views reflect how people leaders revisit festive seasons, blackout periods, and critical-skill risk weeks."),
    ])
    save("lev-scr-003-team-leave-planning-view-desktop.svg", s)

    s = mobile_shell("Team Leave Planning", "Leave")
    s += chip(16, 108, 100, "Out 18", "#DBEAFE")
    s += chip(124, 108, 120, "Risk 7", "#FEE2E2")
    s += chip(252, 108, 122, "Season", "#FEF3C7")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search team, month, blackout, or capacity risk")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Calendar and risk summary", "Mobile starts with overlap, festive-season load, and blackout pressure")
    s += bullet_list(34, 284, ["7 risk days next month", "11 overlaps in Diwali week", "3 blackout windows", "2 critical-role collisions"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI alternate guidance", "Capacity suggestions stay explainable and manager-controlled on mobile")
    s += bullet_list(34, 456, ["Approve 2 and waitlist 1", "Assign alternate from pod C", "Check blackout policy", "Notify alternates first"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Open heatmap", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open queue", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Coverage and sync stack", "Alternates, pending approvals, and roster sync compress into one mobile summary")
    s += bullet_list(34, 652, ["12 backup mappings", "4 pending approvals", "1 holiday change affected plan", "Roster sync enabled"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Capacity-safe planning mobile", "Mobile preserves blackout, alternate, and hotspot cues before managers act on leave demand."),
    ])
    save("lev-scr-003-team-leave-planning-view-mobile.svg", s)

    s = desktop_shell("Document Repository", "Documents", "Governed Repository and Profile View", ["Repository", "Preview", "Versions", "Retention", "Links", "Audit"])
    s += chip(296, 152, 126, "Files 18.2k", "#DBEAFE")
    s += chip(434, 152, 156, "Sensitive 214", "#FEF3C7")
    s += chip(602, 152, 150, "Expiring 32", "#FEE2E2")
    s += rect(808, 146, 182, 40, COLORS["blue"], None, 14)
    s += text(899, 172, "inverse", "Review document", "middle")
    s += rect(1002, 146, 156, 40, COLORS["teal"], None, 14)
    s += text(1080, 172, "inverse", "Open version", "middle")
    s += callout(820, 146, 1)
    s += rect(296, 206, 862, 76, COLORS["panel"], COLORS["border"], 18, True)
    s += rect(320, 226, 520, 36, COLORS["soft2"], COLORS["border"], 18)
    s += text(338, 249, "body", "Search file, employee, case, OCR text, document type, or retention status")
    s += chip(856, 226, 98, "Filters", COLORS["soft"])
    s += chip(964, 226, 118, "Preview", COLORS["soft"])
    s += chip(1092, 226, 48, "Docs", COLORS["shell"])
    s += callout(320, 216, 2)
    for x, title_text, val, color in [
        (296, "Files", "18.2k", COLORS["green"]),
        (518, "Missing req", "27", COLORS["red"]),
        (740, "Sensitive", "214", COLORS["amber"]),
        (962, "Legal hold", "08", COLORS["blue"]),
        (1184, "Versions", "412", COLORS["teal"]),
    ]:
        s += metric_card(x, 302, 198, title_text, val, color)
    s += callout(320, 316, 3)
    s += card(296, 422, 332, 270, "Repository explorer and missing-evidence queue", "Users need missing, expired, and sensitive-document context before opening file detail")
    s += bullet_list(314, 484, ["27 required documents still missing or rejected", "32 employee evidence files expire this month", "8 investigation-related files on legal hold", "High-sensitivity passport documents restrict download"])
    s += callout(314, 438, 4)
    s += card(648, 422, 510, 270, "AI classification and metadata review", "AI can extract metadata and classify document type, but humans keep override and access-control authority")
    s += rect(666, 470, 474, 86, "#FBFDFF", COLORS["border"], 12)
    s += text(684, 496, "small", "AI metadata note")
    s += text(684, 522, "body", "The uploaded file likely contains a passport, suggested sensitivity class high, expiry 18 Nov 2028, and OCR confidence 84% pending verifier confirmation.")
    s += text(684, 544, "small", "Suggested next step: confirm extracted fields, review access mask, and publish metadata only after verifier acceptance.")
    s += rect(666, 574, 154, 36, COLORS["blue"], None, 12)
    s += text(743, 598, "inverse", "Review metadata", "middle")
    s += rect(834, 574, 124, 36, "#EEF2FF", None, 12)
    s += text(896, 598, "body", "Ask why", "middle")
    s += rect(972, 574, 168, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(1056, 598, "small", "Open preview", "middle")
    s += callout(666, 438, 5)
    s += card(296, 712, 332, 220, "Version lineage and sharing controls", "Preview, superseded history, and download restrictions stay near the selected document")
    s += bullet_list(314, 774, ["Version 4 superseded version 3 last week", "Download blocked for non-HR viewers", "Watermark required on print for sensitive docs", "Employee acknowledgment pending for 6 policy letters"])
    s += card(648, 712, 510, 220, "Retention, audit, and linked-record impact", "Retention state, legal hold, and linked-entity visibility belong in the same repository profile")
    s += bullet_list(666, 774, ["Retention due for 14 contractor files", "Document linked to employee, case, and exit checklist", "Audit trail shows 3 recent sensitive views", "1 OCR field override still awaiting verifier sign-off"])
    s += callout(666, 728, 6)
    s += card(296, 952, 862, 98, "Pinned document lenses", "Operations teams can pin sensitivity, expiry, legal hold, required-document, and linked-record repository views")
    s += chip(320, 990, 110, "Passport", "#DCFCE7")
    s += chip(442, 990, 112, "Expiry", "#DBEAFE")
    s += chip(566, 990, 122, "Sensitive", "#FEF3C7")
    s += chip(700, 990, 120, "Legal hold", "#FEE2E2")
    s += chip(832, 990, 130, "Required", "#EDE9FE")
    s += chip(974, 990, 134, "OCR review", "#F8FAFC")
    s += callout(320, 966, 7)
    s += annotation_panel(1178, 152, 238, 898, "Desktop annotations", [
        (1, "Repository-first hero strip", "Top actions prioritize governed review and version inspection because document operations are sensitive and evidence-driven."),
        (2, "Security-trimmed search", "Search is modeled around file, metadata, OCR, and retention attributes while assuming strict result trimming by access rights."),
        (3, "Governance KPI row", "The KPI strip highlights missing evidence, sensitive content, legal hold, and version activity above the fold."),
        (4, "Explorer before preview", "The left card keeps repository risk and missing-document context primary before users open a file preview."),
        (5, "Overrideable document AI", "AI is used to accelerate metadata extraction and classification, but human verification and security control stay explicit."),
        (6, "Version and retention together", "Supersession, retention, legal hold, and audit lineage remain adjacent because they jointly determine file usability."),
        (7, "Evidence-management lenses", "Pinned views reflect how HR ops and compliance teams revisit the repository by sensitivity, expiry, and verification state."),
    ])
    save("doc-scr-001-document-repository-and-profile-view-desktop.svg", s)

    s = mobile_shell("Document Repository", "Documents")
    s += chip(16, 108, 92, "Files", "#DBEAFE")
    s += chip(116, 108, 126, "Sensitive", "#FEF3C7")
    s += chip(250, 108, 124, "Expire 32", "#FEE2E2")
    s += callout(28, 122, 1)
    s += rect(16, 154, 358, 58, COLORS["panel"], COLORS["border"], 18, True)
    s += text(34, 190, "body", "Search file, employee, OCR text, or retention")
    s += callout(28, 168, 2)
    s += card(16, 228, 358, 156, "Repository and risk summary", "Mobile starts with missing, expiring, and sensitive-document context")
    s += bullet_list(34, 284, ["27 required documents missing", "32 files expiring this month", "8 files on legal hold", "Restricted downloads for passport docs"])
    s += callout(30, 244, 3)
    s += card(16, 400, 358, 182, "AI metadata guidance", "Classification suggestions stay reviewable and access-safe on mobile")
    s += bullet_list(34, 456, ["Likely passport document", "High sensitivity suggested", "OCR confidence 84%", "Confirm metadata before publish"])
    s += rect(30, 526, 150, 36, COLORS["blue"], None, 12)
    s += text(105, 550, "inverse", "Review metadata", "middle")
    s += rect(194, 526, 166, 36, "#F8FAFC", COLORS["border"], 12)
    s += text(277, 550, "body", "Open preview", "middle")
    s += callout(30, 416, 4)
    s += card(16, 598, 358, 138, "Version and retention stack", "Version lineage, audit views, and retention state compress into one mobile summary")
    s += bullet_list(34, 652, ["Version 4 superseded v3", "14 files due for retention action", "3 recent sensitive views", "1 OCR override pending"])
    s += callout(30, 614, 5)
    s += annotation_panel(16, 752, 358, 74, "Mobile notes", [
        (1, "Evidence-safe mobile repository", "Mobile preserves sensitivity, retention, and human verification cues before any file action is taken."),
    ])
    save("doc-scr-001-document-repository-and-profile-view-mobile.svg", s)


if __name__ == "__main__":
    generate()
