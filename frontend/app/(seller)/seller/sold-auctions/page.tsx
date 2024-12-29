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

interface SoldAuction {
  id: string;
  itemName: string;
  startingPrice: number;
  finalPrice: number;
  soldDate: Date;
  category: string;
  imageUrl: string;
  winner: {
    name: string;
    email: string;
    bidCount: number;
  };
}

const fetchSoldAuctions = async (
  search: string,
  category: string
): Promise<SoldAuction[]> => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Sample data
  const allData: SoldAuction[] = [
    {
      id: '1',
      itemName: 'Vintage Rolex Submariner',
      startingPrice: 5000,
      finalPrice: 8500,
      soldDate: new Date('2023-12-15'),
      category: 'Watches',
      imageUrl: '/placeholder.svg?height=100&width=100',
      winner: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        bidCount: 12,
      },
    },
    {
      id: '2',
      itemName: 'First Edition Harry Potter Book',
      startingPrice: 1000,
      finalPrice: 3200,
      soldDate: new Date('2023-12-18'),
      category: 'Books',
      imageUrl: '/placeholder.svg?height=100&width=100',
      winner: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        bidCount: 8,
      },
    },
    {
      id: '3',
      itemName: 'Signed Michael Jordan Jersey',
      startingPrice: 2000,
      finalPrice: 5500,
      soldDate: new Date('2023-12-20'),
      category: 'Sports Memorabilia',
      imageUrl: '/placeholder.svg?height=100&width=100',
      winner: {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        bidCount: 15,
      },
    },
    {
      id: '4',
      itemName: 'Antique Victorian Writing Desk',
      startingPrice: 800,
      finalPrice: 1200,
      soldDate: new Date('2023-12-22'),
      category: 'Furniture',
      imageUrl: '/placeholder.svg?height=100&width=100',
      winner: {
        name: 'Emily Brown',
        email: 'emily.brown@example.com',
        bidCount: 6,
      },
    },
    {
      id: '5',
      itemName: 'Original Andy Warhol Print',
      startingPrice: 10000,
      finalPrice: 18500,
      soldDate: new Date('2023-12-25'),
      category: 'Art',
      imageUrl: '/placeholder.svg?height=100&width=100',
      winner: {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        bidCount: 20,
      },
    },
  ];

  return allData.filter(
    (item) =>
      (search
        ? item.itemName.toLowerCase().includes(search.toLowerCase())
        : true) && (category !== 'all' ? item.category === category : true)
  );
};

const columns: Column<SoldAuction>[] = [
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
    accessorKey: 'finalPrice',
    header: 'Final Price',
    cell: ({ row }) => (
      <div className="text-right font-medium text-sm md:text-base">
        ${row.original.finalPrice.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'soldDate',
    header: 'Sold Date',
    cell: ({ row }) => (
      <div className="text-center text-sm md:text-base">
        {row.original.soldDate.toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: 'winner',
    header: 'Winner',
    cell: ({ row }) => (
      <div className="text-sm md:text-base">
        <div>{row.original.winner.name}</div>
        <div className="text-muted-foreground">{row.original.winner.email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'bidCount',
    header: 'Winning Bids',
    cell: ({ row }) => (
      <div className="text-center">{row.original.winner.bidCount}</div>
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
          <DropdownMenuItem>Contact winner</DropdownMenuItem>
          <DropdownMenuItem>Generate invoice</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'Watches', label: 'Watches' },
  { value: 'Books', label: 'Books' },
  { value: 'Sports Memorabilia', label: 'Sports Memorabilia' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Art', label: 'Art' },
];

export default function SoldAuctionsTable() {
  const [auctionData, setAuctionData] = useState<SoldAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();

  const debouncedSearchValue = useDebounce(searchValue, 300);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSoldAuctions(
        debouncedSearchValue,
        categoryFilter
      );
      setAuctionData(data);
    } catch (error) {
      console.error('Failed to fetch sold auction data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sold auction data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchValue, categoryFilter, toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, debouncedSearchValue, categoryFilter]);

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
        </div>
      </div>
    ),
    [searchValue, categoryFilter]
  );

  const renderMobileRow = useCallback(
    (item: SoldAuction) => (
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
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
          <div>Starting Price: ${item.startingPrice.toLocaleString()}</div>
          <div>Final Price: ${item.finalPrice.toLocaleString()}</div>
          <div>Sold Date: {item.soldDate.toLocaleDateString()}</div>
          <div>Winner: {item.winner.name}</div>
          <div>Winner Email: {item.winner.email}</div>
          <div>Winning Bids: {item.winner.bidCount}</div>
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
              <DropdownMenuItem>Contact winner</DropdownMenuItem>
              <DropdownMenuItem>Generate invoice</DropdownMenuItem>
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
          <span>Sold Auctions</span>
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
