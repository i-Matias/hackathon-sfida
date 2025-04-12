import axios from "./axios";

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  userId: number;
  user?: {
    username: string;
  };
}

export interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  description: string;
  userId: number;
}

export const productApi = {
  getAllProducts: async (name?: string) => {
    const params = name ? { name } : {};
    const response = await axios.get("/products", { params });
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  },

  getUserProducts: async (userId: number) => {
    const response = await axios.get("/products/user", { params: { userId } });
    return response.data;
  },

  createProduct: async (productData: ProductFormData) => {
    const response = await axios.post("/products", productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: Partial<ProductFormData>) => {
    const response = await axios.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await axios.delete(`/products/${id}`);
    return response.data;
  },
};
