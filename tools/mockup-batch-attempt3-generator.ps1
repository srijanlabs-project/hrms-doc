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
    Ref="MSS-SCR-001"; Slug="manager-workspace-home"; Title="Manager Workspace Home"; SidebarTitle="Manager Workspace"; SearchHint="Search team action, exception, approval, or coaching item"; TopPill1="Team"; TopPill2="Alerts 05"; TopPill3="Actions 09"; Hero1="Approvals"; Hero2="Team health"; Hero3="Coaching";
    PrimaryAction="Open manager queue"; SecondaryAction="Review team priorities"; SubSearch="Filter approvals, attendance issues, people actions, or review deadlines"; Filter1="Queue"; Filter2="People"; Filter3="Priority";
    Sidebar=@("Home","Approvals","People","Reviews","Mobility","Calendar");
    Metrics=@(@{label="Actions";value="09";color="#15803D"},@{label="Overdue";value="03";color="#D97706"},@{label="Risk";value="02";color="#B42318"},@{label="Team";value="42";color="#2563EB"});
    Panel1Title="Manager workday and team priorities"; Panel1Subtitle="The home surface should bring people actions, approvals, and risk into one rhythm."; Panel1Bullets=@("Urgent decisions remain visible above passive metrics","Team signals like absence spikes and review deadlines stay grouped","Quick actions reduce navigation between manager tools","Coaching and people follow-up remain easy to launch");
    Panel2Title="Operational and people visibility"; Panel2Subtitle="Managers need context without losing speed."; Panel2Bullets=@("Approvals, reviews, and workforce issues stay near each other","Escalations and unresolved blockers remain obvious","Contextual insight supports better prioritization","The workspace stays action-oriented rather than report-heavy");
    Panel3Title="Manager confidence"; Panel3Subtitle="The screen should reduce switching and missed commitments."; Panel3Bullets=@("Priority grouping reduces overlook risk","Status stays clear","History supports later follow-through");
    AnnotationTitles=@("One managerial home","Action above analytics","People and operations together","Risk remains visible","Quick action matters","History supports follow-through");
    Annotations=@("Managers need one dependable starting point for daily people work.","Actionable items should sit above passive metrics.","Operational and coaching context belong together.","Risk cues should stand out early.","Quick actions reduce avoidable navigation.","History helps later conversations and review.");
    MobileSubtitle="Manager actions, approvals, team signals, and coaching follow-up"; MobileBullets1=@("Urgent manager work stays first","Team signals stay grouped","Quick actions remain obvious"); MobileBullets2=@("Risk remains visible","Status stays clear","History supports follow-up")
  },
  @{
    Ref="MSS-SCR-002"; Slug="manager-people-and-actions-workspace"; Title="Manager People and Actions Workspace"; SidebarTitle="Manager People"; SearchHint="Search employee, issue, action, leave, or profile"; TopPill1="People"; TopPill2="Alerts 04"; TopPill3="Changes 06"; Hero1="People"; Hero2="Actions"; Hero3="Profiles";
    PrimaryAction="Open team list"; SecondaryAction="Review employee action"; SubSearch="Filter people actions, status changes, profile updates, or pending items"; Filter1="People"; Filter2="Actions"; Filter3="Pending";
    Sidebar=@("People","Profiles","Changes","Leave","Attendance","Notes");
    Metrics=@(@{label="Team";value="42";color="#15803D"},@{label="Pending";value="06";color="#D97706"},@{label="Sensitive";value="02";color="#B42318"},@{label="Updated";value="11";color="#2563EB"});
    Panel1Title="Team visibility and person-level action"; Panel1Subtitle="Managers need quick access to people context without diving into HR admin surfaces."; Panel1Bullets=@("People list and key changes remain visible in one place","Sensitive or escalated items stand out clearly","Common people actions are easy to launch","Profile context stays close to pending work");
    Panel2Title="Change awareness and role-safe detail"; Panel2Subtitle="The workspace should stay useful without exposing admin-only data."; Panel2Bullets=@("Only manager-relevant fields remain visible","Pending and completed changes are easy to inspect","Notes and follow-up stay attached to the employee context","The view supports coaching and operational action together");
    Panel3Title="People management confidence"; Panel3Subtitle="Managers should feel informed, not buried in HR detail."; Panel3Bullets=@("Employee context stays concise","Pending work remains grouped","Role-safe history supports better conversations");
    AnnotationTitles=@("Role-safe people view","Pending grouped by person","Sensitive cues remain visible","Actions near profiles","Concise context","History for better coaching");
    Annotations=@("Manager people views need strong role boundaries.","Pending work should stay grouped by person when useful.","Sensitive items should still stand out clearly.","Actions should sit close to the employee context.","Concise context helps managers act faster.","History helps support better coaching and follow-up.");
    MobileSubtitle="Team people context, pending actions, and profile-safe detail"; MobileBullets1=@("People context stays concise","Pending items stay grouped","Sensitive cues stand out"); MobileBullets2=@("Actions stay nearby","Role-safe detail remains clear","History supports follow-up")
  },
  @{
    Ref="MSS-SCR-003"; Slug="manager-approvals-and-routing-workspace"; Title="Manager Approvals and Routing Workspace"; SidebarTitle="Manager Routing"; SearchHint="Search approval, workflow, exception, or returned item"; TopPill1="Approvals"; TopPill2="Alerts 06"; TopPill3="Overdue 03"; Hero1="Approval"; Hero2="Routing"; Hero3="Exceptions";
    PrimaryAction="Open approval route"; SecondaryAction="Review returned items"; SubSearch="Filter approval states, workflow routes, escalations, or returned actions"; Filter1="Queue"; Filter2="Workflow"; Filter3="Overdue";
    Sidebar=@("Queue","Routing","Returned","Escalations","SLA","History");
    Metrics=@(@{label="Open";value="18";color="#15803D"},@{label="Returned";value="04";color="#D97706"},@{label="Overdue";value="03";color="#B42318"},@{label="Routes";value="07";color="#2563EB"});
    Panel1Title="Approvals, returns, and route clarity"; Panel1Subtitle="This surface should help managers understand not just what is pending, but why it is routed to them."; Panel1Bullets=@("Approval cards show route step, requester, and urgency","Returned items explain the exact correction needed","Escalated or overdue decisions rise to the top","Route history stays visible for workflow-heavy cases");
    Panel2Title="Workflow awareness and exception handling"; Panel2Subtitle="Managers should be able to act confidently even in complex approval flows."; Panel2Bullets=@("Multi-step routing remains easy to inspect","Exception reasons stay attached to the work item","Delegated approval context is visible when active","SLA and escalation cues support quicker action");
    Panel3Title="Governed manager action"; Panel3Subtitle="The screen should reinforce deliberate decision-making."; Panel3Bullets=@("Returned and escalated paths remain distinct","Route context reduces errors","Decision history supports audit and coaching");
    AnnotationTitles=@("Why it is here","Returned clarity","Route history visible","Delegation context","SLA cues matter","Decision trace retained");
    Annotations=@("Managers act faster when they know why an item reached them.","Returned work needs exact correction guidance.","Route history matters in multi-step workflows.","Delegated approval context should never be hidden.","SLA cues help prevent delay.","Decision trace supports governance and later follow-up.");
    MobileSubtitle="Approvals, routing, returned items, and SLA context"; MobileBullets1=@("Route and urgency stay visible","Returned items explain fixes","Overdue items rise first"); MobileBullets2=@("Delegation remains explicit","Escalations stay obvious","History supports governance")
  },
  @{
    Ref="MSS-SCR-004"; Slug="manager-reviews-and-team-performance-hub"; Title="Manager Reviews and Team Performance Hub"; SidebarTitle="Manager Reviews"; SearchHint="Search review, goal, feedback, or due conversation"; TopPill1="Reviews"; TopPill2="Alerts 05"; TopPill3="Due 07"; Hero1="Goals"; Hero2="Feedback"; Hero3="Reviews";
    PrimaryAction="Open review hub"; SecondaryAction="Schedule check-in"; SubSearch="Filter reviews, goals, feedback coverage, or due conversations"; Filter1="Reviews"; Filter2="Goals"; Filter3="Due";
    Sidebar=@("Reviews","Goals","Feedback","Check-ins","Calibration","History");
    Metrics=@(@{label="Due";value="07";color="#15803D"},@{label="Feedback";value="05";color="#D97706"},@{label="Risk";value="02";color="#B42318"},@{label="Team";value="42";color="#2563EB"});
    Panel1Title="Team review rhythm and follow-through"; Panel1Subtitle="Managers need one surface to track reviews, goals, and feedback without context loss."; Panel1Bullets=@("Review due dates and goal status remain visible together","Feedback coverage helps spot thin decisions","Check-ins and coaching cues stay near employee context","Calibration or escalation needs stand out");
    Panel2Title="Performance action and readiness"; Panel2Subtitle="The hub should support both day-to-day coaching and formal review deadlines."; Panel2Bullets=@("Upcoming conversations are easy to schedule","Risk cues reveal where follow-up is needed","History supports better appraisal decisions","The view remains more action-driven than analytic-heavy");
    Panel3Title="Better manager consistency"; Panel3Subtitle="The screen should help managers stay disciplined across the cycle."; Panel3Bullets=@("Due work remains obvious","History stays attached to outcomes","Coverage signals reduce blind spots");
    AnnotationTitles=@("One review rhythm","Feedback coverage visible","Check-ins near goals","Risk cues remain visible","Action over passive charts","History supports appraisal");
    Annotations=@("Managers work better when review rhythm lives in one place.","Feedback coverage helps improve fairness.","Check-ins should sit close to goals and reviews.","Risk cues should stay obvious before deadlines slip.","This hub should drive action more than passive analysis.","History supports stronger appraisal decisions.");
    MobileSubtitle="Team review due dates, goals, feedback, and check-ins"; MobileBullets1=@("Due work stays visible","Feedback coverage remains clear","Check-ins stay nearby"); MobileBullets2=@("Risk cues stand out","History supports decisions","Action remains central")
  },
  @{
    Ref="MSS-SCR-005"; Slug="manager-mobility-and-hiring-actions-workspace"; Title="Manager Mobility and Hiring Actions Workspace"; SidebarTitle="Manager Mobility"; SearchHint="Search requisition, offer, transfer, promotion, or action"; TopPill1="Mobility"; TopPill2="Alerts 04"; TopPill3="Hiring 06"; Hero1="Hiring"; Hero2="Mobility"; Hero3="Offers";
    PrimaryAction="Open manager actions"; SecondaryAction="Review mobility case"; SubSearch="Filter hiring actions, transfers, promotions, or offers"; Filter1="Hiring"; Filter2="Mobility"; Filter3="Pending";
    Sidebar=@("Hiring","Mobility","Offers","Transfers","Promotions","History");
    Metrics=@(@{label="Pending";value="06";color="#15803D"},@{label="Offers";value="03";color="#D97706"},@{label="Blocked";value="01";color="#B42318"},@{label="Moves";value="04";color="#2563EB"});
    Panel1Title="Manager-led hiring and movement actions"; Panel1Subtitle="This workspace should group the people-change actions managers often own or influence."; Panel1Bullets=@("Hiring approvals and offer actions remain visible","Transfer and promotion cases stay close to supporting context","Blocked items explain the exact next step","Movement history supports better decision quality");
    Panel2Title="Decision support and action safety"; Panel2Subtitle="Managers should be able to act without losing process guardrails."; Panel2Bullets=@("Offer and mobility states remain explicit","Budget or position blockers stand out clearly","Approvals and follow-up remain easy to inspect","History stays close to the decision context");
    Panel3Title="Manager control with governance"; Panel3Subtitle="The screen should balance autonomy and policy."; Panel3Bullets=@("Manager actions remain easy to launch","Blockers are explicit","Decision history supports governance");
    AnnotationTitles=@("People-change grouping","Blocked items clear","Offer and move context","Budget or position risk","Manager autonomy with guardrails","History for better judgement");
    Annotations=@("Managers benefit from one place for hiring and mobility work.","Blocked items need exact next-step visibility.","Offer and move context should stay close together.","Budget or position risk needs stronger emphasis.","Managers need autonomy with policy guardrails.","History helps improve judgement over time.");
    MobileSubtitle="Hiring actions, mobility cases, offers, and blocked next steps"; MobileBullets1=@("People-change items stay grouped","Blocked items stand out","Offer states remain clear"); MobileBullets2=@("Follow-up stays nearby","Guardrails remain visible","History supports judgement")
  },
  @{
    Ref="HLP-SCR-002"; Slug="case-detail-and-sla-workspace"; Title="Case Detail and SLA Workspace"; SidebarTitle="Case Operations"; SearchHint="Search case, assignee, SLA, breach, or response"; TopPill1="Cases"; TopPill2="Alerts 05"; TopPill3="SLA 03"; Hero1="SLA"; Hero2="Responses"; Hero3="Escalation";
    PrimaryAction="Open active case"; SecondaryAction="Review SLA risk"; SubSearch="Filter case status, SLA risk, assignee, or escalation"; Filter1="Cases"; Filter2="SLA"; Filter3="Risk";
    Sidebar=@("Cases","SLA","Responses","Escalation","Knowledge","History");
    Metrics=@(@{label="Open";value="36";color="#15803D"},@{label="At risk";value="05";color="#D97706"},@{label="Breached";value="03";color="#B42318"},@{label="Replies";value="18";color="#2563EB"});
    Panel1Title="Case handling and SLA posture"; Panel1Subtitle="Support teams should understand urgency and customer context together."; Panel1Bullets=@("Case timeline and current owner remain visible","SLA risk and breach cues stand out early","Replies and pending customer waits stay obvious","Escalation state is easy to inspect");
    Panel2Title="Agent action and recovery"; Panel2Subtitle="The workspace should help support teams move from context to action quickly."; Panel2Bullets=@("Notes, attachments, and response actions stay near the timeline","Breach reasons remain visible","Agent handoff and reassignment are explicit","History supports later audit and coaching");
    Panel3Title="Operational case confidence"; Panel3Subtitle="The screen should reduce missed commitments."; Panel3Bullets=@("SLA status remains obvious","Case timeline stays readable","History supports quality review");
    AnnotationTitles=@("Timeline with urgency","Breach cues early","Replies near status","Escalation remains explicit","Handoff clarity","History supports QA");
    Annotations=@("Case details should keep urgency and context together.","Breach cues need early visibility.","Replies should stay close to status context.","Escalation state should be explicit.","Handoffs need clear ownership trace.","History helps later QA and coaching.");
    MobileSubtitle="Case detail, SLA posture, replies, and escalation"; MobileBullets1=@("Urgency stays visible","Replies stay near the case","Escalation remains clear"); MobileBullets2=@("Handoff is explicit","Timeline stays readable","History supports review")
  },
  @{
    Ref="HLP-SCR-003"; Slug="knowledge-base-and-escalation-console"; Title="Knowledge Base and Escalation Console"; SidebarTitle="Support Knowledge"; SearchHint="Search article, escalation, macro, or queue"; TopPill1="Knowledge"; TopPill2="Alerts 03"; TopPill3="Escalations 04"; Hero1="Articles"; Hero2="Escalation"; Hero3="Macros";
    PrimaryAction="Open escalation console"; SecondaryAction="Review article usage"; SubSearch="Filter articles, escalations, macros, or queue state"; Filter1="Knowledge"; Filter2="Escalation"; Filter3="Usage";
    Sidebar=@("Articles","Escalation","Macros","Queues","Usage","History");
    Metrics=@(@{label="Articles";value="148";color="#15803D"},@{label="Escalations";value="04";color="#D97706"},@{label="Gaps";value="02";color="#B42318"},@{label="Macros";value="22";color="#2563EB"});
    Panel1Title="Knowledge and escalation visibility"; Panel1Subtitle="Support leads need a surface for both content quality and operational escalation."; Panel1Bullets=@("Top articles and missing-content gaps stay visible","Escalation queues and reasons remain grouped","Macro and response tools stay easy to inspect","Usage signals help improve the knowledge base");
    Panel2Title="Operational improvement loop"; Panel2Subtitle="The console should help teams improve support, not only process escalations."; Panel2Bullets=@("Gaps between common issues and article coverage stand out","Escalations reveal where support friction is rising","Macro usage stays reviewable","History supports continual improvement");
    Panel3Title="Lead-level control"; Panel3Subtitle="The screen should feel like an improvement console, not just a library."; Panel3Bullets=@("Usage and gaps remain visible","Escalation causes are easy to track","History supports knowledge operations");
    AnnotationTitles=@("Knowledge plus operations","Coverage gaps visible","Escalation reasons grouped","Macro usage review","Improvement loop","Lead-level visibility");
    Annotations=@("Support knowledge works better when tied to live operations.","Coverage gaps should be easy to spot.","Escalation reasons should remain grouped and visible.","Macro usage can reveal training or content needs.","The console should support improvement, not only storage.","Leads need visibility into trends and corrective action.");
    MobileSubtitle="Knowledge usage, escalation reasons, content gaps, and macros"; MobileBullets1=@("Usage stays visible","Escalation reasons are grouped","Content gaps stand out"); MobileBullets2=@("Macro usage remains reviewable","Improvement loop is visible","Lead controls stay clear")
  },
  @{
    Ref="CTR-SCR-002"; Slug="contractor-contract-and-compliance-workspace"; Title="Contractor Contract and Compliance Workspace"; SidebarTitle="Contractor Compliance"; SearchHint="Search vendor, contract, expiry, or compliance"; TopPill1="Contract"; TopPill2="Alerts 05"; TopPill3="Expiry 04"; Hero1="Contracts"; Hero2="Vendors"; Hero3="Expiry";
    PrimaryAction="Open compliance case"; SecondaryAction="Review contract expiry"; SubSearch="Filter contracts, vendors, expiry, or compliance status"; Filter1="Contracts"; Filter2="Vendors"; Filter3="Expiry";
    Sidebar=@("Contracts","Vendors","Compliance","Expiry","Docs","History");
    Metrics=@(@{label="Contracts";value="58";color="#15803D"},@{label="Expiring";value="04";color="#D97706"},@{label="Blocked";value="02";color="#B42318"},@{label="Vendors";value="17";color="#2563EB"});
    Panel1Title="Contract visibility and compliance posture"; Panel1Subtitle="Contractor programs need contract state and compliance risk in one place."; Panel1Bullets=@("Contract dates, vendors, and worker counts remain visible","Expiry and missing-document cues stand out","Blocked contractor activity stays easy to inspect","Vendor-level context remains nearby");
    Panel2Title="Operational follow-through"; Panel2Subtitle="The workspace should help teams act before compliance issues disrupt operations."; Panel2Bullets=@("Compliance actions remain close to the contract state","Owner and due date stay visible","Document and certification history remain attached","History supports vendor governance");
    Panel3Title="Contractor reliability"; Panel3Subtitle="The screen should reduce last-minute surprises."; Panel3Bullets=@("Expiring items remain obvious","Blocked states are clear","History supports better renewals");
    AnnotationTitles=@("Vendor plus contract context","Expiry early visibility","Blocked states explicit","Compliance close to action","Document history attached","Renewal support");
    Annotations=@("Contractor oversight works best when vendor and contract context stay together.","Expiry risk should show up early.","Blocked states need clear explanation.","Compliance action should remain close to the contract view.","Document history supports governance.","The workspace should help avoid last-minute renewal surprises.");
    MobileSubtitle="Vendor contracts, expiry, compliance status, and blocked work"; MobileBullets1=@("Vendor and contract stay linked","Expiry stands out","Blocked states remain clear"); MobileBullets2=@("Compliance action stays nearby","History remains attached","Renewal risk is visible")
  },
  @{
    Ref="CTR-SCR-003"; Slug="contractor-access-control-and-risk-workspace"; Title="Contractor Access Control and Risk Workspace"; SidebarTitle="Contractor Access"; SearchHint="Search contractor, access, badge, risk, or block"; TopPill1="Access"; TopPill2="Alerts 04"; TopPill3="Risk 03"; Hero1="Access"; Hero2="Badges"; Hero3="Risk";
    PrimaryAction="Open access review"; SecondaryAction="Review blocked badge";
    SubSearch="Filter badges, access state, expiries, or contractor risk"; Filter1="Access"; Filter2="Risk"; Filter3="Badge";
    Sidebar=@("Access","Badges","Risk","Blocks","Reviews","History");
    Metrics=@(@{label="Active";value="212";color="#15803D"},@{label="Expiring";value="09";color="#D97706"},@{label="Blocked";value="03";color="#B42318"},@{label="Reviews";value="07";color="#2563EB"});
    Panel1Title="Access state and contractor risk"; Panel1Subtitle="Security-sensitive contractor access needs visible controls and exceptions."; Panel1Bullets=@("Active, expiring, and blocked access states remain distinct","Badge and access linkage stays visible","Risk cues stand out before access becomes unsafe","Review windows remain easy to inspect");
    Panel2Title="Control action and decision trace"; Panel2Subtitle="The workspace should support deliberate access decisions."; Panel2Bullets=@("Blocks and temporary grants remain clearly labeled","Risk reasons stay attached to each contractor context","Review history remains accessible","The view supports security and workforce teams together");
    Panel3Title="Safer contractor operations"; Panel3Subtitle="The screen should reduce avoidable exposure."; Panel3Bullets=@("Expiring access remains visible","Blocked reasons are explicit","History supports audits");
    AnnotationTitles=@("State separation","Badge linkage","Risk before failure","Review windows visible","Deliberate blocks and grants","Audit support");
    Annotations=@("Access state separation reduces dangerous ambiguity.","Badge and access linkage should remain obvious.","Risk should appear before access fails or becomes unsafe.","Review windows matter for contractors too.","Temporary grants and blocks need clear reasoning.","History supports later audits and investigations.");
    MobileSubtitle="Contractor access state, badge linkage, risk, and review windows"; MobileBullets1=@("Active vs blocked stays clear","Risk stands out early","Badge linkage remains visible"); MobileBullets2=@("Review windows stay visible","Blocks remain explicit","History supports audit")
  },
  @{
    Ref="VWP-SCR-001"; Slug="visitor-registration-and-gate-pass-workspace"; Title="Visitor Registration and Gate Pass Workspace"; SidebarTitle="Visitor Gate"; SearchHint="Search visitor, host, gate pass, or appointment"; TopPill1="Visitors"; TopPill2="Alerts 03"; TopPill3="Today 12"; Hero1="Visitors"; Hero2="Hosts"; Hero3="Passes";
    PrimaryAction="Register visitor"; SecondaryAction="Review gate pass";
    SubSearch="Filter visitors, gate passes, hosts, or arrival status"; Filter1="Visitors"; Filter2="Passes"; Filter3="Today";
    Sidebar=@("Register","Passes","Hosts","Arrivals","Security","History");
    Metrics=@(@{label="Today";value="12";color="#15803D"},@{label="Pending";value="04";color="#D97706"},@{label="Denied";value="01";color="#B42318"},@{label="Hosts";value="09";color="#2563EB"});
    Panel1Title="Visitor intake and pass readiness"; Panel1Subtitle="Front-desk and admin teams need a clear view of who is expected and what is approved."; Panel1Bullets=@("Visitor records, hosts, and arrival state remain grouped","Gate pass readiness is visible before arrival","Denied or flagged entries stand out","Security notes remain close to the visit");
    Panel2Title="Arrival control and desk coordination"; Panel2Subtitle="The workspace should support fast but controlled entry."; Panel2Bullets=@("Arrivals are easy to confirm and update","Host confirmation remains visible","Flagged or incomplete entries stay obvious","History supports later review");
    Panel3Title="Safe and efficient entry"; Panel3Subtitle="The screen should balance speed and control."; Panel3Bullets=@("Pending and denied states stay clear","Host linkage remains obvious","History supports traceability");
    AnnotationTitles=@("Expected vs walk-in clarity","Pass readiness visible","Flagged entries obvious","Host linkage matters","Fast front-desk action","Traceable entry history");
    Annotations=@("Visitor intake benefits from clear expected-versus-unexpected visibility.","Pass readiness should be obvious before arrival.","Flagged entries need stronger emphasis.","Host linkage helps reduce confusion.","Front-desk teams need speed without losing control.","History supports security review.");
    MobileSubtitle="Visitor registration, host linkage, pass readiness, and arrival state"; MobileBullets1=@("Arrivals stay visible","Pass readiness is clear","Flagged entries stand out"); MobileBullets2=@("Host linkage stays obvious","Desk action remains fast","History supports traceability")
  },
  @{
    Ref="VWP-SCR-002"; Slug="meeting-and-room-booking-workspace"; Title="Meeting and Room Booking Workspace"; SidebarTitle="Room Booking"; SearchHint="Search meeting, room, visitor, capacity, or booking"; TopPill1="Meetings"; TopPill2="Alerts 04"; TopPill3="Rooms 18"; Hero1="Meetings"; Hero2="Rooms"; Hero3="Capacity";
    PrimaryAction="Open booking grid"; SecondaryAction="Review visitor-linked meeting";
    SubSearch="Filter bookings, rooms, visitors, capacity, or conflicts"; Filter1="Bookings"; Filter2="Rooms"; Filter3="Conflict";
    Sidebar=@("Bookings","Rooms","Meetings","Visitors","Conflicts","History");
    Metrics=@(@{label="Bookings";value="24";color="#15803D"},@{label="Conflicts";value="03";color="#D97706"},@{label="Visitor";value="05";color="#B42318"},@{label="Rooms";value="18";color="#2563EB"});
    Panel1Title="Meeting bookings and room context"; Panel1Subtitle="Employees and admins need a shared picture of booking status and room fit."; Panel1Bullets=@("Bookings show room, time, capacity, and host context","Conflicts stand out clearly","Visitor-linked meetings remain visible","Alternatives are easy to inspect");
    Panel2Title="Operational booking control"; Panel2Subtitle="The workspace should support smooth scheduling rather than reactive cleanup."; Panel2Bullets=@("Capacity and room fit remain visible","Conflict resolution actions stay nearby","History supports later adjustments","The screen supports host and admin collaboration");
    Panel3Title="Booking confidence"; Panel3Subtitle="The screen should reduce last-minute room issues."; Panel3Bullets=@("Conflict states remain obvious","Alternatives stay accessible","History helps explain changes");
    AnnotationTitles=@("Booking with fit context","Conflicts rise early","Visitor-linked meetings visible","Alternatives nearby","Host and admin collaboration","History supports changes");
    Annotations=@("Meeting booking works better when room fit stays visible.","Conflicts should stand out before the meeting start.","Visitor-linked meetings need explicit visibility.","Alternatives reduce rescheduling friction.","The workspace should support host and admin collaboration.","History helps explain booking changes.");
    MobileSubtitle="Meeting bookings, room fit, conflicts, and visitor-linked events"; MobileBullets1=@("Bookings stay visible","Conflicts stand out","Visitor-linked meetings remain clear"); MobileBullets2=@("Alternatives stay nearby","Room fit remains visible","History supports changes")
  },
  @{
    Ref="VWP-SCR-003"; Slug="desk-shuttle-parking-and-workplace-services-hub"; Title="Desk, Shuttle, Parking, and Workplace Services Hub"; SidebarTitle="Workplace Services"; SearchHint="Search desk, shuttle, parking, meal, or booking"; TopPill1="Services"; TopPill2="Alerts 03"; TopPill3="Bookings 11"; Hero1="Desks"; Hero2="Shuttle"; Hero3="Parking";
    PrimaryAction="Open service booking"; SecondaryAction="Review shuttle roster";
    SubSearch="Filter desk, shuttle, parking, cafeteria, or workplace service requests"; Filter1="Desk"; Filter2="Shuttle"; Filter3="Parking";
    Sidebar=@("Desk","Shuttle","Parking","Cafeteria","Services","History");
    Metrics=@(@{label="Bookings";value="11";color="#15803D"},@{label="Waitlist";value="02";color="#D97706"},@{label="Issues";value="01";color="#B42318"},@{label="Services";value="07";color="#2563EB"});
    Panel1Title="Workplace booking and commute visibility"; Panel1Subtitle="Employees should be able to manage common workplace services from one hub."; Panel1Bullets=@("Desk, shuttle, and parking bookings remain grouped","Waitlist or issue states stand out","Service availability stays visible","Daily workplace planning feels lightweight");
    Panel2Title="Service operations and follow-up"; Panel2Subtitle="The hub should make small operational services easy to manage."; Panel2Bullets=@("Booking detail and support actions stay nearby","Availability and conflict cues remain visible","History supports repeat bookings","The screen remains low-friction and practical");
    Panel3Title="Everyday workplace ease"; Panel3Subtitle="The experience should feel helpful, not heavy."; Panel3Bullets=@("Core services stay visible","Issues remain obvious","History supports repeat use");
    AnnotationTitles=@("Grouped workplace services","Waitlist visible","Availability nearby","Support stays close","Repeat use supported","Low-friction utility");
    Annotations=@("Employees benefit from one place for common workplace services.","Waitlist and issue states should stay visible.","Availability needs to be close to booking action.","Support should remain easy to reach.","History helps employees repeat routine bookings.","The hub should feel practical and low-friction.");
    MobileSubtitle="Desk, shuttle, parking, and workplace service bookings"; MobileBullets1=@("Core services stay grouped","Waitlist states stand out","Availability remains visible"); MobileBullets2=@("Support stays nearby","Issues remain obvious","History supports repeat use")
  },
  @{
    Ref="HSW-SCR-002"; Slug="safety-audit-and-risk-assessment-workspace"; Title="Safety Audit and Risk Assessment Workspace"; SidebarTitle="Safety Audit"; SearchHint="Search audit, site, risk, finding, or owner"; TopPill1="Audit"; TopPill2="Alerts 04"; TopPill3="Findings 09"; Hero1="Audits"; Hero2="Risk"; Hero3="Findings";
    PrimaryAction="Open risk review"; SecondaryAction="Review finding owner";
    SubSearch="Filter audits, risk level, findings, or due actions"; Filter1="Audit"; Filter2="Risk"; Filter3="Findings";
    Sidebar=@("Audits","Risk","Findings","Actions","Sites","History");
    Metrics=@(@{label="Audits";value="06";color="#15803D"},@{label="Risk";value="05";color="#D97706"},@{label="Overdue";value="02";color="#B42318"},@{label="Findings";value="09";color="#2563EB"});
    Panel1Title="Audit execution and risk visibility"; Panel1Subtitle="Safety teams need clear operational visibility into findings and risk posture."; Panel1Bullets=@("Audit schedules and site context stay visible","High-risk findings stand out clearly","Owner and due date remain easy to inspect","Corrective action stays tied to the finding");
    Panel2Title="Follow-up and remediation"; Panel2Subtitle="The workspace should support closure, not just documentation."; Panel2Bullets=@("Corrective actions remain close to the risk view","Overdue remediations are obvious","History supports regulatory review","The screen supports officer and site collaboration");
    Panel3Title="Safer operations"; Panel3Subtitle="The workspace should encourage disciplined follow-through."; Panel3Bullets=@("Risk visibility remains strong","Ownership stays clear","History supports later investigation");
    AnnotationTitles=@("Site plus risk context","High-risk stands out","Action stays attached","Overdue visibility","Cross-site collaboration","History supports review");
    Annotations=@("Safety audits work best when site and risk context stay together.","High-risk findings need strong emphasis.","Corrective action should remain attached to the finding.","Overdue remediations should stand out early.","The workspace should support officer and site collaboration.","History supports later reviews and investigations.");
    MobileSubtitle="Audit schedules, risk findings, remediation, and due actions"; MobileBullets1=@("Risk stays visible","Findings remain grouped","Owners stay clear"); MobileBullets2=@("Overdue actions stand out","Remediation stays attached","History supports review")
  },
  @{
    Ref="HSW-SCR-003"; Slug="occupational-health-and-medical-compliance-workspace"; Title="Occupational Health and Medical Compliance Workspace"; SidebarTitle="Medical Compliance"; SearchHint="Search exam, vaccination, health check, or hold"; TopPill1="Medical"; TopPill2="Alerts 05"; TopPill3="Due 06"; Hero1="Health checks"; Hero2="Vaccination"; Hero3="Holds";
    PrimaryAction="Open compliance queue"; SecondaryAction="Review health hold";
    SubSearch="Filter medical checks, vaccinations, due items, or holds"; Filter1="Checks"; Filter2="Vaccination"; Filter3="Holds";
    Sidebar=@("Checks","Vaccination","Holds","Programs","History","Support");
    Metrics=@(@{label="Due";value="06";color="#15803D"},@{label="Holds";value="03";color="#D97706"},@{label="Expired";value="02";color="#B42318"},@{label="Programs";value="07";color="#2563EB"});
    Panel1Title="Medical compliance and hold visibility"; Panel1Subtitle="The workspace should make due, expired, and hold states obvious without losing sensitivity."; Panel1Bullets=@("Medical checks and vaccination state remain visible","Due and expired items stand out early","Compliance holds remain clearly labeled","Program context stays nearby");
    Panel2Title="Sensitive follow-up and support"; Panel2Subtitle="Medical workflows need clarity, privacy, and strong follow-up."; Panel2Bullets=@("Support and next steps remain easy to inspect","Hold reasons stay explicit","History supports later validation","The screen remains role-safe and practical");
    Panel3Title="Clear health operations"; Panel3Subtitle="The workspace should reduce compliance misses."; Panel3Bullets=@("Due states remain obvious","Holds stay explicit","History supports review");
    AnnotationTitles=@("Due and expired visibility","Hold reason clarity","Program context nearby","Sensitive but usable","Role-safe history","Compliance-first view");
    Annotations=@("Medical compliance needs strong due and expiry visibility.","Hold reasons should be clearly explained.","Program context helps users understand next steps.","The workspace should stay useful without oversharing sensitive details.","History remains important for later validation.","This is a compliance-first but still practical surface.");
    MobileSubtitle="Health checks, vaccination status, due items, and compliance holds"; MobileBullets1=@("Due items stand out","Holds remain explicit","Program context stays nearby"); MobileBullets2=@("Support remains easy","History stays role-safe","Compliance view remains practical")
  },
  @{
    Ref="HSW-SCR-004"; Slug="emergency-response-command-workspace"; Title="Emergency Response Command Workspace"; SidebarTitle="Emergency Response"; SearchHint="Search incident, command, contact, or checkpoint"; TopPill1="Emergency"; TopPill2="Alerts 02"; TopPill3="Active 01"; Hero1="Command"; Hero2="Contacts"; Hero3="Checkpoints";
    PrimaryAction="Open response plan"; SecondaryAction="Review readiness";
    SubSearch="Filter incidents, checkpoints, contacts, or readiness state"; Filter1="Incident"; Filter2="Command"; Filter3="Ready";
    Sidebar=@("Command","Contacts","Checkpoints","Sites","Readiness","History");
    Metrics=@(@{label="Plans";value="05";color="#15803D"},@{label="Active";value="01";color="#D97706"},@{label="Critical";value="01";color="#B42318"},@{label="Sites";value="07";color="#2563EB"});
    Panel1Title="Command posture and critical contact visibility"; Panel1Subtitle="Emergency response needs a clearer command surface than ordinary case management."; Panel1Bullets=@("Command steps and checkpoint status remain visible","Critical contacts stay easy to access","Active incident status stands out strongly","Site-specific readiness stays nearby");
    Panel2Title="Response execution and readiness"; Panel2Subtitle="The workspace should support both live response and preparation."; Panel2Bullets=@("Checkpoints are easy to update","Readiness gaps remain visible","History supports drills and investigations","The screen remains focused and calm under stress");
    Panel3Title="Crisis-ready clarity"; Panel3Subtitle="The workspace should feel decisive and simple."; Panel3Bullets=@("Critical items stay obvious","Contacts remain nearby","History supports drills");
    AnnotationTitles=@("Command first","Critical contact visibility","Active incident emphasis","Readiness gaps visible","Calm under stress","History supports drills");
    Annotations=@("Emergency surfaces should emphasize command clarity first.","Critical contacts need immediate visibility.","Active incident state should dominate attention.","Readiness gaps should be visible before crisis moments.","The screen should feel calm even in stress.","History supports drills and investigations.");
    MobileSubtitle="Command steps, critical contacts, checkpoints, and readiness"; MobileBullets1=@("Command stays first","Critical contacts remain nearby","Active incidents stand out"); MobileBullets2=@("Readiness gaps remain visible","Checkpoints stay simple","History supports drills")
  },
  @{
    Ref="COMMS-SCR-001"; Slug="channel-console-and-delivery-workspace"; Title="Channel Console and Delivery Workspace"; SidebarTitle="Channel Console"; SearchHint="Search email, SMS, push, WhatsApp, or delivery"; TopPill1="Channels"; TopPill2="Alerts 04"; TopPill3="Failures 03"; Hero1="Email"; Hero2="SMS"; Hero3="Delivery";
    PrimaryAction="Open channel health"; SecondaryAction="Review failed sends";
    SubSearch="Filter channels, failures, templates, or delivery health"; Filter1="Channels"; Filter2="Delivery"; Filter3="Failures";
    Sidebar=@("Channels","Health","Failures","Templates","Routing","History");
    Metrics=@(@{label="Channels";value="04";color="#15803D"},@{label="Failures";value="03";color="#D97706"},@{label="Paused";value="01";color="#B42318"},@{label="Templates";value="18";color="#2563EB"});
    Panel1Title="Channel posture and send reliability"; Panel1Subtitle="Communications admins need a quick picture of what is healthy, degraded, or paused."; Panel1Bullets=@("Channel state remains visible per medium","Delivery failures stand out clearly","Template and route linkage stay nearby","Paused states remain explicit");
    Panel2Title="Troubleshooting and controlled recovery"; Panel2Subtitle="The workspace should help teams recover without guesswork."; Panel2Bullets=@("Failed sends are easy to inspect","Channel-specific recovery steps remain visible","History supports later analysis","The view supports admin action without clutter");
    Panel3Title="Reliable communications operations"; Panel3Subtitle="The workspace should reduce blind spots."; Panel3Bullets=@("Health remains obvious","Failure groups stay visible","History supports better operations");
    AnnotationTitles=@("State per channel","Failures visible","Paused states explicit","Template linkage nearby","Recovery support","History for analysis");
    Annotations=@("Channel health should be visible per medium.","Failures need strong visibility and grouping.","Paused states should never be ambiguous.","Template linkage helps troubleshooting.","Recovery support should remain nearby.","History helps improve reliability over time.");
    MobileSubtitle="Channel state, delivery failures, paused sends, and recovery"; MobileBullets1=@("Channel health stays visible","Failures stand out","Paused states remain explicit"); MobileBullets2=@("Recovery steps stay nearby","Template linkage remains clear","History supports analysis")
  },
  @{
    Ref="COMMS-SCR-002"; Slug="announcements-and-bulletin-hub"; Title="Announcements and Bulletin Hub"; SidebarTitle="Announcements"; SearchHint="Search bulletin, announcement, news, or audience"; TopPill1="Announcements"; TopPill2="Alerts 02"; TopPill3="Audience 06"; Hero1="Bulletins"; Hero2="Audience"; Hero3="Pinned";
    PrimaryAction="Open bulletin board"; SecondaryAction="Review audience reach";
    SubSearch="Filter news, announcements, pinned items, or audience segments"; Filter1="News"; Filter2="Pinned"; Filter3="Audience";
    Sidebar=@("Board","News","Pinned","Audience","Schedule","History");
    Metrics=@(@{label="Live";value="14";color="#15803D"},@{label="Pinned";value="05";color="#D97706"},@{label="Draft";value="02";color="#B42318"},@{label="Segments";value="06";color="#2563EB"});
    Panel1Title="Bulletin content and audience relevance"; Panel1Subtitle="Communications teams need a surface that balances visibility and targeting."; Panel1Bullets=@("Live and pinned items remain visible","Audience segmentation stays close to each announcement","Draft and scheduled states remain distinct","Reach context supports better prioritization");
    Panel2Title="Publication control and clarity"; Panel2Subtitle="The hub should help teams avoid noisy or poorly targeted communication."; Panel2Bullets=@("Schedule and targeting remain easy to inspect","Pinned items stay explicit","History supports later review","The screen remains content-forward and practical");
    Panel3Title="Better announcement hygiene"; Panel3Subtitle="The screen should make communication quality easier to manage."; Panel3Bullets=@("Live vs scheduled remains clear","Audience stays visible","History supports cleanup");
    AnnotationTitles=@("Targeting nearby","Pinned state clear","Draft vs live distinct","Reach context useful","History supports cleanup","Content-forward design");
    Annotations=@("Announcements work better when targeting context is nearby.","Pinned items should remain visually distinct.","Draft and live states must be obvious.","Reach context supports better prioritization.","History helps teams clean up stale communication.","The design should stay content-forward, not over-tooled.");
    MobileSubtitle="News, bulletins, pinned items, audience targeting, and schedule"; MobileBullets1=@("Pinned items stay visible","Draft and live are distinct","Audience remains nearby"); MobileBullets2=@("Reach context stays useful","Schedule remains clear","History supports cleanup")
  },
  @{
    Ref="COMMS-SCR-003"; Slug="campaign-composer-and-audience-scheduler"; Title="Campaign Composer and Audience Scheduler"; SidebarTitle="Campaign Composer"; SearchHint="Search campaign, segment, send, or schedule"; TopPill1="Campaigns"; TopPill2="Alerts 03"; TopPill3="Schedule 05"; Hero1="Campaign"; Hero2="Audience"; Hero3="Schedule";
    PrimaryAction="Open composer"; SecondaryAction="Review send schedule";
    SubSearch="Filter campaigns, audience segments, schedules, or approval holds"; Filter1="Compose"; Filter2="Audience"; Filter3="Schedule";
    Sidebar=@("Compose","Audience","Schedule","Approvals","Preview","History");
    Metrics=@(@{label="Campaigns";value="09";color="#15803D"},@{label="Segments";value="11";color="#D97706"},@{label="Held";value="02";color="#B42318"},@{label="Schedules";value="05";color="#2563EB"});
    Panel1Title="Composer and audience targeting"; Panel1Subtitle="Campaign building should combine message structure and audience logic clearly."; Panel1Bullets=@("Composer and preview remain closely connected","Audience logic is easy to inspect","Approval holds stay visible before send","Schedules remain explicit");
    Panel2Title="Controlled send planning"; Panel2Subtitle="Teams need confidence before a campaign goes live."; Panel2Bullets=@("Schedule and approval state stay clear","Audience size and exclusions remain visible","History supports later optimization","The workspace supports iterative drafting");
    Panel3Title="Campaign confidence"; Panel3Subtitle="The screen should reduce send anxiety."; Panel3Bullets=@("Preview remains nearby","Holds stay visible","History supports better planning");
    AnnotationTitles=@("Compose with preview","Audience logic visible","Schedule explicit","Approval holds nearby","Iterative drafting supported","History for optimization");
    Annotations=@("Campaign work is easier when composition and preview stay together.","Audience logic should be visible and trustworthy.","Schedules need explicit visibility.","Approval holds should appear before go-live.","Iterative drafting should feel supported.","History helps optimize future sends.");
    MobileSubtitle="Campaign composer, audience targeting, schedule, and approval hold"; MobileBullets1=@("Preview stays nearby","Audience logic remains visible","Schedules stay explicit"); MobileBullets2=@("Holds remain clear","Drafting feels iterative","History supports optimization")
  },
  @{
    Ref="DOC-SCR-003"; Slug="digital-signature-and-document-action-workspace"; Title="Digital Signature and Document Action Workspace"; SidebarTitle="Document Actions"; SearchHint="Search signature, signer, document, expiry, or action"; TopPill1="Signatures"; TopPill2="Alerts 04"; TopPill3="Expiry 03"; Hero1="Documents"; Hero2="Signers"; Hero3="Expiry";
    PrimaryAction="Open signature queue"; SecondaryAction="Review expiring link";
    SubSearch="Filter signature status, signers, expiry, or document action"; Filter1="Queue"; Filter2="Signers"; Filter3="Expiry";
    Sidebar=@("Queue","Signers","Expiry","Actions","Templates","History");
    Metrics=@(@{label="Open";value="16";color="#15803D"},@{label="Expired";value="03";color="#D97706"},@{label="Failed";value="02";color="#B42318"},@{label="Actions";value="09";color="#2563EB"});
    Panel1Title="Signature action and signer visibility"; Panel1Subtitle="Document action surfaces should show who must sign, what is blocked, and what has expired."; Panel1Bullets=@("Signature state stays visible per document and signer","Expired or failed links stand out","Action options remain nearby","Document context stays attached");
    Panel2Title="Controlled follow-up and recovery"; Panel2Subtitle="Admins should be able to recover from failed signature flows without confusion."; Panel2Bullets=@("Resend and revoke actions remain easy to inspect","Signer history remains visible","Expiry and reminder state stay explicit","The workspace supports operational follow-through");
    Panel3Title="Reliable document action flow"; Panel3Subtitle="The screen should make document action status easy to trust."; Panel3Bullets=@("Expired and failed remain obvious","Signer state stays visible","History supports later review");
    AnnotationTitles=@("Signer visibility","Expiry obvious","Failed links stand out","Recovery actions nearby","Document context retained","History supports trust");
    Annotations=@("Document action work benefits from strong signer visibility.","Expiry should be obvious before links fail silently.","Failed links need strong visibility.","Recovery actions should remain nearby.","Document context must stay attached to the action.","History helps teams trust the status flow.");
    MobileSubtitle="Signature queue, signer state, expiry, and resend or revoke actions"; MobileBullets1=@("Signer state stays visible","Expired links stand out","Document context remains attached"); MobileBullets2=@("Recovery actions stay nearby","Reminder state remains clear","History supports trust")
  },
  @{
    Ref="DOC-SCR-004"; Slug="ocr-and-retention-policy-console"; Title="OCR and Retention Policy Console"; SidebarTitle="Retention Console"; SearchHint="Search OCR, retention, hold, policy, or expiry"; TopPill1="Retention"; TopPill2="Alerts 05"; TopPill3="Holds 03"; Hero1="OCR"; Hero2="Retention"; Hero3="Holds";
    PrimaryAction="Open retention policy"; SecondaryAction="Review OCR exceptions";
    SubSearch="Filter OCR issues, retention rules, legal holds, or expiry policy"; Filter1="OCR"; Filter2="Retention"; Filter3="Holds";
    Sidebar=@("OCR","Retention","Holds","Expiry","Policies","History");
    Metrics=@(@{label="Policies";value="14";color="#15803D"},@{label="OCR gaps";value="04";color="#D97706"},@{label="Holds";value="03";color="#B42318"},@{label="Expiry";value="08";color="#2563EB"});
    Panel1Title="OCR trust and retention rule visibility"; Panel1Subtitle="The console should connect content extraction quality to document lifecycle governance."; Panel1Bullets=@("OCR issues remain visible beside the affected document set","Retention and expiry policies stay easy to inspect","Legal hold states stand out strongly","Policy scope remains understandable");
    Panel2Title="Governed lifecycle control"; Panel2Subtitle="Teams need a safe surface for retention decisions and OCR exception review."; Panel2Bullets=@("Hold and expiry actions stay explicit","OCR exception history remains visible","Policy change impact is easier to inspect","The view supports compliance and operations together");
    Panel3Title="Confident document governance"; Panel3Subtitle="The console should feel careful and operationally useful."; Panel3Bullets=@("Hold states stay visible","OCR gaps remain actionable","History supports compliance review");
    AnnotationTitles=@("OCR with policy context","Hold visibility","Expiry nearby","Scope remains clear","Operations plus compliance","History supports governance");
    Annotations=@("OCR issue review is better when lifecycle context is nearby.","Legal holds need very strong visibility.","Expiry and retention should remain easy to inspect.","Policy scope should stay understandable.","The console should support both compliance and operations.","History helps support defensible governance.");
    MobileSubtitle="OCR issues, retention rules, expiry, and legal-hold visibility"; MobileBullets1=@("OCR issues remain visible","Hold states stand out","Expiry stays nearby"); MobileBullets2=@("Policy scope remains clear","History supports governance","Operations plus compliance stay connected")
  }
)

foreach ($screen in $screens) {
  $desktopPath = Join-Path $mockupDir ("{0}-{1}-desktop.svg" -f $screen.Ref.ToLower(), $screen.Slug)
  $mobilePath = Join-Path $mockupDir ("{0}-{1}-mobile.svg" -f $screen.Ref.ToLower(), $screen.Slug)
  [System.IO.File]::WriteAllText($desktopPath, (Render-Desktop $screen))
  [System.IO.File]::WriteAllText($mobilePath, (Render-Mobile $screen))
}
