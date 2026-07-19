from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

from generate_final_ui_boards import SCREENS


ROOT = Path(r"D:\HRMS-doc")
DESIGNS = ROOT / "docs/10-ui-ux-architecture/screen-ui-designs"
FONT_DIR = Path(r"C:\Windows\Fonts")
REGULAR = FONT_DIR / "segoeui.ttf"
SEMIBOLD = FONT_DIR / "segoeuib.ttf"

INK = "#102A43"
MUTED = "#627D98"
LINE = "#D9E2EC"
SURFACE = "#FFFFFF"
CANVAS = "#F7FAFC"
TEAL = "#0F8B8D"
TEAL_DARK = "#07545B"
TEAL_DEEP = "#053E46"
ORANGE = "#F78A1D"
BLUE = "#2563EB"
GREEN = "#16A34A"
RED = "#EF4444"
VIOLET = "#7C3AED"
SOFT_TEAL = "#E8F7F6"
SOFT_BLUE = "#EFF6FF"
SOFT_GREEN = "#ECFDF5"
SOFT_ORANGE = "#FFF4E8"
SOFT_RED = "#FEF2F2"


def f(size, bold=False):
    return ImageFont.truetype(str(SEMIBOLD if bold else REGULAR), size)


def t(draw, xy, value, size=12, color=INK, bold=False, anchor=None):
    draw.text(xy, str(value), font=f(size, bold), fill=color, anchor=anchor)


