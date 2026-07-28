import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { NotFoundAppError } from "../../platform/errors/errors";
import { AnnouncementRepository } from "../announcement/announcement.repository";
import type { CreateAnnouncementCommentDto } from "./dto/create-announcement-comment.dto";
import { AnnouncementCommentRepository } from "./announcement-comment.repository";

/**
 * Wave 4 W4·E15 gap closure ("employee communications") — a real two-way
 * engagement layer on E23's existing Announcement broadcast entity, rather
 * than a duplicate broadcast mechanism (see schema.prisma's
 * AnnouncementComment comment).
 */
@Injectable()
export class AnnouncementCommentService {
  constructor(
    private readonly repository: AnnouncementCommentRepository,
    private readonly announcementRepository: AnnouncementRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async create(announcementId: string, dto: CreateAnnouncementCommentDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const announcement = await this.announcementRepository.findById(tenantId, announcementId);
    if (!announcement) {
      throw new NotFoundAppError("OBJ-ANNOUNCEMENT", "Announcement not found.");
    }
    return this.repository.create(tenantId, { announcementId, employeeId: employee.id, body: dto.body });
  }

  async listForAnnouncement(announcementId: string) {
    const { tenantId } = await this.currentEmployee.resolve();
    return this.repository.findForAnnouncement(tenantId, announcementId);
  }
}
