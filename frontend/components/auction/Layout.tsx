import HeaderBanner from './HeaderBanner';
import FilterSidebar from './FilterSidebar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  categories: string[];
  conditions: string[];
  sellers: Array<{ id: number; name: string; rating: number }>;
}

export default function Layout({
  children,
  categories,
  conditions,
  sellers,
}: LayoutProps) {
  return (
    <div className="min-h-screen mx-auto bg-gray-50">
      <HeaderBanner
        title="Live Bid"
        subtitle="Comprehensive to Products"
        bgImage="/feature/fourm.avif" // Replace with your actual image path
      />
      <div className="container px-2 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden md:block w-full lg:w-1/4 xl:w-1/5">
            <FilterSidebar
              categories={categories}
              conditions={conditions}
              sellers={sellers}
            />
          </aside>
          <main className="w-full lg:w-3/4 xl:w-4/5">{children}</main>
        </div>
      </div>
    </div>
  );
}