def rounded(draw, xy, fill=SURFACE, outline=LINE, radius=12, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def wrap(value, chars):
    words, lines, current = str(value).split(), [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and len(candidate) > chars:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def logo(draw, x, y, size=24, inverse=False):
    color = "#FFFFFF" if inverse else "#07616A"
    draw.line((x + 3, y + 21, x + 11, y + 7, x + 22, y + 23), fill=ORANGE, width=3)
    draw.ellipse((x + 8, y + 1, x + 18, y + 11), fill=TEAL)
    draw.ellipse((x + 1, y + 9, x + 10, y + 18), fill="#F2A13B")
    draw.line((x + 10, y + 9, x + 14, y + 19), fill=color, width=2)
    t(draw, (x + 29, y + 14), "Staffsy", size, color, True, "lm")


def icon(draw, x, y, kind, color=INK, scale=1.0):
    s = scale
    if kind == "menu":
        for n in range(3):
            draw.line((x, y + n * 5 * s, x + 17 * s, y + n * 5 * s), fill=color, width=max(1, int(1.5 * s)))
    elif kind == "grid":
        for dx, dy in ((0, 0), (8, 0), (0, 8), (8, 8)):
            draw.rounded_rectangle((x + dx * s, y + dy * s, x + (dx + 5) * s, y + (dy + 5) * s), radius=1, outline=color, width=1)
    elif kind == "user":
        draw.ellipse((x + 5 * s, y, x + 12 * s, y + 7 * s), outline=color, width=1)
        draw.arc((x + 1 * s, y + 6 * s, x + 16 * s, y + 17 * s), 180, 360, fill=color, width=1)
    elif kind == "calendar":
        draw.rounded_rectangle((x, y + 2 * s, x + 17 * s, y + 16 * s), radius=2, outline=color, width=1)
        draw.line((x, y + 6 * s, x + 17 * s, y + 6 * s), fill=color, width=1)
        draw.line((x + 5 * s, y, x + 5 * s, y + 5 * s), fill=color, width=1)
        draw.line((x + 12 * s, y, x + 12 * s, y + 5 * s), fill=color, width=1)
    elif kind == "document":
        draw.rounded_rectangle((x + 2 * s, y, x + 14 * s, y + 17 * s), radius=1, outline=color, width=1)
        draw.line((x + 5 * s, y + 7 * s, x + 12 * s, y + 7 * s), fill=color, width=1)
        draw.line((x + 5 * s, y + 11 * s, x + 12 * s, y + 11 * s), fill=color, width=1)
    elif kind == "chart":
        draw.line((x + 2 * s, y + 16 * s, x + 2 * s, y + 4 * s), fill=color, width=1)
        draw.line((x + 2 * s, y + 16 * s, x + 16 * s, y + 16 * s), fill=color, width=1)
        draw.line((x + 5 * s, y + 13 * s, x + 8 * s, y + 9 * s, x + 11 * s, y + 11 * s, x + 15 * s, y + 5 * s), fill=color, width=1)
    elif kind == "settings":
        draw.ellipse((x + 4 * s, y + 4 * s, x + 13 * s, y + 13 * s), outline=color, width=1)
        for dx, dy in ((8, 0), (8, 17), (0, 8), (17, 8)):
            draw.line((x + dx * s, y + dy * s, x + 8 * s, y + 8 * s), fill=color, width=1)
    elif kind == "search":
        draw.ellipse((x, y, x + 11 * s, y + 11 * s), outline=color, width=1)
        draw.line((x + 9 * s, y + 9 * s, x + 16 * s, y + 16 * s), fill=color, width=1)
    elif kind == "bell":
        draw.arc((x + 2 * s, y + 2 * s, x + 15 * s, y + 16 * s), 180, 360, fill=color, width=1)
        draw.line((x + 2 * s, y + 9 * s, x + 2 * s, y + 15 * s, x + 15 * s, y + 15 * s, x + 15 * s, y + 9 * s), fill=color, width=1)
        draw.ellipse((x + 7 * s, y + 16 * s, x + 10 * s, y + 19 * s), fill=color)
    elif kind == "mail":
        draw.rounded_rectangle((x + 1 * s, y + 3 * s, x + 16 * s, y + 14 * s), radius=1, outline=color, width=1)
        draw.line((x + 2 * s, y + 4 * s, x + 8 * s, y + 9 * s, x + 15 * s, y + 4 * s), fill=color, width=1)
    elif kind == "help":
        draw.ellipse((x + 1 * s, y + 1 * s, x + 16 * s, y + 16 * s), outline=color, width=1)
        t(draw, (x + 8.5 * s, y + 8.5 * s), "?", max(7, int(9 * s)), color, True, "mm")
    elif kind == "more":
        for n in range(3):
            draw.ellipse((x + n * 5 * s, y, x + n * 5 * s + 2 * s, y + 2 * s), fill=color)
    else:
        draw.ellipse((x + 1 * s, y + 1 * s, x + 15 * s, y + 15 * s), outline=color, width=1)


def chip(draw, x, y, label, fill=SOFT_TEAL, color=TEAL, width=None):
    width = width or max(54, len(label) * 6 + 22)
    rounded(draw, (x, y, x + width, y + 24), fill, fill, 12)
    t(draw, (x + width / 2, y + 12), label, 9, color, True, "mm")
    return width


def top_header(draw, title, subtitle):
    draw.rectangle((0, 0, 1536, 68), fill=SURFACE)
    logo(draw, 24, 19, 25)
    draw.line((196, 17, 196, 52), fill=LINE, width=1)
    t(draw, (216, 20), title, 18, INK, True)
    t(draw, (216, 45), subtitle, 10, MUTED)
    badges = [("Human Centered", SOFT_TEAL, TEAL), ("AI Powered", SOFT_ORANGE, "#AA530C"), ("Intelligent", SOFT_BLUE, BLUE), ("Scalable", SOFT_GREEN, GREEN), ("Accessible", "#F1F5F9", INK)]
    x = 820
    for label, fill, color in badges:
        width = chip(draw, x, 22, label, fill, color)
        x += width + 10
    rounded(draw, (1415, 16, 1518, 52), SURFACE, LINE, 8)
    t(draw, (1466, 34), "Light Theme", 9, INK, True, "mm")


def annotation_panel(draw, x, y, w, h, title, paragraphs, bullets, section="PURPOSE"):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 8)
    t(draw, (x + 16, y + 25), title, 12, TEAL_DARK, True)
    yy = y + 52
    for paragraph in paragraphs:
        for line in wrap(paragraph, 31):
            t(draw, (x + 16, yy), line, 10, MUTED)
            yy += 17
        yy += 7
    if bullets:
        t(draw, (x + 16, yy), section, 11, TEAL_DARK, True)
        yy += 24
        for bullet in bullets:
            draw.ellipse((x + 17, yy + 4, x + 23, yy + 10), outline=TEAL, width=1)
            for line_index, line in enumerate(wrap(bullet, 28)):
                t(draw, (x + 32, yy + line_index * 14), line, 9, MUTED)
            yy += 19 + 14 * (len(wrap(bullet, 28)) - 1)


def board_left_desktop(draw, screen):
    x, y, w = 10, 82, 272
    annotation_panel(
        draw, x, y, w, 620, "TEMPLATE OVERVIEW",
        [f"{screen[3]} is the {screen[4]} workspace for governed HR operations. It keeps the primary work queue, context, and next action visible."],
        ["Role-aware workspace with clear ownership", "Operational information is scannable", "Sensitive actions stay permission-controlled", "Downstream impact remains visible"],
        "KEY PURPOSE",
    )
    rounded(draw, (x, 714, x + w, 968), SURFACE, LINE, 8)
    t(draw, (x + 16, 739), "ANATOMY", 11, TEAL_DARK, True)
    anatomy = ["Top command bar", "Left navigation", "Workspace title and action", "Today’s focus banner", "KPI overview", "Primary work surface", "Selected context", "Operational queues", "Annotation rail"]
    for i, label in enumerate(anatomy, 1):
        yy = 766 + (i - 1) * 21
        draw.ellipse((x + 16, yy - 2, x + 31, yy + 13), fill=TEAL)
        t(draw, (x + 23.5, yy + 5.5), str(i), 8, "#FFFFFF", True, "mm")
        t(draw, (x + 42, yy + 5), label, 9, MUTED, False, "lm")


def board_right_desktop(draw, screen):
    x, y, w = 1338, 82, 188
    rounded(draw, (x, y, x + w, 968), SURFACE, LINE, 8)
    t(draw, (x + 14, y + 25), "DESIGN ANNOTATIONS", 11, TEAL_DARK, True)
    for i, note in enumerate(screen[10][:7], 1):
        yy = y + 50 + (i - 1) * 72
        draw.ellipse((x + 14, yy, x + 34, yy + 20), fill=TEAL)
        t(draw, (x + 24, yy + 10), str(i), 9, "#FFFFFF", True, "mm")
        lines = wrap(note, 20)[:3]
        for j, line in enumerate(lines):
            t(draw, (x + 44, yy + 2 + j * 13), line, 8, INK if j == 0 else MUTED, j == 0)
    spec_y = 602
    t(draw, (x + 14, spec_y), "LAYOUT SPECIFICATIONS", 10, TEAL_DARK, True)
    for i, (label, value) in enumerate([("Template", screen[6]), ("Container", "1440 px"), ("Sidebar", "240 px"), ("Grid", "12 columns"), ("Radius", "16 px"), ("Spacing", "8 px")]):
        yy = spec_y + 25 + i * 26
        t(draw, (x + 14, yy), label, 8, MUTED)
        t(draw, (x + w - 14, yy), value, 8, INK, True, "ra")
        draw.line((x + 14, yy + 13, x + w - 14, yy + 13), fill="#EDF2F7", width=1)


def product_sidebar(draw, x, y, h, screen):
    rounded(draw, (x, y, x + 174, y + h), TEAL_DEEP, TEAL_DEEP, 8)
    logo(draw, x + 18, y + 18, 17, True)
    draw.line((x + 16, y + 55, x + 158, y + 55), fill="#2B6970", width=1)
    group = screen[4].upper()
    t(draw, (x + 18, y + 78), group, 8, "#9DD9D3", True)
    nav = [("Overview", "grid"), ("People & records", "user"), ("Work queue", "document"), ("Reports", "chart"), ("Audit & logs", "settings")]
    for i, (label, glyph) in enumerate(nav):
        yy = y + 94 + i * 39
        fill = TEAL if i == 0 else "#0A4A53"
        rounded(draw, (x + 10, yy, x + 164, yy + 30), fill, fill, 7)
        icon(draw, x + 20, yy + 7, glyph, "#FFFFFF" if i == 0 else "#D7EEF0", 0.85)
        t(draw, (x + 44, yy + 15), label, 9, "#FFFFFF" if i == 0 else "#D7EEF0", i == 0, "lm")
    t(draw, (x + 18, y + 309), "WORKSPACE", 8, "#9DD9D3", True)
    for i, (label, glyph) in enumerate([("Saved views", "document"), ("Configuration", "settings"), ("Help center", "more")]):
        yy = y + 332 + i * 31
        icon(draw, x + 20, yy, glyph, "#D7EEF0", 0.75)
        t(draw, (x + 44, yy + 8), label, 9, "#D7EEF0", False, "lm")
    draw.line((x + 16, y + h - 54, x + 158, y + h - 54), fill="#2B6970", width=1)
    t(draw, (x + 18, y + h - 36), "Rahul Sharma", 9, "#FFFFFF", True)
    t(draw, (x + 18, y + h - 20), f"{screen[4]} Lead", 8, "#9DD9D3")


def status_colors(value):
    value = value.lower()
    if any(v in value for v in ("blocked", "risk", "conflict", "missing", "overdue")):
        return SOFT_RED, RED
    if any(v in value for v in ("pending", "review", "draft", "approval", "awaiting")):
        return SOFT_ORANGE, "#AA530C"
    if any(v in value for v in ("future", "planned", "scheduled")):
        return SOFT_BLUE, BLUE
    return SOFT_GREEN, GREEN


def work_surface(draw, x, y, w, h, screen):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 10)
    t(draw, (x + 16, y + 24), screen[7], 12, INK, True)
    t(draw, (x + w - 51, y + 24), "View all", 8, TEAL, True, "rm")
    t(draw, (x + 16, y + 43), "Single source of truth with clear ownership and status.", 8, MUTED)
    draw.line((x + 16, y + 60, x + w - 16, y + 60), fill=LINE, width=1)
    t(draw, (x + 16, y + 78), "RECORD", 8, MUTED, True)
    t(draw, (x + w * 0.55, y + 78), "CONTEXT", 8, MUTED, True)
    t(draw, (x + w - 82, y + 78), "STATUS", 8, MUTED, True)
    for i, row in enumerate(screen[9]):
        parts = [part.strip() for part in row.split("|")]
        yy = y + 108 + i * 39
        t(draw, (x + 16, yy), parts[0][:24], 8, INK, True)
        t(draw, (x + w * 0.55, yy), " | ".join(parts[1:-1])[:34], 8, MUTED)
        fill, color = status_colors(parts[-1])
        chip(draw, x + w - 83, yy - 10, parts[-1][:12], fill, color, 68)
        draw.line((x + 16, yy + 19, x + w - 16, yy + 19), fill="#EDF2F7", width=1)


