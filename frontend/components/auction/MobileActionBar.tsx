'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';

interface MobileActionBarProps {
  categories: string[];
  conditions: string[];
  sellers: Array<{ id: number; name: string; rating: number }>;
}

export default function MobileActionBar({
  categories,
  conditions,
  sellers,
}: MobileActionBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const handleFilterChange = (filters: FilterState) => {
    // Implement filter logic here
    console.log('Filters changed:', filters);
  };

  const handleSort = (sortOption: string) => {
    // Implement sorting logic here
    console.log('Sorting by:', sortOption);
  };

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 flex justify-between items-center lg:hidden">
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Filters</Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <FilterSidebar
            categories={categories}
            conditions={conditions}
            sellers={sellers}
            onFilterChange={handleFilterChange}
          />
        </SheetContent>
      </Sheet>
      <SortDropdown onSort={handleSort} />
    </div>
  );
}
