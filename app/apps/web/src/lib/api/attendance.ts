import { apiRequest } from "./http";
import type { AttendanceDay, MarkAttendanceInput, TeamAttendanceEntry } from "./types";

export function markAttendance(input: MarkAttendanceInput): Promise<AttendanceDay> {
  return apiRequest<AttendanceDay>("/attendance/mark", { method: "POST", body: JSON.stringify(input) });
}

export function listMyAttendance(from?: string, to?: string): Promise<AttendanceDay[]> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<AttendanceDay[]>(`/attendance/my${query}`);
}

export function listTeamAttendance(date?: string): Promise<TeamAttendanceEntry[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return apiRequest<TeamAttendanceEntry[]>(`/attendance/team${query}`);
}
