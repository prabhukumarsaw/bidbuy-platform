'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/use-users';
// import { DataTable } from '@/components/ui/data-table';
import { UserActions } from '@/components/admin/user-actions';
import { columns } from '@/components/admin/columns';
import { Icons } from '@/components/icons';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data: users, isLoading, error } = useUsers();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>Admin: {user.name}</span>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Main Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">User Management</h2>
              {isLoading ? (
                <div className="flex justify-center">
                  <Icons.spinner className="animate-spin h-8 w-8" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">
                  Error loading users: {error.message}
                </div>
              ) : (

                <h1>hello</h1>
                // <DataTable
                //   columns={columns}
                //   data={users}
                //   actions={<UserActions />}
                // />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}