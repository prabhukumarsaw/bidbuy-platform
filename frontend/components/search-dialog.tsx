'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const suggestions = [
    'Antique Furniture',
    'Vintage Watches',
    'Art Deco',
    'Classic Cars',
    'Rare Coins',
    'Fine Art',
  ];

  const categories = [
    { icon: '🎨', name: 'Art' },
    { icon: '💎', name: 'Jewelry' },
    { icon: '🚗', name: 'Vehicles' },
    { icon: '📚', name: 'Books' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="center"
        className="h-screen w-[500px] pt-9 sm:w-[540px] border-0 bg-background/95 backdrop-blur-sm"
      >
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search auctions..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </SheetHeader>
        <div className="grid gap-6 px-1 py-6">
          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              SUGGESTED SEARCHES
            </h3>
            <div className="grid gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  className="justify-start text-base"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              BROWSE BY CATEGORY
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
