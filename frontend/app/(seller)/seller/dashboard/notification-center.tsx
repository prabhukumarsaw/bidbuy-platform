'use client'

import * as React from "react"
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function NotificationCenter() {
  const [notificationCount, setNotificationCount] = React.useState(3)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {notificationCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="font-medium">New Bid:</span> $1,500 on Vintage Watch
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="font-medium">Auction Ended:</span> Antique Vase sold for $950
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="font-medium">Reminder:</span> Update listing for Rare Coin
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

