import { useState } from 'react';

import SortDropdown from './SortDropdown';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { Button } from '../ui/button';

interface MobileActionBarProps {
  onFilterChange?: (filters: any) => void;
  onSort: (sortOption: string) => void;
}

export default function MobileActionBar({
  onFilterChange,
  onSort,
}: MobileActionBarProps) {
  const [sortOption, setSortOption] = useState<string>('default');
  const { toggleSidebar } = useSidebar();

  const handleSort = (option: string) => {
    setSortOption(option);
    onSort(option);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-50 border-t border-gray-200 p-3 flex justify-evenly items-center lg:hidden shadow-lg">
      {/* <SidebarTrigger className="-ml-1" /> */}
      <Button variant="outline" onClick={toggleSidebar}>
        Filter
      </Button>
      <SortDropdown onSort={handleSort} />
    </div>
  );
}
