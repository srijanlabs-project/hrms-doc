import { apiRequest } from "./http";
import type {
  CertificationCatalog,
  CertificationRecord,
  CreateCertificationCatalogInput,
  CreateCertificationRecordInput,
  CreateCourseInput,
  CreateLearningPathInput,
  LearningCourse,
  LearningEnrollment,
  LearningPath,
  LearningPathProgress,
  SkillDevelopmentSummary,
  TeamEnrollment,
} from "./types";

export function listCourseCatalog(): Promise<LearningCourse[]> {
  return apiRequest<LearningCourse[]>("/learning/courses");
}

export function listAllCourses(): Promise<LearningCourse[]> {
  return apiRequest<LearningCourse[]>("/learning/courses/admin");
}

export function createCourse(input: CreateCourseInput): Promise<LearningCourse> {
  return apiRequest<LearningCourse>("/learning/courses", { method: "POST", body: JSON.stringify(input) });
}

export function publishCourse(id: string): Promise<LearningCourse> {
  return apiRequest<LearningCourse>(`/learning/courses/${id}/publish`, { method: "POST" });
}

export function archiveCourse(id: string): Promise<LearningCourse> {
  return apiRequest<LearningCourse>(`/learning/courses/${id}/archive`, { method: "POST" });
}

export function listMyEnrollments(): Promise<LearningEnrollment[]> {
  return apiRequest<LearningEnrollment[]>("/learning/enrollments/my");
}

export function listTeamMandatoryEnrollments(): Promise<TeamEnrollment[]> {
  return apiRequest<TeamEnrollment[]>("/learning/enrollments/team");
}

export function enrollInCourse(courseId: string): Promise<LearningEnrollment> {
  return apiRequest<LearningEnrollment>("/learning/enrollments", { method: "POST", body: JSON.stringify({ courseId }) });
}

export function completeEnrollment(id: string): Promise<LearningEnrollment> {
  return apiRequest<LearningEnrollment>(`/learning/enrollments/${id}/complete`, { method: "POST" });
}

export function withdrawEnrollment(id: string): Promise<LearningEnrollment> {
  return apiRequest<LearningEnrollment>(`/learning/enrollments/${id}/withdraw`, { method: "POST" });
}

export function submitAssessment(id: string, score: number, maxScore: number): Promise<LearningEnrollment> {
  return apiRequest<LearningEnrollment>(`/learning/enrollments/${id}/assessment`, {
    method: "POST",
    body: JSON.stringify({ score, maxScore }),
  });
}

export function listLearningPathCatalog(): Promise<LearningPath[]> {
  return apiRequest<LearningPath[]>("/learning/paths");
}

export function listAllLearningPaths(): Promise<LearningPath[]> {
  return apiRequest<LearningPath[]>("/learning/paths/admin");
}

export function listMyLearningPaths(): Promise<LearningPathProgress[]> {
  return apiRequest<LearningPathProgress[]>("/learning/paths/mine");
}

export function createLearningPath(input: CreateLearningPathInput): Promise<LearningPath> {
  return apiRequest<LearningPath>("/learning/paths", { method: "POST", body: JSON.stringify(input) });
}

export function publishLearningPath(id: string): Promise<LearningPath> {
  return apiRequest<LearningPath>(`/learning/paths/${id}/publish`, { method: "POST" });
}

export function enrollInLearningPath(id: string): Promise<LearningPathProgress> {
  return apiRequest<LearningPathProgress>(`/learning/paths/${id}/enroll`, { method: "POST" });
}

export function getMySkillDevelopment(): Promise<SkillDevelopmentSummary> {
  return apiRequest<SkillDevelopmentSummary>("/learning/skill-development/mine");
}

export function runComplianceTrainingNow(): Promise<{ triggered: boolean }> {
  return apiRequest<{ triggered: boolean }>("/learning/enrollments/run-now", { method: "POST" });
}

export function listCertificationCatalog(): Promise<CertificationCatalog[]> {
  return apiRequest<CertificationCatalog[]>("/learning/certifications/catalog");
}

export function createCertificationCatalogEntry(
  input: CreateCertificationCatalogInput,
): Promise<CertificationCatalog> {
  return apiRequest<CertificationCatalog>("/learning/certifications/catalog", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listMyCertifications(): Promise<CertificationRecord[]> {
  return apiRequest<CertificationRecord[]>("/learning/certifications/my");
}

export function listAllCertificationRecords(status?: string): Promise<CertificationRecord[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<CertificationRecord[]>(`/learning/certifications/records${query}`);
}

export function createCertificationRecord(input: CreateCertificationRecordInput): Promise<CertificationRecord> {
  return apiRequest<CertificationRecord>("/learning/certifications/records", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function verifyCertificationRecord(id: string): Promise<CertificationRecord> {
  return apiRequest<CertificationRecord>(`/learning/certifications/records/${id}/verify`, { method: "POST" });
}

export function revokeCertificationRecord(id: string, reason: string): Promise<CertificationRecord> {
  return apiRequest<CertificationRecord>(`/learning/certifications/records/${id}/revoke`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function runCertificationSweepNow(): Promise<{ triggered: boolean }> {
  return apiRequest<{ triggered: boolean }>("/learning/certifications/run-now", { method: "POST" });
}
