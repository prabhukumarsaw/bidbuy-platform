'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Notification } from '@/types/types';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Skeleton } from '@/components/ui/skeleton';
import { userApi } from '@/lib/api/userApi';
import { socketService } from '@/lib/socketService';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';

// Debounce function to limit rapid API calls
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export function UserNotifications() {
  const { isAuthenticated } = useAuthStore(); // Use the auth store
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastPageRef = useRef(0);
  const router = useRouter();

  // Exponential backoff fetch function
  const fetchNotifications = async (
    page: number,
    retries = 3,
    delay = 1000
  ) => {
    if (page <= lastPageRef.current) return; // Prevent duplicate fetches
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.getNotifications({ page, limit: 10 });

      setNotifications((prev) => {
        const newNotifications = response.data.filter(
          // (n) => !prev.some((existing) => existing.id === n.id)
          (n) => !prev.some((existing) => existing.id === n.id) && !n.read
        );
        return [...prev, ...newNotifications];
      });

      setUnreadCount(
        response.unreadCount ?? notifications.filter((n) => !n.read).length
      );
      lastPageRef.current = page;
    } catch (err: any) {
      if (err.response?.status === 429 && retries > 0) {
        console.warn(`Rate limit hit, retrying in ${delay}ms...`);
        setTimeout(
          () => fetchNotifications(page, retries - 1, delay * 2),
          delay
        );
      } else {
        setError('Failed to fetch notifications');
        console.error('Error fetching notifications:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounced infinite scrolling
  const debouncedFetch = React.useCallback(
    debounce(() => fetchNotifications(lastPageRef.current + 1), 1000),
    []
  );
  const { loadMoreRef } = useInfiniteScroll(debouncedFetch);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications(1);
    }
  }, [isAuthenticated]);

  // WebSocket updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = socketService.getSocket();
    if (!socket) return;

    const handleNewNotification = (newNotification: Notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === newNotification.id)) return prev;
        return [newNotification, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    };

    // Attach event listener
    socket.off('newNotification', handleNewNotification); 
    socket.on('newNotification', handleNewNotification);

    // Cleanup function to remove listener
    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [isAuthenticated]); // Re-run effect when authentication status changes

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await userApi.markNotificationAsRead(notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      setUnreadCount((prev) => prev - 1);
      // router.push(notification.route); // Assuming notification has a route property
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[320px]  max-w-xs p-2 rounded-xl shadow-lg backdrop-blur-sm bg-background/80"
          align="end"
        >
          <DropdownMenuLabel className="flex justify-between items-center">
            Notifications
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              No notifications available. Please log in.
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 min-w-[1.5rem] h-5 px-1 flex items-center justify-center text-xs text-red-600">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-w-xs p-2 rounded-xl shadow-lg backdrop-blur-sm bg-background/80"
        align="center"
      >
        <DropdownMenuLabel className="flex justify-between items-center">
          Notifications
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNotifications(1)}
            >
              Refresh
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[400px] overflow-auto">
          {error && (
            <DropdownMenuItem className="text-red-500">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </DropdownMenuItem>
          )}
          {notifications.length === 0 && !loading && (
            <DropdownMenuItem>No notifications found.</DropdownMenuItem>
          )}
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col space-y-1"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex justify-between gap-8">
                {!notification.read && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {notification.message}
              </p>
            </DropdownMenuItem>
          ))}
          {loading && (
            <DropdownMenuItem>
              <div className="flex flex-col space-y-2 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </DropdownMenuItem>
          )}
          <div ref={loadMoreRef} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
