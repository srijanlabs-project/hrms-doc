from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(r"D:\HRMS-doc")
OUT = ROOT / "docs/10-ui-ux-architecture/mockups"


SCREENS = [
    {
        "slug": "pay-scr-007-payroll-anomaly-copilot-workspace",
        "ref": "PAY-SCR-007",
        "title": "Payroll Anomaly Copilot Workspace",
        "subtitle": "AI explanation, severity triage, and approval routing for payroll anomalies",
        "nav": ["Anomalies", "Routes", "Review", "History", "Guardrails", "Reports"],
        "chips": [("Severity", "#FDEAD7"), ("Confidence", "#EAF2F8"), ("Route", "#DCFCE7")],
        "metrics": [("Open anomalies", "28"), ("Blocking", "03"), ("Needs routing", "09"), ("Resolved", "16")],
        "section1": "Anomaly queue and explanation panel",
        "section2": "Route preview and evidence trace",
        "bullets1": [
            "Root cause explanation stays attached to each anomaly.",
            "Blocking anomalies surface severity and payroll impact first.",
            "Human review remains mandatory before route or close.",
        ],
        "bullets2": [
            "Suggested approver path is explainable and editable.",
            "Evidence links show prior-period and peer-group comparison.",
            "Audit trail captures every AI recommendation and override.",
        ],
    },
    {
        "slug": "mgr-scr-008-manager-daily-briefing-workspace",
        "ref": "MGR-SCR-008",
        "title": "Manager Daily Briefing Workspace",
        "subtitle": "Morning-ready summary of risk, birthdays, absences, approvals, and next actions",
        "nav": ["Briefing", "Approvals", "Team", "Risks", "Celebrations", "Calendar"],
        "chips": [("Briefing", "#EAF2F8"), ("Today", "#FEF3C7"), ("AI Prioritized", "#DCFCE7")],
        "metrics": [("Pending approvals", "12"), ("Absences", "05"), ("Birthdays", "02"), ("Risks", "03")],
        "section1": "Morning priorities and team signals",
        "section2": "Celebrations, risks, and manager follow-up",
        "bullets1": [
            "The daily brief compresses the manager's first ten minutes.",
            "Absence conflicts, approval aging, and tasks are prioritized.",
            "Cards should be action-first rather than report-heavy.",
        ],
        "bullets2": [
            "Birthdays and anniversaries appear with celebration prompts.",
            "AI highlights only the highest-value interventions.",
            "The brief should be dismissible, reusable, and delegated safely.",
        ],
    },
    {
        "slug": "exr-scr-005-celebration-campaign-studio",
        "ref": "EXR-SCR-005",
        "title": "Celebration Campaign Studio",
        "subtitle": "Design and schedule AI-assisted birthday, anniversary, and join-date campaigns",
        "nav": ["Campaigns", "Templates", "Audience", "Assets", "Calendar", "Approvals"],
        "chips": [("Celebration", "#FDEAD7"), ("Scheduled", "#EAF2F8"), ("Preview", "#DCFCE7")],
        "metrics": [("Active campaigns", "14"), ("Today", "03"), ("Queued assets", "86"), ("Needs approval", "04")],
        "section1": "Campaign builder and schedule workflow",
        "section2": "Generated cards, copy packs, and approvals",
        "bullets1": [
            "HR should control campaign theme, timing, and audience rules.",
            "Birthday, anniversary, and join-date flows reuse one studio.",
            "Preview and approval states must stay explicit.",
        ],
        "bullets2": [
            "Generated assets include card image, copy, and publish channel.",
            "Consent and missing-photo fallback must be visible.",
            "Locale and occasion templates should remain editable before release.",
        ],
    },
    {
        "slug": "exr-scr-006-ridz-quote-and-recognition-personalization-engine",
        "ref": "EXR-SCR-006",
        "title": "Ridz Quote and Recognition Personalization Engine",
        "subtitle": "Targeted quote, festival, and morale-message personalization using the Staffsy bot persona",
        "nav": ["Ridz", "Quotes", "Festivals", "Audience", "Approvals", "History"],
        "chips": [("Ridz", "#EAF2F8"), ("Festival", "#FDEAD7"), ("Personalized", "#DCFCE7")],
        "metrics": [("Quote packs", "126"), ("Active audiences", "18"), ("Today", "09"), ("Blocked", "01")],
        "section1": "Quote library, targeting, and occasion logic",
        "section2": "Recognition-linked nudges and moderation controls",
        "bullets1": [
            "Ridz content should support festivals, campaigns, and values moments.",
            "HR can curate, approve, and schedule quote families by audience.",
            "Targeting needs geography, role, and event sensitivity.",
        ],
        "bullets2": [
            "Recognition prompts and quote moments can work together.",
            "Tone and message style must remain brand-safe and explainable.",
            "Overuse controls should stop dashboard fatigue.",
        ],
    },
    {
        "slug": "aic-scr-006-conversational-reporting-workspace",
        "ref": "AIC-SCR-006",
        "title": "Conversational Reporting Workspace",
        "subtitle": "Permission-aware narrative reporting for employees, managers, and leadership users",
        "nav": ["Ask", "Queries", "Charts", "Sources", "Saved", "Exports"],
        "chips": [("Reporting", "#EAF2F8"), ("Narrative", "#FEF3C7"), ("Source Backed", "#DCFCE7")],
        "metrics": [("Queries today", "42"), ("Saved views", "18"), ("Exports", "06"), ("Low confidence", "02")],
        "section1": "Prompt-to-answer reporting conversation",
        "section2": "Narrative result, sources, and follow-up drilldowns",
        "bullets1": [
            "Users ask questions in plain language and receive governed answers.",
            "Prompt history and saved reporting views reduce repeat work.",
            "Employees and managers see only authorized data scope.",
        ],
        "bullets2": [
            "Answers should cite metrics, source scope, and confidence.",
            "Charts and drilldowns appear as structured follow-up blocks.",
            "Low-confidence responses route users to source review rather than false certainty.",
        ],
    },
]


