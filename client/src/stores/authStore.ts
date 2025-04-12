import { create } from "zustand";
import { User, authApi, LoginCredentials, RegisterData } from "../api/authApi";
import { QueryClient } from "@tanstack/react-query";

// Create a singleton QueryClient that can be imported where needed
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authApi.login(credentials);

      // Save token if your API returns one
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      set({
        user: response.user,
        isLoading: false,
      });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "An error occurred during login",
        isLoading: false,
      });
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authApi.register(userData);

      // Save token if your API returns one
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      set({
        user: response.user,
        isLoading: false,
      });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "An error occurred during registration",
        isLoading: false,
      });
    }
  },

  logout: () => {
    // First remove the token from localStorage
    localStorage.removeItem("authToken");

    // Clear relevant cached queries from the queryClient
    queryClient.removeQueries({ queryKey: ["userProducts"] });
    queryClient.removeQueries({ queryKey: ["userRequests"] });
    queryClient.removeQueries({ queryKey: ["farmerRequests"] });

    // Then reset the entire state to ensure no user data remains
    set({
      user: null,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  setUser: (user) => set({ user }),
}));
