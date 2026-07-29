import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { bootstrapTestApp, extractCookie } from "./utils/bootstrap";
import { provisionTestUser } from "./utils/provision-test-user";

const ADMIN_EMAIL = "e2e-auth-admin@srijanlabs.example";
const GLOBEX_ADMIN_EMAIL = "e2e-auth-admin@globex.example";

/**
 * End-to-end coverage of the real login flow (OTP request/verify, session
 * cookie, protected-route gating) against a fully bootstrapped Nest app and
 * the real local Postgres — the same seeded `srijanlabs`/`globex` tenants
 * every browser verification this session has used, read-only.
 *
 * Uses dedicated provisioned logins rather than the shared Priya/Alex seed
 * users — this suite exercises the OTP endpoints directly (not through
 * loginAs()), and other spec files log in as Priya/Alex too, so sharing an
 * email here would race those files' OTP challenges under parallel Jest
 * workers (see provisionTestUser's own comment for the exact mechanism).
 */
describe("Auth (e2e)", () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    await provisionTestUser("srijanlabs", ADMIN_EMAIL, ["org_admin"]);
    await provisionTestUser("globex", GLOBEX_ADMIN_EMAIL, ["org_admin"]);
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects a protected route with no session cookie", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/people/employees");
    expect(res.status).toBe(401);
  });

  it("requests an OTP for a seeded user and returns the dev OTP", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/otp/request")
      .send({ tenantCode: "srijanlabs", email: ADMIN_EMAIL });

    expect(res.status).toBe(200);
    expect(res.body.data.devOtp).toBe("123456");
  });

  it("rejects a bad tenant code before ever reaching auth logic (validation)", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/otp/request")
      .send({ tenantCode: "Not A Slug!", email: ADMIN_EMAIL });
    expect(res.status).toBe(422);
  });

  it("verifies the OTP, sets a session cookie, and grants access to a protected route", async () => {
    const verifyRes = await request(app.getHttpServer())
      .post("/api/v1/auth/otp/verify")
      .send({ tenantCode: "srijanlabs", email: ADMIN_EMAIL, otp: "123456" });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.user.email).toBe(ADMIN_EMAIL);
    expect(verifyRes.body.data.user.roles).toContain("org_admin");

    const cookie = extractCookie(verifyRes.headers["set-cookie"], "staffsy_session");

    const protectedRes = await request(app.getHttpServer())
      .get("/api/v1/people/employees")
      .set("Cookie", cookie);
    expect(protectedRes.status).toBe(200);
    expect(Array.isArray(protectedRes.body.data)).toBe(true);
  });

  it("rejects verification with the wrong OTP", async () => {
    await request(app.getHttpServer())
      .post("/api/v1/auth/otp/request")
      .send({ tenantCode: "srijanlabs", email: ADMIN_EMAIL });

    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/otp/verify")
      .send({ tenantCode: "srijanlabs", email: ADMIN_EMAIL, otp: "000000" });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("scopes a session strictly to its own tenant — a Globex session cannot see Srijan Labs data", async () => {
    await request(app.getHttpServer())
      .post("/api/v1/auth/otp/request")
      .send({ tenantCode: "globex", email: GLOBEX_ADMIN_EMAIL });

    const verifyRes = await request(app.getHttpServer())
      .post("/api/v1/auth/otp/verify")
      .send({ tenantCode: "globex", email: GLOBEX_ADMIN_EMAIL, otp: "123456" });
    expect(verifyRes.status).toBe(200);

    const cookie = extractCookie(verifyRes.headers["set-cookie"], "staffsy_session");
    const res = await request(app.getHttpServer()).get("/api/v1/people/employees").set("Cookie", cookie);

    expect(res.status).toBe(200);
    const codes = (res.body.data as { employeeCode: string }[]).map((e) => e.employeeCode);
    expect(codes.every((code: string) => !code.startsWith("SRIJAN-"))).toBe(true);
  });
});
