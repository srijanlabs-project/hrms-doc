import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { OTP_PROVIDER, StaticDevOtpProvider } from "./otp/otp-provider";

/**
 * AuthGuard and RolesGuard are registered here as global APP_GUARD providers
 * (not in AppModule) because their constructors depend on JwtService and
 * AuthRepository, both of which live in this module's scope. NestJS applies
 * an APP_GUARD provider globally regardless of which module declares it, as
 * long as that module is part of the app's module graph — declaring it here
 * keeps the guards' dependencies resolvable without re-exporting JwtModule.
 * Guard order matters: AuthGuard runs before RolesGuard (roles aren't known
 * until the session is verified) — array order is registration order.
 *
 * AuthGuard/RolesGuard are registered as plain class providers AND as
 * APP_GUARD via useExisting (one shared instance, not two): a provider can
 * only be exported if it's directly registered under its own class token in
 * this module, and other modules (e.g. LeaveModule) need AuthRepository
 * exported too, for cross-module "resolve this employee's user account"
 * lookups.
 */
@Module({
  imports: [
    JwtModule.register({
      // Dev-only fallback secret. Production deployment must set JWT_SECRET
      // to a securely managed value — see .env.example.
      secret: process.env.JWT_SECRET ?? "dev-only-insecure-secret-change-me",
      signOptions: { algorithm: "HS256" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    // BEFORE UAT: replace with a real SMS/email gateway provider. See
    // otp/otp-provider.ts for the swap-in contract.
    { provide: OTP_PROVIDER, useClass: StaticDevOtpProvider },
    AuthGuard,
    RolesGuard,
    { provide: APP_GUARD, useExisting: AuthGuard },
    { provide: APP_GUARD, useExisting: RolesGuard },
  ],
  exports: [AuthGuard, RolesGuard, AuthRepository],
})
export class AuthModule {}
