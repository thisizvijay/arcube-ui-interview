import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from './api-client';

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login({ email, password }),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // The auth context will handle storing the token and user data
        // This is just for API call management
      }
    },
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 