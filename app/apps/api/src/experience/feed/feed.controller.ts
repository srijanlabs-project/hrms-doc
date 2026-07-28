import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { FeedService } from "./feed.service";

/** HTTP only — no business logic. Wave 4 W4·E15 gap closure: social feed. */
@Controller("experience/feed")
export class FeedController {
  constructor(private readonly service: FeedService) {}

  @Get()
  async listFeed(@Query("communityId") communityId?: string) {
    const data = await this.service.listFeed(communityId);
    return { data };
  }

  @Post()
  @HttpCode(201)
  async createPost(@Body() dto: CreatePostDto) {
    const data = await this.service.createPost(dto);
    return { data };
  }

  @Post(":id/comments")
  @HttpCode(201)
  async comment(@Param("id") id: string, @Body() dto: CreateCommentDto) {
    const data = await this.service.comment(id, dto);
    return { data };
  }

  @Post(":id/like")
  @HttpCode(200)
  async toggleLike(@Param("id") id: string) {
    const data = await this.service.toggleLike(id);
    return { data };
  }
}
