import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { NotFoundAppError } from "../../platform/errors/errors";
import type { CreateCommentDto } from "./dto/create-comment.dto";
import type { CreatePostDto } from "./dto/create-post.dto";
import { FeedRepository } from "./feed.repository";

/**
 * Wave 4 W4·E15 gap closure ("social feed") — text-only company/community
 * feed. No photo/image uploads: avoids the moderation/consent infrastructure
 * this build deliberately doesn't have (see schema.prisma's FeedPost comment).
 */
@Injectable()
export class FeedService {
  constructor(
    private readonly repository: FeedRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async createPost(dto: CreatePostDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.createPost(tenantId, { employeeId: employee.id, body: dto.body, communityId: dto.communityId });
  }

  async listFeed(communityId?: string) {
    const { tenantId } = await this.currentEmployee.resolve();
    return this.repository.findFeed(tenantId, communityId);
  }

  async comment(postId: string, dto: CreateCommentDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    await this.findPostOrThrow(tenantId, postId);
    return this.repository.createComment(tenantId, { postId, employeeId: employee.id, body: dto.body });
  }

  async toggleLike(postId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    await this.findPostOrThrow(tenantId, postId);
    const existing = await this.repository.findLike(tenantId, postId, employee.id);
    if (existing) {
      await this.repository.unlike(tenantId, postId, employee.id);
      return { liked: false };
    }
    await this.repository.like(tenantId, postId, employee.id);
    return { liked: true };
  }

  private async findPostOrThrow(tenantId: string, id: string) {
    const post = await this.repository.findPostById(tenantId, id);
    if (!post) {
      throw new NotFoundAppError("OBJ-FEED-POST", "Post not found.");
    }
    return post;
  }
}
