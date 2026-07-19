import { Body, Controller, Get, HttpCode, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from "./constants";
import { Public } from "./decorators/public.decorator";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.service.login(dto);
    res.cookie(SESSION_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: "lax",
      // Dev runs over plain http on localhost; production must serve the
      // app over https for `secure` to be safely enabled here.
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TTL_MS,
      path: "/",
    });
    return { data: { user: result.user, expiresAt: result.expiresAt } };
  }

  @Post("logout")
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.service.logout();
    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return { data: { loggedOut: true } };
  }

  @Get("session/current")
  async currentSession() {
    const data = await this.service.getCurrentSession();
    return { data };
  }
}
