'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { useLocationContext } from '@/contexts/LocationContext';
import { cn } from '@/lib/utils';

const locations = [
  { value: 'new-york', label: 'New York' },
  { value: 'los-angeles', label: 'Los Angeles' },
  { value: 'chicago', label: 'Chicago' },
  { value: 'houston', label: 'Houston' },
  { value: 'phoenix', label: 'Phoenix' },
  { value: 'philadelphia', label: 'Philadelphia' },
  { value: 'san-antonio', label: 'San Antonio' },
  { value: 'san-diego', label: 'San Diego' },
  { value: 'dallas', label: 'Dallas' },
  { value: 'san-jose', label: 'San Jose' },
];

export function LocationSelector() {
  const [open, setOpen] = React.useState(false);
  const { location, setLocation } = useLocationContext();

  const handleSelect = React.useCallback(
    (value: string) => {
      setLocation(value);
      setOpen(false);
    },
    [setLocation]
  );

  const handleGPSLocation = React.useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Here you would typically send these coordinates to your backend
          // to get the nearest location. For this example, we'll just set a dummy value.
          setLocation('gps-location');
          setOpen(false);
        },
        (error) => {
          console.error('Error getting location: ', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, [setLocation]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-background border-transparent hidden md:flex"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {location
            ? locations.find((l) => l.value === location)?.label
            : 'Select location'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search location..." className="h-9" />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={handleGPSLocation} className="text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                Use current location
              </CommandItem>
            </CommandGroup>
            <CommandGroup>
              {locations.map((loc) => (
                <CommandItem
                  key={loc.value}
                  onSelect={() => handleSelect(loc.value)}
                  className="text-sm"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      location === loc.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {loc.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
