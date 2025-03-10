// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SortDropdown from './SortDropdown';
import ViewToggle from './ViewToggle';
import { Button } from '@/components/ui/button';
import { FilterState } from '@/types/product';
import { AuctionItem } from '@/types/types';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface ProductGridProps {
  initialProducts: {
    auctions: AuctionItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      nextPage: number | null;
      prevPage: null | number;
    };
  };
  onPageChange: (pageNumber: number) => void;
  onSort: (sortOption: string) => void;
}

export default function ProductGrid({
  initialProducts,
  onPageChange,
  onSort,
}: ProductGridProps) {
  const [products, setProducts] = useState<AuctionItem[]>(
    initialProducts.auctions
  );
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState<number>(
    initialProducts.pagination.page
  );

  useEffect(() => {
    setProducts(initialProducts.auctions);
    setCurrentPage(initialProducts.pagination.page);
  }, [initialProducts.auctions, initialProducts.pagination.page]);

  const handleSort = (option: string) => {
    setSortOption(option);
    onSort(option);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const renderPaginationButtons = () => {
    const totalPages = initialProducts.pagination.totalPages;
    const currentPage = initialProducts.pagination.page;
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            className="mx-1 mb-2"
            onClick={() => paginate(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      buttons.push(
        <Button
          key="first"
          variant={currentPage === 1 ? 'default' : 'outline'}
          className="mx-1 mb-2"
          onClick={() => paginate(1)}
        >
          1
        </Button>
      );

      if (currentPage > 3) {
        buttons.push(
          <Button
            key="ellipsis-start"
            variant="ghost"
            className="mx-1 mb-2"
            disabled
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        );
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            className="mx-1 mb-2"
            onClick={() => paginate(i)}
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <Button
            key="ellipsis-end"
            variant="ghost"
            className="mx-1 mb-2"
            disabled
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        );
      }

      buttons.push(
        <Button
          key="last"
          variant={currentPage === totalPages ? 'default' : 'outline'}
          className="mx-1 mb-2"
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex items-center justify-between w-full">
          {/* Left Part: Showing Results - Visible only on small screens */}
          <span className=" font-medium">
            Showing {(currentPage - 1) * initialProducts.pagination.limit + 1}–
            {Math.min(
              currentPage * initialProducts.pagination.limit,
              initialProducts.pagination.total
            )}{' '}
            of {initialProducts.pagination.total} results
          </span>

          {/* Right Part: Sort Dropdown + View Toggle */}
          <div className="flex items-center space-x-4">
            <span className="hidden md:block">
              <SortDropdown onSort={handleSort} />
            </span>
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>
      </div>
      <div
        className={`grid gap-4 sm:gap-6 ${
          view === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            view={view}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-center items-center flex-wrap">
        <Button
          variant="outline"
          className="mx-1 mb-2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        {renderPaginationButtons()}
        <Button
          variant="outline"
          className="mx-1 mb-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === initialProducts.pagination.totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
