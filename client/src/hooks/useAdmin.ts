import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";

export function useAdmin() {
  const queryClient = useQueryClient();

  // Users
  const useUsers = () =>
    useQuery({
      queryKey: ["admin", "users"],
      queryFn: adminApi.getAllUsers,
    });

  const useDeleteUser = () =>
    useMutation({
      mutationFn: adminApi.deleteUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      },
    });

  // Products
  const useAdminProducts = () =>
    useQuery({
      queryKey: ["admin", "products"],
      queryFn: adminApi.getAllProducts,
    });

  const useDeleteProductAdmin = () =>
    useMutation({
      mutationFn: adminApi.deleteProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      },
    });

  // Requests
  const useAdminRequests = () =>
    useQuery({
      queryKey: ["admin", "requests"],
      queryFn: adminApi.getAllRequests,
    });

  const useUpdateRequestStatusAdmin = () =>
    useMutation({
      mutationFn: adminApi.updateRequestStatus,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      },
    });

  // Dashboard statistics
  const useAdminStats = () =>
    useQuery({
      queryKey: ["admin", "stats"],
      queryFn: adminApi.getDashboardStats,
    });

  return {
    useUsers,
    useDeleteUser,
    useAdminProducts,
    useDeleteProductAdmin,
    useAdminRequests,
    useUpdateRequestStatusAdmin,
    useAdminStats,
  };
}
