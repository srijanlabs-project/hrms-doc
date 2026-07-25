import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { KnowledgeArticleController } from "./knowledge/knowledge-article.controller";
import { KnowledgeArticleRepository } from "./knowledge/knowledge-article.repository";
import { KnowledgeArticleService } from "./knowledge/knowledge-article.service";
import { SlaPolicyController } from "./sla/sla-policy.controller";
import { SlaPolicyRepository } from "./sla/sla-policy.repository";
import { SlaPolicyService } from "./sla/sla-policy.service";
import { TicketController } from "./ticket/ticket.controller";
import { TicketRepository } from "./ticket/ticket.repository";
import { TicketService } from "./ticket/ticket.service";

/**
 * Helpdesk and Case Management, Wave 4 W4·E19 —
 * docs/03-module-specifications/19-helpdesk-case-management.md. v1 slice:
 * tickets (+comments, SLA-driven due dates, nightly escalation sweep), SLA
 * policies, and a knowledge base. See schema.prisma's Ticket comment for
 * what's collapsed/deferred (employee relations and grievance management
 * stays out — needs its own confidential handling, not just another queue).
 */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [TicketController, SlaPolicyController, KnowledgeArticleController],
  providers: [
    TicketService,
    TicketRepository,
    SlaPolicyService,
    SlaPolicyRepository,
    KnowledgeArticleService,
    KnowledgeArticleRepository,
  ],
})
export class HelpdeskModule {}
