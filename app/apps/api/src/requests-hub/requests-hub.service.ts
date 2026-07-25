import { Injectable } from "@nestjs/common";
import { ExpenseClaimRepository } from "../expense/expense-claim.repository";
import { LeaveRequestRepository } from "../leave/request/leave-request.repository";
import { CurrentEmployeeService } from "../people/current-employee.service";
import { TravelRequestRepository } from "../travel/travel-request.repository";

export interface UnifiedRequest {
  id: string;
  sourceType: "Leave" | "Expense" | "Travel";
  title: string;
  status: string;
  submittedAt: Date;
  linkPath: string;
}

/**
 * Employee Self Service — unified Requests hub (04-requests.md v1 slice).
 * The spec envisions one generic `employee_request` entity spanning every
 * request type (personal-data updates, bank changes, letters, HR help,
 * etc.) with its own workflow routing — that would duplicate the workflow
 * engine this build has deliberately deferred. This is a read-only
 * aggregation of the request-shaped entities that already exist and already
 * have real routing/approval logic (Leave, Expense, Travel), replacing the
 * "Requires Workflow module" placeholders on the home dashboard. Withdraw
 * actions go through each source module's own existing cancel endpoint —
 * this hub does not duplicate that logic.
 */
@Injectable()
export class RequestsHubService {
  constructor(
    private readonly leaveRepository: LeaveRequestRepository,
    private readonly expenseRepository: ExpenseClaimRepository,
    private readonly travelRepository: TravelRequestRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async listMine(): Promise<UnifiedRequest[]> {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const [leave, expense, travel] = await Promise.all([
      this.leaveRepository.findForEmployee(tenantId, employee.id),
      this.expenseRepository.findForEmployee(tenantId, employee.id),
      this.travelRepository.findForEmployee(tenantId, employee.id),
    ]);

    const unified: UnifiedRequest[] = [
      ...leave.map((r) => ({
        id: r.id,
        sourceType: "Leave" as const,
        title: `${r.leaveType} Leave (${r.days} day${r.days === 1 ? "" : "s"})`,
        status: r.status,
        submittedAt: r.createdAt,
        linkPath: "/leave",
      })),
      ...expense.map((c) => ({
        id: c.id,
        sourceType: "Expense" as const,
        title: `${c.category} Claim (₹${c.amount.toLocaleString("en-IN")})`,
        status: c.status,
        submittedAt: c.createdAt,
        linkPath: "/expenses",
      })),
      ...travel.map((t) => ({
        id: t.id,
        sourceType: "Travel" as const,
        title: `${t.tripType} Travel to ${t.destination}`,
        status: t.status,
        submittedAt: t.createdAt,
        linkPath: "/travel",
      })),
    ];

    return unified.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  async summary(): Promise<{ total: number; pending: number }> {
    const all = await this.listMine();
    return { total: all.length, pending: all.filter((r) => r.status === "Pending").length };
  }
}
