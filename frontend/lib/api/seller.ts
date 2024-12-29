import api from './axios-config';

export interface SellerApplication {
  businessName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstNumber: string;
  aadhaarNumber: string;
  panNumber: string;
}

export const sellerApi = {
  submitApplication: async (data: SellerApplication) => {
    const response = await api.post('/seller/apply', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/seller/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<SellerApplication>) => {
    const response = await api.patch('/seller/profile', data);
    return response.data;
  },
};