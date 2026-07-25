import { Inject, Injectable } from "@nestjs/common";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError } from "../platform/errors/errors";
import { AI_PROVIDER, type AiProvider } from "./ai-provider.interface";

/** Thin orchestration only — all real logic lives in AiDataService (queries) and the injected AiProvider (reply generation). */
@Injectable()
export class AiService {
  constructor(
    @Inject(AI_PROVIDER) private readonly provider: AiProvider,
    private readonly requestContext: RequestContextService,
  ) {}

  async ask(message: string) {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return this.provider.answer(message, tenantId);
  }
}
