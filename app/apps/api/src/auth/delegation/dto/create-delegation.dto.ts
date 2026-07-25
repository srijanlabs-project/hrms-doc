import { IsDateString, IsIn, IsUUID } from "class-validator";

const DELEGATION_SCOPES = [
  "LeaveApproval",
  "ExpenseApproval",
  "TravelApproval",
  "TimesheetApproval",
  "OvertimeApproval",
  "All",
] as const;

export class CreateDelegationDto {
  @IsUUID()
  delegateUserId!: string;

  @IsIn(DELEGATION_SCOPES)
  scope!: (typeof DELEGATION_SCOPES)[number];

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
