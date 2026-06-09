export type UserRole = "student" | "librarian" | "admin";

export interface RoleObject {
  id?: string;
  name: UserRole | string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: UserRole[] | RoleObject[];
}

export interface NormalizedUser extends User {
  normalizedRoles: UserRole[];
  primaryRole: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface Book {
  id: string;
  title: string;
  isbn?: string;
  description?: string;
  availableCopies?: number;
  totalCopies?: number;
  author?: { id: string; name: string };
  category?: { id: string; name: string };
}

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: UserRole[] | RoleObject[];
}