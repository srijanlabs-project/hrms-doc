import { apiRequest } from "./http";

export interface AiAnswer {
  reply: string;
  suggestions: string[];
}

export function askRidz(message: string): Promise<AiAnswer> {
  return apiRequest<AiAnswer>("/ai/ask", { method: "POST", body: JSON.stringify({ message }) });
}
