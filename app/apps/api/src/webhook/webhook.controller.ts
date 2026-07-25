import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { CreateWebhookSubscriptionDto } from "./dto/create-webhook-subscription.dto";
import { WebhookDispatchService } from "./webhook.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/27-integration-platform/02-webhooks.md */
@Controller("integration/webhooks")
@Roles("org_admin", "hr_ops")
export class WebhookController {
  constructor(private readonly service: WebhookDispatchService) {}

  @Post("subscriptions")
  @HttpCode(201)
  async create(@Body() dto: CreateWebhookSubscriptionDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("subscriptions")
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Post("subscriptions/:id/disable")
  @HttpCode(200)
  async disable(@Param("id") id: string) {
    const data = await this.service.disable(id);
    return { data };
  }

  @Get("deliveries")
  async listDeliveries(@Query("subscriptionId") subscriptionId?: string) {
    const data = await this.service.listDeliveries(subscriptionId);
    return { data };
  }
}
