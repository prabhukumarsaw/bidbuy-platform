'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SortDropdown from './SortDropdown';
import ViewToggle from './ViewToggle';
import { Button } from '@/components/ui/button';
import { Product, FilterState } from '@/types/product';

interface ProductGridProps {
  initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    conditions: [],
    sellers: [],
    priceRange: [0, 20000],
  });
  const [sortOption, setSortOption] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 12;

  useEffect(() => {
    let filteredProducts = initialProducts.filter((product) => {
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);
      const conditionMatch =
        filters.conditions.length === 0 ||
        filters.conditions.includes(product.condition);
      const sellerMatch =
        filters.sellers.length === 0 ||
        filters.sellers.includes(product.seller.id);
      const priceMatch =
        product.currentBid >= filters.priceRange[0] &&
        product.currentBid <= filters.priceRange[1];
      return categoryMatch && conditionMatch && sellerMatch && priceMatch;
    });

    switch (sortOption) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.currentBid - b.currentBid);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case 'time-asc':
        filteredProducts.sort(
          (a, b) =>
            new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
        );
        break;
      case 'time-desc':
        filteredProducts.sort(
          (a, b) =>
            new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
        );
        break;
    }

    setProducts(filteredProducts);
    setCurrentPage(1);
  }, [filters, sortOption, initialProducts]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-xl sm:text-xl font-bold mb-4 sm:mb-0 hidden md:block">
          Showing 1–12 Of 27 Results
        </h1>
        <div className="flex items-center space-x-4">
          <span className="hidden md:block">
            {' '}
            <SortDropdown onSort={handleSort} />
          </span>
          <span className="w-[180px] block sm:hidden font-semibold">
            Showing 1–12 Of 27 Results
          </span>

          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>
      <div
        className={`grid gap-4 sm:gap-6 ${
          view === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {currentProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            view={view}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-center flex-wrap">
        {Array.from(
          { length: Math.ceil(products.length / productsPerPage) },
          (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              className="mx-1 mb-2"
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
