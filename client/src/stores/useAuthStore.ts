import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  role: "fermer" | "konsumator" | null;
  email: string | null;
  login: (role: "fermer" | "konsumator", email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  email: null,
  login: (role, email) => set({ isAuthenticated: true, role, email }),
  logout: () => set({ isAuthenticated: false, role: null, email: null }),
}));
