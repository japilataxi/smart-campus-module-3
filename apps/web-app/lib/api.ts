import { LoginRequest, RegisterRequest } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("smart_campus_token");
}

export function setToken(token: string) {
  localStorage.setItem("smart_campus_token", token);
}

export function removeToken() {
  localStorage.removeItem("smart_campus_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

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
};