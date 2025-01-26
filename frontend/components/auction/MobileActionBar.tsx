import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import FilterSidebar from './FilterSidebar';
import { Filter, SlidersHorizontal } from 'lucide-react';
import SortDropdown from './SortDropdown';

interface MobileActionBarProps {
  categories: string[];
  sellers: Array<{ id: number; name: string; rating: number }>;
  onFilterChange?: (filters: any) => void;
  onSort: (sortOption: string) => void;
}

export default function MobileActionBar({
  onFilterChange,
  onSort,
}: MobileActionBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('default');

  const handleSort = (option: string) => {
    setSortOption(option);
    onSort(option);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3 flex justify-between items-center lg:hidden shadow-lg">
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex-1 mr-2 border-gray-300">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-xl">
          <div className="h-full overflow-hidden">
            <FilterSidebar onFilterChange={onFilterChange} isMobile={true} />
          </div>
        </SheetContent>
      </Sheet>

      <SortDropdown onSort={handleSort} />
    </div>
  );
}
