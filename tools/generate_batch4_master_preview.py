from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"D:\HRMS-doc")
OUT_DIR = ROOT / "docs/10-ui-ux-architecture/screen-ui-designs/batch-04-payroll-and-workforce-master-preview"
OUT_FILE = OUT_DIR / "pay-scr-004-statutory-workbench-desktop-final.png"

FONT_DIR = Path(r"C:\Windows\Fonts")
REGULAR = FONT_DIR / "segoeui.ttf"
SEMIBOLD = FONT_DIR / "segoeuib.ttf"

CANVAS = "#F7FAFC"
SURFACE = "#FFFFFF"
TEXT = "#1F2937"
TEXT_SOFT = "#64748B"
LINE = "#E5EEF3"
TEAL = "#0F8B8D"
TEAL_DARK = "#0C6D6F"
TEAL_DEEP = "#063B44"
TEAL_SOFT = "#E9F7F6"
ORANGE = "#F7931D"
ORANGE_SOFT = "#FFF3E8"
GREEN = "#22A55A"
GREEN_SOFT = "#ECFDF3"
BLUE = "#3B82F6"
BLUE_SOFT = "#EEF4FF"
RED = "#E84D4D"
RED_SOFT = "#FFF1F1"
NEUTRAL = "#F8FBFC"
NAV_MUTED = "#CAE7E4"


def font(size, bold=False):
    return ImageFont.truetype(str(SEMIBOLD if bold else REGULAR), size)


def text(draw, xy, value, size=12, color=TEXT, bold=False, anchor=None):
    draw.text(xy, str(value), fill=color, font=font(size, bold), anchor=anchor)


def fit_text(draw, value, max_width, size=12, bold=False):
    current = str(value)
    while current:
        box = draw.textbbox((0, 0), current, font=font(size, bold))
        if box[2] - box[0] <= max_width:
            return current
        current = current[:-2].rstrip()
    return ""


