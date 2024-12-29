'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { DataTable as BaseDataTable, Column } from './table';
import { DataTablePagination } from './pagination';
import { DataTableToolbar } from './toolbar';
import { Select } from '@/components/ui/select';

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  pageSizeOptions?: number[];
  searchable?: boolean;
  searchField?: keyof T;
  onRowClick?: (row: T) => void;
  toolbar?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  searchable = true,
  searchField,
  onRowClick,
  toolbar,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    if (!searchable || !searchValue || !searchField) return data;

    return data.filter((item) => {
      const value = String(item[searchField]).toLowerCase();
      return value.includes(searchValue.toLowerCase());
    });
  }, [data, searchValue, searchable, searchField]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    const end = start + currentPageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, currentPageSize]);

  const totalPages = Math.ceil(sortedData.length / currentPageSize);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setCurrentPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(
    (column: keyof T) => {
      setSortDirection(
        sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
      );
      setSortColumn(column);
    },
    [sortColumn, sortDirection]
  );

  const customToolbar = useMemo(() => {
    if (toolbar) return toolbar;
    if (searchable && searchField) {
      return (
        <DataTableToolbar
          searchValue={searchValue}
          onSearch={setSearchValue}
          placeholder={`Search by ${String(searchField)}...`}
        />
      );
    }
    return null;
  }, [toolbar, searchable, searchField, searchValue]);

  return (
    <div className="space-y-4">
      {customToolbar}
      <BaseDataTable
        columns={columns}
        data={paginatedData}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onRowClick={onRowClick}
      />
      <div className="flex items-center justify-between">
        <Select
          value={String(currentPageSize)}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={String(size)}>
              Show {size}
            </option>
          ))}
        </Select>
        {totalPages > 1 && (
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