STYLE = """
  <defs>
    <style>
      .title { font: 700 28px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .h2 { font: 600 18px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .h3 { font: 600 15px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .metric { font: 700 24px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .body { font: 500 13px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .small { font: 500 12px 'Segoe UI', Arial, sans-serif; fill: #486581; }
      .inverse { font: 600 12px 'Segoe UI', Arial, sans-serif; fill: white; }
      .annoTitle { font: 700 14px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .annoText { font: 500 12px 'Segoe UI', Arial, sans-serif; fill: #486581; }
    </style>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="8" flood-color="#102A43" flood-opacity="0.08"/>
    </filter>
  </defs>
"""


def rect(x, y, w, h, rx, fill, stroke="#D9E2EC", sw=1, shadow=False):
    extra = ' filter="url(#shadow)"' if shadow else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{extra}/>'


def text(x, y, cls, value, anchor=None):
    anchor_attr = f' text-anchor="{anchor}"' if anchor else ""
    return f'<text x="{x}" y="{y}" class="{cls}"{anchor_attr}>{escape(str(value))}</text>'


def chip(x, y, label, fill):
    width = max(92, len(label) * 7 + 28)
    return (
        rect(x, y, width, 28, 14, fill, fill, 1)
        + text(x + width / 2, y + 18, "small", label, "middle"),
        width,
    )


def bullets(x, start_y, items):
    parts = []
    yy = start_y
    for item in items:
        parts.append(f"<circle cx='{x}' cy='{yy}' r='3' fill='#2563EB'/>")
        parts.append(text(x + 12, yy + 4, "body", item))
        yy += 22
    return "".join(parts)