def rounded(draw, xy, fill=SURFACE, outline=LINE, radius=16, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def chip(draw, x, y, label, fill, color, min_width=66):
    width = max(min_width, len(label) * 7 + 22)
    rounded(draw, (x, y, x + width, y + 26), fill, fill, 13)
    text(draw, (x + width / 2, y + 13), label, 9, color, True, "mm")
    return width


def wrap(value, max_chars):
    words = str(value).split()
    lines = []
    line = ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if line and len(candidate) > max_chars:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines


def draw_logo(draw, x, y, inverse=False):
    brand = "#FFFFFF" if inverse else "#0A6A71"
    draw.line((x + 4, y + 24, x + 14, y + 8, x + 28, y + 25), fill=ORANGE, width=4)
    draw.ellipse((x + 10, y + 1, x + 21, y + 12), fill=TEAL)
    draw.ellipse((x + 1, y + 10, x + 11, y + 20), fill="#F2A13B")
    draw.line((x + 12, y + 10, x + 17, y + 22), fill=brand, width=2)
    text(draw, (x + 36, y + 15), "Staffsy", 24, brand, True, "lm")


def icon(draw, x, y, kind, color=TEXT, scale=1.0):
    s = scale
    width = max(1, int(1.6 * s))
    if kind == "menu":
        for i in range(3):
            draw.line((x, y + i * 6 * s, x + 18 * s, y + i * 6 * s), fill=color, width=width)
    elif kind == "search":
        draw.ellipse((x, y, x + 11 * s, y + 11 * s), outline=color, width=width)
        draw.line((x + 9 * s, y + 9 * s, x + 16 * s, y + 16 * s), fill=color, width=width)
    elif kind == "bell":
        draw.arc((x + 2 * s, y + 2 * s, x + 15 * s, y + 16 * s), 180, 360, fill=color, width=width)
        draw.line((x + 2 * s, y + 9 * s, x + 2 * s, y + 15 * s, x + 15 * s, y + 15 * s, x + 15 * s, y + 9 * s), fill=color, width=width)
        draw.ellipse((x + 7 * s, y + 16 * s, x + 10 * s, y + 19 * s), fill=color)
    elif kind == "mail":
        draw.rounded_rectangle((x + 1 * s, y + 3 * s, x + 16 * s, y + 14 * s), radius=1, outline=color, width=width)
        draw.line((x + 2 * s, y + 4 * s, x + 8 * s, y + 9 * s, x + 15 * s, y + 4 * s), fill=color, width=width)
    elif kind == "help":
        draw.ellipse((x + 1 * s, y + 1 * s, x + 16 * s, y + 16 * s), outline=color, width=width)
        text(draw, (x + 8.5 * s, y + 8.5 * s), "?", max(7, int(9 * s)), color, True, "mm")
    elif kind == "spark":
        for dx, dy in ((8, 0), (8, 15), (0, 8), (15, 8)):
            draw.line((x + dx * s, y + dy * s, x + 8 * s, y + 8 * s), fill=color, width=width)
        draw.ellipse((x + 6 * s, y + 6 * s, x + 10 * s, y + 10 * s), outline=color, width=width)
    elif kind == "calendar":
        draw.rounded_rectangle((x, y + 2 * s, x + 17 * s, y + 16 * s), radius=2, outline=color, width=width)
        draw.line((x, y + 6 * s, x + 17 * s, y + 6 * s), fill=color, width=width)
        draw.line((x + 5 * s, y, x + 5 * s, y + 5 * s), fill=color, width=width)
        draw.line((x + 12 * s, y, x + 12 * s, y + 5 * s), fill=color, width=width)
    elif kind == "doc":
        draw.rounded_rectangle((x + 2 * s, y, x + 14 * s, y + 17 * s), radius=1, outline=color, width=width)
        draw.line((x + 5 * s, y + 7 * s, x + 12 * s, y + 7 * s), fill=color, width=width)
        draw.line((x + 5 * s, y + 11 * s, x + 12 * s, y + 11 * s), fill=color, width=width)
    elif kind == "shield":
        draw.polygon(
            (
                x + 8 * s,
                y,
                x + 15 * s,
                y + 3 * s,
                x + 13 * s,
                y + 14 * s,
                x + 8 * s,
                y + 17 * s,
                x + 3 * s,
                y + 14 * s,
                x + 1 * s,
                y + 3 * s,
            ),
            outline=color,
            fill=None,
            width=width,
        )
    elif kind == "upload":
        draw.line((x + 8 * s, y + 1 * s, x + 8 * s, y + 12 * s), fill=color, width=width)
        draw.line((x + 4 * s, y + 5 * s, x + 8 * s, y + 1 * s, x + 12 * s, y + 5 * s), fill=color, width=width)
        draw.line((x + 2 * s, y + 15 * s, x + 14 * s, y + 15 * s), fill=color, width=width)
    elif kind == "filter":
        draw.line((x, y + 2 * s, x + 16 * s, y + 2 * s), fill=color, width=width)
        draw.line((x + 3 * s, y + 7 * s, x + 13 * s, y + 7 * s), fill=color, width=width)
        draw.line((x + 6 * s, y + 12 * s, x + 10 * s, y + 12 * s), fill=color, width=width)
    elif kind == "grid":
        for dx, dy in ((0, 0), (8, 0), (0, 8), (8, 8)):
            draw.rounded_rectangle((x + dx * s, y + dy * s, x + (dx + 5) * s, y + (dy + 5) * s), radius=1, outline=color, width=width)
    elif kind == "user":
        draw.ellipse((x + 5 * s, y, x + 12 * s, y + 7 * s), outline=color, width=width)
        draw.arc((x + 1 * s, y + 6 * s, x + 16 * s, y + 17 * s), 180, 360, fill=color, width=width)
    elif kind == "chart":
        draw.line((x + 2 * s, y + 16 * s, x + 2 * s, y + 4 * s), fill=color, width=width)
        draw.line((x + 2 * s, y + 16 * s, x + 16 * s, y + 16 * s), fill=color, width=width)
        draw.line((x + 5 * s, y + 13 * s, x + 8 * s, y + 9 * s, x + 11 * s, y + 11 * s, x + 15 * s, y + 5 * s), fill=color, width=width)
    elif kind == "settings":
        draw.ellipse((x + 4 * s, y + 4 * s, x + 13 * s, y + 13 * s), outline=color, width=width)
        for dx, dy in ((8, 0), (8, 17), (0, 8), (17, 8)):
            draw.line((x + dx * s, y + dy * s, x + 8 * s, y + 8 * s), fill=color, width=width)
    else:
        draw.ellipse((x + 1 * s, y + 1 * s, x + 15 * s, y + 15 * s), outline=color, width=width)


def draw_avatar(draw, x, y, size=38):
    rounded(draw, (x, y, x + size, y + size), "#DFF1F0", "#D7ECEA", size // 2, 1)
    cx = x + size / 2
    cy = y + size / 2
    draw.ellipse((cx - 7, cy - 10, cx + 7, cy + 4), fill="#F2C29A")
    draw.pieslice((cx - 10, cy - 14, cx + 10, cy + 5), 180, 360, fill="#28455B")
    draw.rounded_rectangle((cx - 11, cy + 1, cx + 11, cy + 15), radius=8, fill="#2A8A8A")


def annotation_card(draw, x, y, w, h, title, paragraphs, bullets, bullet_title):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 16)
    text(draw, (x + 16, y + 20), title, 12, TEAL_DARK, True)
    yy = y + 50
    for para in paragraphs:
        for line in wrap(para, 34):
            text(draw, (x + 16, yy), line, 10, TEXT_SOFT)
            yy += 16
        yy += 8
    text(draw, (x + 16, yy), bullet_title, 11, TEAL_DARK, True)
    yy += 24
    for bullet in bullets:
        draw.ellipse((x + 17, yy + 4, x + 23, yy + 10), outline=TEAL, width=1)
        for index, line in enumerate(wrap(bullet, 31)):
            text(draw, (x + 32, yy + index * 14), line, 9, TEXT_SOFT)
        yy += 20 + (len(wrap(bullet, 31)) - 1) * 14


def specs_card(draw, x, y):
    rounded(draw, (x, y, x + 194, 964), SURFACE, LINE, 16)
    text(draw, (x + 16, y + 20), "LAYOUT SPECIFICATIONS", 12, TEAL_DARK, True)
    specs = [
        ("Container Width", "1440px (Max)"),
        ("Sidebar Width", "240px (Fixed)"),
        ("Content Area", "1fr (Fluid)"),
        ("Column Grid", "12 Column"),
        ("Gutter", "24px"),
        ("Card Radius", "16px"),
        ("Spacing Scale", "8px Grid"),
    ]
    yy = y + 56
    for label, value in specs:
        text(draw, (x + 16, yy), label, 9, TEXT_SOFT)
        text(draw, (x + 178, yy), value, 9, TEXT, True, "ra")
        yy += 30
    draw.line((x + 16, yy + 2, x + 178, yy + 2), fill=LINE, width=1)
    yy += 24
    text(draw, (x + 16, yy), "RESPONSIVE BEHAVIOR", 11, TEAL_DARK, True)
    yy += 24
    behavior = [
        "Desktop (1440px+): Full layout with sidebar",
        "Tablet (1024px - 1439px): Responsive grid, sidebar collapses to icons",
        "Mobile (<768px): Top navigation, stacked layout",
    ]
    for note in behavior:
        draw.rounded_rectangle((x + 16, yy + 1, x + 31, yy + 16), radius=3, outline="#8EA3B5", width=1)
        for index, line in enumerate(wrap(note, 23)):
            text(draw, (x + 42, yy + index * 14), line, 9, TEXT_SOFT)
        yy += 38 + (len(wrap(note, 23)) - 1) * 14
    yy += 8
    text(draw, (x + 16, yy), "DO'S", 11, TEAL_DARK, True)
    yy += 22
    dos = [
        "Keep due dates and filing risk above the fold",
        "Use clear visual hierarchy for blockers and ready filings",
        "Maintain consistent spacing and icon labels",
        "Show ownership and evidence status in context",
        "Surface assistant actions without replacing controls",
    ]
    for item in dos:
        draw.ellipse((x + 18, yy + 4, x + 28, yy + 14), outline=GREEN, width=1)
        text(draw, (x + 42, yy + 9), fit_text(draw, item, 130, 9), 9, TEXT_SOFT, False, "lm")
        yy += 24
    yy += 6
    text(draw, (x + 16, yy), "DON'TS", 11, TEAL_DARK, True)
    yy += 22
    donts = [
        "Don't crowd cards with overflowing labels",
        "Don't use inconsistent header controls",
        "Don't hide evidence state behind extra clicks",
        "Don't mix non-system colors into action areas",
        "Don't break avatar, icon, or badge alignment",
    ]
    for item in donts:
        draw.ellipse((x + 18, yy + 4, x + 28, yy + 14), outline=RED, width=1)
        draw.line((x + 20, yy + 6, x + 26, yy + 12), fill=RED, width=1)
        draw.line((x + 26, yy + 6, x + 20, yy + 12), fill=RED, width=1)
        text(draw, (x + 42, yy + 9), fit_text(draw, item, 130, 9), 9, TEXT_SOFT, False, "lm")
        yy += 24
    yy += 6
    text(draw, (x + 16, yy), "SPECIFICATIONS", 11, TEAL_DARK, True)
    yy += 22
    for label, value in [("Font Family", "Inter"), ("Heading Font", "SemiBold / Bold"), ("Body Font Size", "14px"), ("Text Color", "#1F2937"), ("Primary Color", "#0F8B8D"), ("Accent Color", "#F7931D"), ("Surface Color", "#FFFFFF"), ("Border Color", "#E5EEF3")]:
        text(draw, (x + 16, yy), label, 9, TEXT_SOFT)
        text(draw, (x + 178, yy), value, 9, TEXT, True, "ra")
        yy += 22


def status_chip(draw, x, y, label):
    lower = label.lower()
    if "blocked" in lower or "missing" in lower or "risk" in lower:
        chip(draw, x, y, label, RED_SOFT, RED)
    elif "review" in lower or "pending" in lower or "correction" in lower:
        chip(draw, x, y, label, ORANGE_SOFT, "#C26A06")
    elif "ready" in lower or "complete" in lower:
        chip(draw, x, y, label, GREEN_SOFT, GREEN)
    else:
        chip(draw, x, y, label, BLUE_SOFT, BLUE)


def work_card(draw, x, y, w, h, title, icon_kind, icon_fill, lines, action):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 14)
    rounded(draw, (x + 16, y + 16, x + 52, y + 52), icon_fill, icon_fill, 12)
    icon(draw, x + 26, y + 26, icon_kind, TEAL_DARK if icon_fill != ORANGE_SOFT else "#C26A06", 0.9)
    text(draw, (x + 64, y + 28), title, 11, TEXT, True)
    yy = y + 60
    for row in lines:
        text(draw, (x + 16, yy), fit_text(draw, row, w - 40, 9), 9, TEXT_SOFT)
        yy += 20
    text(draw, (x + w - 16, y + h - 20), action, 9, TEAL, True, "ra")


