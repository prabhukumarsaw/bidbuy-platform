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
import { Seller, SellerStatus } from '@/types/types';
import { adminApi } from '@/lib/api/admin';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SellerDetailsDialog } from './SellerDetailsDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/ui/stats-card';

function ActionMenu({
  seller,
  onViewDetails,
  onAction,
}: {
  seller: Seller;
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

        {/* Common Action */}
        <DropdownMenuItem onClick={onViewDetails}>
          View Details
        </DropdownMenuItem>

        {/* Handle Pending Sellers */}
        {seller.status === SellerStatus.PENDING && !seller.suspended && (
          <>
            <DropdownMenuItem onClick={() => onAction('verify')}>
              Verify
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('reject')}>
              Reject
            </DropdownMenuItem>
          </>
        )}

        {/* Handle Verified Sellers */}
        {seller.status === SellerStatus.VERIFIED && !seller.suspended && (
          <DropdownMenuItem
            onClick={() => onAction('suspend')}
            className="text-red-600"
          >
            Suspend
          </DropdownMenuItem>
        )}

        {/* Handle Suspended Sellers */}
        {seller.suspended && (
          <DropdownMenuItem
            onClick={() => onAction('reactivate')}
            className="text-green-600"
          >
            Reactivate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SellerManagementTable() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getDashboardStats(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['sellers', activeTab, debouncedSearchValue, statusFilter],
    queryFn: () =>
      activeTab === 'applications'
        ? adminApi.getSellerApplications(debouncedSearchValue, statusFilter)
        : adminApi.getAllSellers(debouncedSearchValue, statusFilter),
  });

  const sellers = data?.data || [];

  console.log('vbn', sellers);

  const handleAction = async (seller: Seller, action: string) => {
    try {
      switch (action) {
        case 'verify':
          await adminApi.verifySeller(seller.id);
          break;
        case 'reject':
          await adminApi.rejectSeller(seller.id, 'Insufficient documentation');
          break;
        case 'suspend':
          await adminApi.suspendSeller(seller.id, 'Account suspended by admin');
          break;
        case 'reactivate':
          await adminApi.reactivateSeller(seller.id);
          break;
      }

      toast({
        title: 'Success',
        description: `Seller ${action}ed successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ['sellers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setSelectedSeller(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} seller.`,
        variant: 'destructive',
      });
    }
  };

  const columns = useMemo<Column<Seller>[]>(
    () => [
      {
        accessorKey: 'businessName',
        header: 'Business',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <div>
              <div className="font-medium">{row.original.businessName}</div>
              <div className="text-sm text-muted-foreground">
                {row.original.user.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.city}, {row.original.state}
          </div>
        ),
      },
      {
        accessorKey: 'documents',
        header: 'Documents',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            {row.original.gstDocument && (
              <ViewImageDialog
                imageSrc={row.original.gstDocument}
                docNumber={row.original.gstNumber}
                title="GST"
              />
            )}
            {row.original.aadhaarDocument && (
              <ViewImageDialog
                imageSrc={row.original.aadhaarDocument}
                docNumber={row.original.aadhaarNumber}
                title="Aadhaar"
              />
            )}
            {row.original.panDocument && (
              <ViewImageDialog
                imageSrc={row.original.panDocument}
                docNumber={row.original.panNumber}
                title="PAN"
              />
            )}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const seller = row.original;
          let variant: 'default' | 'success' | 'destructive' | 'pending' =
            'default';
          let status = seller.status;
          console.log('status', status);

          if (seller.suspended) {
            variant = 'destructive';
            status = SellerStatus.SUSPENDED;
          } else if (seller.verified) {
            variant = 'success';
            status = SellerStatus.VERIFIED;
          } else if (status === SellerStatus.REJECTED) {
            variant = 'destructive';
          } else {
            variant = 'pending';
          }

          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        accessorKey: 'Actions',
        header: 'Actions',
        cell: ({ row }) => (
          <ActionMenu
            seller={row.original}
            onViewDetails={() => setSelectedSeller(row.original)}
            onAction={(action) => handleAction(row.original, action)}
          />
        ),
      },
    ],
    []
  );

  const statsCards = useMemo(
    () => (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatsCard
          title="Total Sellers"
          value={stats?.data.sellers.total}
          icon={<Icons.users className="h-4 w-4" />}
        />
        <StatsCard
          title="Verified Sellers"
          value={stats?.data.sellers.verified}
          icon={<Icons.check className="h-4 w-4" />}
          description="Active and verified sellers"
        />
        <StatsCard
          title="Pending Applications"
          value={stats?.data.sellers.pending}
          icon={<Icons.clock className="h-4 w-4" />}
          description="Awaiting verification"
        />
        <StatsCard
          title="Suspended Sellers"
          value={stats?.data.sellers.suspended}
          icon={<Icons.ban className="h-4 w-4" />}
          description="Currently suspended"
        />
      </div>
    ),
    [stats]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Management</CardTitle>
      </CardHeader>
      <CardContent>
        {statsCards}

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Sellers</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="flex justify-between items-center">
                <Input
                  placeholder="Search sellers..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DataTable
                columns={columns}
                data={sellers}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              <div className="flex justify-between items-center">
                <Input
                  placeholder="Search applications..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <DataTable
                columns={columns}
                data={sellers}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>

        {selectedSeller && (
          <SellerDetailsDialog
            seller={selectedSeller}
            onClose={() => setSelectedSeller(null)}
            onAction={(action) => handleAction(selectedSeller, action)}
          />
        )}
      </CardContent>
    </Card>
  );
}
