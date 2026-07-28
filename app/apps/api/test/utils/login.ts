import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { extractCookie } from "./bootstrap";

/** Logs in as a seeded user via the real OTP flow and returns the session cookie for use in subsequent requests. */
export async function loginAs(
  app: NestExpressApplication,
  tenantCode: string,
  email: string,
): Promise<string> {
  await request(app.getHttpServer()).post("/api/v1/auth/otp/request").send({ tenantCode, email });
  const verifyRes = await request(app.getHttpServer())
    .post("/api/v1/auth/otp/verify")
    .send({ tenantCode, email, otp: "123456" });
  if (verifyRes.status !== 200) {
    throw new Error(`Login failed for ${email}@${tenantCode}: ${verifyRes.status} ${JSON.stringify(verifyRes.body)}`);
  }
  return extractCookie(verifyRes.headers["set-cookie"], "staffsy_session");
}