def selected_context(draw, x, y, w, h):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 10)
    t(draw, (x + 16, y + 24), "Selected record", 12, INK, True)
    t(draw, (x + w - 14, y + 24), "Open history", 8, TEAL, True, "ra")
    draw.ellipse((x + 16, y + 49, x + 51, y + 84), fill="#D9F1ED")
    t(draw, (x + 33.5, y + 66), "AS", 9, TEAL, True, "mm")
    t(draw, (x + 61, y + 58), "Ananya Kapoor", 10, INK, True)
    t(draw, (x + 61, y + 73), "EMP001234 | Selected record", 8, MUTED)
    for i, (label, value) in enumerate([("Owner", "People Operations"), ("Last action", "Updated today"), ("Next action", "Review and route"), ("Control state", "Governed")]):
        yy = y + 111 + i * 34
        t(draw, (x + 16, yy), label, 8, MUTED)
        if label == "Control state":
            chip(draw, x + w - 76, yy - 10, value, SOFT_BLUE, BLUE, 60)
        else:
            t(draw, (x + w - 16, yy), value, 8, INK, True, "ra")
        draw.line((x + 16, yy + 17, x + w - 16, yy + 17), fill="#EDF2F7", width=1)
    rounded(draw, (x + 16, y + h - 47, x + 115, y + h - 16), TEAL, TEAL, 7)
    t(draw, (x + 65, y + h - 31), "Review record", 8, "#FFFFFF", True, "mm")
    rounded(draw, (x + 124, y + h - 47, x + 202, y + h - 16), SURFACE, LINE, 7)
    t(draw, (x + 163, y + h - 31), "View audit", 8, INK, True, "mm")


def mini_panel(draw, x, y, w, h, title, rows):
    rounded(draw, (x, y, x + w, y + h), SURFACE, LINE, 10)
    t(draw, (x + 14, y + 22), title, 10, INK, True)
    t(draw, (x + w - 14, y + 22), "View all", 8, TEAL, True, "ra")
    for i, (label, value) in enumerate(rows):
        yy = y + 55 + i * 35
        t(draw, (x + 14, yy), label, 8, MUTED)
        t(draw, (x + w - 14, yy), value, 8, TEAL, True, "ra")
        draw.line((x + 14, yy + 16, x + w - 14, yy + 16), fill="#EDF2F7", width=1)


