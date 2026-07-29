import { Injectable } from "@nestjs/common";
import { NotFoundAppError } from "../../platform/errors/errors";
import { RequestContextService } from "../../platform/context/request-context.service";
import type { CreateTestCaseDto } from "./dto/create-test-case.dto";
import type { CreateTestSuiteDto } from "./dto/create-test-suite.dto";
import { TestSuiteRepository } from "./test-suite.repository";

/**
 * Wave 5·E32 gap closure — one type-tagged suite/case engine covering
 * Regression, Performance, Security, Accessibility, and UAT. See
 * schema.prisma's TestSuite comment for what's deliberately deferred (live
 * load-generation, automated SAST/DAST/axe-core scanning).
 */
@Injectable()
export class TestSuiteService {
  constructor(
    private readonly repository: TestSuiteRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  private get tenantId(): string {
    return this.requestContext.tenantId!;
  }

  createSuite(dto: CreateTestSuiteDto) {
    return this.repository.createSuite(this.tenantId, {
      name: dto.name,
      suiteType: dto.suiteType,
      description: dto.description,
    });
  }

  listSuites() {
    return this.repository.findAllSuites(this.tenantId);
  }

  async getSuite(id: string) {
    const suite = await this.repository.findSuiteById(this.tenantId, id);
    if (!suite) {
      throw new NotFoundAppError("OBJ-TEST-SUITE", "Test suite not found.");
    }
    return suite;
  }

  async addCase(suiteId: string, dto: CreateTestCaseDto) {
    await this.getSuite(suiteId);
    return this.repository.createCase(this.tenantId, {
      suiteId,
      title: dto.title,
      steps: dto.steps,
      expectedResult: dto.expectedResult,
    });
  }
}
