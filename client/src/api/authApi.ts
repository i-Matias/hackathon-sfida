import axios from "./axios";

export interface LoginCredentials {
  email: string;
  password: string;
  roleId: number;
}

export interface RegisterData {
  userName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
  role?: {
    name: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post("/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await axios.post("/signup", userData);
    return response.data;
  },

  // This is a client-side function as the server doesn't need a logout endpoint
  logout: () => {
    localStorage.removeItem("authToken");
  },
};
