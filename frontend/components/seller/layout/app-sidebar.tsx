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
import { useAuthStore } from '@/lib/store/auth-store'; // Assuming auth-store is correctly set up
import { useAuth } from '@/hooks/use-auth';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/seller',
      icon: LayoutDashboard,
    },
    {
      title: 'Auction Management',
      url: '/seller/auctions-management',
      icon: Package,
    },

    {
      title: 'Payment',
      url: '/seller/payment',
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
          url: '/seller/account-seller',
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
    {
      title: 'Support & Help',
      url: '/seller/support',
      icon: Inbox,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser user={user} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  ) : null;
}
