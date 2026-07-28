import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateCommunityDto } from "./dto/create-community.dto";
import { CommunityRepository } from "./community.repository";

/** Wave 4 W4·E15 gap closure ("communities") — join-based interest groups. */
@Injectable()
export class CommunityService {
  constructor(
    private readonly repository: CommunityRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateCommunityDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      name: dto.name,
      description: dto.description,
      category: dto.category ?? "General",
      createdByUserId: userId,
    });
  }

  async listAllWithMembership() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const [communities, myMemberships] = await Promise.all([
      this.repository.findAllActive(tenantId),
      this.repository.findMyMemberships(tenantId, employee.id),
    ]);
    const myCommunityIds = new Set(myMemberships.map((m) => m.communityId));
    return communities.map((c) => ({ ...c, isMember: myCommunityIds.has(c.id) }));
  }

  async join(communityId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const community = await this.findOrThrow(tenantId, communityId);
    const existing = await this.repository.findMembership(tenantId, community.id, employee.id);
    if (existing) {
      throw new AppError({
        errorRef: "ERR-COMMUNITY-001",
        code: "COMMUNITY-001",
        category: "state-conflict",
        severity: "low",
        httpStatus: 409,
        message: "You have already joined this community.",
        retryable: false,
        tenantSafe: true,
        objectRef: "OBJ-COMMUNITY-MEMBERSHIP",
      });
    }
    return this.repository.join(tenantId, community.id, employee.id);
  }

  async leave(communityId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const count = await this.repository.leave(tenantId, communityId, employee.id);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-COMMUNITY-MEMBERSHIP", "You are not a member of this community.");
    }
    return { left: true };
  }

  private async findOrThrow(tenantId: string, id: string) {
    const community = await this.repository.findById(tenantId, id);
    if (!community) {
      throw new NotFoundAppError("OBJ-COMMUNITY", "Community not found.");
    }
    return community;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
