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

interface AuctionItem {
  id: string;
  itemName: string;
  startingPrice: number;
  currentBid: number;
  endDate: Date;
  status: 'active' | 'ended' | 'upcoming';
  bidCount: number;
  category: string;
  imageUrl: string;
}

const fetchAuctionData = async (
  search: string,
  status: string,
  category: string
): Promise<AuctionItem[]> => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Sample data
  const allData: AuctionItem[] = [
    {
      id: '1',
      itemName: 'Vintage Rolex Watch',
      startingPrice: 1000,
      currentBid: 1500,
      endDate: new Date('2023-12-31'),
      status: 'active',
      bidCount: 15,
      category: 'Jewelry',
      imageUrl: '/placeholder.svg?height=100&width=100',
    },
    {
      id: '2',
      itemName: 'Antique Ming Dynasty Vase',
      startingPrice: 5000,
      currentBid: 7500,
      endDate: new Date('2023-12-25'),
      status: 'active',
      bidCount: 25,
      category: 'Art',
      imageUrl: '/placeholder.svg?height=100&width=100',
    },
    {
      id: '3',
      itemName: 'Rare Ancient Roman Coin',
      startingPrice: 500,
      currentBid: 750,
      endDate: new Date('2023-12-20'),
      status: 'ended',
      bidCount: 10,
      category: 'Collectibles',
      imageUrl: '/placeholder.svg?height=100&width=100',
    },
    {
      id: '4',
      itemName: 'Original Picasso Painting',
      startingPrice: 100000,
      currentBid: 100000,
      endDate: new Date('2024-01-05'),
      status: 'upcoming',
      bidCount: 0,
      category: 'Art',
      imageUrl: '/placeholder.svg?height=100&width=100',
    },
    {
      id: '5',
      itemName: 'First Edition Harry Potter Book',
      startingPrice: 10000,
      currentBid: 12000,
      endDate: new Date('2023-12-28'),
      status: 'active',
      bidCount: 8,
      category: 'Books',
      imageUrl: '/placeholder.svg?height=100&width=100',
    },
  ];

  return allData.filter(
    (item) =>
      (search
        ? item.itemName.toLowerCase().includes(search.toLowerCase())
        : true) &&
      (status !== 'all' ? item.status === status : true) &&
      (category !== 'all' ? item.category === category : true)
  );
};

const columns: Column<AuctionItem>[] = [
  {
    accessorKey: 'itemName',
    header: 'Item Name',
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <img
          src={row.original.imageUrl}
          alt={row.original.itemName}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
        />
        <div className="font-medium text-sm md:text-base">
          {row.original.itemName}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.category}</Badge>
    ),
  },
  {
    accessorKey: 'startingPrice',
    header: 'Starting Price',
    cell: ({ row }) => (
      <div className="text-right font-medium text-sm md:text-base">
        ${row.original.startingPrice.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'currentBid',
    header: 'Current Bid',
    cell: ({ row }) => (
      <div className="text-right font-medium text-sm md:text-base">
        ${row.original.currentBid.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'bidCount',
    header: 'Bids',
    cell: ({ row }) => (
      <div className="text-center">{row.original.bidCount}</div>
    ),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => (
      <div className="text-center text-sm md:text-base">
        {row.original.endDate.toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          variant={
            row.original.status === 'active'
              ? 'success'
              : row.original.status === 'ended'
              ? 'destructive'
              : 'warning'
          }
        >
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.moreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy auction ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Edit auction</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'ended', label: 'Ended' },
  { value: 'upcoming', label: 'Upcoming' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'Jewelry', label: 'Jewelry' },
  { value: 'Art', label: 'Art' },
  { value: 'Collectibles', label: 'Collectibles' },
  { value: 'Books', label: 'Books' },
];

export default function OutgoingAuctionTable() {
  const [auctionData, setAuctionData] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();

  const debouncedSearchValue = useDebounce(searchValue, 300);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAuctionData(
        debouncedSearchValue,
        statusFilter,
        categoryFilter
      );
      setAuctionData(data);
    } catch (error) {
      console.error('Failed to fetch auction data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load auction data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchValue, statusFilter, categoryFilter, toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, debouncedSearchValue, statusFilter, categoryFilter]);

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
        <div className="flex space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
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
        </div>
      </div>
    ),
    [searchValue, statusFilter, categoryFilter]
  );

  const renderMobileRow = useCallback(
    (item: AuctionItem) => (
      <div key={item.id} className="bg-background p-4 rounded-lg shadow mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{item.itemName}</h3>
              <Badge variant="secondary" className="mt-1">
                {item.category}
              </Badge>
            </div>
          </div>
          <Badge
            variant={
              item.status === 'active'
                ? 'success'
                : item.status === 'ended'
                ? 'destructive'
                : 'warning'
            }
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Starting Price: ${item.startingPrice.toLocaleString()}</div>
          <div>Current Bid: ${item.currentBid.toLocaleString()}</div>
          <div>Bids: {item.bidCount}</div>
          <div>End Date: {item.endDate.toLocaleDateString()}</div>
        </div>
        <div className="mt-4 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
                <Icons.arrowDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Copy auction ID
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit auction</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    ),
    []
  );

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
            </div>
          </div>
        ))}
      </div>
    ),
    []
  );

  return (
    <Card className="w-full">
      <CardHeader className="sticky top-0 z-10 bg-background">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <span>Outgoing Auctions</span>
          <Button onClick={fetchData}>
            <Icons.refresh className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {CustomToolbar}
        {loading ? (
          renderSkeletonLoader()
        ) : (
          <>
            <div className="hidden md:block">
              <DataTable
                columns={columns}
                data={auctionData}
                searchable={false}
                pageSize={5}
                pageSizeOptions={[5, 10, 20, 50]}
              />
            </div>
            <div className="md:hidden">{auctionData.map(renderMobileRow)}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
