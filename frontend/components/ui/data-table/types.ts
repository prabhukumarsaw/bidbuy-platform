import { ReactNode } from 'react';

export interface Column<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (props: { row: { original: T } }) => ReactNode;
  sortable?: boolean;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

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
