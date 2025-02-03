// @ts-nocheck

import Image from 'next/image';
import { SidebarNav } from './components/sidebar-nav';
import AuthGuard from '@/lib/auth/AuthGaurd';

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
      <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-80 bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700 z-30">
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

          {/* Navigation Items */}
          <nav className="mt-4">
            <SidebarNav items={sidebarNavItems} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ">
          <div className="container mx-auto px-6 py-8 pb-24 lg:pb-8 min-h-screen">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
