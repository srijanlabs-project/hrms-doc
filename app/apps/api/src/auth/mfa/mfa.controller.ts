import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import { AuthRepository } from "../auth.repository";
import { ConfirmMfaEnrollmentDto } from "./dto/confirm-mfa-enrollment.dto";
import { MfaService } from "./mfa.service";

/** MFA self-service (enrollment/verification/revocation) — HTTP only, no business logic. */
@Controller("auth/mfa")
export class MfaController {
  constructor(
    private readonly service: MfaService,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  @Post("enroll")
  @HttpCode(201)
  async enroll() {
    const { tenantId, userId } = this.requireAuthenticated();
    const user = await this.authRepository.findUserById(tenantId, userId);
    if (!user) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    const data = await this.service.enroll(user.email);
    return { data };
  }

  @Post("confirm")
  @HttpCode(200)
  async confirm(@Body() dto: ConfirmMfaEnrollmentDto) {
    const data = await this.service.confirmEnrollment(dto.code);
    return { data };
  }

  @Get("factors")
  async listFactors() {
    const data = await this.service.listFactors();
    return { data };
  }

  @Delete("factors/:id")
  @HttpCode(200)
  async revoke(@Param("id") id: string) {
    const data = await this.service.revoke(id);
    return { data };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
