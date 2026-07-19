import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError } from "../platform/errors/errors";
import type { CreateNotificationInput } from "./notification.repository";
import { NotificationRepository } from "./notification.repository";

@Injectable()
export class NotificationService {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  /** Called by other modules (e.g. leave) to notify a specific user — not necessarily the caller. */
  notify(tenantId: string, userId: string, input: CreateNotificationInput) {
    return this.repository.create(tenantId, userId, input);
  }

  async list() {
    const { tenantId, userId } = this.requireAuthenticated();
    const [items, unreadCount] = await Promise.all([
      this.repository.findForUser(tenantId, userId),
      this.repository.countUnread(tenantId, userId),
    ]);
    return { items, unreadCount };
  }

  async markRead(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    await this.repository.markRead(tenantId, userId, id);
  }

  async markAllRead() {
    const { tenantId, userId } = this.requireAuthenticated();
    await this.repository.markAllRead(tenantId, userId);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
