import { Body, Controller, Get, HttpCode, Param, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from "./constants";
import { AllowSeparated } from "./decorators/allow-separated.decorator";
import { Public } from "./decorators/public.decorator";
import { Roles } from "./decorators/roles.decorator";
import { RequestOtpDto } from "./dto/request-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import type { LoginResult } from "./auth.service";
import { MfaChallengeDto } from "./mfa/dto/mfa-challenge.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post("otp/request")
  @HttpCode(200)
  async requestOtp(@Body() dto: RequestOtpDto) {
    const data = await this.service.requestOtp(dto);
    return { data };
  }

  @Public()
  @Post("otp/verify")
  @HttpCode(200)
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.service.verifyOtp(dto);
    if ("mfaRequired" in result) {
      return { data: result };
    }
    this.setSessionCookie(res, result);
    return { data: { user: result.user, expiresAt: result.expiresAt } };
  }

  @Public()
  @Post("mfa/challenge")
  @HttpCode(200)
  async mfaChallenge(@Body() dto: MfaChallengeDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.service.completeMfaChallenge(dto.pendingToken, dto.code);
    this.setSessionCookie(res, result);
    return { data: { user: result.user, expiresAt: result.expiresAt } };
  }

  @Roles("org_admin", "hr_ops")
  @Post("proxy-login/:userId")
  @HttpCode(200)
  async proxyLogin(@Param("userId") userId: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.service.proxyLogin(userId);
    this.setSessionCookie(res, result);
    return { data: { user: result.user, expiresAt: result.expiresAt } };
  }

  @Roles("org_admin", "hr_ops")
  @Post("proxy-login/employee/:employeeId")
  @HttpCode(200)
  async proxyLoginByEmployee(@Param("employeeId") employeeId: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.service.proxyLoginByEmployee(employeeId);
    this.setSessionCookie(res, result);
    return { data: { user: result.user, expiresAt: result.expiresAt } };
  }

  @AllowSeparated()
  @Post("logout")
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.service.logout();
    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return { data: { loggedOut: true } };
  }

  @AllowSeparated()
  @Get("session/current")
  async currentSession() {
    const data = await this.service.getCurrentSession();
    return { data };
  }

  @Get("sessions")
  async listSessions() {
    const data = await this.service.listSessions();
    return { data };
  }

  @Post("sessions/:id/revoke")
  @HttpCode(200)
  async revokeSession(@Param("id") id: string) {
    await this.service.revokeSessionById(id);
    return { data: { revoked: true } };
  }

  private setSessionCookie(res: Response, result: LoginResult) {
    res.cookie(SESSION_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: "lax",
      // Dev runs over plain http on localhost; production must serve the
      // app over https for `secure` to be safely enabled here.
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TTL_MS,
      path: "/",
    });
  }
}
