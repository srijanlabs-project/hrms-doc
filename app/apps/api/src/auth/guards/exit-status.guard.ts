import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequestContextService } from "../../platform/context/request-context.service";
import { ExitAccessRestrictedError } from "../../platform/errors/errors";
import { AuthRepository } from "../auth.repository";
import { ALLOW_SEPARATED_KEY } from "../decorators/allow-separated.decorator";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

const RESTRICTED_STATUSES = ["Separated", "Archived"];

/**
 * Global guard, runs after AuthGuard and RolesGuard. Enforces the "limited
 * information" side of the exit-login feature at the API layer, not just by
 * hiding UI: once an employee's linked Employee record is Separated (or
 * Archived), every route 403s except the ones explicitly marked
 * `@AllowSeparated()` (logout, current-session, their own exit summary).
 */
@Injectable()
export class ExitStatusGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const allowSeparated = this.reflector.getAllAndOverride<boolean>(ALLOW_SEPARATED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowSeparated) return true;

    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) return true;

    const employeeStatus = await this.authRepository.findEmployeeStatusForUser(tenantId, userId);
    if (employeeStatus && RESTRICTED_STATUSES.includes(employeeStatus)) {
      throw new ExitAccessRestrictedError(this.requestContext.correlationId);
    }
    return true;
  }
}
