import { apiRequest } from "./http";
import type {
  Appraisal,
  AssessCompetencyInput,
  CalibrationSession,
  CheckIn,
  Competency,
  CompetencyAssessment,
  CreateCalibrationSessionInput,
  CreateCheckInInput,
  CreateCompetencyInput,
  CreateFeedbackCampaignInput,
  CreateGoalInput,
  CreateKeyResultInput,
  FeedbackCampaign,
  FeedbackPendingRequest,
  FeedbackSummary,
  CreatePipInput,
  Goal,
  KeyResult,
  NominateRaterInput,
  PerformanceImprovementPlan,
  SubmitFeedback360Input,
} from "./types";

export function listMyGoals(): Promise<Goal[]> {
  return apiRequest<Goal[]>("/performance/goals/my");
}

export function listTeamGoals(): Promise<Goal[]> {
  return apiRequest<Goal[]>("/performance/goals/team");
}

export function createGoal(input: CreateGoalInput): Promise<Goal> {
  return apiRequest<Goal>("/performance/goals", { method: "POST", body: JSON.stringify(input) });
}

export function updateGoalProgress(id: string, progress: number, note?: string): Promise<Goal> {
  return apiRequest<Goal>(`/performance/goals/${id}/progress`, {
    method: "POST",
    body: JSON.stringify({ progress, note }),
  });
}

export function completeGoal(id: string): Promise<Goal> {
  return apiRequest<Goal>(`/performance/goals/${id}/complete`, { method: "POST" });
}

export function createKeyResult(input: CreateKeyResultInput): Promise<KeyResult> {
  return apiRequest<KeyResult>("/performance/key-results", { method: "POST", body: JSON.stringify(input) });
}

export function updateKeyResultValue(id: string, currentValue: number): Promise<KeyResult[]> {
  return apiRequest<KeyResult[]>(`/performance/key-results/${id}/value`, {
    method: "POST",
    body: JSON.stringify({ currentValue }),
  });
}

export function listCompetencyCatalog(): Promise<Competency[]> {
  return apiRequest<Competency[]>("/performance/competencies");
}

export function createCompetency(input: CreateCompetencyInput): Promise<Competency> {
  return apiRequest<Competency>("/performance/competencies", { method: "POST", body: JSON.stringify(input) });
}

export function listMyCompetencyAssessments(): Promise<CompetencyAssessment[]> {
  return apiRequest<CompetencyAssessment[]>("/performance/competencies/assessments/mine");
}

export function listCompetencyAssessmentsForEmployee(employeeId: string): Promise<CompetencyAssessment[]> {
  return apiRequest<CompetencyAssessment[]>(`/performance/competencies/assessments/employee/${employeeId}`);
}

