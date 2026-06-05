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
    throw new Error(message || "Request failed");
  }

  return response.json();
}

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

  getAuthors: () => request<any[]>("/library/authors"),

  getCategories: () => request<any[]>("/library/categories"),

  getUsers: () => request<any[]>("/auth/users"),

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
};