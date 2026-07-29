import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { bootstrapTestApp } from "./utils/bootstrap";
import { loginAs } from "./utils/login";
import { provisionTestUser } from "./utils/provision-test-user";

const ADMIN_EMAIL = "e2e-import-engine-admin@srijanlabs.example";

/** Coverage of the W0·E31 configurable import engine — dry-run validation, commit, and rollback (soft-delete) — using Department as the target entity (simplest field shape: code + name). */
describe("Import engine (e2e)", () => {
  let app: NestExpressApplication;
  let adminCookie: string;
  const goodCode = `IMP${Date.now()}`.slice(0, 20);

  beforeAll(async () => {
    app = await bootstrapTestApp();
    // Dedicated login (not the shared Priya seed) so this file never races another spec's OTP challenge under parallel Jest workers — see provisionTestUser's own comment.
    await provisionTestUser("srijanlabs", ADMIN_EMAIL, ["org_admin"]);
    adminCookie = await loginAs(app, "srijanlabs", ADMIN_EMAIL);
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects an unknown entity type", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/implementation/import-batches")
      .set("Cookie", adminCookie)
      .send({ entityType: "NotARealEntity", rows: [], dryRun: true });
    expect(res.status).toBe(422);
  });

  it("dry-runs a mixed valid/invalid batch, persisting nothing", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/implementation/import-batches")
      .set("Cookie", adminCookie)
      .send({
        entityType: "Department",
        dryRun: true,
        rows: [
          { code: goodCode, name: "Import Engine Test Dept" },
          { code: "lowercase-invalid", name: "Bad Code" },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.dryRun).toBe(true);
    expect(res.body.data.results).toHaveLength(2);
    expect(res.body.data.results[0].success).toBe(true);
    expect(res.body.data.results[1].success).toBe(false);

    const listRes = await request(app.getHttpServer())
      .get("/api/v1/org/departments")
      .set("Cookie", adminCookie);
    expect(listRes.body.data.some((d: { code: string }) => d.code === goodCode)).toBe(false);
  });

  it("commits only the valid row, persists a batch record, and creates the real department", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/implementation/import-batches")
      .set("Cookie", adminCookie)
      .send({
        entityType: "Department",
        dryRun: false,
        rows: [
          { code: goodCode, name: "Import Engine Test Dept" },
          { code: "lowercase-invalid", name: "Bad Code" },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.dryRun).toBe(false);
    expect(res.body.data.batch.successCount).toBe(1);
    expect(res.body.data.batch.failureCount).toBe(1);
    expect(res.body.data.batch.status).toBe("Committed");

    const listRes = await request(app.getHttpServer())
      .get("/api/v1/org/departments")
      .set("Cookie", adminCookie);
    expect(listRes.body.data.some((d: { code: string }) => d.code === goodCode)).toBe(true);
  });

  it("rolls back the batch, soft-deleting the department it created", async () => {
    const listRes = await request(app.getHttpServer())
      .get("/api/v1/implementation/import-batches")
      .set("Cookie", adminCookie);
    const batch = listRes.body.data.find((b: { entityType: string; status: string }) => b.entityType === "Department" && b.status === "Committed");
    expect(batch).toBeDefined();

    const rollbackRes = await request(app.getHttpServer())
      .post(`/api/v1/implementation/import-batches/${batch.id}/rollback`)
      .set("Cookie", adminCookie);
    expect(rollbackRes.status).toBe(201);
    expect(rollbackRes.body.data.status).toBe("RolledBack");

    const departmentsRes = await request(app.getHttpServer())
      .get("/api/v1/org/departments")
      .set("Cookie", adminCookie);
    // Soft-deleted (deletedAt set), not hard-deleted -- department.list() filters deletedAt: null, so it should no longer appear.
    expect(departmentsRes.body.data.some((d: { code: string }) => d.code === goodCode)).toBe(false);
  });

  it("refuses to roll back the same batch twice", async () => {
    const listRes = await request(app.getHttpServer())
      .get("/api/v1/implementation/import-batches")
      .set("Cookie", adminCookie);
    const batch = listRes.body.data.find(
      (b: { entityType: string; status: string }) => b.entityType === "Department" && b.status === "RolledBack",
    );
    expect(batch).toBeDefined();

    const res = await request(app.getHttpServer())
      .post(`/api/v1/implementation/import-batches/${batch.id}/rollback`)
      .set("Cookie", adminCookie);
    expect(res.status).toBe(409);
  });
});