export function assessCompetency(input: AssessCompetencyInput): Promise<CompetencyAssessment> {
  return apiRequest<CompetencyAssessment>("/performance/competencies/assessments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listMyCheckIns(): Promise<CheckIn[]> {
  return apiRequest<CheckIn[]>("/performance/check-ins/mine");
}

export function createCheckIn(input: CreateCheckInInput): Promise<CheckIn> {
  return apiRequest<CheckIn>("/performance/check-ins", { method: "POST", body: JSON.stringify(input) });
}

export function addCheckInManagerNotes(id: string, notes: string): Promise<CheckIn> {
  return apiRequest<CheckIn>(`/performance/check-ins/${id}/manager-notes`, { method: "POST", body: JSON.stringify({ notes }) });
}

export function addCheckInEmployeeNotes(id: string, notes: string): Promise<CheckIn> {
  return apiRequest<CheckIn>(`/performance/check-ins/${id}/employee-notes`, { method: "POST", body: JSON.stringify({ notes }) });
}

export function completeCheckIn(id: string): Promise<CheckIn> {
  return apiRequest<CheckIn>(`/performance/check-ins/${id}/complete`, { method: "POST" });
}

export function cancelCheckIn(id: string): Promise<CheckIn> {
  return apiRequest<CheckIn>(`/performance/check-ins/${id}/cancel`, { method: "POST" });
}

export function listMyAppraisals(): Promise<Appraisal[]> {
  return apiRequest<Appraisal[]>("/performance/appraisals/my");
}

export function listTeamAppraisals(): Promise<Appraisal[]> {
  return apiRequest<Appraisal[]>("/performance/appraisals/team");
}

export function listAllAppraisals(): Promise<Appraisal[]> {
  return apiRequest<Appraisal[]>("/performance/appraisals");
}

export function createAppraisal(employeeId: string, periodYear: number): Promise<Appraisal> {
  return apiRequest<Appraisal>("/performance/appraisals", {
    method: "POST",
    body: JSON.stringify({ employeeId, periodYear }),
  });
}

export function submitSelfReview(id: string, rating: number, comments?: string): Promise<Appraisal> {
  return apiRequest<Appraisal>(`/performance/appraisals/${id}/self-review`, {
    method: "POST",
    body: JSON.stringify({ rating, comments }),
  });
}

export function submitManagerReview(id: string, rating: number, comments?: string): Promise<Appraisal> {
  return apiRequest<Appraisal>(`/performance/appraisals/${id}/manager-review`, {
    method: "POST",
    body: JSON.stringify({ rating, comments }),
  });
}

export function finalizeAppraisal(id: string): Promise<Appraisal> {
  return apiRequest<Appraisal>(`/performance/appraisals/${id}/finalize`, { method: "POST" });
}

export function listFeedbackCampaignsForSubject(subjectEmployeeId: string): Promise<FeedbackCampaign[]> {
  return apiRequest<FeedbackCampaign[]>(
    `/performance/360/campaigns?subjectEmployeeId=${encodeURIComponent(subjectEmployeeId)}`,
  );
}

export function myFeedbackSummary(): Promise<FeedbackSummary[]> {
  return apiRequest<FeedbackSummary[]>("/performance/360/my-summary");
}

export function myFeedbackRequests(): Promise<FeedbackPendingRequest[]> {
  return apiRequest<FeedbackPendingRequest[]>("/performance/360/my-requests");
}

export function createFeedbackCampaign(input: CreateFeedbackCampaignInput): Promise<FeedbackCampaign> {
  return apiRequest<FeedbackCampaign>("/performance/360/campaigns", { method: "POST", body: JSON.stringify(input) });
}

export function nominateRater(campaignId: string, input: NominateRaterInput) {
  return apiRequest(`/performance/360/campaigns/${campaignId}/raters`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function openFeedbackCampaign(campaignId: string): Promise<FeedbackCampaign> {
  return apiRequest<FeedbackCampaign>(`/performance/360/campaigns/${campaignId}/open`, { method: "POST" });
}

export function closeFeedbackCampaign(campaignId: string): Promise<FeedbackCampaign> {
  return apiRequest<FeedbackCampaign>(`/performance/360/campaigns/${campaignId}/close`, { method: "POST" });
}

export function submitFeedback360Response(raterId: string, input: SubmitFeedback360Input) {
  return apiRequest(`/performance/360/raters/${raterId}/respond`, { method: "POST", body: JSON.stringify(input) });
}

export function listCalibrationSessions(): Promise<CalibrationSession[]> {
  return apiRequest<CalibrationSession[]>("/performance/calibration/sessions");
}

export function getCalibrationSession(id: string): Promise<CalibrationSession> {
  return apiRequest<CalibrationSession>(`/performance/calibration/sessions/${id}`);
}

export function createCalibrationSession(input: CreateCalibrationSessionInput): Promise<CalibrationSession> {
  return apiRequest<CalibrationSession>("/performance/calibration/sessions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function generateCalibrationCases(sessionId: string, departmentId?: string): Promise<CalibrationSession> {
  return apiRequest<CalibrationSession>(`/performance/calibration/sessions/${sessionId}/generate-cases`, {
    method: "POST",
    body: JSON.stringify({ departmentId }),
  });
}

export function closeCalibrationSession(sessionId: string): Promise<CalibrationSession> {
  return apiRequest<CalibrationSession>(`/performance/calibration/sessions/${sessionId}/close`, { method: "POST" });
}

export function adjustCalibrationCase(caseId: string, calibratedRating: number, rationale?: string) {
  return apiRequest(`/performance/calibration/cases/${caseId}/adjust`, {
    method: "POST",
    body: JSON.stringify({ calibratedRating, rationale }),
  });
}

export function createPip(input: CreatePipInput): Promise<PerformanceImprovementPlan> {
  return apiRequest<PerformanceImprovementPlan>("/performance/pips", { method: "POST", body: JSON.stringify(input) });
}

export function listMyPips(): Promise<PerformanceImprovementPlan[]> {
  return apiRequest<PerformanceImprovementPlan[]>("/performance/pips/mine");
}

export function listTeamPips(): Promise<PerformanceImprovementPlan[]> {
  return apiRequest<PerformanceImprovementPlan[]>("/performance/pips/team");
}

export function listAllPips(): Promise<PerformanceImprovementPlan[]> {
  return apiRequest<PerformanceImprovementPlan[]>("/performance/pips");
}

export function completePipObjective(objectiveId: string): Promise<PerformanceImprovementPlan> {
  return apiRequest<PerformanceImprovementPlan>(`/performance/pips/objectives/${objectiveId}/complete`, { method: "POST" });
}

export function closePip(id: string, outcome: string, outcomeNotes?: string): Promise<PerformanceImprovementPlan> {
  return apiRequest<PerformanceImprovementPlan>(`/performance/pips/${id}/close`, {
    method: "POST",
    body: JSON.stringify({ outcome, outcomeNotes }),
  });
}
