import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { RolesGuard } from "./guards/roles.guard";

/**
 * AuthGuard and RolesGuard are registered here as global APP_GUARD providers
 * (not in AppModule) because their constructors depend on JwtService and
 * AuthRepository, both of which live in this module's scope. NestJS applies
 * an APP_GUARD provider globally regardless of which module declares it, as
 * long as that module is part of the app's module graph — declaring it here
 * keeps the guards' dependencies resolvable without re-exporting JwtModule.
 * Guard order matters: AuthGuard runs before RolesGuard (roles aren't known
 * until the session is verified) — array order is registration order.
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
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
