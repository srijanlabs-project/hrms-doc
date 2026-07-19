import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { OrgModule } from "./org/org.module";
import { ContextModule } from "./platform/context/context.module";
import { RequestContextMiddleware } from "./platform/context/request-context.middleware";
import { AllExceptionsFilter } from "./platform/errors/all-exceptions.filter";
import { PlatformModule } from "./platform/platform.module";
import { PrismaModule } from "./platform/prisma/prisma.module";

/**
 * Staffsy modular monolith. Modules mirror the service boundaries defined in
 * docs/06-cross-cutting-specs/08-service-topology-and-deployment-architecture.md.
 * Domain modules (org, people, leave, attendance, payroll, workflow) are added
 * here as their build waves start.
 */
@Module({
  imports: [PrismaModule, ContextModule, PlatformModule, OrgModule],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
