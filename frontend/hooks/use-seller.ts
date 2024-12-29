import { useMutation, useQuery } from '@tanstack/react-query';
import { sellerApi, SellerApplication } from '@/lib/api/seller';
import { toast } from 'sonner';

export const useSellerApplication = () => {
  return useMutation({
    mutationFn: (data: SellerApplication) => sellerApi.submitApplication(data),
    onSuccess: () => {
      toast.success('Application submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });
};

export const useSellerProfile = () => {
  return useQuery({
    queryKey: ['seller-profile'],
    queryFn: () => sellerApi.getProfile(),
  });
};