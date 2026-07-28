import { Injectable } from "@nestjs/common";
import { BackgroundRepository } from "../../people/background/background.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { CourseRepository } from "../course/course.repository";
import { EnrollmentRepository } from "../enrollment/enrollment.repository";

/**
 * W3·E12 gap closure ("skill development") — a thin read-only cross-reference
 * between EmployeeSkill (people-extras) and LearningCourse.skillTags. No new
 * skills taxonomy, no auto-upgrading of proficiency levels — just: what have
 * you developed, and what could you develop further given skills you already
 * have.
 */
@Injectable()
export class SkillDevelopmentService {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly courseRepository: CourseRepository,
    private readonly backgroundRepository: BackgroundRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async getMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    const [enrollments, publishedCourses, background] = await Promise.all([
      this.enrollmentRepository.findForEmployee(tenantId, employee.id),
      this.courseRepository.findPublished(tenantId),
      this.backgroundRepository.findAll(tenantId, employee.id),
    ]);

    const completedCourseIds = new Set(enrollments.filter((e) => e.status === "Completed").map((e) => e.courseId));
    const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

    const developedSkillTags = Array.from(
      new Set(enrollments.filter((e) => completedCourseIds.has(e.courseId)).flatMap((e) => e.course.skillTags)),
    );

    const mySkillNames = new Set(background.skills.map((s) => s.name.toLowerCase()));
    const recommendedCourses = publishedCourses
      .filter((c) => !enrolledCourseIds.has(c.id))
      .filter((c) => c.skillTags.some((tag) => mySkillNames.has(tag.toLowerCase())))
      .map((c) => ({ id: c.id, title: c.title, skillTags: c.skillTags }));

    return { developedSkillTags, recommendedCourses };
  }
}
