import { Suspense } from 'react';
import Image from 'next/image';
import { SidebarNav } from './components/sidebar-nav';
import Loading from '@/app/loading';

import type React from 'react'; // Added import for React
import AuthGuard from '@/lib/auth/AuthGaurd';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const sidebarNavItems = [
  { title: 'Profile', href: '/user' },
  { title: 'Account', href: '/user/account' },
  { title: 'Appearance', href: '/user/appearance' },
  { title: 'Notifications', href: '/user/notifications' },
  { title: 'Display', href: '/user/display' },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <AuthGuard allowedRoles={['USER']}>
      <div className="flex flex-col lg:flex-row bg-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <Suspense fallback={<Loading />}>
          <main className="flex-grow">
            <div className="container mx-auto px-4 py-8 min-h-screen">
              <div className="w-full lg:hidden mx-auto border rounded-3xl shadow-apple-lg bg-white dark:bg-gray-800 ">
                <ScrollArea className="w-full">
                  <div className="flex space-x-4 px-4 py-2 w-max">
                    <SidebarNav items={sidebarNavItems} />
                  </div>
                  <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
              </div>
              {children}
            </div>
          </main>
        </Suspense>
      </div>
    </AuthGuard>
  );
}

function SidebarContent() {
  return (
    <>
      <div className="p-6 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
        <Image
          src="/logo.svg"
          width={40}
          height={40}
          alt="Logo"
          className="rounded-full shadow-md"
        />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Settings
        </h2>
      </div>
      <nav className="mt-4">
        <SidebarNav items={sidebarNavItems} />
      </nav>
    </>
  );
}
