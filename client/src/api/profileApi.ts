import axios from "./axios";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  roleId: number;
}

export interface ProfileUpdateData {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const profileApi = {
  getUserProfile: async (userId: number) => {
    const response = await axios.get(`/users/${userId}/profile`);
    return response.data;
  },

  updateProfile: async (userId: number, data: ProfileUpdateData) => {
    const response = await axios.put(`/users/${userId}/profile`, data);
    return response.data;
  },
};