def desktop_svg(screen):
    chips_markup = []
    chip_x = 296
    for label, fill in screen["chips"]:
        markup, width = chip(chip_x, 152, label, fill)
        chips_markup.append(markup)
        chip_x += width + 12

    nav_markup = []
    nav_y = 144
    for i, item in enumerate(screen["nav"]):
        fill = "rgba(255,255,255,0.12)" if i == 0 else "rgba(255,255,255,0.04)"
        nav_markup.append(f"<rect x='40' y='{nav_y}' width='216' height='40' rx='12' fill='{fill}'/>")
        nav_markup.append(text(60, nav_y + 24, "inverse", item))
        nav_y += 52

    metrics = []
    mx = 296
    colors = ["#15803D", "#D97706", "#B42318", "#2563EB"]
    for i, (label, value) in enumerate(screen["metrics"]):
        metrics.append(rect(mx, 302, 198, 92, 14, "#FFFFFF", shadow=True))
        metrics.append(rect(mx + 12, 314, 44, 44, 12, colors[i], colors[i]))
        metrics.append(text(mx + 68, 332, "small", label))
        metrics.append(text(mx + 68, 362, "metric", value))
        mx += 222

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1280" viewBox="0 0 1440 1280" fill="none">
{STYLE}
  <rect width="1440" height="1280" fill="#F4F7FB"/>
  {rect(24, 24, 248, 1232, 24, "#10324A", "#10324A", shadow=True)}
  {text(52, 72, "inverse", screen["ref"])}
  {rect(48, 92, 200, 36, 12, "rgba(255,255,255,0.10)", "rgba(255,255,255,0.10)")}
  {text(62, 116, "inverse", screen["title"][:26])}
  {''.join(nav_markup)}
  {rect(296, 24, 1120, 64, 20, "#FFFFFF", shadow=True)}
  {rect(320, 40, 380, 32, 16, "#F8FAFC")}
  {text(338, 61, "small", "Search task, anomaly, quote, campaign, or report")}
  {rect(1164, 40, 108, 28, 14, "#FDEAD7", "#FDEAD7")}
  {text(1218, 58, "small", "Tasks 08", "middle")}
  {rect(1284, 40, 104, 28, 14, "#E3F2FD", "#E3F2FD")}
  {text(1336, 58, "small", "Alerts 03", "middle")}
  {text(296, 128, "title", screen["title"])}
  {''.join(chips_markup)}
  {rect(808, 146, 168, 40, 14, "#2563EB", "#2563EB")}
  {text(892, 172, "inverse", "Open workbench", "middle")}
  {rect(988, 146, 170, 40, 14, "#0F766E", "#0F766E")}
  {text(1073, 172, "inverse", "Review signals", "middle")}
  {rect(296, 206, 862, 76, 18, "#FFFFFF", shadow=True)}
  {rect(320, 226, 520, 36, 18, "#F8FAFC")}
  {text(338, 249, "body", screen["subtitle"])}
  {rect(856, 226, 86, 28, 14, "#EAF2F8", "#EAF2F8")}
  {text(899, 244, "small", "Focus", "middle")}
  {rect(952, 226, 98, 28, 14, "#EAF2F8", "#EAF2F8")}
  {text(1001, 244, "small", "Signals", "middle")}
  {rect(1060, 226, 92, 28, 14, "#10324A", "#10324A")}
  {text(1106, 244, "inverse", "Review", "middle")}
  {''.join(metrics)}
  {rect(296, 422, 332, 270, 14, "#FFFFFF", shadow=True)}
  {text(312, 446, "h3", screen["section1"])}
  {text(312, 464, "small", "Structural mockup for development-ready requirements coverage.")}
  {bullets(314, 492, screen["bullets1"])}
  {rect(648, 422, 510, 270, 14, "#FFFFFF", shadow=True)}
  {text(664, 446, "h3", screen["section2"])}
  {text(664, 464, "small", "Annotated operational surface with action and governance context.")}
  {bullets(666, 492, screen["bullets2"])}
  {rect(296, 712, 862, 222, 14, "#FFFFFF", shadow=True)}
  {text(312, 736, "h3", "Primary workspace layout")}
  {rect(320, 760, 516, 146, 14, "#F8FAFC")}
  {text(340, 788, "body", "Left surface: queue, builder, or briefing stack depending on screen purpose")}
  {rect(856, 760, 278, 146, 14, "#F8FAFC")}
  {text(876, 788, "body", "Right surface: detail, explanation, route, or preview pane")}
  {rect(320, 924, 814, 94, 14, "#F8FAFC")}
  {text(340, 952, "body", "Lower strip: audit, campaigns, history, metrics, or next-action utilities")}
  {rect(1178, 206, 238, 812, 18, "#FFFFFF", shadow=True)}
  {text(1196, 236, "annoTitle", "Mockup notes")}
  {bullets(1198, 272, [
      "Desktop board exists for implementation mapping.",
      "Mobile pair exists for parity and planning.",
      "Condition variants are captured in the catalog.",
      "Use this as annotated structure, not final UI polish."
  ])}
  {text(24, 1248, "small", "Innovation mockup extension")}
