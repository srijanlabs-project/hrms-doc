import { apiRequest } from "./http";
import type {
  Community,
  CreateCommunityInput,
  CreateEventInput,
  CreatePostInput,
  CreateRewardItemInput,
  CreateSurveyInput,
  CreateWellnessProgramInput,
  EventRsvp,
  ExperienceEvent,
  FeedPost,
  GiveRecognitionInput,
  Recognition,
  RewardBalance,
  RewardCatalogItem,
  RewardRedemption,
  SubmitSurveyResponseInput,
  Survey,
  SurveyResults,
  SurveyWithResponseFlag,
  WellnessProgram,
} from "./types";

export function listMySurveys(): Promise<SurveyWithResponseFlag[]> {
  return apiRequest<SurveyWithResponseFlag[]>("/experience/surveys/my");
}

export function listAllSurveysAdmin(): Promise<Survey[]> {
  return apiRequest<Survey[]>("/experience/surveys/admin");
}

export function createSurvey(input: CreateSurveyInput): Promise<Survey> {
  return apiRequest<Survey>("/experience/surveys", { method: "POST", body: JSON.stringify(input) });
}

export function publishSurvey(id: string): Promise<Survey> {
  return apiRequest<Survey>(`/experience/surveys/${id}/publish`, { method: "POST" });
}

export function closeSurvey(id: string): Promise<Survey> {
  return apiRequest<Survey>(`/experience/surveys/${id}/close`, { method: "POST" });
}

export function respondToSurvey(id: string, input: SubmitSurveyResponseInput): Promise<void> {
  return apiRequest<void>(`/experience/surveys/${id}/responses`, { method: "POST", body: JSON.stringify(input) });
}

export function getSurveyResults(id: string): Promise<SurveyResults> {
  return apiRequest<SurveyResults>(`/experience/surveys/${id}/results`);
}

export function giveRecognition(input: GiveRecognitionInput): Promise<Recognition> {
  return apiRequest<Recognition>("/experience/recognitions", { method: "POST", body: JSON.stringify(input) });
}

export function listRecognitionFeed(): Promise<Recognition[]> {
  return apiRequest<Recognition[]>("/experience/recognitions/feed");
}

export function listRecognitionsReceived(): Promise<Recognition[]> {
  return apiRequest<Recognition[]>("/experience/recognitions/received");
}

/** Wave 4 W4·E15 gap closure — rewards. */
export function listRewardCatalog(): Promise<RewardCatalogItem[]> {
  return apiRequest<RewardCatalogItem[]>("/experience/rewards/catalog");
}

export function listRewardCatalogAdmin(): Promise<RewardCatalogItem[]> {
  return apiRequest<RewardCatalogItem[]>("/experience/rewards/catalog/admin");
}

export function createRewardCatalogItem(input: CreateRewardItemInput): Promise<RewardCatalogItem> {
  return apiRequest<RewardCatalogItem>("/experience/rewards/catalog", { method: "POST", body: JSON.stringify(input) });
}

export function getMyRewardBalance(): Promise<RewardBalance> {
  return apiRequest<RewardBalance>("/experience/rewards/balance");
}

export function redeemReward(rewardItemId: string): Promise<RewardRedemption> {
  return apiRequest<RewardRedemption>(`/experience/rewards/redemptions/${rewardItemId}`, { method: "POST" });
}

export function listMyRedemptions(): Promise<RewardRedemption[]> {
  return apiRequest<RewardRedemption[]>("/experience/rewards/redemptions/mine");
}

export function listAllRedemptionsAdmin(): Promise<RewardRedemption[]> {
  return apiRequest<RewardRedemption[]>("/experience/rewards/redemptions");
}

export function fulfillRedemption(id: string): Promise<RewardRedemption> {
  return apiRequest<RewardRedemption>(`/experience/rewards/redemptions/${id}/fulfill`, { method: "POST", body: JSON.stringify({}) });
}

export function cancelRedemption(id: string): Promise<RewardRedemption> {
  return apiRequest<RewardRedemption>(`/experience/rewards/redemptions/${id}/cancel`, { method: "POST", body: JSON.stringify({}) });
}

/** Wave 4 W4·E15 gap closure — communities. */
export function listCommunities(): Promise<Community[]> {
  return apiRequest<Community[]>("/experience/communities");
}

export function createCommunity(input: CreateCommunityInput): Promise<Community> {
  return apiRequest<Community>("/experience/communities", { method: "POST", body: JSON.stringify(input) });
}

export function joinCommunity(id: string): Promise<void> {
  return apiRequest<void>(`/experience/communities/${id}/join`, { method: "POST" });
}

export function leaveCommunity(id: string): Promise<void> {
  return apiRequest<void>(`/experience/communities/${id}/leave`, { method: "POST" });
}

/** Wave 4 W4·E15 gap closure — social feed. */
export function listFeed(communityId?: string): Promise<FeedPost[]> {
  return apiRequest<FeedPost[]>(`/experience/feed${communityId ? `?communityId=${communityId}` : ""}`);
}

export function createPost(input: CreatePostInput): Promise<FeedPost> {
  return apiRequest<FeedPost>("/experience/feed", { method: "POST", body: JSON.stringify(input) });
}

export function commentOnPost(postId: string, body: string): Promise<void> {
  return apiRequest<void>(`/experience/feed/${postId}/comments`, { method: "POST", body: JSON.stringify({ body }) });
}

export function toggleLikePost(postId: string): Promise<{ liked: boolean }> {
  return apiRequest<{ liked: boolean }>(`/experience/feed/${postId}/like`, { method: "POST" });
}

/** Wave 4 W4·E15 gap closure — events. */
export function listUpcomingEvents(): Promise<ExperienceEvent[]> {
  return apiRequest<ExperienceEvent[]>("/experience/events");
}

export function listAllEventsAdmin(): Promise<ExperienceEvent[]> {
  return apiRequest<ExperienceEvent[]>("/experience/events/admin");
}

export function createEvent(input: CreateEventInput): Promise<ExperienceEvent> {
  return apiRequest<ExperienceEvent>("/experience/events", { method: "POST", body: JSON.stringify(input) });
}

export function publishEvent(id: string): Promise<ExperienceEvent> {
  return apiRequest<ExperienceEvent>(`/experience/events/${id}/publish`, { method: "POST" });
}

export function rsvpToEvent(id: string, response: EventRsvp["response"]): Promise<EventRsvp> {
  return apiRequest<EventRsvp>(`/experience/events/${id}/rsvp`, { method: "POST", body: JSON.stringify({ response }) });
}

export function getMyRsvp(id: string): Promise<EventRsvp | null> {
  return apiRequest<EventRsvp | null>(`/experience/events/${id}/rsvp/mine`);
}

/** Wave 4 W4·E15 gap closure — wellness programs. */
export function listWellnessPrograms(): Promise<WellnessProgram[]> {
  return apiRequest<WellnessProgram[]>("/experience/wellness-programs");
}

export function createWellnessProgram(input: CreateWellnessProgramInput): Promise<WellnessProgram> {
  return apiRequest<WellnessProgram>("/experience/wellness-programs", { method: "POST", body: JSON.stringify(input) });
}

export function enrollInWellnessProgram(id: string): Promise<void> {
  return apiRequest<void>(`/experience/wellness-programs/${id}/enroll`, { method: "POST" });
}