def desktop_board(screen):
    image = Image.new("RGB", (1536, 1024), CANVAS)
    draw = ImageDraw.Draw(image)
    top_header(draw, f"{screen[1]}  {screen[3]}", f"{screen[4]}  |  Enterprise HRMS")
    board_left_desktop(draw, screen)
    board_right_desktop(draw, screen)

    app_x, app_y, app_w, app_h = 294, 82, 1032, 886
    rounded(draw, (app_x, app_y, app_x + app_w, app_y + app_h), SURFACE, LINE, 8)
    icon(draw, app_x + 20, app_y + 18, "menu", INK, 1)
    logo(draw, app_x + 53, app_y + 17, 20)
    rounded(draw, (app_x + 205, app_y + 13, app_x + 560, app_y + 44), "#FAFCFE", LINE, 7)
    icon(draw, app_x + 218, app_y + 22, "search", MUTED, 0.8)
    t(draw, (app_x + 241, app_y + 28), "Search people, documents, policies or ask Staffsy...", 8, MUTED, False, "lm")
    rounded(draw, (app_x + 644, app_y + 13, app_x + 753, app_y + 44), TEAL, TEAL, 7)
    icon(draw, app_x + 657, app_y + 22, "more", "#FFFFFF", 1)
    t(draw, (app_x + 683, app_y + 28), "Ask Staffsy AI", 8, "#FFFFFF", True, "lm")
    icon(draw, app_x + 783, app_y + 20, "bell", INK, 0.9)
    chip(draw, app_x + 795, app_y + 7, "3", SOFT_RED, RED, 17)
    icon(draw, app_x + 832, app_y + 20, "document", INK, 0.9)
    chip(draw, app_x + 844, app_y + 7, "2", SOFT_RED, RED, 17)
    icon(draw, app_x + 884, app_y + 19, "more", INK, 1)
    draw.ellipse((app_x + 927, app_y + 13, app_x + 961, app_y + 47), fill="#DCE6EC")
    t(draw, (app_x + 944, app_y + 30), "RS", 9, TEAL_DARK, True, "mm")
    t(draw, (app_x + 973, app_y + 24), "Rahul Sharma", 8, INK, True)
    t(draw, (app_x + 973, app_y + 37), "People Operations Lead", 7, MUTED)
    draw.line((app_x, app_y + 60, app_x + app_w, app_y + 60), fill=LINE, width=1)

    product_sidebar(draw, app_x + 10, app_y + 70, app_h - 84, screen)
    main_x = app_x + 194
    main_w = app_w - 214
    t(draw, (main_x, app_y + 85), f"Staffsy / {screen[4]} / {screen[3]}", 8, MUTED)
    t(draw, (main_x, app_y + 111), screen[3], 22, INK, True)
    t(draw, (main_x, app_y + 137), f"A governed workspace for {screen[7].lower()}.", 8, MUTED)
    rounded(draw, (main_x + main_w - 192, app_y + 92, main_x + main_w - 82, app_y + 128), TEAL, TEAL, 7)
    t(draw, (main_x + main_w - 137, app_y + 110), "Primary action", 8, "#FFFFFF", True, "mm")
    rounded(draw, (main_x + main_w - 73, app_y + 92, main_x + main_w - 16, app_y + 128), SURFACE, LINE, 7)
    icon(draw, main_x + main_w - 54, app_y + 104, "more", INK, 0.9)
    rounded(draw, (main_x, app_y + 154, main_x + main_w, app_y + 195), SOFT_ORANGE, "#FFD9AA", 9)
    t(draw, (main_x + 13, app_y + 175), "Today's focus:", 8, "#B45309", True)
    t(draw, (main_x + 80, app_y + 175), "Review assigned work, clear blockers, and keep downstream teams informed.", 8, "#8A4B11")
    t(draw, (main_x + main_w - 72, app_y + 175), "10 min ago", 7, "#9A3412")
    rounded(draw, (main_x, app_y + 207, main_x + main_w, app_y + 248), SURFACE, LINE, 9)
    rounded(draw, (main_x + 12, app_y + 215, main_x + 360, app_y + 240), "#FAFCFE", LINE, 6)
    icon(draw, main_x + 22, app_y + 220, "search", MUTED, 0.65)
    t(draw, (main_x + 42, app_y + 228), "Search records, people, policies or commands...", 8, MUTED, False, "lm")
    for i, label in enumerate(["All entities", "Last 30 days", "Filters"]):
        chip(draw, main_x + 380 + i * 104, app_y + 216, label, SURFACE, INK, 92)

    kpi_y = app_y + 261
    kpi_w = (main_w - 30) / 4
    for i, kpi in enumerate(screen[8]):
        x = main_x + i * (kpi_w + 10)
        rounded(draw, (x, kpi_y, x + kpi_w, kpi_y + 84), SURFACE, LINE, 9)
        t(draw, (x + 13, kpi_y + 18), kpi[0], 8, MUTED)
        draw.ellipse((x + kpi_w - 24, kpi_y + 14, x + kpi_w - 16, kpi_y + 22), fill=TEAL)
        t(draw, (x + 13, kpi_y + 51), kpi[1], 20, INK, True)
        t(draw, (x + 13, kpi_y + 69), kpi[2], 8, MUTED)

    content_y = kpi_y + 96
    work_surface(draw, main_x, content_y, 476, 301, screen)
    selected_context(draw, main_x + 488, content_y, main_w - 488, 301)
    lower_y = content_y + 316
    mini_panel(draw, main_x, lower_y, 220, 150, "Action queue", [("Items requiring review", "12"), ("Approvals due today", "06"), ("Recently completed", "28")])
    mini_panel(draw, main_x + 232, lower_y, 220, 150, "Downstream impact", [("Payroll impacted", "12"), ("Access impacted", "08"), ("Reports impacted", "05")])
    mini_panel(draw, main_x + 464, lower_y, main_w - 464, 150, "Recent activity", [("Bulk update initiated", "10:30"), ("Record verified", "09:47"), ("New employee created", "Yesterday")])
    draw.rectangle((0, 982, 1536, 1024), fill=SURFACE)
    draw.line((0, 982, 1536, 982), fill=LINE, width=1)
    t(draw, (24, 1004), f"Staffsy Design System v1.0  |  {screen[1]}  |  Source mockup-backed", 8, MUTED, False, "lm")
    t(draw, (768, 1004), "Consistent. Scalable. Built for the future of work.", 8, MUTED, False, "mm")
    t(draw, (1510, 1004), "Desktop 1440 x 900", 8, MUTED, False, "rm")
    return image


