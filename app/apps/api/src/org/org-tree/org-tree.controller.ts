import { Controller, Get } from "@nestjs/common";
import { OrgTreeService } from "./org-tree.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/01-organization-management/04-organization-tree.md */
@Controller("org/tree")
export class OrgTreeController {
  constructor(private readonly service: OrgTreeService) {}

  @Get()
  async getTree() {
    const data = await this.service.getTree();
    return { data };
  }
}
