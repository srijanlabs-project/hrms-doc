import { apiRequest } from "./http";
import type { CreateBookingInput, CreateResourceInput, CreateVisitorInput, Visitor, WorkplaceBooking, WorkplaceResource } from "./types";

// Visitors
export function createVisitor(input: CreateVisitorInput): Promise<Visitor> {
  return apiRequest<Visitor>("/workplace/visitors", { method: "POST", body: JSON.stringify(input) });
}

export function listMyVisitors(): Promise<Visitor[]> {
  return apiRequest<Visitor[]>("/workplace/visitors/mine");
}

export function listAllVisitors(status?: string): Promise<Visitor[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<Visitor[]>(`/workplace/visitors${query}`);
}

export function approveVisitor(id: string): Promise<Visitor> {
  return apiRequest<Visitor>(`/workplace/visitors/${id}/approve`, { method: "POST" });
}

export function cancelVisitor(id: string): Promise<Visitor> {
  return apiRequest<Visitor>(`/workplace/visitors/${id}/cancel`, { method: "POST" });
}

export function checkInVisitor(id: string): Promise<Visitor> {
  return apiRequest<Visitor>(`/workplace/visitors/${id}/check-in`, { method: "POST" });
}

export function checkOutVisitor(id: string): Promise<Visitor> {
  return apiRequest<Visitor>(`/workplace/visitors/${id}/check-out`, { method: "POST" });
}

// Resources
export function listActiveResources(): Promise<WorkplaceResource[]> {
  return apiRequest<WorkplaceResource[]>("/workplace/resources");
}

export function listAllResources(): Promise<WorkplaceResource[]> {
  return apiRequest<WorkplaceResource[]>("/workplace/resources/all");
}

export function createResource(input: CreateResourceInput): Promise<WorkplaceResource> {
  return apiRequest<WorkplaceResource>("/workplace/resources", { method: "POST", body: JSON.stringify(input) });
}

export function deactivateResource(id: string): Promise<WorkplaceResource> {
  return apiRequest<WorkplaceResource>(`/workplace/resources/${id}/deactivate`, { method: "POST" });
}

export function activateResource(id: string): Promise<WorkplaceResource> {
  return apiRequest<WorkplaceResource>(`/workplace/resources/${id}/activate`, { method: "POST" });
}

// Bookings
export function createBooking(input: CreateBookingInput): Promise<WorkplaceBooking> {
  return apiRequest<WorkplaceBooking>("/workplace/bookings", { method: "POST", body: JSON.stringify(input) });
}

export function listMyBookings(): Promise<WorkplaceBooking[]> {
  return apiRequest<WorkplaceBooking[]>("/workplace/bookings/mine");
}

export function listAllBookings(): Promise<WorkplaceBooking[]> {
  return apiRequest<WorkplaceBooking[]>("/workplace/bookings");
}

export function cancelBooking(id: string): Promise<WorkplaceBooking> {
  return apiRequest<WorkplaceBooking>(`/workplace/bookings/${id}/cancel`, { method: "POST" });
}
