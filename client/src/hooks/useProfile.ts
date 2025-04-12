import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";

export const useProfile = () => {
  const queryClient = useQueryClient();

  // Get user profile
  const useUserProfile = (userId: number) => {
    return useQuery({
      queryKey: ["userProfile", userId],
      queryFn: () => profileApi.getUserProfile(userId),
      enabled: !!userId, // Only run if userId is provided
    });
  };

  // Update profile mutation
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: ({ userId, data }: { userId: number; data: any }) =>
        profileApi.updateProfile(userId, data),
      onSuccess: (_, variables) => {
        // Invalidate affected queries
        queryClient.invalidateQueries({
          queryKey: ["userProfile", variables.userId],
        });

        // If username was updated, refresh the user auth data too
        if (variables.data.username) {
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
      },
    });
  };

  return {
    useUserProfile,
    useUpdateProfile,
  };
};
