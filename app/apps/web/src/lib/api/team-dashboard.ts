import { apiRequest } from "./http";

export interface TeamRosterMember {
  id: string;
  legalName: string;
  employeeCode: string;
  status: string;
  department: string | null;
}

export interface PendingApproval {
  id: string;
  sourceType: "Leave" | "Expense" | "Travel";
  employeeName: string;
  title: string;
  submittedAt: string;
  linkPath: string;
}

export interface TeamAnalytics {
  attendanceRateToday: number;
  oldestPendingApprovalDays: number;
}

export interface TeamDashboard {
  roster: TeamRosterMember[];
  teamSize: number;
  pendingApprovals: PendingApproval[];
  pendingApprovalCount: number;
  teamAnalytics: TeamAnalytics;
}

export function getTeamDashboard(): Promise<TeamDashboard> {
  return apiRequest("/mss/team-dashboard");
}
