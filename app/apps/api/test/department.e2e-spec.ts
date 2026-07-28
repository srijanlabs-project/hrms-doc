import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { bootstrapTestApp } from "./utils/bootstrap";
import { loginAs } from "./utils/login";

/** Representative CRUD + role-gating + tenant-scoping coverage for a simple module (Organization Management's Department). */
describe("Department CRUD (e2e)", () => {
  let app: NestExpressApplication;
  let adminCookie: string;
  const code = `E2E${Date.now()}`.slice(0, 20);

  beforeAll(async () => {
    app = await bootstrapTestApp();
    adminCookie = await loginAs(app, "srijanlabs", "priya.sharma@srijanlabs.example");
  });

  afterAll(async () => {
    await app.close();
  });

  it("lists departments scoped to the caller's own tenant", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/org/departments")
      .set("Cookie", adminCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("rejects an unauthenticated request to create a department", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/org/departments")
      .send({ code: `${code}X`, name: "Should Be Rejected" });
    expect(res.status).toBe(401);
  });

  it("allows hr_ops (the controller's other @Roles entry) to create a department too", async () => {
    const hrOpsCookie = await loginAs(app, "srijanlabs", "sneha.reddy@srijanlabs.example");
    const res = await request(app.getHttpServer())
      .post("/api/v1/org/departments")
      .set("Cookie", hrOpsCookie)
      .send({ code: `${code}H`, name: "Created By HR Ops" });
    expect(res.status).toBe(201);
  });

  it("rejects an invalid department code (validation)", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/org/departments")
      .set("Cookie", adminCookie)
      .send({ code: "lowercase-not-allowed", name: "Bad Code" });
    expect(res.status).toBe(422);
  });

  it("creates a department as org_admin, then lists it back", async () => {
    const createRes = await request(app.getHttpServer())
      .post("/api/v1/org/departments")
      .set("Cookie", adminCookie)
      .send({ code, name: "E2E Test Department" });
    expect(createRes.status).toBe(201);
    expect(createRes.body.data.code).toBe(code);

    const listRes = await request(app.getHttpServer())
      .get("/api/v1/org/departments")
      .set("Cookie", adminCookie);
    expect(listRes.body.data.some((d: { code: string }) => d.code === code)).toBe(true);
  });

  it("rejects a duplicate department code with a conflict", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/org/departments")
      .set("Cookie", adminCookie)
      .send({ code, name: "Duplicate Attempt" });
    expect(res.status).toBe(409);
  });

  it("does not leak the new department into a different tenant's list", async () => {
    const globexCookie = await loginAs(app, "globex", "alex.carter@globex.example");
    const res = await request(app.getHttpServer())
      .get("/api/v1/org/departments")
      .set("Cookie", globexCookie);
    expect(res.body.data.some((d: { code: string }) => d.code === code)).toBe(false);
  });
});
