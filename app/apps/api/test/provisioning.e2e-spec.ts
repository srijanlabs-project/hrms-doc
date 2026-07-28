import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { bootstrapTestApp } from "./utils/bootstrap";

/**
 * E2E coverage of the W0·E28 tenant-provisioning bootstrap endpoint
 * (POST /platform/tenants) — the one route in this app that's intentionally
 * NOT gated by the normal session-based AuthGuard, so it needs its own
 * direct test of the PlatformKeyGuard rather than relying on the auth
 * suite's coverage.
 */
describe("Tenant provisioning (e2e)", () => {
  let app: NestExpressApplication;
  const tenantCode = `e2e-test-${Date.now()}`;

  beforeAll(async () => {
    app = await bootstrapTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects a request with no platform key", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/platform/tenants")
      .send({ tenantCode, tenantName: "E2E Test Co", adminEmail: "admin@e2e-test.example" });
    expect(res.status).toBe(403);
  });

  it("rejects a request with the wrong platform key", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/platform/tenants")
      .set("X-Platform-Key", "definitely-wrong-key")
      .send({ tenantCode, tenantName: "E2E Test Co", adminEmail: "admin@e2e-test.example" });
    expect(res.status).toBe(403);
  });

  it("rejects an invalid tenant code (uppercase/spaces) before ever checking the key", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/platform/tenants")
      .set("X-Platform-Key", platformKey())
      .send({ tenantCode: "Not A Slug", tenantName: "E2E Test Co", adminEmail: "admin@e2e-test.example" });
    expect(res.status).toBe(422);
  });

  it("creates a tenant and its first org_admin with the correct key", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/platform/tenants")
      .set("X-Platform-Key", platformKey())
      .send({ tenantCode, tenantName: "E2E Test Co", adminEmail: "admin@e2e-test.example" });

    expect(res.status).toBe(201);
    expect(res.body.data.tenant.code).toBe(tenantCode);
    expect(res.body.data.admin.email).toBe("admin@e2e-test.example");
    expect(res.body.data.admin.roles).toEqual(["org_admin"]);
  });

  it("rejects a duplicate tenant code with a 409 conflict", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/platform/tenants")
      .set("X-Platform-Key", platformKey())
      .send({ tenantCode, tenantName: "Duplicate Attempt", adminEmail: "someone-else@e2e-test.example" });
    expect(res.status).toBe(409);
  });

  it("lets the newly provisioned admin log in through the ordinary OTP flow", async () => {
    const otpRes = await request(app.getHttpServer())
      .post("/api/v1/auth/otp/request")
      .send({ tenantCode, email: "admin@e2e-test.example" });
    expect(otpRes.status).toBe(200);
    expect(otpRes.body.data.devOtp).toBe("123456");

    const verifyRes = await request(app.getHttpServer())
      .post("/api/v1/auth/otp/verify")
      .send({ tenantCode, email: "admin@e2e-test.example", otp: "123456" });
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.user.roles).toContain("org_admin");
  });
});

function platformKey(): string {
  return process.env.PLATFORM_PROVISIONING_KEY ?? "dev-only-platform-key-change-me";
}
