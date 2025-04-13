import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi, ProductFormData } from "../api/productApi";

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Get all products
  const useAllProducts = (searchTerm?: string) => {
    return useQuery({
      queryKey: ["products", searchTerm],
      queryFn: () => productApi.getAllProducts(searchTerm),
    });
  };

  // Get user products
  const useUserProducts = (userId: number) => {
    return useQuery({
      queryKey: ["userProducts", userId],
      queryFn: () => productApi.getUserProducts(userId),
      enabled: !!userId, // Only run if userId is provided
    });
  };

  // Get single product
  const useProduct = (id: number) => {
    return useQuery({
      queryKey: ["product", id],
      queryFn: () => productApi.getProductById(id),
      enabled: !!id, // Only run if id is provided
    });
  };

  const useCreateProduct = () => {
    return useMutation({
      mutationFn: (data: ProductFormData) => productApi.createProduct(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["userProducts"] });
      },
    });
  };

  const useUpdateProduct = () => {
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: number;
        data: Partial<ProductFormData>;
      }) => productApi.updateProduct(id, data),
      onSuccess: (_, variables) => {
        // Invalidate affected queries
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["userProducts"] });
        queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      },
    });
  };

  const useDeleteProduct = () => {
    return useMutation({
      mutationFn: (id: number) => productApi.deleteProduct(id),
      onSuccess: () => {
        // Invalidate affected queries
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["userProducts"] });
      },
    });
  };

  return {
    useAllProducts,
    useUserProducts,
    useProduct,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
  };
};