def metric_card(draw, x, y, w, title, value, note, tone):
    fill_map = {
        "teal": TEAL_SOFT,
        "orange": ORANGE_SOFT,
        "green": GREEN_SOFT,
        "blue": BLUE_SOFT,
        "red": RED_SOFT,
    }
    icon_map = {
        "teal": "doc",
        "orange": "shield",
        "green": "calendar",
        "blue": "spark",
        "red": "filter",
    }
    color_map = {
        "teal": TEAL,
        "orange": "#C26A06",
        "green": GREEN,
        "blue": BLUE,
        "red": RED,
    }
    rounded(draw, (x, y, x + w, y + 104), SURFACE, LINE, 14)
    rounded(draw, (x + 16, y + 16, x + 52, y + 52), fill_map[tone], fill_map[tone], 12)
    icon(draw, x + 26, y + 26, icon_map[tone], color_map[tone], 0.9)
    text(draw, (x + 64, y + 26), fit_text(draw, title, w - 84, 10, True), 10, TEXT, True)
    text(draw, (x + 16, y + 73), value, 24, TEXT, True)
    text(draw, (x + 16, y + 92), note, 9, TEXT_SOFT)


def table_card(draw, x, y, w, h):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 14)
    text(draw, (x + 16, y + 22), "Filing Readiness Queue", 12, TEXT, True)
    text(draw, (x + w - 16, y + 22), "View All", 9, TEAL, True, "ra")
    text(draw, (x + 16, y + 42), "Operational queue for period, jurisdiction, evidence, and owner.", 9, TEXT_SOFT)
    headers = [("Filing", x + 16), ("Period", x + 186), ("Owner", x + 292), ("Status", x + 394)]
    draw.line((x + 16, y + 66, x + w - 16, y + 66), fill=LINE, width=1)
    for label, hx in headers:
        text(draw, (hx, y + 85), label, 8, TEXT_SOFT, True)
    rows = [
        ("PF ECR", "Jun 2026", "A. Mehta", "Ready"),
        ("ESI Return", "Jun 2026", "S. Iyer", "Evidence Missing"),
        ("PT Return", "Jul 2026", "P. Nair", "Ready"),
        ("TDS Statement", "Q1 FY27", "R. Sharma", "Correction"),
        ("LWF Return", "Jul 2026", "V. Rao", "In Review"),
    ]
    yy = y + 115
    for filing, period, owner, status in rows:
        text(draw, (x + 16, yy), filing, 9, TEXT, True)
        text(draw, (x + 186, yy), period, 9, TEXT_SOFT)
        text(draw, (x + 292, yy), owner, 9, TEXT_SOFT)
        status_chip(draw, x + 394, yy - 10, status)
        draw.line((x + 16, yy + 18, x + w - 16, yy + 18), fill="#EEF3F6", width=1)
        yy += 34
    text(draw, (x + 16, y + h - 20), "Receipts and evidence are retained per filing version.", 9, TEXT_SOFT)


