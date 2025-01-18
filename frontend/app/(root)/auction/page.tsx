'use client';

import { Suspense, useState } from 'react';
import Layout from '@/components/auction/Layout';
import ProductGrid from '@/components/auction/ProductGrid';
import MobileActionBar from '@/components/auction/MobileActionBar';
import { AuctionItem, Category } from '@/types/types';
import {
  useAuctions,
  useCategories,
  AuctionFilters,
  useSellers,
} from '@/hooks/useBackground';

export default function Home() {
  const [filters, setFilters] = useState<AuctionFilters>({});
  const [sortBy, setSortBy] = useState<string>('createdAt:desc');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: auctionsResponse, isLoading: isAuctionsLoading } = useAuctions({
    ...filters,
    sortBy,
    page: currentPage,
    limit: 10,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: sellers, isLoading: isSellersLoading } = useSellers();

  const handleFilterChange = (newFilters: AuctionFilters) => {
    setFilters(newFilters);
    // setCurrentPage(1);
  };

  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
    // setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isAuctionsLoading || isCategoriesLoading || isSellersLoading) {
    return <div>Loading...</div>;
  }

  const auctionProducts = auctionsResponse?.auctions || [];
  const pagination = auctionsResponse?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    nextPage: null,
    prevPage: null,
  };

  return (
    <Layout
      categories={categories}
      sellers={sellers}
      onFilterChange={handleFilterChange}
    >
      <div className="">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductGrid
            initialProducts={{
              auctions: auctionProducts,
              pagination: pagination,
            }}
            onPageChange={handlePageChange}
            onSort={handleSort}
          />
        </Suspense>
      </div>
      <MobileActionBar
        categories={categories}
        onFilterChange={handleFilterChange}
        sellers={sellers}
      />
    </Layout>
  );
}
