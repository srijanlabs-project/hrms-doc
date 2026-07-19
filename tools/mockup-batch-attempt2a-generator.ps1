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
    Ref="PRF-SCR-003"; Slug="360-feedback-and-calibration-workspace"; Title="360 Feedback and Calibration Workspace"; SidebarTitle="Calibration Hub";
    SearchHint="Search reviewer, panel, cycle, band, or calibration note"; TopPill1="FY27"; TopPill2="Alerts 06"; TopPill3="Panels 12";
    Hero1="360 feedback"; Hero2="Calibration due"; Hero3="Bands locked";
    PrimaryAction="Open panel review"; SecondaryAction="Compare ratings";
    SubSearch="Filter cycles, reviewer completion, calibration flags, or outlier employees"; Filter1="Open"; Filter2="Panel"; Filter3="Critical";
    Sidebar=@("Feedback","Calibration","Panels","Outliers","Notes","Finalize");
    Metrics=@(
      @{label="Reviews";value="42";color="#15803D"},
      @{label="Pending";value="09";color="#D97706"},
      @{label="Outliers";value="03";color="#B42318"},
      @{label="Panels";value="12";color="#2563EB"}
    );
    Panel1Title="Feedback completeness and reviewer groups"; Panel1Subtitle="The workspace should show who has responded and where judgement is still thin.";
    Panel1Bullets=@("Peer, manager, skip-level, and collaborator groups remain separate","Missing feedback stays visible before calibration begins","Bias or conflict cues appear before scores are compared","Confidential comments remain protected by role");
    Panel2Title="Calibration banding and exception review"; Panel2Subtitle="HRBP and managers need a clear path from inconsistent ratings to documented decisions.";
    Panel2Bullets=@("Distribution pressure is visible per team and job family","Panel notes stay attached to each rating shift","Bell-curve or budget pressure never hides original assessment","Decision history records who changed what and why");
    Panel3Title="Facilitator controls and publish readiness"; Panel3Subtitle="Final movement between draft, calibrated, and frozen states should be obvious.";
    Panel3Bullets=@("HRBP facilitation steps sit beside the queue","Employees blocked by incomplete evidence are easy to spot","Frozen outcomes are visually distinct from draft panels");
    AnnotationTitles=@("Reviewer completeness","Confidentiality","Outlier visibility","Calibration notes","Original vs adjusted","Frozen outcomes");
    Annotations=@("360 progress needs more than a score; it needs contributor coverage.","Sensitive feedback must remain well partitioned by role.","Outlier ratings should rise before meetings, not during them.","Calibration notes should be attached to the same decision surface.","Adjusted outcomes must preserve original context.","Frozen ratings need unmistakable state separation.");
    MobileSubtitle="360 progress, calibration flags, and panel decisions"; MobileBullets1=@("Reviewer groups and gaps stay visible","Missing feedback blocks calibration readiness","Outliers are highlighted for discussion"); MobileBullets2=@("Adjusted and original ratings are both visible","Notes and evidence remain attached","Frozen panels cannot be edited silently")
  },
  @{
    Ref="PRF-SCR-004"; Slug="bell-curve-and-rating-distribution-console"; Title="Bell Curve and Rating Distribution Console"; SidebarTitle="Rating Distribution";
    SearchHint="Search team, band, cycle, outlier, or justification"; TopPill1="Distribution"; TopPill2="Alerts 03"; TopPill3="Compare 05";
    Hero1="Band compare"; Hero2="Outlier teams"; Hero3="Freeze pending";
    PrimaryAction="Review distribution"; SecondaryAction="Freeze calibration";
    SubSearch="Filter teams, bands, cycles, or justification gaps"; Filter1="Compare"; Filter2="Outliers"; Filter3="Freeze";
    Sidebar=@("Bands","Teams","Outliers","Compare","Justify","Freeze");
    Metrics=@(
      @{label="Teams";value="18";color="#15803D"},
      @{label="Bands";value="05";color="#D97706"},
      @{label="Outliers";value="04";color="#B42318"},
      @{label="Justify";value="07";color="#2563EB"}
    );
    Panel1Title="Distribution compare and pressure signals"; Panel1Subtitle="Leaders need the curve without losing the people behind the numbers.";
    Panel1Bullets=@("Bands compare across department, location, and manager","Teams outside range are visible with severity cues","Cycle-over-cycle drift is easy to review","Distribution pressure never hides employee-level detail links");
    Panel2Title="Justification and change control"; Panel2Subtitle="Every forced movement in a curve should carry reason, evidence, and approver context.";
    Panel2Bullets=@("Justification prompts appear when ratings move across bands","Overrides show who proposed and who approved them","Freeze state blocks silent changes after sign-off","Publish readiness highlights unresolved exceptions");
    Panel3Title="Decision trace and fairness cues"; Panel3Subtitle="The console should feel like governance, not only analytics.";
    Panel3Bullets=@("Compare views support fairness checks","Policy thresholds are visible before publish","Exceptions and manual overrides remain auditable");
    AnnotationTitles=@("Bands with people","Outlier-first review","Justification required","Freeze matters","Fairness checks","Cycle comparison");
    Annotations=@("Rating distribution must still lead back to people-level context.","Outlier teams should be easy to inspect first.","Forced curve movement should require explicit explanation.","Post-freeze edits need strong guardrails.","Fairness review is part of calibration, not a separate afterthought.","Historical comparison helps explain unusual distributions.");
    MobileSubtitle="Distribution bands, outlier teams, and freeze readiness"; MobileBullets1=@("Band compare remains readable on mobile","Outlier teams rise to the top","Trend and drift stay summarized"); MobileBullets2=@("Override reasons remain visible","Freeze state is unmistakable","Fairness checks remain available")
  },
  @{
    Ref="PRF-SCR-005"; Slug="performance-improvement-plan-workspace"; Title="Performance Improvement Plan Workspace"; SidebarTitle="PIP Workspace";
    SearchHint="Search employee, milestone, checkpoint, risk, or outcome"; TopPill1="Active PIPs"; TopPill2="Alerts 05"; TopPill3="Reviews 08";
    Hero1="Checkpoint due"; Hero2="Support active"; Hero3="Final review";
    PrimaryAction="Open checkpoint"; SecondaryAction="Update outcome";
    SubSearch="Filter plans, managers, checkpoints, risk level, or outcome state"; Filter1="Active"; Filter2="Due"; Filter3="Finalize";
    Sidebar=@("Plans","Milestones","Checkpoints","Support","Risk","Outcome");
    Metrics=@(
      @{label="Active";value="08";color="#15803D"},
      @{label="Due";value="03";color="#D97706"},
      @{label="High risk";value="02";color="#B42318"},
      @{label="Support";value="06";color="#2563EB"}
    );
    Panel1Title="Plan timeline and goals"; Panel1Subtitle="A PIP should show commitments, dates, and support actions together.";
    Panel1Bullets=@("Objectives, milestones, and evidence sit on one timeline","Manager and HR checkpoints are clearly sequenced","Support actions like coaching or training remain attached to the plan","Risk state updates are visible without scrolling across tabs");
    Panel2Title="Checkpoint review and outcome control"; Panel2Subtitle="Each checkpoint should make it clear whether the plan is improving, stalled, or closing.";
    Panel2Bullets=@("Checkpoint forms show progress evidence and blockers","Warning and escalation states stand out early","Outcome states like extended, completed, or exit-linked remain distinct","Finalization captures reason and approval path");
    Panel3Title="Careful governance"; Panel3Subtitle="The workspace should feel supportive but still audit-safe.";
    Panel3Bullets=@("Role-sensitive notes remain protected","Support interventions are easy to schedule and track","Historical checkpoint trace stays available");
    AnnotationTitles=@("Timeline clarity","Support with accountability","Early risk visibility","Outcome separation","Protected notes","Final decision trail");
    Annotations=@("PIP steps should read like a guided path, not a loose notes page.","Support actions need equal visibility to corrective milestones.","Risk should become visible before a plan fails silently.","Completed, extended, and exit-linked outcomes must be distinct.","Protected notes should remain role-safe.","Final PIP outcomes need strong traceability.");
    MobileSubtitle="PIP milestones, checkpoints, support, and final outcomes"; MobileBullets1=@("Objectives and milestones stay together","Due checkpoints lead the screen","Support tasks remain visible"); MobileBullets2=@("Risk and blockers are easy to scan","Outcomes stay explicit","History remains available")
  },
  @{
    Ref="LRN-SCR-001"; Slug="learning-management-dashboard"; Title="Learning Management Dashboard"; SidebarTitle="Learning Hub";
    SearchHint="Search course, path, badge, training, or recommendation"; TopPill1="Learning"; TopPill2="Alerts 04"; TopPill3="Overdue 02";
    Hero1="Mandatory"; Hero2="Recommended"; Hero3="Badges";
    PrimaryAction="Open learning plan"; SecondaryAction="Browse catalog";
    SubSearch="Filter mandatory, recommended, in-progress, or overdue learning"; Filter1="My plan"; Filter2="Mandatory"; Filter3="Overdue";
    Sidebar=@("Home","Mandatory","Catalog","Paths","Assessments","Badges");
    Metrics=@(
      @{label="Courses";value="11";color="#15803D"},
      @{label="In progress";value="05";color="#D97706"},
      @{label="Overdue";value="02";color="#B42318"},
      @{label="Badges";value="07";color="#2563EB"}
    );
    Panel1Title="Assigned and recommended learning"; Panel1Subtitle="The dashboard should separate compliance urgency from growth opportunities.";
    Panel1Bullets=@("Mandatory assignments stay above optional content","Recommendations show skill rationale and role relevance","Progress percentage and due date remain visible","Badges and certificates stay close to course status");
    Panel2Title="Learning rhythm and nudges"; Panel2Subtitle="The user should know what to do next without hunting through the LMS.";
    Panel2Bullets=@("Quick actions launch resume, start, or request help","Overdue compliance training is obvious","Learning paths and assessments remain one tap away","AI suggestions stay supportive rather than intrusive");
    Panel3Title="Manager and self-service alignment"; Panel3Subtitle="Learning should connect to goals, competencies, and certifications.";
    Panel3Bullets=@("Skills and goal links remain visible","Completion history helps later appraisal context","Escalation state is visible for missed compliance training");
    AnnotationTitles=@("Compliance vs growth","Next action first","Badges stay near progress","Overdue must stand out","Goal linkage","Supportive AI");
    Annotations=@("Mandatory learning should never be buried under optional discovery.","The dashboard should always answer what to do next.","Recognition like badges should stay close to active progress.","Overdue compliance needs stronger emphasis than recommendations.","Learning should connect back to skills and performance.","AI should guide, not distract.");
    MobileSubtitle="Mandatory learning, recommendations, progress, and overdue training"; MobileBullets1=@("Mandatory items lead the screen","Progress stays simple and visible","Badges stay attached to completion"); MobileBullets2=@("Overdue training stands out","Recommendations explain why","Quick actions remain obvious")
  },
  @{
    Ref="LRN-SCR-002"; Slug="learning-path-and-course-catalog-workspace"; Title="Learning Path and Course Catalog Workspace"; SidebarTitle="Learning Catalog";
    SearchHint="Search skill, course, instructor, path, or tag"; TopPill1="Catalog"; TopPill2="Paths 14"; TopPill3="Approval 03";
    Hero1="Role paths"; Hero2="Skills"; Hero3="Approvals";
    PrimaryAction="Enroll in path"; SecondaryAction="Compare courses";
    SubSearch="Filter paths, skills, formats, durations, or approval-required courses"; Filter1="Paths"; Filter2="Skills"; Filter3="Enroll";
    Sidebar=@("Catalog","Paths","Skills","Instructors","Saved","Approvals");
    Metrics=@(
      @{label="Courses";value="246";color="#15803D"},
      @{label="Paths";value="14";color="#D97706"},
      @{label="Skills";value="38";color="#B42318"},
      @{label="Approval";value="03";color="#2563EB"}
    );
    Panel1Title="Course search and path sequencing"; Panel1Subtitle="Catalog exploration should still preserve curated learning journeys.";
    Panel1Bullets=@("Search supports skill tags, formats, and duration ranges","Paths show sequence, prerequisites, and completion weight","Course cards reveal instructor, rating, and business relevance","Approval-required content is labeled before enrollment");
    Panel2Title="Decision support and enrollment"; Panel2Subtitle="The workspace should make selection easier than browsing a giant list.";
    Panel2Bullets=@("Compare views show outcomes, effort, and role alignment","Path details explain what unlocks next","Enrollment actions reflect approval, seats, or prerequisite gates","Managers can review or sponsor content without leaving context");
    Panel3Title="Reusable learning structure"; Panel3Subtitle="Catalog and paths should feel organized enough for both employee and admin use.";
    Panel3Bullets=@("Saved views and favorites reduce repeated search effort","Role-based recommendations stay visible","External or partner content is still clearly labeled");
    AnnotationTitles=@("Search by skill","Paths stay curated","Approval visible early","Compare before enroll","Favorites help reuse","External content clarity");
    Annotations=@("Skill-first search is often more useful than title-only browsing.","Paths should remain structured and not collapse into flat catalogs.","Employees should know approval requirements before they click enroll.","Comparison helps users choose better learning investments.","Favorites and saved filters reduce friction.","External content should remain identifiable and trustworthy.");
    MobileSubtitle="Course search, path sequencing, and enrollment choices"; MobileBullets1=@("Search works by skill or role","Paths show sequence and prerequisites","Approval-required content is labeled"); MobileBullets2=@("Compare helps decide faster","Enroll actions remain clear","Favorites reduce repeat effort")
  },
  @{
    Ref="LRN-SCR-003"; Slug="certification-and-compliance-training-queue"; Title="Certification and Compliance Training Queue"; SidebarTitle="Certification Queue";
    SearchHint="Search certificate, expiry, assignee, provider, or proof"; TopPill1="Expiry"; TopPill2="Alerts 07"; TopPill3="Escalated 03";
    Hero1="Expiring soon"; Hero2="Mandatory"; Hero3="Proof due";
    PrimaryAction="Review expiring items"; SecondaryAction="Request completion proof";
    SubSearch="Filter expiring, overdue, mandatory, or escalation-ready items"; Filter1="Queue"; Filter2="Expiring"; Filter3="Escalated";
    Sidebar=@("Queue","Expiring","Mandatory","Proof","Escalations","Archive");
    Metrics=@(
      @{label="Expiring";value="12";color="#15803D"},
      @{label="Overdue";value="04";color="#D97706"},
      @{label="Escalated";value="03";color="#B42318"},
      @{label="Proof due";value="06";color="#2563EB"}
    );
    Panel1Title="Certification expiry and proof management"; Panel1Subtitle="The queue should surface risk before a license or compliance item becomes invalid.";
    Panel1Bullets=@("Expiry dates and reminder stages are clearly ordered","Mandatory items remain separated from optional certifications","Completion proof and external verification status stay visible","Escalations link back to manager or compliance owner");
    Panel2Title="Action queue and enforcement"; Panel2Subtitle="L&D and compliance admins need a fast path from queue item to next action.";
    Panel2Bullets=@("Request proof, extend, reassign, or escalate actions stay near the item","Overdue items reveal business impact and hold state","Training and certificate evidence remain reviewable","Bulk reminder and owner actions are easy to access");
    Panel3Title="Traceable compliance handling"; Panel3Subtitle="This should feel like governed queue work, not a loose spreadsheet.";
    Panel3Bullets=@("Expiry and proof changes remain audited","Escalations carry reason and due date","History helps explain repeated misses");
    AnnotationTitles=@("Expiry-first ordering","Proof matters","Escalation clarity","Mandatory vs optional","Bulk actions","Audit trace");
    Annotations=@("Expiring items should surface before they become outages.","Proof collection matters as much as course completion.","Escalation ownership needs to be explicit.","Mandatory and optional items need different urgency treatment.","Bulk actions help reduce admin drag.","Every compliance action should remain auditable.");
    MobileSubtitle="Expiring certificates, mandatory training, proof, and escalations"; MobileBullets1=@("Expiry ordering leads the queue","Proof and provider status stay visible","Mandatory items remain distinct"); MobileBullets2=@("Escalations are obvious","Bulk reminders remain reachable","Audit trace still matters")
  },
  @{
    Ref="LRN-SCR-004"; Slug="assessment-and-external-content-workspace"; Title="Assessment and External Content Workspace"; SidebarTitle="Assessment Workspace";
    SearchHint="Search assessment, provider, attempt, score, or evidence"; TopPill1="Assessments"; TopPill2="Alerts 05"; TopPill3="Attempts 18";
    Hero1="Scheduled"; Hero2="External content"; Hero3="Evidence";
    PrimaryAction="Open assessment"; SecondaryAction="Review attempt";
    SubSearch="Filter assessments, vendors, attempts, overdue items, or completion evidence"; Filter1="Open"; Filter2="Vendor"; Filter3="Evidence";
    Sidebar=@("Assessments","Attempts","Providers","Evidence","Overdue","Scores");
    Metrics=@(
      @{label="Open";value="18";color="#15803D"},
      @{label="Overdue";value="03";color="#D97706"},
      @{label="Vendors";value="08";color="#B42318"},
      @{label="Evidence";value="09";color="#2563EB"}
    );
    Panel1Title="Assessment schedule and attempt state"; Panel1Subtitle="The workspace should show what is upcoming, open, failed, or waiting on retake.";
    Panel1Bullets=@("Attempt state is visible for not started, in progress, failed, or passed","Assessment timing and retake windows stay near the score","Vendor-hosted and internal assessments remain clearly labeled","Overdue or blocked attempts stand out");
    Panel2Title="External content evidence and completion trust"; Panel2Subtitle="Completion status is only useful when supporting evidence is visible and reliable.";
    Panel2Bullets=@("External completions carry provider status and proof links","Assessment results connect back to skills or certifications","Manual evidence review is possible when vendor sync is delayed","Escalation and retry logic remain understandable");
    Panel3Title="Assessment operations"; Panel3Subtitle="The screen should help L&D teams manage trust and not just scores.";
    Panel3Bullets=@("Delayed vendor sync is visible","Proof review and override remain traceable","History helps troubleshoot disputed completions");
    AnnotationTitles=@("Attempt states","Vendor clarity","Retake windows","Evidence trust","Delayed sync visibility","Traceable overrides");
    Annotations=@("Attempts need explicit state, not only score summaries.","Vendor-hosted content should be clearly marked.","Retake rules should be visible before the user gets blocked.","External completion needs trustworthy evidence.","Sync delays should not look like learner failure.","Any manual override needs traceability.");
    MobileSubtitle="Assessment attempts, external content, vendor proof, and retakes"; MobileBullets1=@("Attempt states stay visible","Vendor items stay labeled","Retake windows remain clear"); MobileBullets2=@("Evidence and proof remain nearby","Delayed sync is explained","Overrides stay traceable")
  },
  @{
    Ref="TAL-SCR-001"; Slug="succession-planning-dashboard"; Title="Succession Planning Dashboard"; SidebarTitle="Succession";
    SearchHint="Search role, successor, readiness, risk, or bench depth"; TopPill1="Critical roles"; TopPill2="Alerts 04"; TopPill3="Bench 11";
    Hero1="Successor depth"; Hero2="Readiness"; Hero3="Risk roles";
    PrimaryAction="Review successors"; SecondaryAction="Open readiness map";
    SubSearch="Filter roles, successor readiness, vacancies, or risk positions"; Filter1="Critical"; Filter2="Readiness"; Filter3="Risk";
    Sidebar=@("Dashboard","Critical roles","Successors","Readiness","Risk","Bench");
    Metrics=@(
      @{label="Critical";value="32";color="#15803D"},
      @{label="Ready now";value="11";color="#D97706"},
      @{label="High risk";value="05";color="#B42318"},
      @{label="Bench";value="19";color="#2563EB"}
    );
    Panel1Title="Critical roles and successor depth"; Panel1Subtitle="Leadership should see which roles are exposed before succession planning becomes reactive.";
    Panel1Bullets=@("Critical roles show ready-now, ready-soon, and no-successor states","Bench depth stays visible by function and geography","High-risk positions rise to the top","Vacancy and retirement risk signals remain visible");
    Panel2Title="Readiness and talent movement"; Panel2Subtitle="Succession needs action pathways, not just color coding.";
    Panel2Bullets=@("Successor readiness links to learning and career plans","AI suggestions remain advisory and explainable","Mobility blockers and exposure gaps stay visible","Role-family compare helps prioritize pipeline work");
    Panel3Title="Leadership decision support"; Panel3Subtitle="The dashboard should support discussion, not replace judgement.";
    Panel3Bullets=@("Scenario lenses compare successor depth","Risk views highlight roles with no near-term cover","Bench changes remain historically visible");
    AnnotationTitles=@("Critical-role first","Depth over names","Risk visibility","Readiness with action","Advisory AI only","Historical bench view");
    Annotations=@("Succession should begin with role risk, not only successor lists.","Depth matters as much as named successors.","Roles with no near-term cover should surface immediately.","Readiness is more useful when tied to next actions.","AI recommendations must stay explainable and advisory.","Bench history helps leaders see whether pipelines are improving.");
    MobileSubtitle="Critical roles, successor depth, readiness, and bench risk"; MobileBullets1=@("Critical roles lead the screen","Ready-now vs no-cover stays obvious","Bench depth remains visible"); MobileBullets2=@("Readiness connects to action","Risk roles stand out","AI stays advisory")
  },
  @{
    Ref="TAL-SCR-002"; Slug="talent-review-and-hipo-matrix-workspace"; Title="Talent Review and HiPo Matrix Workspace"; SidebarTitle="Talent Matrix";
    SearchHint="Search employee, box, panel, note, or action"; TopPill1="9-box"; TopPill2="Alerts 05"; TopPill3="HiPo 14";
    Hero1="Matrix view"; Hero2="Confidential"; Hero3="Panel actions";
    PrimaryAction="Open talent panel"; SecondaryAction="Compare matrix";
    SubSearch="Filter matrix box, readiness, confidentiality, or calibration action"; Filter1="9-box"; Filter2="HiPo"; Filter3="Panel";
    Sidebar=@("Matrix","Panels","Notes","HiPo","Bench","Actions");
    Metrics=@(
      @{label="Reviewed";value="64";color="#15803D"},
      @{label="HiPo";value="14";color="#D97706"},
      @{label="Moves";value="06";color="#B42318"},
      @{label="Panels";value="08";color="#2563EB"}
    );
    Panel1Title="Talent matrix and confidentiality"; Panel1Subtitle="The matrix must remain readable while protecting highly sensitive talent data.";
    Panel1Bullets=@("9-box view shows distribution and movement candidates","Confidential notes remain tightly role-scoped","HiPo and bench indicators stay visible without exposing everything to all reviewers","Matrix filters support level, function, and geography");
    Panel2Title="Panel review and action queue"; Panel2Subtitle="Talent review should end with concrete follow-up, not just labels.";
    Panel2Bullets=@("Action panels track promotion, succession, risk, or development follow-up","Calibration notes remain adjacent to the same employee card","Cross-panel disagreement is visible before closure","Decision trace remains available for later review");
    Panel3Title="Follow-through and governance"; Panel3Subtitle="Talent review should create clear next steps across leadership and HRBP teams.";
    Panel3Bullets=@("HiPo decisions connect to development actions","Confidential handling remains explicit","History helps compare talent decisions across cycles");
    AnnotationTitles=@("Sensitive matrix","HiPo with context","Panel disagreement visibility","Action after review","Scoped confidentiality","Cycle comparison");
    Annotations=@("Talent matrix views should remain useful without overexposing sensitive data.","HiPo labels need surrounding context and next steps.","Panel disagreement should be visible before final decisions.","Every review should generate follow-through actions.","Confidentiality needs obvious scope boundaries.","Cycle-over-cycle comparison helps catch inconsistent decisions.");
    MobileSubtitle="9-box matrix, panel review, HiPo decisions, and confidentiality"; MobileBullets1=@("Matrix remains readable on mobile","Confidential handling stays explicit","HiPo and bench cues remain visible"); MobileBullets2=@("Panel actions are nearby","Disagreement becomes visible early","History remains available")
  },
  @{
    Ref="TAL-SCR-003"; Slug="career-planning-and-bench-strength-workspace"; Title="Career Planning and Bench Strength Workspace"; SidebarTitle="Career Bench";
    SearchHint="Search path, role family, successor, bench, or mobility"; TopPill1="Career paths"; TopPill2="Alerts 03"; TopPill3="Mobility 09";
    Hero1="Career tracks"; Hero2="Bench depth"; Hero3="Internal moves";
    PrimaryAction="Open career map"; SecondaryAction="Review bench depth";
    SubSearch="Filter paths, roles, bench strength, successor readiness, or mobility risk"; Filter1="Paths"; Filter2="Bench"; Filter3="Mobility";
    Sidebar=@("Career maps","Bench","Readiness","Mobility","Skills","Scenarios");
    Metrics=@(
      @{label="Paths";value="22";color="#15803D"},
      @{label="Bench";value="19";color="#D97706"},
      @{label="Gaps";value="04";color="#B42318"},
      @{label="Moves";value="09";color="#2563EB"}
    );
    Panel1Title="Career paths and internal movement"; Panel1Subtitle="Employees and leaders both need to understand what the next role options really look like.";
    Panel1Bullets=@("Career tracks show role family ladders and lateral paths","Internal mobility signals show readiness and blockers","Role transitions connect to skill gaps and development actions","Bench strength can be viewed by path, function, or geography");
    Panel2Title="Bench depth and scenario review"; Panel2Subtitle="Bench strength becomes useful when leaders can explore future demand and coverage together.";
    Panel2Bullets=@("Scenario views compare current depth to future need","Single-point failure roles stand out","Career-path interest connects back to succession and learning","Leadership can spot where mobility may solve bench gaps");
    Panel3Title="Strategic talent continuity"; Panel3Subtitle="This workspace should bridge individual growth and enterprise coverage.";
    Panel3Bullets=@("Career and succession signals reinforce each other","Skill development remains linked to bench health","Historical depth view helps planning");
    AnnotationTitles=@("Paths beyond ladders","Mobility with blockers","Bench by context","Future demand view","Linked to succession","History supports planning");
    Annotations=@("Career planning should support lateral and specialist moves, not only promotions.","Mobility is more actionable when blockers are visible.","Bench strength should be explorable across real business dimensions.","Future demand helps leaders judge whether current depth is enough.","Career paths should connect back to succession planning.","Historical depth helps explain whether planning is improving.");
    MobileSubtitle="Career paths, internal mobility, and bench strength planning"; MobileBullets1=@("Career tracks remain visible","Mobility cues include blockers","Bench depth stays by role family"); MobileBullets2=@("Future demand view remains available","Links to succession stay visible","History supports planning")
  }
)

foreach ($screen in $screens) {
  $desktopPath = Join-Path $mockupDir ("{0}-{1}-desktop.svg" -f $screen.Ref.ToLower(), $screen.Slug)
  $mobilePath = Join-Path $mockupDir ("{0}-{1}-mobile.svg" -f $screen.Ref.ToLower(), $screen.Slug)
  [System.IO.File]::WriteAllText($desktopPath, (Render-Desktop $screen))
  [System.IO.File]::WriteAllText($mobilePath, (Render-Mobile $screen))
}
