import api from "./api";
import type { User } from "@/types";

export const userService = {
  updateProfile: async (data: {
    username?: string;
    email?: string;
  }): Promise<User> => {
    const response = await api.put("/users/me", data);
    return response.data.data;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.put("/users/me/password", data);
  },

  // Delete account
  deleteAccount: async (): Promise<void> => {
    await api.delete("/users/me");
  },

  // Forgot password (public)
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password (public)
  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ message: string }> => {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  },
};
