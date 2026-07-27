import { apiRequest } from "./http";

export interface MfaFactor {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  verifiedAt: string | null;
}

export interface MfaEnrollment {
  factorId: string;
  secret: string;
  otpauthUri: string;
}

export function enrollMfa(): Promise<MfaEnrollment> {
  return apiRequest("/auth/mfa/enroll", { method: "POST" });
}

export function confirmMfaEnrollment(code: string): Promise<MfaFactor> {
  return apiRequest("/auth/mfa/confirm", { method: "POST", body: JSON.stringify({ code }) });
}

export function listMfaFactors(): Promise<MfaFactor[]> {
  return apiRequest("/auth/mfa/factors");
}

export function revokeMfaFactor(id: string) {
  return apiRequest(`/auth/mfa/factors/${id}`, { method: "DELETE" });
}

export interface UserSession {
  id: string;
  issuedAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export function listSessions(): Promise<UserSession[]> {
  return apiRequest("/auth/sessions");
}

export function revokeSession(id: string) {
  return apiRequest(`/auth/sessions/${id}/revoke`, { method: "POST" });
}

export interface DelegationUserRef {
  id: string;
  email: string;
}

export interface Delegation {
  id: string;
  scope: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  delegate?: DelegationUserRef;
  delegator?: DelegationUserRef;
}

export interface DelegationsMine {
  given: Delegation[];
  received: Delegation[];
}

export interface CreateDelegationInput {
  delegateUserId: string;
  scope: string;
  startDate: string;
  endDate: string;
}

export function listMyDelegations(): Promise<DelegationsMine> {
  return apiRequest("/access/delegations/mine");
}

export function createDelegation(input: CreateDelegationInput) {
  return apiRequest("/access/delegations", { method: "POST", body: JSON.stringify(input) });
}

export function revokeDelegation(id: string) {
  return apiRequest(`/access/delegations/${id}/revoke`, { method: "POST" });
}

export function proxyLogin(userId: string) {
  return apiRequest(`/auth/proxy-login/${userId}`, { method: "POST" });
}

export function proxyLoginByEmployee(employeeId: string) {
  return apiRequest(`/auth/proxy-login/employee/${employeeId}`, { method: "POST" });
}

// W0·E29 Security and Governance
export interface AuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  before: unknown;
  after: unknown;
  createdAt: string;
  actor: { email: string };
}

export function listAuditLogs(): Promise<AuditLogEntry[]> {
  return apiRequest("/audit-logs");
}

export interface AccessReviewItem {
  id: string;
  userId: string;
  rolesSnapshot: string[];
  decision: "Pending" | "Confirmed" | "Revoked";
  reviewedAt: string | null;
  notes: string | null;
  user: { id: string; email: string; status: string };
}

export interface AccessReviewCycle {
  id: string;
  periodLabel: string;
  status: "Open" | "Closed";
  createdAt: string;
  closedAt: string | null;
  _count?: { items: number };
  items?: AccessReviewItem[];
}

export function listAccessReviewCycles(): Promise<AccessReviewCycle[]> {
  return apiRequest("/security/access-reviews");
}

export function getAccessReviewCycle(id: string): Promise<AccessReviewCycle> {
  return apiRequest(`/security/access-reviews/${id}`);
}

export function startAccessReviewCycle(periodLabel: string): Promise<AccessReviewCycle> {
  return apiRequest("/security/access-reviews", { method: "POST", body: JSON.stringify({ periodLabel }) });
}

export function closeAccessReviewCycle(id: string): Promise<AccessReviewCycle> {
  return apiRequest(`/security/access-reviews/${id}/close`, { method: "POST" });
}

export function confirmAccessReviewItem(itemId: string): Promise<AccessReviewItem> {
  return apiRequest(`/security/access-reviews/items/${itemId}/confirm`, { method: "POST" });
}

export function revokeAccessReviewItem(itemId: string, notes?: string): Promise<AccessReviewItem> {
  return apiRequest(`/security/access-reviews/items/${itemId}/revoke`, { method: "POST", body: JSON.stringify({ notes }) });
}
