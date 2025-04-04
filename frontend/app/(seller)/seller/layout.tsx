'use client';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/components/seller/layout/app-sidebar';
import { ThemeToggle } from './dashboard/theme-toggle';
import { NotificationCenter } from './dashboard/notification-center';
import { CreateAuction } from './dashboard/create-auction';
import AuthGuard from '@/lib/auth/AuthGaurd';
import { useAuthStore } from '@/lib/store/auth-store';
import { Suspense } from 'react';
import Loading from './loading';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  return (
    <AuthGuard allowedRoles={['SELLER']}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 shadow-md bg-white dark:bg-gray-900">
            {/* Left Section: Logo and Sidebar Trigger */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="md:block hidden  text-xl font-bold text-gray-800 dark:text-gray-200">
                Welcome,{' '}
                <span className="font-semibold">{user?.name ?? 'Guest'}</span>
              </div>
            </div>

            {/* Right Section: Action Items */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <NotificationCenter />
              <CreateAuction />
            </div>
          </header>
          <Suspense fallback={<Loading />}>
            <main className="p-4 ">{children}</main>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
