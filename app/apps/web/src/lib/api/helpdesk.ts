import { apiRequest } from "./http";
import type {
  AddCommentInput,
  CloseTicketInput,
  CreateKnowledgeArticleInput,
  CreateSlaPolicyInput,
  CreateTicketInput,
  GrievanceCase,
  KnowledgeArticle,
  SlaPolicy,
  SubmitGrievanceCaseInput,
  Ticket,
  TicketComment,
  TicketWithComments,
} from "./types";

export function createTicket(input: CreateTicketInput): Promise<Ticket> {
  return apiRequest<Ticket>("/helpdesk/tickets", { method: "POST", body: JSON.stringify(input) });
}

export function listMyTickets(): Promise<Ticket[]> {
  return apiRequest<Ticket[]>("/helpdesk/tickets/my");
}

export function listAllTickets(queue?: string, status?: string): Promise<Ticket[]> {
  const params = new URLSearchParams();
  if (queue) params.set("queue", queue);
  if (status) params.set("status", status);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<Ticket[]>(`/helpdesk/tickets/all${query}`);
}

export function getTicket(id: string): Promise<TicketWithComments> {
  return apiRequest<TicketWithComments>(`/helpdesk/tickets/${id}`);
}

export function addTicketComment(id: string, input: AddCommentInput): Promise<TicketComment> {
  return apiRequest<TicketComment>(`/helpdesk/tickets/${id}/comments`, { method: "POST", body: JSON.stringify(input) });
}

export function assignTicket(id: string, agentEmployeeId: string): Promise<Ticket> {
  return apiRequest<Ticket>(`/helpdesk/tickets/${id}/assign`, {
    method: "POST",
    body: JSON.stringify({ agentEmployeeId }),
  });
}

export function startTicketProgress(id: string): Promise<Ticket> {
  return apiRequest<Ticket>(`/helpdesk/tickets/${id}/start-progress`, { method: "POST" });
}

export function resolveTicket(id: string): Promise<Ticket> {
  return apiRequest<Ticket>(`/helpdesk/tickets/${id}/resolve`, { method: "POST" });
}

export function closeTicket(id: string, input: CloseTicketInput): Promise<Ticket> {
  return apiRequest<Ticket>(`/helpdesk/tickets/${id}/close`, { method: "POST", body: JSON.stringify(input) });
}

export function reopenTicket(id: string): Promise<Ticket> {
  return apiRequest<Ticket>(`/helpdesk/tickets/${id}/reopen`, { method: "POST" });
}

export function runEscalationSweepNow(): Promise<void> {
  return apiRequest<void>("/helpdesk/tickets/escalation-sweep/run-now", { method: "POST" });
}

export function upsertSlaPolicy(input: CreateSlaPolicyInput): Promise<SlaPolicy> {
  return apiRequest<SlaPolicy>("/helpdesk/sla-policies", { method: "POST", body: JSON.stringify(input) });
}

export function listSlaPolicies(): Promise<SlaPolicy[]> {
  return apiRequest<SlaPolicy[]>("/helpdesk/sla-policies");
}

export function createKnowledgeArticle(input: CreateKnowledgeArticleInput): Promise<KnowledgeArticle> {
  return apiRequest<KnowledgeArticle>("/helpdesk/knowledge-articles", { method: "POST", body: JSON.stringify(input) });
}

export function listPublishedKnowledgeArticles(queue?: string): Promise<KnowledgeArticle[]> {
  const query = queue ? `?queue=${encodeURIComponent(queue)}` : "";
  return apiRequest<KnowledgeArticle[]>(`/helpdesk/knowledge-articles${query}`);
}

export function listAllKnowledgeArticlesAdmin(): Promise<KnowledgeArticle[]> {
  return apiRequest<KnowledgeArticle[]>("/helpdesk/knowledge-articles/admin");
}

export function submitGrievanceCase(input: SubmitGrievanceCaseInput): Promise<GrievanceCase> {
  return apiRequest<GrievanceCase>("/helpdesk/grievance-cases", { method: "POST", body: JSON.stringify(input) });
}

export function listMyGrievanceCases(): Promise<GrievanceCase[]> {
  return apiRequest<GrievanceCase[]>("/helpdesk/grievance-cases/my");
}

export function listAllGrievanceCases(): Promise<GrievanceCase[]> {
  return apiRequest<GrievanceCase[]>("/helpdesk/grievance-cases/all");
}

export function assignGrievanceHandler(id: string, handlerEmployeeId: string): Promise<GrievanceCase> {
  return apiRequest<GrievanceCase>(`/helpdesk/grievance-cases/${id}/assign-handler`, {
    method: "POST",
    body: JSON.stringify({ handlerEmployeeId }),
  });
}

export function resolveGrievanceCase(id: string, resolutionSummary: string): Promise<GrievanceCase> {
  return apiRequest<GrievanceCase>(`/helpdesk/grievance-cases/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ resolutionSummary }),
  });
}

export function closeGrievanceCase(id: string): Promise<GrievanceCase> {
  return apiRequest<GrievanceCase>(`/helpdesk/grievance-cases/${id}/close`, { method: "POST" });
}
