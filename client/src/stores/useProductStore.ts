import { create } from "zustand";

interface Product {
  id: number;
  name: string;
  description: string;
}

interface ProductRequest {
  id: number;
  productId: number;
  consumerEmail: string;
}

interface ProductState {
  products: Product[];
  requests: ProductRequest[];
  addProduct: (p: Omit<Product, "id">) => void;
  removeProduct: (id: number) => void;
  addRequest: (productId: number, email: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  requests: [],
  addProduct: (p) =>
    set((state) => ({
      products: [...state.products, { ...p, id: Date.now() }],
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((item) => item.id !== id),
    })),
  addRequest: (productId, email) =>
    set((state) => ({
      requests: [
        ...state.requests,
        { id: Date.now(), productId, consumerEmail: email },
      ],
    })),
}));
