import { apiRequest } from "./http";

export type IncentiveBonusPayType = "Bonus" | "Incentive" | "VariablePay";

export interface IncentiveBonus {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string };
  payType: IncentiveBonusPayType;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface CreateIncentiveBonusInput {
  employeeId: string;
  payType: IncentiveBonusPayType;
  amount: number;
  reason: string;
}

export function createIncentiveBonus(input: CreateIncentiveBonusInput): Promise<IncentiveBonus> {
  return apiRequest<IncentiveBonus>("/payroll/incentive-bonus", { method: "POST", body: JSON.stringify(input) });
}

export function listMyIncentiveBonuses(): Promise<IncentiveBonus[]> {
  return apiRequest<IncentiveBonus[]>("/payroll/incentive-bonus/mine");
}

export function listAllIncentiveBonuses(): Promise<IncentiveBonus[]> {
  return apiRequest<IncentiveBonus[]>("/payroll/incentive-bonus/all");
}
