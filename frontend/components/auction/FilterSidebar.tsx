'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface FilterSidebarProps {
  categories: string[];
  conditions: string[];
  sellers: Array<{ id: number; name: string; rating: number }>;
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
  conditions: string[];
  sellers: number[];
  priceRange: [number, number];
}

export default function FilterSidebar({
  categories,
  conditions,
  sellers,
  onFilterChange,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    conditions: [],
    sellers: [],
    priceRange: [0, 20000],
  });

  const handleFilterChange = (
    type: keyof FilterState,
    value: string | number | [number, number]
  ) => {
    let updatedFilters: FilterState;

    if (type === 'priceRange') {
      updatedFilters = { ...filters, [type]: value };
    } else {
      const currentValues = filters[type] as (string | number)[];
      updatedFilters = {
        ...filters,
        [type]: currentValues.includes(value as string | number)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    }

    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  return (
    <div className=" bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-9" />
      </div>
      <Accordion
        type="multiple"
        defaultValue={['categories', 'conditions', 'sellers', 'price']}
        className="space-y-4"
      >
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            {categories.map((category) => (
              <div key={category} className="flex items-center mb-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() =>
                    handleFilterChange('categories', category)
                  }
                />
                <Label htmlFor={`category-${category}`} className="ml-2">
                  {category}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="conditions">
          <AccordionTrigger>Condition</AccordionTrigger>
          <AccordionContent>
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center mb-2">
                <Checkbox
                  id={`condition-${condition}`}
                  checked={filters.conditions.includes(condition)}
                  onCheckedChange={() =>
                    handleFilterChange('conditions', condition)
                  }
                />
                <Label htmlFor={`condition-${condition}`} className="ml-2">
                  {condition}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sellers">
          <AccordionTrigger>Sellers</AccordionTrigger>
          <AccordionContent>
            {sellers.map((seller) => (
              <div key={seller.id} className="flex items-center mb-2">
                <Checkbox
                  id={`seller-${seller.id}`}
                  checked={filters.sellers.includes(seller.id)}
                  onCheckedChange={() =>
                    handleFilterChange('sellers', seller.id)
                  }
                />
                <Label htmlFor={`seller-${seller.id}`} className="ml-2">
                  {seller.name} ({seller.rating})
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <Slider
              min={0}
              max={20000}
              step={100}
              value={filters.priceRange}
              onValueChange={(value) =>
                handleFilterChange('priceRange', value as [number, number])
              }
            />
            <div className="flex justify-between mt-2">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
