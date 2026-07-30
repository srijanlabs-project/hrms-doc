import { ArrayUnique, IsArray, IsIn, IsOptional } from "class-validator";

/**
 * The three role strings RolesGuard actually checks, plus "employee" — which
 * no @Roles() decorator names, so it reads as "authenticated, no elevated
 * access" (the same thing OfferService assigns on offer→employee conversion).
 * Kept explicit rather than free-text so a typo can't silently mint an
 * account that matches no guard and no self-service branch.
 */
export const ASSIGNABLE_ROLES = ["employee", "manager", "hr_ops", "org_admin"] as const;
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export class ProvisionLoginDto {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(ASSIGNABLE_ROLES, { each: true })
  roles?: AssignableRole[];
}
