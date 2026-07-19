import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequestContextService } from "../../platform/context/request-context.service";
import { ForbiddenAppError } from "../../platform/errors/errors";
import { ROLES_KEY } from "../decorators/roles.decorator";

/** Global guard, runs after AuthGuard. No @Roles() on a route means "any authenticated user". */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestContext: RequestContextService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const roles = this.requestContext.roles;
    if (!required.some((role) => roles.includes(role))) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return true;
  }
}
