import { IsIn, IsOptional, IsUUID } from "class-validator";

const SCOPES = ["Tenant", "LegalEntity", "Department"] as const;

export class AssignCalendarDto {
  @IsIn(SCOPES)
  scope!: (typeof SCOPES)[number];

  @IsOptional()
  @IsUUID()
  scopeId?: string;
}
