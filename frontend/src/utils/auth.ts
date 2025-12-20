import type { User } from "@/types";

export const getStoredAuth = () => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    try {
      return {
        token: storedToken,
        user: JSON.parse(storedUser) as User,
      };
    } catch {
      return { token: null, user: null };
    }
  }
  return { token: null, user: null };
};
