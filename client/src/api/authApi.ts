import axios from "./axios";

export interface LoginCredentials {
  email: string;
  password: string;
  roleId?: number; // Make roleId optional
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
    // Only send email and password to the server
    const { email, password } = credentials;
    const response = await axios.post("/login", { email, password });
    return response.data;
  },

  register: async (userData: RegisterData) => {
    // Using the exact field names that the server expects
    const response = await axios.post("/signup", {
      email: userData.email,
      password: userData.password,
      roleId: userData.roleId,
      userName: userData.userName,
    });
    return response.data;
  },

  // This is a client-side function as the server doesn't need a logout endpoint
  logout: () => {
    localStorage.removeItem("authToken");
  },
};
