'use client';
import { useState, useCallback } from 'react';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import ProductGrid from '@/components/auction/ProductGrid';
import MobileActionBar from '@/components/auction/MobileActionBar';
import Layout from '@/components/auction/Layout';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('createdAt:desc');

  const {
    filters,
    setFilter,
    auctionsResponse,
    categories,
    sellers,
    isLoading,
  } = useAdvancedFilters(currentPage, 10);

  const handleFilterChange = useCallback(
    (newFilters: any) => {
      Object.entries(newFilters).forEach(([key, value]) => {
        setFilter(key as keyof typeof filters, value);
      });
    },
    [setFilter]
  );

  const handleSort = useCallback(
    (sortOption: string) => {
      setSortBy(sortOption);
      setFilter('sortBy', sortOption);
    },
    [setFilter]
  );

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  if (isLoading) {
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
        <ProductGrid
          initialProducts={{
            auctions: auctionProducts,
            pagination: pagination,
          }}
          onPageChange={handlePageChange}
          onSort={handleSort}
        />
      </div>
      <MobileActionBar
        categories={categories}
        onFilterChange={handleFilterChange}
        sellers={sellers}
        onSort={handleSort}
      />
    </Layout>
  );
}
