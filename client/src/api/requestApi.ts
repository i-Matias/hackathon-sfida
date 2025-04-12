import axios from "./axios";

export interface ProductRequest {
  id: number;
  customerId: number;
  productId: number;
  quantity: number;
  status: string;
  requestedAt: string;
  product?: {
    name: string;
    user: {
      username: string;
    };
  };
  customer?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface RequestFormData {
  customerId: number;
  productId: number;
  quantity: number;
  status: string;
}

export const requestApi = {
  getUserRequests: async (customerId: number) => {
    const response = await axios.get("/requests", { params: { customerId } });
    return response.data;
  },

  getFarmerRequests: async (farmerId: number) => {
    const response = await axios.get("/requests/farmer");
    return response.data;
  },

  createRequest: async (requestData: RequestFormData) => {
    // Only send the data that the server expects
    const payload = {
      productId: requestData.productId,
      quantity: requestData.quantity,
    };
    const response = await axios.post("/requests", payload);
    return response.data;
  },

  updateRequestStatus: async (id: number, status: string) => {
    const response = await axios.put(`/requests/${id}`, { status });
    return response.data;
  },
};
