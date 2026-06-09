import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.100.11:3000/api";

export async function getToken() {
  return AsyncStorage.getItem("smart_campus_token");
}

export async function setToken(token: string) {
  await AsyncStorage.setItem("smart_campus_token", token);
}

export async function removeToken() {
  await AsyncStorage.removeItem("smart_campus_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export const api = {
  login: (data: { email: string; password: string }) =>
    request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) =>
    request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  profile: () => request<any>("/auth/profile"),

  getBooks: () => request<any[]>("/library/books"),

  getLoans: () => request<any[]>("/library/loans"),

  createLoan: (data: { userEmail: string; bookId: string }) =>
    request<any>("/library/loans", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};