import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortDropdownProps {
  onSort: (sortOption: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSort }) => {
  const handleSortChange = (value: string) => {
    onSort(value);
  };

  return (
    <Select onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt:desc">Newest</SelectItem>
        <SelectItem value="createdAt:asc">Oldest</SelectItem>
        <SelectItem value="currentPrice:asc">Price: Low to High</SelectItem>
        <SelectItem value="currentPrice:desc">Price: High to Low</SelectItem>
        <SelectItem value="endTime:asc">Ending Soon</SelectItem>
        <SelectItem value="startTime:desc">Recently Started</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortDropdown;
