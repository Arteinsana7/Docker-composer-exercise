import api from "./api";
import type { User } from "@/types";

export const userService = {
    // Update user profile
    updateProfile: async (data: { username?: string; email?: string }): Promise<User> => {
        const response = await api.put('/users/me', data);
        return response.data.data;
    },

    // Change password
    changePassword: async (data: {
        currentPassword: string;
        newPassword: string
    }): Promise<void> => {
        await api.put('/users/me/password', data);
    },
};
