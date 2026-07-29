import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ImplementationModule } from "../implementation/implementation.module";
import { TestRunController } from "./run/test-run.controller";
import { TestRunRepository } from "./run/test-run.repository";
import { TestRunService } from "./run/test-run.service";
import { TestSuiteController } from "./suite/test-suite.controller";
import { TestSuiteRepository } from "./suite/test-suite.repository";
import { TestSuiteService } from "./suite/test-suite.service";
import { TestDataController } from "./test-data/test-data.controller";
import { TestDataService } from "./test-data/test-data.service";

/**
 * Wave 5·E32 Testing and Quality gap closure. Test data management reuses
 * the existing Import Engine (E31) directly rather than a parallel data-
 * creation path — see TestDataService's comment. Regression/Performance/
 * Security/Accessibility/UAT collapse into one type-tagged suite/case/run/
 * result engine — see schema.prisma's TestSuite comment for what's
 * deliberately deferred (live load-generation, automated security/a11y
 * scanning tools this build doesn't have infrastructure for).
 */
@Module({
  imports: [AuthModule, ImplementationModule],
  controllers: [TestDataController, TestSuiteController, TestRunController],
  providers: [TestDataService, TestSuiteService, TestSuiteRepository, TestRunService, TestRunRepository],
})
export class TestingModule {}
