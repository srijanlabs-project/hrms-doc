import { Controller, Get } from "@nestjs/common";
import { RequestsHubService } from "./requests-hub.service";

/** HTTP only — no business logic. Employee Self Service Requests hub. */
@Controller("ess/requests")
export class RequestsHubController {
  constructor(private readonly service: RequestsHubService) {}

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("mine/summary")
  async summary() {
    const data = await this.service.summary();
    return { data };
  }
}
