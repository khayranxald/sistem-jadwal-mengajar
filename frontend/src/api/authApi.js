import axiosInstance from "./axios";

export const authApi = {
  // Health check
  healthCheck: () => axiosInstance.get("/health"),

  // Login
  login: (credentials) => axiosInstance.post("/auth/login", credentials),

  // Logout (current device)
  logout: () => axiosInstance.post("/auth/logout"),

  // Logout all devices
  logoutAll: () => axiosInstance.post("/auth/logout-all"),

  // Get current user info
  me: () => axiosInstance.get("/auth/me"),

  // Get user (alternative)
  getUser: () => axiosInstance.get("/user"),
};

export default authApi;
