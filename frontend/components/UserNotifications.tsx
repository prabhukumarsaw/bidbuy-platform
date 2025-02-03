// eslint-disable-next-line
// @ts-nocheck

'use client';

import * as React from 'react';
import { Bell, Check, Loader2, AlertCircle } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { socketService } from '@/lib/socketService';

// Debounce function to limit rapid API calls
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export function UserNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const lastPageRef = React.useRef(0);

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
          (n) => !prev.some((existing) => existing.id === n.id)
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
  React.useEffect(() => {
    fetchNotifications(1);
  }, []);

  // WebSocket updates
  React.useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    const handleNewNotification = (newNotification: Notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === newNotification.id)) return prev; // Prevent duplicates
        return [newNotification, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    };

    socket.on('newNotification', handleNewNotification);
    return () => socket.off('newNotification', handleNewNotification);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 min-w-[1.5rem] h-5 px-1 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[320px] max-w-xs p-2 rounded-xl shadow-lg backdrop-blur-sm bg-background/80"
        align="end"
      >
        <DropdownMenuLabel className="flex justify-between items-center">
          Notifications
          {unreadCount > 0 && (
            <Button
              variant="ghost"
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
