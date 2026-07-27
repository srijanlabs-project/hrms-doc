import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateResourceDto } from "./dto/create-resource.dto";
import { ResourceRepository } from "./resource.repository";

/** Admin-managed catalog of desk/room/parking/shuttle/cafeteria resources — see controller's @Roles guard. */
@Injectable()
export class ResourceService {
  constructor(
    private readonly repository: ResourceRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateResourceDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      type: dto.type,
      name: dto.name,
      location: dto.location,
      capacity: dto.capacity ?? 1,
    });
  }

  /** Every employee can see active resources to book them. */
  async listActive() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listActive(tenantId);
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listAll(tenantId);
  }

  async setActive(id: string, isActive: boolean) {
    const { tenantId } = this.requireAuthenticated();
    const count = await this.repository.setActive(tenantId, id, isActive);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-WORKPLACE-RESOURCE", "Resource not found.");
    }
    return this.repository.findById(tenantId, id);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
