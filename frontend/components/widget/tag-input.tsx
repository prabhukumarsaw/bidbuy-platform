'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';

interface TagInputProps {
  placeholder?: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
}

export function TagInput({
  placeholder = 'Add tag...',
  tags,
  setTags,
  suggestions = [],
  maxTags = 10,
}: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const handleAddTag = (value: string) => {
    const normalizedValue = value.trim().toLowerCase();
    if (
      normalizedValue !== '' &&
      !tags.includes(normalizedValue) &&
      tags.length < maxTags
    ) {
      setTags([...tags, normalizedValue]);
      setInputValue('');
      setIsOpen(false);
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="border rounded-lg p-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {tag}
            <button
              type="button"
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => handleRemoveTag(index)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove tag</span>
            </button>
          </Badge>
        ))}
        <CommandPrimitive
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag(inputValue);
            }
            if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
              e.preventDefault();
              handleRemoveTag(tags.length - 1);
            }
          }}
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            placeholder={
              tags.length < maxTags ? placeholder : `Maximum ${maxTags} tags`
            }
            disabled={tags.length >= maxTags}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] disabled:cursor-not-allowed"
          />
        </CommandPrimitive>
      </div>
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute w-full z-10 top-[100%] mt-2">
          <Command className="rounded-lg border shadow-md">
            <CommandGroup>
              {filteredSuggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion}
                  onSelect={() => handleAddTag(suggestion)}
                  className="cursor-pointer"
                >
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
}
