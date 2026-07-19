export type ScreenRecord = {
  ref: string;
  slug: string;
  title: string;
  familyKey: string;
  familyLabel: string;
  desktopAsset: string;
  mobileAsset: string;
};

export const screenFamilies = {
  "anl": "Analytics",
  "ast": "Assets",
  "ctr": "Contractors",
  "doc": "Documents",
  "emp": "Employee Self Service",
  "glb": "Global Utilities",
  "hlp": "Helpdesk",
  "hro": "HR Operations",
  "hsw": "Health and Safety",
  "lev": "Leave",
  "mgr": "Manager Self Service",
  "pay": "Payroll",
  "peo": "People Record",
  "rec": "Recruitment",
  "w0": "Wave 0 Platform and Admin",
  "wrk": "Workforce Operations"
} as const;

export const screens: ScreenRecord[] = [
  {
    "ref": "ANL-SCR-001",
    "slug": "workforce-analytics-overview",
    "title": "Workforce Analytics Overview",
    "familyKey": "anl",
    "familyLabel": "Analytics",
    "desktopAsset": "/anl-scr-001-workforce-analytics-overview-desktop.svg",
    "mobileAsset": "/anl-scr-001-workforce-analytics-overview-mobile.svg"
  },
  {
    "ref": "ANL-SCR-002",
    "slug": "workforce-analytics",
    "title": "Workforce Analytics",
    "familyKey": "anl",
    "familyLabel": "Analytics",
    "desktopAsset": "/anl-scr-002-workforce-analytics-desktop.svg",
    "mobileAsset": "/anl-scr-002-workforce-analytics-mobile.svg"
  },
  {
    "ref": "ANL-SCR-003",
    "slug": "attrition-analytics",
    "title": "Attrition Analytics",
    "familyKey": "anl",
    "familyLabel": "Analytics",
    "desktopAsset": "/anl-scr-003-attrition-analytics-desktop.svg",
    "mobileAsset": "/anl-scr-003-attrition-analytics-mobile.svg"
  },
  {
    "ref": "ANL-SCR-004",
    "slug": "governed-report-builder",
    "title": "Governed Report Builder",
    "familyKey": "anl",
    "familyLabel": "Analytics",
    "desktopAsset": "/anl-scr-004-governed-report-builder-desktop.svg",
    "mobileAsset": "/anl-scr-004-governed-report-builder-mobile.svg"
  },
  {
    "ref": "ANL-SCR-005",
    "slug": "ai-insight-explainability-center",
    "title": "Ai Insight Explainability Center",
    "familyKey": "anl",
    "familyLabel": "Analytics",
    "desktopAsset": "/anl-scr-005-ai-insight-explainability-center-desktop.svg",
    "mobileAsset": "/anl-scr-005-ai-insight-explainability-center-mobile.svg"
  },
  {
    "ref": "AST-SCR-001",
    "slug": "asset-assignment-and-return-view",
    "title": "Asset Assignment And Return View",
    "familyKey": "ast",
    "familyLabel": "Assets",
    "desktopAsset": "/ast-scr-001-asset-assignment-and-return-view-desktop.svg",
    "mobileAsset": "/ast-scr-001-asset-assignment-and-return-view-mobile.svg"
  },
  {
    "ref": "CTR-SCR-001",
    "slug": "contractor-workforce-workbench",
    "title": "Contractor Workforce Workbench",
    "familyKey": "ctr",
    "familyLabel": "Contractors",
    "desktopAsset": "/ctr-scr-001-contractor-workforce-workbench-desktop.svg",
    "mobileAsset": "/ctr-scr-001-contractor-workforce-workbench-mobile.svg"
  },
  {
    "ref": "DOC-SCR-001",
    "slug": "document-repository-and-profile-view",
    "title": "Document Repository And Profile View",
    "familyKey": "doc",
    "familyLabel": "Documents",
    "desktopAsset": "/doc-scr-001-document-repository-and-profile-view-desktop.svg",
    "mobileAsset": "/doc-scr-001-document-repository-and-profile-view-mobile.svg"
  },
  {
    "ref": "DOC-SCR-002",
    "slug": "document-signing-and-acknowledgment-flow",
    "title": "Document Signing And Acknowledgment Flow",
    "familyKey": "doc",
    "familyLabel": "Documents",
    "desktopAsset": "/doc-scr-002-document-signing-and-acknowledgment-flow-desktop.svg",
    "mobileAsset": "/doc-scr-002-document-signing-and-acknowledgment-flow-mobile.svg"
  },
  {
    "ref": "EMP-SCR-001",
    "slug": "employee-home",
    "title": "Employee Home",
    "familyKey": "emp",
    "familyLabel": "Employee Self Service",
    "desktopAsset": "/emp-scr-001-employee-home-desktop.svg",
    "mobileAsset": "/emp-scr-001-employee-home-mobile.svg"
  },
  {
    "ref": "EMP-SCR-002",
    "slug": "my-profile",
    "title": "My Profile",
    "familyKey": "emp",
    "familyLabel": "Employee Self Service",
    "desktopAsset": "/emp-scr-002-my-profile-desktop.svg",
    "mobileAsset": "/emp-scr-002-my-profile-mobile.svg"
  },
  {
    "ref": "EMP-SCR-003",
    "slug": "my-documents",
    "title": "My Documents",
    "familyKey": "emp",
    "familyLabel": "Employee Self Service",
    "desktopAsset": "/emp-scr-003-my-documents-desktop.svg",
    "mobileAsset": "/emp-scr-003-my-documents-mobile.svg"
  },
  {
    "ref": "EMP-SCR-004",
    "slug": "my-requests",
    "title": "My Requests",
    "familyKey": "emp",
    "familyLabel": "Employee Self Service",
    "desktopAsset": "/emp-scr-004-my-requests-desktop.svg",
    "mobileAsset": "/emp-scr-004-my-requests-mobile.svg"
  },
  {
    "ref": "EMP-SCR-005",
    "slug": "my-payslips-and-tax-views",
    "title": "My Payslips And Tax Views",
    "familyKey": "emp",
    "familyLabel": "Employee Self Service",
    "desktopAsset": "/emp-scr-005-my-payslips-and-tax-views-desktop.svg",
    "mobileAsset": "/emp-scr-005-my-payslips-and-tax-views-mobile.svg"
  },
  {
    "ref": "EMP-SCR-006",
    "slug": "my-leave-and-attendance",
    "title": "My Leave And Attendance",
    "familyKey": "emp",
    "familyLabel": "Employee Self Service",
    "desktopAsset": "/emp-scr-006-my-leave-and-attendance-desktop.svg",
    "mobileAsset": "/emp-scr-006-my-leave-and-attendance-mobile.svg"
  },
  {
    "ref": "EMP-SCR-007",
    "slug": "my-goals-and-learning",
    "title": "My Goals And Learning",
    "familyKey": "emp",
    "familyLabel": "Employee Self Service",
    "desktopAsset": "/emp-scr-007-my-goals-and-learning-desktop.svg",
    "mobileAsset": "/emp-scr-007-my-goals-and-learning-mobile.svg"
  },
  {
    "ref": "EMP-SCR-008",
    "slug": "my-benefits-and-claims",
    "title": "My Benefits And Claims",
    "familyKey": "emp",
    "familyLabel": "Employee Self Service",
    "desktopAsset": "/emp-scr-008-my-benefits-and-claims-desktop.svg",
    "mobileAsset": "/emp-scr-008-my-benefits-and-claims-mobile.svg"
  },
  {
    "ref": "GLB-SCR-001",
    "slug": "notifications-center",
    "title": "Notifications Center",
    "familyKey": "glb",
    "familyLabel": "Global Utilities",
    "desktopAsset": "/glb-scr-001-notifications-center-desktop.svg",
    "mobileAsset": "/glb-scr-001-notifications-center-mobile.svg"
  },
  {
    "ref": "GLB-SCR-002",
    "slug": "help-and-support-center",
    "title": "Help And Support Center",
    "familyKey": "glb",
    "familyLabel": "Global Utilities",
    "desktopAsset": "/glb-scr-002-help-and-support-center-desktop.svg",
    "mobileAsset": "/glb-scr-002-help-and-support-center-mobile.svg"
  },
  {
    "ref": "GLB-SCR-003",
    "slug": "profile-and-delegation-switch",
    "title": "Profile And Delegation Switch",
    "familyKey": "glb",
    "familyLabel": "Global Utilities",
    "desktopAsset": "/glb-scr-003-profile-and-delegation-switch-desktop.svg",
    "mobileAsset": "/glb-scr-003-profile-and-delegation-switch-mobile.svg"
  },
  {
    "ref": "HLP-SCR-001",
    "slug": "case-management-workbench",
    "title": "Case Management Workbench",
    "familyKey": "hlp",
    "familyLabel": "Helpdesk",
    "desktopAsset": "/hlp-scr-001-case-management-workbench-desktop.svg",
    "mobileAsset": "/hlp-scr-001-case-management-workbench-mobile.svg"
  },
  {
    "ref": "HRO-SCR-001",
    "slug": "employee-master-workbench",
    "title": "Employee Master Workbench",
    "familyKey": "hro",
    "familyLabel": "HR Operations",
    "desktopAsset": "/hro-scr-001-employee-master-workbench-desktop.svg",
    "mobileAsset": "/hro-scr-001-employee-master-workbench-mobile.svg"
  },
  {
    "ref": "HRO-SCR-002",
    "slug": "lifecycle-change-workbench",
    "title": "Lifecycle Change Workbench",
    "familyKey": "hro",
    "familyLabel": "HR Operations",
    "desktopAsset": "/hro-scr-002-lifecycle-change-workbench-desktop.svg",
    "mobileAsset": "/hro-scr-002-lifecycle-change-workbench-mobile.svg"
  },
  {
    "ref": "HRO-SCR-003",
    "slug": "onboarding-preboarding-console",
    "title": "Onboarding Preboarding Console",
    "familyKey": "hro",
    "familyLabel": "HR Operations",
    "desktopAsset": "/hro-scr-003-onboarding-preboarding-console-desktop.svg",
    "mobileAsset": "/hro-scr-003-onboarding-preboarding-console-mobile.svg"
  },
  {
    "ref": "HRO-SCR-004",
    "slug": "employee-document-verification-queue",
    "title": "Employee Document Verification Queue",
    "familyKey": "hro",
    "familyLabel": "HR Operations",
    "desktopAsset": "/hro-scr-004-employee-document-verification-queue-desktop.svg",
    "mobileAsset": "/hro-scr-004-employee-document-verification-queue-mobile.svg"
  },
  {
    "ref": "HRO-SCR-005",
    "slug": "data-correction-and-exception-queue",
    "title": "Data Correction And Exception Queue",
    "familyKey": "hro",
    "familyLabel": "HR Operations",
    "desktopAsset": "/hro-scr-005-data-correction-and-exception-queue-desktop.svg",
    "mobileAsset": "/hro-scr-005-data-correction-and-exception-queue-mobile.svg"
  },
  {
    "ref": "HSW-SCR-001",
    "slug": "health-safety-and-incident-workspace",
    "title": "Health Safety And Incident Workspace",
    "familyKey": "hsw",
    "familyLabel": "Health and Safety",
    "desktopAsset": "/hsw-scr-001-health-safety-and-incident-workspace-desktop.svg",
    "mobileAsset": "/hsw-scr-001-health-safety-and-incident-workspace-mobile.svg"
  },
  {
    "ref": "LEV-SCR-001",
    "slug": "leave-policy-workspace",
    "title": "Leave Policy Workspace",
    "familyKey": "lev",
    "familyLabel": "Leave",
    "desktopAsset": "/lev-scr-001-leave-policy-workspace-desktop.svg",
    "mobileAsset": "/lev-scr-001-leave-policy-workspace-mobile.svg"
  },
  {
    "ref": "LEV-SCR-002",
    "slug": "leave-approval-queue",
    "title": "Leave Approval Queue",
    "familyKey": "lev",
    "familyLabel": "Leave",
    "desktopAsset": "/lev-scr-002-leave-approval-queue-desktop.svg",
    "mobileAsset": "/lev-scr-002-leave-approval-queue-mobile.svg"
  },
  {
    "ref": "LEV-SCR-003",
    "slug": "team-leave-planning-view",
    "title": "Team Leave Planning View",
    "familyKey": "lev",
    "familyLabel": "Leave",
    "desktopAsset": "/lev-scr-003-team-leave-planning-view-desktop.svg",
    "mobileAsset": "/lev-scr-003-team-leave-planning-view-mobile.svg"
  },
  {
    "ref": "MGR-SCR-001",
    "slug": "team-dashboard",
    "title": "Team Dashboard",
    "familyKey": "mgr",
    "familyLabel": "Manager Self Service",
    "desktopAsset": "/mgr-scr-001-team-dashboard-desktop.svg",
    "mobileAsset": "/mgr-scr-001-team-dashboard-mobile.svg"
  },
  {
    "ref": "MGR-SCR-002",
    "slug": "team-people-list",
    "title": "Team People List",
    "familyKey": "mgr",
    "familyLabel": "Manager Self Service",
    "desktopAsset": "/mgr-scr-002-team-people-list-desktop.svg",
    "mobileAsset": "/mgr-scr-002-team-people-list-mobile.svg"
  },
  {
    "ref": "MGR-SCR-003",
    "slug": "manager-approvals",
    "title": "Manager Approvals",
    "familyKey": "mgr",
    "familyLabel": "Manager Self Service",
    "desktopAsset": "/mgr-scr-003-manager-approvals-desktop.svg",
    "mobileAsset": "/mgr-scr-003-manager-approvals-mobile.svg"
  },
  {
    "ref": "MGR-SCR-004",
    "slug": "performance-review-workspace",
    "title": "Performance Review Workspace",
    "familyKey": "mgr",
    "familyLabel": "Manager Self Service",
    "desktopAsset": "/mgr-scr-004-performance-review-workspace-desktop.svg",
    "mobileAsset": "/mgr-scr-004-performance-review-workspace-mobile.svg"
  },
  {
    "ref": "MGR-SCR-005",
    "slug": "hiring-approval-workspace",
    "title": "Hiring Approval Workspace",
    "familyKey": "mgr",
    "familyLabel": "Manager Self Service",
    "desktopAsset": "/mgr-scr-005-hiring-approval-workspace-desktop.svg",
    "mobileAsset": "/mgr-scr-005-hiring-approval-workspace-mobile.svg"
  },
  {
    "ref": "MGR-SCR-006",
    "slug": "team-leave-and-attendance-overview",
    "title": "Team Leave And Attendance Overview",
    "familyKey": "mgr",
    "familyLabel": "Manager Self Service",
    "desktopAsset": "/mgr-scr-006-team-leave-and-attendance-overview-desktop.svg",
    "mobileAsset": "/mgr-scr-006-team-leave-and-attendance-overview-mobile.svg"
  },
  {
    "ref": "MGR-SCR-007",
    "slug": "mobility-proposal-workspace",
    "title": "Mobility Proposal Workspace",
    "familyKey": "mgr",
    "familyLabel": "Manager Self Service",
    "desktopAsset": "/mgr-scr-007-mobility-proposal-workspace-desktop.svg",
    "mobileAsset": "/mgr-scr-007-mobility-proposal-workspace-mobile.svg"
  },
  {
    "ref": "PAY-SCR-001",
    "slug": "payroll-control-center",
    "title": "Payroll Control Center",
    "familyKey": "pay",
    "familyLabel": "Payroll",
    "desktopAsset": "/pay-scr-001-payroll-control-center-desktop.svg",
    "mobileAsset": "/pay-scr-001-payroll-control-center-mobile.svg"
  },
  {
    "ref": "PAY-SCR-002",
    "slug": "payroll-run-details",
    "title": "Payroll Run Details",
    "familyKey": "pay",
    "familyLabel": "Payroll",
    "desktopAsset": "/pay-scr-002-payroll-run-details-desktop.svg",
    "mobileAsset": "/pay-scr-002-payroll-run-details-mobile.svg"
  },
  {
    "ref": "PAY-SCR-003",
    "slug": "validation-queue",
    "title": "Validation Queue",
    "familyKey": "pay",
    "familyLabel": "Payroll",
    "desktopAsset": "/pay-scr-003-validation-queue-desktop.svg",
    "mobileAsset": "/pay-scr-003-validation-queue-mobile.svg"
  },
  {
    "ref": "PAY-SCR-004",
    "slug": "statutory-workbench",
    "title": "Statutory Workbench",
    "familyKey": "pay",
    "familyLabel": "Payroll",
    "desktopAsset": "/pay-scr-004-statutory-workbench-desktop.svg",
    "mobileAsset": "/pay-scr-004-statutory-workbench-mobile.svg"
  },
  {
    "ref": "PAY-SCR-005",
    "slug": "compliance-calendar",
    "title": "Compliance Calendar",
    "familyKey": "pay",
    "familyLabel": "Payroll",
    "desktopAsset": "/pay-scr-005-compliance-calendar-desktop.svg",
    "mobileAsset": "/pay-scr-005-compliance-calendar-mobile.svg"
  },
  {
    "ref": "PAY-SCR-006",
    "slug": "retro-and-settlement-workspace",
    "title": "Retro And Settlement Workspace",
    "familyKey": "pay",
    "familyLabel": "Payroll",
    "desktopAsset": "/pay-scr-006-retro-and-settlement-workspace-desktop.svg",
    "mobileAsset": "/pay-scr-006-retro-and-settlement-workspace-mobile.svg"
  },
  {
    "ref": "PEO-SCR-001",
    "slug": "employee-profile-summary",
    "title": "Employee Profile Summary",
    "familyKey": "peo",
    "familyLabel": "People Record",
    "desktopAsset": "/peo-scr-001-employee-profile-summary-desktop.svg",
    "mobileAsset": "/peo-scr-001-employee-profile-summary-mobile.svg"
  },
  {
    "ref": "PEO-SCR-002",
    "slug": "employment-details-workspace",
    "title": "Employment Details Workspace",
    "familyKey": "peo",
    "familyLabel": "People Record",
    "desktopAsset": "/peo-scr-002-employment-details-workspace-desktop.svg",
    "mobileAsset": "/peo-scr-002-employment-details-workspace-mobile.svg"
  },
  {
    "ref": "PEO-SCR-003",
    "slug": "identity-and-compliance-panel",
    "title": "Identity And Compliance Panel",
    "familyKey": "peo",
    "familyLabel": "People Record",
    "desktopAsset": "/peo-scr-003-identity-and-compliance-panel-desktop.svg",
    "mobileAsset": "/peo-scr-003-identity-and-compliance-panel-mobile.svg"
  },
  {
    "ref": "PEO-SCR-004",
    "slug": "bank-and-tax-maintenance",
    "title": "Bank And Tax Maintenance",
    "familyKey": "peo",
    "familyLabel": "People Record",
    "desktopAsset": "/peo-scr-004-bank-and-tax-maintenance-desktop.svg",
    "mobileAsset": "/peo-scr-004-bank-and-tax-maintenance-mobile.svg"
  },
  {
    "ref": "PEO-SCR-005",
    "slug": "documents-center",
    "title": "Documents Center",
    "familyKey": "peo",
    "familyLabel": "People Record",
    "desktopAsset": "/peo-scr-005-documents-center-desktop.svg",
    "mobileAsset": "/peo-scr-005-documents-center-mobile.svg"
  },
  {
    "ref": "PEO-SCR-006",
    "slug": "employee-timeline",
    "title": "Employee Timeline",
    "familyKey": "peo",
    "familyLabel": "People Record",
    "desktopAsset": "/peo-scr-006-employee-timeline-desktop.svg",
    "mobileAsset": "/peo-scr-006-employee-timeline-mobile.svg"
  },
  {
    "ref": "PEO-SCR-007",
    "slug": "lifecycle-action-wizard",
    "title": "Lifecycle Action Wizard",
    "familyKey": "peo",
    "familyLabel": "People Record",
    "desktopAsset": "/peo-scr-007-lifecycle-action-wizard-desktop.svg",
    "mobileAsset": "/peo-scr-007-lifecycle-action-wizard-mobile.svg"
  },
  {
    "ref": "REC-SCR-001",
    "slug": "requisition-workbench",
    "title": "Requisition Workbench",
    "familyKey": "rec",
    "familyLabel": "Recruitment",
    "desktopAsset": "/rec-scr-001-requisition-workbench-desktop.svg",
    "mobileAsset": "/rec-scr-001-requisition-workbench-mobile.svg"
  },
  {
    "ref": "REC-SCR-002",
    "slug": "candidate-pipeline-board",
    "title": "Candidate Pipeline Board",
    "familyKey": "rec",
    "familyLabel": "Recruitment",
    "desktopAsset": "/rec-scr-002-candidate-pipeline-board-desktop.svg",
    "mobileAsset": "/rec-scr-002-candidate-pipeline-board-mobile.svg"
  },
  {
    "ref": "REC-SCR-003",
    "slug": "candidate-profile",
    "title": "Candidate Profile",
    "familyKey": "rec",
    "familyLabel": "Recruitment",
    "desktopAsset": "/rec-scr-003-candidate-profile-desktop.svg",
    "mobileAsset": "/rec-scr-003-candidate-profile-mobile.svg"
  },
  {
    "ref": "REC-SCR-004",
    "slug": "interview-scheduler",
    "title": "Interview Scheduler",
    "familyKey": "rec",
    "familyLabel": "Recruitment",
    "desktopAsset": "/rec-scr-004-interview-scheduler-desktop.svg",
    "mobileAsset": "/rec-scr-004-interview-scheduler-mobile.svg"
  },
  {
    "ref": "REC-SCR-005",
    "slug": "offer-workspace",
    "title": "Offer Workspace",
    "familyKey": "rec",
    "familyLabel": "Recruitment",
    "desktopAsset": "/rec-scr-005-offer-workspace-desktop.svg",
    "mobileAsset": "/rec-scr-005-offer-workspace-mobile.svg"
  },
  {
    "ref": "REC-SCR-006",
    "slug": "talent-review-workspace",
    "title": "Talent Review Workspace",
    "familyKey": "rec",
    "familyLabel": "Recruitment",
    "desktopAsset": "/rec-scr-006-talent-review-workspace-desktop.svg",
    "mobileAsset": "/rec-scr-006-talent-review-workspace-mobile.svg"
  },
  {
    "ref": "W0-SCR-001",
    "slug": "platform-admin-home",
    "title": "Platform Admin Home",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-001-platform-admin-home-desktop.svg",
    "mobileAsset": "/w0-scr-001-platform-admin-home-mobile.svg"
  },
  {
    "ref": "W0-SCR-002",
    "slug": "global-search",
    "title": "Global Search",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-002-global-search-desktop.svg",
    "mobileAsset": "/w0-scr-002-global-search-mobile.svg"
  },
  {
    "ref": "W0-SCR-003",
    "slug": "task-inbox",
    "title": "Task Inbox",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-003-task-inbox-desktop.svg",
    "mobileAsset": "/w0-scr-003-task-inbox-mobile.svg"
  },
  {
    "ref": "W0-SCR-004",
    "slug": "config-console",
    "title": "Config Console",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-004-config-console-desktop.svg",
    "mobileAsset": "/w0-scr-004-config-console-mobile.svg"
  },
  {
    "ref": "W0-SCR-005",
    "slug": "metadata-explorer",
    "title": "Metadata Explorer",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-005-metadata-explorer-desktop.svg",
    "mobileAsset": "/w0-scr-005-metadata-explorer-mobile.svg"
  },
  {
    "ref": "W0-SCR-006",
    "slug": "workflow-admin",
    "title": "Workflow Admin",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-006-workflow-admin-desktop.svg",
    "mobileAsset": "/w0-scr-006-workflow-admin-mobile.svg"
  },
  {
    "ref": "W0-SCR-007",
    "slug": "notification-console",
    "title": "Notification Console",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-007-notification-console-desktop.svg",
    "mobileAsset": "/w0-scr-007-notification-console-mobile.svg"
  },
  {
    "ref": "W0-SCR-008",
    "slug": "audit-explorer",
    "title": "Audit Explorer",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-008-audit-explorer-desktop.svg",
    "mobileAsset": "/w0-scr-008-audit-explorer-mobile.svg"
  },
  {
    "ref": "W0-SCR-009",
    "slug": "runtime-monitor",
    "title": "Runtime Monitor",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-009-runtime-monitor-desktop.svg",
    "mobileAsset": "/w0-scr-009-runtime-monitor-mobile.svg"
  },
  {
    "ref": "W0-SCR-010",
    "slug": "document-builder",
    "title": "Document Builder",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-010-document-builder-desktop.svg",
    "mobileAsset": "/w0-scr-010-document-builder-mobile.svg"
  },
  {
    "ref": "W0-SCR-011",
    "slug": "ai-policy-console",
    "title": "Ai Policy Console",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-011-ai-policy-console-desktop.svg",
    "mobileAsset": "/w0-scr-011-ai-policy-console-mobile.svg"
  },
  {
    "ref": "W0-SCR-012",
    "slug": "localization-diagnostics",
    "title": "Localization Diagnostics",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-012-localization-diagnostics-desktop.svg",
    "mobileAsset": "/w0-scr-012-localization-diagnostics-mobile.svg"
  },
  {
    "ref": "W0-SCR-013",
    "slug": "dynamic-form-designer",
    "title": "Dynamic Form Designer",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-013-dynamic-form-designer-desktop.svg",
    "mobileAsset": "/w0-scr-013-dynamic-form-designer-mobile.svg"
  },
  {
    "ref": "W0-SCR-014",
    "slug": "dynamic-field-catalog",
    "title": "Dynamic Field Catalog",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-014-dynamic-field-catalog-desktop.svg",
    "mobileAsset": "/w0-scr-014-dynamic-field-catalog-mobile.svg"
  },
  {
    "ref": "W0-SCR-015",
    "slug": "dynamic-master-console",
    "title": "Dynamic Master Console",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-015-dynamic-master-console-desktop.svg",
    "mobileAsset": "/w0-scr-015-dynamic-master-console-mobile.svg"
  },
  {
    "ref": "W0-SCR-016",
    "slug": "localization-bundle-manager",
    "title": "Localization Bundle Manager",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-016-localization-bundle-manager-desktop.svg",
    "mobileAsset": "/w0-scr-016-localization-bundle-manager-mobile.svg"
  },
  {
    "ref": "W0-SCR-017",
    "slug": "system-settings-console",
    "title": "System Settings Console",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-017-system-settings-console-desktop.svg",
    "mobileAsset": "/w0-scr-017-system-settings-console-mobile.svg"
  },
  {
    "ref": "W0-SCR-018",
    "slug": "org-admin-home",
    "title": "Org Admin Home",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-018-org-admin-home-desktop.svg",
    "mobileAsset": "/w0-scr-018-org-admin-home-mobile.svg"
  },
  {
    "ref": "W0-SCR-019",
    "slug": "access-governance-dashboard",
    "title": "Access Governance Dashboard",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-019-access-governance-dashboard-desktop.svg",
    "mobileAsset": "/w0-scr-019-access-governance-dashboard-mobile.svg"
  },
  {
    "ref": "W0-SCR-020",
    "slug": "role-and-policy-matrix-workspace",
    "title": "Role And Policy Matrix Workspace",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-020-role-and-policy-matrix-workspace-desktop.svg",
    "mobileAsset": "/w0-scr-020-role-and-policy-matrix-workspace-mobile.svg"
  },
  {
    "ref": "W0-SCR-021",
    "slug": "data-masking-policy-console",
    "title": "Data Masking Policy Console",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-021-data-masking-policy-console-desktop.svg",
    "mobileAsset": "/w0-scr-021-data-masking-policy-console-mobile.svg"
  },
  {
    "ref": "W0-SCR-022",
    "slug": "retention-and-legal-hold-control-center",
    "title": "Retention And Legal Hold Control Center",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-022-retention-and-legal-hold-control-center-desktop.svg",
    "mobileAsset": "/w0-scr-022-retention-and-legal-hold-control-center-mobile.svg"
  },
  {
    "ref": "W0-SCR-023",
    "slug": "access-review-campaign-workspace",
    "title": "Access Review Campaign Workspace",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-023-access-review-campaign-workspace-desktop.svg",
    "mobileAsset": "/w0-scr-023-access-review-campaign-workspace-mobile.svg"
  },
  {
    "ref": "W0-SCR-024",
    "slug": "backup-and-restore-operations-dashboard",
    "title": "Backup And Restore Operations Dashboard",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-024-backup-and-restore-operations-dashboard-desktop.svg",
    "mobileAsset": "/w0-scr-024-backup-and-restore-operations-dashboard-mobile.svg"
  },
  {
    "ref": "W0-SCR-025",
    "slug": "disaster-recovery-readiness-console",
    "title": "Disaster Recovery Readiness Console",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-025-disaster-recovery-readiness-console-desktop.svg",
    "mobileAsset": "/w0-scr-025-disaster-recovery-readiness-console-mobile.svg"
  },
  {
    "ref": "W0-SCR-026",
    "slug": "bulk-import-wizard-and-validation-workbench",
    "title": "Bulk Import Wizard And Validation Workbench",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-026-bulk-import-wizard-and-validation-workbench-desktop.svg",
    "mobileAsset": "/w0-scr-026-bulk-import-wizard-and-validation-workbench-mobile.svg"
  },
  {
    "ref": "W0-SCR-027",
    "slug": "migration-mapping-and-reconciliation-workspace",
    "title": "Migration Mapping And Reconciliation Workspace",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-027-migration-mapping-and-reconciliation-workspace-desktop.svg",
    "mobileAsset": "/w0-scr-027-migration-mapping-and-reconciliation-workspace-mobile.svg"
  },
  {
    "ref": "W0-SCR-028",
    "slug": "validation-command-center",
    "title": "Validation Command Center",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-028-validation-command-center-desktop.svg",
    "mobileAsset": "/w0-scr-028-validation-command-center-mobile.svg"
  },
  {
    "ref": "W0-SCR-029",
    "slug": "cutover-command-center",
    "title": "Cutover Command Center",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-029-cutover-command-center-desktop.svg",
    "mobileAsset": "/w0-scr-029-cutover-command-center-mobile.svg"
  },
  {
    "ref": "W0-SCR-030",
    "slug": "rollback-runbook-and-trigger-workspace",
    "title": "Rollback Runbook And Trigger Workspace",
    "familyKey": "w0",
    "familyLabel": "Wave 0 Platform and Admin",
    "desktopAsset": "/w0-scr-030-rollback-runbook-and-trigger-workspace-desktop.svg",
    "mobileAsset": "/w0-scr-030-rollback-runbook-and-trigger-workspace-mobile.svg"
  },
  {
    "ref": "WRK-SCR-001",
    "slug": "attendance-control-center",
    "title": "Attendance Control Center",
    "familyKey": "wrk",
    "familyLabel": "Workforce Operations",
    "desktopAsset": "/wrk-scr-001-attendance-control-center-desktop.svg",
    "mobileAsset": "/wrk-scr-001-attendance-control-center-mobile.svg"
  },
  {
    "ref": "WRK-SCR-002",
    "slug": "shift-management",
    "title": "Shift Management",
    "familyKey": "wrk",
    "familyLabel": "Workforce Operations",
    "desktopAsset": "/wrk-scr-002-shift-management-desktop.svg",
    "mobileAsset": "/wrk-scr-002-shift-management-mobile.svg"
  },
  {
    "ref": "WRK-SCR-003",
    "slug": "rostering-screen",
    "title": "Rostering Screen",
    "familyKey": "wrk",
    "familyLabel": "Workforce Operations",
    "desktopAsset": "/wrk-scr-003-rostering-screen-desktop.svg",
    "mobileAsset": "/wrk-scr-003-rostering-screen-mobile.svg"
  },
  {
    "ref": "WRK-SCR-004",
    "slug": "timesheet-workbench",
    "title": "Timesheet Workbench",
    "familyKey": "wrk",
    "familyLabel": "Workforce Operations",
    "desktopAsset": "/wrk-scr-004-timesheet-workbench-desktop.svg",
    "mobileAsset": "/wrk-scr-004-timesheet-workbench-mobile.svg"
  }
];
