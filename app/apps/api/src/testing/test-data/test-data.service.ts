import { Injectable } from "@nestjs/common";
import { ImportEngineService } from "../../implementation/import-batch/import-engine.service";

/**
 * Wave 5·E32 gap closure ("test data management") — a thin generator over
 * the existing Import Engine (E31) rather than a parallel data-creation
 * path: synthetic employee rows are fed straight into
 * ImportEngineService.processRows("Employee", ...), so the resulting
 * ImportBatch record already IS the test-data batch — purging it reuses
 * ImportEngineService.rollback() exactly as-is, with zero new schema.
 */
@Injectable()
export class TestDataService {
  constructor(private readonly importEngine: ImportEngineService) {}

  async generateSyntheticEmployees(count: number) {
    const tag = Math.random().toString(36).slice(2, 7).toUpperCase();
    const rows = Array.from({ length: count }, (_, i) => ({
      employeeCode: `TD${tag}${String(i + 1).padStart(3, "0")}`,
      legalName: "Synthetic Test Employee",
      joiningDate: new Date().toISOString().slice(0, 10),
    }));
    const result = await this.importEngine.processRows("Employee", rows, false);
    return result.dryRun ? result : result.batch;
  }

  /**
   * Shows every Employee-entityType import batch, not just synthetic ones —
   * there's no separate "is this test data" flag, since a batch this
   * generator creates is structurally identical to a real bulk-import
   * batch. Purge (rollback) works identically either way.
   */
  async listBatches() {
    const batches = await this.importEngine.listBatches();
    return batches.filter((b) => b.entityType === "Employee");
  }

  purgeBatch(id: string) {
    return this.importEngine.rollback(id);
  }
}
