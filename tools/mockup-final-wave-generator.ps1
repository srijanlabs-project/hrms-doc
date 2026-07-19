$mockupDir = Join-Path $PSScriptRoot "..\docs\10-ui-ux-architecture\mockups"
$mockupDir = [System.IO.Path]::GetFullPath($mockupDir)

function Esc([string]$text) {
  if ($null -eq $text) { return "" }
  return $text.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;")
}

function Render-List([string[]]$items, [int]$x, [int]$y) {
  $out = @()
  for ($i = 0; $i -lt $items.Count; $i++) {
    $cy = $y + ($i * 22)
    $out += "<circle cx='$x' cy='$cy' r='3' fill='#2563EB'/>"
    $out += "<text x='$($x + 12)' y='$($cy + 4)' class='body'>$(Esc $items[$i])</text>"
  }
  return $out -join "`n"
}

function Render-Desktop($screen) {
  $nav = @()
  for ($i = 0; $i -lt $screen.sidebar.Count; $i++) {
    $y = 144 + ($i * 52)
    $fill = if ($i -eq 0) { "rgba(255,255,255,0.12)" } else { "rgba(255,255,255,0.04)" }
    $nav += "<rect x='40' y='$y' width='216' height='40' rx='12' fill='$fill'/>"
    $nav += "<text x='60' y='$($y + 24)' class='inverse'>$(Esc $screen.sidebar[$i])</text>"
  }

  $metrics = @()
  for ($i = 0; $i -lt $screen.metrics.Count; $i++) {
    $x = 296 + ($i * 222)
    $metric = $screen.metrics[$i]
    $metrics += @"
  <rect x="$x" y="302" width="198" height="92" rx="14" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1" filter="url(#shadow)"/>
  <rect x="$($x + 12)" y="314" width="44" height="44" rx="12" fill="$(Esc $metric.color)"/>
  <text x="$($x + 68)" y="332" class="small">$(Esc $metric.label)</text>
  <text x="$($x + 68)" y="362" class="metric">$(Esc $metric.value)</text>
"@
  }

  $annos = @()
  for ($i = 0; $i -lt $screen.annotations.Count; $i++) {
    $cy = 204 + ($i * 54)
    $n = $i + 1
    $annos += @"
  <circle cx="1202" cy="$cy" r="12" fill="#2563EB"/>
  <text x="1202" y="$($cy + 4)" class="inverse" text-anchor="middle">$n</text>
  <text x="1224" y="$($cy + 2)" class="annoTitle">$(Esc $screen.annotationTitles[$i])</text>
  <text x="1224" y="$($cy + 20)" class="annoText">$(Esc $screen.annotations[$i])</text>
"@
  }

  return @"
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1280" viewBox="0 0 1440 1280" fill="none">
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
  <rect width="1440" height="1280" fill="#F4F7FB"/>
  <rect x="24" y="24" width="248" height="1232" rx="24" fill="#10324A" filter="url(#shadow)"/>
  <text x="52" y="72" class="inverse">$(Esc $screen.sidebarTitle)</text>
  <rect x="48" y="92" width="200" height="36" rx="12" fill="rgba(255,255,255,0.10)"/>
  <text x="62" y="116" class="inverse">Enterprise HRMS</text>
  $($nav -join "`n")

  <rect x="296" y="24" width="1120" height="64" rx="20" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1" filter="url(#shadow)"/>
  <rect x="320" y="40" width="360" height="32" rx="16" fill="#F8FAFC" stroke="#D9E2EC" stroke-width="1"/>
  <text x="338" y="61" class="small">$(Esc $screen.searchHint)</text>
  <rect x="1060" y="40" width="92" height="28" rx="14" fill="#EAF2F8"/>
  <text x="1106" y="58" class="small" text-anchor="middle">$(Esc $screen.topPill1)</text>
  <rect x="1164" y="40" width="96" height="28" rx="14" fill="#FDEAD7"/>
  <text x="1212" y="58" class="small" text-anchor="middle">$(Esc $screen.topPill2)</text>
  <rect x="1272" y="40" width="116" height="28" rx="14" fill="#E3F2FD"/>
  <text x="1330" y="58" class="small" text-anchor="middle">$(Esc $screen.topPill3)</text>

  <text x="310" y="128" class="title">$(Esc $screen.title)</text>
  <rect x="296" y="152" width="132" height="28" rx="14" fill="#DBEAFE"/>
  <text x="362" y="170" class="small" text-anchor="middle">$(Esc $screen.hero1)</text>
  <circle cx="312" cy="166" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="312" y="171" class="inverse" text-anchor="middle">1</text>
  <rect x="440" y="152" width="132" height="28" rx="14" fill="#FEF3C7"/>
  <text x="506" y="170" class="small" text-anchor="middle">$(Esc $screen.hero2)</text>
  <rect x="584" y="152" width="148" height="28" rx="14" fill="#DCFCE7"/>
  <text x="658" y="170" class="small" text-anchor="middle">$(Esc $screen.hero3)</text>
  <rect x="808" y="146" width="168" height="40" rx="14" fill="#2563EB"/>
  <text x="892" y="172" class="inverse" text-anchor="middle">$(Esc $screen.primaryAction)</text>
  <circle cx="820" cy="146" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="820" y="151" class="inverse" text-anchor="middle">2</text>
  <rect x="988" y="146" width="170" height="40" rx="14" fill="#0F766E"/>
  <text x="1073" y="172" class="inverse" text-anchor="middle">$(Esc $screen.secondaryAction)</text>

  <rect x="296" y="206" width="862" height="76" rx="18" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1" filter="url(#shadow)"/>
  <rect x="320" y="226" width="520" height="36" rx="18" fill="#F8FAFC" stroke="#D9E2EC" stroke-width="1"/>
  <text x="338" y="249" class="body">$(Esc $screen.subSearch)</text>
  <rect x="856" y="226" width="86" height="28" rx="14" fill="#EAF2F8"/>
  <text x="899" y="244" class="small" text-anchor="middle">$(Esc $screen.filter1)</text>
  <rect x="952" y="226" width="98" height="28" rx="14" fill="#EAF2F8"/>
  <text x="1001" y="244" class="small" text-anchor="middle">$(Esc $screen.filter2)</text>
  <rect x="1060" y="226" width="92" height="28" rx="14" fill="#10324A"/>
  <text x="1106" y="244" class="inverse" text-anchor="middle">$(Esc $screen.filter3)</text>
  <circle cx="320" cy="216" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="320" y="221" class="inverse" text-anchor="middle">3</text>

  $($metrics -join "`n")

  <rect x="296" y="422" width="332" height="270" rx="14" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1" filter="url(#shadow)"/>
  <text x="312" y="446" class="h3">$(Esc $screen.panel1Title)</text>
  <text x="312" y="464" class="small">$(Esc $screen.panel1Subtitle)</text>
  <circle cx="314" cy="438" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="314" y="443" class="inverse" text-anchor="middle">4</text>
  $(Render-List $screen.panel1Bullets 314 482)

  <rect x="648" y="422" width="510" height="270" rx="14" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1" filter="url(#shadow)"/>
  <text x="664" y="446" class="h3">$(Esc $screen.panel2Title)</text>
  <text x="664" y="464" class="small">$(Esc $screen.panel2Subtitle)</text>
  <circle cx="666" cy="438" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="666" y="443" class="inverse" text-anchor="middle">5</text>
  $(Render-List $screen.panel2Bullets 666 482)

  <rect x="296" y="712" width="862" height="222" rx="14" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1" filter="url(#shadow)"/>
  <text x="312" y="736" class="h3">$(Esc $screen.panel3Title)</text>
  <text x="312" y="754" class="small">$(Esc $screen.panel3Subtitle)</text>
  <circle cx="314" cy="728" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="314" y="733" class="inverse" text-anchor="middle">6</text>
  $(Render-List $screen.panel3Bullets 314 782)

  <rect x="1178" y="152" width="238" height="782" rx="18" fill="#F8FBFF" stroke="#D9E2EC" stroke-width="1"/>
  <text x="1196" y="180" class="h2">Desktop annotations</text>
  $($annos -join "`n")
</svg>
"@
}

function Render-Mobile($screen) {
  $items1 = Render-List $screen.mobileBullets1 42 650
  $items2 = Render-List $screen.mobileBullets2 42 936
  $annos = @()
  for ($i = 0; $i -lt [Math]::Min(5, $screen.annotations.Count); $i++) {
    $cy = 1296 + ($i * 48)
    $n = $i + 1
    $annos += @"
  <circle cx="40" cy="$cy" r="12" fill="#2563EB"/>
  <text x="40" y="$($cy + 4)" class="inverse" text-anchor="middle">$n</text>
  <text x="62" y="$($cy + 2)" class="annoTitle">$(Esc $screen.annotationTitles[$i])</text>
  <text x="62" y="$($cy + 20)" class="annoText">$(Esc $screen.annotations[$i])</text>
"@
  }

  return @"
<svg xmlns="http://www.w3.org/2000/svg" width="390" height="1540" viewBox="0 0 390 1540" fill="none">
  <defs>
    <style>
      .title { font: 700 22px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .h3 { font: 600 15px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .metric { font: 700 20px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .body { font: 500 12px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .small { font: 500 11px 'Segoe UI', Arial, sans-serif; fill: #486581; }
      .inverse { font: 600 11px 'Segoe UI', Arial, sans-serif; fill: white; }
      .annoTitle { font: 700 13px 'Segoe UI', Arial, sans-serif; fill: #102A43; }
      .annoText { font: 500 11px 'Segoe UI', Arial, sans-serif; fill: #486581; }
    </style>
  </defs>
  <rect width="390" height="1540" fill="#F4F7FB"/>
  <rect x="16" y="16" width="358" height="1508" rx="30" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1"/>
  <text x="28" y="54" class="body">☰</text>
  <text x="58" y="54" class="body">$(Esc $screen.sidebarTitle)</text>
  <circle cx="314" cy="48" r="12" fill="#EAF2F8"/>
  <circle cx="344" cy="48" r="12" fill="#FDEAD7"/>

  <text x="28" y="96" class="title">$(Esc $screen.title)</text>
  <text x="28" y="118" class="small">$(Esc $screen.mobileSubtitle)</text>
  <rect x="28" y="138" width="334" height="36" rx="18" fill="#F8FAFC" stroke="#D9E2EC" stroke-width="1"/>
  <text x="44" y="160" class="small">$(Esc $screen.searchHint)</text>
  <circle cx="44" cy="132" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="44" y="137" class="inverse" text-anchor="middle">1</text>

  <rect x="28" y="188" width="160" height="28" rx="14" fill="#DBEAFE"/>
  <text x="108" y="206" class="small" text-anchor="middle">$(Esc $screen.hero1)</text>
  <rect x="198" y="188" width="164" height="28" rx="14" fill="#FEF3C7"/>
  <text x="280" y="206" class="small" text-anchor="middle">$(Esc $screen.hero2)</text>

  <rect x="28" y="236" width="158" height="82" rx="18" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1"/>
  <text x="44" y="264" class="small">$(Esc $screen.metrics[0].label)</text>
  <text x="44" y="292" class="metric">$(Esc $screen.metrics[0].value)</text>
  <rect x="204" y="236" width="158" height="82" rx="18" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1"/>
  <text x="220" y="264" class="small">$(Esc $screen.metrics[1].label)</text>
  <text x="220" y="292" class="metric">$(Esc $screen.metrics[1].value)</text>
  <rect x="28" y="334" width="158" height="82" rx="18" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1"/>
  <text x="44" y="362" class="small">$(Esc $screen.metrics[2].label)</text>
  <text x="44" y="390" class="metric">$(Esc $screen.metrics[2].value)</text>
  <rect x="204" y="334" width="158" height="82" rx="18" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1"/>
  <text x="220" y="362" class="small">$(Esc $screen.metrics[3].label)</text>
  <text x="220" y="390" class="metric">$(Esc $screen.metrics[3].value)</text>

  <rect x="28" y="434" width="334" height="46" rx="16" fill="#2563EB"/>
  <text x="195" y="463" class="inverse" text-anchor="middle">$(Esc $screen.primaryAction)</text>
  <circle cx="40" cy="440" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="40" y="445" class="inverse" text-anchor="middle">2</text>
  <rect x="28" y="492" width="334" height="46" rx="16" fill="#0F766E"/>
  <text x="195" y="521" class="inverse" text-anchor="middle">$(Esc $screen.secondaryAction)</text>

  <rect x="28" y="558" width="334" height="262" rx="20" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1"/>
  <text x="44" y="586" class="h3">$(Esc $screen.panel1Title)</text>
  <text x="44" y="606" class="small">$(Esc $screen.panel1Subtitle)</text>
  <circle cx="40" cy="574" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="40" y="579" class="inverse" text-anchor="middle">3</text>
  $items1

  <rect x="28" y="846" width="334" height="230" rx="20" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="1"/>
  <text x="44" y="874" class="h3">$(Esc $screen.panel2Title)</text>
  <text x="44" y="894" class="small">$(Esc $screen.panel2Subtitle)</text>
  <circle cx="40" cy="862" r="14" fill="#2563EB" stroke="white" stroke-width="3"/>
  <text x="40" y="867" class="inverse" text-anchor="middle">4</text>
  $items2

  <rect x="28" y="1104" width="334" height="392" rx="20" fill="#F8FBFF" stroke="#D9E2EC" stroke-width="1"/>
  <text x="44" y="1132" class="h3">Mobile annotations</text>
  $($annos -join "`n")
</svg>
"@
}

$screens = @(
  @{
    Ref="WRK-SCR-005"; Slug="overtime-and-comp-off-console"; Title="Overtime and Comp-Off Console"; SidebarTitle="Overtime Console"; SearchHint="Search overtime, comp-off, shift, employee, or exception"; TopPill1="Overtime"; TopPill2="Alerts 05"; TopPill3="Comp-Off 08"; Hero1="Overtime"; Hero2="Comp-off"; Hero3="Risk";
    PrimaryAction="Open approval queue"; SecondaryAction="Review overtime risk"; SubSearch="Filter overtime claims, comp-off credits, shift overlap, or unresolved cases"; Filter1="Claims"; Filter2="Comp-off"; Filter3="Risk";
    Sidebar=@("Claims","Comp-off","Risk","Shifts","Rules","History");
    Metrics=@(@{label="Open";value="34";color="#15803D"},@{label="Comp-off";value="08";color="#D97706"},@{label="Risk";value="05";color="#B42318"},@{label="Teams";value="11";color="#2563EB"});
    Panel1Title="Overtime requests and comp-off visibility"; Panel1Subtitle="Workforce teams need one surface for claims, credits, and policy exceptions."; Panel1Bullets=@("Overtime claims stay grouped with shift and team context","Comp-off credits and balances remain easy to inspect","Risky patterns such as repeated overtime stand out early","Approvals and policy blockers are visible before payout impact");
    Panel2Title="Control and exception handling"; Panel2Subtitle="The console should help operations resolve overtime safely and consistently."; Panel2Bullets=@("Claims and comp-off actions remain traceable","Shift conflicts and rule breaches stay obvious","History helps payroll and workforce teams reconcile later","The workspace supports quick closure without losing control");
    Panel3Title="Operational confidence"; Panel3Subtitle="The console should reduce blind approvals and missed risk."; Panel3Bullets=@("Risk remains visible","Policy context stays nearby","History supports payroll reconciliation");
    AnnotationTitles=@("Claims with shift context","Comp-off state visible","Overtime risk highlighted","Approvals stay governed","Policy nearby","History for payroll");
    Annotations=@("Overtime decisions need real shift context, not only hours.","Comp-off balances should remain visible beside claims.","Risk cues should stand out before teams normalize bad patterns.","Approval action must still feel governed.","Policy context belongs near each exception.","History helps later payroll and audit review.");
    MobileSubtitle="Overtime claims, comp-off credits, rule risk, and approvals"; MobileBullets1=@("Claims stay grouped","Comp-off remains visible","Risk stands out"); MobileBullets2=@("Policy stays nearby","Approvals remain controlled","History supports payroll")
  },
  @{
    Ref="STA-SCR-001"; Slug="statutory-compliance-operations-workbench"; Title="Statutory Compliance Operations Workbench"; SidebarTitle="Statutory Ops"; SearchHint="Search PF, ESIC, PT, LWF, gratuity, or filing"; TopPill1="Filings"; TopPill2="Alerts 04"; TopPill3="Due 06"; Hero1="PF"; Hero2="ESIC"; Hero3="Due";
    PrimaryAction="Open filing workspace"; SecondaryAction="Review blocked filing"; SubSearch="Filter compliance heads, due filings, blockers, or unresolved validations"; Filter1="Head"; Filter2="Due"; Filter3="Blocked";
    Sidebar=@("Filings","Heads","Blocks","Evidence","Calendar","History");
    Metrics=@(@{label="Due";value="06";color="#15803D"},@{label="Blocked";value="03";color="#D97706"},@{label="Risk";value="02";color="#B42318"},@{label="Heads";value="08";color="#2563EB"});
    Panel1Title="Statutory filing and head-level visibility"; Panel1Subtitle="Payroll and compliance teams need one dependable workbench for recurring filings."; Panel1Bullets=@("Each compliance head remains visible with filing state and owner","Validation blockers stand out before due dates slip","Evidence and working files stay attached to the filing context","Multi-jurisdiction obligations remain easy to compare");
    Panel2Title="Governed operational follow-through"; Panel2Subtitle="The workbench should support execution, review, and later audit defense."; Panel2Bullets=@("Blockers and owner actions remain explicit","Due dates stay close to compliance head context","History supports future inspections and amendments","The workspace helps teams avoid spreadsheet-driven tracking");
    Panel3Title="Less filing risk"; Panel3Subtitle="The screen should help teams stay ahead of statutory deadlines."; Panel3Bullets=@("Deadlines remain obvious","Blockers stay concrete","History supports inspection readiness");
    AnnotationTitles=@("Head-level view","Deadline emphasis","Blockers visible","Evidence attached","Multi-jurisdiction clarity","History for inspection");
    Annotations=@("Compliance heads should stay visible in one governed workbench.","Deadlines need stronger emphasis than passive lists.","Blockers should explain exactly what is missing.","Evidence must remain attached to each filing.","Multi-jurisdiction views should still stay understandable.","History helps teams defend filings during inspection.");
    MobileSubtitle="Statutory heads, filing deadlines, blockers, and evidence"; MobileBullets1=@("Deadlines stand out","Blockers stay visible","Evidence remains attached"); MobileBullets2=@("Owners stay clear","Heads remain grouped","History supports inspection")
  },
  @{
    Ref="STA-SCR-002"; Slug="tds-and-tax-filing-workspace"; Title="TDS and Tax Filing Workspace"; SidebarTitle="Tax Filing"; SearchHint="Search TDS, challan, return, PAN mismatch, or correction"; TopPill1="TDS"; TopPill2="Alerts 05"; TopPill3="Corrections 04"; Hero1="Returns"; Hero2="Corrections"; Hero3="Mismatch";
    PrimaryAction="Open return preparation"; SecondaryAction="Review mismatch queue"; SubSearch="Filter return periods, challans, mismatches, or correction files"; Filter1="Return"; Filter2="Mismatch"; Filter3="Correction";
    Sidebar=@("Returns","Challans","Mismatch","Corrections","Evidence","History");
    Metrics=@(@{label="Returns";value="04";color="#15803D"},@{label="Mismatch";value="11";color="#D97706"},@{label="Overdue";value="02";color="#B42318"},@{label="Corrections";value="04";color="#2563EB"});
    Panel1Title="Tax filing and correction readiness"; Panel1Subtitle="The workspace should connect preparation, mismatch handling, and return submission."; Panel1Bullets=@("Return period status remains visible with owner and cut-off","PAN and deduction mismatches stand out clearly","Correction files stay linked to the original return context","Challan and evidence remain nearby for validation");
    Panel2Title="Controlled amendment and resubmission"; Panel2Subtitle="Tax teams need confidence when editing statutory returns."; Panel2Bullets=@("Mismatch reasons remain concrete","Correction history supports safe resubmission","Overdue or blocked filings rise to the top","The workspace avoids fragmented tracking across files");
    Panel3Title="Safer tax operations"; Panel3Subtitle="The screen should reduce rework and late filings."; Panel3Bullets=@("Mismatch remains visible","Correction history stays traceable","Submission state remains clear");
    AnnotationTitles=@("Return period clarity","Mismatch explanation","Correction linked","Evidence nearby","Overdue visible","History for resubmission");
    Annotations=@("Return period state should be immediately understandable.","Mismatch reasons need specific, actionable labels.","Corrections should stay tied to the original return.","Evidence should remain nearby for validation and audit.","Overdue items should stand out early.","History helps prevent repeat resubmission errors.");
    MobileSubtitle="TDS returns, mismatches, challans, and correction workflow"; MobileBullets1=@("Return state stays clear","Mismatches stand out","Corrections stay linked"); MobileBullets2=@("Evidence remains nearby","Overdue rises clearly","History supports resubmission")
  },
  @{
    Ref="STA-SCR-003"; Slug="compliance-calendar-and-filing-tracker"; Title="Compliance Calendar and Filing Tracker"; SidebarTitle="Compliance Calendar"; SearchHint="Search filing, due date, state, region, or reminder"; TopPill1="Calendar"; TopPill2="Alerts 06"; TopPill3="Overdue 03"; Hero1="Calendar"; Hero2="Reminders"; Hero3="Overdue";
    PrimaryAction="Open due calendar"; SecondaryAction="Review overdue queue"; SubSearch="Filter due dates, filing owners, regions, or overdue items"; Filter1="Due"; Filter2="Owners"; Filter3="Overdue";
    Sidebar=@("Calendar","Owners","Regions","Reminders","Overdue","History");
    Metrics=@(@{label="Due";value="18";color="#15803D"},@{label="Overdue";value="03";color="#D97706"},@{label="Regions";value="07";color="#B42318"},@{label="Owners";value="12";color="#2563EB"});
    Panel1Title="Calendar-led compliance tracking"; Panel1Subtitle="Teams need a time-based compliance view that still retains filing context."; Panel1Bullets=@("Due items stay visible by period, region, and owner","Overdue filings rise clearly above routine reminders","Calendar and queue views remain closely connected","Reminder actions stay near filing status");
    Panel2Title="Regional coverage and follow-through"; Panel2Subtitle="The tracker should help teams balance central control with local execution."; Panel2Bullets=@("Regional obligations stay easy to inspect","Owner accountability remains visible","History supports recurring compliance hygiene","The screen supports planning, not just reacting");
    Panel3Title="Time-aware control"; Panel3Subtitle="The workspace should reduce missed deadlines and weak follow-up."; Panel3Bullets=@("Due dates stay central","Owner accountability remains visible","History supports recurring planning");
    AnnotationTitles=@("Calendar first","Overdue rises early","Owner clarity","Regional obligations grouped","Reminders near status","History for rhythm");
    Annotations=@("Compliance calendars should foreground time and responsibility.","Overdue items need much stronger emphasis than routine reminders.","Owners should be visible from the top-level view.","Regional obligations should remain easy to group and compare.","Reminder actions belong near status context.","History helps teams build a repeatable filing rhythm.");
    MobileSubtitle="Due filings, overdue items, reminders, regions, and owners"; MobileBullets1=@("Due dates stay central","Overdue stands out","Owners remain visible"); MobileBullets2=@("Regions stay grouped","Reminders remain nearby","History supports planning")
  },
  @{
    Ref="STA-SCR-004"; Slug="country-compliance-and-regulatory-dashboard"; Title="Country Compliance and Regulatory Dashboard"; SidebarTitle="Country Compliance"; SearchHint="Search country, regulation, deadline, amendment, or readiness"; TopPill1="Country"; TopPill2="Alerts 04"; TopPill3="Readiness 82%"; Hero1="Countries"; Hero2="Regulations"; Hero3="Readiness";
    PrimaryAction="Open country view"; SecondaryAction="Review amendment impact"; SubSearch="Filter countries, regulatory themes, deadlines, or amendment alerts"; Filter1="Country"; Filter2="Themes"; Filter3="Impact";
    Sidebar=@("Dashboard","Countries","Themes","Amendments","Readiness","History");
    Metrics=@(@{label="Countries";value="09";color="#15803D"},@{label="Alerts";value="04";color="#D97706"},@{label="Amendments";value="03";color="#B42318"},@{label="Readiness";value="82%";color="#2563EB"});
    Panel1Title="Cross-country readiness and regulation visibility"; Panel1Subtitle="Leadership and compliance users need a broad dashboard for regulatory posture."; Panel1Bullets=@("Country-level readiness remains comparable","Amendment alerts stand out before execution windows close","Themes such as payroll tax, labour, and social security stay grouped","Escalation context remains easy to inspect");
    Panel2Title="Strategic planning and exception awareness"; Panel2Subtitle="The dashboard should support both local compliance teams and central leadership."; Panel2Bullets=@("Impact views remain visible for regulatory change","Country comparisons stay concise","History supports governance reviews","The screen helps translate regulation into action");
    Panel3Title="Leadership visibility"; Panel3Subtitle="The dashboard should answer where risk is building and why."; Panel3Bullets=@("Readiness remains comparable","Alerts stay concrete","History supports governance");
    AnnotationTitles=@("Country compare","Amendments emphasized","Themes grouped","Readiness easy to read","Escalation context nearby","Governance history");
    Annotations=@("Cross-country comparison should be easy without oversimplifying local rules.","Amendment alerts should stand out before teams fall behind.","Regulatory themes help users orient quickly.","Readiness should be simple to read at a glance.","Escalation context belongs near the dashboard.","History helps leadership govern recurring risk.");
    MobileSubtitle="Country readiness, regulatory alerts, amendment impact, and escalation"; MobileBullets1=@("Country comparison stays simple","Alerts remain visible","Themes stay grouped"); MobileBullets2=@("Readiness stays readable","Impact remains nearby","History supports governance")
  },
  @{
    Ref="AIC-SCR-001"; Slug="copilot-command-workspace"; Title="Copilot Command Workspace"; SidebarTitle="AI Copilot"; SearchHint="Search command, draft, summary, task, or policy answer"; TopPill1="Copilot"; TopPill2="Alerts 03"; TopPill3="Tasks 09"; Hero1="Ask"; Hero2="Draft"; Hero3="Execute";
    PrimaryAction="Open copilot panel"; SecondaryAction="Review action trace"; SubSearch="Filter prompts, pending actions, saved commands, or human review items"; Filter1="Ask"; Filter2="Actions"; Filter3="Review";
    Sidebar=@("Ask","Actions","Drafts","Review","Guardrails","History");
    Metrics=@(@{label="Prompts";value="29";color="#15803D"},@{label="Drafts";value="07";color="#D97706"},@{label="Review";value="03";color="#B42318"},@{label="Skills";value="12";color="#2563EB"});
    Panel1Title="Natural-language command and action flow"; Panel1Subtitle="Users need a trusted AI surface that can answer, draft, and act with review points."; Panel1Bullets=@("Typed commands remain easy to submit and reuse","Draft answers and actions remain clearly separated","Human review state is visible before execution","Guardrail context stays close to the response");
    Panel2Title="Trust, traceability, and actionability"; Panel2Subtitle="Copilot value comes from helpfulness without loss of control."; Panel2Bullets=@("Action traces remain easy to inspect","Guardrail warnings stay explicit","Saved commands reduce repeat work","History helps teams understand what AI changed and why");
    Panel3Title="Practical AI assistance"; Panel3Subtitle="The workspace should feel reliable, not magical."; Panel3Bullets=@("Commands stay simple","Review remains visible","History supports trust");
    AnnotationTitles=@("Typed command first","Draft versus action","Human review visible","Guardrails nearby","Reusable commands","History builds trust");
    Annotations=@("The AI entry point should make typed commands feel natural.","Draft output should never be confused with executed action.","Human review needs strong visibility.","Guardrails belong close to answers and actions.","Reusable commands reduce repetitive effort.","History helps users trust the system over time.");
    MobileSubtitle="Ask AI, review drafts, approve actions, and inspect history"; MobileBullets1=@("Command entry stays simple","Draft and action remain distinct","Review stands out"); MobileBullets2=@("Guardrails stay nearby","Saved commands remain useful","History supports trust")
  },
  @{
    Ref="AIC-SCR-002"; Slug="role-based-copilot-workspace"; Title="Role-Based Copilot Workspace"; SidebarTitle="Role Copilot"; SearchHint="Search manager, recruiter, payroll, or HR action"; TopPill1="Role"; TopPill2="Alerts 04"; TopPill3="Agents 05"; Hero1="Manager"; Hero2="Recruiter"; Hero3="Payroll";
    PrimaryAction="Switch role view"; SecondaryAction="Review queued assist"; SubSearch="Filter role prompts, delegated actions, or unresolved suggestions"; Filter1="Manager"; Filter2="Recruiter"; Filter3="Payroll";
    Sidebar=@("Roles","Suggestions","Approvals","Delegation","Outcomes","History");
    Metrics=@(@{label="Agents";value="05";color="#15803D"},@{label="Queued";value="11";color="#D97706"},@{label="Escalated";value="03";color="#B42318"},@{label="Saved";value="14";color="#2563EB"});
    Panel1Title="Role-aware guidance and task assistance"; Panel1Subtitle="Different users need different AI help without losing consistency."; Panel1Bullets=@("Role views adapt to manager, recruiter, payroll, and HR tasks","Suggestions remain tied to role context","Escalated or risky suggestions stand out clearly","Delegated execution remains explicit");
    Panel2Title="Structured AI help across work domains"; Panel2Subtitle="The workspace should support productivity without hiding risk or overreach."; Panel2Bullets=@("Role changes remain obvious","Approvals and escalations stay nearby","Outcome history supports learning and audit","The experience feels consistent across job functions");
    Panel3Title="Useful specialization"; Panel3Subtitle="The screen should make AI feel tailored but governed."; Panel3Bullets=@("Role context stays explicit","Escalations remain visible","History supports trust");
    AnnotationTitles=@("Role context first","Suggestions tied to role","Escalations visible","Delegation explicit","Consistent patterns","History supports learning");
    Annotations=@("Role context should be obvious before any AI suggestion is shown.","Suggestions need to stay tied to the user’s job context.","Escalations should stand out clearly.","Delegated execution must remain explicit.","Patterns should feel consistent across roles.","History helps teams learn what AI is useful for.");
    MobileSubtitle="Role-based AI suggestions, escalations, and delegated actions"; MobileBullets1=@("Role context stays clear","Suggestions remain tied to work","Escalations stand out"); MobileBullets2=@("Delegation stays explicit","Patterns remain consistent","History supports learning")
  },
  @{
    Ref="AIC-SCR-003"; Slug="policy-assistant-and-natural-language-query-console"; Title="Policy Assistant and Natural Language Query Console"; SidebarTitle="Policy Assistant"; SearchHint="Search leave rule, payroll policy, headcount, or ask a question"; TopPill1="Policy"; TopPill2="Alerts 03"; TopPill3="Queries 16"; Hero1="Policy"; Hero2="Query"; Hero3="Citations";
    PrimaryAction="Ask policy question"; SecondaryAction="Review answer sources"; SubSearch="Filter policy topics, saved questions, unresolved answers, or approvals"; Filter1="Policy"; Filter2="Query"; Filter3="Sources";
    Sidebar=@("Ask","Topics","Sources","Queries","Escalations","History");
    Metrics=@(@{label="Queries";value="16";color="#15803D"},@{label="Saved";value="09";color="#D97706"},@{label="Escalated";value="02";color="#B42318"},@{label="Topics";value="24";color="#2563EB"});
    Panel1Title="Policy answers and cited natural-language results"; Panel1Subtitle="Users need direct answers with traceable policy backing."; Panel1Bullets=@("Answers remain concise and tied to cited policy sources","Saved questions reduce repeat searching","Escalations stand out when confidence is low","Topic grouping helps users explore related rules");
    Panel2Title="Confidence, source review, and escalation"; Panel2Subtitle="The assistant should help quickly without becoming a black box."; Panel2Bullets=@("Source links remain easy to inspect","Low-confidence answers stay explicit","Escalation paths remain visible","History supports future reuse and policy tuning");
    Panel3Title="Trustworthy query experience"; Panel3Subtitle="The screen should feel transparent and practical."; Panel3Bullets=@("Sources stay nearby","Confidence remains visible","History supports refinement");
    AnnotationTitles=@("Answer with citation","Saved questions useful","Low confidence explicit","Escalation path nearby","Topic grouping helps","History supports tuning");
    Annotations=@("Policy answers should come with clear source context.","Saved questions help reduce repeated searching.","Low-confidence responses should never feel final.","Escalation must remain nearby for ambiguous cases.","Topic grouping helps users discover related rules.","History helps improve the assistant over time.");
    MobileSubtitle="Ask policy questions, inspect sources, and escalate low-confidence answers"; MobileBullets1=@("Answers stay concise","Sources remain nearby","Low confidence stands out"); MobileBullets2=@("Saved questions stay useful","Escalation remains clear","History supports tuning")
  },
  @{
    Ref="AIC-SCR-004"; Slug="skills-graph-and-talent-intelligence-workspace"; Title="Skills Graph and Talent Intelligence Workspace"; SidebarTitle="Skills Intelligence"; SearchHint="Search skill, employee, candidate, role, or recommendation"; TopPill1="Skills"; TopPill2="Alerts 04"; TopPill3="Matches 21"; Hero1="Skills"; Hero2="Matches"; Hero3="Gaps";
    PrimaryAction="Open talent match view"; SecondaryAction="Review skill gap"; SubSearch="Filter skills, role matches, learning gaps, or candidate fit"; Filter1="Skills"; Filter2="Matches"; Filter3="Gaps";
    Sidebar=@("Graph","Matches","Roles","Learning","Candidates","History");
    Metrics=@(@{label="Skills";value="218";color="#15803D"},@{label="Matches";value="21";color="#D97706"},@{label="Gaps";value="09";color="#B42318"},@{label="Roles";value="37";color="#2563EB"});
    Panel1Title="Skill graph visibility and matching intelligence"; Panel1Subtitle="Recruiting, learning, and workforce planning need a shared intelligence surface."; Panel1Bullets=@("Skills and role adjacency remain easy to explore","Employee and candidate matches stay comparable","Gap visibility helps learning and mobility decisions","Recommendation logic remains understandable");
    Panel2Title="Practical talent movement support"; Panel2Subtitle="The workspace should help teams move from insight to action."; Panel2Bullets=@("Learning suggestions remain tied to gaps","Candidate fit and internal mobility remain comparable","History supports hiring and development decisions","The view helps bridge recruiting and workforce planning");
    Panel3Title="Explainable matching"; Panel3Subtitle="The screen should make skill intelligence actionable, not opaque."; Panel3Bullets=@("Match reasons stay visible","Gaps remain concrete","History supports talent decisions");
    AnnotationTitles=@("Graph stays explorable","Candidate and employee compare","Gap visibility matters","Recommendation logic visible","Mobility plus learning","History supports decisions");
    Annotations=@("Skill graphs need to stay explorable, not decorative.","Candidate and employee comparisons should be easy to read.","Gap visibility should directly support action.","Recommendation logic needs some transparency.","Learning and mobility should stay connected.","History helps teams defend talent decisions.");
    MobileSubtitle="Skill graph, candidate match, employee fit, and gap analysis"; MobileBullets1=@("Skills stay explorable","Matches remain comparable","Gaps stand out"); MobileBullets2=@("Reasons stay visible","Learning stays connected","History supports decisions")
  },
  @{
    Ref="AIC-SCR-005"; Slug="predictive-workforce-insights-and-explainability-dashboard"; Title="Predictive Workforce Insights and Explainability Dashboard"; SidebarTitle="AI Insights"; SearchHint="Search attrition, flight risk, cost, succession, or recommendation"; TopPill1="Predictions"; TopPill2="Alerts 05"; TopPill3="Recommendations 12"; Hero1="Attrition"; Hero2="Flight risk"; Hero3="Explain";
    PrimaryAction="Open risk view"; SecondaryAction="Review model rationale"; SubSearch="Filter prediction themes, cohorts, leaders, or explainability notes"; Filter1="Risk"; Filter2="Cohorts"; Filter3="Explain";
    Sidebar=@("Insights","Risks","Cohorts","Explain","Actions","History");
    Metrics=@(@{label="Risks";value="12";color="#15803D"},@{label="Actions";value="07";color="#D97706"},@{label="Low conf.";value="03";color="#B42318"},@{label="Models";value="05";color="#2563EB"});
    Panel1Title="Predictive insight and recommended action"; Panel1Subtitle="Leadership needs AI insight that leads directly to action, not just observation."; Panel1Bullets=@("Attrition and flight-risk views remain comparable by cohort","Recommendations stay tied to the affected population","Low-confidence predictions stand out clearly","Explainability remains close to each insight");
    Panel2Title="Governed AI interpretation"; Panel2Subtitle="The dashboard should encourage action while still showing confidence and rationale."; Panel2Bullets=@("Cohort and trend context remain visible","Model rationale stays easy to inspect","Suggested actions remain practical and measurable","History supports model governance and follow-through");
    Panel3Title="Strategic command center"; Panel3Subtitle="The screen should help leaders decide what to do next."; Panel3Bullets=@("Confidence stays explicit","Action remains nearby","History supports governance");
    AnnotationTitles=@("Action with insight","Low confidence visible","Explainability nearby","Cohort compare","Action is practical","History for governance");
    Annotations=@("AI insights should lead naturally into action options.","Low-confidence predictions need explicit labels.","Explainability should stay close to the chart or recommendation.","Cohort comparison helps leaders judge significance.","Recommendations should feel practical, not generic.","History supports model governance and later review.");
    MobileSubtitle="Predictive risk, recommendations, explainability, and cohort comparison"; MobileBullets1=@("Risk stays visible","Low confidence stands out","Actions remain nearby"); MobileBullets2=@("Explainability stays close","Cohorts remain comparable","History supports governance")
  },
  @{
    Ref="INT-SCR-001"; Slug="api-and-webhook-console"; Title="API and Webhook Console"; SidebarTitle="API Console"; SearchHint="Search endpoint, webhook, token, schema, or consumer"; TopPill1="API"; TopPill2="Alerts 03"; TopPill3="Webhooks 14"; Hero1="Endpoints"; Hero2="Webhooks"; Hero3="Tokens";
    PrimaryAction="Open endpoint catalog"; SecondaryAction="Review failed webhook"; SubSearch="Filter APIs, webhook subscriptions, schemas, or token issues"; Filter1="API"; Filter2="Webhook"; Filter3="Schema";
    Sidebar=@("Catalog","Webhooks","Tokens","Schemas","Consumers","History");
    Metrics=@(@{label="Endpoints";value="47";color="#15803D"},@{label="Webhooks";value="14";color="#D97706"},@{label="Failures";value="02";color="#B42318"},@{label="Tokens";value="31";color="#2563EB"});
    Panel1Title="API surface and subscriber visibility"; Panel1Subtitle="Integration teams need a clean catalog of interfaces, consumers, and delivery rules."; Panel1Bullets=@("Endpoints and schemas stay linked in one place","Webhook subscriptions remain easy to inspect","Token and credential risk stays visible","Failed deliveries stand out without hiding healthy traffic");
    Panel2Title="Governed external integration control"; Panel2Subtitle="The console should support maintenance, onboarding, and troubleshooting."; Panel2Bullets=@("Consumer visibility remains strong","Schema change risk stays explicit","Webhook retries and failures remain traceable","History supports safe integration changes");
    Panel3Title="Interface confidence"; Panel3Subtitle="The screen should make external interface management predictable."; Panel3Bullets=@("Catalog remains clear","Risk stays visible","History supports safe change");
    AnnotationTitles=@("Catalog with schema","Subscriber visibility","Token risk visible","Failures stand out","Change risk explicit","History for safe ops");
    Annotations=@("API catalogs should keep schemas nearby, not separate.","Subscriber visibility helps teams understand impact.","Credential and token risk must remain visible.","Failures should stand out without overwhelming the console.","Change risk needs explicit warning when schemas evolve.","History helps teams make safer integration changes.");
    MobileSubtitle="API catalog, webhook subscriptions, token posture, and failures"; MobileBullets1=@("Catalog stays clear","Subscribers remain visible","Failures stand out"); MobileBullets2=@("Token risk stays visible","Schemas remain nearby","History supports safe change")
  },
  @{
    Ref="INT-SCR-002"; Slug="event-streaming-and-delivery-monitor"; Title="Event Streaming and Delivery Monitor"; SidebarTitle="Event Monitor"; SearchHint="Search event, topic, lag, dead letter, or replay"; TopPill1="Events"; TopPill2="Alerts 04"; TopPill3="Lag 02"; Hero1="Topics"; Hero2="Lag"; Hero3="Replay";
    PrimaryAction="Open event monitor"; SecondaryAction="Review dead letters"; SubSearch="Filter event topics, lag spikes, dead letters, or replay requests"; Filter1="Topics"; Filter2="Lag"; Filter3="Replay";
    Sidebar=@("Topics","Lag","Dead letter","Replay","Consumers","History");
    Metrics=@(@{label="Topics";value="22";color="#15803D"},@{label="Lag";value="02";color="#D97706"},@{label="Dead letters";value="03";color="#B42318"},@{label="Consumers";value="19";color="#2563EB"});
    Panel1Title="Event health and consumer posture"; Panel1Subtitle="The monitor should make event operations visible before incidents spread."; Panel1Bullets=@("Topic health remains visible by consumer group","Lag and replay context stay explicit","Dead-letter queues stand out strongly","Consumer ownership remains easy to inspect");
    Panel2Title="Recovery and controlled replay"; Panel2Subtitle="The screen should support rapid recovery without losing governance."; Panel2Bullets=@("Replay requests remain traceable","Dead-letter items stay linked to source topics","History supports post-incident review","The monitor balances speed with operational control");
    Panel3Title="Runtime clarity"; Panel3Subtitle="The screen should help teams judge whether event flow is healthy."; Panel3Bullets=@("Lag stays visible","Dead letters remain obvious","History supports review");
    AnnotationTitles=@("Topic and consumer health","Lag emphasis","Dead letters visible","Replay traceable","Owners stay clear","History for incident review");
    Annotations=@("Event monitors should keep topic and consumer health together.","Lag cues need stronger visual treatment than normal throughput.","Dead-letter queues should stand out clearly.","Replay actions need strong traceability.","Consumer ownership helps teams route incidents quickly.","History supports later incident analysis.");
    MobileSubtitle="Topic health, lag, dead letters, replay, and consumer ownership"; MobileBullets1=@("Topic health stays clear","Lag stands out","Dead letters remain obvious"); MobileBullets2=@("Replay stays traceable","Owners remain clear","History supports review")
  },
  @{
    Ref="INT-SCR-003"; Slug="erp-crm-and-finance-connector-workspace"; Title="ERP, CRM, and Finance Connector Workspace"; SidebarTitle="Connector Workspace"; SearchHint="Search connector, sync, mapping, finance, or ERP job"; TopPill1="Connectors"; TopPill2="Alerts 04"; TopPill3="Syncs 11"; Hero1="ERP"; Hero2="Finance"; Hero3="Sync";
    PrimaryAction="Open connector mapping"; SecondaryAction="Review failed sync"; SubSearch="Filter connectors, sync runs, field mapping, or failed jobs"; Filter1="Connectors"; Filter2="Sync"; Filter3="Mapping";
    Sidebar=@("Connectors","Mappings","Syncs","Errors","Credentials","History");
    Metrics=@(@{label="Connectors";value="11";color="#15803D"},@{label="Errors";value="04";color="#D97706"},@{label="Failed";value="02";color="#B42318"},@{label="Mappings";value="29";color="#2563EB"});
    Panel1Title="Connector health and mapping clarity"; Panel1Subtitle="Enterprise integrations need one place to understand sync posture and data shape."; Panel1Bullets=@("Connector and sync state remain visible together","Field mapping context stays attached to the connector","Finance and ERP failures stand out quickly","Credentials and dependency state remain accessible");
    Panel2Title="Operational troubleshooting and maintenance"; Panel2Subtitle="The workspace should help teams repair and monitor complex connector flows."; Panel2Bullets=@("Failed sync reasons stay visible","Mappings remain easy to review during change","History supports vendor and internal troubleshooting","The workspace reduces reliance on scattered runbooks");
    Panel3Title="Connector reliability"; Panel3Subtitle="The screen should support stable recurring integrations."; Panel3Bullets=@("Sync health remains visible","Mapping stays understandable","History supports repair");
    AnnotationTitles=@("Connector plus mapping","Failed sync visible","Credential context nearby","ERP and finance grouped","History for troubleshooting","Change review safe");
    Annotations=@("Connectors should never be separated from the mapping context.","Failed syncs need clear, actionable visibility.","Credential state belongs nearby but should remain controlled.","Grouping ERP and finance integrations helps operators work faster.","History supports vendor troubleshooting and internal repair.","Mapping change review should feel safe and governed.");
    MobileSubtitle="Connector state, mappings, sync failures, and credential posture"; MobileBullets1=@("Connector health stays visible","Mappings remain nearby","Failed syncs stand out"); MobileBullets2=@("Credentials stay controlled","History supports troubleshooting","Change review remains safe")
  },
  @{
    Ref="INT-SCR-004"; Slug="identity-bank-and-biometric-integration-console"; Title="Identity, Bank, and Biometric Integration Console"; SidebarTitle="Critical Integrations"; SearchHint="Search SSO, bank, biometric, cert, or connection"; TopPill1="Identity"; TopPill2="Alerts 05"; TopPill3="Devices 34"; Hero1="SSO"; Hero2="Banks"; Hero3="Biometric";
    PrimaryAction="Open connection health"; SecondaryAction="Review degraded device"; SubSearch="Filter identity providers, banks, devices, certificates, or degraded connections"; Filter1="Identity"; Filter2="Banks"; Filter3="Devices";
    Sidebar=@("Connections","Identity","Banks","Devices","Certificates","History");
    Metrics=@(@{label="Providers";value="08";color="#15803D"},@{label="Devices";value="34";color="#D97706"},@{label="Degraded";value="03";color="#B42318"},@{label="Certs";value="06";color="#2563EB"});
    Panel1Title="Critical external connection posture"; Panel1Subtitle="Identity, payroll banking, and device integrations need stronger operational visibility than ordinary connectors."; Panel1Bullets=@("Identity, bank, and biometric health stay grouped","Certificate and credential risks remain visible","Degraded or offline devices stand out clearly","Connection ownership remains easy to inspect");
    Panel2Title="Recovery and dependency management"; Panel2Subtitle="The console should support high-impact integration recovery and preventive review."; Panel2Bullets=@("Device and bank issues remain traceable","Certificate expiry stays explicit","History supports recurring reliability work","The workspace helps teams prioritize critical dependencies");
    Panel3Title="High-impact integration trust"; Panel3Subtitle="The screen should surface what could block login, payroll, or attendance."; Panel3Bullets=@("Critical dependencies stay grouped","Degraded states remain obvious","History supports prevention");
    AnnotationTitles=@("Critical systems grouped","Certificate risk visible","Degraded devices stand out","Ownership clear","High-impact prioritization","History for prevention");
    Annotations=@("Critical integrations should be grouped so impact is obvious.","Certificate and credential risks need strong visibility.","Degraded biometric devices should stand out early.","Ownership helps teams resolve issues faster.","The console should prioritize what can block login, pay, or attendance.","History helps move from reactive fixes to prevention.");
    MobileSubtitle="Identity, banking, and biometric connection health with degraded alerts"; MobileBullets1=@("Critical systems stay grouped","Degraded states stand out","Certificates remain visible"); MobileBullets2=@("Owners stay clear","Priority remains obvious","History supports prevention")
  },
  @{
    Ref="TST-SCR-001"; Slug="test-data-management-console"; Title="Test Data Management Console"; SidebarTitle="Test Data"; SearchHint="Search dataset, tenant, seed, mask, or refresh"; TopPill1="Test Data"; TopPill2="Alerts 03"; TopPill3="Masks 08"; Hero1="Datasets"; Hero2="Masks"; Hero3="Refresh";
    PrimaryAction="Open dataset pack"; SecondaryAction="Review masking rule"; SubSearch="Filter datasets, masking packs, seed jobs, or refresh requests"; Filter1="Data"; Filter2="Mask"; Filter3="Refresh";
    Sidebar=@("Datasets","Masks","Seeds","Refresh","Requests","History");
    Metrics=@(@{label="Packs";value="12";color="#15803D"},@{label="Masks";value="08";color="#D97706"},@{label="Requests";value="05";color="#B42318"},@{label="Tenants";value="09";color="#2563EB"});
    Panel1Title="Seeded data and masking control"; Panel1Subtitle="QA teams need safe, repeatable test data operations without leaking production risk."; Panel1Bullets=@("Dataset packs remain easy to inspect by scope and tenant","Masking rules stay visible near each data set","Refresh and seed requests stand out clearly","Approval context remains explicit for risky actions");
    Panel2Title="Repeatability and governance"; Panel2Subtitle="The console should support execution while enforcing safe boundaries."; Panel2Bullets=@("Masking history remains traceable","Refresh jobs stay linked to environment context","Requests and approvals stay visible","History supports audit and repeatable QA setup");
    Panel3Title="Safer QA preparation"; Panel3Subtitle="The workspace should reduce ad hoc test data creation."; Panel3Bullets=@("Data packs stay organized","Masking remains governed","History supports repeatability");
    AnnotationTitles=@("Tenant-scoped datasets","Masking nearby","Refresh requests visible","Risky action gated","Environment context clear","History for repeatability");
    Annotations=@("Test data packs should remain clearly tenant-scoped.","Masking must stay close to the dataset view.","Refresh requests need explicit visibility.","Risky operations should stay gated.","Environment context helps avoid the wrong refresh target.","History supports repeatable QA preparation.");
    MobileSubtitle="Dataset packs, masking rules, refresh requests, and environment context"; MobileBullets1=@("Datasets stay scoped","Masking remains nearby","Requests stand out"); MobileBullets2=@("Risk remains gated","Environment stays clear","History supports repeatability")
  },
  @{
    Ref="TST-SCR-002"; Slug="regression-and-release-validation-workspace"; Title="Regression and Release Validation Workspace"; SidebarTitle="Regression Validation"; SearchHint="Search suite, build, release, blocker, or rerun"; TopPill1="Regression"; TopPill2="Alerts 04"; TopPill3="Builds 07"; Hero1="Suites"; Hero2="Builds"; Hero3="Blockers";
    PrimaryAction="Open validation run"; SecondaryAction="Review failed suite"; SubSearch="Filter regression suites, release builds, blockers, or rerun requests"; Filter1="Suites"; Filter2="Builds"; Filter3="Blockers";
    Sidebar=@("Suites","Builds","Failures","Reruns","Approvals","History");
    Metrics=@(@{label="Suites";value="26";color="#15803D"},@{label="Failed";value="04";color="#D97706"},@{label="Blockers";value="02";color="#B42318"},@{label="Builds";value="07";color="#2563EB"});
    Panel1Title="Regression posture and release visibility"; Panel1Subtitle="QA and release teams need one clear place to judge whether a build is ready."; Panel1Bullets=@("Suites remain visible by status, owner, and environment","Failed suites and blockers rise clearly to the top","Rerun requests stay close to the failing context","Build and release linkage remains obvious");
    Panel2Title="Controlled rerun and sign-off flow"; Panel2Subtitle="The workspace should support disciplined validation, not just test counting."; Panel2Bullets=@("Failure reasons remain concrete","Approvals and waivers stay visible","History supports release decisions","The screen helps teams move from failure to sign-off cleanly");
    Panel3Title="Release-readiness clarity"; Panel3Subtitle="The screen should help teams decide whether to proceed or stop."; Panel3Bullets=@("Blockers stay visible","Build context remains nearby","History supports sign-off");
    AnnotationTitles=@("Suites with build context","Failures rise clearly","Rerun near failure","Waivers visible","History supports release","Proceed or stop clarity");
    Annotations=@("Regression status should stay tied to build context.","Failures need stronger emphasis than passing noise.","Reruns should remain near the failed suite.","Waivers and approvals must stay visible.","History supports trustworthy release decisions.","The screen should help teams decide whether to proceed or stop.");
    MobileSubtitle="Regression suites, failed runs, blockers, and release context"; MobileBullets1=@("Suites stay visible","Failures stand out","Reruns remain nearby"); MobileBullets2=@("Waivers stay clear","Build context remains near","History supports release")
  },
  @{
    Ref="TST-SCR-003"; Slug="non-functional-quality-dashboard"; Title="Non-Functional Quality Dashboard"; SidebarTitle="Quality Dashboard"; SearchHint="Search performance, security, accessibility, or load"; TopPill1="Quality"; TopPill2="Alerts 05"; TopPill3="Signals 14"; Hero1="Performance"; Hero2="Security"; Hero3="A11y";
    PrimaryAction="Open quality trend"; SecondaryAction="Review blocker signals"; SubSearch="Filter quality themes, blocker signals, environments, or trends"; Filter1="Perf"; Filter2="Security"; Filter3="A11y";
    Sidebar=@("Dashboard","Performance","Security","Accessibility","Envs","History");
    Metrics=@(@{label="Signals";value="14";color="#15803D"},@{label="Blockers";value="03";color="#D97706"},@{label="Critical";value="02";color="#B42318"},@{label="Envs";value="05";color="#2563EB"});
    Panel1Title="Cross-quality signal visibility"; Panel1Subtitle="Teams need one place to understand whether non-functional quality is degrading."; Panel1Bullets=@("Performance, security, and accessibility stay comparable","Blocker-level issues stand out strongly","Environment context remains easy to inspect","Trend visibility helps teams judge risk over time");
    Panel2Title="Risk interpretation and follow-through"; Panel2Subtitle="The dashboard should help translate signals into release decisions."; Panel2Bullets=@("Critical issues remain explicit","Owner and mitigation status stay visible","History supports improvement work and exception review","The screen stays decision-oriented rather than report-heavy");
    Panel3Title="Release risk awareness"; Panel3Subtitle="The dashboard should help answer whether quality is good enough to proceed."; Panel3Bullets=@("Critical signals remain visible","Trends stay comparable","History supports decisions");
    AnnotationTitles=@("Signals compared together","Critical issues visible","Environment context nearby","Trend matters","Decision-oriented design","History supports improvement");
    Annotations=@("Non-functional quality works best when themes stay comparable.","Critical signals need strong visual treatment.","Environment context belongs near each quality signal.","Trend visibility matters more than isolated snapshots.","The dashboard should help decisions, not just reporting.","History supports later improvement and exception review.");
    MobileSubtitle="Performance, security, accessibility, blockers, and trend context"; MobileBullets1=@("Themes stay comparable","Critical signals stand out","Environment remains nearby"); MobileBullets2=@("Trends stay visible","Owners remain clear","History supports improvement")
  },
  @{
    Ref="TST-SCR-004"; Slug="uat-command-center-and-signoff-workspace"; Title="UAT Command Center and Sign-Off Workspace"; SidebarTitle="UAT Command"; SearchHint="Search sign-off, scenario, blocker, business owner, or waiver"; TopPill1="UAT"; TopPill2="Alerts 04"; TopPill3="Sign-offs 09"; Hero1="Scenarios"; Hero2="Owners"; Hero3="Sign-off";
    PrimaryAction="Open UAT board"; SecondaryAction="Review sign-off blocker"; SubSearch="Filter scenarios, business owners, blockers, or waivers"; Filter1="Scenario"; Filter2="Owners"; Filter3="Blockers";
    Sidebar=@("Board","Owners","Blockers","Waivers","Sign-off","History");
    Metrics=@(@{label="Scenarios";value="41";color="#15803D"},@{label="Owners";value="09";color="#D97706"},@{label="Blockers";value="03";color="#B42318"},@{label="Ready";value="26";color="#2563EB"});
    Panel1Title="Business validation and sign-off readiness"; Panel1Subtitle="UAT needs a stronger command view than ordinary defect tracking."; Panel1Bullets=@("Scenario status remains visible by business owner and process area","Sign-off readiness stays explicit","Blockers and waivers stand out clearly","Decision state remains easy to inspect");
    Panel2Title="Governed go or no-go support"; Panel2Subtitle="The workspace should help business, QA, and leadership reach a clear release decision."; Panel2Bullets=@("Owner accountability remains visible","Waivers stay explicit and reviewable","History supports later audit and release review","The screen helps align business and product stakeholders");
    Panel3Title="Clear sign-off posture"; Panel3Subtitle="The command center should answer whether the business is truly ready."; Panel3Bullets=@("Readiness stays visible","Waivers remain controlled","History supports release governance");
    AnnotationTitles=@("Scenario by owner","Readiness explicit","Blockers and waivers visible","Decision support","Business and QA aligned","History for governance");
    Annotations=@("UAT posture should be visible by owner and business process.","Readiness must stay explicit, not implied.","Blockers and waivers need strong visibility.","The screen should support clear go or no-go decisions.","Business and QA should feel aligned in one view.","History supports later release governance.");
    MobileSubtitle="UAT scenarios, business owners, blockers, waivers, and sign-off readiness"; MobileBullets1=@("Scenario state stays visible","Blockers stand out","Readiness remains explicit"); MobileBullets2=@("Waivers stay controlled","Owners remain clear","History supports governance")
  }
)

foreach ($screen in $screens) {
  $desktopPath = Join-Path $mockupDir ("{0}-{1}-desktop.svg" -f $screen.Ref.ToLower(), $screen.Slug)
  $mobilePath = Join-Path $mockupDir ("{0}-{1}-mobile.svg" -f $screen.Ref.ToLower(), $screen.Slug)
  [System.IO.File]::WriteAllText($desktopPath, (Render-Desktop $screen))
  [System.IO.File]::WriteAllText($mobilePath, (Render-Mobile $screen))
}
