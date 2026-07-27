import { apiRequest } from "./http";
import type {
  Application,
  BackgroundCheck,
  Candidate,
  CreateCandidateInput,
  CreateRequisitionInput,
  InternalMobilityCandidate,
  InternalOpening,
  InterviewRound,
  Offer,
  OpenRequisition,
  ReferredCandidate,
  Requisition,
  ScheduleInterviewInput,
  SubmitInterviewFeedbackInput,
  SubmitInternalApplicationInput,
  SubmitReferralInput,
} from "./types";

export function listRequisitions(): Promise<Requisition[]> {
  return apiRequest<Requisition[]>("/recruitment/requisitions");
}

export function createRequisition(input: CreateRequisitionInput): Promise<Requisition> {
  return apiRequest<Requisition>("/recruitment/requisitions", { method: "POST", body: JSON.stringify(input) });
}

export function approveRequisition(id: string): Promise<Requisition> {
  return apiRequest<Requisition>(`/recruitment/requisitions/${id}/approve`, { method: "POST" });
}

export function publishRequisition(id: string): Promise<Requisition> {
  return apiRequest<Requisition>(`/recruitment/requisitions/${id}/publish`, { method: "POST" });
}

export function closeRequisition(id: string): Promise<Requisition> {
  return apiRequest<Requisition>(`/recruitment/requisitions/${id}/close`, { method: "POST" });
}

export function listCandidates(): Promise<Candidate[]> {
  return apiRequest<Candidate[]>("/recruitment/candidates");
}

export function createCandidate(input: CreateCandidateInput): Promise<Candidate> {
  return apiRequest<Candidate>("/recruitment/candidates", { method: "POST", body: JSON.stringify(input) });
}

export function listApplications(requisitionId: string): Promise<Application[]> {
  return apiRequest<Application[]>(`/recruitment/applications?requisitionId=${encodeURIComponent(requisitionId)}`);
}

export function applyCandidate(requisitionId: string, candidateId: string): Promise<Application> {
  return apiRequest<Application>("/recruitment/applications", {
    method: "POST",
    body: JSON.stringify({ requisitionId, candidateId }),
  });
}

export function advanceApplication(id: string, stage: string): Promise<Application> {
  return apiRequest<Application>(`/recruitment/applications/${id}/advance`, {
    method: "POST",
    body: JSON.stringify({ stage }),
  });
}

export function rejectApplication(id: string, reason?: string): Promise<Application> {
  return apiRequest<Application>(`/recruitment/applications/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function createOffer(applicationId: string, monthlyBasic: number, joiningDate: string): Promise<Offer> {
  return apiRequest<Offer>("/recruitment/offers", {
    method: "POST",
    body: JSON.stringify({ applicationId, monthlyBasic, joiningDate }),
  });
}

export function approveOffer(id: string): Promise<Offer> {
  return apiRequest<Offer>(`/recruitment/offers/${id}/approve`, { method: "POST" });
}

export function issueOffer(id: string): Promise<Offer> {
  return apiRequest<Offer>(`/recruitment/offers/${id}/issue`, { method: "POST" });
}

export function respondToOffer(id: string, accepted: boolean, declineReason?: string): Promise<Offer> {
  return apiRequest<Offer>(`/recruitment/offers/${id}/respond`, {
    method: "POST",
    body: JSON.stringify({ accepted, declineReason }),
  });
}

export function convertOffer(id: string): Promise<Offer> {
  return apiRequest<Offer>(`/recruitment/offers/${id}/convert`, { method: "POST" });
}

export function initiateBackgroundCheck(offerId: string, checkType?: string): Promise<BackgroundCheck> {
  return apiRequest<BackgroundCheck>(`/recruitment/offers/${offerId}/background-check`, {
    method: "POST",
    body: JSON.stringify({ checkType }),
  });
}

export function completeBackgroundCheck(
  offerId: string,
  status: "Cleared" | "Flagged",
  remarks?: string,
): Promise<BackgroundCheck> {
  return apiRequest<BackgroundCheck>(`/recruitment/offers/${offerId}/background-check/complete`, {
    method: "POST",
    body: JSON.stringify({ status, remarks }),
  });
}

export function listInterviewRounds(applicationId: string): Promise<InterviewRound[]> {
  return apiRequest<InterviewRound[]>(`/recruitment/interviews?applicationId=${encodeURIComponent(applicationId)}`);
}

export function scheduleInterview(input: ScheduleInterviewInput): Promise<InterviewRound> {
  return apiRequest<InterviewRound>("/recruitment/interviews", { method: "POST", body: JSON.stringify(input) });
}

export function cancelInterview(id: string): Promise<InterviewRound> {
  return apiRequest<InterviewRound>(`/recruitment/interviews/${id}/cancel`, { method: "POST" });
}

export function submitInterviewFeedback(id: string, input: SubmitInterviewFeedbackInput) {
  return apiRequest(`/recruitment/interviews/${id}/feedback`, { method: "POST", body: JSON.stringify(input) });
}

export function listOpenRequisitionsForReferral(): Promise<OpenRequisition[]> {
  return apiRequest<OpenRequisition[]>("/recruitment/referrals/open-requisitions");
}

export function listMyReferrals(): Promise<ReferredCandidate[]> {
  return apiRequest<ReferredCandidate[]>("/recruitment/referrals/mine");
}

export function submitReferral(input: SubmitReferralInput) {
  return apiRequest("/recruitment/referrals", { method: "POST", body: JSON.stringify(input) });
}

export function listInternalOpenings(): Promise<InternalOpening[]> {
  return apiRequest<InternalOpening[]>("/recruitment/internal-mobility/openings");
}

export function listMyInternalApplications(): Promise<InternalMobilityCandidate[]> {
  return apiRequest<InternalMobilityCandidate[]>("/recruitment/internal-mobility/mine");
}

export function applyInternally(input: SubmitInternalApplicationInput) {
  return apiRequest("/recruitment/internal-mobility", { method: "POST", body: JSON.stringify(input) });
}
