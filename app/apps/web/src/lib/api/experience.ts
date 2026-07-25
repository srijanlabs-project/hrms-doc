import { apiRequest } from "./http";
import type {
  CreateSurveyInput,
  GiveRecognitionInput,
  Recognition,
  SubmitSurveyResponseInput,
  Survey,
  SurveyResults,
  SurveyWithResponseFlag,
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