def assistant_card(draw, x, y, w, h):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 14)
    rounded(draw, (x + 16, y + 16, x + 52, y + 52), BLUE_SOFT, BLUE_SOFT, 12)
    icon(draw, x + 26, y + 26, "spark", BLUE, 0.9)
    text(draw, (x + 64, y + 28), "Compliance Assistant", 11, TEXT, True)
    chip(draw, x + 170, y + 20, "BETA", GREEN_SOFT, GREEN, 46)
    rounded(draw, (x + w - 74, y + 58, x + w - 18, y + 126), radius=14, fill="#F1F8F8", outline="#D6ECEA", width=1)
    draw.ellipse((x + w - 62, y + 70, x + w - 30, y + 102), fill="#DFF1F0")
    draw.ellipse((x + w - 54, y + 76, x + w - 38, y + 92), fill="#F1C6A5")
    draw.pieslice((x + w - 56, y + 73, x + w - 36, y + 92), 180, 360, fill="#26465E")
    draw.rounded_rectangle((x + w - 58, y + 93, x + w - 34, y + 109), radius=8, fill=TEAL)
    yy = y + 70
    for line in wrap("I found 2 blocked filings and 1 due-date risk for this week.", 19)[:3]:
        text(draw, (x + 16, yy), line, 10, TEXT_SOFT)
        yy += 16
    draw.rounded_rectangle((x + 16, y + 110, x + w - 16, y + 145), radius=10, outline=LINE, fill="#FBFDFE", width=1)
    text(draw, (x + 28, y + 128), "Ask anything about PT, PF, ESI, TDS, or receipts...", 9, "#94A3B8")
    icon(draw, x + w - 34, y + 119, "spark", TEAL, 0.85)
    for index, pill in enumerate(["Show blocked filings", "Missing evidence", "Penalty exposure", "Notify owners"]):
        px = x + 16 + (index % 2) * 120
        py = y + 160 + (index // 2) * 36
        rounded(draw, (px, py, px + 108, py + 28), "#FBFDFE", LINE, 10)
        text(draw, (px + 54, py + 14), fit_text(draw, pill, 92, 8), 8, TEXT_SOFT, False, "mm")


def quick_actions(draw, x, y, w, h):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 14)
    text(draw, (x + 16, y + 22), "Quick Actions", 12, TEXT, True)
    actions = [
        ("Create", "doc"),
        ("Upload", "upload"),
        ("Assign", "user"),
        ("Review", "shield"),
        ("Calendar", "calendar"),
        ("Filter", "filter"),
    ]
    cell_w = (w - 40) / 2
    cell_h = 54
    for idx, (label, glyph) in enumerate(actions):
        col = idx % 2
        row = idx // 2
        xx = x + 16 + col * (cell_w + 8)
        yy = y + 56 + row * (cell_h + 10)
        rounded(draw, (xx, yy, xx + cell_w, yy + cell_h), "#FBFDFE", LINE, 12)
        rounded(draw, (xx + 12, yy + 11, xx + 40, yy + 39), TEAL_SOFT, TEAL_SOFT, 10)
        icon(draw, xx + 18, yy + 17, glyph, TEAL, 0.8)
        label_lines = wrap(label, 14)[:2]
        text(draw, (xx + 50, yy + 22), label_lines[0], 8, TEXT, True, "lm")
        if len(label_lines) > 1:
            text(draw, (xx + 50, yy + 34), label_lines[1], 8, TEXT, True, "lm")


