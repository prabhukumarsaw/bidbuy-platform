// eslint-disable-next-line
// @ts-nocheck

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table/index';
import { Column } from '@/components/ui/data-table/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import ViewImageDialog from '@/components/widget/ViewImageDialog';
import { User } from '@/types/types';
import { adminApi } from '@/lib/api/admin';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserDetailsDialog } from './UserDetailsDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/ui/stats-card';

function ActionMenu({
  user,
  onViewDetails,
  onAction,
}: {
  user: User;
  onViewDetails: () => void;
  onAction: (action: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <Icons.moreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onViewDetails}>
          View Details
        </DropdownMenuItem>

        {user.active ? (
          <DropdownMenuItem
            onClick={() => onAction('deactivate')}
            className="text-red-600"
          >
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => onAction('activate')}
            className="text-green-600"
          >
            Activate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const UserManagementTable = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => adminApi.getUserStats(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['users', debouncedSearchValue],
    queryFn: () => adminApi.getUsers(debouncedSearchValue),
  });

  const users = data?.data || [];

  const columns = useMemo<Column<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <img
              src={row.original.image}
              alt={row.original.image}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-sm text-muted-foreground">
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'createdAt',
      },

      {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ row }) => {
          const user = row.original;
          let variant: 'default' | 'success' | 'destructive' = 'default';
          const status = user.active ? 'Active' : 'Inactive';

          if (user.active) {
            variant = 'success';
          } else {
            variant = 'destructive';
          }

          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        accessorKey: 'Actions',
        header: 'Actions',
        cell: ({ row }) => (
          <ActionMenu
            user={row.original}
            onViewDetails={() => setSelectedUser(row.original)}
            onAction={(action) => handleAction(row.original, action)}
          />
        ),
      },
    ],
    []
  );

  const statsCards = useMemo(
    () => (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats?.data.total}
          icon={<Icons.users className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Users"
          value={stats?.data.active}
          icon={<Icons.check className="h-4 w-4" />}
          description="Currently active users"
        />
        <StatsCard
          title="Inactive Users"
          value={stats?.data.inactive}
          icon={<Icons.x className="h-4 w-4" />}
          description="Currently inactive users"
        />
        <StatsCard
          title="New Users (Last 30 days)"
          value={stats?.data.newToday}
          icon={<Icons.userPlus className="h-4 w-4" />}
          description="Joined in the last 30 days"
        />
      </div>
    ),
    [stats]
  );

  const handleAction = async (user: User, action: string) => {
    try {
      switch (action) {
        case 'activate':
          await adminApi.reactivateUser(user.id);
          break;
        case 'deactivate':
          await adminApi.deactivateUser(user.id);
          break;
      }

      toast({
        title: 'Success',
        description: `User ${action}d successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} user.`,
        variant: 'destructive',
      });
    }
  };

  const renderSkeletonLoader = useCallback(
    () => (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-background p-4 rounded-lg shadow animate-pulse"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    ),
    []
  );

  const CustomToolbar = useMemo(
    () => (
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search items..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
        </div>
        {/* <div className="flex space-x-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={closeReasonFilter}
              onValueChange={setCloseReasonFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select close reason" />
              </SelectTrigger>
              <SelectContent>
                {closeReasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
      </div>
    ),
    [searchValue]
  );

  return (
    <Card className="w-full">
      <CardHeader className="sticky top-0 z-10 bg-background">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <span>sdfgh</span>
          <Button>
            <Icons.refresh className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {statsCards}
        {CustomToolbar}
        {isLoading ? (
          renderSkeletonLoader()
        ) : (
          <>
            <div className="hidden md:block">
              <DataTable
                columns={columns}
                data={users}
                searchable={false}
                isLoading={isLoading}
                pageSize={5}
                pageSizeOptions={[5, 10, 20, 50]}
              />
              {selectedUser && (
                <UserDetailsDialog
                  user={selectedUser}
                  onClose={() => setSelectedUser(null)}
                />
              )}
            </div>
            {/* <div className="md:hidden">{users.map(renderMobileRow)}</div> */}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagementTable;
