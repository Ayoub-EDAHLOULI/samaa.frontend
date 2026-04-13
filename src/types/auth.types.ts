// Matches the backend Prisma Role enum strings
export type UserRole = "Admin" | "Client" | "Agent" | "Citizen";

// Shape returned by GET /auth/profile and embedded in login/register responses
export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  isEmailVerified: boolean;
}

// POST /auth/login body
export interface LoginDto {
  email: string;
  password: string;
}

// POST /auth/register body
export interface RegisterDto {
  displayName: string;
  email: string;
  password: string;
}

// Shape the authService returns after login/register
// refreshToken lives in httpOnly cookie — not exposed to JS
export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
  };
}
