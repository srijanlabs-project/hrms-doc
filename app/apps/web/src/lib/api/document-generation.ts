import { apiRequest } from "./http";
import type { StoredFileRef } from "./types";

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  bodyTemplate: string;
}

export interface CreateTemplateInput {
  name: string;
  category: string;
  bodyTemplate: string;
}

export interface GeneratedDocument {
  id: string;
  createdAt: string;
  template: { name: string; category: string };
  file: StoredFileRef;
}

export function listTemplates(): Promise<DocumentTemplate[]> {
  return apiRequest<DocumentTemplate[]>("/document-templates");
}

export function createTemplate(input: CreateTemplateInput) {
  return apiRequest("/document-templates", { method: "POST", body: JSON.stringify(input) });
}

export function listGeneratedDocuments(employeeId: string): Promise<GeneratedDocument[]> {
  return apiRequest<GeneratedDocument[]>(`/people/employees/${employeeId}/generated-documents`);
}

export function generateDocument(employeeId: string, templateId: string) {
  return apiRequest(`/people/employees/${employeeId}/generated-documents`, {
    method: "POST",
    body: JSON.stringify({ templateId }),
  });
}
