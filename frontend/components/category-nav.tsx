'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';

const springTransition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

export default function CategoryNavPage() {
  const { categories, setFilter } = useAdvancedFilters();
  const router = useRouter();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  const selectCategory = React.useCallback(
    (categoryId: string) => {
      setSelectedCategory((prev) => {
        const newSelection = prev === categoryId ? null : categoryId;

        // Apply filter immediately
        if (newSelection) {
          setFilter('categoryId', newSelection);
        } else {
          setFilter('categoryId', null);
        }

        // Navigate to auction page
        router.push('/auction');

        return newSelection;
      });
    },
    [setFilter, router]
  );

  return (
    <div className="border-t bg-white shadow-sm category-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto whitespace-nowrap scroll-smooth py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            .flex::-webkit-scrollbar {
              display: none;
            }
            @media (min-width: 1024px) {
              .category-container {
                justify-content: center;
              }
            }
          `}</style>

          <motion.div
            className="flex space-x-2 mx-auto"
            layout
            transition={springTransition}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => selectCategory(category.id)}
                  layout
                  initial={false}
                  animate={{
                    backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                    borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
                  }}
                  whileHover={{
                    backgroundColor: isSelected ? '#e0f2fe' : '#f9fafb',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    ...springTransition,
                    backgroundColor: { duration: 0.1 },
                  }}
                  className={cn(
                    'h-9 px-3 text-sm font-medium transition-colors rounded-full flex items-center',
                    'border focus:outline-none focus:ring-2 focus:ring-blue-300',
                    isSelected ? 'text-blue-600' : 'text-gray-700'
                  )}
                >
                  <motion.div
                    className="relative flex items-center"
                    animate={{
                      paddingRight: isSelected ? '1.5rem' : '0',
                    }}
                    transition={{
                      ease: [0.175, 0.885, 0.32, 1.275],
                      duration: 0.3,
                    }}
                  >
                    {category.icon && (
                      <img
                        src={category.icon || '/placeholder.svg'}
                        alt=""
                        className="w-4 h-4 mr-2 object-contain"
                      />
                    )}
                    <span>{category.name}</span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={springTransition}
                          className="absolute right-0"
                        >
                          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check
                              className="w-3 h-3 text-white"
                              strokeWidth={3}
                            />
                          </div>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
