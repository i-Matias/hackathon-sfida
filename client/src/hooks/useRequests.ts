import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requestApi, RequestFormData } from "../api/requestApi";

export const useRequests = () => {
  const queryClient = useQueryClient();

  // Get user requests
  const useUserRequests = (customerId: number) => {
    return useQuery({
      queryKey: ["userRequests", customerId],
      queryFn: () => requestApi.getUserRequests(customerId),
      enabled: !!customerId, // Only run if customerId is provided
    });
  };

  // Get farmer requests
  const useFarmerRequests = (farmerId: number) => {
    return useQuery({
      queryKey: ["farmerRequests", farmerId],
      queryFn: () => requestApi.getFarmerRequests(farmerId),
      enabled: !!farmerId, // Only run if farmerId is provided
    });
  };

  // Create request mutation
  const useCreateRequest = () => {
    return useMutation({
      mutationFn: (requestData: RequestFormData) =>
        requestApi.createRequest(requestData),
      onSuccess: () => {
        // Invalidate user requests query
        queryClient.invalidateQueries({ queryKey: ["userRequests"] });
        queryClient.invalidateQueries({ queryKey: ["farmerRequests"] });
      },
    });
  };

  // Update request status mutation
  const useUpdateRequestStatus = () => {
    return useMutation({
      mutationFn: ({ id, status }: { id: number; status: string }) =>
        requestApi.updateRequestStatus(id, status),
      onSuccess: () => {
        // Invalidate user requests query
        queryClient.invalidateQueries({ queryKey: ["userRequests"] });
        queryClient.invalidateQueries({ queryKey: ["farmerRequests"] });
      },
    });
  };

  return {
    useUserRequests,
    useFarmerRequests,
    useCreateRequest,
    useUpdateRequestStatus,
  };
};
