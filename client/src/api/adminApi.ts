import axios from "./axios";

export interface AdminStats {
  totalUsers: number;
  totalFarmers: number;
  totalCustomers: number;
  totalProducts: number;
  pendingRequests: number;
}

export const adminApi = {
  // User management
  getAllUsers: async () => {
    const response = await axios.get("/admin/users");
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await axios.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Product management
  getAllProducts: async () => {
    const response = await axios.get("/admin/products");
    return response.data;
  },

  deleteProduct: async (productId: number) => {
    const response = await axios.delete(`/admin/products/${productId}`);
    return response.data;
  },

  // Request management
  getAllRequests: async () => {
    const response = await axios.get("/admin/requests");
    return response.data;
  },

  updateRequestStatus: async ({
    id,
    status,
  }: {
    id: number;
    status: string;
  }) => {
    const response = await axios.put(`/admin/requests/${id}`, { status });
    return response.data;
  },

  // Dashboard statistics
  getDashboardStats: async () => {
    const response = await axios.get("/admin/stats");
    return response.data;
  },
};