</svg>"""


def mobile_svg(screen):
    chips_markup = []
    cx = 28
    for label, fill in screen["chips"][:2]:
        markup, width = chip(cx, 188, label, fill)
        chips_markup.append(markup)
        cx += width + 10
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="390" height="1540" viewBox="0 0 390 1540" fill="none">
{STYLE}
  <rect width="390" height="1540" fill="#F4F7FB"/>
  {rect(16, 16, 358, 1508, 30, "#FFFFFF")}
  {text(28, 54, "body", screen["ref"])}
  {text(58, 54, "body", screen["title"][:24])}
  <circle cx="314" cy="48" r="12" fill="#EAF2F8"/>
  <circle cx="344" cy="48" r="12" fill="#FDEAD7"/>
  {text(28, 96, "title", screen["title"])}
  {text(28, 118, "small", screen["subtitle"][:64])}
  {rect(28, 138, 334, 36, 18, "#F8FAFC")}
  {text(44, 160, "small", "Search task, signal, or explanation")}
  {''.join(chips_markup)}
  {rect(28, 236, 158, 82, 18, "#FFFFFF")}
  {text(44, 264, "small", screen["metrics"][0][0])}
  {text(44, 292, "metric", screen["metrics"][0][1])}
  {rect(204, 236, 158, 82, 18, "#FFFFFF")}
  {text(220, 264, "small", screen["metrics"][1][0])}
  {text(220, 292, "metric", screen["metrics"][1][1])}
  {rect(28, 334, 158, 82, 18, "#FFFFFF")}
  {text(44, 362, "small", screen["metrics"][2][0])}
  {text(44, 390, "metric", screen["metrics"][2][1])}
  {rect(204, 334, 158, 82, 18, "#FFFFFF")}
  {text(220, 362, "small", screen["metrics"][3][0])}
  {text(220, 390, "metric", screen["metrics"][3][1])}
  {rect(28, 434, 334, 46, 16, "#2563EB", "#2563EB")}
  {text(195, 463, "inverse", "Primary action", "middle")}
  {rect(28, 492, 334, 46, 16, "#0F766E", "#0F766E")}
  {text(195, 521, "inverse", "Review and continue", "middle")}
  {rect(28, 558, 334, 262, 20, "#FFFFFF")}
  {text(44, 586, "h3", screen["section1"])}
  {text(44, 606, "small", "Mobile structural definition for product and engineering teams.")}
  {bullets(42, 650, screen["bullets1"])}
  {rect(28, 846, 334, 230, 20, "#FFFFFF")}
  {text(44, 874, "h3", screen["section2"])}
  {text(44, 894, "small", "The mobile view keeps context, action, and audit close together.")}
  {bullets(42, 936, screen["bullets2"])}
  {rect(28, 1104, 334, 392, 20, "#F8FBFF")}
  {text(44, 1132, "h3", "Mobile annotations")}
  {bullets(42, 1180, [
      "Prioritize the first action and signal.",
      "Collapse dense context into expandable cards.",
      "Keep audit and routing visible without overload.",
      "Use this file as mockup guidance, not final UI."
  ])}
</svg>"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for screen in SCREENS:
        desktop_path = OUT / f"{screen['slug']}-desktop.svg"
        mobile_path = OUT / f"{screen['slug']}-mobile.svg"
        desktop_path.write_text(desktop_svg(screen), encoding="utf-8")
        mobile_path.write_text(mobile_svg(screen), encoding="utf-8")
    print(f"Generated {len(SCREENS) * 2} innovation mockup SVGs in {OUT}")


if __name__ == "__main__":
    main()
