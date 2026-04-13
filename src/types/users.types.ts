// Matches backend Prisma Role enum
export type UserRole = "ADMIN" | "USER";

// Matches backend UserResponse + _count from getAllUsers / getUserById
export interface AdminUser {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    recognitions: number;
    favorites: number;
  };
}

// Shape of the paginated list returned by GET /users
export interface UsersListData {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// POST /users body
export interface CreateUserDto {
  displayName: string;
  email: string;
  password: string;
  role?: UserRole;
  isEmailVerified?: boolean;
}

// PUT /users/:id body
export interface UpdateUserDto {
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  role?: UserRole;
  isEmailVerified?: boolean;
}
