import { Injectable } from "@nestjs/common";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { RequestContextService } from "../../platform/context/request-context.service";
import { TestSuiteRepository } from "../suite/test-suite.repository";
import type { RecordTestResultDto } from "./dto/record-test-result.dto";
import type { SignoffTestRunDto } from "./dto/signoff-test-run.dto";
import { TestRunRepository } from "./test-run.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-TEST-RUN-001",
    code: "TEST-RUN-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-TEST-RUN",
    details: { currentState },
  });
}

/**
 * Wave 5·E32 gap closure — executing a test run against a suite's active
 * cases. A run auto-transitions from Running to Passed/Failed/Blocked once
 * every case has a recorded outcome (Fail beats Blocked beats Passed), then
 * a separate signoff step records the UAT-style approval decision — mirrors
 * the module's own spec's "Test run dashboard" + "UAT sign-off workspace"
 * as two distinct steps rather than one combined action.
 */
@Injectable()
export class TestRunService {
  constructor(
    private readonly repository: TestRunRepository,
    private readonly suiteRepository: TestSuiteRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async startRun(suiteId: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const cases = await this.suiteRepository.findActiveCasesForSuite(tenantId, suiteId);
    if (cases.length === 0) {
      throw stateConflict("This suite has no active test cases to run.", "NoCases");
    }
    return this.repository.createRun(tenantId, {
      suiteId,
      executedByUserId: userId,
      caseIds: cases.map((c) => c.id),
    });
  }

  listRuns() {
    return this.repository.findAll(this.requireAuthenticated().tenantId);
  }

  async getRun(id: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.findOrThrow(tenantId, id);
  }

  async recordResult(runId: string, dto: RecordTestResultDto) {
    const { tenantId } = this.requireAuthenticated();
    const run = await this.findOrThrow(tenantId, runId);
    if (run.status !== "Running") {
      throw stateConflict("Only a Running test run accepts results.", run.status);
    }

    const count = await this.repository.recordResult(tenantId, runId, dto.caseId, dto.outcome, dto.notes);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-TEST-RESULT", "This case is not part of this run.");
    }

    const refreshed = await this.repository.findById(tenantId, runId);
    if (refreshed && refreshed.results.every((r) => r.outcome !== "Pending")) {
      const finalStatus = refreshed.results.some((r) => r.outcome === "Fail")
        ? "Failed"
        : refreshed.results.some((r) => r.outcome === "Blocked")
          ? "Blocked"
          : "Passed";
      await this.repository.setRunStatus(tenantId, runId, finalStatus);
    }

    return this.repository.findById(tenantId, runId);
  }

  async signoff(runId: string, dto: SignoffTestRunDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const run = await this.findOrThrow(tenantId, runId);
    const count = await this.repository.signoff(tenantId, runId, {
      decision: dto.decision,
      notes: dto.notes,
      signedOffByUserId: userId,
    });
    if (count === 0) {
      throw stateConflict("Only a Passed, Failed, or Blocked run can be signed off.", run.status);
    }
    return this.repository.findById(tenantId, runId);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const run = await this.repository.findById(tenantId, id);
    if (!run) {
      throw new NotFoundAppError("OBJ-TEST-RUN", "Test run not found.");
    }
    return run;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
