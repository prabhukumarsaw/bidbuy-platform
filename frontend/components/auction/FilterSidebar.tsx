'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/use-debounce';
import {
  useCategories,
  useSellers,
  AuctionFilters,
} from '@/hooks/useBackground';

interface FilterSidebarProps {
  onFilterChange?: (filters: AuctionFilters) => void;
}

interface FilterState extends AuctionFilters {
  activeFilters: string[];
  selectedPricePreset: string | null;
}

const PRICE_PRESETS = [
  { label: 'Under $5,000', value: 'under-5k', range: [0, 5000] },
  { label: '$5,000 - $10,000', value: '5k-10k', range: [5000, 10000] },
  { label: '$10,000 - $15,000', value: '10k-15k', range: [10000, 15000] },
  { label: 'Over $15,000', value: 'over-15k', range: [15000, 20000] },
];

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: sellers, isLoading: isSellersLoading } = useSellers();

  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFilters = localStorage.getItem('auctionFilters');
        return savedFilters
          ? JSON.parse(savedFilters)
          : {
              search: '',
              categoryId: '',
              sellerId: '',
              activeFilters: [],
              selectedPricePreset: null,
            };
      } catch (error) {
        console.error('Failed to load filters from localStorage:', error);
        return {
          search: '',
          categoryId: '',
          sellerId: '',
          activeFilters: [],
          selectedPricePreset: null,
        };
      }
    }
    return {
      search: '',
      categoryId: '',
      sellerId: '',
      activeFilters: [],
      selectedPricePreset: null,
    };
  });

  // Debounce the filters
  const debouncedFilters = useDebounce(filters, 300);

  // Save filters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('auctionFilters', JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to save filters to localStorage:', error);
    }
  }, [filters]);

  // Trigger onFilterChange when debouncedFilters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(debouncedFilters);
    }
  }, [debouncedFilters, onFilterChange]);

  const handleFilterChange = useCallback(
    (type: keyof FilterState, value: any) => {
      setFilters((prevFilters) => {
        let updatedFilters: FilterState = { ...prevFilters };

        switch (type) {
          case 'search':
            updatedFilters.search = value;
            break;
          case 'minPrice':
          case 'maxPrice':
            if (value !== undefined && value !== null && value !== '') {
              updatedFilters[type] = value;
            } else {
              delete updatedFilters[type];
            }
            updatedFilters.selectedPricePreset = null;
            break;
          case 'selectedPricePreset':
            const preset = PRICE_PRESETS.find((p) => p.value === value);
            if (preset) {
              updatedFilters.minPrice = preset.range[0];
              updatedFilters.maxPrice = preset.range[1];
              updatedFilters.selectedPricePreset = value;
            }
            break;
          case 'categoryId':
          case 'sellerId':
            updatedFilters[type] = updatedFilters[type] === value ? '' : value;
            break;
          default:
            updatedFilters[type] = value;
        }

        // Update active filters
        updatedFilters.activeFilters = Object.entries(updatedFilters)
          .filter(
            ([key, value]) =>
              value !== '' &&
              key !== 'activeFilters' &&
              key !== 'selectedPricePreset'
          )
          .map(([key, value]) => {
            if (key === 'categoryId' && categories?.categories) {
              const category = categories.categories.find(
                (cat) => cat.id === value
              );
              return `${key}: ${category ? category.name : value}`;
            }
            return `${key}: ${value}`;
          });

        return updatedFilters;
      });
    },
    [categories]
  );
  const removeFilter = (filterLabel: string) => {
    const [type, value] = filterLabel.split(': ');
    handleFilterChange(type as keyof FilterState, '');
  };

  const clearAllFilters = () => {
    const resetFilters: FilterState = {
      search: '',
      categoryId: '',
      sellerId: '',
      activeFilters: [],
      selectedPricePreset: null,
    };
    setFilters(resetFilters);
    try {
      localStorage.removeItem('auctionFilters');
    } catch (error) {
      console.error('Failed to clear filters from localStorage:', error);
    }
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  if (isCategoriesLoading || isSellersLoading) {
    return <div>Loading filters...</div>;
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
      <div className="sticky top-4">
        <h2 className="text-xl font-semibold mb-6">Filters</h2>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search auctions..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            aria-label="Search auctions"
          />
        </div>

        {/* Active Filters */}
        {filters.activeFilters.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Active Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs hover:bg-destructive/10 hover:text-destructive"
                aria-label="Clear all filters"
              >
                Clear all
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="flex items-center gap-1 hover:bg-destructive/10"
                >
                  {filter}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeFilter(filter)}
                    aria-label={`Remove filter: ${filter}`}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Price Range Quick Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Price Range</h3>
          <div className="grid grid-cols-2 gap-2">
            {PRICE_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                className={`text-xs ${
                  filters.selectedPricePreset === preset.value
                    ? 'bg-primary text-primary-foreground'
                    : ''
                }`}
                onClick={() =>
                  handleFilterChange('selectedPricePreset', preset.value)
                }
                aria-label={`Set price range to ${preset.label}`}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        <Accordion
          type="multiple"
          defaultValue={['categories', 'sellers', 'price']}
          className="space-y-4"
        >
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm font-medium">
              Categories
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {categories?.categories?.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.categoryId === category.id}
                      onCheckedChange={() =>
                        handleFilterChange('categoryId', category.id)
                      }
                      aria-label={`Filter by ${category.name}`}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger className="text-sm font-medium">
              Custom Price Range
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <Slider
                  min={0}
                  max={900000}
                  step={100}
                  value={[filters.minPrice || 0, filters.maxPrice || 900000]} // Use defaults for display only
                  onValueChange={(value) => {
                    handleFilterChange('minPrice', value[0]);
                    handleFilterChange('maxPrice', value[1]);
                  }}
                  className="mt-6"
                  aria-label="Custom price range slider"
                />
                <div className="flex justify-between mt-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Min Price
                    </span>
                    <span className="font-medium">
                      ${(filters.minPrice || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-sm text-muted-foreground">
                      Max Price
                    </span>
                    <span className="font-medium">
                      ${(filters.maxPrice || 900000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sellers">
            <AccordionTrigger className="text-sm font-medium">
              Sellers
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {Array.isArray(sellers) && sellers.length > 0 ? (
                  sellers.map((seller) => (
                    <div
                      key={seller.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`seller-${seller.id}`}
                        checked={filters.sellerId === seller.id.toString()}
                        onCheckedChange={() =>
                          handleFilterChange('sellerId', seller.id.toString())
                        }
                        aria-label={`Filter by ${seller.businessName}`}
                      />
                      <Label
                        htmlFor={`seller-${seller.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {seller.businessName}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No sellers available
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
