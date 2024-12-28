'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { LocationSelector } from './LocationSelector';

// Mock API call for search suggestions
const fetchSearchSuggestions = async (query: string): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (!query) return [];
  return [
    `Search for "${query}"`,
    `Explore ${query} auctions`,
    `Find ${query} items`,
    `${query} in categories`,
    `Popular ${query} searches`,
  ];
};

export function FloatingSearchBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (debouncedQuery) {
      fetchSearchSuggestions(debouncedQuery)
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleSearch = (suggestion: string) => {
    console.log(`Searching for: ${suggestion}`);
    setQuery(suggestion);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1" ref={searchRef} aria-expanded={isOpen}>
          <div className="flex items-center border border-gray-300 rounded-md bg-background">
            <div className="flex-none hidden sm:flex">
              <LocationSelector />
            </div>
            <div className="h-6 w-px bg-border mx-1" />
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-8 pr-10"
                placeholder="Search for furniture, clothes or wines..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search"
              />
              {query && (
                <Button
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {isOpen && suggestions.length > 0 && (
            <div
              className={cn(
                'absolute mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md z-50',
                'animate-in fade-in-0 zoom-in-95'
              )}
              aria-live="polite"
            >
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSearch(suggestion)}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>{suggestion}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
