import { create } from "zustand";
import { User, authApi, LoginCredentials, RegisterData } from "../api/authApi";

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
    authApi.logout();
    set({ user: null });
  },

  clearError: () => set({ error: null }),

  setUser: (user) => set({ user }),
}));
