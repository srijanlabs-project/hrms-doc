import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import type { CreateKnowledgeArticleDto } from "./dto/create-knowledge-article.dto";
import { KnowledgeArticleRepository } from "./knowledge-article.repository";

@Injectable()
export class KnowledgeArticleService {
  constructor(
    private readonly repository: KnowledgeArticleRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  /** org_admin/hr_ops only. */
  async create(dto: CreateKnowledgeArticleDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      queue: dto.queue,
      title: dto.title,
      body: dto.body,
      isPublished: dto.isPublished ?? false,
      createdByUserId: userId,
    });
  }

  /** Self-service: published articles only, optionally filtered by queue. */
  async listPublished(queue?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findPublished(tenantId, queue);
  }

  /** org_admin/hr_ops only. */
  async listAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAllAdmin(tenantId);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