def statutory_hro_board(screen):
    """Render PAY-SCR-004 using the HRO-SCR-001 master-data workbench anatomy."""
    image = Image.new("RGB", (1536, 1024), "#F7FAFC")
    draw = ImageDraw.Draw(image)

    # Canonical HRO global header: role controls replace generic capability badges.
    draw.rectangle((0, 0, 1536, 68), fill=SURFACE)
    logo(draw, 20, 18, 25)
    draw.line((171, 16, 171, 53), fill=LINE, width=1)
    t(draw, (198, 19), "PAY-SCR-004  Statutory Workbench", 18, INK, True)
    t(draw, (198, 45), "Payroll Operations Hub  ·  Enterprise HRMS", 10, MUTED)
    for x, label, glyph, width, color in [
        (816, "Payroll Ops", "user", 102, TEAL),
        (929, "Alerts", "settings", 98, RED),
        (1038, "Tasks", "document", 96, "#AA530C"),
    ]:
        rounded(draw, (x, 16, x + width, 52), SURFACE, LINE, 8)
        icon(draw, x + 13, 26, glyph, color, 0.72)
        t(draw, (x + 35, 34), label, 8, INK, True, "lm")
        if label == "Alerts":
            chip(draw, x + width - 31, 23, "12", SOFT_RED, RED, 24)
        elif label == "Tasks":
            chip(draw, x + width - 31, 23, "23", SOFT_ORANGE, "#AA530C", 24)
    rounded(draw, (1308, 16, 1444, 52), SURFACE, LINE, 8)
    icon(draw, 1322, 27, "settings", TEAL_DARK, 0.8)
    t(draw, (1348, 34), "Design System v1.0", 9, TEAL_DARK, True, "lm")

    # Product frame and canonical dark navigation rail.
    rounded(draw, (15, 68, 1281, 968), SURFACE, LINE, 8)
    rounded(draw, (15, 68, 185, 852), TEAL_DEEP, TEAL_DEEP, 8)
    logo(draw, 33, 84, 18, True)
    draw.line((31, 113, 169, 113), fill="#2B6970", width=1)
    t(draw, (33, 138), "PAYROLL OPERATIONS HUB", 8, "#9DD9D3", True)
    nav = [
        ("Workbench", "grid", True, "8"),
        ("Payroll runs", "chart", False, ""),
        ("Validation queue", "document", False, "28"),
        ("Statutory filings", "calendar", False, "6"),
        ("Compliance calendar", "calendar", False, ""),
        ("Attendance", "user", False, ""),
        ("Audit & logs", "settings", False, ""),
    ]
    for i, (label, glyph, active, badge) in enumerate(nav):
        yy = 155 + i * 38
        fill = TEAL if active else "#0A4A53"
        rounded(draw, (25, yy, 175, yy + 31), fill, fill, 7)
        icon(draw, 36, yy + 7, glyph, "#FFFFFF" if active else "#D7EEF0", 0.82)
        t(draw, (60, yy + 15), label, 9, "#FFFFFF" if active else "#D7EEF0", active, "lm")
        if badge:
            chip(draw, 150, yy + 4, badge, SOFT_RED if badge != "8" else "#0A4A53", RED if badge != "8" else "#FFFFFF", 20)
    draw.line((31, 438, 169, 438), fill="#2B6970", width=1)
    t(draw, (33, 460), "CONFIGURATION", 8, "#9DD9D3", True)
    config = [("Payroll rules", "settings"), ("Jurisdictions", "grid"), ("Evidence policies", "document"), ("Integrations", "settings")]
    for i, (label, glyph) in enumerate(config):
        yy = 482 + i * 31
        icon(draw, 36, yy, glyph, "#D7EEF0", 0.78)
        t(draw, (60, yy + 8), label, 9, "#D7EEF0", False, "lm")
    draw.line((31, 635, 169, 635), fill="#2B6970", width=1)
    t(draw, (33, 657), "INSIGHTS", 8, "#9DD9D3", True)
    for i, (label, glyph) in enumerate([("Dashboards", "chart"), ("Reports", "document"), ("Data quality", "settings")]):
        yy = 679 + i * 31
        icon(draw, 36, yy, glyph, "#D7EEF0", 0.78)
        t(draw, (60, yy + 8), label, 9, "#D7EEF0", False, "lm")
    draw.line((31, 814, 169, 814), fill="#2B6970", width=1)
    draw.ellipse((33, 833, 61, 861), fill="#DCE6EC")
    t(draw, (47, 847), "RS", 8, TEAL_DARK, True, "mm")
    t(draw, (70, 842), "Rahul Sharma", 8, "#FFFFFF", True)
    t(draw, (70, 855), "Payroll Operations Lead", 7, "#9DD9D3")

    # Inner command bar mirrors the HRO header controls.
    main_x = 185
    draw.line((main_x, 130, 1281, 130), fill=LINE, width=1)
    rounded(draw, (211, 82, 640, 112), "#FAFCFE", LINE, 7)
    icon(draw, 223, 91, "search", MUTED, 0.8)
    t(draw, (247, 97), "Search filings, jurisdictions, entities or rules...", 8, MUTED, False, "lm")
    rounded(draw, (807, 82, 943, 114), TEAL, TEAL, 7)
    draw.line((821, 98, 829, 98), fill="#FFFFFF", width=1)
    draw.line((825, 94, 825, 102), fill="#FFFFFF", width=1)
    t(draw, (838, 98), "Create filing", 8, "#FFFFFF", True, "lm")
    draw.line((924, 96, 928, 100), fill="#FFFFFF", width=1)
    draw.line((928, 100, 932, 96), fill="#FFFFFF", width=1)
    rounded(draw, (956, 82, 1101, 114), SURFACE, LINE, 7)
    icon(draw, 969, 91, "settings", TEAL_DARK, 0.7)
    t(draw, (994, 98), "Review exceptions", 8, INK, True, "lm")
    chip(draw, 1070, 88, "8", SOFT_ORANGE, "#AA530C", 21)
    icon(draw, 1164, 88, "bell", INK, 0.85)
    chip(draw, 1174, 75, "12", SOFT_RED, RED, 20)
    icon(draw, 1206, 88, "mail", INK, 0.85)
    chip(draw, 1216, 75, "6", SOFT_RED, RED, 20)
    icon(draw, 1250, 88, "help", INK, 0.85)

    content_x = 211
    content_w = 1044
    t(draw, (content_x, 152), "Statutory Workbench", 20, INK, True)
    t(draw, (content_x, 177), "Real-time statutory filing readiness, evidence, and ownership across jurisdictions", 9, MUTED)

    # HRO-style action band with three compact operational indicators.
    rounded(draw, (content_x, 190, content_x + content_w, 236), "#FFFDF9", "#FFD9AA", 8)
    draw.ellipse((230, 200, 249, 219), fill=SOFT_RED, outline=RED, width=1)
    t(draw, (239.5, 209.5), "!", 10, RED, True, "mm")
    t(draw, (264, 203), "Filing blockers", 9, INK, True)
    t(draw, (264, 217), "Require correction before submission", 8, MUTED)
    t(draw, (482, 208), "2", 14, RED, True, "mm")
    draw.line((531, 200, 531, 226), fill=LINE, width=1)
    icon(draw, 552, 201, "document", ORANGE, 0.9)
    t(draw, (579, 203), "Evidence missing", 9, INK, True)
    t(draw, (579, 217), "Awaiting supporting documents", 8, MUTED)
    t(draw, (791, 208), "3", 14, "#AA530C", True, "mm")
    draw.line((840, 200, 840, 226), fill=LINE, width=1)
    icon(draw, 860, 201, "calendar", RED, 0.9)
    t(draw, (887, 203), "Due this week", 9, INK, True)
    t(draw, (887, 217), "Jurisdiction deadlines at risk", 8, MUTED)
    t(draw, (1145, 208), "5", 14, RED, True, "mm")

    # Search and filter strip.
    rounded(draw, (content_x, 247, content_x + content_w, 287), SURFACE, LINE, 8)
    rounded(draw, (221, 255, 514, 279), "#FAFCFE", LINE, 6)
    icon(draw, 232, 262, "search", MUTED, 0.65)
    t(draw, (252, 267), "Search by filing, entity, state, period...", 8, MUTED, False, "lm")
    for i, label in enumerate(["Period: Jun 2026", "Jurisdiction: All", "Status: All"]):
        chip(draw, 532 + i * 151, 255, label, SURFACE, INK, 138)
    t(draw, (1192, 267), "Filters", 8, TEAL, True, "lm")
    icon(draw, 1230, 260, "settings", TEAL, 0.7)

    # Five HRO-style KPI cards.
    kpis = [("Returns due", "06", "This month", RED), ("Ready to file", "04", "Evidence complete", GREEN), ("Blocked filings", "02", "Needs correction", RED), ("Penalties at risk", "01", "Escalate", ORANGE), ("Evidence coverage", "92%", "Across entities", BLUE)]
    kpi_w = 194
    for i, (label, value, note, color) in enumerate(kpis):
        x = content_x + i * 210
        rounded(draw, (x, 299, x + kpi_w, 383), SURFACE, LINE, 9)
        draw.ellipse((x + 14, 316, x + 44, 346), fill=SOFT_BLUE if color == BLUE else (SOFT_GREEN if color == GREEN else (SOFT_ORANGE if color == ORANGE else SOFT_RED)))
        icon(draw, x + 21, 323, "calendar" if i != 2 else "settings", color, 0.75)
        t(draw, (x + 56, 320), label, 8, MUTED)
        t(draw, (x + 14, 365), value, 20, INK, True)
        t(draw, (x + 56, 365), note, 8, MUTED)

    # Dense workbench plus selected filing context, matching HRO's center split.
    grid_y = 396
    rounded(draw, (content_x, grid_y, 661, 699), SURFACE, LINE, 9)
    t(draw, (content_x + 16, grid_y + 22), "Statutory Filing Grid", 12, INK, True)
    t(draw, (content_x + 16, grid_y + 41), "Single source of truth for jurisdiction filing readiness", 8, MUTED)
    t(draw, (content_x + 531, grid_y + 22), "Columns", 8, TEAL, True)
    for i, label in enumerate(["All entities", "All jurisdictions", "All periods"]):
        chip(draw, content_x + 16 + i * 115, grid_y + 54, label, SURFACE, INK, 104)
    draw.line((content_x + 16, grid_y + 93, 645, grid_y + 93), fill=LINE, width=1)
    headers = [("Filing", content_x + 18), ("Jurisdiction", content_x + 210), ("Due date", content_x + 320), ("Status", content_x + 406), ("Evidence", content_x + 480)]
    for label, x in headers:
        t(draw, (x, grid_y + 110), label, 7, MUTED, True)
    filing_rows = [("PF ECR", "Maharashtra", "15 Jul", "Ready", "Complete"), ("ESI return", "Karnataka", "15 Jul", "Blocked", "Missing"), ("PT return", "West Bengal", "31 Jul", "Ready", "Complete"), ("TDS statement", "All entities", "31 Jul", "Review", "Correction")]
    for i, row in enumerate(filing_rows):
        yy = grid_y + 140 + i * 38
        t(draw, (content_x + 18, yy), row[0], 8, INK, True)
        t(draw, (content_x + 210, yy), row[1], 8, MUTED)
        t(draw, (content_x + 320, yy), row[2], 8, MUTED)
        fill, color = status_colors(row[3])
        chip(draw, content_x + 397, yy - 10, row[3], fill, color, 55)
        fill, color = status_colors(row[4])
        chip(draw, content_x + 476, yy - 10, row[4], fill, color, 63)
        draw.line((content_x + 16, yy + 20, 645, yy + 20), fill="#EDF2F7", width=1)
    t(draw, (content_x + 16, grid_y + 278), "1–4 of 6 filings", 8, MUTED)
    t(draw, (content_x + 545, grid_y + 278), "Next  ›", 8, TEAL, True)

    selected_x = 674
    rounded(draw, (selected_x, grid_y, 1255, 699), SURFACE, LINE, 9)
    t(draw, (selected_x + 16, grid_y + 22), "Selected Filing Profile", 12, INK, True)
    chip(draw, selected_x + 485, grid_y + 12, "Blocked", SOFT_RED, RED, 60)
    t(draw, (selected_x + 16, grid_y + 54), "ESI return", 11, INK, True)
    t(draw, (selected_x + 16, grid_y + 72), "Karnataka  ·  Jun 2026  ·  Due 15 Jul", 8, MUTED)
    draw.line((selected_x + 16, grid_y + 92, 1239, grid_y + 92), fill=LINE, width=1)
    fields = [("Owner", "Payroll Operations"), ("Last action", "Evidence requested"), ("Next action", "Upload ESI challan"), ("Responsible entity", "Staffsy India Pvt Ltd"), ("Control state", "Governed")]
    for i, (label, value) in enumerate(fields):
        yy = grid_y + 119 + i * 34
        t(draw, (selected_x + 16, yy), label, 8, MUTED)
        if label == "Control state":
            chip(draw, 1155, yy - 10, value, SOFT_BLUE, BLUE, 74)
        else:
            t(draw, (1239, yy), value, 8, INK, True, "ra")
        draw.line((selected_x + 16, yy + 17, 1239, yy + 17), fill="#EDF2F7", width=1)
    rounded(draw, (selected_x + 16, grid_y + 266, selected_x + 123, grid_y + 298), TEAL, TEAL, 7)
    t(draw, (selected_x + 69, grid_y + 282), "Review filing", 8, "#FFFFFF", True, "mm")
    rounded(draw, (selected_x + 133, grid_y + 266, selected_x + 229, grid_y + 298), SURFACE, LINE, 7)
    t(draw, (selected_x + 181, grid_y + 282), "View audit", 8, INK, True, "mm")

    # Lower operational queues and audit timeline.
    lower_y = 712
    mini_panel(draw, content_x, lower_y, 302, 124, "Filing and evidence queue", [("Evidence missing", "02"), ("Due this week", "03"), ("Recently submitted", "18")])
    mini_panel(draw, content_x + 316, lower_y, 302, 124, "Downstream impact", [("Payroll impacted", "12"), ("Finance impacted", "08"), ("Reports impacted", "05")])
    mini_panel(draw, content_x + 632, lower_y, 297, 124, "Audit timeline", [("Evidence request", "10:30"), ("Filing assigned", "09:47"), ("Rule evaluated", "Yesterday")])

    # HRO-style annotation and principle rail.
    rounded(draw, (1306, 68, 1520, 726), SURFACE, LINE, 8)
    t(draw, (1322, 94), "DESIGN ANNOTATIONS & SPEC", 10, TEAL_DARK, True)
    notes = ["Top action band", "Search and filter strip", "KPI cards", "Statutory filing grid", "Selected filing profile", "Filing and evidence queue", "Downstream impact", "Audit timeline", "Compliance lenses"]
    for i, note in enumerate(notes):
        yy = 121 + i * 52
        draw.ellipse((1322, yy, 1342, yy + 20), fill=TEAL)
        t(draw, (1332, yy + 10), str(i + 1), 8, "#FFFFFF", True, "mm")
        t(draw, (1354, yy + 2), note, 8, INK, True)
        for j, line in enumerate(wrap(["Key operational controls and deadline risk.", "Global search with contextual filters.", "At-a-glance compliance metrics.", "Dense filing list with evidence state.", "Jurisdiction, owner, and next action.", "Missing evidence and due dates.", "Systems and processes affected.", "Chronological filing audit trail.", "Pinned views for quick oversight."][i], 25)[:2]):
            t(draw, (1354, yy + 15 + j * 12), line, 7, MUTED)
    rounded(draw, (1306, 740, 1520, 968), SURFACE, LINE, 8)
    t(draw, (1322, 767), "KEY PRINCIPLES", 10, TEAL_DARK, True)
    for i, (title, body) in enumerate([("Compliance by design", "Evidence and due dates stay visible."), ("Operational excellence", "Blockers are actionable, not hidden."), ("Data governance", "Receipts and decisions remain traceable."), ("User efficiency", "Filing work is grouped by owner.")]):
        yy = 800 + i * 39
        draw.ellipse((1322, yy, 1336, yy + 14), outline=TEAL, width=1)
        t(draw, (1346, yy + 1), title, 8, INK, True)
        t(draw, (1346, yy + 14), body, 7, MUTED)

    # Master data lens strip and footer complete the HRO pattern.
    rounded(draw, (15, 852, 1281, 968), SURFACE, LINE, 8)
    t(draw, (31, 876), "Compliance Lenses", 10, TEAL_DARK, True)
    t(draw, (31, 892), "Pre-built, customizable views for statutory operations", 8, MUTED)
    lenses = [("Due this week", "05", GREEN), ("Ready to file", "04", GREEN), ("Evidence gaps", "02", ORANGE), ("Overdue", "02", RED), ("Filing owners", "11", BLUE), ("Import batch", "03", ORANGE)]
    for i, (label, value, color) in enumerate(lenses):
        x = 145 + i * 182
        rounded(draw, (x, 871, x + 166, 943), SURFACE, LINE, 8)
        draw.ellipse((x + 12, 886, x + 38, 912), fill=SOFT_GREEN if color == GREEN else (SOFT_ORANGE if color == ORANGE else (SOFT_RED if color == RED else SOFT_BLUE)))
        icon(draw, x + 18, 892, "calendar", color, 0.7)
        t(draw, (x + 49, 889), label, 8, INK, True)
        t(draw, (x + 49, 908), value, 15, INK, True)
    draw.rectangle((0, 982, 1536, 1024), fill=SURFACE)
    draw.line((0, 982, 1536, 982), fill=LINE, width=1)
    t(draw, (24, 1004), "Staffsy Design System v1.0  |  PAY-SCR-004  |  Source mockup-backed", 8, MUTED, False, "lm")
    t(draw, (768, 1004), "Consistent. Scalable. Beautiful. Built for the future of work.", 8, MUTED, False, "mm")
    t(draw, (1510, 1004), "Desktop 1440 x 900", 8, MUTED, False, "rm")
    return image


