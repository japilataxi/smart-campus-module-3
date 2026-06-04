export type UserRole = "student" | "librarian" | "admin";

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
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
  accessToken?: string;
  token?: string;
  user?: User;
}

export interface Book {
  id: string;
  title: string;
  isbn?: string;
  description?: string;
  availableCopies?: number;
  totalCopies?: number;
  author?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface Loan {
  id: string;
  book?: Book;
  userId?: string;
  status?: string;
  loanDate?: string;
  returnDate?: string;
}