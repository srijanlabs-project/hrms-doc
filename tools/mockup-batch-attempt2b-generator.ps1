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
    Ref="CMP-SCR-001"; Slug="compensation-planning-workspace"; Title="Compensation Planning Workspace"; SidebarTitle="Comp Planning";
    SearchHint="Search employee, budget, grade, compa-ratio, or planner"; TopPill1="Cycle"; TopPill2="Alerts 04"; TopPill3="Compare 07";
    Hero1="Budget"; Hero2="Compa ratio"; Hero3="Planner";
    PrimaryAction="Open planning sheet"; SecondaryAction="Compare scenarios";
    SubSearch="Filter planners, budgets, grade bands, or out-of-range proposals"; Filter1="Open"; Filter2="Budget"; Filter3="Compare";
    Sidebar=@("Cycle","Budget","People","Ranges","Scenarios","Approve");
    Metrics=@(@{label="Budget";value="₹4.2Cr";color="#15803D"},@{label="Outliers";value="08";color="#D97706"},@{label="Pending";value="14";color="#B42318"},@{label="Scenarios";value="03";color="#2563EB"});
    Panel1Title="Budget, range, and employee planning"; Panel1Subtitle="Compensation planning should connect budget guardrails to employee-level action.";
    Panel1Bullets=@("Budget usage and reserve remain visible by team and cycle","Compa-ratio and range position appear beside each proposal","Out-of-range recommendations stand out early","Compare views support manager and HRBP review");
    Panel2Title="Scenario and approval governance"; Panel2Subtitle="Planning needs flexible modeling without losing control.";
    Panel2Bullets=@("Scenario compare keeps assumptions explicit","Approval state is visible before publish","Policy thresholds explain blocked actions","Decision trace remains easy to review");
    Panel3Title="Careful planning workflow"; Panel3Subtitle="The workspace should feel analytical but still execution-ready.";
    Panel3Bullets=@("Range guidance reduces guesswork","Scenario history supports leadership review","Final proposals stay tied to budget impact");
    AnnotationTitles=@("Budget with people","Outlier visibility","Scenario compare","Range guidance","Approval trace","Cycle control");
    Annotations=@("Budget planning must still stay connected to employee decisions.","Outliers should surface before approval meetings.","Scenario comparison helps leadership understand tradeoffs.","Range context reduces manual mistakes.","Approval trace should remain visible through the cycle.","Planning should feel governed, not spreadsheet-only.");
    MobileSubtitle="Budget, compa-ratio, scenarios, and approval readiness"; MobileBullets1=@("Budget use stays visible","Range outliers are highlighted","Scenario compare remains clear"); MobileBullets2=@("Approval state is explicit","History supports decisions","Cycle guardrails remain obvious")
  },
  @{
    Ref="CMP-SCR-002"; Slug="salary-review-and-merit-cycle-workspace"; Title="Salary Review and Merit Cycle Workspace"; SidebarTitle="Merit Cycle";
    SearchHint="Search reviewer, employee, proposal, retro date, or status"; TopPill1="Merit"; TopPill2="Alerts 05"; TopPill3="Retro 03";
    Hero1="Cycle stage"; Hero2="Retro effective"; Hero3="Manager review";
    PrimaryAction="Review salary proposals"; SecondaryAction="Open exceptions";
    SubSearch="Filter proposals, reviewers, retro-effective items, or held decisions"; Filter1="Review"; Filter2="Retro"; Filter3="Finalize";
    Sidebar=@("Cycle","Queue","Proposals","Retro","Holds","Finalize");
    Metrics=@(@{label="Proposals";value="126";color="#15803D"},@{label="Held";value="11";color="#D97706"},@{label="Retro";value="03";color="#B42318"},@{label="Ready";value="82";color="#2563EB"});
    Panel1Title="Proposal queue and cycle movement"; Panel1Subtitle="Salary review should make stage progression and blockers easy to understand.";
    Panel1Bullets=@("Each proposal shows current stage, owner, and review deadline","Retro-effective changes remain clearly flagged","Held proposals explain why they cannot move forward","Finalize readiness is visible before closure");
    Panel2Title="Exception handling and decision quality"; Panel2Subtitle="The workspace should help managers and HRBP teams make careful revisions.";
    Panel2Bullets=@("Exception views show policy, budget, and range conflicts together","Reason capture stays near each revision","Bulk review never hides high-risk cases","Approval and finalization history remain traceable");
    Panel3Title="Cycle transparency"; Panel3Subtitle="Users should always understand what remains open.";
    Panel3Bullets=@("Stage labels remain explicit","Review comments stay attached","Closed items preserve audit-friendly history");
    AnnotationTitles=@("Stage clarity","Retro risk visible","Held cases explained","Finalize safely","Exception-first review","History retained");
    Annotations=@("Cycle stages should be visually obvious across the queue.","Retro-effective items need stronger visibility than normal proposals.","Held items should explain the exact blocker.","Finalization should feel deliberate, not one-click blind.","Exception review should be faster without becoming shallow.","Closed salary decisions need strong traceability.");
    MobileSubtitle="Proposal queue, retro-effective cases, and cycle finalization"; MobileBullets1=@("Stage labels stay visible","Held and retro items stand out","Ready items remain grouped"); MobileBullets2=@("Reasons stay attached","History remains available","Finalize is clearly gated")
  },
  @{
    Ref="CMP-SCR-003"; Slug="bonus-incentive-and-esop-planning-workspace"; Title="Bonus, Incentive, and ESOP Planning Workspace"; SidebarTitle="Variable Pay";
    SearchHint="Search pool, grant, incentive, employee, or scenario"; TopPill1="Pool"; TopPill2="Alerts 03"; TopPill3="Scenarios 04";
    Hero1="Bonus pools"; Hero2="ESOP grants"; Hero3="Incentives";
    PrimaryAction="Open payout plan"; SecondaryAction="Compare grant scenarios";
    SubSearch="Filter bonus pools, incentive plans, grants, or scenario variance"; Filter1="Pools"; Filter2="Grants"; Filter3="Scenario";
    Sidebar=@("Pools","Incentives","ESOP","Scenarios","Approvals","Publish");
    Metrics=@(@{label="Pools";value="07";color="#15803D"},@{label="Grants";value="24";color="#D97706"},@{label="Exceptions";value="05";color="#B42318"},@{label="Scenarios";value="04";color="#2563EB"});
    Panel1Title="Pool allocation and grant planning"; Panel1Subtitle="Variable pay planning should keep incentives, pools, and grants in one governed surface.";
    Panel1Bullets=@("Bonus pools remain visible by team and funding source","Grant status and vesting visibility stay close to the employee list","Scenario variance is easy to compare","Exceptions and caps stand out");
    Panel2Title="Scenario review and controlled release"; Panel2Subtitle="Leaders need flexibility without losing transparency.";
    Panel2Bullets=@("Scenarios compare payout impact and grant mix","Approval state remains visible before release","Grant and incentive rationale stay attached","Publish and rollback behavior are clearly separated");
    Panel3Title="Leadership-ready planning"; Panel3Subtitle="The workspace should support fast executive review.";
    Panel3Bullets=@("Summary views reduce meeting prep time","Outliers remain explorable","Final decisions preserve planning context");
    AnnotationTitles=@("Pools with context","Grant visibility","Scenario discipline","Exception visibility","Publish control","Decision retention");
    Annotations=@("Bonus pools need business context, not only totals.","Grant planning should remain easy to inspect at employee level.","Scenario comparison supports better leadership tradeoffs.","Exceptions should never hide inside aggregate views.","Release controls matter for payouts and grants.","Decision history helps later audit and employee queries.");
    MobileSubtitle="Bonus pools, incentives, grants, and release readiness"; MobileBullets1=@("Pools and grants stay visible","Scenarios remain comparable","Exceptions stand out"); MobileBullets2=@("Approval state stays near actions","Release controls are explicit","Final decisions keep context")
  },
  @{
    Ref="CMP-SCR-004"; Slug="benefits-enrollment-and-flexible-benefits-workspace"; Title="Benefits Enrollment and Flexible Benefits Workspace"; SidebarTitle="Benefits Hub";
    SearchHint="Search plan, dependent, enrollment, allocation, or window"; TopPill1="Enrollment"; TopPill2="Alerts 06"; TopPill3="Dependents 12";
    Hero1="Window active"; Hero2="FBP"; Hero3="Coverage";
    PrimaryAction="Open enrollment"; SecondaryAction="Review allocations";
    SubSearch="Filter plans, dependents, pending approvals, or enrollment windows"; Filter1="Plans"; Filter2="Dependents"; Filter3="Window";
    Sidebar=@("Plans","Dependents","FBP","Claims","Window","History");
    Metrics=@(@{label="Plans";value="18";color="#15803D"},@{label="Enrolled";value="84%";color="#D97706"},@{label="Pending";value="09";color="#B42318"},@{label="FBP";value="22";color="#2563EB"});
    Panel1Title="Plan selection and dependent coverage"; Panel1Subtitle="Benefits choice should be clear even when rules are complex.";
    Panel1Bullets=@("Plan cards show coverage, cost, and dependent impact","Dependent validation remains visible before submission","Enrollment window and lock state are easy to understand","Flexible-benefit allocation stays close to tax and policy context");
    Panel2Title="Enrollment workflow and guardrails"; Panel2Subtitle="The user should understand what can still change and what is already locked.";
    Panel2Bullets=@("Pending approvals and policy holds are clearly labeled","Allocation checks prevent over-commitment","Life-event and window exceptions stay visible","History and confirmation remain easy to retrieve");
    Panel3Title="Policy-friendly self-service"; Panel3Subtitle="The screen should reduce confusion during benefit windows.";
    Panel3Bullets=@("Dependent actions stay tied to plan changes","Window closing cues remain prominent","Previous enrollment state is easy to compare");
    AnnotationTitles=@("Plan clarity","Dependent validation","Window visibility","Allocation guardrails","Policy holds","History access");
    Annotations=@("Benefits choice should balance clarity and policy depth.","Dependent validation must be visible before commit.","Enrollment windows need strong visibility.","Allocation guardrails reduce mistakes during FBP selection.","Policy holds should explain why actions are blocked.","History and confirmation support employee trust.");
    MobileSubtitle="Plan selection, dependents, FBP allocation, and enrollment window"; MobileBullets1=@("Plan cards stay readable","Dependent checks remain visible","Window status is obvious"); MobileBullets2=@("Allocation guardrails stay nearby","Holds are explained","History remains accessible")
  },
  @{
    Ref="ESS-SCR-004"; Slug="employee-leave-attendance-and-travel-hub"; Title="Employee Leave, Attendance, and Travel Hub"; SidebarTitle="My Operations";
    SearchHint="Search leave, punch, trip, approval, or balance"; TopPill1="Attendance"; TopPill2="Alerts 05"; TopPill3="Trips 02";
    Hero1="Balance"; Hero2="Missing punch"; Hero3="Travel";
    PrimaryAction="Apply leave"; SecondaryAction="Plan trip";
    SubSearch="Filter leave requests, punches, travel plans, or team approvals"; Filter1="Leave"; Filter2="Attendance"; Filter3="Travel";
    Sidebar=@("Hub","Leave","Attendance","Travel","Calendar","Requests");
    Metrics=@(@{label="Leave";value="8.5";color="#15803D"},@{label="Late marks";value="02";color="#D97706"},@{label="Trips";value="02";color="#B42318"},@{label="Requests";value="05";color="#2563EB"});
    Panel1Title="Daily operations and quick action rhythm"; Panel1Subtitle="Employees need one surface for routine attendance, leave, and travel work.";
    Panel1Bullets=@("Leave balance and upcoming holidays remain visible","Missing punches and regularization stand out early","Trip status and approvals stay close to attendance context","Quick actions keep daily work fast");
    Panel2Title="Requests and status visibility"; Panel2Subtitle="The hub should make it easy to understand what is pending and what needs attention.";
    Panel2Bullets=@("Pending leave, travel, or attendance actions remain grouped","Request history is easy to inspect","Policy cues reduce mistakes before submission","AI help remains optional and lightweight");
    Panel3Title="Self-service confidence"; Panel3Subtitle="The employee should feel oriented, not overloaded.";
    Panel3Bullets=@("Calendar context reduces conflicts","Travel and leave dates remain easy to compare","Actionable items stay above passive metrics");
    AnnotationTitles=@("One daily hub","Missing punch visibility","Travel near leave","Quick actions matter","Request grouping","Calendar context");
    Annotations=@("Daily people operations work better when it lives in one hub.","Missing punch issues need early visibility.","Travel belongs beside leave and attendance in self-service.","Quick actions reduce repeated navigation.","Pending requests should remain grouped by urgency.","Calendar context helps prevent clashes.");
    MobileSubtitle="Leave balance, punches, travel, and request status"; MobileBullets1=@("Daily actions stay prominent","Missing punches stand out","Trips remain visible"); MobileBullets2=@("Pending requests stay grouped","Calendar cues help planning","Quick actions remain obvious")
  },
  @{
    Ref="ESS-SCR-005"; Slug="employee-claims-benefits-and-assets-hub"; Title="Employee Claims, Benefits, and Assets Hub"; SidebarTitle="My Benefits";
    SearchHint="Search claim, expense, benefit, asset, or support"; TopPill1="Claims"; TopPill2="Alerts 04"; TopPill3="Assets 03";
    Hero1="Claims"; Hero2="Benefits"; Hero3="Assets";
    PrimaryAction="Create claim"; SecondaryAction="View benefits";
    SubSearch="Filter claims, benefits, reimbursements, assets, or support"; Filter1="Claims"; Filter2="Benefits"; Filter3="Assets";
    Sidebar=@("Hub","Claims","Benefits","Assets","Reimbursements","Support");
    Metrics=@(@{label="Claims";value="04";color="#15803D"},@{label="Benefits";value="06";color="#D97706"},@{label="Assets";value="03";color="#B42318"},@{label="Pending";value="05";color="#2563EB"});
    Panel1Title="Claims, coverage, and asset visibility"; Panel1Subtitle="Employees should be able to understand benefits and owned assets from one hub.";
    Panel1Bullets=@("Open claims and reimbursements remain visible","Benefit coverage and plan state are easy to review","Assigned assets stay visible with return or issue cues","Important support actions remain nearby");
    Panel2Title="Status and self-service support"; Panel2Subtitle="The hub should reduce back-and-forth for common employee questions.";
    Panel2Bullets=@("Pending reimbursements and claim returns are clear","Benefits and asset history remain accessible","Links to detailed workflows are easy to launch","Support guidance stays contextual");
    Panel3Title="Employee trust and clarity"; Panel3Subtitle="The screen should feel dependable and low-effort.";
    Panel3Bullets=@("Pending items stay above static information","History supports self-resolution","Asset and benefit state remain easy to understand");
    AnnotationTitles=@("Claims plus benefits","Asset context","Pending-first design","History nearby","Support linkage","Low-effort self-service");
    Annotations=@("Employees often think in outcomes, not module boundaries.","Asset state should be visible beside claims and benefits context.","Pending work should surface before reference information.","History helps users answer their own questions.","Contextual support reduces ticket creation.","The hub should feel simple despite many domains.");
    MobileSubtitle="Claims, benefits, assets, and reimbursement status"; MobileBullets1=@("Claims and benefits stay together","Asset status remains visible","Pending items rise first"); MobileBullets2=@("History remains nearby","Support is contextual","Self-service stays simple")
  },
  @{
    Ref="TRV-SCR-001"; Slug="travel-request-wizard"; Title="Travel Request Wizard"; SidebarTitle="Travel Request";
    SearchHint="Search purpose, destination, approver, or policy"; TopPill1="Draft"; TopPill2="Alerts 03"; TopPill3="Policy";
    Hero1="Purpose"; Hero2="Approvals"; Hero3="Policy";
    PrimaryAction="Submit request"; SecondaryAction="Save draft";
    SubSearch="Filter travel request fields, policy rules, or approval route"; Filter1="Draft"; Filter2="Policy"; Filter3="Submit";
    Sidebar=@("Trip","Dates","Cost","Approvals","Policy","Submit");
    Metrics=@(@{label="Steps";value="06";color="#15803D"},@{label="Approvers";value="02";color="#D97706"},@{label="Violations";value="01";color="#B42318"},@{label="Drafts";value="03";color="#2563EB"});
    Panel1Title="Guided request creation"; Panel1Subtitle="The wizard should make policy-compliant travel requests easy to submit.";
    Panel1Bullets=@("Trip purpose, dates, and destination remain grouped logically","Estimated cost and policy checks update early","Approval route is visible before final submit","Violation states explain what needs correction");
    Panel2Title="Policy and decision transparency"; Panel2Subtitle="Travel requests are smoother when policy is part of the creation flow.";
    Panel2Bullets=@("Policy warnings are visible in-line","Draft and submitted states are clearly separated","Required documents and justification remain obvious","Save-and-return stays safe");
    Panel3Title="Low-friction request flow"; Panel3Subtitle="The experience should feel guided but not heavy.";
    Panel3Bullets=@("Step progress remains visible","Policy cues reduce rework","Final review stays concise");
    AnnotationTitles=@("Guided flow","Policy early","Approval visible","Violations explained","Draft safety","Review before submit");
    Annotations=@("Travel requests benefit from step-by-step guidance.","Policy should appear before final submission.","Approval routing needs early visibility.","Violations should explain the fix, not only block.","Draft saving must feel safe for interrupted users.","Final review should be concise and clear.");
    MobileSubtitle="Trip purpose, policy checks, approvals, and submission"; MobileBullets1=@("Step flow remains clear","Policy warnings show early","Approvers stay visible"); MobileBullets2=@("Draft save is safe","Violations explain fixes","Final review stays simple")
  },
  @{
    Ref="TRV-SCR-002"; Slug="trip-planning-workspace"; Title="Trip Planning Workspace"; SidebarTitle="Trip Planner";
    SearchHint="Search booking, task, itinerary, vendor, or milestone"; TopPill1="Planning"; TopPill2="Alerts 04"; TopPill3="Vendors 03";
    Hero1="Bookings"; Hero2="Milestones"; Hero3="Travel desk";
    PrimaryAction="Open trip plan"; SecondaryAction="Assign booking";
    SubSearch="Filter planning tasks, booking status, vendors, or itinerary milestones"; Filter1="Tasks"; Filter2="Bookings"; Filter3="Plan";
    Sidebar=@("Plan","Bookings","Tasks","Vendors","Milestones","Notes");
    Metrics=@(@{label="Trips";value="07";color="#15803D"},@{label="Tasks";value="19";color="#D97706"},@{label="Risk";value="02";color="#B42318"},@{label="Vendors";value="03";color="#2563EB"});
    Panel1Title="Trip tasks and booking coordination"; Panel1Subtitle="Planning should connect all travel actions in one operational view.";
    Panel1Bullets=@("Flight, hotel, visa, and local travel tasks remain grouped","Booking status is visible per vendor and leg","Milestones help travelers and desk teams stay aligned","Risks or delays stand out early");
    Panel2Title="Desk coordination and traveler readiness"; Panel2Subtitle="This workspace should help both employee and travel desk collaborate.";
    Panel2Bullets=@("Ownership of booking tasks remains visible","Notes and traveler preferences stay attached","Vendor changes or failures are easy to inspect","Trip readiness is clear before departure");
    Panel3Title="Planning confidence"; Panel3Subtitle="Users should know what is left to complete.";
    Panel3Bullets=@("Milestone status reduces uncertainty","Task ownership stays explicit","Trip plan history remains available");
    AnnotationTitles=@("Planning in one place","Vendor visibility","Milestone clarity","Shared ownership","Risk early","History retained");
    Annotations=@("Trip planning works better when tasks live in one workspace.","Vendor status should stay visible beside tasks.","Milestones reduce uncertainty before travel.","Shared ownership supports employee and desk collaboration.","Risks should surface before departure day.","Planning history helps future support.");
    MobileSubtitle="Trip tasks, booking status, milestones, and vendor coordination"; MobileBullets1=@("Tasks stay grouped","Booking status remains visible","Milestones are easy to scan"); MobileBullets2=@("Ownership remains clear","Risks stand out","History is preserved")
  },
  @{
    Ref="TRV-SCR-003"; Slug="itinerary-and-booking-coordination-screen"; Title="Itinerary and Booking Coordination Screen"; SidebarTitle="Itinerary";
    SearchHint="Search leg, booking, disruption, ticket, or document"; TopPill1="Itinerary"; TopPill2="Alerts 05"; TopPill3="Disruptions 01";
    Hero1="Legs"; Hero2="Documents"; Hero3="Changes";
    PrimaryAction="View itinerary"; SecondaryAction="Manage disruption";
    SubSearch="Filter itinerary legs, booking states, disruptions, or traveler documents"; Filter1="Legs"; Filter2="Docs"; Filter3="Changes";
    Sidebar=@("Itinerary","Bookings","Documents","Disruptions","Contacts","History");
    Metrics=@(@{label="Legs";value="05";color="#15803D"},@{label="Docs";value="04";color="#D97706"},@{label="Changes";value="01";color="#B42318"},@{label="Contacts";value="03";color="#2563EB"});
    Panel1Title="Trip legs and booking detail"; Panel1Subtitle="The itinerary should make current travel status obvious at a glance.";
    Panel1Bullets=@("Flight, hotel, and ground legs remain clearly sequenced","Ticket and booking status stay close to each leg","Traveler documents remain accessible without clutter","Change history helps explain updated itineraries");
    Panel2Title="Disruption handling and support"; Panel2Subtitle="When something changes, the traveler should know exactly what to do next.";
    Panel2Bullets=@("Disruptions stand out clearly","Travel desk contacts remain nearby","Rebooking or cancellation actions are easy to reach","Proof and document state remain visible through changes");
    Panel3Title="Travel confidence"; Panel3Subtitle="The screen should reduce stress during movement.";
    Panel3Bullets=@("Key travel details stay front and center","Support actions remain close","History reduces confusion when plans change");
    AnnotationTitles=@("Leg sequencing","Document access","Disruption-first alerts","Support proximity","Change history","Calm travel view");
    Annotations=@("Travelers need leg sequence clarity first.","Documents should be easy to reach without overloading the screen.","Disruptions should dominate attention when active.","Support options should remain nearby.","Change history reduces confusion.","The screen should reduce travel stress, not add it.");
    MobileSubtitle="Itinerary legs, documents, disruptions, and support"; MobileBullets1=@("Leg order stays clear","Document access remains easy","Current changes stand out"); MobileBullets2=@("Support stays nearby","History explains changes","Travel detail remains calm")
  },
  @{
    Ref="TRV-SCR-004"; Slug="travel-advance-and-settlement-workspace"; Title="Travel Advance and Settlement Workspace"; SidebarTitle="Travel Settlement";
    SearchHint="Search advance, receipt, settlement, finance, or due"; TopPill1="Advance"; TopPill2="Alerts 04"; TopPill3="Due 03";
    Hero1="Advance"; Hero2="Settlement"; Hero3="Finance";
    PrimaryAction="Submit settlement"; SecondaryAction="Review receipts";
    SubSearch="Filter advances, receipts, finance reviews, or due settlements"; Filter1="Advance"; Filter2="Settlement"; Filter3="Due";
    Sidebar=@("Advance","Receipts","Settlement","Finance","History","Status");
    Metrics=@(@{label="Advances";value="03";color="#15803D"},@{label="Due";value="03";color="#D97706"},@{label="Returned";value="01";color="#B42318"},@{label="Receipts";value="18";color="#2563EB"});
    Panel1Title="Advance and receipt management"; Panel1Subtitle="Travel settlement should clearly show money already given and proof still needed.";
    Panel1Bullets=@("Advance amount, remaining balance, and trip linkage stay visible","Receipt status remains grouped by trip and category","Settlement due dates stand out before SLA breach","Returned items explain what needs correction");
    Panel2Title="Finance review and reimbursement status"; Panel2Subtitle="Employees and finance teams both need a clean view of where money stands.";
    Panel2Bullets=@("Finance review and reimbursement status stay close to the same case","Exceptions and missing proof remain obvious","Policy variance is visible before approval","History remains available for disputed settlements");
    Panel3Title="Settlement confidence"; Panel3Subtitle="The screen should make closeout straightforward.";
    Panel3Bullets=@("Outstanding proof is easy to spot","Status labels stay explicit","Closed settlements retain traceability");
    AnnotationTitles=@("Money with proof","Due-date visibility","Returned clarity","Finance linkage","Policy variance","Traceable closeout");
    Annotations=@("Advance and settlement belong in one connected view.","Due dates should stand out before they become breaches.","Returned items need exact correction guidance.","Finance status should remain easy to understand.","Policy variance should be visible before approval.","Closed settlements need retained traceability.");
    MobileSubtitle="Advance, receipts, finance review, and settlement due dates"; MobileBullets1=@("Advance and due stay visible","Receipts remain grouped","Returned items stand out"); MobileBullets2=@("Finance status stays nearby","Variance is visible","History remains accessible")
  },
  @{
    Ref="XPN-SCR-001"; Slug="expense-claim-and-receipt-workspace"; Title="Expense Claim and Receipt Workspace"; SidebarTitle="Expense Claims";
    SearchHint="Search claim, receipt, category, trip, or status"; TopPill1="Claims"; TopPill2="Alerts 05"; TopPill3="Receipts 16";
    Hero1="Claims"; Hero2="Receipts"; Hero3="Submit";
    PrimaryAction="Create expense claim"; SecondaryAction="Upload receipts";
    SubSearch="Filter claims, categories, receipts, or returned items"; Filter1="Claims"; Filter2="Receipts"; Filter3="Submit";
    Sidebar=@("Claims","Receipts","Categories","Policy","Status","History");
    Metrics=@(@{label="Claims";value="06";color="#15803D"},@{label="Receipts";value="16";color="#D97706"},@{label="Returned";value="02";color="#B42318"},@{label="Trips";value="03";color="#2563EB"});
    Panel1Title="Claim creation and receipt handling"; Panel1Subtitle="Employees need a clear path from receipt capture to valid claim submission.";
    Panel1Bullets=@("Claims, categories, and proof remain grouped together","Returned items show exact correction needs","Trip-linked and non-trip claims stay clearly separated","Submission readiness is visible before send");
    Panel2Title="Policy fit and status review"; Panel2Subtitle="Expense rules should help users before finance returns the claim.";
    Panel2Bullets=@("Category policy cues remain visible during entry","Receipt gaps stand out early","Status history helps explain movement through review","Quick actions support add, edit, and resubmit");
    Panel3Title="Low-friction claim flow"; Panel3Subtitle="The workspace should reduce rework.";
    Panel3Bullets=@("Receipts remain easy to attach","Policy guidance stays contextual","Past claims remain searchable");
    AnnotationTitles=@("Claim with proof","Trip separation","Policy guidance early","Returned clarity","Status history","Fast resubmission");
    Annotations=@("Claim creation should stay tightly connected to proof.","Trip and non-trip claims need visible separation.","Policy cues help reduce preventable returns.","Returned claims need exact guidance.","Status history helps users trust the process.","Resubmission should feel quick and clear.");
    MobileSubtitle="Expense claims, receipts, policy cues, and submission status"; MobileBullets1=@("Claims and proof stay together","Trip separation remains visible","Returned claims stand out"); MobileBullets2=@("Policy cues show early","History remains accessible","Resubmission stays easy")
  },
  @{
    Ref="XPN-SCR-002"; Slug="per-diem-and-ocr-review-workspace"; Title="Per Diem and OCR Review Workspace"; SidebarTitle="Per Diem OCR";
    SearchHint="Search OCR, per diem, receipt, mismatch, or category"; TopPill1="OCR"; TopPill2="Alerts 04"; TopPill3="Mismatch 03";
    Hero1="OCR scan"; Hero2="Per diem"; Hero3="Mismatch";
    PrimaryAction="Review OCR items"; SecondaryAction="Adjust per diem";
    SubSearch="Filter OCR items, categories, per diem rules, or mismatches"; Filter1="OCR"; Filter2="Per diem"; Filter3="Mismatch";
    Sidebar=@("OCR","Per diem","Mismatches","Rules","Receipts","History");
    Metrics=@(@{label="Scans";value="21";color="#15803D"},@{label="Per diem";value="07";color="#D97706"},@{label="Mismatch";value="03";color="#B42318"},@{label="Rules";value="05";color="#2563EB"});
    Panel1Title="OCR extraction and rule review"; Panel1Subtitle="The workspace should make automation helpful without hiding errors.";
    Panel1Bullets=@("OCR output stays side by side with original proof","Category and amount mismatches are easy to spot","Per diem rules remain visible for the selected trip","Manual correction remains fast");
    Panel2Title="Automation trust and adjustment"; Panel2Subtitle="Users need confidence in what the system extracted and what still needs review.";
    Panel2Bullets=@("Low-confidence OCR fields remain highlighted","Rule explanations stay contextual","Manual overrides remain traceable","History helps diagnose repeat extraction issues");
    Panel3Title="Clear exception handling"; Panel3Subtitle="The screen should feel supportive, not technical.";
    Panel3Bullets=@("Mismatch-first ordering reduces misses","Rule context reduces confusion","Corrections remain easy to save");
    AnnotationTitles=@("OCR beside evidence","Mismatch first","Rule context","Low-confidence visibility","Traceable overrides","Supportive automation");
    Annotations=@("OCR is most useful when evidence stays nearby.","Mismatches should surface before users submit claims.","Per diem rules need contextual visibility.","Low-confidence fields should be obvious.","Manual corrections must stay traceable.","Automation should feel supportive, not opaque.");
    MobileSubtitle="OCR review, per diem rules, mismatches, and manual correction"; MobileBullets1=@("OCR stays beside evidence","Mismatch cues are clear","Per diem rules stay contextual"); MobileBullets2=@("Low-confidence fields stand out","Overrides remain traceable","Corrections are quick")
  },
  @{
    Ref="XPN-SCR-003"; Slug="expense-approval-and-reimbursement-queue"; Title="Expense Approval and Reimbursement Queue"; SidebarTitle="Expense Queue";
    SearchHint="Search approver, claim, SLA, reimbursement, or hold"; TopPill1="Approvals"; TopPill2="Alerts 06"; TopPill3="SLA 02";
    Hero1="Queue"; Hero2="Reimburse"; Hero3="SLA";
    PrimaryAction="Open approval queue"; SecondaryAction="Review reimbursements";
    SubSearch="Filter approval stage, reimbursement status, SLA, or held claims"; Filter1="Queue"; Filter2="SLA"; Filter3="Reimburse";
    Sidebar=@("Queue","Approvals","SLA","Reimburse","Holds","History");
    Metrics=@(@{label="Open";value="28";color="#15803D"},@{label="Held";value="06";color="#D97706"},@{label="SLA";value="02";color="#B42318"},@{label="Paid";value="19";color="#2563EB"});
    Panel1Title="Approval queue and SLA visibility"; Panel1Subtitle="Approvers need to see urgency and quality together.";
    Panel1Bullets=@("Open claims show amount, owner, and current stage","SLA risk items rise clearly to the top","Held claims explain policy or proof blockers","Bulk action never hides high-risk claims");
    Panel2Title="Reimbursement and downstream status"; Panel2Subtitle="Approval is only part of the journey; payment status also matters.";
    Panel2Bullets=@("Reimbursement state remains visible beside claim decisions","Returned and escalated actions stay explicit","Finance handoff is easy to inspect","History keeps decision and payout context together");
    Panel3Title="Queue confidence"; Panel3Subtitle="The approver should know what to act on first.";
    Panel3Bullets=@("Urgency stays easy to scan","Proof and amount remain visible","Resolved items preserve context");
    AnnotationTitles=@("Urgency-led queue","Held clarity","Finance linkage","Bulk with caution","History stays connected","SLA visibility");
    Annotations=@("Expense approval should be led by urgency and completeness.","Held items need concrete explanation.","Reimbursement status belongs close to approval status.","Bulk action should not flatten risk.","History should keep approval and payout together.","SLA cues help prevent avoidable delays.");
    MobileSubtitle="Expense approvals, reimbursement status, held claims, and SLA risk"; MobileBullets1=@("Urgency rises first","Held reasons stay visible","Finance status stays nearby"); MobileBullets2=@("Bulk action remains cautious","History stays connected","SLA remains obvious")
  },
  @{
    Ref="XPN-SCR-004"; Slug="corporate-card-reconciliation-workspace"; Title="Corporate Card Reconciliation Workspace"; SidebarTitle="Card Reconciliation";
    SearchHint="Search card, transaction, match, receipt, or exception"; TopPill1="Cards"; TopPill2="Alerts 05"; TopPill3="Mismatch 04";
    Hero1="Transactions"; Hero2="Match"; Hero3="Exceptions";
    PrimaryAction="Open reconciliation"; SecondaryAction="Resolve mismatch";
    SubSearch="Filter card transactions, receipt matches, policy exceptions, or unresolved items"; Filter1="Transactions"; Filter2="Match"; Filter3="Exception";
    Sidebar=@("Transactions","Matches","Receipts","Exceptions","Policy","History");
    Metrics=@(@{label="Transactions";value="84";color="#15803D"},@{label="Matched";value="71";color="#D97706"},@{label="Mismatch";value="04";color="#B42318"},@{label="Cards";value="09";color="#2563EB"});
    Panel1Title="Transaction matching and evidence"; Panel1Subtitle="Reconciliation should show what is matched, missing, or suspicious in one place.";
    Panel1Bullets=@("Transactions stay linked to cardholder and receipt evidence","Matched and unmatched states are visually distinct","Exceptions stand out before month-end close","Policy context remains close to the line item");
    Panel2Title="Exception and policy review"; Panel2Subtitle="The workspace should help finance teams resolve rather than merely flag.";
    Panel2Bullets=@("Mismatch reasons are easy to inspect","Manual matching remains traceable","Policy breaches and split charges stay visible","History supports month-end review and audit");
    Panel3Title="Finance-ready closeout"; Panel3Subtitle="The screen should make unresolved exposure obvious.";
    Panel3Bullets=@("Open mismatches remain visible until close","Receipt gaps are easy to spot","Closed matches retain evidence");
    AnnotationTitles=@("Line-level evidence","Mismatch visibility","Policy near action","Manual match trace","Month-end support","Audit-ready close");
    Annotations=@("Card reconciliation needs line-level evidence visibility.","Mismatches should stand out before close deadlines.","Policy context belongs next to each transaction.","Manual matching needs strong traceability.","Month-end support should be built in.","Closed matches should retain proof for audit.");
    MobileSubtitle="Transactions, receipt matches, policy exceptions, and closeout"; MobileBullets1=@("Match state remains visible","Exceptions rise clearly","Evidence stays attached"); MobileBullets2=@("Manual match is traceable","Policy remains nearby","Closeout stays obvious")
  },
  @{
    Ref="EXR-SCR-001"; Slug="surveys-and-pulse-feedback-workspace"; Title="Surveys and Pulse Feedback Workspace"; SidebarTitle="Pulse Feedback";
    SearchHint="Search survey, pulse, response, segment, or due"; TopPill1="Survey"; TopPill2="Alerts 03"; TopPill3="Due 04";
    Hero1="Pulse"; Hero2="Responses"; Hero3="Due";
    PrimaryAction="Open survey"; SecondaryAction="Review response trends";
    SubSearch="Filter surveys, pulse cycles, response rates, or due segments"; Filter1="Pulse"; Filter2="Responses"; Filter3="Due";
    Sidebar=@("Pulse","Surveys","Responses","Segments","Actions","History");
    Metrics=@(@{label="Live";value="04";color="#15803D"},@{label="Response";value="72%";color="#D97706"},@{label="Due";value="04";color="#B42318"},@{label="Segments";value="06";color="#2563EB"});
    Panel1Title="Survey and pulse participation"; Panel1Subtitle="Feedback should feel easy to act on whether you are an employee or HRBP.";
    Panel1Bullets=@("Live surveys and pulse checks remain easy to find","Response rate stays visible by segment","Due reminders stand out clearly","Confidentiality cues remain visible");
    Panel2Title="Trend review and follow-through"; Panel2Subtitle="The workspace should support action after response, not only collection.";
    Panel2Bullets=@("Trend views remain close to response completion","Comments and themes stay tied to segment context","Follow-up actions remain visible","History helps compare cycles");
    Panel3Title="Trustworthy listening"; Panel3Subtitle="Employees should feel that feedback is both easy and respected.";
    Panel3Bullets=@("Confidentiality stays explicit","Segment views reduce guesswork","Cycle history helps interpret change");
    AnnotationTitles=@("Participation first","Due visibility","Confidentiality matters","Trend to action","Segment-aware","Cycle comparison");
    Annotations=@("Pulse programs need strong participation visibility.","Due reminders should be easy to notice.","Confidentiality needs to remain explicit.","Feedback should connect to action after collection.","Segment awareness helps explain results.","Comparing cycles supports better response.");
    MobileSubtitle="Pulse surveys, response rate, due reminders, and trend review"; MobileBullets1=@("Live pulse remains easy to find","Due reminders stand out","Confidentiality stays visible"); MobileBullets2=@("Trend links remain close","Follow-up remains visible","Cycle comparison helps context")
  },
  @{
    Ref="EXR-SCR-002"; Slug="recognition-and-rewards-workspace"; Title="Recognition and Rewards Workspace"; SidebarTitle="Recognition";
    SearchHint="Search badge, reward, nomination, approver, or redemption"; TopPill1="Recognition"; TopPill2="Alerts 04"; TopPill3="Rewards 08";
    Hero1="Badges"; Hero2="Nominate"; Hero3="Rewards";
    PrimaryAction="Create recognition"; SecondaryAction="Open reward catalog";
    SubSearch="Filter recognitions, nominations, reward points, or redemptions"; Filter1="Recognition"; Filter2="Rewards"; Filter3="Redeem";
    Sidebar=@("Feed","Nominate","Rewards","Points","Redeem","History");
    Metrics=@(@{label="Badges";value="24";color="#15803D"},@{label="Points";value="480";color="#D97706"},@{label="Pending";value="05";color="#B42318"},@{label="Redeem";value="08";color="#2563EB"});
    Panel1Title="Recognition activity and nominations"; Panel1Subtitle="Recognition should feel active, social, and easy to understand.";
    Panel1Bullets=@("Recent recognitions remain visible with context","Nomination status and approver state are easy to see","Badges and values stay connected","Pending approvals stand out");
    Panel2Title="Rewards and redemption flow"; Panel2Subtitle="Employees should understand how appreciation translates into rewards.";
    Panel2Bullets=@("Point balance stays visible beside the catalog","Reward eligibility and redemption rules are easy to inspect","Pending and fulfilled redemption status remain explicit","History helps resolve common questions");
    Panel3Title="Positive habit loop"; Panel3Subtitle="The workspace should encourage use without becoming noisy.";
    Panel3Bullets=@("Recognition remains easy to give","Rewards stay transparent","History helps employees trust the system");
    AnnotationTitles=@("Recognition with context","Nomination visibility","Points near catalog","Redemption clarity","Positive but controlled","History supports trust");
    Annotations=@("Recognition works best with visible social context.","Nomination state should stay easy to understand.","Points should remain close to reward options.","Redemption status needs clear labels.","The experience should feel positive without clutter.","History helps trust reward balances.");
    MobileSubtitle="Recognition feed, nominations, points, and reward redemption"; MobileBullets1=@("Recognition remains visible","Pending nominations stand out","Points stay nearby"); MobileBullets2=@("Redemption is clear","Catalog remains easy","History supports trust")
  },
  @{
    Ref="EXR-SCR-003"; Slug="social-feed-communities-and-events-hub"; Title="Social Feed, Communities, and Events Hub"; SidebarTitle="Community Hub";
    SearchHint="Search post, event, community, RSVP, or announcement"; TopPill1="Community"; TopPill2="Alerts 03"; TopPill3="Events 05";
    Hero1="Feed"; Hero2="Communities"; Hero3="Events";
    PrimaryAction="Open event"; SecondaryAction="Browse communities";
    SubSearch="Filter posts, events, communities, RSVPs, or announcements"; Filter1="Feed"; Filter2="Community"; Filter3="Event";
    Sidebar=@("Feed","Communities","Events","RSVP","Announcements","Saved");
    Metrics=@(@{label="Posts";value="18";color="#15803D"},@{label="Communities";value="11";color="#D97706"},@{label="Events";value="05";color="#B42318"},@{label="RSVP";value="07";color="#2563EB"});
    Panel1Title="Feed and community activity"; Panel1Subtitle="Employees should be able to see the social pulse of the company without losing relevance.";
    Panel1Bullets=@("Feed highlights relevant updates and posts","Communities remain easy to browse and join","Events and RSVPs stay visible with timing context","Announcements remain clearly labeled");
    Panel2Title="Events and participation"; Panel2Subtitle="The hub should support lightweight community action.";
    Panel2Bullets=@("RSVP and attendance status remain easy to inspect","Event details stay close to community context","Saved and followed items reduce repeat searching","History helps employees revisit past activity");
    Panel3Title="Healthy employee engagement"; Panel3Subtitle="The hub should feel lively but still usable.";
    Panel3Bullets=@("Important updates remain easy to find","Communities stay organized","Events and announcements do not overwhelm the feed");
    AnnotationTitles=@("Relevant feed first","Communities easy to browse","Events stay visible","Announcements labeled","Saved views reduce effort","Engagement without overload");
    Annotations=@("Community hubs work best when the feed feels relevant.","Communities should be easy to find and join.","Events deserve clear timing and RSVP visibility.","Announcements should remain distinguishable from social posts.","Saved views reduce repeat effort.","Engagement should not create noise fatigue.");
    MobileSubtitle="Company feed, communities, announcements, and event RSVPs"; MobileBullets1=@("Relevant feed stays first","Communities stay easy to browse","Events remain visible"); MobileBullets2=@("Announcements stay labeled","RSVP remains simple","Saved views reduce effort")
  },
  @{
    Ref="EXR-SCR-004"; Slug="wellness-programs-workspace"; Title="Wellness Programs Workspace"; SidebarTitle="Wellness";
    SearchHint="Search program, challenge, health check, benefit, or join"; TopPill1="Wellness"; TopPill2="Alerts 02"; TopPill3="Programs 09";
    Hero1="Programs"; Hero2="Challenges"; Hero3="Health";
    PrimaryAction="Join program"; SecondaryAction="Review benefits";
    SubSearch="Filter programs, challenges, health checks, or eligibility"; Filter1="Programs"; Filter2="Challenges"; Filter3="Health";
    Sidebar=@("Programs","Challenges","Health checks","Benefits","Enroll","History");
    Metrics=@(@{label="Programs";value="09";color="#15803D"},@{label="Challenges";value="04";color="#D97706"},@{label="Upcoming";value="03";color="#B42318"},@{label="Enrolled";value="12";color="#2563EB"});
    Panel1Title="Programs and challenge participation"; Panel1Subtitle="Wellness should feel easy to discover and join.";
    Panel1Bullets=@("Programs show eligibility, timing, and participation state","Challenges remain visible with progress cues","Health checks and wellness benefits stay clearly linked","Upcoming activities stand out");
    Panel2Title="Program detail and support"; Panel2Subtitle="Employees should know what each program offers and how to access it.";
    Panel2Bullets=@("Program benefits and requirements remain easy to inspect","Enrollment and history stay visible","Health-related actions remain clearly separated from optional challenges","Past participation supports continuity");
    Panel3Title="Encouraging but clear"; Panel3Subtitle="The workspace should be supportive rather than preachy.";
    Panel3Bullets=@("Programs remain easy to compare","Join actions stay simple","History helps employees return");
    AnnotationTitles=@("Easy discovery","Challenge progress","Health vs optional","Enrollment clarity","Supportive tone","Continuity through history");
    Annotations=@("Wellness programs work best when discovery is easy.","Challenge progress should remain visible without dominating the view.","Health checks and optional programs need clear separation.","Enrollment should feel lightweight.","The workspace should feel supportive, not preachy.","History helps employees return to ongoing programs.");
    MobileSubtitle="Programs, challenges, health checks, and enrollment"; MobileBullets1=@("Programs stay easy to browse","Challenge progress is visible","Upcoming activities stand out"); MobileBullets2=@("Enrollment stays simple","Health actions stay distinct","History supports continuity")
  },
  @{
    Ref="AST-SCR-002"; Slug="asset-catalog-and-software-license-console"; Title="Asset Catalog and Software License Console"; SidebarTitle="Asset Catalog";
    SearchHint="Search asset, license, pool, device, or owner"; TopPill1="Catalog"; TopPill2="Alerts 04"; TopPill3="Licenses 12";
    Hero1="Hardware"; Hero2="Software"; Hero3="Pools";
    PrimaryAction="Open asset catalog"; SecondaryAction="Review license usage";
    SubSearch="Filter asset type, software license, stock, or pool status"; Filter1="Catalog"; Filter2="License"; Filter3="Stock";
    Sidebar=@("Catalog","Hardware","Software","Pools","Stock","History");
    Metrics=@(@{label="Assets";value="1,248";color="#15803D"},@{label="Licenses";value="12";color="#D97706"},@{label="Low stock";value="03";color="#B42318"},@{label="Pools";value="06";color="#2563EB"});
    Panel1Title="Catalog structure and availability"; Panel1Subtitle="IT teams need a dependable view of assets and license pools.";
    Panel1Bullets=@("Hardware and software remain clearly separated","Availability and stock cues stand out","License utilization remains visible per pool","Catalog filters support quick operational search");
    Panel2Title="License and pool governance"; Panel2Subtitle="The console should support allocation planning as well as catalog browsing.";
    Panel2Bullets=@("Usage trends help spot idle or overused licenses","Low-stock or pool risk remains visible","Policy notes stay close to item detail","History supports audit and vendor conversations");
    Panel3Title="Operational confidence"; Panel3Subtitle="The screen should reduce asset guesswork.";
    Panel3Bullets=@("Catalog structure stays consistent","License state remains easy to inspect","Pool history helps explain shortages");
    AnnotationTitles=@("Clear catalog split","Availability visibility","License usage nearby","Low-stock cues","History for audit","Searchable operations");
    Annotations=@("Hardware and software should feel clearly separated in the catalog.","Availability needs strong visibility for operational use.","License usage belongs close to pool and vendor context.","Low-stock cues help prevent reactive requests.","History supports audit and vendor management.","Searchability matters for IT operations.");
    MobileSubtitle="Hardware catalog, software licenses, stock, and pool status"; MobileBullets1=@("Catalog stays clear","Availability stands out","License usage remains visible"); MobileBullets2=@("Low-stock cues remain nearby","Search stays useful","History supports audit")
  },
  @{
    Ref="AST-SCR-003"; Slug="asset-maintenance-and-audit-workspace"; Title="Asset Maintenance and Audit Workspace"; SidebarTitle="Asset Audit";
    SearchHint="Search maintenance, audit, device, exception, or schedule"; TopPill1="Maintenance"; TopPill2="Alerts 05"; TopPill3="Audits 04";
    Hero1="Schedules"; Hero2="Exceptions"; Hero3="Audits";
    PrimaryAction="Open maintenance plan"; SecondaryAction="Review audit findings";
    SubSearch="Filter maintenance tasks, audit schedules, exceptions, or overdue items"; Filter1="Tasks"; Filter2="Audit"; Filter3="Overdue";
    Sidebar=@("Maintenance","Audits","Exceptions","Schedules","Findings","History");
    Metrics=@(@{label="Tasks";value="27";color="#15803D"},@{label="Audits";value="04";color="#D97706"},@{label="Overdue";value="03";color="#B42318"},@{label="Findings";value="09";color="#2563EB"});
    Panel1Title="Maintenance schedule and task execution"; Panel1Subtitle="The workspace should show what needs attention before an asset fails or goes missing.";
    Panel1Bullets=@("Maintenance tasks remain ordered by urgency and schedule","Overdue tasks stand out clearly","Linked asset detail stays nearby","Exceptions and downtime remain visible");
    Panel2Title="Audit findings and follow-up"; Panel2Subtitle="Audit work should connect directly to operational resolution.";
    Panel2Bullets=@("Findings remain linked to assets and owners","Corrective actions stay visible","Repeat exceptions are easy to spot","History helps with compliance and vendor review");
    Panel3Title="Preventive operations"; Panel3Subtitle="The screen should support proactive IT operations.";
    Panel3Bullets=@("Schedules are easy to scan","Findings remain actionable","History supports better maintenance planning");
    AnnotationTitles=@("Urgency-led maintenance","Audit linked to assets","Overdue visibility","Corrective action nearby","Repeat exceptions visible","Preventive mindset");
    Annotations=@("Maintenance should be led by urgency and schedule.","Audit findings need to stay linked to real assets.","Overdue tasks should stand out early.","Corrective action must remain close to each finding.","Repeat exceptions help identify systemic issues.","The workspace should support preventive behavior.");
    MobileSubtitle="Maintenance tasks, audit findings, overdue items, and corrective actions"; MobileBullets1=@("Urgent tasks stay first","Asset linkage remains visible","Overdue items stand out"); MobileBullets2=@("Findings stay actionable","Repeat exceptions are visible","History supports planning")
  }
)

foreach ($screen in $screens) {
  $desktopPath = Join-Path $mockupDir ("{0}-{1}-desktop.svg" -f $screen.Ref.ToLower(), $screen.Slug)
  $mobilePath = Join-Path $mockupDir ("{0}-{1}-mobile.svg" -f $screen.Ref.ToLower(), $screen.Slug)
  [System.IO.File]::WriteAllText($desktopPath, (Render-Desktop $screen))
  [System.IO.File]::WriteAllText($mobilePath, (Render-Mobile $screen))
}
