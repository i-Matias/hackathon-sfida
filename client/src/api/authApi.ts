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
    const { email, password } = credentials;
    const response = await axios.post("/login", { email, password });
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await axios.post("/signup", {
      email: userData.email,
      password: userData.password,
      roleId: userData.roleId,
      userName: userData.userName,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
  },
};
