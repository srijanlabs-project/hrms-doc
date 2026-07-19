import { Module } from "@nestjs/common";
import { PlatformModule } from "./platform/platform.module";

/**
 * Staffsy modular monolith. Modules mirror the service boundaries defined in
 * docs/06-cross-cutting-specs/08-service-topology-and-deployment-architecture.md.
 * Domain modules (org, people, leave, attendance, payroll, workflow) are added
 * here as their build waves start.
 */
@Module({
  imports: [PlatformModule],
})
export class AppModule {}
