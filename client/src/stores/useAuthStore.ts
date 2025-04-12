import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  role: string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      login: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
          role: userData.role,
        }),
      logout: () => set({ user: null, isAuthenticated: false, role: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
