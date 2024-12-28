'use client';

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

export default function SortDropdown({ onSort }: SortDropdownProps) {
  return (
    <Select onValueChange={onSort}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="time-asc">Time Left: Ending Soon</SelectItem>
        <SelectItem value="time-desc">Time Left: Newly Listed</SelectItem>
      </SelectContent>
    </Select>
  );
}
