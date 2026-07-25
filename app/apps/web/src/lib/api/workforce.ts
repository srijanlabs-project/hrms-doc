import { apiRequest } from "./http";
import type {
  CreateOvertimeRequestInput,
  CreateShiftInput,
  CreateTimesheetEntryInput,
  MyRosterDay,
  OvertimeRequest,
  RosterEntry,
  RosterSwapRequest,
  ShiftAssignment,
  ShiftAssignmentWithEmployee,
  ShiftDefinition,
  TimesheetEntry,
} from "./types";

// Shifts
export function listShifts(): Promise<ShiftDefinition[]> {
  return apiRequest<ShiftDefinition[]>("/workforce/shifts");
}

export function createShift(input: CreateShiftInput): Promise<ShiftDefinition> {
  return apiRequest<ShiftDefinition>("/workforce/shifts", { method: "POST", body: JSON.stringify(input) });
}

export function assignShift(input: { employeeId: string; shiftId: string; effectiveFrom: string }): Promise<ShiftAssignment> {
  return apiRequest<ShiftAssignment>("/workforce/shifts/assignments", { method: "POST", body: JSON.stringify(input) });
}

export function getMyShift(): Promise<ShiftAssignment | null> {
  return apiRequest<ShiftAssignment | null>("/workforce/shifts/assignments/mine");
}

export function listAllShiftAssignments(): Promise<ShiftAssignmentWithEmployee[]> {
  return apiRequest<ShiftAssignmentWithEmployee[]>("/workforce/shifts/assignments");
}

// Roster
export function upsertRosterEntry(input: { employeeId: string; shiftId: string; date: string }): Promise<RosterEntry> {
  return apiRequest<RosterEntry>("/workforce/roster/entries", { method: "POST", body: JSON.stringify(input) });
}

export function listRosterForRange(from: string, to: string): Promise<RosterEntry[]> {
  return apiRequest<RosterEntry[]>(`/workforce/roster/entries?from=${from}&to=${to}`);
}

export function publishRoster(from: string, to: string): Promise<{ publishedCount: number }> {
  return apiRequest("/workforce/roster/publish", { method: "POST", body: JSON.stringify({ from, to }) });
}

export function getMyRoster(from: string, to: string): Promise<MyRosterDay[]> {
  return apiRequest<MyRosterDay[]>(`/workforce/roster/mine?from=${from}&to=${to}`);
}

export function requestRosterSwap(
  rosterEntryId: string,
  input: { counterpartEmployeeId: string; reason?: string },
): Promise<RosterSwapRequest> {
  return apiRequest<RosterSwapRequest>(`/workforce/roster/entries/${rosterEntryId}/swap-requests`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listMyRosterSwaps(): Promise<RosterSwapRequest[]> {
  return apiRequest<RosterSwapRequest[]>("/workforce/roster/swap-requests/mine");
}

export function listTeamRosterSwaps(): Promise<RosterSwapRequest[]> {
  return apiRequest<RosterSwapRequest[]>("/workforce/roster/swap-requests/team");
}

export function approveRosterSwap(id: string, note?: string): Promise<RosterSwapRequest> {
  return apiRequest<RosterSwapRequest>(`/workforce/roster/swap-requests/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export function rejectRosterSwap(id: string, note?: string): Promise<RosterSwapRequest> {
  return apiRequest<RosterSwapRequest>(`/workforce/roster/swap-requests/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export function withdrawRosterSwap(id: string): Promise<{ withdrawn: true }> {
  return apiRequest(`/workforce/roster/swap-requests/${id}/withdraw`, { method: "POST" });
}

// Timesheets
export function listMyTimesheetEntries(): Promise<TimesheetEntry[]> {
  return apiRequest<TimesheetEntry[]>("/workforce/timesheets/my");
}

export function listTeamTimesheetEntries(): Promise<TimesheetEntry[]> {
  return apiRequest<TimesheetEntry[]>("/workforce/timesheets/team");
}

export function createTimesheetEntry(input: CreateTimesheetEntryInput): Promise<TimesheetEntry> {
  return apiRequest<TimesheetEntry>("/workforce/timesheets", { method: "POST", body: JSON.stringify(input) });
}

export function approveTimesheetEntry(id: string, note?: string): Promise<TimesheetEntry> {
  return apiRequest<TimesheetEntry>(`/workforce/timesheets/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export function rejectTimesheetEntry(id: string, note?: string): Promise<TimesheetEntry> {
  return apiRequest<TimesheetEntry>(`/workforce/timesheets/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export function withdrawTimesheetEntry(id: string): Promise<{ withdrawn: true }> {
  return apiRequest(`/workforce/timesheets/${id}/withdraw`, { method: "POST" });
}

// Overtime
export function listMyOvertimeRequests(): Promise<OvertimeRequest[]> {
  return apiRequest<OvertimeRequest[]>("/workforce/overtime/my");
}

export function listTeamOvertimeRequests(): Promise<OvertimeRequest[]> {
  return apiRequest<OvertimeRequest[]>("/workforce/overtime/team");
}

export function createOvertimeRequest(input: CreateOvertimeRequestInput): Promise<OvertimeRequest> {
  return apiRequest<OvertimeRequest>("/workforce/overtime", { method: "POST", body: JSON.stringify(input) });
}

export function approveOvertimeRequest(id: string, note?: string): Promise<OvertimeRequest> {
  return apiRequest<OvertimeRequest>(`/workforce/overtime/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export function rejectOvertimeRequest(id: string, note?: string): Promise<OvertimeRequest> {
  return apiRequest<OvertimeRequest>(`/workforce/overtime/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}
