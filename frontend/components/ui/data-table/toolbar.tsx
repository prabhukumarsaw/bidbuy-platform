'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';

interface ToolbarProps {
  searchValue: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function DataTableToolbar({
  searchValue,
  onSearch,
  placeholder = 'Search...',
}: ToolbarProps) {
  return (
    <div className="flex items-center space-x-2 py-4">
      <div className="relative flex-1 max-w-sm">
        <Icons.search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}
