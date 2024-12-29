'use client';

import * as React from 'react';
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Map,
  Package,
  PieChart,
  Send,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  User,
} from 'lucide-react';

import { NavMain } from '../navigation/nav-main';
import { NavProjects } from '../navigation/nav-projects';
import { NavUser } from '../navigation/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Personalize Auctions',
      url: '/admin/personalize-auctions',
      icon: Package,
    },
    {
      title: 'Seller Management',
      url: '/admin/seller-management',
      icon: ShoppingCart,
    },
    {
      title: 'User Management',
      url: '/admin/user-management',
      icon: ShoppingCart,
    },
    {
      title: 'Sold',
      url: '/seller/sold-auctions',
      icon: ShoppingCart,
    },
    {
      title: 'Inbox',
      url: '/seller/inbox',
      icon: Inbox,
    },

    {
      title: 'Account',
      url: 'account-seller',
      icon: User,
      items: [
        {
          title: 'Profile',
          url: 'account-seller',
        },
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
  ],

  projects: [
    {
      name: 'Home',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Auctions',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'About',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BuyBid</span>
                  <span className="truncate text-xs">💕 Seller</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
