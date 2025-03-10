import HeaderBanner from './HeaderBanner';
import FilterSidebar from './FilterSidebar';
import { ReactNode } from 'react';
import { AuctionItem, Category } from '@/types/types';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface LayoutProps {
  children: ReactNode;
  categories: Category[];
  conditions: string[];
  sellers: Array<{ id: number; name: string; rating: number }>;
  onFilterChange?: (filters: any) => void;
  onSidebarToggle?: () => void;
}

export default function Layout({ children, onFilterChange }: LayoutProps) {
  return (
    <SidebarProvider>
      <FilterSidebar onFilterChange={onFilterChange} />
      <SidebarInset className="flex-1 px-4">
        <HeaderBanner
          title={'Browse Assets'}
          subtitle={'Find the perfect asset for your next project'}
          bgImage={'hello'}
        />
        <main className="container mx-auto  py-4 pb-24 lg:pb-8 min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
