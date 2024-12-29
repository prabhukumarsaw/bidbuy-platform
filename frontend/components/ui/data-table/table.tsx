'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icons } from '@/components/icons';

export interface Column<T> {
  accessorKey: keyof T;
  header: string;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (column: keyof T) => void;
  sortColumn?: keyof T | null;
  sortDirection?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  onSort,
  sortColumn,
  sortDirection,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.accessorKey)}
                className={column.sortable ? 'cursor-pointer select-none' : ''}
                onClick={() =>
                  column.sortable && onSort && onSort(column.accessorKey)
                }
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable &&
                    (sortColumn === column.accessorKey ? (
                      sortDirection === 'asc' ? (
                        <Icons.arrowUp className="h-4 w-4" />
                      ) : (
                        <Icons.arrowDown className="h-4 w-4" />
                      )
                    ) : (
                      <Icons.arrowUpDown className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            >
              {columns.map((column) => (
                <TableCell key={String(column.accessorKey)}>
                  {column.cell
                    ? column.cell({ row: { original: row } })
                    : String(row[column.accessorKey])}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