def mobile_phone_ui(draw, x, y, w, h, screen):
    scale_x = w / 390
    scale_y = h / 844
    def sx(value): return x + int(value * scale_x)
    def sy(value): return y + int(value * scale_y)
    def sr(rect): return tuple(sx(rect[i]) if i % 2 == 0 else sy(rect[i]) for i in range(4))
    rounded(draw, sr((0, 0, 390, 844)), SURFACE, "#111827", 42, 8)
    rounded(draw, sr((7, 8, 383, 836)), "#FCFEFF", "#0B1117", 34, 2)
    t(draw, (sx(24), sy(28)), "9:41", 15, "#111827", True)
    draw.ellipse(sr((304, 19, 346, 37)), fill="#05070A")
    icon(draw, sx(28), sy(69), "menu", TEAL_DARK, 1)
    logo(draw, sx(75), sy(61), 18)
    icon(draw, sx(275), sy(67), "bell", INK, 1.0)
    chip(draw, sx(284), sy(51), "2", SOFT_RED, RED, int(18 * scale_x))
    icon(draw, sx(319), sy(67), "document", INK, 1.0)
    draw.ellipse(sr((348, 55, 373, 80)), fill="#DCE6EC")
    t(draw, (sx(360), sy(68)), "RS", 7, TEAL_DARK, True, "mm")
    draw.line((sx(12), sy(91), sx(378), sy(91)), fill=LINE, width=1)
    t(draw, (sx(24), sy(119)), screen[1], 8, MUTED, True)
    t(draw, (sx(24), sy(141)), screen[3], 17, INK, True)
    t(draw, (sx(24), sy(162)), "Operational workspace with clear next actions.", 8, MUTED)
    rounded(draw, sr((16, 180, 188, 215)), TEAL, TEAL, 9)
    t(draw, (sx(102), sy(197)), "Primary action", 9, "#FFFFFF", True, "mm")
    rounded(draw, sr((196, 180, 374, 215)), SURFACE, LINE, 9)
    t(draw, (sx(285), sy(197)), "More actions", 9, INK, True, "mm")
    rounded(draw, sr((16, 229, 374, 277)), SOFT_ORANGE, "#FFD9AA", 9)
    t(draw, (sx(27), sy(247)), "Today's focus: clear blockers and keep owners informed.", 8, "#8A4B11", True)
    t(draw, (sx(27), sy(264)), "Updated 10 min ago", 8, "#9A3412")
    rounded(draw, sr((16, 291, 374, 332)), SURFACE, LINE, 9)
    t(draw, (sx(27), sy(311)), "Search records, people, policies...", 8, MUTED, False, "lm")
    for i, kpi in enumerate(screen[8]):
        xx = 16 + (i % 2) * 184
        yy = 345 + (i // 2) * 67
        rounded(draw, sr((xx, yy, xx + 176, yy + 58)), SURFACE, LINE, 9)
        t(draw, (sx(xx + 10), sy(yy + 15)), kpi[0], 7, MUTED)
        t(draw, (sx(xx + 10), sy(yy + 42)), kpi[1], 17, INK, True)
        t(draw, (sx(xx + 165), sy(yy + 15)), kpi[2][:12], 6, TEAL, True, "ra")
    rounded(draw, sr((16, 487, 374, 667)), SURFACE, LINE, 10)
    t(draw, (sx(30), sy(511)), screen[7], 11, INK, True)
    t(draw, (sx(360), sy(511)), "View all", 8, TEAL, True, "ra")
    draw.line((sx(30), sy(529), sx(360), sy(529)), fill=LINE, width=1)
    for i, row in enumerate(screen[9][:4]):
        parts = [p.strip() for p in row.split("|")]
        yy = 553 + i * 28
        t(draw, (sx(30), sy(yy)), parts[0][:25], 8, INK, True)
        t(draw, (sx(30), sy(yy + 13)), " | ".join(parts[1:-1])[:34], 7, MUTED)
        draw.line((sx(30), sy(yy + 22), sx(360), sy(yy + 22)), fill="#EDF2F7", width=1)
    rounded(draw, sr((16, 683, 374, 782)), SURFACE, LINE, 10)
    t(draw, (sx(30), sy(707)), "Selected record", 11, INK, True)
    t(draw, (sx(360), sy(707)), "Open history", 8, TEAL, True, "ra")
    draw.ellipse(sr((30, 724, 58, 752)), fill="#D9F1ED")
    t(draw, (sx(44), sy(738)), "AS", 7, TEAL, True, "mm")
    t(draw, (sx(70), sy(736)), "Ananya Kapoor", 9, INK, True)
    t(draw, (sx(70), sy(751)), "EMP001234 | Selected record", 7, MUTED)
    draw.line((sx(30), sy(763), sx(360), sy(763)), fill="#EDF2F7", width=1)
    draw.rectangle(sr((7, 797, 383, 836)), fill=SURFACE)
    draw.line((sx(7), sy(797), sx(383), sy(797)), fill=LINE, width=1)
    for i, label in enumerate(["Home", "Tasks", "Search", "More"]):
        xx = 50 + i * 95
        draw.ellipse(sr((xx - 3, 808, xx + 3, 814)), fill=TEAL if i == 0 else LINE)
        t(draw, (sx(xx), sy(827)), label, 7, TEAL if i == 0 else MUTED, i == 0, "mm")


def mobile_board(screen):
    image = Image.new("RGB", (1024, 1536), CANVAS)
    draw = ImageDraw.Draw(image)
    top_header(draw, f"{screen[1]}  {screen[3]}", f"{screen[4]}  |  Mobile workspace")
    annotation_panel(draw, 18, 86, 208, 332, "PURPOSE", [f"A focused mobile workspace for {screen[3].lower()} with the next action close at hand."], ["Action-first self-service", "Role-aware and governed", "Cards stack for clarity", "Touch targets remain readable"], "KEY HIGHLIGHTS")
    rounded(draw, (18, 434, 226, 1118), SURFACE, LINE, 8)
    t(draw, (34, 460), "ANATOMY", 11, TEAL_DARK, True)
    anatomy = ["Top app bar", "Screen identity", "Primary actions", "Focus banner", "KPI cards", "Work queue", "Selected context", "Bottom navigation"]
    for i, label in enumerate(anatomy, 1):
        yy = 490 + (i - 1) * 31
        draw.ellipse((34, yy, 51, yy + 17), fill=TEAL)
        t(draw, (42.5, yy + 8.5), str(i), 8, "#FFFFFF", True, "mm")
        t(draw, (62, yy + 8), label, 9, MUTED, False, "lm")
    t(draw, (34, 785), "RESPONSIVE BEHAVIOR", 11, TEAL_DARK, True)
    for i, note in enumerate(["Optimized for mobile-first use", "Cards stack instead of shrinking", "Important actions stay above the fold", "Content reduces, not meaning"]):
        yy = 819 + i * 45
        icon(draw, 36, yy, "calendar", TEAL_DARK, 0.75)
        t(draw, (63, yy + 7), note, 9, MUTED, False, "lm")

    phone_x, phone_y, phone_w, phone_h = 252, 86, 520, 1320
    rounded(draw, (phone_x, phone_y, phone_x + phone_w, phone_y + phone_h), "#111827", "#111827", 52, 6)
    mobile_phone_ui(draw, phone_x + 17, phone_y + 18, phone_w - 34, phone_h - 36, screen)

    rounded(draw, (800, 86, 1006, 410), SURFACE, LINE, 8)
    t(draw, (818, 113), "DESIGN SPECS", 11, TEAL_DARK, True)
    for i, (label, value) in enumerate([("Screen size", "390 x 844 px"), ("Safe area", "Top 47 px / Bottom 34 px"), ("Corner radius", "20 px cards / 16 px buttons"), ("Spacing scale", "4, 8, 12, 16, 20, 24, 32")]):
        yy = 151 + i * 52
        t(draw, (818, yy), label, 9, MUTED, True)
        for j, line in enumerate(wrap(value, 26)):
            t(draw, (818, yy + 16 + j * 14), line, 9, INK)
    rounded(draw, (800, 430, 1006, 780), SURFACE, LINE, 8)
    t(draw, (818, 457), "COMPONENTS USED", 11, TEAL_DARK, True)
    for i, (label, glyph) in enumerate([("Top app bar", "menu"), ("KPI cards", "chart"), ("Work queue", "document"), ("Selected context", "user"), ("Bottom navigation", "grid")]):
        yy = 493 + i * 42
        icon(draw, 820, yy, glyph, TEAL_DARK, 0.8)
        t(draw, (850, yy + 8), label, 9, MUTED, False, "lm")
    rounded(draw, (800, 800, 1006, 1118), SURFACE, LINE, 8)
    t(draw, (818, 827), "QUICK NOTES", 11, TEAL_DARK, True)
    for i, note in enumerate(["Key action within one or two taps", "No dark text on dark surfaces", "AI remains contextual, not intrusive", "Cards use the approved 8px grid"]):
        yy = 865 + i * 48
        draw.ellipse((820, yy + 2, 830, yy + 12), outline=TEAL, width=1)
        t(draw, (842, yy + 7), note, 9, MUTED, False, "lm")
    rounded(draw, (800, 1138, 1006, 1410), SURFACE, LINE, 8)
    t(draw, (818, 1165), "COLOR PALETTE", 11, TEAL_DARK, True)
    for i, (label, color) in enumerate([("Primary teal", TEAL), ("Deep teal", TEAL_DEEP), ("Accent orange", ORANGE), ("Success green", GREEN), ("Info blue", BLUE), ("Visualization purple", VIOLET)]):
        yy = 1200 + i * 30
        draw.rectangle((820, yy, 838, yy + 18), fill=color)
        t(draw, (850, yy + 9), label, 9, MUTED, False, "lm")
    draw.rectangle((0, 1492, 1024, 1536), fill=SURFACE)
    draw.line((0, 1492, 1024, 1492), fill=LINE, width=1)
    t(draw, (24, 1514), "Staffsy Design System v1.0", 8, MUTED, False, "lm")
    t(draw, (512, 1514), "Consistent. Scalable. Beautiful. Built for the future of work.", 8, MUTED, False, "mm")
    t(draw, (1000, 1514), "Mobile 390 x 844", 8, MUTED, False, "rm")
    return image


def main():
    for batch, _, slug, *_ in SCREENS:
        out_dir = DESIGNS / batch
        out_dir.mkdir(parents=True, exist_ok=True)
        screen = next(s for s in SCREENS if s[2] == slug)
        desktop_renderer = statutory_hro_board if slug == "pay-scr-004-statutory-workbench" else desktop_board
        desktop_renderer(screen).save(out_dir / f"{slug}-desktop-final.png", "PNG", optimize=True)
        mobile_board(screen).save(out_dir / f"{slug}-mobile-final.png", "PNG", optimize=True)
    print(f"Rebuilt {len(SCREENS) * 2} presentation-board UI designs.")


if __name__ == "__main__":
    main()
