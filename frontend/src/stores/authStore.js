import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Set auth (login)
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Clear auth (logout)
      clearAuth: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Update user info
      updateUser: (userData) => set({ user: userData }),

      // Set loading state
      setLoading: (loading) => set({ isLoading: loading }),

      // Get dashboard route based on role
      getDashboardRoute: () => {
        const { user } = get();
        if (!user) return "/login";

        switch (user.role) {
          case "admin":
            return "/admin/dashboard";
          case "guru":
            return "/guru/dashboard";
          case "kepsek":
            return "/kepsek/dashboard";
          default:
            return "/dashboard";
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
