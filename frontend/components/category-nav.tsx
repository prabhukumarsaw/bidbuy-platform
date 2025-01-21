'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Icons } from './icons';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';

export default function CategoryNavPage() {
  const { categories, setFilter } = useAdvancedFilters();
  const router = useRouter();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categoryId: string) => {
    setFilter('categoryId', categoryId);
    router.push('/auction');
  };

  return (
    <div className={cn('border-t')}>
      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto whitespace-nowrap scroll-smooth py-2 px-4 bg-secondary dark:bg-secondary"
        style={{
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
        }}
      >
        {/* Hide scrollbar for Chrome/Safari */}
        <style jsx>{`
          .flex::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <NavigationMenu className="max-w-none">
          <NavigationMenuList className="flex space-x-4">
            {categories.map((category) => (
              <NavigationMenuItem key={category.id} className="flex-shrink-0">
                <Link href="/auction" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'h-8 px-3 lg:px-4 text-foreground text-sm font-semibold transition-colors rounded-3xl flex items-center'
                    )}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.icon ? (
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="w-4 h-4 mr-2"
                      />
                    ) : (
                      <Icons.play className="w-4 h-4 mr-2" />
                    )}
                    {category.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
