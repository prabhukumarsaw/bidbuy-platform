// @ts-nocheck

'use client';

import * as React from 'react';
import {
  Command,
  Frame,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Inbox,
  User,
  PieChart,
  Map,
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
import { useAuthStore } from '@/lib/store/auth-store'; // Assuming auth-store is correctly set up
import { useAuth } from '@/hooks/use-auth';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Auction Management',
      url: '/admin/auctions-management',
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
      title: 'Winner Management',
      url: '/seller/winner-management',
      icon: ShoppingCart,
    },
    {
      title: 'Notification',
      url: '/seller/notification',
      icon: Inbox,
    },
    {
      title: 'Inbox',
      url: '/seller/inbox',
      icon: Inbox,
    },
    {
      title: 'Report',
      url: '/seller/report',
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
          title: 'Change Password',
          url: 'change-password',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Master',
      url: 'master-seller',
      icon: User,
      items: [
        {
          title: 'My Auction',
          url: 'my-auction',
        },
        {
          title: 'Category',
          url: 'category-seller',
        },
        {
          title: 'Advertisement',
          url: 'advertisement',
        },
        {
          title: 'Featured Image',
          url: 'featured-image',
        },
        {
          title: 'Blogs',
          url: 'blogs',
        },
        {
          title: 'Privacy & Policy',
          url: 'privacy-policy',
        },
        {
          title: 'Terms & Conditions',
          url: 'terms-conditions',
        },
      ],
    },
    {
      title: 'Setting',
      url: 'account-seller',
      icon: User,
      items: [
        {
          title: 'General',
          url: 'general-setting',
        },
        {
          title: 'Admin Setting',
          url: '',
        },
        {
          title: 'Backup',
          url: '#',
        },
      ],
    },
  ],

  projects: [
    {
      name: 'Home',
      url: '/',
      icon: Frame,
    },
    {
      name: 'Auctions',
      url: '/auction',
      icon: PieChart,
    },
    {
      name: 'About',
      url: '/',
      icon: Map,
    },
  ],
};

export function AppSidebar() {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      // Example redirect logic if unauthenticated
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  return isAuthenticated && user ? (
    <Sidebar variant="inset">
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
                  <span className="truncate text-xs">💕 Admin Dashboard</span>
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
        <NavUser user={user} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  ) : null;
}
