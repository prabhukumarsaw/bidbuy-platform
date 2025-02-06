
import { User, Bid, Notification, InboxMessage, Pagination } from '@/types/types';
import api from './axios-config';
export const userApi = {
  // Profile Management
  getProfile: async () => {
    const { data } = await api.get<{ data: User }>('/user/profile');
    return data.data;
  },
  updateProfile: async (formData: FormData) => {
    const { data } = await api.patch<{ data: User }>('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  // Bids
  getUserBids: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get<{ data: Bid[]; pagination: Pagination }>('/user/bids', {
      params,
    });
    console.log(data)
    return data;
  },
  // Notifications
  getNotifications: async (params?: { page?: number; limit?: number; read?: boolean }) => {
    const { data } = await api.get<{ data: Notification[]; unreadCount: number; pagination: Pagination }>(
      '/user/notifications',
      { params }
    );
    return data;
  },
  
  
  markNotificationAsRead: async (notificationId: string) => {
    const { data } = await api.patch<{ data: Notification }>(
      `/user/notifications/${notificationId}/read`
    );
    return data;
  },
  
  // Inbox Messages
  getInboxMessages: async (params?: { page?: number; limit?: number; read?: boolean }) => {
    const { data } = await api.get<{ data: InboxMessage[]; pagination: Pagination }>(
      '/user/inbox',
      { params }
    );
    return data;
  },

  markMessageAsRead: async (messageId: string) => {
    const { data } = await api.patch<{ data: InboxMessage }>(
      `/user/inbox/${messageId}/read`
    );
    return data;
  },
};