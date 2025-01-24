import type React from 'react';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Search,
  Save,
  Trash,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FilterSidebar({
  onFilterChange,
}: {
  onFilterChange?: (filters: any) => void;
}) {
  const {
    filters,
    setFilter,
    clearFilters,
    removeFilter,
    saveFilterPreset,
    loadFilterPreset,
    deleteFilterPreset,
    categories,
    sellers,
    isLoading,
  } = useAdvancedFilters();

  const [presetName, setPresetName] = useState('');

  const activeFiltersWithLabels = useMemo(() => {
    return filters.activeFilters.map((filter) => {
      if (filter.startsWith('categoryId')) {
        const categoryId = filter.split(':')[1].trim();
        const category = categories.find((cat) => cat.id === categoryId);
        return {
          id: filter,
          label: `Category: ${category?.name}`,
        };
      } else if (filter.startsWith('sellerId')) {
        const sellerId = filter.split(':')[1].trim();
        const seller = sellers.find((sel) => sel.id.toString() === sellerId);
        return {
          id: filter,
          label: `Seller: ${seller?.businessName || sellerId}`,
        };
      } else if (filter.startsWith('priceRange')) {
        const [minPrice, maxPrice] = filter.split(':')[1].split('-');
        return { id: filter, label: `Price: $${minPrice} - $${maxPrice}` };
      } else {
        return { id: filter, label: filter };
      }
    });
  }, [filters.activeFilters, categories, sellers]);

  const handlePriceRangeChange = useCallback(
    (value: number[]) => {
      setFilter('minPrice', value[0]);
      setFilter('maxPrice', value[1]);
    },
    [setFilter]
  );

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setFilter('categoryId', categoryId);
    },
    [setFilter]
  );

  const handleSellerChange = useCallback(
    (sellerId: string) => {
      setFilter('sellerId', sellerId);
    },
    [setFilter]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter('search', e.target.value);
    },
    [setFilter]
  );

  const handleSavePreset = useCallback(() => {
    if (presetName) {
      saveFilterPreset(presetName);
      setPresetName('');
    }
  }, [presetName, saveFilterPreset]);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  return (
    <div
      className={`bg-white rounded-lg shadow-lg min-h-screen overflow-hidden transition-all duration-300 w-80`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className={`text-xl font-semibold block`}>Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="min-h-screen">
        <div className="p-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search auctions..."
              className="pl-9 pr-4 py-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search || ''}
              onChange={handleSearchChange}
              aria-label="Search auctions"
            />
          </div>

          <AnimatePresence>
            {activeFiltersWithLabels.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-gray-50 p-3 rounded-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Active Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    Clear all
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFiltersWithLabels.map((filter) => (
                    <Badge
                      key={filter.id}
                      variant="secondary"
                      className="flex items-center gap-1 bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      {filter.label}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeFilter(filter.id)}
                      />
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Accordion
            type="multiple"
            defaultValue={['price', 'categories', 'sellers']}
            className="space-y-4"
          >
            <AccordionItem
              value="price"
              className="border-b border-gray-200 pb-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="text-lg font-semibold text-gray-700">
                  Price Range
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Slider
                  min={0}
                  max={1000000}
                  step={1000}
                  value={[filters.minPrice || 0, filters.maxPrice || 1000000]}
                  onValueChange={handlePriceRangeChange}
                  className="mb-4"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>${filters.minPrice || 0}</span>
                  <span>${filters.maxPrice || 1000000}</span>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="categories"
              className="border-b border-gray-200 pb-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="text-lg font-semibold text-gray-700">
                  Categories
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.categoryId === category.id}
                          onCheckedChange={() =>
                            handleCategoryChange(category.id)
                          }
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="text-sm cursor-pointer text-gray-700 hover:text-gray-900"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="sellers"
              className="border-b border-gray-200 pb-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="text-lg font-semibold text-gray-700">
                  Sellers
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sellers.map((seller) => (
                      <div
                        key={seller.id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`seller-${seller.id}`}
                          checked={filters.sellerId === seller.id.toString()}
                          onCheckedChange={() =>
                            handleSellerChange(seller.id.toString())
                          }
                        />
                        <Label
                          htmlFor={`seller-${seller.id}`}
                          className="text-sm cursor-pointer text-gray-700 hover:text-gray-900"
                        >
                          {seller.businessName}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Filter Presets
            </h3>
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="flex-grow"
              />
              <Button
                onClick={handleSavePreset}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
            <AnimatePresence>
              {Object.keys(filters.filterPresets).map((preset) => (
                <motion.div
                  key={preset}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between mb-2"
                >
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left hover:bg-gray-100"
                    onClick={() => loadFilterPreset(preset)}
                  >
                    {preset}
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFilterPreset(preset)}
                          className="hover:bg-red-100 hover:text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Preset</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
