export interface AiAnswer {
  reply: string;
  suggestions: string[];
}

/**
 * Same swap-in pattern as OtpProvider (see auth/otp/otp-provider.ts): one
 * interface, a dev implementation that needs no external credentials, and a
 * real Claude API implementation to swap in later without touching any
 * caller. AiDataService supplies the real tenant-data lookups either
 * implementation would need.
 */
export interface AiProvider {
  answer(message: string, tenantId: string): Promise<AiAnswer>;
}

export const AI_PROVIDER = Symbol("AI_PROVIDER");
