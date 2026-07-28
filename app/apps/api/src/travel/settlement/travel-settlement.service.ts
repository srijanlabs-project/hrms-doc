import { Injectable } from "@nestjs/common";
import { ExpenseClaimRepository } from "../../expense/expense-claim.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { NotFoundAppError } from "../../platform/errors/errors";
import { TravelAdvanceRepository } from "../advance/travel-advance.repository";
import { TravelRequestRepository } from "../travel-request.repository";

export interface TravelSettlement {
  travelRequestId: string;
  totalAdvance: number;
  totalExpenses: number;
  netAmount: number;
  netDirection: "EmployeeOwesCompany" | "CompanyOwesEmployee" | "Settled";
}

/**
 * Wave 3 W4·E16 gap closure ("travel expense settlement") — always computed
 * live from linked TravelAdvance and ExpenseClaim rows, never stored, same
 * discipline used throughout this build (avoids a sync-drift bug class).
 */
@Injectable()
export class TravelSettlementService {
  constructor(
    private readonly travelRequestRepository: TravelRequestRepository,
    private readonly advanceRepository: TravelAdvanceRepository,
    private readonly expenseClaimRepository: ExpenseClaimRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async getSettlement(travelRequestId: string): Promise<TravelSettlement> {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const travelRequest = await this.travelRequestRepository.findById(tenantId, travelRequestId);
    if (!travelRequest || travelRequest.employeeId !== employee.id) {
      throw new NotFoundAppError("OBJ-TRAVEL-REQUEST", "Travel request not found.");
    }

    const [advances, expenses] = await Promise.all([
      this.advanceRepository.findForTravelRequest(tenantId, travelRequestId),
      this.expenseClaimRepository.findForEmployee(tenantId, employee.id),
    ]);

    const totalAdvance = advances
      .filter((a) => a.status === "Approved" || a.status === "Disbursed")
      .reduce((sum, a) => sum + (a.approvedAmount ?? 0), 0);

    const totalExpenses = expenses
      .filter((e) => e.travelRequestId === travelRequestId && (e.status === "Approved" || e.status === "Paid"))
      .reduce((sum, e) => sum + e.amount, 0);

    const netAmount = Math.abs(totalExpenses - totalAdvance);
    const netDirection =
      totalExpenses > totalAdvance ? "CompanyOwesEmployee" : totalExpenses < totalAdvance ? "EmployeeOwesCompany" : "Settled";

    return { travelRequestId, totalAdvance, totalExpenses, netAmount, netDirection };
  }
}
