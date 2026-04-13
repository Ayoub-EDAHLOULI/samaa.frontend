import apiClient from "@/lib/axios";
import {
  AdminUser,
  UsersListData,
  CreateUserDto,
  UpdateUserDto,
} from "@/types/users.types";

// Unwrap the standard { success, data, message } envelope
function unwrap<T>(responseData: {
  success: boolean;
  data: T | null;
  message?: string;
}): T {
  if (!responseData.success || responseData.data == null) {
    throw new Error(responseData.message || "Request failed");
  }
  return responseData.data;
}

export const userService = {
  // GET /users?page=&limit=&search=
  getAll: async (
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<UsersListData> => {
    const params: Record<string, string | number> = { page, limit };
    if (search?.trim()) params.search = search.trim();
    const response = await apiClient.get("/users", { params });
    return unwrap<UsersListData>(response.data);
  },

  // GET /users/:id
  getById: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.get(`/users/${id}`);
    return unwrap<AdminUser>(response.data);
  },

  // POST /users
  create: async (data: CreateUserDto): Promise<AdminUser> => {
    const response = await apiClient.post("/users", data);
    return unwrap<AdminUser>(response.data);
  },

  // PUT /users/:id
  update: async (id: string, data: UpdateUserDto): Promise<AdminUser> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return unwrap<AdminUser>(response.data);
  },

  // DELETE /users/:id
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/users/${id}`);
    unwrap<null>(response.data);
  },
};
