import HeaderBanner from './HeaderBanner';
import FilterSidebar from './FilterSidebar';
import { ReactNode } from 'react';
import { AuctionItem, Category } from '@/types/types';

interface LayoutProps {
  children: ReactNode;
  categories: Category[];
  conditions: string[];
  sellers: Array<{ id: number; name: string; rating: number }>;
  onFilterChange?: (filters: any) => void;
}

export default function Layout({ children, onFilterChange }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block w-80 fixed left-0 top-0 bottom-0 h-screen overflow-hidden border-r border-gray-200 z-30">
        <FilterSidebar onFilterChange={onFilterChange} />
      </div>
      <main className="flex-1 lg:ml-80">
        <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
