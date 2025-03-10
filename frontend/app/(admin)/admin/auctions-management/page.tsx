// eslint-disable-next-line
// @ts-nocheck

'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import {
  useAuctions,
  useAuctionMutations,
  useCategories,
  useAuctionStats,
} from '@/hooks/useAdminAuctions';
import { DataTable } from '@/components/ui/data-table';
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
import { useVirtualizer } from '@tanstack/react-virtual';
import type { AuctionItem } from '@/types/types';
import { ViewAuctionDialog } from './ViewAuctionDialog';
import { AuctionStatHeader } from './AuctionStatHeader';
import { EditAuctionDialog } from './EditAuctionDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface FilterState {
  search: string;
  status: string | string[];
  categoryId: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  startTime?: string;
  endTime?: string;
  page: number;
  limit: number;
}

const initialFilters: FilterState = {
  search: '',
  status: 'all',
  categoryId: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'ended', label: 'Ended' },
  { value: 'upcoming', label: 'Upcoming' },
];

const sortOptions = [
  { value: 'createdAt', label: 'Created At' },
  { value: 'currentPrice', label: 'Current Price' },
  { value: 'bidCount', label: 'Bid Count' },
];

export default function AuctionTable() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const debouncedSearch = useDebounce(filters.search, 300);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data ?? [];
  const { deleteAuction, updateStatus } = useAuctionMutations();
  const { data: statsData } = useAuctionStats();

  const {
    data: auctionData = { auctions: [], pagination: { total: 0 } },
    isLoading,
    isError,
    refetch,
  } = useAuctions({
    ...filters,
    search: debouncedSearch,
    page: filters.page,
    limit: filters.limit,
  });

  console.log('data of auction', auctionData);

  const rowVirtualizer = useVirtualizer({
    count: auctionData?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); // Reset page when filters change
    },
    []
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteAuction.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Auction deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete auction',
        variant: 'destructive',
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      setLoading(true);

      await updateStatus.mutateAsync({ id, status: status.toUpperCase() });
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });

      // If status is SCHEDULED, show a confirmation message

      if (status.toUpperCase() === 'SCHEDULED') {
        toast({
          title: 'Auction Scheduled',
          description: 'The auction has been scheduled successfully.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      // Hide loading state
      setLoading(false);
    }
  };

  const handleViewAuction = (auction: AuctionItem) => {
    setSelectedAuction(auction);
    setViewDialogOpen(true);
  };

  const handleEditAuction = (auction: AuctionItem) => {
    setSelectedAuction(auction);
    setEditDialogOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Item Name',
        cell: ({ row }: { row: { original: AuctionItem } }) => (
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <img
                src={row.original.featuredImage}
                alt={row.original.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="font-medium truncate max-w-[200px]">
              {row.original.title}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <Badge variant="secondary" className="truncate max-w-[150px]">
            {row.original.category.name}
          </Badge>
        ),
      },
      {
        accessorKey: 'currentPrice',
        header: 'Current Price',
        cell: ({ row }) => (
          <div className="text-right font-medium tabular-nums">
            ${row.original.currentPrice.toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: 'endTime',
        header: 'End Time',
        cell: ({ row }) => (
          <div className="text-center">
            {format(new Date(row.original.endTime), 'PPp')}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'ACTIVE'
                ? 'success'
                : row.original.status === 'ENDED'
                ? 'destructive'
                : 'pending'
            }
            className="capitalize"
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Icons.moreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewAuction(row.original)}>
                <Icons.eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditAuction(row.original)}>
                <Icons.edit className="mr-2 h-4 w-4" />
                Edit Auction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row.original.id, 'ACTIVE')}
                disabled={row.original.status === 'ACTIVE' || loading}
              >
                <Icons.play className="mr-2 h-4 w-4" />
                {loading ? 'Updating...' : 'Mark Active'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row.original.id, 'SCHEDULED')}
                disabled={row.original.status !== 'DRAFT' || loading}
              >
                <Icons.calendar className="mr-2 h-4 w-4" />
                {loading ? 'Scheduling...' : 'Schedule Auction'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row.original.id, 'ENDED')}
                disabled={row.original.status === 'ENDED' || loading}
              >
                <Icons.stop className="mr-2 h-4 w-4" />
                {loading ? 'Updating...' : 'Mark Ended'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(row.original.id)}
                className="text-red-600"
              >
                <Icons.trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleDelete, handleStatusUpdate, handleViewAuction, handleEditAuction]
  );

  if (isError) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Icons.alertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div className="text-lg font-medium">Failed to load auctions</div>
            <p className="text-gray-600">Please try again later</p>
            <Button onClick={() => refetch()} variant="outline">
              <Icons.refresh className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AuctionStatHeader stats={statsData?.data} isLoading={isLoading} />
      <Card className="w-full">
        <CardHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardTitle className="flex items-center justify-between">
            <span>Auctions</span>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <Icons.refresh
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search auctions..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full"
              />
            </div>
            {/* <div className="grid grid-cols-2 gap-2 lg:flex lg:space-x-2">
              <Select
                value={
                  Array.isArray(filters.status)
                    ? filters.status[0]
                    : filters.status
                }
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-full lg:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.categoryId}
                onValueChange={(value) =>
                  handleFilterChange('categoryId', value)
                }
              >
                <SelectTrigger className="w-full lg:w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger className="w-full lg:w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleFilterChange(
                    'sortOrder',
                    filters.sortOrder === 'asc' ? 'desc' : 'asc'
                  )
                }
                className="w-full lg:w-auto"
              >
                {filters.sortOrder === 'asc' ? (
                  <Icons.arrowUp className="h-4 w-4" />
                ) : (
                  <Icons.arrowDown className="h-4 w-4" />
                )}
              </Button>
            </div> */}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div ref={parentRef} className="h-[80vh] overflow-auto">
              {isMobile ? (
                <div className="relative">
                  {auctionData.auctions.map((auction) => (
                    <Card key={auction.id} className="mb-4 overflow-hidden">
                      <CardContent className="p-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          {/* Image Section */}
                          <div className="relative w-full h-36 md:h-40 rounded-lg overflow-hidden">
                            <img
                              src={auction.featuredImage}
                              alt={auction.title}
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          {/* Auction Details */}
                          <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2">
                            <div>
                              <h3 className="font-medium truncate text-lg">
                                {auction.title}
                              </h3>
                              <Badge
                                variant={
                                  auction.status === 'active'
                                    ? 'success'
                                    : auction.status === 'ended'
                                    ? 'destructive'
                                    : 'pending'
                                }
                                className="capitalize text-xs"
                              >
                                {auction.status}
                              </Badge>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Icons.tag className="w-4 h-4 mr-1" />
                                <span className="truncate">
                                  {auction.category.name}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Icons.dollarSign className="w-4 h-4 mr-1" />
                                <span className="font-medium tabular-nums">
                                  {auction.currentPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Icons.clock className="w-4 h-4 mr-1" />
                                <span>
                                  {format(new Date(auction.endTime), 'PP')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap md:flex-col gap-2 justify-end items-center md:items-start">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewAuction(auction)}
                            >
                              <Icons.eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAuction(auction)}
                            >
                              <Icons.edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(auction.id, 'SCHEDULED')
                              }
                              disabled={auction.status !== 'DRAFT' || loading}
                            >
                              <Icons.calendar className="w-4 h-4 mr-1" />
                              {loading ? 'Scheduling...' : 'Schedule'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(auction.id, 'ACTIVE')
                              }
                              disabled={auction.status === 'ACTIVE' || loading}
                            >
                              <Icons.play className="w-4 h-4 mr-1" />
                              {loading ? 'Updating...' : 'Active'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(auction.id, 'ENDED')
                              }
                              disabled={auction.status === 'ENDED' || loading}
                            >
                              <Icons.stop className="w-4 h-4 mr-1" />
                              {loading ? 'Updating...' : 'End'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(auction.id)}
                            >
                              <Icons.trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={auctionData?.auctions || []}
                  pageCount={Math.ceil(
                    (auctionData.pagination.total || 0) / filters.limit
                  )}
                  pageSize={filters.limit}
                  pageIndex={filters.page - 1}
                  onPageChange={(page) =>
                    setFilters((prev) => ({ ...prev, page: page + 1 }))
                  }
                  onPageSizeChange={(limit) =>
                    setFilters((prev) => ({ ...prev, limit }))
                  }
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <ViewAuctionDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        auction={selectedAuction}
      />
      <EditAuctionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        auction={selectedAuction}
      />
    </div>
  );
}