def summary_card(draw, x, y, w, h, title, rows, tag=None):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 14)
    text(draw, (x + 16, y + 22), fit_text(draw, title, w - (96 if tag else 32), 12, True), 12, TEXT, True)
    if tag:
        chip(draw, x + w - 82, y + 14, tag, ORANGE_SOFT, "#C26A06", 66)
    yy = y + 56
    for left, right in rows:
        text(draw, (x + 16, yy), fit_text(draw, left, w - 90, 9), 9, TEXT_SOFT)
        text(draw, (x + w - 16, yy), right, 9, TEXT, True, "ra")
        draw.line((x + 16, yy + 16, x + w - 16, yy + 16), fill="#EEF3F6", width=1)
        yy += 30


def render():
    image = Image.new("RGB", (1536, 1024), CANVAS)
    draw = ImageDraw.Draw(image)

    draw.rectangle((0, 0, 1536, 68), fill=SURFACE)
    draw_logo(draw, 24, 18)
    draw.line((189, 16, 189, 53), fill=LINE, width=1)
    text(draw, (215, 20), "Staffsy - Statutory Workbench Template (Desktop)", 18, TEXT, True)
    text(draw, (215, 46), "Enterprise HRMS Payroll Compliance Workspace", 10, TEXT_SOFT)

    badges = [
        ("Human Centered", "user"),
        ("AI Powered", "spark"),
        ("Intelligent", "settings"),
        ("Scalable", "upload"),
        ("Accessible", "help"),
    ]
    bx = 1008
    for label, glyph in badges:
        icon(draw, bx, 22, glyph, TEAL_DARK, 0.82)
        text(draw, (bx + 24, 30), label, 9, TEXT, True, "lm")
        text_width = draw.textbbox((0, 0), label, font=font(9, True))[2]
        bx += 34 + text_width + 18
    rounded(draw, (1420, 16, 1518, 52), SURFACE, LINE, 10)
    text(draw, (1469, 34), "Light Theme", 9, TEXT, True, "mm")

    annotation_card(
        draw,
        10,
        74,
        305,
        900,
        "TEMPLATE OVERVIEW",
        ["The Statutory Workbench is the payroll compliance control surface for due dates, filing readiness, evidence, and accountable ownership."],
        [
            "Keep filing risk visible above the fold",
            "Surface evidence, owner, and status together",
            "Support action-first resolution with minimal navigation",
            "Use AI as assistive guidance, not workflow replacement",
        ],
        "KEY PURPOSE",
    )
    text(draw, (26, 634), "WHEN TO USE", 11, TEAL_DARK, True)
    for idx, note in enumerate([
        "Daily review of filing readiness and deadline risk",
        "Control tower for blocked or evidence-missing obligations",
        "Manager workspace for assignment, follow-up, and submission",
    ]):
        yy = 660 + idx * 24
        draw.ellipse((28, yy + 4, 34, yy + 10), outline=TEAL, width=1)
        text(draw, (44, yy + 7), note, 9, TEXT_SOFT, False, "lm")
    text(draw, (26, 738), "ANATOMY", 11, TEAL_DARK, True)
    anatomy = [
        "Top command bar",
        "Left navigation",
        "Page title and actions",
        "Insight strip",
        "KPI summary cards",
        "Filing readiness queue",
        "AI assistant and quick actions",
        "Calendar, ownership, and audit cards",
    ]
    for idx, label in enumerate(anatomy, 1):
        yy = 766 + (idx - 1) * 23
        draw.ellipse((26, yy - 2, 42, yy + 14), fill=TEAL)
        text(draw, (34, yy + 6), str(idx), 8, "#FFFFFF", True, "mm")
        text(draw, (52, yy + 6), label, 9, TEXT_SOFT, False, "lm")

    specs_card(draw, 1332, 74)

    app_x = 319
    app_y = 74
    app_w = 1000
    app_h = 894
    rounded(draw, (app_x, app_y, app_x + app_w, app_y + app_h), SURFACE, LINE, 16)
    icon(draw, app_x + 18, app_y + 18, "menu", TEXT, 1.0)
    draw_logo(draw, app_x + 46, app_y + 14)
    rounded(draw, (app_x + 210, app_y + 12, app_x + 616, app_y + 46), "#FBFDFE", LINE, 10)
    icon(draw, app_x + 224, app_y + 23, "search", "#8CA1B3", 0.82)
    text(draw, (app_x + 248, app_y + 30), "Search filings, jurisdictions, payroll policies...", 9, "#94A3B8", False, "lm")
    rounded(draw, (app_x + 635, app_y + 12, app_x + 742, app_y + 46), TEAL, TEAL, 10)
    icon(draw, app_x + 650, app_y + 22, "spark", "#FFFFFF", 0.8)
    text(draw, (app_x + 699, app_y + 29), "Ask Staffsy AI", 9, "#FFFFFF", True, "mm")
    icon(draw, app_x + 772, app_y + 20, "bell", TEXT, 0.92)
    chip(draw, app_x + 781, app_y + 8, "3", RED_SOFT, RED, 20)
    icon(draw, app_x + 818, app_y + 20, "mail", TEXT, 0.92)
    chip(draw, app_x + 827, app_y + 8, "2", RED_SOFT, RED, 20)
    icon(draw, app_x + 864, app_y + 20, "help", TEXT, 0.92)
    draw_avatar(draw, app_x + 895, app_y + 11, 34)
    text(draw, (app_x + 940, app_y + 24), "Rahul Sharma", 9, TEXT, True)
    text(draw, (app_x + 940, app_y + 38), "Payroll Ops Lead", 8, TEXT_SOFT)
    draw.line((app_x, app_y + 60, app_x + app_w, app_y + 60), fill=LINE, width=1)

    sidebar_x = app_x + 12
    sidebar_y = app_y + 72
    sidebar_w = 148
    sidebar_h = 760
    rounded(draw, (sidebar_x, sidebar_y, sidebar_x + sidebar_w, sidebar_y + sidebar_h), TEAL_DEEP, TEAL_DEEP, 14)
    rounded(draw, (sidebar_x + 10, sidebar_y + 12, sidebar_x + sidebar_w - 10, sidebar_y + 40), TEAL, TEAL, 10)
    text(draw, (sidebar_x + 22, sidebar_y + 26), "Payroll", 10, "#FFFFFF", True, "lm")
    nav = [
        ("Workbench", "grid", True),
        ("Payroll Runs", "doc", False),
        ("Validation", "filter", False),
        ("Filings", "calendar", False),
        ("Calendar", "calendar", False),
        ("Reports", "chart", False),
        ("Audit", "settings", False),
    ]
    for idx, (label, glyph, active) in enumerate(nav):
        yy = sidebar_y + 60 + idx * 42
        fill = TEAL if active else TEAL_DEEP
        rounded(draw, (sidebar_x + 10, yy, sidebar_x + sidebar_w - 10, yy + 30), fill, fill, 10)
        icon(draw, sidebar_x + 18, yy + 7, glyph, "#FFFFFF" if active else NAV_MUTED, 0.82)
        text(draw, (sidebar_x + 42, yy + 15), label, 9, "#FFFFFF" if active else NAV_MUTED, active, "lm")
    draw.line((sidebar_x + 12, sidebar_y + sidebar_h - 104, sidebar_x + sidebar_w - 12, sidebar_y + sidebar_h - 104), fill="#2A5D66", width=1)
    rounded(draw, (sidebar_x + 12, sidebar_y + sidebar_h - 88, sidebar_x + sidebar_w - 12, sidebar_y + sidebar_h - 16), "#0C4E58", "#0C4E58", 12)
    text(draw, (sidebar_x + 24, sidebar_y + sidebar_h - 72), "Ask Staffsy AI", 10, "#FFFFFF", True)
    text(draw, (sidebar_x + 24, sidebar_y + sidebar_h - 56), "Compliance help", 8, NAV_MUTED)
    rounded(draw, (sidebar_x + 24, sidebar_y + sidebar_h - 42, sidebar_x + 88, sidebar_y + sidebar_h - 22), SURFACE, SURFACE, 10)
    text(draw, (sidebar_x + 56, sidebar_y + sidebar_h - 32), "Start", 8, TEAL, True, "mm")

    main_x = sidebar_x + sidebar_w + 28
    main_w = app_x + app_w - main_x - 18
    text(draw, (main_x, app_y + 86), "Good Morning, Rahul!", 20, TEXT, True)
    text(draw, (main_x, app_y + 112), "Thursday, 16 July 2026    |    Compliance Cycle    |    09:30 AM", 10, TEXT_SOFT)
    rounded(draw, (app_x + app_w - 318, app_y + 74, app_x + app_w - 172, app_y + 108), TEAL, TEAL, 10)
    icon(draw, app_x + app_w - 297, app_y + 85, "doc", "#FFFFFF", 0.84)
    text(draw, (app_x + app_w - 245, app_y + 91), "Create Filing", 9, "#FFFFFF", True, "mm")
    rounded(draw, (app_x + app_w - 160, app_y + 74, app_x + app_w - 16, app_y + 108), SURFACE, TEAL, 10, 1)
    icon(draw, app_x + app_w - 142, app_y + 84, "spark", TEAL, 0.84)
    text(draw, (app_x + app_w - 87, app_y + 91), "Ask Assistant", 9, TEAL, True, "mm")

    work_card(
        draw,
        main_x,
        app_y + 138,
        230,
        88,
        "6 Returns Due",
        "calendar",
        ORANGE_SOFT,
        ["2 filings due tomorrow", "4 ready for final review"],
        "Open calendar",
    )
    work_card(
        draw,
        main_x + 246,
        app_y + 138,
        230,
        88,
        "2 Blocking Risks",
        "shield",
        RED_SOFT,
        ["Evidence missing in ESI", "Correction required in TDS"],
        "Review blockers",
    )
    work_card(
        draw,
        main_x + 492,
        app_y + 138,
        main_w - 492,
        88,
        "Submission Receipts",
        "doc",
        BLUE_SOFT,
        ["5 receipts captured this week", "Last filing acknowledged at 08:45 AM"],
        "Open receipts",
    )

    metric_y = app_y + 244
    metric_w = (main_w - 32) / 4
    metric_card(draw, main_x, metric_y, metric_w, "Returns Due", "06", "This month", "orange")
    metric_card(draw, main_x + metric_w + 10, metric_y, metric_w, "Ready To File", "04", "Evidence complete", "green")
    metric_card(draw, main_x + 2 * (metric_w + 10), metric_y, metric_w, "Blocked", "02", "Needs correction", "red")
    metric_card(draw, main_x + 3 * (metric_w + 10), metric_y, metric_w, "Penalty Risk", "01", "Escalate", "blue")

    table_card(draw, main_x, app_y + 364, 432, 248)
    assistant_card(draw, main_x + 448, app_y + 364, 228, 248)
    quick_actions(draw, main_x + 692, app_y + 364, main_w - 692, 248)

    summary_card(
        draw,
        main_x,
        app_y + 630,
        260,
        136,
        "Upcoming Obligations",
        [("PF ECR - Maharashtra", "15 Jul"), ("ESI - Karnataka", "15 Jul"), ("PT - Maharashtra", "31 Jul"), ("TDS Q1", "31 Jul")],
    )
    summary_card(
        draw,
        main_x + 276,
        app_y + 630,
        210,
        136,
        "Owner Follow-up",
        [("Assignments pending", "03"), ("Awaiting evidence", "02"), ("Escalations", "01"), ("Notifications sent", "08")],
    )
    summary_card(
        draw,
        main_x + 502,
        app_y + 630,
        198,
        136,
        "Jurisdictions",
        [("Maharashtra", "4"), ("Karnataka", "3"), ("West Bengal", "2"), ("All entities", "1")],
    )
    summary_card(
        draw,
        main_x + 716,
        app_y + 630,
        main_w - 716,
        136,
        "Recent Activity",
        [("Receipt uploaded - PF ECR", "08:45"), ("Owner reassigned - ESI", "09:10"), ("Risk note added - TDS", "Yesterday"), ("Return marked ready", "Yesterday")],
    )

    footer_y = 986
    draw.line((0, footer_y, 1536, footer_y), fill=LINE, width=1)
    text(draw, (24, 1005), "Staffsy Design System v1.0", 9, TEXT_SOFT)
    text(draw, (768, 1005), "Consistent. Scalable. Beautiful. Built for the future of work.", 9, TEXT_SOFT, False, "mm")
    text(draw, (1512, 1005), "© 2026 Staffsy. All rights reserved.", 9, TEXT_SOFT, False, "ra")
    return image


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    render().save(OUT_FILE, "PNG", optimize=True)
    print(f"Created {OUT_FILE}")


if __name__ == "__main__":
    main()
