import { LoginRequest, RegisterRequest } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("smart_campus_access_token");
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("smart_campus_refresh_token");
}

export function setSession(data: {
  accessToken: string;
  refreshToken?: string;
  user?: unknown;
  roles?: string[];
}) {
  localStorage.setItem("smart_campus_access_token", data.accessToken);

  if (data.refreshToken) {
    localStorage.setItem("smart_campus_refresh_token", data.refreshToken);
  }

  if (data.user) {
    localStorage.setItem("smart_campus_user", JSON.stringify(data.user));
  }

  if (data.roles) {
    localStorage.setItem("smart_campus_roles", JSON.stringify(data.roles));
  }
}

export function removeSession() {
  localStorage.removeItem("smart_campus_access_token");
  localStorage.removeItem("smart_campus_refresh_token");
  localStorage.removeItem("smart_campus_user");
  localStorage.removeItem("smart_campus_roles");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(message || "Request failed");
    error.name = String(response.status);
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export type CreateQrAccessRequest = {
  userId: string;
  expirationDate: string;
  accessType: string;
  location: string;
};

export type ValidateQrAccessRequest = {
  qrCode: string;
};



export type CreateTransportRouteRequest = {
  name: string;
  description?: string;
  origin: string;
  destination: string;
  status?: string;
};

export type CreateTransportStopRequest = {
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  routeId?: string;
};

export type CreateTransportVehicleRequest = {
  code: string;
  plate: string;
  capacity: number;
  status?: string;
  currentRouteId?: string;
};

export type CreateTransportScheduleRequest = {
  routeId: string;
  vehicleId?: string;
  departureTime: string;
  arrivalTime: string;
  status?: string;
};


export type CreateSpaceRequest = {
  name: string;
  type: string;
  location: string;
  capacity: number;
  status?: string;
  availabilityStatus?: string;
  openingTime: string;
  closingTime: string;
};

export type UpdateSpaceAvailabilityRequest = {
  availabilityStatus: string;
};

export type TriggerWorkflowRequest = {
  workflowName: string;
  sourceService: string;
  eventType: string;
  requestPayload: Record<string, unknown>;
  triggeredByUserId?: string;
  idempotencyKey?: string;
};

export type CreateAnnouncementRequest = {
  title: string;
  content: string;
  category: string;
  priority: string;
  targetAudience: string;
  createdByUserId: string;

};

export type UpdateAnnouncementRequest =
  Partial<CreateAnnouncementRequest>;

export const api = {
  login: (data: LoginRequest) =>
    request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  profile: () => request<any>("/auth/profile"),

  getBooks: () => request<any[]>("/library/books"),

  getBookById: async (id: string) => {
    const books = await request<any[]>("/library/books");
    return books.find((book) => String(book.id) === String(id));
  },

  getLoans: () => request<any[]>("/library/loans"),

  // NUEVO
  getLoanById: (id: string) =>
    request<any>(`/library/loans/${id}`),

  // NUEVO
  returnLoan: (id: string) =>
    request<any>(`/library/loans/${id}/return`, {
      method: "PATCH",
    }),

  getAuthors: () => request<any[]>("/library/authors"),

  getCategories: () => request<any[]>("/library/categories"),

  getUsers: () => request<any[]>("/auth/users"),

  getIncidents: () => request<any[]>("/incidents"),

  updateUserRoles: (userId: string, roles: string[]) =>
    request<any>(`/auth/users/${userId}/roles`, {
      method: "PATCH",
      body: JSON.stringify({ roles }),
    }),

  createAuthor: (data: { name: string; biography?: string }) =>
    request<any>("/library/authors", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createCategory: (data: { name: string }) =>
    request<any>("/library/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createBook: (data: {
    title: string;
    isbn: string;
    totalCopies: number;
    authorId: string;
    categoryId: string;
  }) =>
    request<any>("/library/books", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createLoan: (data: { userEmail: string; bookId: string }) =>
    request<any>("/library/loans", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createIncident: (data: {
    title: string;
    description: string;
    location: string;
  }) =>
    request<any>("/incidents", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateIncident: (id: string | number, data: any) =>
    request<any>(`/incidents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteIncident: (id: string | number) =>
    request<any>(`/incidents/${id}`, {
      method: "DELETE",
    }),

  getQrAccessCodes: () => request<any[]>("/qr-access"),

  createQrAccessCode: (data: CreateQrAccessRequest) =>
    request<any>("/qr-access", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  validateQrAccessCode: (data: ValidateQrAccessRequest) =>
    request<any>("/qr-access/validate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  revokeQrAccessCode: (id: string) =>
    request<any>(`/qr-access/${id}/revoke`, {
      method: "PATCH",
    }),

  getQrAccessLogs: () => request<any[]>("/qr-access/logs"),

  getTransportRoutes: () => request<any[]>("/transport/routes"),

  getTransportRouteById: (id: string) => request<any>(`/transport/routes/${id}`),

  createTransportRoute: (data: CreateTransportRouteRequest) =>
    request<any>("/transport/routes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTransportRoute: (id: string, data: Partial<CreateTransportRouteRequest>) =>
    request<any>(`/transport/routes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getTransportRouteAvailability: (id: string) =>
    request<any>(`/transport/routes/${id}/availability`),

  getTransportStops: (routeId?: string) =>
    request<any[]>(`/transport/stops${routeId ? `?routeId=${routeId}` : ""}`),

  createTransportStop: (data: CreateTransportStopRequest) =>
    request<any>("/transport/stops", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getTransportVehicles: () => request<any[]>("/transport/vehicles"),

  createTransportVehicle: (data: CreateTransportVehicleRequest) =>
    request<any>("/transport/vehicles", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getTransportSchedules: (routeId?: string) =>
    request<any[]>(`/transport/schedules${routeId ? `?routeId=${routeId}` : ""}`),

  createTransportSchedule: (data: CreateTransportScheduleRequest) =>
    request<any>("/transport/schedules", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getSpaces: (filters?: { type?: string; availabilityStatus?: string; location?: string }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.set("type", filters.type);
    if (filters?.availabilityStatus) params.set("availabilityStatus", filters.availabilityStatus);
    if (filters?.location) params.set("location", filters.location);
    const query = params.toString() ? `?${params.toString()}` : "";
    return request<any[]>(`/space-availability/spaces${query}`);
  },

  getSpaceById: (id: string) => request<any>(`/space-availability/spaces/${id}`),

  createSpace: (data: CreateSpaceRequest) =>
    request<any>("/space-availability/spaces", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSpace: (id: string, data: Partial<CreateSpaceRequest>) =>
    request<any>(`/space-availability/spaces/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteSpace: (id: string) =>
    request<any>(`/space-availability/spaces/${id}`, {
      method: "DELETE",
    }),

  deactivateSpace: (id: string) =>
    request<any>(`/space-availability/spaces/${id}/deactivate`, {
      method: "PATCH",
    }),

  updateSpaceAvailability: (id: string, data: UpdateSpaceAvailabilityRequest) =>
    request<any>(`/space-availability/spaces/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getAvailableSpaces: () => request<any[]>("/space-availability/availability"),

  getSpacesByType: (type: string) => request<any[]>(`/space-availability/spaces/type/${type}`),

  getSpacesByLocation: (location: string) =>
    request<any[]>(`/space-availability/spaces/location/${encodeURIComponent(location)}`),

  checkSpaceAvailability: (id: string) =>
    request<any>(`/space-availability/spaces/${id}/check-availability`),

getWorkflowExecutions: (limit = 50) =>
    request<any[]>(`/workflows/executions?limit=${limit}`),

  getWorkflowExecutionById: (id: string) =>
    request<any>(`/workflows/executions/${id}`),

  triggerWorkflow: (data: TriggerWorkflowRequest) =>
    request<any>("/workflows/trigger", {
      method: "POST",
      body: JSON.stringify(data),
    }),

// ==========================
  // ANNOUNCEMENTS
  // ==========================

  getAnnouncements: () =>
    request<any>("/announcements"),

  getAnnouncementById: (id: string) =>
    request<any>(`/announcements/${id}`),

  createAnnouncement: (data: CreateAnnouncementRequest) =>
    request<any>("/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateAnnouncement: (id: string, data: UpdateAnnouncementRequest) =>
    request<any>(`/announcements/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  publishAnnouncement: (id: string) =>
    request<any>(`/announcements/${id}/publish`, {
      method: "PATCH",
    }),

  deleteAnnouncement: (id: string) =>
    request<any>(`/announcements/${id}`, {
      method: "DELETE",
    }),

};


