import { Injectable, Logger } from "@nestjs/common";

/**
 * Delivery boundary for OTP codes. `send` generates a code, delivers it to
 * `destination` (email or phone), and returns the plaintext code so the
 * caller can hash and store it — the verify path (AuthService.verifyOtp)
 * never needs to change when the implementation below is swapped.
 *
 * BEFORE UAT: replace StaticDevOtpProvider with a real integration (e.g.
 * AWS SES/SNS, Twilio, MSG91 — see 08-.../03-identity-and-access/03-mfa.md
 * §3 channel list) that generates a random code and actually delivers it.
 * Swap it in AuthModule's providers array; nothing else in the auth module
 * needs to change.
 */
export interface OtpProvider {
  send(destination: string): Promise<string>;
}

export const OTP_PROVIDER = Symbol("OTP_PROVIDER");

/**
 * Dev-only: always returns the same fixed code instead of sending anything.
 * Because the code never varies, exposing it in API responses (see
 * AuthController) cannot leak whether a given account exists — an attacker
 * already knows the value. Logged too, for anyone testing via curl/Postman
 * without reading the frontend's dev banner.
 */
@Injectable()
export class StaticDevOtpProvider implements OtpProvider {
  static readonly DEV_CODE = "123456";

  private readonly logger = new Logger("StaticDevOtpProvider");

  async send(destination: string): Promise<string> {
    this.logger.warn(`[DEV ONLY, NOT FOR UAT] OTP for ${destination}: ${StaticDevOtpProvider.DEV_CODE}`);
    return StaticDevOtpProvider.DEV_CODE;
  }
}
