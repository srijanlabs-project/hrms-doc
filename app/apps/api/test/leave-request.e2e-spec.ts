import type { NestExpressApplication } from "@nestjs/platform-express";
import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { bootstrapTestApp } from "./utils/bootstrap";
import { loginAs } from "./utils/login";

/**
 * Coverage of the leave-request state machine (apply -> approve/reject/cancel),
 * the third representative workflow module in this suite alongside Department
 * (simple CRUD) and Import Engine (bulk data engine).
 *
 * create() requires the applicant's Employee.managerId to resolve to an
 * existing manager (see resolveApprover) — no seeded, login-capable Srijan
 * Labs user has one configured (the only employee with a manager, Rohit, is
 * Separated and can't log in; the org_admin/hr_ops seeded logins have none).
 * This suite temporarily points Priya's managerId at Rohit's employee row
 * (resolveApprover only checks the manager Employee exists, not their
 * status) for the duration of the run, and restores it to null afterward —
 * a direct, tenant-scoped Prisma write, not a new migration or seed change.
 *
 * Every request this suite creates gets approved/rejected (real, persisted
 * decisions), which permanently consumes Priya's small seeded Casual/Sick/
 * Annual balance for the year unless undone — an earlier version of this
 * suite didn't clean up and started failing on the second run with
 * "Only 0 day(s) of Casual leave available." Every created row is tagged
 * with E2E_TAG in its `reason` and hard-deleted in afterAll so the suite
 * is repeatable against the same shared dev database.
 */
const E2E_TAG = "e2e-leave-request-suite";
describe("Leave request lifecycle (e2e)", () => {
  let app: NestExpressApplication;
  let adminCookie: string;
  const prisma = new PrismaClient();
  let tenantId: string;
  let priyaId: string;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    adminCookie = await loginAs(app, "srijanlabs", "priya.sharma@srijanlabs.example");

    const tenant = await prisma.tenant.findUniqueOrThrow({ where: { code: "srijanlabs" } });
    tenantId = tenant.id;
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
      const priya = await tx.employee.findFirstOrThrow({ where: { tenantId, employeeCode: "SRIJAN-0001" } });
      const rohit = await tx.employee.findFirstOrThrow({ where: { tenantId, employeeCode: "SRIJAN-0002" } });
      priyaId = priya.id;
      await tx.employee.update({ where: { id: priyaId }, data: { managerId: rohit.id } });
    });
  });

  afterAll(async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
      await tx.leaveRequest.deleteMany({ where: { tenantId, employeeId: priyaId, reason: { contains: E2E_TAG } } });
      await tx.employee.update({ where: { id: priyaId }, data: { managerId: null } });
    });
    await prisma.$disconnect();
    await app.close();
  });

  function futureDateRange(daysFromNow: number, span: number) {
    const start = new Date();
    start.setUTCDate(start.getUTCDate() + daysFromNow);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + span);
    return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
  }

  it("rejects an invalid leave type", async () => {
    const { startDate, endDate } = futureDateRange(30, 1);
    const res = await request(app.getHttpServer())
      .post("/api/v1/leave/requests")
      .set("Cookie", adminCookie)
      .send({ leaveType: "Sabbatical", startDate, endDate });
    expect(res.status).toBe(422);
  });

  it("applies for leave, sees it in 'my requests', and an org_admin can approve it", async () => {
    const { startDate, endDate } = futureDateRange(40, 1);
    const createRes = await request(app.getHttpServer())
      .post("/api/v1/leave/requests")
      .set("Cookie", adminCookie)
      .send({ leaveType: "Casual", startDate, endDate, reason: E2E_TAG });
    expect(createRes.status).toBe(201);
    expect(createRes.body.data.status).toBe("Pending");
    const requestId = createRes.body.data.id;

    const mineRes = await request(app.getHttpServer()).get("/api/v1/leave/requests/my").set("Cookie", adminCookie);
    expect(mineRes.body.data.some((r: { id: string }) => r.id === requestId)).toBe(true);

    const approveRes = await request(app.getHttpServer())
      .post(`/api/v1/leave/requests/${requestId}/approve`)
      .set("Cookie", adminCookie)
      .send({ note: "Approved via e2e test" });
    expect(approveRes.status).toBe(200);
    expect(approveRes.body.data.status).toBe("Approved");
  });

  it("refuses to re-decide a request that is no longer Pending", async () => {
    const { startDate, endDate } = futureDateRange(50, 1);
    const createRes = await request(app.getHttpServer())
      .post("/api/v1/leave/requests")
      .set("Cookie", adminCookie)
      .send({ leaveType: "Sick", startDate, endDate, reason: E2E_TAG });
    const requestId = createRes.body.data.id;

    await request(app.getHttpServer())
      .post(`/api/v1/leave/requests/${requestId}/reject`)
      .set("Cookie", adminCookie)
      .send({ note: "Rejected via e2e test" });

    const secondDecision = await request(app.getHttpServer())
      .post(`/api/v1/leave/requests/${requestId}/approve`)
      .set("Cookie", adminCookie)
      .send({});
    expect(secondDecision.status).toBe(409);
  });

  it("lets the applicant cancel their own pending request", async () => {
    const { startDate, endDate } = futureDateRange(60, 1);
    const createRes = await request(app.getHttpServer())
      .post("/api/v1/leave/requests")
      .set("Cookie", adminCookie)
      .send({ leaveType: "Annual", startDate, endDate, reason: E2E_TAG });
    const requestId = createRes.body.data.id;

    const cancelRes = await request(app.getHttpServer())
      .post(`/api/v1/leave/requests/${requestId}/cancel`)
      .set("Cookie", adminCookie);
    expect(cancelRes.status).toBe(200);
  });
});
