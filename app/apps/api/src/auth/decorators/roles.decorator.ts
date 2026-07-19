import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

/**
 * RBAC v1: a route decorated with @Roles(...) requires the caller to hold at
 * least one of the listed roles. No decorator means "any authenticated
 * user" — the full governed role/permission catalog (04-roles.md,
 * 05-permissions.md) is a later access-governance pass, not this one.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
