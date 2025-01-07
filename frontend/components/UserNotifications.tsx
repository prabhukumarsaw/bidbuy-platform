'use client';

import * as React from 'react';
import { Bell } from 'lucide-react';
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

const notifications = [
  {
    id: 1,
    title: 'Your auction has ended',
    description:
      "The auction for 'Vintage Watch' has ended. View the results now.",
  },
  {
    id: 2,
    title: 'New bid on your item',
    description: "Someone has placed a new bid on 'Antique Vase'.",
  },
  {
    id: 3,
    title: 'Auction reminder',
    description: "The auction for 'Classic Car' starts in 1 hour.",
  },
];

export function UserNotifications() {
  const [unreadCount, setUnreadCount] = React.useState(notifications.length);

  const markAsRead = (id: number) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
    // Here you would typically update the read status in your backend
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onSelect={() => markAsRead(notification.id)}
            >
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
